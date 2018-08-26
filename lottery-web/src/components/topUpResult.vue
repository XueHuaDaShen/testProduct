/* 充值结果 */
<template>
  <div class="order-detail-wrap content">
    <user-menu></user-menu>
    <div class="main" v-loading="prompt.loading" :element-loading-text="prompt.loadingText" :element-loading-spinner="prompt.icon" :element-loading-background="prompt.background">
      <div class="top-up-container">
        <div class="result-title" v-if="topUpWayActive == 1">
          <i class="title-icon"></i>
          <h1 class="title-exp">请开启微信扫码，支付成功后请返回主页。</h1>
        </div>
        <div class="result-title" v-if="topUpWayActive == 2">
          <i class="title-icon"></i>
          <h1 class="title-exp">请开启微信扫码，支付成功后请返回主页。</h1>
        </div>
        <div class="result-title" v-if="topUpWayActive == 3">
          <i class="title-icon"></i>
          <h1 class="title-exp">请开启银联扫码，支付成功后请返回主页。</h1>
        </div>
        <div class="result-wrap" v-if="!payResult.visible">
          <div class="wrap-order"></div>
          <div class="wrap-amount">
            &yen;
            <span>{{result.amount}}</span>元
          </div>
          <div class="wrap-image">
            <img v-bind:src="result.qr_code" />
          </div>
          <div class="wrap-order-detail">
            <dl>
              <dt>交易账户</dt>
              <dd>{{result.account_no}}</dd>
              <dt>交易订单号</dt>
              <dd>{{result.order_no}}</dd>
            </dl>
          </div>
          <div class="wrap-tip" v-if="topUpWayActive == 1">
            <img src='../assets/img/topUp/saomiao.png' />
            <p>用微信支付扫一扫
              <br/>扫描二维码完成支付</p>
          </div>
          <div class="wrap-tip" v-if="topUpWayActive == 2">
            <img src='../assets/img/topUp/saomiao.png' />
            <p>用支付宝钱包扫一扫
              <br/>扫描二维码完成支付</p>
          </div>
          <div class="wrap-tip" v-if="topUpWayActive == 3">
            <img src='../assets/img/topUp/saomiao.png' />
            <p>用银联扫一扫
              <br/>扫描二维码完成支付</p>
          </div>
        </div>
        <div class="result-wrap" v-if="payResult.visible">
          充值成功
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from "../axios/axios";
  import * as validator from "../lib/utils/validator";
  import paramCryptFn from '../lib/cryptData'

  export default {
    name: "topUp",
    components: {
      UserMenu
    },
    data() {
      return {
        loading: false,
        prompt: {
          loading: true,
          loadingText: "正在加载支付信息...请等待！",
          background: "rgba(0, 0, 0, 0.8)",
          icon: "el-icon-loading"
        },
        result: {
          qr_code: "",
          account_no: "",
          order_no: "",
          amount: ""
        },
        topUpWayActive: 1,
        myInterval: null,
        payResult: {
          visible: false,
          data: {}
        }
      };
    },
    methods: {
      onSubmit() {
        if (!this.form.cash_apply || this.form.cash_apply == 0) {
          this.$alert("充值金额应在[2元]至[20000元]之间", "系统提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        let self = this;
        let url = "/user/trade/recharge";
        var data = { cash_apply: self.form.cash_apply, type: self.form.type }
        this.loading = true;
        request.http(
          "post",
          url, paramCryptFn(data),
          success => {
            this.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                this.result = success.data;
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            this.loading = false;
            console.log("error", error);
          }
        );
      },
      //获取充值的方式
      //显示不同的充值图标
      getTopUpInfo() {
        if (this.$route.query != null) {
          let query = this.$route.query;
          if (query.topUpWay) {
            let topUpWay = parseInt(query.topUpWay);
            switch (topUpWay) {
              //微信
              case 1:
                this.topUpWayActive = 1;
                break;
                //支付宝
              case 2:
                this.topUpWayActive = 2;
                break;
                //银联
              case 3:
                this.topUpWayActive = 3;
                break;
            }
          }
          if (query.qr_code && query.account_no && query.order_no) {
            this.result.qr_code = query.qr_code;
            this.result.account_no = query.account_no;
            this.result.order_no = query.order_no;
            this.result.amount = query.amount;
          }
        }
        // this.getPayResult(this.result.order_no);
      },
      // 定时获取支付结果
      getNewAnnouncement() {
        this.myInterval = setInterval(this.getPayResult(), 60 * 60 * 1000);
      },
      //获取支付结果
      getPayResult(order_no) {
        let self = this;
        let url = "/notice/list";
        /* this.announcement.hidden = true; */
        /* request.http(
          "get",
          url,
          {
            pagenum: self.pageIndex,
            pagesize: self.pageSize
          },
          success => {
            if (success.returncode) {
              if (success.returncode == 103) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.announcement.num = success.data.total;
                if (self.announcement.num) {
                  self.announcement.hidden = false;
                  self.announcement.data = success.data.data;
                } else {
                  self.announcement.hidden = true;
                }
              }
            }
          },
          error => {
            self.announcement.hidden = true;
            self.announcement.data = [];
            console.log("数据异常", error);
          }
        ); */
      }
    },
    watch: {
      "form.cash_apply" (newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (!validator.positiveInt(newValue)) {
              this.form.cash_apply = 0;
            }
          }
        }
      }
    },
    mounted() {
      let self = this;
      setTimeout(function() {
        self.prompt.loading = false;
        self.getTopUpInfo();
      }, 1000);
    },
    destroyed() {
      // clearInterval(this.myInterval);
    }
  };
