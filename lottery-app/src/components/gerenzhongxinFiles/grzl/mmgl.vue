<template>
  <div class="mmgl-wrap" @click="optionsTitle=''">
    <div class="header-nav">
      <span :class="pwdSet==='登录'?'active':''" @click="changeModel('登录')">登录密码</span>
      <span :class="pwdSet==='资金'?'active':''" @click="changeModel('资金')">资金密码</span>
    </div>
    <div v-if="pwdSet==='登录'" style="position:relative">
      <ul>
        <li>
          <span>输入旧的登录密码：</span>
          <input type="password" v-model="loginOldPwd">
        </li>
        <li>
          <span>输入新的登录密码：</span>
          <input type="password" v-model="loginNewPwd">
        </li>
        <li>
          <span>确认新的登录密码：</span>
          <input type="password" v-model="confirmLoginNewPwd">
        </li>
      </ul>
      <div class="edit-pwd-tip" v-if="tip">{{tip}}</div>
      <button class="submit-btn" @click="editLoginPwd">提交修改</button>
    </div>
    <div v-if="pwdSet==='资金'" style="position:relative">
      <ul>
        <li v-if="isSetPwd">
          <span>输入旧的资金密码：</span>
          <input type="password" v-model="zijinOldPwd">
        </li>
        <li>
          <span>输入新的资金密码：</span>
          <input type="password" v-model="zijinNewPwd">
        </li>
        <li>
          <span>确认新的资金密码：</span>
          <input type="password" v-model="confirmZijinNewPwd">
        </li>
      </ul>
      <div class="edit-pwd-tip" v-if="tip">{{tip}}</div>
      <button class="submit-btn" :disabled="isClick" @click="editZijinPwd">提交修改</button>
    </div>
    <div class="edit-success-dialog" v-if="showDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <em class="close-em" @click="showDialog = false">×</em>
        <p>{{editPwdTipText}}</p>
        <button class="submit-btn" @click="toLogin" v-if="pwdSet==='登录'">确定</button>
        <button class="submit-btn" @click="confirmEditZijin" v-if="pwdSet==='资金'">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import MD5 from 'MD5'
