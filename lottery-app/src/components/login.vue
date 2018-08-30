<template>
  <div class="login-wrap">
    <input type="text" class="display-none-input">
    <input type="password" class="display-none-input">
    <div class="logo-wrap"><span class="logo"></span></div>
    <p class="login-title">会员登录</p>
    <div class="login-data">
      <!-- <form action=""> -->
        <div class="user-wrap username">
          <span class="user-icon"><img src="@/assets/img/user.png"></span>
          <input type="text" placeholder="请输入用户名" v-model="loginName" @blur="handleInputedLoginname">
        </div>
        <div class="user-wrap password">
          <span class="lock-icon"><img src="@/assets/img/lock.png"></span>
          <input type="password" placeholder="请输入密码" v-model="loginPwd">
        </div>
        <div class="habit">
          <label for="" class="rem-label">
            <input type="checkbox" class="remember" :checked="isMomery" v-model="isMomery">
            <em class="copy_checkbox"></em>
            <span>记住密码</span>
          </label>
          <!-- <a class="lose">忘记密码</a> -->
        </div>
        <div class="login-tip" v-if="tip">{{tip}}</div>
        <!-- <div class="alert-tip-text" v-if="tip">{{tip}}</div> -->
        <div class="login-btn">
          <button class="to-log" @click="loginFn">立即登录</button>
          <button class="to-reg" @click="toRegFn">注册账号</button>
        </div>
      <!-- </form> -->
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import MD5 from 'MD5'
import paramCryptFn from '@/assets/js/cryptData'
import {regexpInput, regexpPsd} from '@/assets/js/validator.js';
export default {
  name: 'login',
  data() {
    return {
      enabled_jiami_ceshi: true,

      isLoading: false,
      loginName: '',
      loginPwd: '',
      tip: '', // 登录文字提示
      tipTime: 2, // s
      isMomeryed: false,
      isMomery: true,
      momery_username: '',
      momery_pwd: '',
    }
  },
  created() {
    // console.log(CryptoJS.MD5('123abc').toString())
  },
  mounted() {
    let islogout = localStorage.getItem('islogout');
    if(islogout === 'false'){
      this.$router.push({
        name: 'home'
      })
    }
    let user = localStorage.getItem('momery_username');
    if(this.enabled_jiami_ceshi){
      if(user){
        this.momery_username = user;
        let pwd = localStorage.getItem(user) || CryptoJS.MD5('').toString();
        if(pwd !== CryptoJS.MD5('').toString()){
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
        }else{
          this.momery_pwd = '';
          this.isMomeryed = false;
        }
      }else{
        this.momery_username = '';
      }
    }else{
      if(user){
        this.momery_username = user;
        let pwd = localStorage.getItem(user);
        if(pwd){
          this.momery_pwd = pwd;
        }else{
          this.momery_pwd = '';
        }
      }else{
        this.momery_username = '';
      }
    }
    this.loginName = this.momery_username;
    this.loginPwd = this.momery_pwd;
  },
  watch: {
    loginPwd(n, o) {
      if(this.loginPwd !== localStorage.getItem(this.loginName)){
        this.isMomeryed = false;
        // console.log(2)
      }
    }
  },
  computed: {},
  methods: {
    handleInputedLoginname() {
      if(this.enabled_jiami_ceshi){
        let pwd = localStorage.getItem(this.loginName) || CryptoJS.MD5('').toString();
        if(pwd !== CryptoJS.MD5('').toString()){
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
        }else{
          this.momery_pwd = '';
          this.isMomeryed = false;
        }
        this.loginPwd = this.momery_pwd;
      }else{
        let pwd = localStorage.getItem(this.loginName);
        if(pwd){
          // console.log(1)
          this.momery_pwd = pwd;
        }else{
          this.momery_pwd = '';
        }
        this.loginPwd = this.momery_pwd;
      }
    },
    loginFn() {
      const vm = this;
      // alert('1234')
      if (this.loginName === '') {
        this.tip = '请输入用户名'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if(!regexpInput(this.loginName)) {
        this.tip = '用户名为6-16位字符，只能包含英文字母或数字'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if (this.loginPwd === '') {
        this.tip = '请输入密码'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else if(!vm.isMomeryed && !regexpPsd(this.loginPwd)) {
        this.tip = '密码为6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）'
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTime*1000);
        return false;
      } else {
        this.$store.dispatch('setLoading', true)
        request.login(
          'post',
          '/user/random',
          {
            loginname: vm.loginName
          },
          (success) => {
            if (success.returncode == '200') {
              let random = success.data.random;
              let new_password = '';
              if(vm.isMomeryed && vm.enabled_jiami_ceshi){
                new_password = CryptoJS.HmacMD5(vm.loginPwd, random).toString()
              }else{
                new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginPwd).toString(), random).toString()
              }
              var data = { loginname: vm.loginName, password: new_password }
              request.login(
                'post',
                '/user/login',
                paramCryptFn(data),
                (success) => {
                  let protocol = window.location.protocol;
                  let host = window.location.host;
                  let code = success.returncode;
                  vm.$store.dispatch('setLoading', false)
                  // alert(code)
                  if (code == '304') {
                    vm.tip = '用户不存在';
                    setTimeout(function() {
                      vm.tip = '';
                    }, vm.tipTime*1000)
                  } else if (code == '305') {
                    vm.tip = '密码错误';
                    setTimeout(function() {
                      vm.tip = '';
                    }, vm.tipTime*1000)
                  } else if (code == '200') {
                    try{
                      vm.$router.push({ path: '/wrap' })
                      vm.$store.dispatch('setBlance', success.data.cash);
                      localStorage.setItem('islogout', false);
                      localStorage.setItem('phone-token', success.data.token);
                      localStorage.setItem('loginname', vm.loginName);
                      localStorage.setItem('refund', success.data.refund);
                      localStorage.setItem('blance', success.data.cash);

                      // 是否记住密码
                      if(vm.isMomery){
                        localStorage.setItem('momery_username', vm.loginName);
                        if(vm.enabled_jiami_ceshi){
                          if(vm.isMomeryed){
                            localStorage.setItem(vm.loginName, vm.loginPwd);
                          }else{
                            localStorage.setItem(vm.loginName, CryptoJS.MD5(vm.loginPwd).toString());
                          }
                        }else{
                          localStorage.setItem(vm.loginName, vm.loginPwd);
                        }
                      }else{
                        localStorage.setItem('momery_username', vm.loginName);
                        localStorage.removeItem(vm.loginName);
                      }
                    }catch(e){
                      // alert('登录---'+e)
                    }
                    // alert('登陆成功,本地测试');
                    // vm.getToken(success.data.token, vm.loginName);
                  } else if (code == '306') {
                    vm.tip = '您的账号被禁止登陆，请联系管理员';
                    setTimeout(function() {
                      vm.tip = '';
                    }, vm.tipTime*1000)
                  } else if (code == '301') {
                    vm.tip = '系统错误，请联系管理员';
                    setTimeout(function() {
                      vm.tip = '';
                    }, vm.tipTime*1000)
                  }
                },
                (error) => {
                  vm.tip = '登录失败，请联系管理员';
                  setTimeout(function() {
                    vm.tip = '';
                  }, vm.tipTime*1000)
                  vm.$store.dispatch('setLoading', false)
                  console.log('/user/login---error', error)
                }
              )
            } else {
                vm.tip = '登录失败，请联系管理员';
                setTimeout(function() {
                  vm.tip = '';
                }, vm.tipTime*1000)
              vm.$store.dispatch('setLoading', false)
            }
            // console.log('/user/random---success', success)
          },
          (error) => {
            // vm.error();
            vm.$store.dispatch('setLoading', false)
            vm.tip = '登录失败，请联系管理员';
            setTimeout(function() {
              vm.tip = '';
            }, vm.tipTime*1000)
            console.log('/user/random---error', error)
          }
        )
      }
    },
    toRegFn() {
      let reg = 'http://m.8bw.vip/#/reg/0qug9eawf7';
      location.href = reg;
      // this.$router.push({
      //   name: 'reg'
      // })
    },
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
  .logo-wrap{
    padding-top:1rem;
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
        padding:0 .75rem;
        position: absolute;
        text-align:center;
        color:#C83C4A;
        left:0;
        bottom:3.7rem;
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