</script>

<style scoped>
  .result-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #ddd;
    background: #fff;
  }

  .result-title .title-exp {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  .result-wrap {
    width: 610px;
    padding: 0 135px;
    margin: 0 auto;
    margin-top: 15px;
    background: #fff;
    text-align: center;
    color: #333;
    border: 1px solid #e5e5e5;
    border-top: none;
  }

  .result-wrap .wrap-amount {
    font-size: 38px;
    padding-top: 30px;
    text-align: center;
  }

  .result-wrap .wrap-image {
    margin-top: 30px;
    text-align: center;
  }

  .result-wrap .wrap-image>img {
    display: inline-block;
    width: 280px;
    height: 270px;
  }

  .result-wrap .wrap-order-detail {
    margin-top: 60px;
    padding-top: 25px;
    border-top: 1px solid #e5e5e5;
  }

  .result-wrap .wrap-order-detail dl {
    font-size: 14px;
    text-align: right;
    line-height: 28px;
  }

  .result-wrap .wrap-order-detail dl>dt {
    float: left;
  }

  .result-wrap .wrap-tip {
    margin-top: 40px;
    border-top: 1px dashed #e5e5e5;
    padding: 30px 0;
    font-size: 16px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .result-wrap .wrap-tip>img {
    width: 56px;
    height: 55px;
  }

  .text-loading {
    font-size: 16px;
    text-align: left;
    color: #333;
  }

  .mt-40 {
    margin-top: 40px;
  }

  .mt-15 {
    margin-top: 15px;
  }

  .mt-26 {
    margin-top: 26px;
  }

  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
  }

  table,
  td {
    border-collapse: collapse;
  }

  .order-detail-wrap {
    margin: 0 auto;
    position: relative;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .main {
    width: 1024px;
    float: left;
    margin-left: 2px;
    min-height: 600px;
    background: #f7f7f7;
  }

  .main .top-bar {
    width: 100%;
    height: 42px;
    text-align: left;
    line-height: 42px;
    font-size: 12px;
    color: #333;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .main>ul.top-up-way {
    transform: scale(0.333);
    float: left;
    margin-left: -805.7px;
    margin-top: -37.9px;
    display: flex;
    flex-direction: row;
    justify-content: start;
  }

  .main>ul.top-up-way>li {
    width: 402px;
    height: 111px;
    border: 1px solid #d5d5d5;
    background-image: url("../assets/img/topUp/Selected.png");
    float: left;
    cursor: pointer;
  }

  .main>ul.top-up-way>li.active {
    background-image: url("../assets/img/topUp/Unselected.png");
  }

  .main>ul.top-up-way>li.wykj {
    background-position: 0 0;
  }

  .main>ul.top-up-way>li.ylkj {
    background-position: -402px 0;
  }

  .main>ul.top-up-way>li.smcz {
    background-position: -804px 0;
  }

  .main>ul.top-up-way>li.wxcz {
    background-position: -1206px 0;
  }

  .main>ul.top-up-way>li.qqqb {
    background-position: -1608px 0;
  }

  .main>ul.top-up-way>li.zfb {
    background-position: -2010px 0;
  }

  .top-up-tip {
    height: 42px;
    background: rgba(255, 228, 200, 1);
    margin-top: 63px;
    text-align: left;
    font-size: 12px;
    line-height: 21px;
    text-indent: 16px;
    margin-bottom: 26px;
  }

  .top-up-input {
    display: inline-block;
    width: 316px;
    height: 48px;
    line-height: 48px;
    padding: 16px;
    outline: none;
    border: 1px solid #999799;
  }

  .top-up-input:focus {
    background: rgba(255, 255, 255, 1);
  }

  .top-up-container {
    text-align: left;
    min-height: 402px;
    margin-bottom: 34px;
  }

  .top-up-container .container-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-right: 20px;
    display: inline-block;
    text-align: center;
    min-width: 56px;
  }

  .top-up-submit {
    display: inline-block;
    text-align: center;
    width: 234px;
    height: 45px;
    background: rgba(212, 145, 77, 1);
    border-radius: 6px;
    line-height: 45px;
    color: #fff;
    font-size: 14px;
  }

  .top-up-container .container-row .unit {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-left: 16px;
    display: inline-block;
    text-align: center;
  }

  .top-up-container .container-row .top-up-limit {
    color: #666666;
    font-size: 12px;
    text-align: left;
  }

  .top-up-container .container-row ul.banklist {
    box-sizing: border-box;
    transform: scale(0.333);
  }

  .top-up-container .container-row ul.banklist>li {
    float: left;
    margin-right: 13px;
    margin-bottom: 9px;
    width: 480px;
    height: 132px;
    border: 1px solid #dedede;
    background-image: url("../assets/img/topUp/bank.png");
    cursor: pointer;
  }

  .top-up-container .container-row ul.banklist>li.zggs {
    background-position: 0 0;
  }

  .top-up-container .container-row ul.banklist>li.zs {
    background-position: -522px 0;
  }

  .top-up-container .container-row ul.banklist>li.zgms {
    background-position: -1044px 0;
  }

  .top-up-container .container-row ul.banklist>li.zgjs {
    background-position: -1566px 0;
  }

  .top-up-container .container-row ul.banklist>li.zgny {
    background-position: -2088px 0;
  }

  .top-up-container .container-row ul.banklist>li.zg {
    background-position: 0 -618px;
  }

  .top-up-container .container-row ul.banklist>li.gf {
    background-position: -522px -1082px;
  }

  .top-up-container .container-row ul.banklist>li.zx {
    background-position: -1044px -1082px;
  }

  .top-up-container .container-row ul.banklist>li.zggd {
    background-position: -1566px -1082px;
  }

  .top-up-container .container-row ul.banklist>li.jt {
    background-position: -2088px -1082px;
  }

  .top-up-container .container-row ul.banklist>li.zgyzcx {
    background-position: 0 -2158px;
  }

  .top-up-container .container-row ul.banklist>li.pf {
    background-position: -522px -2158px;
  }

  .top-up-container .container-row ul.banklist>li.pa {
    background-position: -1044px -2158px;
  }

  .top-up-container .container-row ul.banklist>li.xy {
    background-position: -1566px -2158px;
  }

  .top-up-container .container-row ul.banklist>li.hx {
    background-position: -2088px -2158px;
  }

  .top-up-container .container-row .wxActive {
    width: 160px;
    height: 44px;
    margin-right: 42px;
    border: 1px solid #d4914d;
    line-height: 44px;
    cursor: pointer;
    position: relative;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
    text-align: center;
    display: inline-block;
  }

  .top-up-container .container-row .wxActive::after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 24px;
    display: block;
  }

  .pay-tip {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    text-align: left;
  }

  ul.pay-way {
    margin-top: 16px;
    margin-bottom: 60px;
  }

  ul.pay-way>li {
    width: 160px;
    height: 44px;
    margin-right: 42px;
    float: left;
    border: 1px solid #dedede;
    line-height: 44px;
    cursor: pointer;
    position: relative;
  }

  ul.pay-way>li.active {
    border-color: #d4914d;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
  }

  ul.pay-way>li.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 24px;
    display: block;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>