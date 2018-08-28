<template>
  <div class="bankCard-wrap">
    <div v-if="rechargeKindCode === 'yhkzz'">
      <h2 class="bankCard-title-wrap"><em></em><p>公司银行信息</p></h2>
      <div class="bankCard-rule-wrap" v-for="(bank, bi) in bankCardList" :key="bi">
        <div><p>银行<span></span></p>：<p>{{bank.bank}}</p></div>
        <div><p>收款人<span></span></p>：<p>{{bank.realname}}</p></div>
        <div><p>开户行网点<span></span></p>：<p>{{bank.subbranch}}</p></div>
        <div><p>账号<span></span></p>：<p>{{bank.account_no}}</p></div>
        <input type="radio" @click="handleSelectBankCard(bank, $event)" class="bankCard-checkbox" name="bankCard-checkbox">
        <i class="check-icon"></i>
      </div>
      <h2 class="bankCard-title-wrap"><em></em><p>注意事项</p></h2>
      <div class="split-bar"></div>
      <h2 class="bankCard-title-wrap"><em></em><p>如已存入款项，请填写您的转账资料</p></h2>
      <ul>
        <li>
          <span>存款金额：</span>
          <input type="text" placeholder="" v-model="yhk_toCash">
          <i class="unit">元</i>
        </li>
        <!-- <li>
          <span>存款银行：</span>
          <publicSelect
            class="select-wrap"
            v-if="showBank"
            placeholder="请选择存款银行"
            :selectList="bankList"
            label="bank_name"
            value="_id"
            :callback="getBankSelectedOption">
          </publicSelect>
        </li> -->
        <li>
          <span>存入人姓名：</span>
          <input type="text" placeholder="" v-model="yhk_realname">
        </li>
        <li>
          <span>存入人卡号：</span>
          <input type="number" v-model="yhk_bankNum">
        </li>
      </ul>
      <button class="submit-btn" :class="(bankCardList.length===0||isClick)?'disabled-btn':''" :disabled="(bankCardList.length===0||isClick)" @click="yhk_rechargeFn">立即充值</button>
    </div>
    <div v-if="rechargeKindCode === 'wykj'">
      <h2 class="bankCard-title-wrap"><em></em><p>充值银行</p></h2>
      <ul>
        <li>
          <span>选择银行：</span>
          <publicSelect
            class="select-wrap"
            v-if="showBank"
            placeholder="请选择银行"
            :selectList="bankList"
            label="name"
            value="code"
            :callback="getBankSelectedOption">
          </publicSelect>
        </li>
      </ul>
      <h2 class="bankCard-title-wrap"><em></em><p>充值金额</p></h2>
      <ul>
        <li>
          <span>充值金额：</span>
          <input type="text" placeholder="" v-model="wy_toCash">
          <i class="unit">元</i>
        </li>
      </ul>
      <button class="submit-btn" :class="(bankCardList.length===0||isClick)?'disabled-btn':''" :disabled="(bankCardList.length===0||isClick)" @click="wy_rechargeFn">立即充值</button>
    </div>
    <div v-if="rechargeKindCode === 'ylzz'">
      <h2 class="bankCard-title-wrap"><em></em><p>充值方式</p></h2>
      <ol class="recharge-kind-list">
        <li><i class="recharge-icon yl-icon"><img src="/static/img/yl.png"></i><span class="recharge-kind-text">{{bankCardList.length>0?bankCardList[0].name:''}}</span></li>
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
      <button class="submit-btn" :class="(bankCardList.length===0||isClick)?'disabled-btn':''" :disabled="(bankCardList.length===0||isClick)" @click="yl_rechargeFn">立即充值</button>
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
    <!-- <button class="submit-btn" @click="toConfirmTixian">立即充值</button> -->
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
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
      rechargeRule:null,

      bankList: [],
      showBank: false,
      bankCardList: [],
      bankid: '',
      bankcode: '',
      yhk_toCash: '',
      yhk_toBankCard: '1',
      yhk_realname: '',
      yhk_bankNum: '',
      yhk_receiver: '',
      yhk_receiver_no: '',
      yhk_account: '',

      wy_toCash: '',


      rechargeId: '',
      rechargeCash: '',
      rechargeKindCode: '',
      rechargeSuccess: false,
      
      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    let txt = '';
    this.rechargeKindCode = this.$route.query.kindCode;
    this.rechargeId = this.$route.query.id;
    this.getBankList();
    this.getRechargeData();
    if(this.rechargeKindCode === 'yhkzz'){
      txt = '银行卡转账'
    }
    if(this.rechargeKindCode === 'ylzz'){
      txt = '银联快捷'
    }
    if(this.rechargeKindCode === 'wykj'){
      txt = '网银快捷'
    }
    this.getWithdrawRule();
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', txt);
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取所有银行
    getBankList() {
      const vm = this;
      request.http(
        'get',
        '/jeepay/bank/list',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.bankList = success.data;
            vm.showBank = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取银行卡选中项
    getBankSelectedOption(item) {
      // console.log(item)
      this.bankcode = item.code;
    },
    toConfirmTixian() {
      this.$router.push({
        name: 'confirmTixian'
      })
    },
    // 获取要充值的银行卡
    handleSelectBankCard(item, e) {
      // console.log(item)
      this.bankid = item._id;
      this.yhk_receiver = item.system +'-'+ item.bank;
      this.yhk_receiver_no = item.account_no;
      this.yhk_account = item._id;
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
            vm.bankCardList = success.data[0].account;
            // vm.tableData = success.data.data
            // vm.formatData(success.data)
            // vm.showSelect = true;
          }
        },
        (error) => {}
      )
    },
    // 银行卡转账
    yhk_rechargeFn() {
      const vm = this;
      let defaultMin = 1;
      let defaultMax = 50000;
      //  else if (this.yhk_toBankCard === '') {
      //   vm.tipText = '请选择存款银行';
      //   setTimeout(() => {
      //     vm.tipText = '';
      //   }, vm.tipTimeOut*1000);
      //   return false;
      // }
      if (this.bankid === '') {
        vm.tipText = '请选择公司入款银行卡';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.yhk_toCash === '') {
        vm.tipText = '请填写存款金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.yhk_toCash < (this.rechargeRule.min_recharge_every_time || defaultMin)) {
        this.tipText = '每次最少充值'+(this.rechargeRule.min_recharge_every_time || defaultMin)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.yhk_toCash > (this.rechargeRule.max_recharge_every_time || defaultMax)) {
        this.tipText = '每次最多充值'+(this.rechargeRule.max_recharge_every_time || defaultMax)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.yhk_realname === '') {
        vm.tipText = '请填写存入人姓名';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.yhk_bankNum === '') {
        vm.tipText = '请填写存入人卡号';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        let param = {
          cash_apply: vm.yhk_toCash,
          type: '3',
          realname: vm.yhk_realname,
          card_no: vm.yhk_bankNum,
          receiver: vm.yhk_receiver,
          receiver_no: vm.yhk_receiver_no,
          account: vm.yhk_account
        }
        // console.log(param)
        this.isClick = true;
        request.http(
          'post',
          '/user/trade/recharge',
          paramCryptFn(param),
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              vm.rechargeSuccess = true;
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
    },
    // 网银充值
    wy_rechargeFn() {
      const vm = this;
      let defaultMin = 1;
      let defaultMax = 50000;
      if (this.bankcode === '') {
        vm.tipText = '请选择银行卡';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.wy_toCash === '') {
        vm.tipText = '请填写充值金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.wy_toCash < (this.rechargeRule.third_min_recharge_every_time || defaultMin)) {
        this.tipText = '每次最少充值'+(this.rechargeRule.third_min_recharge_every_time || defaultMin)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if(this.wy_toCash > (this.rechargeRule.third_max_recharge_every_time || defaultMax)) {
        this.tipText = '每次最多充值'+(this.rechargeRule.third_max_recharge_every_time || defaultMax)+'元';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        let param = {
          type: '1',
          bank_code: vm.bankcode,
          cash_apply: vm.wy_toCash
        }
        // console.log(param)
        this.isClick = true;
        request.http(
          'post',
          '/jeepay/recharge',
          paramCryptFn(param),
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              // vm.rechargeSuccess = true;
              location.href = success.data.url;
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
      // this.rechargeSuccess = true;
    },
    // 银联充值
    yl_rechargeFn() {
      const vm = this;
      let defaultMin = 1;
      let defaultMax = 50000;
      if (this.rechargeCash === '') {
        vm.tipText = '请填写充值金额';
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
          type: '13',
          cash_apply: vm.rechargeCash
        }
        // console.log(param)
        this.isClick = true;
        request.http(
          'post',
          '/jeepay/recharge',
          paramCryptFn(param),
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              // vm.rechargeSuccess = true;
              location.href = success.data.url;
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
      // this.rechargeSuccess = true;
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
        // width:auto;
        height:.54rem;
        display:block;
        border-radius:.16rem;
        background:#C83C4A;
        margin-left:.43rem;
        img{
          width:auto;
          height:100%;
        }
      }
      // i.yl-icon{
      //   background:url('/static/img/yl.png') no-repeat;
      //   background-size:100% 100%;
      // }
      span.recharge-kind-text{
        margin-left:.2rem;
      }
    }
  }
  .bankCard-rule-wrap{
    width:6.9rem;
    padding:.3rem;
    padding-bottom:0;
    margin-left:.3rem;
    margin-bottom:.3rem;
    background: #292932;
    border: .02rem solid #303040;
    border-radius: .08rem;
    position: relative;
    .bankCard-checkbox{
      position: absolute;
      width:100%;
      height:100%;
      border:none;
      outline:none;
      z-index:2;
      opacity:0;
      left:0;
      top:0;
    }
    i.check-icon{
      width:.38rem;
      height:.38rem;
      border-radius:50%;
      background:url('/static/img/check_box.png') no-repeat;
      background-size:100% 100%;
      position: absolute;
      right:.3rem;
      bottom:.3rem;
    }
    .bankCard-checkbox:checked+i.check-icon{
      background:url('/static/img/check_box_ed.png') no-repeat;
      background-size:100% 100%;
    }
    div{
      margin-bottom:.3rem;
      // line-height:.4rem;
      width:100%;
      // position: relative;
      display:-webkit-box;
      p{
        display: block;
        text-align:justify;
        // height:auto;
        height:.4rem;
        line-height:.4rem;
        &:first-child{
          width:1.68rem;
        }
        span{
          display:inline-block;
          padding-left:100%;
        }
      }
      &:last-child{
        margin-bottom:0;
      }
    }
    em{
      font-style:normal;
      color:#C83C4A;
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
  .dialog-recharge-submit{
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    z-index:999;
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