import paramCryptFn from '@/assets/js/cryptData'
import {regexpPsd} from '@/assets/js/validator.js';
export default {
  name: 'mmgl',
  data() {
    return {
      isClick: false,
      pwdSet: '登录',
      tip: '',
      tipTimeout: 2, // 提示文字持续时间 s
      loginOldPwd: '', // 登录 旧密码
      loginNewPwd: '', // 新密码
      confirmLoginNewPwd: '', // 确认新密码
      zijinOldPwd: '', // 资金 旧密码
      zijinNewPwd: '', // 新密码
      confirmZijinNewPwd: '', // 确认新密码
      isSetPwd: false, // 用户是否已设置 资金密码

      from: '', // 判断当前页面是从哪里跳转过来的

      showDialog: false,
      editPwdTipText: '', // 修改密码 成功失败的弹框提示文字
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '密码管理');
    this.from = this.$route.query.from;
    if(this.from === 'yhkgl'){
      this.pwdSet = '资金';
      this.checkIsSetPwdFn();
    }
  },
  mounted() {},
  computed: {},
  methods: {
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
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 切换 容器
    changeModel(val) {
      this.pwdSet = val;
      if(this.pwdSet === '资金'){
        this.checkIsSetPwdFn();
      }
    },
    // 显示弹框
    showDialogFn(text) {
      this.$store.dispatch('setHeader', false);
      this.editPwdTipText = text;
      this.showDialog = true;
    },
    // 修改登录密码
    editLoginPwd() {
      const vm = this;
      //  else if (!regexpPsd(vm.loginOldPwd)) {
      //   vm.tip = '旧密码不符合规范';
      //   setTimeout(() => {
      //     vm.tip = '';
      //   }, vm.tipTimeout*1000);
      //   return false;
      // }
      if (vm.loginOldPwd === '') {
        vm.tip = '旧密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.loginNewPwd === '') {
        vm.tip = '新密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (!regexpPsd(vm.loginNewPwd)) {
        vm.tip = '密码为6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.confirmLoginNewPwd === '') {
        vm.tip = '确认新密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.confirmLoginNewPwd !== vm.loginNewPwd) {
        vm.tip = '两次密码输入不一致';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.loginOldPwd === vm.loginNewPwd) {
        vm.tip = '新旧密码不能相同';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else{
        let url = '/user/password/change';
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == '200') {
              let random = success.data.random;
              // console.log('old', CryptoJS.MD5(vm.loginOldPwd).toString());
              // console.log('oldhmac', CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginOldPwd).toString(), random).toString());
              // console.log('new', CryptoJS.MD5(vm.loginNewPwd).toString());
              let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginOldPwd).toString(), random).toString();
              let new_password = CryptoJS.MD5(vm.loginNewPwd).toString();

              var data = {
                oldpw: old_password,
                newpw: new_password
              }
              request.http(
                'post',
                url,
                paramCryptFn(data),
                (success) => {
                  let code = success.returncode
                  if (code) {
                    if (code == 103 || code == 106 || code == 101) {
                      request.loginAgain(vm);
                    } else if (code == 200) {
                      vm.showDialogFn('修改成功，请重新登录')
                    } else if (code == 305) {
                      vm.tip = '旧密码不正确，请重新输入';
                      setTimeout(() => {
                        vm.tip = '';
                      }, vm.tipTimeout*1000);
                    } else if (code == 307) {
                      vm.tip = '登录密码不能和资金密码一致';
                      setTimeout(() => {
                        vm.tip = '';
                      }, vm.tipTimeout*1000);
                      return false;
                    } else {
                      // console.log('error', code);
                    }
                  }
                }, (error) => {
                  // vm.loading = false;
                  console.log('error', error);
                }
              )
            } else {
              // vm.loading = false;
            }
          },
          (error) => {
            // vm.loading = false;
            console.log('/user/random---error', error)
          }
        )
      }
    },
    //修改资金密码
    editZijinPwd() {
      const vm = this;
      if (vm.zijinOldPwd === '' && vm.isSetPwd) {
        vm.tip = '旧密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.zijinNewPwd === '') {
        vm.tip = '新密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (!regexpPsd(vm.zijinNewPwd)) {
        vm.tip = '资金密码为6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.confirmZijinNewPwd === '') {
        vm.tip = '确认新密码不能为空';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.confirmZijinNewPwd !== vm.zijinNewPwd) {
        vm.tip = '两次密码输入不一致';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else if (vm.zijinOldPwd === vm.zijinNewPwd && vm.isSetPwd) {
        vm.tip = '新旧密码不能相同';
        setTimeout(() => {
          vm.tip = '';
        }, vm.tipTimeout*1000);
        return false;
      } else{
        vm.isClick = true;
        let url = '/user/bankcard/password/update';
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            vm.isClick = false;
            if (success.returncode == '200') {
              let random = success.data.random;
              // console.log('old', CryptoJS.MD5(vm.zijinOldPwd).toString());
              // console.log('oldhmac', CryptoJS.HmacMD5(CryptoJS.MD5(vm.zijinOldPwd).toString(), random).toString());
              // console.log('new', CryptoJS.MD5(vm.zijinNewPwd).toString());
              let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.zijinOldPwd).toString(), random).toString();
              let new_password = CryptoJS.MD5(vm.zijinNewPwd).toString();

              var data = {
                oldpw: old_password,
                newpw: new_password
              }
              request.http(
                'post',
                url,
                paramCryptFn(data),
                (success) => {
                  let code = success.returncode
                  if (code) {
                    if (code == 103 || code == 106 || code == 101) {
                      request.loginAgain(vm);
                    } else if (code == 305) {
                      vm.tip = '旧密码不正确，请重新输入';
                      setTimeout(() => {
                        vm.tip = '';
                      }, vm.tipTimeout*1000);
                    } else if (code == 307) {
                      vm.tip = '资金密码不能和登录密码一致';
                      setTimeout(() => {
                        vm.tip = '';
                      }, vm.tipTimeout*1000);
                      return false;
                    } else if (code == 200) {
                      vm.showDialogFn('修改成功')
                    } else {
                      // console.log('error', code);
                    }
                  }
                }, (error) => {
                  // vm.loading = false;
                  console.log('error', error);
                }
              )
            } else {
              // vm.loading = false;
            }
          },
          (error) => {
            // vm.loading = false;
            vm.isClick = false;
            console.log('/user/random---error', error)
          }
        )
      }
    },
    // 修改资金候确定按钮
    confirmEditZijin() {
      this.showDialog =false;
      this.zijinOldPwd = '';
      this.zijinNewPwd = '';
      this.confirmZijinNewPwd = '';
      this.$store.dispatch('setHeader', true);
      if(this.from === 'yhkgl'){
        this.$router.back(-1)
      }
    },
    // 去登录页
    toLogin() {
      request.loginAgain(this);
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.mmgl-wrap{
  position: relative;
  .header-nav{
    width:3.24rem;
    height:.64rem;
    margin-top:.3rem;
    margin-left:2.13rem;
    background: #292932;
    border-radius: .08rem;
    // display:-webkit-box;
    // -webkit-box-align:center;
    overflow:hidden;
    color:#646464;
    span{
      // display:block;
      float: left;
      text-align:center;
      line-height:.64rem;
      width:50%;
    }
    span.active{
      color:#c7c7c7;
      background:#C83C4A;
    }
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
      span{
        display:block;
        margin-left:.3rem;
      }
      input{
        display:block;
        -webkit-box-flex:1;
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
  .edit-pwd-tip{
    width:100%;
    padding:0 .5rem;
    text-align:center;
    color:#C83C4A;
    position: absolute;
    left:0;
    bottom:1.2rem;
  }
  .edit-success-dialog{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    .dialog-bj{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background: #000;
      opacity:.8;
    }
    .dialog-content{
      width:6rem;
      height:3rem;
      position: absolute;
      left:0;
      top:0;
      bottom:0;
      right:0;
      margin:auto;
      border-radius:.16rem;
      background: #fff;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:center;
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
        margin-bottom:.6rem;
        font-size:.32rem;
        color:#C83C4A;
      }
      button.submit-btn{
        height:.88rem;
        line-height:.88rem;
        margin:0;
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


