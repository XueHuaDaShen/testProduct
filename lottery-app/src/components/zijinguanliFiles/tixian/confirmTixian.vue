<template>
  <div class="tixian-wrap">
    <input type="text"  style="display: none;" disabled autocomplete = "off"/>
    <input type="password"  style="display: none;" disabled autocomplete = "off"/>
    <h2 class="tixian-title-wrap"><em></em>确认信息</h2>
    <div class="tixian-rule-wrap">
      <p><span>用户名：</span><span>{{username}}</span></p>
      <p><span>可提现余额：</span><em>{{userBlance}}元</em></p>
      <p><span>提现金额：</span><em>{{cash}}元</em></p>
      <p><span>手续费：</span><span>免费</span></p>
      <p><span>开户账户：</span><span>{{bankname}}</span></p>
      <p><span>开户城市：</span><span>{{city}}</span></p>
      <p><span>开户姓名：</span><span>{{realname}}</span></p>
      <p><span>个人银行账号：</span><span>{{banknum}} </span></p>
    </div>
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
    <button class="submit-btn" :disabled="isClick" @click="confirmWithDraw">确认提现</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <div class="yhk-warning-dialog" v-if="showWarningQueAlert">
      <div class="dialog-bj"></div>
      <div class="dialog-content" @click="handleClickContent($event)">
        <em class="close-em" @click="handleHideDialog('showWarningQueAlert', $event)">×</em>
        <p class="warning-icon-p"><span class="warning-icon"></span></p>
        <p class="warning-text-p">
          您还未设置密保问题！这导致您的账号存在风险！
        </p>
        <p class="warning-btn-p"><button @click="toSetQue($event)">前往设置</button></p>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import publicSelect from '@/components/publicModel/select';
import paramCryptFn from '@/assets/js/cryptData'
export default {
  name: 'tixian',
  components: {
    publicSelect
  },
  data() {
    return {
      isClick: false,
      showWarningQueAlert: false,
      questionArr: [], // 所有问题
      question: '', // 需要回答的问题
      questionid: '', // 问题id
      answer: '', // 答案
      zijinPwd: '', // 资金密码
      maxErrorNum: 6, // 最大答错次数
      countError: 0, // 连续答错次数

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
    let query = this.$route.query;
    this.username = query.username,
    this.userBlance = query.blance,
    this.cash = query.cash,
    this.bankname = query.bankname,
    this.banknum = query.banknum,
    this.bankid = query.bankid,
    this.realname = query.realname,
    this.city = query.city
    this.getQuestion();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    handleGetSelected(val) {
      // console.log(val)
    },
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
            if(vm.questionArr.length === 0){
              vm.showWarningQueAlert = true;
              vm.$store.dispatch('setHeader', false)
            }
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
        vm.$store.dispatch('setLoading', true);
        vm.isClick = true;
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
              vm.$store.dispatch('setLoading', false);
            } else if (code == 301 || code == 303) {
              vm.isClick = false;
              vm.$store.dispatch('setLoading', false);
              vm.tipText = '对不起，参数错误'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            } else if (code == 302) {
              vm.isClick = false;
              vm.$store.dispatch('setLoading', false);
              vm.countError += 1;
              vm.tipText = `答案错误，还有${vm.maxErrorNum-vm.countError}次机会`;
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            }
          },
          (error) => {
            vm.$store.dispatch('setLoading', false);
            vm.isClick = false;
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
                  vm.$store.dispatch('setLoading', false);
                } else if (code == 200) {
                  vm.withdrawFn();
                } else if(code == 305) {
                  vm.isClick = false;
                  vm.$store.dispatch('setLoading', false);
                  vm.tipText = '密码错误'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 306) {
                  vm.$store.dispatch('setLoading', false);
                  vm.isClick = false;
                  vm.tipText = '用户被禁'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 304) {
                  vm.$store.dispatch('setLoading', false);
                  vm.isClick = false;
                  vm.tipText = '用户不存在'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                }
              },
              (error) => {
                vm.$store.dispatch('setLoading', false);
                console.log('数据异常', error)
              }
            )
          }else if (code == 103 || code == 106 || code == 101) {
            request.loginAgain(vm);
            vm.$store.dispatch('setLoading', false);
          }else{
            vm.isClick = false;
            vm.$store.dispatch('setLoading', false);
          }
        },
        (error) => {
          vm.$store.dispatch('setLoading', false);
          vm.isClick = false;
        }
      )
    },
    // 验证通过，提现函数
    withdrawFn() {
      const vm = this;
      let param = {
        cardid: vm.bankid,
        cash_apply: vm.cash
      };
      request.http(
        'get',
        '/user/stackcount/list',
        {
          status: '0'
        },
        (success) => {
          vm.$store.dispatch('setLoading', false);
          // console.log(success)
          let code = success.returncode;
          if(code == 200){
            if(success.data.length === 0){
              request.http(
                'post',
                '/user/trade/withdraw',
                paramCryptFn(param),
                (success) => {
                  // console.log(success)
                  vm.isClick = false;
                  if(success.returncode === 200){
                    vm.tipText = '提现成功'
                    setTimeout(() => {
                      vm.tipText = '';
                      vm.$router.back(-1);
                    }, vm.tipTimeOut*1000);
                  }else if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                    request.loginAgain(vm);
                  }else{
                    vm.tipText = success.data.message;
                    setTimeout(() => {
                      vm.tipText = '';
                    }, vm.tipTimeOut*2000);
                  }
                },
                (error) => {}
              )
            }else{
              vm.tipText = '打码量不满足要求!'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            }
          }else if (code == 103 || code == 106 || code == 101) {
            request.loginAgain(vm);
          }else{
            vm.isClick = false;
          }
        },
        (error) => {
          vm.$store.dispatch('setLoading', false);
          vm.isClick = false;
        }
      )
    },
    // 阻止事件捕获
    handleClickContent(e) {
      e.stopImmediatePropagation();
    },
    // 隐藏弹框
    handleHideDialog(val, e) {
      this[val] = false;
      this.$store.dispatch('setHeader', true)
      this.toSetQue(e);
      // document.getElementsByClassName('myMain')[0].style.zIndex = 5;
    },
    // 去往设置密保页
    toSetQue(e) {
      e.stopPropagation();
      this.showWarningQueAlert = false;
      this.$store.dispatch('setHeader', true)
      // document.getElementsByClassName('myMain')[0].style.zIndex = 5;
      this.$router.push({
        name: 'mbwt'
      })
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
  .yhk-warning-dialog{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    z-index:99;
    .dialog-content{
      height:6.12rem;
      width:6.9rem;
      position: absolute;
      left:0;
      top:0;
      right:0;
      bottom:0;
      background: #1E1E28;
      border-radius: .16rem;
      margin: auto;
      font-size:.32rem;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:start;
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
      p{
        display:block;
      }
      .warning-icon-p{
        margin-top:.6rem;
        .warning-icon{
          display:block;
          width:1.4rem;
          height:1.4rem;
          background:#c7c7c7;
          border-radius:50%;
          overflow:hidden;
        }
      }
      .warning-text-p{
        margin-top:.3rem;
        margin-bottom:1.2rem;
        width:5.44rem;
        line-height:.6rem;
        text-align:center;
      }
      .warning-btn-p{
        // margin-bottom:.6rem;
        button{
          width:4.4rem;
          height:.88rem;
          line-height:.88rem;
          background:#C83C4A;
          margin:0;
        }
      }
    }
  }
}
</style>


