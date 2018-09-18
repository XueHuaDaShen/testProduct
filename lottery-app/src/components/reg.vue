<template>
  <div class="login-wrap">
    <span class="back left-sanjiao" @click="toBack"></span>
    <div class="logo-wrap"><span class="logo"></span></div>
    <p class="login-title">会员注册</p>
    <div class="login-data">
      <!-- <form action=""> -->
        <div class="user-wrap username">
          <span class="user-icon"><img src="@/assets/img/user.png"></span>
          <input type="text" placeholder="6-16位字符，只能包含英文字母或数字" v-model.trim="loginName">
        </div>
        <div class="user-wrap password">
          <span class="lock-icon"><img src="@/assets/img/lock.png"></span>
          <input type="password" placeholder="6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）" v-model="loginPwd">
        </div>
        <div class="user-wrap password">
          <span class="lock-icon"><img src="@/assets/img/lock.png"></span>
          <input type="password" placeholder="请再次输入密码" v-model="loginPwd2">
        </div>
        <div class="captcha-wrap" v-if="captcha">
          <span class="icon-captcha">
            <img src="@/assets/img/icon-captcha.png">
          </span>
          <span class="captcha-svg" @click="getCaptcha" v-html="captcha">
          </span>
          <input type="text" autocomplete="off" v-model.trim="loginCaptcha" placeholder="请输入验证码">
        </div>
        <div class="login-tip" v-if="tip">{{tip}}</div>
        <!-- <div class="alert-tip-text" v-if="tip">{{tip}}</div> -->
        <!-- <div class="reg-tip-text" v-if="tip">{{tip}}</div> -->
        <div class="login-btn">
          <button class="to-log" @click="regFn">立即注册</button>
        </div>
      <!-- </form> -->
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import MD5 from 'MD5'
import paramCryptFn from '@/assets/js/cryptData'
import {regexpInput, regexpPsd} from '@/assets/js/validator.js'
export default {
  name: 'login',
  data() {
    return {
      isLoading: false,
      loginName: '',
      loginPwd: '',
      loginCaptcha: '',
      loginPwd2: '',
      tip: '', // 登录文字提示
      tipTime: 2, // s
      inviteCode: '',

      guid: '',
      captcha: '',
    }
  },
  created() {
    this.getCaptcha();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
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
    regFn() {
      const vm = this;
      this.inviteCode = this.$route.params[0];
      if (this.inviteCode === '') {
        alert('缺少邀请码，无法注册！')
        return false;
      } else if (this.loginName === '') {
        this.tip = '请输入您的用户名'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (!regexpInput(this.loginName)) {
        this.tip = '用户名为3-16位字符，只能包含英文字母或数字'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (this.loginPwd === '') {
        this.tip = '请输入您的密码'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (!regexpPsd(this.loginPwd)) {
        this.tip = '密码为6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (this.loginPwd !== this.loginPwd2) {
        this.tip = '两次密码不一致'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (this.loginCaptcha === '') {
        this.tip = '请输入验证码'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
      } else {
        this.$store.dispatch('setLoading', true)
        var data = {
          loginname: vm.loginName,
          password: MD5(vm.loginPwd),
          code: vm.inviteCode,
          captcha: vm.loginCaptcha,
          id: vm.guid
        }
        request.login(
          'post',
          '/user/register',
          paramCryptFn(data),
          (success) => {
            let code = success.returncode;
            vm.$store.dispatch('setLoading', false)
            if (code == '305') {
              vm.tip = '用户名已存在';
              setTimeout(function() {
                vm.tip = '';
              }, vm.tipTime*1000)
            } else if (code == '301') {
              vm.tip = '参数错误或者邀请码错误';
              setTimeout(function() {
                vm.tip = '';
              }, vm.tipTime*1000)
            } else if (code == '302') {
              vm.tip = '验证码错误';
              vm.getCaptcha();
              setTimeout(function() {
                vm.tip = '';
              }, 2000)
            } else if (code == '304') {
              vm.tip = '链接过期';
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
            } else if (code == '200') {
              localStorage.setItem('islogout', false);
              localStorage.setItem('phone-token', success.data.token);
              localStorage.setItem('refund', success.data.refund);
              localStorage.setItem('blance', success.data.cash);
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
    // 后退
    toBack() {
      this.$router.back(-1)
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.login-wrap{
  width:100%;
  height:100%;
  position: relative;
  background: #161626;
  background:url('../assets/img/login-bj.png') no-repeat;
  background-size:cover;
  font-size:.28rem;
  color:#c7c7c7;
  .left-sanjiao{
    position: absolute;
    width:.2rem;
    height:.36rem;
    z-index:6;
    left:.3rem;
    bottom:.22rem;
    background:url('../assets/h5-img/left_jiantou.png') no-repeat;
    background-size:100% 100%;
  }
  .logo-wrap{
    padding-top:1rem;
  }
  .back{
    top:.7rem;
  }
  .logo{
    width:2.08rem;
    height:2.87rem;
    display:block;
    margin-left:2.71rem;
    background:url('../assets/img/logo.png') no-repeat;
    background-size:100% 100%;
  }
  .login-title{
    display:block;
    margin-top:.5rem;
    font-size:.36rem;
    font-weight:700;
    text-align:center;
    margin-bottom:.45rem;
  }
  .login-data{
    width:6rem;
    margin:0 .75rem;
    // form{
    //   width:100%;
    //   position: relative;
    // }
      .login-tip{
        width:100%;
        position: absolute;
        text-align:center;
        color:#C83C4A;
        left:0;
        bottom:3.3rem;
        padding:0 .75rem;
      }
    .user-wrap, .captcha-wrap{
      width:100%;
      height:.75rem;
      border-bottom:.01rem solid #3C3C3C;
      // padding-left:.55rem;
      position: relative;
      input{
        width:100%;
        height:100%;
        display:block;
        border:none;
        outline: none;
        color:#c7c7c7;
        padding:.15rem 0;
        padding-left:.6rem;
        font-size:.32rem;
        background:none;
        position: relative;
        z-index:1;
      }
      span{
        z-index:2;
        // left:.1rem;
      }
    }
    .captcha-wrap{
      position: relative;
      z-index:3;
      span{
        position: absolute;
        display: block;
        z-index:3;
      }
      span.icon-captcha{
        width: .35rem;
        height: .4rem;
        bottom:.16rem;
        img{
          width:100%;
          height:100%;
        }
      }
      span.captcha-svg{
        width: 3rem;
        height: 1rem;
        right:-.35rem;
        bottom:0;
        transform: scale(.7);
      }
    }
    .username{
      margin-bottom:.45rem;
      span.user-icon{
        width:.34rem;
        height:.43rem;
        position: absolute;
        bottom:.16rem;
      }
    }
    .password{
      margin-bottom:.45rem;
      span.lock-icon{
        width:.35rem;
        height:.41rem;
        position: absolute;
        bottom:.17rem;
      }
    }
    .habit{
      width:100%;
      height:.4rem;
      display:-webkit-box;
      -webkit-box-pack:justify;
      -webkit-box-align:center;
      .rem-label{
        position: relative;
        display:block;
        display:-webkit-box;
        -webkit-box-align:center;
        .remember{
          width:.34rem;
          height:.34rem;
          display:block;
          background:none;
          border:none;
          outline: none;
          position: relative;
          z-index:3;
          opacity: 0;
        }
        input[type='checkbox']:checked+em.copy_checkbox{
          background:url(../assets/img/check-box-ed.png) no-repeat;
          background-size:100% 100%;
        }
        .copy_checkbox{
          position: absolute;
          left:0;
          top:.03rem;
          width:.34rem;
          height:.34rem;
          background:url(../assets/img/check-box.png) no-repeat;
          background-size:100% 100%;
          z-index:2;
        }
        span{
          display:block;
          margin-left:.2rem;
        }
        a.lose{
          color:#C83C4A;
          text-decoration: underline;
        }
      }
    }
    .login-btn{
      width:100%;
      margin-top:1rem;
      button{
        width:100%;
        height:.88rem;
        text-align:center;
        line-height:.88rem;
        font-size:.32rem;
        border-radius:.08rem;
        border:none;
        outline: none;
        color:#c7c7c7;
      }
      .to-log{
        background: #C83C4A;
        margin-bottom:.3rem;
      }
      .to-reg{
        border:.01rem solid #646464;
        background:none;
      }
    }
  }
}
</style>


