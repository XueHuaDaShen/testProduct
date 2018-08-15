<template>
  <div class="login-wrap">
    <div class="logo-wrap"><span class="logo"></span></div>
    <p class="login-title">会员登录</p>
    <div class="login-data">
      <!-- <form action=""> -->
        <div class="user-wrap username">
          <span class="user-icon"><img src="@/assets/img/user.png"></span>
          <input type="text" placeholder="请输入用户名" v-model="loginName">
        </div>
        <div class="user-wrap password">
          <span class="lock-icon"><img src="@/assets/img/lock.png"></span>
          <input type="password" placeholder="请输入密码" v-model="loginPwd">
        </div>
        <div class="habit">
          <label for="" class="rem-label">
            <input type="checkbox" class="remember">
            <em class="copy_checkbox"></em>
            <span>记住密码</span>
          </label>
          <!-- <a class="lose">忘记密码</a> -->
        </div>
        <!-- <div class="login-tip">{{tip}}</div> -->
        <div class="alert-tip-text" v-if="tip">{{tip}}</div>
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
export default {
  name: 'login',
  data() {
    return {
      isLoading: false,
      loginName: '',
      loginPwd: '',
      tip: '', // 登录文字提示
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    loginFn() {
      const vm = this;
      if (this.loginName === '') {
        this.tip = '请输入您的用户名'
        setTimeout(() => {
          vm.tip = '';
        }, 1500);
        return false;
      } else if (this.loginPwd === '') {
        this.tip = '请输入您的密码'
        setTimeout(() => {
          vm.tip = '';
        }, 1500);
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
              let new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginPwd).toString(), random).toString();
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
                    }, 2000)
                  } else if (code == '305') {
                    vm.tip = '密码错误';
                    setTimeout(function() {
                      vm.tip = '';
                    }, 2000)
                  } else if (code == '200') {
                    try{
                      vm.$router.push({ path: '/wrap' })
                      vm.$store.dispatch('setBlance', success.data.cash);
                      localStorage.setItem('islogout', false);
                      localStorage.setItem('phone-token', success.data.token);
                      localStorage.setItem('loginname', vm.loginName);
                      localStorage.setItem('refund', success.data.refund);
                      localStorage.setItem('blance', success.data.cash);
                    }catch(e){
                      alert('登录---'+e)
                    }
                    alert('登陆成功');
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
                  vm.tip = '登录失败，请联系管理员';
                  setTimeout(function() {
                    vm.tip = '';
                  }, 2000)
                  vm.$store.dispatch('setLoading', false)
                  console.log('/user/login---error', error)
                }
              )
            } else {
                vm.tip = '登录失败，请联系管理员';
                setTimeout(function() {
                  vm.tip = '';
                }, 2000)
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
            }, 2000)
            console.log('/user/random---error', error)
          }
        )
      }
    },
    toRegFn() {
      let reg = 'http://m.8bw.vip/#/reg/0qug9eawf7';
      location.href = reg;
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
        position: absolute;
        text-align:center;
        color:#C83C4A;
        left:0;
        bottom:2.5rem;
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


