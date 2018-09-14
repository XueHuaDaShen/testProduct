<!--下级开户 - 新增下级 -->
<template>
  <div class="lottery-wrap" v-loading="loading">
    <div class="record-tabs">
      <router-link :to="{name:'artificialCreate'}" class="tab-item active">新增下级
      </router-link>
      <router-link :to="{name:'linkCreate'}" class="tab-item">链接开户
      </router-link>
    </div>
    <div class="record-options search-form">
      <div class="option-row">
        <span class="exp">用户名：</span>
        <input v-model="loginname.value" type="text" placeholder="3-20位字母，数字或下划线" />
      </div>
      <div class="option-row">
        <span class="exp">设置登录密码：</span>
        <input v-model="password.value" :type="password.type" placeholder="6-16位数字或者字母组合" />
        <span class="icon-eye" @click="eyeToggle(true)" v-show="!this.password.active"></span>
        <span class="icon-eye active" @click="eyeToggle(false)" v-show="this.password.active"></span>
      </div>
      <div class="percentage-row">
        <span class="title">设置比列：</span>
        <span class="left1-title">设置奖金组</span>
        <input class="salary-input" v-model="salary.group" />
        <el-slider v-model="salary.group" class="slider" :max="salary.max" :min="salary.min" :step="salary.step" @change="salarySlideChange"></el-slider>
        <span class="rebatesRateTitle">预计平均返点率</span>
        <span class="rebatesRate" v-text="rebatesRate"></span>
      </div>
      <a class="link-create" @click="onSubmit">添加用户</a>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios'
  import { regexpPsd, regexpInput, trim } from '../lib/utils/validator'
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        loading: false,
        loginname: {
          value: '',
        },
        password: {
          value: '',
          type: 'password'
        },
        salary: {
          group: 0,
          max: 1800,
          min: 0,
          step: 2
        },
      }
    },
    computed: {
      rebatesRate() {
        return ((this.salary.max - this.salary.group) / 2000 * 100).toFixed(2) + ' %';
      },
    },
    methods: {
      eyeToggle(value) {
        if (value) {
          this.password.type = "text";
          this.password.active = true;
        } else {
          this.password.type = "password";
          this.password.active = false;
        }
      },
      salarySlideChange(value) {
        if (value) {
          // console.log('value', value)
        }
      },
      onSubmit() {
        let data = {},
          self = this;
        if (!this.loginname.value) {
          self.$alert('<div class="lottery-title">请填写用户名</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        }
        if (!regexpInput(this.loginname.value)) {
          self.$alert('<div class="lottery-title">用户名格式不符合要求</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        }
        if (!this.password.value) {
          self.$alert('<div class="lottery-title">请填写登录密码</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        }
        if (!regexpPsd(this.password.value)) {
          self.$alert('<div class="lottery-title">登录密码格式不符合要求</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        }
        if (!this.salary.group) {
          self.$alert('<div class="lottery-title">请设置奖金组</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        }
        this.loading = true;
        let url = '/user/team/manual/create';
        data['loginname'] = this.loginname.value;
        data['password'] = CryptoJS.MD5(this.password.value).toString();
        data['refund'] = this.salary.group;
        request.http('post', url, paramCryptFn(data), (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              self.$alert('<div class="lottery-title">用户创建成功！</div>', '系统提醒', {
                confirmButtonText: '确定',
                center: true,
                dangerouslyUseHTMLString: true,
                customClass: "syxw-wrap-inner",
                callback: action => {
                  self.loginname.value = '';
                  self.password.value = '';
                }
              })
            } else if (success.returncode == 303) {
              self.$alert('<div class="lottery-title">用户名已存在！</div>', '系统提醒', {
                confirmButtonText: '确定',
                center: true,
                dangerouslyUseHTMLString: true,
                customClass: "syxw-wrap-inner",
                callback: action => {
                  self.loginname.value = '';
                  self.password.value = '';
                }
              })
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          }
        }, (error) => {
          self.loading = false;
          self.$alert('<div class="lottery-title">用户创建失败</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {
              self.loginname.value = '';
              self.password.value = '';
            }
          })
        })
      },
      //匹配6-16位数字和字母组合
      regexpPsd(psd) {
        let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$");
        if (exp.test(psd)) {
          return true;
        }
        return false;
      },
    },
    mounted() {
      let salaryGroup = parseFloat(localStorage.getItem('refund'));
      this.salary.max = salaryGroup;
      this.salary.group = salaryGroup;
    }
  }
</script>
<style scoped>
  .icon-eye {
    background: url("../assets/img/Eye@3x_1.png") no-repeat;
    background-size: contain;
    width: 20px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }

  .icon-eye.active {
    background: url("../assets/img/Eye@3x_2.png") no-repeat;
    background-size: contain;
    display: inline-block;
    vertical-align: middle;
  }

  .percentage-row {
    height: 70px;
    line-height: 70px;
    width: 100%;
    background: #FFE4C8;
    margin: 50px 0;
    font-size: 12px;
    color: #333;
    text-align: left;
  }

  .percentage-row .title {
    margin-left: 54px;
    font-size: 18px;
    display: inline-block;
  }

  .percentage-row .left1-title {
    margin-left: 188px;
    display: inline-block;
  }

  .percentage-row .salary-input {
    width: 112px;
    height: 44px;
    line-height: 44px;
    display: inline-block;
    border: 1px solid #A6A6A6;
    border-radius: 6px;
    text-align: center;
    margin-left: 27px;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .ml-8 {
    margin-left: 8px;
  }

  .percentage-row .slider {
    margin-left: 25px;
    width: 116px;
    display: inline-block;
    vertical-align: middle;
  }

  .percentage-row .rebatesRateTitle {
    margin-left: 14px;
  }

  .percentage-row .rebatesRate {
    margin-left: 23px;
    height: 30px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    color: #EA1C1C;
    border: 1px solid #A6A6A6;
    display: inline-block;
    width: 82px;
    line-height: 30px;
    text-align: center;
  }

  .link-create {
    width: 124px;
    height: 44px;
    background: -webkit-linear-gradient(#FFB126, #9A4E02);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#FFB126, #9A4E02);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#FFB126, #9A4E02);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(#FFB126, #9A4E02);
    /* 标准的语法 */
    border-radius: 4px;
    cursor: pointer;
    line-height: 44px;
    text-decoration: none;
    display: inline-block;
    color: #fff;
    font-size: 14px;
  }

  .no-result p {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #333;
  }

  .inline {
    display: inline-block;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  a {
    text-decoration: none;
    color: #333333;
    cursor: pointer;
  }

  .lottery-wrap {
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  .record-tabs {
    height: 44px;
    background: rgba(212, 145, 77, 1);
    border-radius: 4px;
    padding: 5px;
    display: table;
  }

  .record-tabs .tab-item {
    width: 88px;
    height: 34px;
    display: table-cell;
    vertical-align: middle;
    line-height: 34px;
    color: #fff;
  }

  .record-tabs .tab-item.active {
    background: #F9EFEF;
    border-radius: 4px;
    color: #333;
  }

  .ml-14 {
    margin-left: 14px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .record-options {
    padding: 39px 0;
    background: #FFFFFF;
  }

  .record-options .option-row {
    text-align: left;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    margin-bottom: 20px;
    padding-left: 304px;
  }

  .record-options .option-row .exp {
    width: 104px;
    text-align: right;
    display: inline-block;
  }

  .record-options .option-row>input[type="text"],
  input[type='password'] {
    display: inline-block;
    width: 171px;
    height: 45px;
    line-height: 45px;
    padding: 4px 0;
    border: 1px solid #8D8D8D;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all .2s;
    margin: 0 14px;
    text-indent: 8px;
  }

  .record-options .option-row>input:focus {
    outline: none;
  }

  .record-options .option-row>a {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: auto;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    border: 1px solid #D4914D;
    margin-right: 3px;
  }

  .record-options .option-row>a:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group {
    width: 978px;
    margin: 0 auto;
  }

  .record-group .group-title {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    height: 34px;
  }

  .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  }

  .record-group .group-title>th:last-child:after {
    content: none;
  }

  .record-group .group-item {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .record-group .group-item .url {
    height: 32px;
    line-height: 32px;
    border: 1px solid #999799;
    text-indent: 17px;
    display: inline-block;
    text-align: left;
    width: 200px;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #FFFFFF;
    border-radius: 2px;
    box-sizing: inherit;
    -moz-box-sizing: inherit;
    -webkit-box-sizing: inherit;
    transition: all .2s;
    -moz-transition: all .2s;
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .record-group .group-item .url:focus {
    border-color: #D4914D;
    outline: none;
  }

  .record-group .group-item a.normal {
    color: #fff;
    display: inline-block;
    line-height: 25px;
    font-size: 12px;
    width: 49px;
    height: 25px;
    background: rgba(163, 88, 5, 1);
    border-radius: 6px
  }

  .record-group .group-item a.delete {
    color: #E00000;
    display: inline-block;
    line-height: 25px;
    font-size: 12px;
    width: 49px;
    height: 25px;
    border-radius: 6px;
    background: rgba(238, 238, 238, 1);
  }

  .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 56px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    border: 1px solid #8D8D8D;
    text-align: center;
    margin-right: 3px;
  }

  .record-options .option-row>a.time:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .record-group .group-item:nth-child(2n+1) {
    background: #F7F7F7;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #F0BD88;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 34px;
    line-height: 34px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .success {
    color: #099F4C;
  }

  .failed {
    color: #E10C0C
  }

  .record-pagination {
    padding: 30px 0;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  .record-pagination>a {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #E9E9E9;
    margin-left: 11px;
    font-size: 12px;
  }

  .record-pagination>span {
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
  }

  .record-options .option-row>a.submit {
    position: relative;
    display: inline-block;
    height: 28px;
    padding: 0 29px;
    line-height: 25px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    font-family: microsoft yahei;
    background-color: #D4914D;
    border: 1px solid #CCC;
    box-shadow: none;
    margin-left: 20px;
  }
</style>