<template>
  <div class="bank-wrap search-form" v-loading="loading">
    <div class="binding-wrap item">
      <div class="binding-inner">
        <table>
          <tbody>
            <tr>
              <td align="right" class="exp">卡号：</td>
              <td align="left">
                <el-input placeholder="请输入内容" v-model="validateForm.bankText" clearable :disabled="true" class="content">
                </el-input>
              </td>
            </tr>
            <tr>
              <td align="right" class="exp">银行账号：</td>
              <td align="left">
                <el-input placeholder="请输入内容" v-model="validateForm.inputBankNo" clearable class="content">
                </el-input>
              </td>
            </tr>
            <tr>
              <td align="right" class="exp"></td>
              <td align="left">
                <a class="submit" type="submit" @click="destroy" style="margin-right:20px;">删除</a>
                <a class="submit back" @click="previousBank">取消</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import { bankCard } from '../../src/lib/utils/validator';

  export default {
    data() {
      return {
        loading: false,
        validateForm: {
          bankText: '', //卡号text
          bankid: '', //银行卡的_id
          // realName: '', //真实姓名
          inputBankNo: '', //输入的卡号
          // bankPsd: '', //输入的资金密码
        },
      }
    },
    methods: {
      previousBank() {
        this.$router.push({ name: 'bank' })
      },
      //验证旧银行卡开户信息
      destroy() {
        // if (!this.validateForm.realName) {
        //   this.$message({
        //     showClose: true,
        //     message: '请填写开户人姓名',
        //     type: 'error'
        //   });
        //   return;
        // }
        if (!this.validateForm.inputBankNo) {
          this.$message({
            showClose: true,
            message: '请填写银行账号',
            type: 'error'
          });
          return;
        }
        if (!bankCard(this.validateForm.inputBankNo)) {
          this.$message({
            showClose: true,
            message: '请填写正确的银行账号',
            type: 'error'
          });
          return;
        }
        // if (!this.validateForm.bankPsd) {
        //   this.$message({
        //     showClose: true,
        //     message: '请填写资金密码',
        //     type: 'error'
        //   });
        //   return;
        // }
        let self = this;
        let url = '/user/bankcard/update';
        self.loading = true;
        /* request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == 200) {
              let random = success.data.random;
              let cash_password = CryptoJS.HmacMD5(CryptoJS.MD5(self.validateForm.bankPsd).toString(), random).toString();

            }
          }, (error) => {
            self.loading = false;
            console.log('/user/random---error', error)
          }) */
        request.http('post', url, {
            _id: self.validateForm.bankid,
            card_no: self.validateForm.inputBankNo,
            is_deleted: 1
          },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.previousBank();
              } else if (success.returncode == 301) {
                self.$alert('删除失败，请重新验证', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  callback: action => {
                    // self.validateForm.realName = '';
                    self.validateForm.inputBankNo = '';
                    // self.validateForm.bankPsd = '';
                  }
                });
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
              /* else if (success.returncode == 305) {
                             self.$alert('资金密码错误，请重新验证', '系统提醒', {
                               confirmButtonText: '确定',
                               center: true,
                               callback: action => {
                                 self.validateForm.realName = '';
                                 self.validateForm.inputBankNo = '';
                                 self.validateForm.bankPsd = '';
                               }
                             });
                           } */
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
          })
      },
    },
    mounted() {
      //获取验证旧银行卡的文本和唯一id
      if (this.$route.query && this.$route.query.banktext && this.$route.query.id) {
        this.validateForm.bankText = this.$route.query.banktext;
        this.validateForm.bankid = this.$route.query.id;
      }
    }
  }
</script>
<style scoped>
  .ml-300 {
    margin-left: 300px;
  }

  .bank-wrap {
    padding: 34px 0;
    color: #333333;
    width: 978px;
    margin: 0 auto;
  }

  .bank-list table {
    width: 100%;
  }

  .bank-list th {
    height: 34px;
    background: #D4914D;
    color: #fff;
    font-size: 14px;
  }

  .bank-list td>a {
    display: inline-block;
    width: 49px;
    height: 25px;
    border-radius: 6px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    line-height: 25px;
    cursor: pointer;
  }

  .btn-binding {
    width: 136px;
    height: 48px;
    background: #D4914D;
    border-radius: 6px;
    display: inline-block;
    line-height: 48px;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
  }

  .mt-10 {
    margin-top: 10px;
  }

  .group-item>td {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
  }

  .tips {
    width: 100%;
    height: 138px;
    background: #EEEEEE;
    padding: 42px;
  }

  .tips>p {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #666666;
    text-align: left;
    margin-bottom: 20px;
  }

  .tips>p:last-child {
    margin-bottom: 0;
  }

  .binding-inner table {
    margin: 55px auto 0;
  }

  .binding-inner table.second {
    margin-left: 270px;
  }

  .binding-inner tr {
    height: 66px;
    line-height: 66px;
  }

  .binding-inner .exp {
    font-size: 12px;
    color: #191919;
    display: inline-block;
    text-align: right;
    font-family: PingFangSC-Regular;
    width: 80px;
  }

  .binding-inner .content {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    height: 38px;
    line-height: 38px;
  }

  .binding-inner .item-input {
    width: 241px;
    height: 38px;
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    line-height: 38px;
    margin-left: 13px;
    padding: 0 7px;
  }

  .binding-inner .item-input:focus {
    border: 1px solid #E89406
  }

  .binding-inner td {}

  .submit {
    width: 115px;
    height: 40px;
    background: #CC3447;
    border-radius: 2px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FFFFFF;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    text-decoration: none;
    margin-left: -10px;
  }

  .step3 .complete {
    display: block;
    width: 90px;
    height: 90px;
    margin: 0 auto;
    margin-top: 136px;
    color: #D2D2D2;
    font-size: 90px;
    line-height: 90px;
  }

  .step3 p {
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #333333;
    text-align: center;
    margin-top: 36px;
  }

  .back {
    background: #777;
  }
</style>