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
      loginPwd2: '',
      tip: '', // 登录文字提示
      tipTime: 2, // s
      inviteCode: '',
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
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
        this.tip = '用户名为6-16位字符，只能包含英文字母或数字'
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
      } else {
        this.$store.dispatch('setLoading', true)
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
    background:url('/static/img/left_jiantou.png') no-repeat;
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
    margin-top:1rem;
    font-size:.32rem;
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
    .user-wrap{
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
        left:.1rem;
      }
    }
    .username{
      margin-bottom:.45rem;
      span.user-icon{
        width:.34rem;
        height:.43rem;
        position: absolute;
        // left:0;
        bottom:.16rem;
      }
    }
    .password{
      margin-bottom:.3rem;
      span.lock-icon{
        width:.35rem;
        height:.41rem;
        position: absolute;
        // left:0;
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
      margin-top:1.2rem;
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


