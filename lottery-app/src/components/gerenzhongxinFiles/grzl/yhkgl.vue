<template>
  <div class="yhkgl-wrap">
    <h2 class="yhk-title-wrap"><em></em>银行卡绑定规则</h2>
    <div class="yhk-rule-wrap">
      <p>一个游戏账户最多绑定 <em>{{maxBindNum}}张</em>银行卡，您目前绑定了<em>{{bankcardList.length}}张</em>卡，还可以绑定 <em>{{maxBindNum-bankcardList.length}}张</em>卡。</p>
      <p>发起第一次提现后，系统会自动锁定银行卡。</p>
      <p>为了您的账户资金安全，银行卡“新增”和“修改”将在操作完成2小时0分后，新卡才能发起“向平台提现”。</p>
    </div>
    <div class="split-bar yhk-rule-split-bar"></div>
    <button class="create-yhk" v-if="bankcardList.length<maxBindNum" @click="createBankCarFn">新增银行卡</button>
    <button class="lock-yhk" v-if="setOprateBtn" @click="lockBankCarFn(1)">锁定银行卡</button>
    <button class="lock-yhk" v-if="!setOprateBtn" @click="lockBankCarFn(0)">解锁银行卡</button>
    <h2 class="yhk-title-wrap"><em></em>银行卡管理</h2>
    <p class="emptyBank" v-if="bankcardList.length===0">还没有绑定过银行卡</p>
    <ul class="yhk-list" v-if="bankcardList.length>0">
      <li v-for="(bank, bi) in bankcardList" :key="bi">
        <table>
          <thead>
            <tr>
              <td colspan="2">{{bank.bank[0].bank_name}}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-title">卡号</td>
              <td>{{renderBanknum(bank.card_no)}}</td>
              <!-- <td>**** **** **** {{bank.card_no.slice(-4)}}</td> -->
            </tr>
            <tr>
              <td class="td-title">绑定时间</td>
              <td>{{moment(bank.create_at).format('YYYY年MM月DD日， HH:mm:ss')}}</td>
            </tr>
            <tr>
              <td class="td-title">状态</td>
              <td>{{bank.status===0?'未锁定':'锁定'}}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">
                <span class="delete-span" @click="deleteBankCard(bank._id)">删除</span>
                <span class="edit-span" @click="updateBankCard(bank._id)">修改</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </li>
    </ul>
    <!-- <div class="yhk-warning-dialog" v-if="showWarningPwdAlert" @click="handleHideDialog('showWarningPwdAlert')"> -->
    <div class="yhk-warning-dialog" v-if="showWarningPwdAlert">
      <div class="dialog-bj"></div>
      <div class="dialog-content" @click="handleClickContent($event)">
        <em class="close-em" @click="handleHideDialog('showWarningPwdAlert')">×</em>
        <p class="warning-icon-p"><span class="warning-icon"></span></p>
        <p class="warning-text-p">
          您还未设置资金密码！这导致您的账号存在风险！
        </p>
        <p class="warning-btn-p"><button @click="toSetPwd($event)">前往设置</button></p>
      </div>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <!-- <div class="yhk-warning-dialog" v-if="showWarningQueAlert" @click="handleHideDialog('showWarningQueAlert')"> -->
    <div class="yhk-warning-dialog" v-if="showWarningQueAlert">
      <div class="dialog-bj"></div>
      <div class="dialog-content" @click="handleClickContent($event)">
        <em class="close-em" @click="handleHideDialog('showWarningQueAlert')">×</em>
        <p class="warning-icon-p"><span class="warning-icon"></span></p>
        <p class="warning-text-p">
          您还未设置密保问题！这导致您的账号存在风险！
        </p>
        <p class="warning-btn-p"><button @click="toSetQue($event)">前往设置</button></p>
      </div>
    </div>
    <!-- <div class="yhk-question-dialog" v-if="showQuestionDialog" @click="handleHideDialog('showQuestionDialog')"> -->
    <div class="yhk-question-dialog" v-if="showQuestionDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content" @click="handleClickContent($event)">
        <em class="close-em" @click="handleHideDialog('showQuestionDialog')">×</em>
        <p class="question-title">为了您的资金安全，请验证您的口令</p>
        <p class="question-name">问题：{{question}}</p>
        <div class="answer">
          <span>答案：</span>
          <input type="text" v-model="answer">
        </div>
        <p class="remind-text">连续输错超过 {{maxErrorNum}}次 系统将强制登出并冻结帐号</p>
        <p class="error-text">{{errorText}}</p>
        <p class="warning-btn-p"><button @click="questionConfirmFn($event)">确定</button></p>
      </div>
    </div>
    <div class="yhk-question-dialog" v-if="showCheckInZIjinPwdDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content" @click="handleClickContent($event)">
        <em class="close-em" @click="handleHideDialog('showCheckInZIjinPwdDialog')">×</em>
        <p class="question-title" style="margin-top:1rem">为了您的操作安全，请验证您的资金密码和银行卡号</p>
        <div class="answer">
          <span>银行卡号：</span>
          <input type="text" v-model="bankNum" placeholder="请输入银行卡号">
        </div>
        <div class="answer">
          <span>开户人姓名：</span>
          <input type="text" v-model="realname" placeholder="请输入开户人姓名">
        </div>
        <div class="answer">
          <span>资金密码：</span>
          <input type="password" v-model="zijinPwd" placeholder="请输入资金密码">
        </div>
        <p class="remind-text">连续输错超过 {{maxErrorNum}}次 系统将强制登出并冻结帐号</p>
        <p class="error-text">{{errorText}}</p>
        <p class="warning-btn-p" v-if="oprateType==='删除'"><button :disabled="isClick" @click="checkInZijinPwdFn($event, '删除')">确定</button></p>
        <p class="warning-btn-p" v-if="oprateType==='修改'"><button :disabled="isClick" @click="checkInZijinPwdFn($event, '修改')">确定</button></p>
        <p class="warning-btn-p" v-if="oprateType==='锁定'"><button :disabled="isClick" @click="checkInZijinPwdFn($event, '锁定')">确定</button></p>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import moment from 'moment';
