<template>
  <div class="psd-wrap search-form" v-loading="loading">
    <el-row>
      <div class="x-auto">
        为了您的帐号安全，请设置资金密码，该密码用于验证你的资金操作
      </div>
      <div class="table-xinxi">
        <div class="table-row mb-20 mt-30">
          <span class="exp">设置资金密码：</span>
          <el-input placeholder="请输入资金密码" v-model="newPsd" class="content" type="password"></el-input>
        </div>
        <div class="table-row mb-20">
          <span class="exp" align="right">确认资金密码：</span>
          <el-input placeholder="请确认资金密码" v-model="newPsd2" class="content" type="password"></el-input>
        </div>
      </div>
      <div class="submit-line">
        <a class="submit" type="submit" @click="modifiedBankPsd()">提交修改</a>
      </div>
    </el-row>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import MD5 from 'MD5'
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        loading: false,
        isSetBankPsd: this.$store.state.isSetBankPassword, //是否设置资金密码
        oldPsd: '',
        newPsd: '',
        newPsd2: '',
      }
    },
    methods: {
      //设置资金密码
      modifiedBankPsd() {
        let self = this;
        if (!this.newPsd) {
          this.$message({
            showClose: true,
            message: '资金密码不能为空',
            type: 'error'
          });
          return;
        }
        if (!this.newPsd2) {
          this.$message({
            showClose: true,
            message: '确认资金密码不能为空',
            type: 'error'
          });
          return;
        }
        if (this.newPsd !== this.newPsd2) {
          this.$message({
            showClose: true,
            message: '两次输入的资金密码不一致',
            type: 'error'
          });
          return;
        }
        if (!this.regexpPsd(this.newPsd)) {
          this.$message({
            showClose: true,
            message: '资金密码格式不符合要求',
            type: 'error'
          });
          return;
        }
        if (!this.regexpPsd(this.newPsd2)) {
          this.$message({
            showClose: true,
            message: '确认资金密码格式不符合要求',
            type: 'error'
          });
          return;
        }
        this.loading = true;
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == '200') {
              let random = success.data.random;
              // console.log('old', CryptoJS.MD5(self.oldPsd).toString());
              // console.log('oldhmac', CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsd).toString(), random).toString());
              // console.log('new', CryptoJS.MD5(self.newPsd).toString());
              let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(self.oldPsd).toString(), random).toString();
              let new_password = CryptoJS.MD5(self.newPsd).toString();

              var data = {
                oldpw: old_password,
                newpw: new_password
              }
              request.http('post', '/user/bankcard/password/update', paramCryptFn(data),
                (success) => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 200) {
                      // console.log(success);
                      self.$alert('设置成功', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        callback: action => {
                          self.$store.dispatch('setBankPassword', 1);
                          self.$router.push({ name: 'userSecurityQuestions' });
                        }
                      });
                    } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    } else if (success.returncode == 301) {
                      self.$alert('设置失败', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        callback: action => {
                          self.oldPsd = '';
                          self.newPsd = '';
                          self.newPsd2 = ''
                        }
                      });
                    }
                  }
                },
                (error) => {
                  self.loading = false;
                  console.log('数据异常', error)
                  this.$message({
                    showClose: true,
                    message: '系统出错，请联系管理员',
                    type: 'error'
                  });
                })
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            self.loading = false;
            console.log('/user/random---error', error)
          }
        )
      },
      //匹配6-16位数字和字母组合
      regexpPsd(psd) {
        let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$");
        if (exp.test(psd)) {
          return true;
        }
        return false;
      }
    },
    watch: {
      'isSetBankPsd'(newValue, oldValue) {
        if (newValue) {

        } else {

        }
      }
    },
    computed: {},
    mounted() {

    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style scoped lang="scss">
  .table-xinxi {
    width: 320px;
    margin: 0 auto;

    .table-row {
      display: flex;
      justify-content: center;
      align-items: center;

      .row-item {
        flex: 0.5;

        .exp {
          text-align: left;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #191919;
          width: 120px;
          display: inline-block;
        }
      }
    }
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .psd-wrap {
    color: #333333;
    min-height: 731px;
    padding-top: 30px;
  }

  .x-auto {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 16px;
    color: #CC3447;
  }

  table {
    width: 100%;
    margin-top: 30px;
  }

  td {
    padding-bottom: 20px;
  }

  td.exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 34px;
    width: 400px;
  }

  .item {
    float: left;
    padding: 0 10px;
    font-size: 14px;
    padding-left: 55px;
  }

  .item-top {
    height: 250px;
    border-bottom: 1px solid #ECECEC;
  }

  .item .title {
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 20px;
    padding: 35px 0;
  }

  .item td {
    padding: 7px 5px;
  }

  .item .item td.content {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 20px;
  }

  .submit {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 auto;
  }

  .input-nick {
    height: 32px;
    border: 1px solid #999799;
    padding: 0 8px;
    float: left;
  }

  .input-nick:focus,
  input-nick:hover {
    border-color: #D4914D;
  }

  .last-login-time {
    width: 285px;
    height: 48px;
    background: rgba(238, 238, 238, 1);
    border: 1px solid #999799;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
    line-height: 48px;
    display: inline-block;
    text-align: center;
  }

  .tip {
    height: 33px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
    display: inline-block;
  }

  .keyboard-icon {
    display: inline-block;
    font-size: 28px;
    text-align: center;
    vertical-align: middle;
    padding-left: 10px;
    cursor: pointer;
  }

  .setting-wrap {
    width: 471px;
    height: 260px;
    background: #f2f2f2;
    margin-top: 90px;
    margin-right: 50px;
  }

  .setting-wrap>span {
    text-align: center;
    display: inline-block;
    line-height: 260px;
    vertical-align: middle;
    font-size: 12px;
  }
</style>