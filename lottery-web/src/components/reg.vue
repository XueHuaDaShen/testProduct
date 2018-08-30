<template>
  <div class="hello">
    <header class="header">
      <div>
        <a class="nav-left" href="/">
          <img src="../img/logo.png">
        </a>
        <router-link :to="{name:'download'}" class="download">下载中心</router-link>
        <a @click="open" class="server">联系客服</a>
      </div>
    </header>
    <div class="content-wrap" v-loading="loading">
      <div class="content">
        <div class="login-wrap animated" :class="animated?'bounceOutLeft':''">
          <div class="login-title">
            <span>注册</span>
          </div>
          <div class="user-info">
            <span class="icon-user">
              <img src="../img/icon-user.png">
            </span>
            <input type="text" v-model.trim="loginName" placeholder="请输入您的用户名">
          </div>
          <div class="user-info">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" name="pwd" autocomplete="off" v-model.trim="loginPwd" placeholder="请输入您的密码">
          </div>
          <div class="user-info">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" name="pwd" autocomplete="off" v-model.trim="repeatPwd" placeholder="请确认您的密码">
          </div>
          <div class="login-btn-wrap">
            <span>{{tip}}</span>
            <button class="login-btn" @click="handleReg" :disabled="isClick">注册</button>
          </div>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from './footer';
  import request from '../axios/axios.js'
  import MD5 from 'MD5'
  import paramCryptFn from '../lib/cryptData'
  import * as validator from '../lib/utils/validator'
  export default {
    name: 'HelloWorld',
    components: {
      myFooter
    },
    created() {
      // this.showInputFn();
      const vm = this;
      // this.animated = true;
      // setTimeout(() => {
      //   vm.animated = false;
      // }, 1000);
      this.handleKeyup();
      // console.log(this.$route,this.$route.params[0])
    },
    data() {
      return {
        showInput: false,
        loading: false,
        tip: '',
        loginArr: [
          { title: '登录', checked: true },
          { title: '注册', checked: false }
        ],
        loginName: '',
        loginPwd: '',
        repeatPwd: '',
        isClick: false,
        animated: false,
        duration: 1000,
        inviteCode: '',
      }
    },
    methods: {
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow',
          'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      },
      error() {
        const vm = this;
        this.$message({
          message: '请求错误',
          type: 'error',
          duration: vm.duration
        })
      },
      // handleChangemyTableTipTitle(item) {
      //   this.loginArr.filter(v => {
      //     v.checked = false;
      //   })
      //   this.loginName = '';
      //   this.loginPwd = '';
      //   this.repeatPwd = '';
      //   item.checked = true;
      //   // this.showInputFn();
      // },
      showInputFn() {
        const vm = this;
        this.showInput = false;
        setTimeout(() => {
          vm.showInput = true;
        }, 20);
      },
      handleKeyup() {
        const vm = this;
        document.onkeyup = function(e) {
          // console.log(e.keyCode)
          if (e.keyCode == 13) {
            vm.handleReg();
          }
        }
      },
      handleReg() {
        const vm = this;
        this.inviteCode = this.$route.params[0];
        if (this.inviteCode === '') {
          alert('缺少邀请码，无法注册！')
          return false;
        } else if (this.loginName === '') {
          this.tip = '请输入您的用户名'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (!validator.regexpInput(this.loginName)) {
          this.tip = '用户名需3-16位字符，只能包含英文字母或数字'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (this.loginPwd === '') {
          this.tip = '请输入您的密码'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (!validator.regexpPsd(this.loginPwd)) {
          this.tip = '密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (this.repeatPwd === '') {
          this.tip = '请确认您的密码'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (!validator.regexpPsd(this.repeatPwd)) {
          this.tip = '确认密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (this.repeatPwd !== this.loginPwd) {
          this.tip = '两次密码不一致'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else {
          this.loading = true;
          var data = {
            loginname: vm.loginName,
            password: MD5(vm.loginPwd),
            code: vm.inviteCode
          }
          request.login(
            'post',
            '/user/register',
            paramCryptFn(data),
            (success) => {
              let code = success.returncode;
              vm.loading = false;
              if (code == '305') {
                vm.tip = '用户名已存在';
                setTimeout(function() {
                  vm.tip = '';
                }, 2000)
              } else if (code == '301') {
                vm.tip = '参数错误或者邀请码错误';
                setTimeout(function() {
                  vm.tip = '';
                }, 2000)
              } else if (code == '200') {
                localStorage.setItem('islogout', false);
                localStorage.setItem('A-TOKEN', success.data.token);
                localStorage.setItem('refund', success.data.refund || 0);
                localStorage.setItem('blance', success.data.cash || 0);
                vm.$store.dispatch('setBlance', success.data.cash || 0);
                localStorage.setItem('bodyBG', 'default');
                vm.$store.dispatch('setbodyBG', 'default');
                localStorage.setItem('loginname', vm.loginName);
                vm.$router.push({ name: 'home' })
              } else {
                vm.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            },
            (error) => {
              vm.error();
              vm.loading = false;
              console.log('/user/login---error', error)
            }
          )
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-wrap {
    width: 100%;
    color: #fff;
    background: #2d3236;
  }

  .content {
    width: 100%;
    height: 940px;
    padding-top: 287px;
    background: url("../img/bj.png") no-repeat;
    background-size: cover;
    position: relative;
  }

  .login-wrap {
    margin: auto;
    width: 540px;
    min-height: 400px;
    background: #FFFFFF;
    border: 6px solid #979797;
    padding: 39px 50px;
    display: -webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
  }

  .login-wrap input,
  .login-wrap button {
    border: none;
    outline: none;
  }

  .login-title {
    width: 100%;
    display: -webkit-box;
  }

  .login-title span {
    color: #D4914D;
    font-size: 26px;
  }

  /* .login-title span {
    width: 110px;
    height: 50px;
    display: block;
    text-align: center;
    line-height: 50px;
    background: #E4E4E4;
    font-size: 16px;
    color: #000000;
    letter-spacing: 1px;
    cursor: pointer;
  }

  .login-title span.checked {
    background: #D4914D;
    color: #FFFFFF;
  } */

  .user-info {
    width: 100%;
    height: 50px;
    border: 1px solid #979797;
    position: relative;
    margin-top: 30px;
  }

  .user-info input {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 14px;
    padding-left: 38px;
  }

  .user-info span {
    position: absolute;
    display: block;
  }

  .user-info span img {
    width: 100%;
    height: 100%;
  }

  .user-info .icon-user {
    width: 13px;
    height: 16px;
    left: 15px;
    top: 17px;
  }

  .user-info .icon-pwd {
    width: 15px;
    height: 20px;
    left: 14px;
    top: 15px;
  }

  .login-btn-wrap {
    padding-top: 40px;
    position: relative;
  }

  .login-btn-wrap span {
    position: absolute;
    color: #F56C6C;
    font-size: 12px;
    width: 100%;
    text-align: center;
    top: 10px;
    left: 0;
  }

  .login-btn {
    width: 100%;
    height: 60px;
    background: #1B1B1B;
    font-size: 18px;
    color: #FFFFFF;
    letter-spacing: 1.12px;
    cursor: pointer;
  }

  .header {
    width: 100%;
    height: 80px;
    background: #1B1B1B;
  }

  .header>div {
    width: 1024px;
    height: 100%;
    margin: 0 auto;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
  }

  .header>div a {
    font-size: 16px;
    color: #777777;
    letter-spacing: 1px;
    text-decoration: none;
  }

  .nav-left {
    width: 173.9px;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .nav-left>img {
    width: 100%;
    height: auto;
  }

  .server {
    margin-left: 35px;
  }
</style>