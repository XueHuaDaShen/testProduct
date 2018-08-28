<template>
  <div class="tixian-wrap">
    <h2 class="tixian-title-wrap"><em></em>可提现银行卡</h2>
    <ul>
      <li class="input-text-red">
        <span>账户总余额：</span>
        <input type="number" readonly placeholder="" v-model="userBlance">
        <i class="unit">元</i>
      </li>
      <li>
        <span>收款账号：</span>
        <input type="text" placeholder="仅限于您的下级(用户名)" v-model="toName">
      </li>
      <li class="input-text-red">
        <span>转账金额：</span>
        <input type="number" v-model="toCash">
        <i class="unit">元</i>
      </li>
    </ul>
    <div class="split-bar"></div>
    <h2 class="tixian-title-wrap"><em></em>安全验证</h2>
    <ul> 
      <li>
        <span>{{question}}：</span>
        <input type="text" autocomplete="off" v-model="answer" placeholder="">
      </li>
      <li>
        <span>确认资金密码：</span>
        <input type="password" autocomplete="off" v-model="zijinPwd">
      </li>
    </ul>
    <button class="submit-btn" :class="isClick?'disabled-btn':''" :disabled="isClick" @click="confirmWithDraw">确认转账</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import paramCryptFn from '@/assets/js/cryptData'
export default {
  name: 'tixian',
  components: {},
  data() {
    return {
      isClick: false,
      questionArr: [], // 所有问题
      question: '', // 需要回答的问题
      questionid: '', // 问题id
      answer: '', // 答案
      zijinPwd: '', // 资金密码
      maxErrorNum: 6, // 最大答错次数
      countError: 0, // 连续答错次数

      userBlance: '',
      toName: '',
      toCash: '',

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '转账');
    this.userBlance = Number(localStorage.getItem('blance')).toFixed(2)
    this.getQuestion();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 随机一个问题
    randomQuestion(data) {
      let num = 0;
      let len = data.length;
      num = Math.floor(Math.random()*0 + Math.random()*len);
      let option = data[num]
      this.question = option.questionid.content;
      this.questionid = option.questionid._id;
    },
    // 获取密保问题
    getQuestion() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/safe/question/get',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.questionArr = success.data.questions;
            vm.randomQuestion(vm.questionArr)
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 确认提现
    confirmWithDraw() {
      const vm = this;
      if (this.toName === '') {
        vm.tipText = '请输入下级用户名';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.toCash === '') {
        vm.tipText = '请输入提现金额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (Number(this.toCash) > Number(this.userBlance)) {
        vm.tipText = '对不起，您没有那么多余额';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      }
      this.checkInMibao();
    },
    // 验证密保
    checkInMibao() {
      const vm = this;
      if (this.answer === '') {
        vm.tipText = '请输入答案'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else if (this.countError >= this.maxErrorNum) {
        vm.tipText = '错误次数已达上限，请修改问题'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        this.countError = this.maxErrorNum;
        return false;
      } else {
        request.http(
          'post',
          '/user/bankcard/safe/question/certify',
          {
            questions: [
              {questionid: vm.questionid, content: vm.answer}
            ]
          },
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code == 200) {
              vm.checkInZijinPwd();
            } else if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 301 || code == 303) {
              vm.tipText = '对不起，参数错误'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            } else if (code == 302) {
              vm.countError += 1;
              vm.tipText = '答案错误，还有${vm.maxErrorNum-vm.countError}次机会'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
    },
    // 验证资金密码
    checkInZijinPwd() {
      const vm = this;
      if(this.zijinPwd === ''){
        vm.tipText = '资金密码不能为空'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      }
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
                let code = success.returncode;
                if (code == 103 || code == 106 || code == 101) {
                  request.loginAgain(vm);
                } else if (code == 200) {
                  vm.withdrawFn();
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
                console.log('数据异常', error)
              }
            )
          }
        },
        (error) => {}
      )
    },
    // 验证通过，转账
    withdrawFn() {
      const vm = this;
      let param = {
        transfer_loginname: vm.toName,
        transfer_cash: vm.toCash
      };
      this.isClick = true;
      request.http(
        'post',
        '/user/trade/transfer',
        paramCryptFn(param),
        (success) => {
          // console.log(success)
          let code = success.returncode;
          if (success.returncode == 200){
            vm.tipText = '转账成功'
            vm.toName = '';
            vm.toCash = '';
            vm.answer = '';
            vm.zijinPwd = '';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else if (code == 301 || code == 305) {
            vm.tipText = '资金密码不正确';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else if (code == 304) {
            vm.tipText = '账户无法进行转账';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else if (code == 302) {
            vm.tipText = '账户余额不足';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else{
            vm.tipText = success.data.msg;
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          }
        },
        (error) => {}
      )
    },
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
      margin-right:.1rem;
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
}
</style>