export default {
  name: 'yhkgl',
  data() {
    return {
      isClick: false,
      moment: moment,
      oprateType: '删除',
      isSetPwd: false, // 是否设置密码
      isSetQue: false, // 是否设置密保
      showWarningPwdAlert: false, // 显示设置密码提醒弹框
      showWarningQueAlert: false, // 显示设置密保提醒弹框
      showQuestionDialog: false, // 显示问题弹框
      showCheckInZIjinPwdDialog: false, // 显示验证资金弹框
      zijinPwd: '', // 资金密码
      maxBindNum: 4, // 最大绑定银行卡数量
      bankcardList: [], // 绑定过的银行卡列表
      questionArr: [], // 所有问题
      defaultAnswer: '1',
      question: '', // 需要回答的问题
      questionid: '', // 问题id
      answer: '', // 答案
      maxErrorNum: 6, // 最大答错次数
      countError_ans: 0, // 连续答错次数 验证答案
      countError_zijin: 0, // 连续答错次数 验证资金
      errorText: '', // 错误提示
      tipTextTime: 1.5, // 问题提示显示时间 单位 s

      bankCardId: '', // 银行卡id
      bankNum: '', // 银行卡号
      realname: '', // 开户名

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '银行卡管理');
    this.getBankCardList();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 渲染银行卡号
    renderBanknum(num) {
      let n = [];
      let len = num.length - 1;
      for(let i=0; i<=len; i++){
        if(i < len-4){
          if(i !== 0 && i%4 === 0){
            n.push(' ')
            n.push('*')
          }else{
            n.push('*')
          }
        }else{
          if(i !== 0 && i%4 === 0){
            n.push(' ')
            n.push(num[i])
          }else{
            n.push(num[i])
          }
        }
      }
      return n.join('');
    },
    // 设置操作按钮的状态
    setOprateBtn() {
      if(this.bankcardList.length === 0){
        return false;
      }else{
        return this.bankcardList[0].status === 1;
      }
    },
    // 判断银行卡是否锁定
    checkInIsBankLock() {
      const vm = this;
      if(this.setOprateBtn()){
        vm.tipText = '银行卡已锁定，请先解锁银行卡'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      }else{
        return true;
      }
    },
    // 获取银行卡列表
    getBankCardList() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/list',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.bankcardList = success.data.bankcards;
            // vm.showBank = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
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
    // 获取是否设置了密码字段
    checkIsSetPwdFn() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/password/isSet',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.isSetPwd = success.data.isSet;
            vm.setAlert('isSetPwd')
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取是否设置了密保字段
    checkIsSetQuestionFn() {
      const vm = this;
      request.http(
        'get',
        '/user/bankcard/safe/question/isSet',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.isSetQue = success.data.isSet;
            vm.setAlert('isSetQue')
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 根据返回的值 弹出对应的弹框
    setAlert(val) {
      if(val === 'isSetPwd'){
        if(this[val]){
          this.checkIsSetQuestionFn();
        }else{
          this.showWarningPwdAlert = true;
        }
      }else{
        if(this[val]){
          this.showQuestionDialog = true;
          this.getQuestion();
        }else{
          this.showWarningQueAlert = true;
        }
      }
      // document.getElementsByClassName('myMain')[0].style.zIndex = 99;
      this.$store.dispatch('setHeader', false)
    },
    // 新增银行卡
    createBankCarFn() {
      if(!this.checkInIsBankLock()){
        return false;
      }
      this.checkIsSetPwdFn();
    },
    // 锁定银行卡
    lockBankCarFn(val) {
      this.showCheckInZIjinPwdDialog = true;
      this.bankNum = '';
      this.realname = '';
      this.zijinPwd = '';
      this.oprateType = '锁定'
    },
    lockCallback() {
      // alert('锁定')
      this.isClick = false;
      this.showCheckInZIjinPwdDialog = false;
    },
    // 删除银行卡
    deleteBankCard(id) {
      this.bankCardId = id;
      this.oprateType = '删除';
      this.zijinPwd = '';
      if(!this.checkInIsBankLock()){
        return false;
      }else{
        this.showCheckInZIjinPwdDialog = true;
      }
    },
    deleteCallback() {
      const vm = this;
      request.http(
        'post',
        '/user/bankcard/update',
        {
          _id: vm.bankCardId,
          card_no: vm.bankNum,
          realname: vm.realname,
          is_deleted: '1'
        },
        (success) => {
          // console.log(success)
          vm.isClick = false;
          if (success.returncode && success.returncode == 200) {
            vm.getBankCardList();
            vm.showCheckInZIjinPwdDialog = false;
            vm.tipText = '删除成功';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*1000);
            // vm.showBank = true;
          } else {
            vm.tipText = '资料不正确';
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
    },
    // 修改银行卡
    updateBankCard(id) {
      this.bankCardId = id;
      this.oprateType = '修改';
      this.zijinPwd = '';
      if(!this.checkInIsBankLock()){
        return false;
      }else{
        this.showCheckInZIjinPwdDialog = true;
      }
    },
    updateCallback() {
      // alert('修改')
      this.isClick = false;
      this.showCheckInZIjinPwdDialog = false;
    },
    // 隐藏弹框
    handleHideDialog(val) {
      this[val] = false;
      this.$store.dispatch('setHeader', true)
      // document.getElementsByClassName('myMain')[0].style.zIndex = 5;
    },
    // 验证答案
    questionConfirmFn(e) {
      e.stopPropagation();
      const vm = this;
      if (this.answer === '') {
        this.errorText = '答案不能为空';
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
        return false;
      } else if (this.countError_ans >= this.maxErrorNum) {
        this.errorText = '错误次数已达上限，请修改问题';
        this.countError_ans = this.maxErrorNum;
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
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
              vm.showQuestionDialog = false;
              vm.$store.dispatch('setHeader', true)
              vm.$router.push({
                name: 'yhkbd1'
              })
            } else if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 301 || code == 303) {
              vm.errorText = '对不起，参数错误';
              setTimeout(()=>{
                vm.errorText = '';
              },vm.tipTextTime*1000)
            } else if (code == 302) {
              vm.countError_ans += 1;
              vm.errorText = `答案错误，还有${vm.maxErrorNum-vm.countError_ans}次机会`;
              setTimeout(()=>{
                vm.errorText = '';
              },vm.tipTextTime*1000)
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
    },
    // 验证资金
    checkInZijinPwdFn(e, type) {
      e.stopPropagation();
      const vm = this;
      if (this.bankNum === '') {
        this.errorText = '银行卡号不能为空';
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
        return false;
      } else if (this.realname === '') {
        this.errorText = '开户人姓名不能为空';
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
        return false;
      } else if (this.zijinPwd === '') {
        this.errorText = '资金密码不能为空';
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
        return false;
      } else if (this.countError_zijin >= this.maxErrorNum) {
        this.errorText = '错误次数已达上限，请修改资金密码';
        this.countError_zijin = this.maxErrorNum;
        setTimeout(()=>{
          vm.errorText = '';
        },vm.tipTextTime*1000)
        return false;
      } else {
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
                  let code = success.returncode;
                  if (code == 103 || code == 106 || code == 101) {
                    request.loginAgain(vm);
                    vm.isClick = false;
                  } else if (code == 200) {
                    // vm.tipText = '用户不存在'
                    // setTimeout(() => {
                    //   vm.tipText = '';
                    // }, vm.tipTimeOut*1000*1000);
                    if (type === '锁定') {
                      vm.lockCallback();
                    } else if (type === '删除') {
                      vm.deleteCallback();
                    } else if (type === '修改') {
                      vm.updateCallback();
                    }
                  } else if(code == 305) {
                    vm.isClick = false;
                    vm.tipText = '密码错误'
                    setTimeout(() => {
                      vm.tipText = '';
                    }, vm.tipTimeOut*1000*1000);
                  } else if(code == 306) {
                    vm.isClick = false;
                    vm.tipText = '用户被禁'
                    setTimeout(() => {
                      vm.tipText = '';
                    }, vm.tipTimeOut*1000);
                  } else if(code == 304) {
                    vm.isClick = false;
                    vm.tipText = '用户不存在'
                    setTimeout(() => {
                      vm.tipText = '';
                    }, vm.tipTimeOut*1000);
                  }else{
                    vm.isClick = false;
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
    // 去往设置密码页
    toSetPwd(e) {
      e.stopPropagation();
      this.showWarningPwdAlert = false;
      this.$store.dispatch('setHeader', true)
      // document.getElementsByClassName('myMain')[0].style.zIndex = 5;
      this.$router.push({
        name: 'mmgl',
        query: {
          from: 'yhkgl'
        }
      })
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
    // 阻止事件捕获
    handleClickContent(e) {
      e.stopImmediatePropagation();
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.yhkgl-wrap{
  h2.yhk-title-wrap{
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
  .yhk-rule-wrap{
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
  .yhk-rule-split-bar{
    margin-bottom:.6rem;
  }
  button{
    display:block;
    width:4.4rem;
    height:.8rem;
    border-radius: .08rem;
    margin:0 1.55rem;
    margin-bottom:.3rem;
    font-size:.32rem;
    line-height:.8rem;
  }
  button.create-yhk{
    background: #2D996E;
  }
  button.lock-yhk{
    background: #C83C4A;
  }
  .yhk-list{
    width:6.9rem;
    margin:0 .3rem;
    li{
      width: 100%;
      background: #292932;
      border: .02rem solid #303040;
      border-radius: .08rem;
      overflow: hidden;
      margin-bottom:.3rem;
    }
    table{
      width:100%;
      border-collapse: collapse;
      thead{
        td{
          text-align:center;
        }
      }
      tr{
        height:1rem;
        border-bottom: .02rem solid #303040;
        td{
          padding:.3rem 0;
          padding-left:.3rem;
        }
        td.td-title{
          width:1.72rem;
          border-right: .02rem solid #303040;
        }
      }
      tfoot{
        tr{
          height:1.24rem;
          border-bottom:none;
        }
        td{
          span{
            width:1.52rem;
            height:.64rem;
            float:right;
            margin-right:.3rem;
            text-align:center;
            line-height:.64rem;
            border-radius: .08rem;
          }
          .delete-span{
            color:#777;
            border: .01rem solid #777;
          }
          .edit-span{
            color:#C83C4A;
            border: .01rem solid #C83C4A;
          }
        }
      }
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
  .yhk-question-dialog{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    z-index:99;
    .dialog-content{
      height:6.31rem;
      p{
        font-size:.28rem;
        text-align:center;
        display:block;
      }
      p.question-title{
        font-size:.32rem;
        color:#C83C4A;
        font-weight:600;
        margin-top:.3rem;
      }
      p.question-name{
        margin-top:.6rem;
      }
      .answer{
        width:6.3rem;
        margin-top:.3rem;
        height:.88rem;
        background: #292932;
        border-radius: .08rem;
        overflow: hidden;
        display:-webkit-box;
        -webkit-box-align:center;
        font-size:.28rem;
        span{
          display:block;
          margin-left:.3rem;
        }
        input{
          display:block;
          height:100%;
          -webkit-box-flex:1;
          padding-right:.3rem;
          padding-left:.1rem;
          outline: none;
          border: none;
          background: #292932;
          color:#c7c7c7;
        }
      }
      p.remind-text{
        color:#646464;
        margin-top:.3rem;
      }
      .error-text{
        position: absolute;
        width:100%;
        bottom:2.04rem;
        left:0;
        text-align:center;
        color:#C83C4A;
      }
      p.warning-btn-p{
        margin-top:1.2rem;
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


