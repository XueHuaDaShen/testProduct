<template>
  <div class="hello">
    <header class="header">
      <div>
        <a class="nav-left" href="/">
          <img src="../assets/img/Logo@3x.png">
        </a>
        <router-link :to="{name:'download'}" class="download">下载中心</router-link>
        <a @click="open" class="server">联系客服</a>
      </div>
    </header>
    <!-- <div class="content-wrap" v-loading="loading">
      <div class="content">
        <div class="login-wrap animated" :class="animated?'bounceOutLeft':''">
          <div class="login-title">
            <span v-for="(item, index) in loginArr" :key="index" @click="handleChangemyTableTipTitle(item)" :class="item.checked?'checked':''">{{item.title}}</span>
          </div>
          <div class="user-info" v-if="showInput">
            <span class="icon-user">
              <img src="../img/icon-user.png">
            </span>
            <input type="text" v-model="loginName" placeholder="请输入您的用户名">
          </div>
          <div class="user-info" v-if="showInput">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" name="pwd" autocomplete="off" v-model="loginPwd" placeholder="请输入您的密码">
          </div>
          <div class="user-info" v-if="showInput&&loginArr[1].checked">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" name="pwd" autocomplete="off" v-model="repeatPwd" placeholder="请确认您的密码">
          </div>
          <div class="login-btn-wrap">
            <span>{{tip}}</span>
            <button class="login-btn" v-if="showInput&&loginArr[0].checked" @click="handleLogin" :disabled="isClick">登录</button>
            <button class="login-btn" v-if="showInput&&loginArr[1].checked" @click="handleReg" :disabled="isClick">注册</button>
          </div>
        </div>
      </div>
    </div> -->
    <div class="content-wrap" v-loading="loading">
      <div class="content">
        <div class="login-wrap animated" :class="animated?'bounceOutLeft':''">
          <div class="login-title">
            <span>登录</span>
          </div>
          <div class="user-info">
            <span class="icon-user">
              <img src="../img/icon-user.png">
            </span>
            <input type="text" v-model="loginName" placeholder="请输入您的用户名">
          </div>
          <div class="user-info">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" name="pwd" autocomplete="off" v-model="loginPwd" placeholder="请输入您的密码">
          </div>
          <div class="login-btn-wrap">
            <span>{{tip}}</span>
            <button class="login-btn" @click="handleLogin" :disabled="isClick">登录</button>
            <button style="margin-top:30px;background:#fff;color:#191919;border:1px solid #979797" class="login-btn" @click="toReg" :disabled="isClick">注册</button>
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
  export default {
    name: 'HelloWorld',
    components: {
      myFooter
    },
    created() {
      let islogout = localStorage.getItem('islogout')
      if (islogout === true) {
        this.$alert('您的登录已超时，请重新登录', '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            localStorage.setItem('islogout', false)
          }
        })
      }
      // this.showInputFn();
      // console.log(pubkey)
      const vm = this;
      // this.animated = true;
      // setTimeout(() => {
      //   vm.animated = false;
      // }, 1000);
      this.handleKeyup();
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
      }
    },
    methods: {
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
      //   this.showInputFn();
      // },
      // showInputFn() {
      //   const vm = this;
      //   this.showInput = false;
      //   setTimeout(() => {
      //     vm.showInput = true;
      //   }, 20);
      // },
      handleLogin() {
        const vm = this;
        if (this.loginName === '') {
          this.tip = '请输入您的用户名'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else if (this.loginPwd === '') {
          this.tip = '请输入您的密码'
          setTimeout(() => {
            vm.tip = '';
          }, 1000);
        } else {
          this.loading = true;
          request.login(
            'post',
            '/user/random',
            {
              loginname: vm.loginName
            },
            (success) => {
              if (success.returncode == '200') {
                let random = success.data.random;
                let new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginPwd).toString(), random).toString();
                var data = { loginname: vm.loginName, password: new_password }
                request.login(
                  'post',
                  '/user/login',
                  paramCryptFn(data),
                  (success) => {
                    let code = success.returncode;
                    vm.loading = false;
                    if (code == '304') {
                      vm.tip = '用户不存在';
                      setTimeout(function() {
                        vm.tip = '';
                      }, 2000)
                    } else if (code == '305') {
                      vm.tip = '密码错误';
                      setTimeout(function() {
                        vm.tip = '';
                      }, 2000)
                    } else if (code == '200') {
                      localStorage.setItem('islogout', false);
                      localStorage.setItem('A-TOKEN', success.data.token);
                      localStorage.setItem('loginname', vm.loginName);
                      vm.$router.push({ name: 'home' })
                      localStorage.setItem('refund', success.data.refund);
                      localStorage.setItem('blance', success.data.cash);
                      vm.$store.dispatch('setBlance', success.data.cash);
                      localStorage.setItem('bodyBG', 'default');
                      vm.$store.dispatch('setbodyBG', 'default');
                      // vm.getToken(success.data.token, vm.loginName);
                    } else if (code == '306') {
                      vm.tip = '您的账号被禁止登陆，请联系管理员';
                      setTimeout(function() {
                        vm.tip = '';
                      }, 2000)
                    } else if (code == '301') {
                      vm.tip = '系统错误，请联系管理员';
                      setTimeout(function() {
                        vm.tip = '';
                      }, 2000)
                    }
                  },
                  (error) => {
                    vm.error();
                    vm.loading = false;
                    console.log('/user/login---error', error)
                  }
                )
              } else {
                vm.error();
                vm.loading = false;
              }
              // console.log('/user/random---success', success)
            },
            (error) => {
              vm.error();
              vm.loading = false;
              console.log('/user/random---error', error)
            }
          )
        }
      },
      // handleKeyup() {
      //   const vm = this;
      //   document.onkeyup = function(e) {
      //     // console.log(e.keyCode)
      //     if (e.keyCode == 13) {
      //       if (vm.loginArr[0].checked) {
      //         vm.handleLogin();
      //       } else {
      //         vm.handleReg();
      //       }
      //     }
      //   }
      // },
      handleKeyup() {
        const vm = this;
        document.onkeyup = function(e) {
          // console.log(e.keyCode)
          if (e.keyCode == 13) {
            vm.handleLogin();
          }
        }
      },
      toReg() {
        let reg = 'http://www.8bw.vip/#/reg/0qug9eawf7';
        location.href = reg;
      },
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      }
      // handleReg() {
      //   const vm = this;
      //   if (this.loginName === '') {
      //     this.tip = '请输入您的用户名'
      //     setTimeout(() => {
      //       vm.tip = '';
      //     }, 1000);
      //   } else if (this.loginPwd === '') {
      //     this.tip = '请输入您的密码'
      //     setTimeout(() => {
      //       vm.tip = '';
      //     }, 1000);
      //   } else if (this.repeatPwd === '') {
      //     this.tip = '请确认您的密码'
      //     setTimeout(() => {
      //       vm.tip = '';
      //     }, 1000);
      //   } else if (this.repeatPwd !== this.loginPwd) {
      //     this.tip = '两次密码不一致'
      //     setTimeout(() => {
      //       vm.tip = '';
      //     }, 1000);
      //   } else {
      //     this.loading = true;
      //     request.login(
      //       'post',
      //       '/user/register',
      //       {
      //         loginname: vm.loginName,
      //         password: MD5(vm.loginPwd)
      //       },
      //       (success) => {
      //         let code = success.returncode;
      //         vm.loading = false;
      //         if (code == '305') {
      //           vm.tip = '用户名已存在';
      //           setTimeout(function() {
      //             vm.tip = '';
      //           }, 2000)
      //         } else if (code == '200') {
      //           localStorage.setItem('A-TOKEN', success.data.token);
      //           localStorage.setItem('loginname', vm.loginName);
      //           vm.$router.push({ name: 'home' })
      //         }
      //       },
      //       (error) => {
      //         vm.error();
      //         vm.loading = false;
      //         console.log('/user/login---error', error)
      //       }
      //     )
      //   }
      // },
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
    cursor: pointer;
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
    height: 39px;
  }

  .server {
    margin-left: 35px;
  }
</style>