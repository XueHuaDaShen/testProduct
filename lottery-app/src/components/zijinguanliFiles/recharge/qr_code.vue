<template>
  <div class="bankCard-wrap">
    <h2 class="bankCard-title-wrap"><em></em><p>充值方式</p></h2>
    <ol class="recharge-kind-list">
      <li v-if="rechargeKindCode==='wxsm'"><i class="recharge-icon"><img src="/static/img/wx.png"></i><span class="recharge-kind-text">{{receiver}}</span></li>
      <li v-if="rechargeKindCode==='zfbsm'"><i class="recharge-icon"><img src="/static/img/ali.png"></i><span class="recharge-kind-text">{{receiver}}</span></li>
      <li v-if="rechargeKindCode==='ylsm'"><i class="recharge-icon"><img src="/static/img/yl.png"></i><span class="recharge-kind-text">{{receiver}}</span></li>
    </ol>
    <div class="recharge-kind"></div>
    <h2 class="bankCard-title-wrap"><em></em><p>充值金额</p></h2>
    <ul>
      <li>
        <span>充值金额：</span>
        <input type="number" placeholder="" v-model="rechargeCash">
        <i class="unit">元</i>
      </li>
    </ul>
    <!-- <button class="submit-btn" v-if="rechargeKindCode === 'wykj'" @click="wy_rechargeFn">立即充值</button> -->
    <button class="submit-btn" :class="(rechargeData.length===0||isClick)?'disabled-btn':''" :disabled="(rechargeData.length===0||isClick)" v-if="rechargeKindCode!=='ylsm'" @click="qr_code_rechargeFn">立即充值</button>
    <button class="submit-btn" :class="(rechargeData.length===0||isClick)?'disabled-btn':''" :disabled="(rechargeData.length===0||isClick)" v-if="rechargeKindCode==='ylsm'" @click="yl_code_rechargeFn">立即充值</button>
    <div class="dialog-recharge" v-if="rechargeConfirm">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <em class="close-em" @click="handleHideDialog('rechargeConfirm')">×</em>
        <p class="dialog-title">为了您的资金安全，请验证您的口令</p>
        <span class="qr_code"><img :src="rechargeData[0].qr_code"></span>
        <p class="margin-left-149">交易账户：{{rechargeData[0].account_no}}</p>
        <p class="margin-left-149">交易单号：{{order_no}}</p>
        <div class="remind">
          <p>温馨提示:</p>
          <p>请您在扫码完成后，填写支付订单号后四位，再关闭</p>
          <p>页面， 以免掉单!扫码支付后，请点击提交按钮，提交</p>
          <p>充值申请!</p>
        </div>
        <button class="submit-btn" @click="rechargeConfirmFn">确认已充值</button>
      </div>
    </div>
    <div class="dialog-recharge-submit" v-if="rechargeSuccess">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <em class="close-em" @click="handleHideDialog('rechargeSuccess')">×</em>
        <span class="dialog-success-icon"></span>
        <p class="dialog-success-text">您的充值申请已提交，请等待系统审核。如果遇到问题无法到账，请联系客服。</p>
        <button class="submit-btn" @click="backToRechargePage">返回</button>
      </div>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <!-- <button class="submit-btn" @click="toConfirmTixian">立即充值</button> -->
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import paramCryptFn from '@/assets/js/cryptData.js'
import publicSelect from '@/components/publicModel/select';
export default {
  name: 'bankCard',
  components: {
    publicSelect
  },
  data() {
    return {
      isClick: false,
      rechargeRule: null,

      rechargeKindCode: '',
      rechargeKindText: '',
      rechargeConfirm: false,
      rechargeSuccess: false,

      rechargeData: [],
      order_no: '',

      rechargeId: '',

      rechargeCash: '',
      rechargeType: '',

      account: '',
      receiver: '',
      receiver_no: '',

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.rechargeKindText = '';
    this.rechargeKindCode = this.$route.query.kindCode;
    this.rechargeId = this.$route.query.id;
    // if(this.rechargeKindCode === 'wykj'){
    //   this.rechargeKindText = '网银快捷';
    //   this.rechargeType = '3';
    // }
    if(this.rechargeKindCode === 'zfbsm'){
      this.rechargeKindText = '支付宝扫码';
      this.rechargeType = '2';
    }
    if(this.rechargeKindCode === 'wxsm'){
      this.rechargeKindText = '微信扫码';
      this.rechargeType = '1';
    }
    if(this.rechargeKindCode === 'ylsm'){
      this.rechargeKindText = '银联扫码';
      this.rechargeType = '3';
    }
    this.getWithdrawRule();
    this.getRechargeData();
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', this.rechargeKindText);
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    handleGetSelected(val) {
      // console.log(val)
    },
    toConfirmTixian() {
      this.$router.push({
        name: 'confirmTixian'
      })
    },
    // 获取充值规则
    getWithdrawRule() {
      const vm = this;
      request.http(
        'get',
        '/user/trade/withdraw/config',
        {},
        (success) => {
          // console.log(success)
          if(success.returncode && success.returncode == 200){
            vm.rechargeRule = success.data;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取充值数据
    getRechargeData() {
      const vm = this;
      request.http(
        'get',
        '/user/trade/recharge/account',
        {
          id: vm.rechargeId
        },
        (success) => {
          // console.log(success)
          if(success.returncode === 200){
            vm.rechargeData = success.data[0].account;
            // console.log(vm.rechargeData)
            if(vm.rechargeData.length>0){
              vm.account = vm.rechargeData[0]._id;
              vm.receiver = vm.rechargeData[0].name;
              vm.receiver_no = vm.rechargeData[0].account_no;
            }
            // vm.tableData = success.data.data
            // vm.formatData(success.data)
            // vm.showSelect = true;
          }
        },
        (error) => {}
      )
    },
    // 网银充值
    wy_rechargeFn() {
      this.rechargeConfirm = false;
      this.rechargeSuccess = true;
    },
    // 扫码充值
    qr_code_rechargeFn() {
      const vm = this;
      let defaultMin = 1;
      let defaultMax = 50000;
      if (this.rechargeCash === '') {
        this.tipText = '请填写充值金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.rechargeCash < (this.rechargeRule.min_recharge_scan || defaultMin)) {
        this.tipText = '每次最少充值'+(this.rechargeRule.min_recharge_scan || defaultMin)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.rechargeCash > (this.rechargeRule.max_recharge_scan || defaultMax)) {
        this.tipText = '每次最多充值'+(this.rechargeRule.max_recharge_scan || defaultMax)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        let param = {
          cash_apply: Number(vm.rechargeCash),
          type: vm.rechargeType,
          account: vm.account,
          receiver: vm.receiver,
          receiver_no: vm.receiver_no
        }
        // console.log(param)
        this.isClick = true;
        request.http(
          'post',
          '/user/trade/recharge',
          paramCryptFn(param),
          (success) => {
            // console.log(success)
            if(success.returncode === 200){
              vm.order_no = success.data.order_no;
              vm.rechargeConfirm = true;
              // vm.showSelect = true;
            }
          },
          (error) => {}
        )
      }
      // this.rechargeConfirm = true;
      // this.rechargeSuccess = false;
    },
    //银联
    yl_code_rechargeFn() {
      const vm = this;
      let defaultMin = 1;
      let defaultMax = 50000;
      if (this.rechargeCash === '') {
        this.tipText = '请填写充值金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.rechargeCash < (this.rechargeRule.third_min_recharge_every_time || defaultMin)) {
        this.tipText = '每次最少充值'+(this.rechargeRule.third_min_recharge_every_time || defaultMin)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.rechargeCash > (this.rechargeRule.third_max_recharge_every_time || defaultMax)) {
        this.tipText = '每次最多充值'+(this.rechargeRule.third_max_recharge_every_time || defaultMax)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        let param = {
          cash_apply: Number(vm.rechargeCash),
          type: '11'
        }
        // console.log(param)
        this.isClick = true;
        request.http(
          'post',
          '/jeepay/recharge',
          paramCryptFn(param),
          (success) => {
            // console.log(success)
            if(success.returncode === 200){
              location.href = success.data.url;;
              // vm.showSelect = true;
            }
          },
          (error) => {}
        )
      }
    },
    // 充值确认
    rechargeConfirmFn() {
      this.rechargeConfirm = false;
      this.rechargeSuccess = true;
    },
    // 充值成功返回到充值页面
    backToRechargePage() {
      this.rechargeConfirm = false;
      this.rechargeSuccess = false;
      this.$router.push({
        name: 'recharge'
      })
    },
    handleHideDialog(val) {
      this[val] = false;
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.bankCard-wrap{
  h2.bankCard-title-wrap{
    height:1.05rem;
    display:-webkit-box;
    -webkit-box-pack:start;
    -webkit-box-align:center;
    text-align:left;
    font-size:.32rem;
    em{
      display:block;
      width:.08rem;
      height:.36rem;
      background:#c7c7c7;
      margin-left:.3rem;
      margin-right:.16rem;
      margin-top:.03rem;
    }
  }
  .recharge-kind-list{
    width:7.2;
    margin-left:.3rem;
    display:flex;
    flex-wrap:wrap;
    li{
      width:3rem;
      height:.88rem;
      background: #292932;
      border: .02rem solid #303040;
      border-radius: .08rem;
      margin-right:.3rem;
      display:-webkit-box;
      -webkit-box-pack:start;
      -webkit-box-align:center;
      i.recharge-icon{
        // width:.54rem;
        height:.54rem;
        display:block;
        border-radius:.16rem;
        // background:#C83C4A;
        margin-left:.43rem;
        img{
          height:100%;
          width:auto;
        }
      }
      span.recharge-kind-text{
        margin-left:.2rem;
      }
    }
  }
  ul>li.input-text-red>i.unit{
    color:#C83C4A;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
      position: relative;
      &:first-child{
        margin-top:0;
      }
      i{
        position: absolute;
        right:.3rem;
        bottom:.24rem;
        font-style:normal;
      }
      span{
        display:block;
        margin-left:.3rem;
      }
      .select-wrap{
        -webkit-box-flex:1;
        height:100%;
        position: relative;
      }
      input{
        display:block;
        -webkit-box-flex:1;
        height:100%;
        padding-right:.3rem;
        padding-left:.1rem;
        outline: none;
        border: none;
        background: #292932;
        color:#c7c7c7;
      }
      input::-webkit-input-placeholder { /* WebKit browsers */
        color: #646464;
      }
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #646464;
      }
      input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #646464;
      }
      input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #646464;
      }
    }
  }
  button.submit-btn{
    display:block;
    width:4.4rem;
    height:.8rem;
    background: #C83C4A;
    border-radius: .08rem;
    margin-top:1.2rem;
    margin-left:1.55rem;
    font-size:.32rem;
    line-height:.8rem;
  }
  .dialog-bj{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0.8;
    background: #000000;
  }
  .dialog-content{
    width:6.9rem;
    height:10.24rem;
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background: #fff;
    border-radius: .16rem;
    margin: auto;
    font-size:.32rem;
    em.close-em{
      position: absolute;
      right:.3rem;
      top:.3rem;
      width:.46rem;
      height:.46rem;
      border-radius:50%;
      overflow:hidden;
      background:#191919;
      font-size:.5rem;
      color:#fff;
      // text-align:center;
      text-indent: .06rem;
      line-height:.46rem;
    }
  }
  .dialog-recharge{
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    .dialog-content{
      .dialog-title{
        font-size:.32rem;
        color:#191919;
        text-align:center;
        margin-top:.3rem;
        display:block;
      }
      .qr_code{
        width:4.6rem;
        height:4.6rem;
        display:block;
        margin-top:.3rem;
        margin-bottom:.3rem;
        margin-left:1.15rem;
        border:1px solid #ccc;
        img{
          width:100%;
          height:100%;
        }
      }
      .margin-left-149{
        width:auto;
        margin-left:1.49rem;
        color:#191919;
        margin-bottom:.1rem;
      }
      .remind{
        width:6.16rem;
        margin-top:.2rem;
        margin-bottom:.3rem;
        font-size:.26rem;
        color:#777;
        margin-left:.3rem;
        line-height:.4rem;
      }
      button.submit-btn{
        height:.88rem;
        line-height:.88rem;
        margin:0;
        margin-left:1.25rem;
      }
    }
  }
  .dialog-recharge-submit{
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    .dialog-content{
      .dialog-success-icon{
        width:2rem;
        height:2rem;
        border-radius:50%;
        background:#C83C4A;
        display:block;
        margin-top:2.2rem;
        margin-left:2.45rem;
      }
      .dialog-success-text{
        margin-left:.37rem;
        width:6.16rem;
        display:block;
        text-align:center;
        color:#191919;
        line-height: .4rem;
        margin-top:.6rem;
      }
      button.submit-btn{
        height:.88rem;
        line-height:.88rem;
        margin:0;
        margin-left:1.25rem;
        margin-top:1.2rem;
      }
    }
  }
}
</style>


