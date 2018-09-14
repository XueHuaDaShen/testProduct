<template>
  <div class="bank-wrap search-form record-options" v-loading="loading">
    <div class="binding-wrap item">
      <div class="binding-inner">
        <div class="x-auto">
          为了账户的资金安全，建议锁定银行卡信息。
          <br />
          <br />锁定后不能增加新卡绑定，已绑定的银行信息不能进行修改和删除。
        </div>
        <table>
          <tbody>
            <tr v-for="(item,index) in bankCards" v-cloak :key="index">
              <td align="right" class="exp">已绑卡{{index+1}}：</td>
              <td align="left" class="content">
                <el-input v-model="item.bank[0].bank_name+item.card_no" clearable :disabled="true" class="content">
                </el-input>
              </td>
            </tr>
            <tr>
              <td align="right" class="exp">资金密码：</td>
              <td align="left" class="content">
                <el-input placeholder="请输入内容" v-model="validateForm.bankPsd" clearable type="password" class="content">
                </el-input>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="submit-line">
          <a class="back" @click="previousBank">返回上一步</a>
          <a class="submit" type="submit" @click="lock">提交锁定</a>
        </div>
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
          bankPsd: '', //输入的资金密码
        },
        bankCards: []
      }
    },
    methods: {
      previousBank() {
        this.$router.push({ name: 'bank' })
      },
      //锁定所有银行卡
      lock() {
        if (!this.validateForm.bankPsd) {
          this.$message({
            showClose: true,
            message: '请填写资金密码',
            type: 'error'
          });
          return;
        }
        let self = this;
        let url = '/user/bankcard/lock';
        self.loading = true;
        request.login(
          'post',
          '/user/random',
          {
            loginname: localStorage.getItem('loginname')
          },
          (success) => {
            if (success.returncode == 200) {
              let random = success.data.random;
              let cash_password = CryptoJS.HmacMD5(CryptoJS.MD5(self.validateForm.bankPsd).toString(), random).toString();
              request.http(
                "post",
                "/verifyCashPW",
                {
                  cash_password: cash_password
                },
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 200) {
                      request.http('post', url, {
                          // cash_password: cash_password,
                        },
                        (success) => {
                          self.loading = false;
                          if (success.returncode) {
                            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                              request.loginAgain(self);
                            } else if (success.returncode == 200) {
                              self.$alert('<div class="lottery-title">锁定成功</div>', '系统提醒', {
                                confirmButtonText: '确定',
                                center: true,
                                dangerouslyUseHTMLString: true,
                                customClass: "syxw-wrap-inner",
                                callback: action => {
                                  self.previousBank();
                                }
                              })
                            } else if (success.returncode == 301) {
                              self.$alert('<div class="lottery-title">锁定失败，请重新验证</div>', '系统提醒', {
                                confirmButtonText: '确定',
                                center: true,
                                dangerouslyUseHTMLString: true,
                                customClass: "syxw-wrap-inner",
                                callback: action => {
                                  self.validateForm.bankPsd = '';
                                }
                              })
                            }
                          }
                        },
                        (error) => {
                          self.loading = false;
                          console.log('数据异常', error)
                        })
                    } else if (
                      success.returncode == 301 ||
                      success.returncode == 305
                    ) {
                      self.$message({
                        showClose: true,
                        message: "资金密码不正确",
                        type: "error"
                      });
                    }
                  }
                },
                error => {
                  self.loading = false;
                  this.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              );
            }
          }, (error) => {
            self.loading = false;
            console.log('/user/random---error', error)
          })
      },
      //获取绑定的银行卡列表
      //列表数组为空数组，则没有绑定
      //否则，有绑定银行卡
      getUserBankList() {
        let self = this;
        let url = '/user/bankcard/list';
        self.loading = true;
        request.http('get', url, {},
          (success) => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              if (success.data) {
                if (success.data.bankcards.length != 0) {
                  self.bankCards = success.data.bankcards;
                }
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
            self.$message({
              showClose: true,
              message: '系统出错，请联系管理员',
              type: 'error'
            });
          })
      },
    },
    mounted() {
      this.getUserBankList();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style scoped>
  .x-auto {
    font-size: 12px;
    background: #FFFCEE;
    padding: 10px;
    border: 1px solid #EEE;
    border-radius: 4px;
    margin: 10px;
    margin-top: 0;
    text-align: left;
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

  .submit-line {
    width: 100%;
    margin-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    margin-left: 300px;
  }

  .binding-inner table.second {
    margin-left: 270px;
  }

  .binding-inner tr {
    height: 66px;
    line-height: 66px;
  }

  .binding-inner .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #191919;
    height: 38px;
    line-height: 38px;
    min-width: 128px;
    padding-bottom: 20px;
    font-weight: bold;
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
    width: 140px;
    height: 48px;
    line-height: 46px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    border: 1px solid #DDDDDD;
    border-radius: 2px;
  }

  .back {
    width: 140px;
    display: inline-block;
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 700;
    color: #777;
    border-radius: 2px;
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
</style>