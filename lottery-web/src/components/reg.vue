<template>
  <div class="hello">
    <header class="header">
      <div>
        <a class="nav-left" href="/">
          <img src="../assets/img/Logo@3x.png">
        </a>
        <router-link :to="{name:'download'}" class="download"><img src="../img/xiazai-icon.png" class="xiazai-icon">下载中心</router-link>
        <a @click="open" class="server"><img src="../img/kefu-icon.png" class="kefu-icon">联系客服</a>
      </div>
    </header>
    <div class="content-wrap" v-loading="loading">
      <div class="content">
        <div class="login-wrap animated" :class="animated?'bounceOutLeft':''">
          <div class="login-title">
            <span><img src="../img/login-logo.png"></span>
          </div>
          <div class="alert-tip" v-if="tip"><span>{{tip}}</span></div>
          <div class="user-info">
            <span class="icon-user">
              <img src="../img/icon-user.png">
            </span>
            <input type="text" @focus="handleFocusInput('name')" @blur="handleBlurInput" v-model.trim="loginName" placeholder="请输入您的用户名">
          </div>
          <div class="user-info">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" @focus="handleFocusInput('pwd')" @blur="handleBlurInput" name="pwd" autocomplete="off" v-model.trim="loginPwd" placeholder="请输入您的密码">
          </div>
          <div class="user-info">
            <span class="icon-pwd">
              <img src="../img/icon-pwd.png">
            </span>
            <input type="password" @focus="handleFocusInput('pwd')" @blur="handleBlurInput" name="pwd" autocomplete="off" v-model.trim="repeatPwd" placeholder="请确认您的密码">
          </div>
          <div class="captcha-info" v-if="captcha">
            <span class="icon-captcha">
              <img src="../img/icon-captcha.png">
            </span>
            <span class="captcha-svg" @click="getCaptcha" v-html="captcha">
            </span>
            <input type="text" autocomplete="off" v-model.trim="loginCaptcha" placeholder="请输入验证码">
          </div>
          <div class="login-btn-wrap">
            <!-- <span class="tip-text">{{tip}}</span> -->
            <button class="login-btn" @click="handleReg" :disabled="isClick">
              <span class="btn-text">注册</span>
              <i></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from "./footer";
  import request from "../axios/axios.js";
  import MD5 from "MD5";
  import paramCryptFn from "../lib/cryptData";
  import * as validator from "../lib/utils/validator";
  export default {
    name: "HelloWorld",
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
      this.getCaptcha();
      // console.log(this.$route,this.$route.params[0])
    },
    data() {
      return {
        showInput: false,
        loading: false,
        tip: "",
        tipTime: 2, //s
        loginArr: [
          { title: "登录", checked: true },
          { title: "注册", checked: false }
        ],
        loginName: "",
        loginPwd: "",
        loginCaptcha: "",
        repeatPwd: "",
        isClick: false,
        animated: false,
        duration: 1000,
        inviteCode: "",

        guid: '',
        captcha: '',
      };
    },
    methods: {
      open() {
        window.open(
          "https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1",
          "newwindow",
          "height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
        );
      },
      error() {
        const vm = this;
        this.$message({
          message: "请求错误",
          type: "error",
          duration: vm.duration
        });
      },
      // 生成 UUID
      getGuid() {
        // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) { 
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); 
          return v.toString(16);
        })
      },
      getCaptcha() {
        const vm = this;
        vm.guid = vm.getGuid();
        // console.log(vm.guid);
        request.http(
          'get',
          '/user/captcha', {id: vm.guid},
          (success) => {
            // console.log(success);
            vm.captcha = success;
          },
          (error) => {
            console.log(error)
          }
        )

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
        };
      },
      handleFocusInput(type) {
        if(type === 'name'){
          this.tip = "用户名需3-16位字符，只能包含英文字母或数字";
        }else{
          this.tip = "密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同";
        }
      },
      handleBlurInput() {
        this.tip = "";
      },
      handleReg() {
        // console.log("loginName", this.loginName + "loginName");
        // console.log("loginPwd", this.loginPwd + "loginPwd");
        const vm = this;
        this.inviteCode = this.$route.params[0];
        // this.inviteCode = 'bj1yke8px';
        if(this.tip !== ''){
          return false;
        }
        if (this.inviteCode === "") {
          alert("缺少邀请码，无法注册！");
          return false;
        } else if (this.loginName === "") {
          this.tip = "请输入您的用户名";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (!validator.regexpInput(this.loginName)) {
          this.tip = "用户名需3-16位字符，只能包含英文字母或数字";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (this.loginPwd === "") {
          this.tip = "请输入您的密码";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (!validator.regexpPsd(this.loginPwd)) {
          this.tip = "密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (this.repeatPwd === "") {
          this.tip = "请确认您的密码";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (!validator.regexpPsd(this.repeatPwd)) {
          this.tip =
            "确认密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (this.repeatPwd !== this.loginPwd) {
          this.tip = "两次密码不一致";
          setTimeout(() => {
            vm.tip = "";
          }, vm.tipTime*1000);
        } else if (this.loginCaptcha === '') {
          this.tip = '请输入验证码'
          setTimeout(() => {
            vm.tip = '';
          }, vm.tipTime*1000);
        } else {
          this.loading = true;
          var data = {
            loginname: vm.loginName,
            password: MD5(vm.loginPwd),
            code: vm.inviteCode,
            captcha: vm.loginCaptcha,
            id: vm.guid
          };
          request.login(
            "post",
            "/user/register",
            paramCryptFn(data),
            success => {
              let code = success.returncode;
              vm.loading = false;
              if (code == "305") {
                vm.tip = "用户名已存在";
                setTimeout(function() {
                  vm.tip = "";
                }, 2000);
              } else if (code == "301") {
                vm.tip = "参数错误或者邀请码错误";
                setTimeout(function() {
                  vm.tip = "";
                }, 2000);
              } else if (code == '302') {
                vm.tip = '验证码错误';
                vm.getCaptcha();
                setTimeout(function() {
                  vm.tip = '';
                }, 2000)
              } else if (code == '307') {
                vm.tip = '验证码过期';
                vm.getCaptcha();
                setTimeout(function() {
                  vm.tip = '';
                }, 2000)
              } else if (code == "200") {
                localStorage.setItem("islogout", false);
                localStorage.setItem("A-TOKEN", success.data.token);
                localStorage.setItem("refund", success.data.refund || 0);
                localStorage.setItem("blance", success.data.cash || 0);
                vm.$store.dispatch("setBlance", success.data.cash || 0);
                localStorage.setItem("bodyBG", "default");
                vm.$store.dispatch("setbodyBG", "default");
                localStorage.setItem("loginname", vm.loginName);
                vm.$router.push({ name: "home" });
              } else {
                vm.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            },
            error => {
              vm.error();
              vm.loading = false;
              console.log("/user/login---error", error);
            }
          );
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .content-wrap {
    width: 100%;
    color: #fff;
    /* background: #2d3236; */
    background: url("../img/login-bj.png") no-repeat;
    background-size: cover;
  }

  .content {
    width: 1024px;
    height: 940px;
    position: relative;
    margin:0 auto;
  }

  .login-wrap {
    margin: auto;
    width: 400px;
    height: 500px;
    /* background: #FFFFFF; */
    /* border: 6px solid #979797; */
    border-radius: 4px;
    // padding: 39px 50px;
    padding:30px;
    display: -webkit-box;
    position: absolute;
    overflow: hidden;
    // top:210px;
    // right:88px;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:auto;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    // box-shadow: 0 2px 50px 0 rgba(0,0,0,0.50);
    .login-bj{
      position: absolute;
      left:0;
      top:0;
      z-index:1;
      opacity: 0;
      background: #191919;
      width:100%;
      height:100%;
    }
    .alert-tip{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      background: rgba(0,0,0,0.90);
      border-radius: 2px;
      position: absolute;
      left:30px;
      top: 42px;
      width:340px;
      height:60px;
      text-align:center;
      // line-height:46px;
      color:#dcdcdc;
      font-size:14px;
      z-index:3;
      font-weight:700;
      padding:0 20px;
      span{
        display:block;
        width:100%;
      }
    }
  }

  .login-wrap input,
  .login-wrap button {
    border: none;
    outline: none;
  }

  .login-title {
    width: 100%;
    display: -webkit-box;
    -webkit-box-pack:center;
    font-size: 20px;
    color: #BCBCBC;
    position: relative;
    z-index:3;
    margin-bottom:20px;
  }

  .login-title span {
    display: block;
    width:210px;
    height:52px;
    img{
      display:block;
      width:100%;
      height:100%;
    }
    // color: #D4914D;
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
    height: 46px;
    border-radius: 2px;
    position: relative;
    margin-top: 10px;
    z-index:3;
  }

  .user-info input, .captcha-info input {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 16px;
    padding-left: 57px;
    position: relative;
    background: none;
    border-radius: 2px;
    color:#BD8454;
    font-weight:700;
    border: 2px solid #777777;
    &::-webkit-input-placeholder{
      font-size:14px;
      color:#777;
    }
    &:-moz-placeholder{
      font-size:14px;
      color:#777;
    }
    &::-moz-placeholder{
      font-size:14px;
      color:#777;
    }
    &:-ms-input-placeholder{
      font-size:14px;
      color:#777;
    }
    &:focus{
      background-color: rgba(0, 0, 0, 0.25);
    }
  }

  .user-info span {
    position: absolute;
    display: block;
    z-index:3;
  }

  .user-info span img {
    width: 100%;
    height: 100%;
  }

  .user-info .icon-user {
    width: 17px;
    height: 18px;
    left: 21px;
    top: 13px;
  }

  .user-info .icon-pwd {
    width: 17px;
    height: 21px;
    left: 21px;
    top: 11px;
  }
  .captcha-info{
    height: 46px;
    border-radius: 2px;
    position: relative;
    margin-top: 10px;
    z-index:3;
    span{
      position: absolute;
      display: block;
      z-index:3;
    }
    .icon-captcha{
      width: 17px;
      height: 21px;
      left: 21px;
      top: 11px;
      img{
        width:100%;
        height:100%;
      }
    }
    .captcha-svg{
      width: 150px;
      height: 50px;
      right: -17px;
      top: -2px;
      transform: scale(.7);
      cursor: pointer;
    }
  }

  .login-btn-wrap {
    padding-top: 30px;
    position: relative;
    z-index:3;
    button{
      width: 100%;
      height: 50px;
      font-size: 16px;
      border-radius:2px;
      letter-spacing: 1.12px;
      cursor: pointer;
      background:none;
      font-weight:600;
      position: relative;
      .btn-text{
        position: relative;
        z-index: 1;
      }
      i{
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-transition: all .3s;
        transition: all .3s;
        -webkit-transform: scale(0.8, 0.7);
        -moz-transform: scale(0.8, 0.7);
        -ms-transform: scale(0.8, 0.7);
        -o-transform: scale(0.8, 0.7);
        transform: scale(0.8, 0.7);
      }
    }
  }

  .login-btn-wrap .tip-text {
    position: absolute;
    color: #F56C6C;
    font-size: 12px;
    width: 100%;
    text-align: center;
    top: 10px;
    left: 0;
  }

  button.login-btn {
    border: 2px solid #BD8454;
    color: #BD8454;
    &:hover{
      .btn-text{
        color:#DCDCDC;
      }
      i{
        background: #BD8454;
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
      }
    }
  }
  button.reg-btn{
    border: 2px solid #DCDCDC;
    color: #DCDCDC;
    margin-top:10px;
    &:hover{
      .btn-text{
        color:#191919;
      }
      i{
        background: #DCDCDC;
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
      }
    }
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
    font-size: 14px;
    color: #fff;
    letter-spacing: 1px;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    .xiazai-icon{
      width:16px;
      height:18px;
      position: absolute;
      left:-21px;
      top:0;
    }
    .kefu-icon{
      width:20px;
      height:21px;
      position: absolute;
      left:-25px;
      top:-2px;
    }
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
    // height: 39px;
  }

  .server {
    margin-left: 65px;
  }
</style>