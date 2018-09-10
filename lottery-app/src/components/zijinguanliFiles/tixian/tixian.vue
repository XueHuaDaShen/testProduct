<template>
  <div class="tixian-wrap">
    <h2 class="tixian-title-wrap"><em></em>提现规则</h2>
    <div class="tixian-rule-wrap" v-if="showRule">
      <p>提款时间：<em>全天24小时</em></p>
      <p>每天限制提款 <em>{{withDrawRule.max_withdraw_times_daily}}</em>次，您今天已经提款 <em>{{withDrawRule.times||0}}</em>次</p>
      <p>最小提款额：<em>{{withDrawRule.min_withdraw_every_time}}元</em>，最大提款额: <em>{{withDrawRule.max_withdraw_every_time}}元</em></p>
      <p>需完成所有打码量要求方可提现</p>
    </div>
    <div class="split-bar"></div>
    <h2 class="tixian-title-wrap"><em></em>可提现银行卡</h2>
    <p class="emptyBank" v-if="useWithDrawCard.length===0">还没有绑定过银行卡</p>
    <ul v-if="useWithDrawCard.length>0">
      <li>
        <span>用户名：</span>
        <input type="text" placeholder="" readonly v-model="username">
      </li>
      <li class="input-text-red">
        <span>可提现余额：</span>
        <input type="number" placeholder="" readonly v-model="userBlance">
        <i class="unit">元</i>
      </li>
      <li>
        <span>提现金额：</span>
        <input type="number" v-model="cash">
        <i class="unit">元</i>
      </li>
      <li>
        <span>存入卡号：</span>
        <publicSelect
          class="select-wrap"
          placeholder="请选择银行卡"
          v-if="showBank"
          :selectList="useWithDrawCard"
          :defaultSelected="bankid"
          label="card_no"
          value="_id"
          :callback="getBankSelectedOption">
        </publicSelect>
      </li>
    </ul>
    <!-- <button class="submit-btn" @click="toConfirmTixian">下一步</button> -->
    <button class="submit-btn" v-if="useWithDrawCard.length>0" @click="toConfirmTixian">下一步</button>
    <button class="submit-btn" v-if="useWithDrawCard.length===0" @click="toBindCard">去绑定银行卡</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import publicSelect from '@/components/publicModel/select';
export default {
  name: 'tixian',
  components: {
    publicSelect
  },
  data() {
    return {
      withDrawRule: null, // 提现的规则
      showRule: false,
      showBank: false,
      useWithDrawCard: [], // 可使用的银行卡
      username: '',
      userBlance: '',
      cash: '',

      banknum: '',
      bankid: '',
      bankname: '',
      city: '',
      realname: '',

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '提现');
    // console.log(Number(localStorage.getItem('blance')).toFixed(2))
    // this.userBlance = Number(localStorage.getItem('blance')).toFixed(2);
    this.username = localStorage.getItem('loginname');
    this.getUserProfile();
    this.getWithdrawRule();
    this.getUseWithDrawCard();
  },
  mounted() {},
  watch: {},
  computed: {
    getUserBlance() {
      return this.$store.state.blance;
    }
  },
  methods: {
    //获取个人资料
    getUserProfile() {
      const vm = this;
      request.http(
        'get',
        '/user/profile',
        {},
        (success) => {
          if(success.returncode && success.returncode == 200){
            let blance = success.data.cash;
            vm.userBlance = Number(blance).toFixed(2);
            localStorage.setItem('blance', blance);
            vm.$store.dispatch('setBlance', blance)
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    getBankSelectedOption(item) {
      // console.log(item)
      this.banknum = item.card_no;
      this.bankid = item._id;
      this.bankname = item.bank[0].bank_name;
      this.city = item.city.name + ' ' + item.province.name;
      this.realname = item.realname;
    },
    // 提现下一步
    toConfirmTixian() {
      const vm = this;
      if (this.cash === '') {
        vm.tipText = '请输入提现金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (Number(this.cash) > Number(this.userBlance)) {
        vm.tipText = '对不起，您没有那么多余额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.bankid === '') {
        vm.tipText = '请选择银行卡';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        this.$router.push({
          name: 'confirmTixian',
          query: {
            username: vm.username,
            blance: vm.userBlance,
            cash: vm.cash,
            bankname: vm.bankname,
            banknum: vm.banknum,
            bankid: vm.bankid,
            realname: vm.realname,
            city: vm.city
          }
        })
      }
    },
    // 去绑定银行卡
    toBindCard() {
      this.$router.push({
        name: 'yhkgl'
      })
    },
    // 获取提现规则
    getWithdrawRule() {
      const vm = this;
      request.http(
        'get',
        '/user/trade/withdraw/config',
        {},
        (success) => {
          // console.log(success)
          if(success.returncode && success.returncode == 200){
            vm.withDrawRule = success.data;
            vm.showRule = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取可提现的银行卡列表
    getUseWithDrawCard() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/list',
        {},
        (success) => {
          // console.log(success)
          if(success.returncode && success.returncode == 200){
            if(success.data.msg){
              vm.useWithDrawCard = [];
            }else{
              vm.useWithDrawCard = success.data.bankcards;
            }
            vm.showBank = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.tixian-wrap{
  h2.tixian-title-wrap{
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
  .tixian-rule-wrap{
    width:6.9rem;
    padding:.3rem;
    margin-left:.3rem;
    margin-bottom:.3rem;
    background: #292932;
    border: .02rem solid #303040;
    border-radius: .08rem;
    p{
      margin-bottom:.3rem;
      line-height:.4rem;
      &:last-child{
        margin-bottom:0;
      }
    }
    em{
      font-style:normal;
      color:#C83C4A;
    }
  }
  .emptyBank{
    color:#C83C4A;
    font-size:.32rem;
    display:block;
    width:100%;
    text-align:center;
    margin-top:.6rem;
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
}
</style>


