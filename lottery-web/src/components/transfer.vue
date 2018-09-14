/* 转账 */
<template>
  <div class="order-detail-wrap content search-form">
    <user-menu></user-menu>
    <div class="main" v-loading="loading">
      <div class="top-bar">
        <span>当前位置：</span>
        <span>资金管理</span>
        <i class="iconfont icon-Right"></i>
        <span>转账</span>
      </div>
      <div class="project-content">
        <ul class="tabs">
          <li class="tab-title">
            <router-link :to="{ name:'topUp'}">充值</router-link>
          </li>
          <li class="tab-title ">
            <router-link :to="{ name:'withdraw'}">提现</router-link>
          </li>
          <li class="tab-title active">
            <router-link :to="{ name:'transfer'}">转账</router-link>
          </li>
          <li class="tab-title ">
            <router-link :to="{ name:'transform'}">额度转换</router-link>
          </li>
        </ul>
        <!-- 转账 Start -->
        <div class="wrap-inner">
          <div class="inner-pay-title mb-30">
            转账
          </div>
          <hr class="user-split-line mb-20">
          <div class="container-inner table-xinxi item">
            <div class="time-row mb-20">
              <span class="exp">账号余额：</span>
              <span class="con">&yen;&nbsp;{{getBlance}}</span>
            </div>
            <div class="time-row mb-20">
              <span class="exp">收款账户：</span>
              <el-input type="text" class="con" v-model="transferForm.loginname" clearable placeholder="请输入收款账户" />
            </div>
            <div class="time-row mb-20">
              <span class="exp">转账金额：</span>
              <el-input type="number" class="con" v-model="transferForm.cash" clearable placeholder="请输入转账金额" />
            </div>
            <div class="time-row ">
              <span class="exp">确认资金密码：</span>
              <el-input type="password" class="con" v-model="transferForm.input_cash_psd" clearable placeholder="输入资金密码" />
            </div>
          </div>
          <div class="submit-line">
            <a class="submit" type="submit" @click="validatorCashPsd()">确认转账</a>
          </div>
        </div>
        <!-- 转账 End -->
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
    name: "withdraw",
    components: {
      UserMenu
    },
    data() {
      return {
        loading: false,
        result: {},
        transferForm: {
          loginname: '', // 收款账户
          cash: '', // 转账金额
          input_cash_psd: "",
        },
        blance: "",
        isSetBankPsd: 0,
      };
    },
    methods: {
      //用户是否设置资金密码
      isSetBankPassword() {
        let self = this;
        request.http('get', '/user/bankcard/password/isSet', {},
          (success) => {
            if (success.returncode == 200) {
              self.isSetBankPsd = success.data.isSet;
              if (!self.isSetBankPsd) {
                self.$alert('<div class="lottery-title">您未设置资金密码，请设置资金密码</div>', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.$router.push({ name: "password" });
                  }
                })
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      },
      postTransfer() {
        let self = this;
        let url = "/user/trade/transfer";
        var data = {
          transfer_cash: self.transferForm.cash,
          transfer_loginname: self.transferForm.loginname
        }
        this.loading = true;
        request.http(
          "post",
          url,
          paramCryptFn(data),
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.result = success.data;
                self.$alert('<div class="lottery-title">转账成功</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    localStorage.setItem("blance", success.data.cash);
                    self.$store.dispatch('setBlance', success.data.cash);
                    self.$router.push({
                      name: "mytransfer",
                    });
                  }
                })
              } else if (success.returncode == 301) {
                self.result = success.data;
                self.$alert('<div class="lottery-title">参数错误</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.$router.push({
                      name: "mytransfer",
                    });
                  }
                })
              } else if (success.returncode == 401) {
                self.result = success.data;
                self.$alert('<div class="lottery-title">账户余额不足，无法转账</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.$router.push({
                      name: "mytransfer",
                    });
                  }
                })
              } else if (success.returncode == 500) {
                self.result = success.data;
                self.$alert('<div class="lottery-title">服务器内部错误，请联系客服</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.$router.push({
                      name: "mywithdraw",
                    });
                  }
                })
              } else if (success.returncode == 402) {
                self.result = success.data;
                self.$alert('<div class="lottery-title">禁止转账，转账只限上下级</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.$router.push({
                      name: "mywithdraw",
                    });
                  }
                })
              }
            }
          },
          error => {
            self.loading = false;
            self.$alert(`<div class="lottery-title">${self.result.message}</div>`, '系统提示', {
              confirmButtonText: '确定',
              center: true,
              dangerouslyUseHTMLString: true,
              customClass: "syxw-wrap-inner",
              callback: action => {
                self.$router.push({
                  name: "mywithdraw",
                });
              }
            })
          }
        );
      },
      //验证资金密码
      // password 资金密码
      // type 1:提现 2:转账 3.额度转换
      validatorCashPsd() {
        let transfer_cash = this.transferForm.cash;
        let transfer_loginname = this.transferForm.loginname;
        let password = this.transferForm.input_cash_psd;
        let self = this;
        if (!transfer_loginname) {
          this.$message({
            showClose: true,
            message: "收款账户不能为空",
            type: "error"
          });
          return;
        }
        if (!transfer_cash || transfer_cash == 0) {
          this.$message({
            showClose: true,
            message: "转账金额不能小于0",
            type: "error"
          });
          self.transferForm.cash = "";
          return;
        }
        if (
          transfer_cash <= 0 ||
          transfer_cash > self.blance
        ) {
          this.$message({
            showClose: true,
            message: "充值金额应在[0元]至[" +
              self.blance +
              "元]之间",
            type: "error"
          });
          self.transferForm.cash = "";
          return;
        }
        if (!password) {
          this.$message({
            showClose: true,
            message: "资金密码不能为空",
            type: "error"
          });
          return;
        }
        if (!this.regexpPsd(password)) {
          this.$message({
            showClose: true,
            message: "资金密码格式不符合要求",
            type: "error"
          });
          return;
        }
        this.loading = true;
        request.login(
          "post",
          "/user/random",
          {
            loginname: localStorage.getItem("loginname")
          },
          success => {
            if (success.returncode == "200") {
              let random = success.data.random;
              let new_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(password).toString(),
                random
              ).toString();
              request.http(
                "post",
                "/verifyCashPW",
                {
                  cash_password: new_password
                },
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 200) {
                      self.postTransfer();
                    } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    } else if (
                      success.returncode == 301 ||
                      success.returncode == 305
                    ) {
                      self.$alert('<div class="lottery-title">资金密码不正确</div>', '系统提示', {
                        confirmButtonText: '确定',
                        center: true,
                        dangerouslyUseHTMLString: true,
                        customClass: "syxw-wrap-inner",
                        callback: action => {
                          self.transferForm.input_cash_psd = "";
                        }
                      })
                    }
                  }
                },
                error => {
                  self.loading = false;
                  this.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              );
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
          }
        );
      },
      //匹配6-16位数字和字母组合
      regexpPsd(psd) {
        let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$");
        if (exp.test(psd)) {
          return true;
        }
        return false;
      },
    },
    watch: {
      $route(to, from) {

      }
    },
    computed: {
      //可用余额
      getBlance() {
        this.blance = this.$store.state.blance;
        return parseFloat(this.$store.state.blance).toFixed(2);
      }
    },
    mounted() {
      this.isSetBankPassword();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>

<style scoped lang="scss">
  .table-xinxi {
    width: 100%;

    .time-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .exp {
        text-align: left;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #191919;
        width: 120px;
        display: inline-block;
      }
    }
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .submit-line {
    width: 100%;
    margin-top: 60px;
    text-align: center;
  }

  .submit {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 auto;
  }

  .wrap-inner {
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;

    .inner-pay-title {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 16px;
      color: #191919;
    }
  }

  .project-content {
    padding: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .table-input>input[type="text"],
  input[type="password"] {
    display: inline-block;
    width: 300px;
    height: 45px;
    line-height: 45px;
    padding: 4px 0;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #fef1ab;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
    text-indent: 8px;
  }

  .table-input>input:focus {
    outline: none;
  }

  .binding-inner table {
    margin-left: 300px;
  }

  .binding-inner tr {
    line-height: 20px;
  }

  .binding-inner .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    min-width: 100px;
    padding: 12px 0;
  }

  .binding-inner .content {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    padding: 12px 0;
    padding-left: 14px;
  }

  .cash {
    color: #e41515;
    font-size: 16px;
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
    position: relative;
    font-family: MicrosoftYaHei;
    color: #333333;
    margin: 0 auto;
    width: 1090px;
  }

  .main {
    width: 1024px;
    background: #fff;
    margin: 0 auto;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    padding: 30px 20px 0;
    text-align: left;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .main>ul.withdraw-way {
    margin-left: 40px;
    margin-top: 50px;
  }

  .main>ul.withdraw-way>li {
    height: 36px;
    line-height: 36px;
    border: 1px solid #dedede;
    float: left;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    min-width: 68px;
  }

  .main>ul.withdraw-way>li>a {
    text-decoration: none;
    color: #333;
  }

  .main>ul.withdraw-way>li.active {
    border-bottom: 1px solid #f8f8f8;
    background: #f8f8f8;
  }

  .withdraw-tip {
    margin-top: 48px;
    text-align: left;
    font-size: 12px;
    padding: 19px 22px;
    margin-bottom: 59px;
    background: #f8f8f8;
    border: 1px solid #dedede;
  }

  .withdraw-tip .tip-title {
    font-size: 14px;
    margin-bottom: 19px;
  }

  .withdraw-tip .tip-content {
    line-height: 20px;
  }

  .withdraw-input {
    display: inline-block;
    width: 316px;
    height: 48px;
    line-height: 48px;
    padding: 16px;
    outline: none;
    border: 1px solid #999799;
  }

  .withdraw-input:focus {
    background: rgba(255, 255, 255, 1);
  }

  .withdraw-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    padding: 38px 40px;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .withdraw-container .container-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-right: 20px;
    display: inline-block;
    text-align: center;
    min-width: 56px;
  }

  .flex {
    display: flex;
    margin-top: 28px;
  }

  .withdraw-container .container-row .withdraw-banks {
    display: inline-block;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item {
    width: 330px;
    height: 168px;
    cursor: pointer;
    position: relative;
    text-align: center;
    float: left;
    margin-left: 5px;
    margin-top: 10px;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item .bank-no {
    font-size: 14px;
    position: relative;
    display: block;
    width: 145px;
    margin: 0 auto;
    top: 100px;
    color: #fff;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zggs {
    background: url("../assets/img/topUp/zggs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zs {
    background: url("../assets/img/topUp/zs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgms {
    background: url("../assets/img/topUp/ms.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgjs {
    background: url("../assets/img/topUp/zgjs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgny {
    background: url("../assets/img/topUp/zgny.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zg {
    background: url("../assets/img/topUp/zg.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.gf {
    background: url("../assets/img/topUp/gf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zx {
    background: url("../assets/img/topUp/zx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zggd {
    background: url("../assets/img/topUp/zggd.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.jt {
    background: url("../assets/img/topUp/jt.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgyzcx {
    background: url("../assets/img/topUp/zgyzcx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.pf {
    background: url("../assets/img/topUp/pf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.pa {
    background: url("../assets/img/topUp/pa.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.xy {
    background: url("../assets/img/topUp/xy.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.hx {
    background: url("../assets/img/topUp/hx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.active {
    border: 1px solid #d4914d;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
    border-radius: 12px;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
    border-bottom-right-radius: 12px;
  }

  .withdraw-next {
    text-align: left;
    margin-left: 40px;
  }

  .withdraw-submit {
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

  .withdraw-container .container-row {
    padding: 0;
  }

  .withdraw-container .container-row.line {
    border-bottom: 1px solid #d5d5d5;
    height: 69px;
    line-height: 69px;
  }

  .withdraw-container .container-row .unit {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-left: 16px;
    display: inline-block;
    text-align: center;
  }

  .withdraw-container .container-row .withdraw-limit {
    color: #666666;
    font-size: 12px;
    text-align: left;
  }

  .withdraw-container .container-row ul.banklist {
    box-sizing: border-box;
    transform: scale(0.333);
  }

  .withdraw-container .container-row ul.banklist>li {
    float: left;
    margin-right: 13px;
    margin-bottom: 9px;
    width: 480px;
    height: 132px;
    border: 1px solid #dedede;
    cursor: pointer;
  }

  .withdraw-container .container-row ul.banklist>li.zggs {
    background-position: 0 0;
  }

  .withdraw-container .container-row ul.banklist>li.zs {
    background-position: -522px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgms {
    background-position: -1044px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgjs {
    background-position: -1566px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgny {
    background-position: -2088px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zg {
    background-position: 0 -618px;
  }

  .withdraw-container .container-row ul.banklist>li.gf {
    background-position: -522px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zx {
    background-position: -1044px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zggd {
    background-position: -1566px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.jt {
    background-position: -2088px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zgyzcx {
    background-position: 0 -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.pf {
    background-position: -522px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.pa {
    background-position: -1044px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.xy {
    background-position: -1566px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.hx {
    background-position: -2088px -2158px;
  }

  .withdraw-container .container-row .wxActive {
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

  .withdraw-container .container-row .wxActive::after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
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
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  .transfer-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .transform-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .container-title {
    font-size: 18px;
    color: #333;
    margin-top: 27px;
    margin-left: 24px;
  }

  .container-inner {
    background: #fff;
    width: 100%;
  }

  .transform-container .container-inner {
    border: none;
  }

  .container-inner .inner-row {
    height: 34px;
    line-height: 34px;
    margin-bottom: 30px;
  }

  .container-inner .inner-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-right: 16px;
    display: inline-block;
    text-align: right;
    min-width: 99px;
  }

  .container-inner .inner-row .row-input {
    width: 222px;
    height: 34px;
    border: 1px solid #999799;
    line-height: 32px;
    padding: 0 20px;
    outline: none;
  }

  .ml-9 {
    margin-left: 9px;
  }

  .f14 {
    font-size: 14px;
    color: #333;
  }

  .mb-77 {
    margin-bottom: 77px;
  }

  .fl {
    float: left;
    padding-left: 20px;
  }

  .fr {
    float: right;
    margin-right: 100px;
  }
</style>

<style scoped lang="scss">
  .account-all {
    margin-top: 30px;
    width: 400px;
    border: 1px solid #333;

    td {
      border: 1px solid #333;
      height: 34px;
      padding-left: 5px;
    }
  }

  .tabs {
    /* height: 42px;
    line-height: 42px; */
    height: 40px;
    line-height: 40px;
    /* background: rgba(255, 247, 240, 1); */
    display: flex;
    /* border-bottom: 1px solid #DADADA; */
  }

  .tabs .tab-title {
    width: 100px;
    background: #D8D8D8;
    color: #191919;
    margin-right: 20px;
    border-radius: 2px 2px 0 0;
    text-align: center;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    /* color: rgba(51, 51, 51, 1); */
    cursor: pointer;
    position: relative;
  }

  .tabs .tab-title>a {
    font-size: 14px;
    color: #191919;
    outline: none;
    text-decoration: none;
  }

  .tabs .tab-title:hover>a {
    color: #847B5F;
  }

  .tabs .tab-title.active>a {
    color: #BD8454;
  }

  .tabs .tab-title.active {
    /* border-top: 2px solid #A65B06; */
    color: #BD8454;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
  }

  .tabs .tab-title a {
    display: block;
    /* padding: 0 30px; */
  }

  .account-done {
    margin-top: 30px;
    width: 340px;

    td.exp {
      min-width: 150px;
      font-size: 14px;
    }

    td.content {
      text-align: right
    }

    td {
      padding: 5px 0;
    }

    .submit {
      display: inline-block;
      text-align: center;
      width: auto;
      height: 30px;
      background: #d4914d;
      border-radius: 6px;
      line-height: 30px;
      color: #fff;
      font-size: 14px;
      padding: 0 35px;
      margin: 15px 0;
    }
  }

  .transform-inner-title {
    height: 34px;
    line-height: 34px;
    margin-bottom: 30px;

    .exp {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 20px;
      display: inline-block;
    }

    .exp2 {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 20px;
      display: inline-block;
    }
  }
</style>