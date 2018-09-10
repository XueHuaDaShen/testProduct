<template>
  <div class="yhkbd1-wrap">
    <div class="bind-yhk-step">
      <p></p>
      <p></p>
      <span class="step-one active">1</span>
      <span class="step-two">2</span>
      <span class="step-three">3</span>
    </div>
    <div class="step-one-title">1、{{setSetpTitle()}}</div>
    <ul>
      <li v-if="bankList.length>0">
        <span>选择验证银行卡：</span>
          <publicSelect
            class="select-wrap"
            placeholder="请选择银行卡"
            :selectList="bankList"
            label="bank_name"
            value="_id"
            :callback="getSelectedBankOption">
          </publicSelect>
      </li>
      <li v-if="bankList.length>0">
        <span>开户人名字：</span>
        <input type="text" placeholder="请输入旧的银行卡开户人姓名" v-model="realname">
      </li>
      <li v-if="bankList.length>0">
        <span>银行卡号：</span>
        <input type="number" placeholder="请输入旧的银行卡号" v-model="bankNum">
      </li>
      <li>
        <span>资金密码：</span>
        <input type="password" v-model="zijinPwd">
      </li>
    </ul>
    <button class="submit-btn" :disabled="isClick" @click="toNextBindBankStep">下一步</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import publicSelect from '@/components/publicModel/select';
export default {
  name: 'yhkbd1',
  components: {
    publicSelect
  },
  data() {
    return {
      isClick: false,
      bank: '', // 银行卡变量
      showBank: false,
      realname: '', // 开户人
      bankNum: '', // 银行卡号
      zijinPwd: '', // 资金密码
      stepTitle: '', // 步骤标题
      bankList: [],


      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '银行卡绑定');
    this.getBankList();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取select返回数据
    handleGetSelected(data) {
      // console.log(data)
      let item = data[0];
      let val = data[1];
      this[val] = item[this.selectVal]
    },
    // 获取选中的银行卡项
    getSelectedBankOption(item) {
      this.bank = item.bank_name;
    },
    setSetpTitle() {
      if(this.bankList.length === 0){
        this.stepTitle = '验证资金密码'
      }else{
        this.stepTitle = '验证旧银行卡'
      }
      return this.stepTitle
    },
    // 获取银行卡列表，用来判断是否需要验证银行卡
    getBankList() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/list',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            // vm.bankList = success.data.bankcards;
            vm.bankList = [];
            vm.showBank = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 去往绑定银行卡第二步
    toNextBindBankStep() {
      this.checkInBank();
      // this.$router.push({
      //   name: 'yhkbd2'
      // })
    },
    // 验证银行卡
    checkInBank() {
      if(this.bankList.length === 0){
        this.checkInZijin();
      }else{
        //
      }
    },
    // 验证资金密码
    checkInZijin() {
      const vm = this;
      if(this.zijinPwd === ''){
        vm.tipText = '资金密码不能为空'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      }
      vm.isClick = true;
      request.login(
        'post',
        '/user/random',
        {
          loginname: localStorage.getItem('loginname')
        },
        (success) => {
          let code = success.returncode;
          if(code == 200){
            let random = success.data.random;
            let new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.zijinPwd).toString(), random).toString();
            request.http(
              'post',
              '/verifyCashPW',
              {
                cash_password: new_password
              },
              (success) => {
                // console.log(success)
                vm.isClick = false;
                let code = success.returncode;
                if (code == 103 || code == 106 || code == 101) {
                  request.loginAgain(vm);
                } else if (code == 200) {
                  // vm.tipText = '用户不存在'
                  // setTimeout(() => {
                  //   vm.tipText = '';
                  // }, vm.tipTimeOut*1000);
                  vm.$router.replace({
                    name: 'yhkbd2'
                  })
                } else if(code == 305) {
                  vm.tipText = '密码错误'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 306) {
                  vm.tipText = '用户被禁'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 304) {
                  vm.tipText = '用户不存在'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                }
              },
              (error) => {
                vm.isClick = false;
                console.log('数据异常', error)
              }
            )
          }else if (code == 103 || code == 106 || code == 101) {
            request.loginAgain(vm);
          }else{
            vm.isClick = false;
          }
        },
        (error) => {
          vm.isClick = false;
        }
      )
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.yhkbd1-wrap{
  .bind-yhk-step{
    width:6.9rem;
    height: .5rem;
    margin:.3rem;
    display:-webkit-box;
    -webkit-box-align:center;
    position: relative;
    p{
      display:block;
      width:50%;
      height:.1rem;
      background:#DBDBDB;
    }
    p.active{
      background:#C83C4A;
    }
    span{
      position: absolute;
      width:.5rem;
      height:.5rem;
      background:#777;
      border-radius:50%;
      top:0;
      text-align:center;
      line-height:.5rem;
    }
    span.active{
      background:#C83C4A;
    }
    span.step-one{
      left:0;
    }
    span.step-two{
      left:50%;
      margin-left:-.25rem;
    }
    span.step-three{
      right:0;
    }
  }
  .step-one-title{
    width:100%;
    height:.45rem;
    text-align:center;
    line-height:.45rem;
    margin-bottom:.6rem;
    font-size:.32rem;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
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


