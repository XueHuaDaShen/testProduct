/* 额度转换 */
<template>
  <div class="order-detail-wrap content search-form">
    <user-menu></user-menu>
    <div class="main" v-loading="loading">
      <div class="top-bar">
        <span>当前位置：</span>
        <span>资金管理</span>
        <i class="iconfont icon-Right"></i>
        <span>额度转换</span>
      </div>
      <div class="project-content">
        <ul class="tabs">
          <li class="tab-title">
            <router-link :to="{ name:'topUp'}">充值</router-link>
          </li>
          <li class="tab-title ">
            <router-link :to="{ name:'withdraw'}">提现</router-link>
          </li>
          <!-- <li class="tab-title ">
            <router-link :to="{ name:'transfer'}">转账</router-link>
          </li> -->
          <li class="tab-title active">
            <router-link :to="{ name:'transform'}">额度转换</router-link>
          </li>
        </ul>
        <!-- 额度转换 Start -->
        <div class="wrap-inner">
          <div class="inner-pay-title">
            额度转换申请
          </div>
          <p style="font-size: 12px;color: #777777;margin-top:10px;text-align:left" class="mb-30">用户向平台发起额度转换申请，将账户资金转入指定的游戏平台，或从游戏平台直接转入平台。</p>
          <hr class="user-split-line mb-20">
          <div class="container-inner">
            <div class="transform-inner-title">
              <span class="exp">账户总余额：</span>
              <span class="exp2">{{getTotalCash}}元</span>
              <img src="@/assets/img/refresh.png" style="margin-left:10px;width:18px;height:16px;cursor:pointer;" @click="refreshUser">
              <!-- <i class="el-icon-refresh" style="margin-left:20px;cursor:pointer;"></i> -->
              <button :disabled="isClick" style="margin-left:10px;cursor:pointer;font-size:16px;width:64px;color:#777;text-decoration: underline;border:none;outline:none;background:none;font-weight:bold;" @click="rebackMoney">
                一键回收
              </button>
            </div>
            <div class="account-all">
              <div class="all-row">
                <label>主账户</label>
                <span class="cash" v-loading='transformTable.loading'>{{transformTable.cash}}元</span>
              </div>
              <div class="all-row">
                <label>KY</label>
                <span class="cash" v-loading='transformTable.loading'>{{transformTable.cash_ky}}元</span>
              </div>
              <!-- <div class="all-row">
                <label>AG</label>
                <span class="cash">0元</span>
              </div>
              <div class="all-row">
                <label>PT</label>
                <span class="cash">0元</span>
              </div>
              <div class="all-row">
                <label>沙巴体育</label>
                <span class="cash">0元</span>
              </div> -->
            </div>
            <hr class="user-split-line mb-20">
            <div class="transform-inner-title">
              <span class="exp">转账</span>
            </div>
            <div class="account-done item">
              <div class="done-row">
                <label class='exp'>转出：</label>
                <el-select v-model="transform.from.value" placeholder="请选择转出平台" class="content" clearable>
                  <el-option v-for="option in transform.from.options" :key="option._id" :label="option.name" :value="option._id">
                  </el-option>
                </el-select>
              </div>
              <div class="done-row">
                <label class='exp'>转入：</label>
                <el-select v-model="transform.to.value" placeholder="请选择转出平台" class="content" clearable>
                  <el-option v-for="option in transform.to.options" :key="option._id" :label="option.name" :value="option._id">
                  </el-option>
                </el-select>
              </div>
              <div class="done-row">
                <label class='exp'>转账金额：</label>
                <el-input placeholder="转账金额必须为整数" v-model='transform.cash' type='number' clearable class="content" />
              </div>
              <div class="done-row">
                <label class='exp'>资金密码：</label>
                <el-input placeholder="密码为6-16位字母或数字" v-model='transform.cashPsd' type='password' clearable class="content" />
              </div>
            </div>
            <div class="submit-line">
              <el-button class="submit" @click='transformValidator()' :disabled="disabled">确认转账</el-button>
            </div>
          </div>
        </div>
        <!-- 额度转换 End -->
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from "../axios/axios";
  import * as validator from "../lib/utils/validator";
  import paramCryptFn from '../lib/cryptData'

  export default {
    name: "withdraw",
    components: {
      UserMenu
    },
    data() {
      return {
        disabled: false,
        loading: false,
        isClick: false, // 双击
        // 额度转换
        transform: {
          from: {
            value: '',
            options: [{ name: '主账户', _id: 'main' }, { name: "KY", _id: 'ky' }]
          }, // 转出平台
          to: {
            value: '',
            options: [{ name: '主账户', _id: 'main' }, { name: "KY", _id: 'ky' }]
          }, // 转入平台
          cash: '', // 转账金额
          cashPsd: '', // 资金密码
        },
        transformTable: {
          cash: '', // 总现金
          cash_ky: '', // 开元资金
          loading: false
        },
        isSetBankPsd: 0,
      };
    },
    methods: {
      //用户是否设置资金密码
      isSetBankPassword() {
        let self = this;
        request.http('get', '/user/bankcard/password/isSet', {},
          (success) => {
            if (success.returncode == 200) {
              self.isSetBankPsd = success.data.isSet;
              if (!self.isSetBankPsd) {
                self.$alert("您未设置资金密码，请设置资金密码", "系统提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    self.$router.push({ name: "password" });
                  }
                });
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      },
      // 一键回收
      rebackMoney() {
        let self = this;
        self.isClick = true;
        self.loading = true;
        request.http('post', '/user/oneKey/exchange', {},
          (success) => {
            let code = success.returncode;
            self.isClick = false;
            self.loading = false;
            if (code == 200) {
              self.refreshCash();
            } else if (code == 101 || code == 103 || code == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.loading = false;
            self.isClick = false;
            console.log('获取用户资金失败', error)
          }
        )
      },
      // 获取用户资金
      refreshCash() {
        let self = this;
        self.transformTable.loading = true;
        request.http('get', '/user/profile', {},
          (success) => {
            self.transformTable.loading = false;
            if (success.returncode == 200) {
              let profile = success.data;
              self.transformTable.cash = Number(profile.cash).toFixed(2);
              self.transformTable.cash_ky = Number(profile.cash_ky).toFixed(2);
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.transformTable.loading = false;
            console.log('获取用户资金失败', error)
          }
        )
      },
      // 获取用户资金
      refreshUser() {
        let self = this;
        self.transformTable.loading = true;
        request.http('get', '/user/refreshThirdCoin', {},
          (success) => {
            self.transformTable.loading = false;
            if (success.returncode == 200) {
              let profile = success.data;
              self.transformTable.cash = Number(profile.cash).toFixed(2);
              self.transformTable.cash_ky = Number(profile.cash_ky).toFixed(2);
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.transformTable.loading = false;
            console.log('获取用户资金失败', error)
          }
        )
      },
      //验证资金密码
      validatorCashPsd() {
        let self = this;
        let password = this.transform.cashPsd;
        if (!password) {
          this.$message({
            showClose: true,
            message: "资金密码不能为空",
            type: "error"
          });
          return;
        }
        if (!this.regexpPsd(password)) {
          this.$message({
            showClose: true,
            message: "资金密码格式不符合要求",
            type: "error"
          });
          return;
        }
        this.loading = true;
        request.login(
          "post",
          "/user/random",
          {
            loginname: localStorage.getItem("loginname")
          },
          success => {
            if (success.returncode == "200") {
              let random = success.data.random;
              let new_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(password).toString(),
                random
              ).toString();
              request.http(
                "post",
                "/verifyCashPW",
                {
                  cash_password: new_password
                },
                success => {
                  self.loading = false;
                  let code = success.returncode;
                  if (code) {
                    if (code == 200) {
                      self.transformSubmit();
                    } else if (code == 301 || code == 305) {
                      self.$alert("资金密码不正确", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {
                          self.transform.cashPsd = "";
                        }
                      });
                    } else if (code == 304) {
                      self.$alert("账户无法进行额度转换", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {
                          self.transform.cashPsd = "";
                        }
                      });
                    } else if (code == 302) {
                      self.$alert("账户余额不足", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {
                          self.transform.cashPsd = "";
                        }
                      });
                    } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    }
                  }
                },
                error => {
                  self.loading = false;
                  self.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              );
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
          }
        );
      },
      //匹配6-16位数字和字母组合
      regexpPsd(psd) {
        let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$");
        if (exp.test(psd)) {
          return true;
        }
        return false;
      },
      // 额度转换 验证
      transformValidator() {
        let self = this;
        self.disabled = true;
        setTimeout(() => {
          self.disabled = false
        }, 1000)
        if (!self.transform.from.value) {
          this.$message({
            showClose: true,
            message: "请选择转出方",
            type: "error"
          });
          return;
        }
        if (!self.transform.to.value) {
          this.$message({
            showClose: true,
            message: "请选择转入方",
            type: "error"
          });
          return;
        }
        if (!validator.positiveInt(self.transform.cash) || self.transform.cash == 0) {
          this.$message({
            showClose: true,
            message: "请输入0元以上的整数金额",
            type: "error"
          });
          return;
        }
        self.validatorCashPsd();
      },
      // 额度转换
      transformSubmit() {
        let self = this;
        let url = "/user/exchange";
        let data = {
          channelOut: self.transform.from.value,
          channelIn: self.transform.to.value,
          money: self.transform.cash
        };
        // console.log(data)
        // return false;
        self.loading = true;
        // console.log('123')
        request.http(
          "post",
          url,
          paramCryptFn(data),
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              if (success.data) {
                self.transformTable.cash = Number(success.data.cash).toFixed(2);
                self.transformTable.cash_ky = Number(success.data.cash_ky).toFixed(2);
                self.$alert("额度转换成功", "系统提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    self.resetTransform();
                    localStorage.setItem("blance", success.data.cash);
                    self.$store.dispatch('setBlance', success.data.cash);
                  }
                });
              } else {
                self.$alert("额度转换失败，请联系管理员", "系统提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else if (success.returncode == 301 || success.returncode == 305) {
              self.$alert("资金密码不正确", "系统提醒", {
                confirmButtonText: "确定",
                center: true,
                callback: action => {
                  self.transform.cashPsd = "";
                }
              });
            } else if (success.returncode == 304) {
              self.$alert("账户无法进行额度转换", "系统提醒", {
                confirmButtonText: "确定",
                center: true,
                callback: action => {
                  self.transform.cashPsd = "";
                }
              });
            } else if (success.returncode == 302) {
              self.$alert("账户余额不足", "系统提醒", {
                confirmButtonText: "确定",
                center: true,
                callback: action => {
                  self.transform.cashPsd = "";
                }
              });
            } else {
              self.$alert(success.returncode, "系统提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          error => {
            self.loading = false;
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
          }
        );
      },
      resetTransform() {
        this.transform.from.value = '';
        this.transform.to.value = '';
        this.transform.cash = '';
        this.transform.cashPsd = '';
      }
    },
    watch: {
      "transform.from.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (newValue == 'main') {
              this.transform.to.options = [{ name: "KY", _id: 'ky' }];
            } else {
              this.transform.to.options = [{ name: "主账户", _id: 'main' }];
            }
          } else {
            this.transform.to.options = [{ name: '主账户', _id: 'main' }, { name: "KY", _id: 'ky' }];
            this.transform.to.value = '';
          }
        }
      },
      "transform.to.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (newValue == 'main') {
              this.transform.from.options = [{ name: "KY", _id: 'ky' }];
            } else {
              this.transform.from.options = [{ name: "主账户", _id: 'main' }];
            }
          } else {
            this.transform.from.options = [{ name: '主账户', _id: 'main' }, { name: "KY", _id: 'ky' }];
            this.transform.from.value = '';
          }
        }
      },
      $route(to, from) {

      }
    },
    computed: {
      getUserName() {
        return localStorage.getItem("loginname");
      },
      getTotalCash() {
        let cash = Number(this.transformTable.cash);
        let cash_ky = Number(this.transformTable.cash_ky);
        return cash + cash_ky;
      },
      //可用余额
      getBlance() {
        return parseFloat(this.$store.state.blance).toFixed(2);
      }
    },
    mounted() {
      this.isSetBankPassword();
      this.refreshCash();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>

<style scoped lang="scss">
  .table-xinxi {
    width: 100%;

    .time-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;

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

  .mb-20 {
    margin-bottom: 20px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .submit-line {
    width: 100%;
    margin-top: 60px;
    text-align: center;
  }

  .submit {
    width: 115px;
    height: 40px;
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

  .wrap-inner {
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;
    min-height: 800px;

    .inner-pay-title {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 16px;
      color: #191919;
    }
  }

  .project-content {
    padding: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .table-input>input[type="text"],
  input[type="password"] {
    display: inline-block;
    width: 300px;
    height: 45px;
    line-height: 45px;
    padding: 4px 0;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #fef1ab;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
    text-indent: 8px;
  }

  .table-input>input:focus {
    outline: none;
  }

  .binding-inner table {
    margin-left: 300px;
  }

  .binding-inner tr {
    line-height: 20px;
  }

  .binding-inner .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    min-width: 100px;
    padding: 12px 0;
  }

  .binding-inner .content {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    padding: 12px 0;
    padding-left: 14px;
  }

  .mt-40 {
    margin-top: 40px;
  }

  .mt-15 {
    margin-top: 15px;
  }

  .mt-26 {
    margin-top: 26px;
  }

  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
  }

  table,
  td {
    border-collapse: collapse;
  }

  .order-detail-wrap {
    position: relative;
    font-family: MicrosoftYaHei;
    color: #333333;
    margin: 0 auto;
    width: 1090px;
  }

  .main {
    width: 1024px;
    background: #fff;
    margin: 0 auto;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    padding: 30px 20px 0;
    text-align: left;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .main>ul.withdraw-way {
    margin-left: 40px;
    margin-top: 50px;
  }

  .main>ul.withdraw-way>li {
    height: 36px;
    line-height: 36px;
    border: 1px solid #dedede;
    float: left;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    min-width: 68px;
  }

  .main>ul.withdraw-way>li>a {
    text-decoration: none;
    color: #333;
  }

  .main>ul.withdraw-way>li.active {
    border-bottom: 1px solid #f8f8f8;
    background: #f8f8f8;
  }

  .withdraw-tip {
    margin-top: 48px;
    text-align: left;
    font-size: 12px;
    padding: 19px 22px;
    margin-bottom: 59px;
    background: #f8f8f8;
    border: 1px solid #dedede;
  }

  .withdraw-tip .tip-title {
    font-size: 14px;
    margin-bottom: 19px;
  }

  .withdraw-tip .tip-content {
    line-height: 20px;
  }

  .withdraw-input {
    display: inline-block;
    width: 316px;
    height: 48px;
    line-height: 48px;
    padding: 16px;
    outline: none;
    border: 1px solid #999799;
  }

  .withdraw-input:focus {
    background: rgba(255, 255, 255, 1);
  }

  .withdraw-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    padding: 38px 40px;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .withdraw-container .container-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-right: 20px;
    display: inline-block;
    text-align: center;
    min-width: 56px;
  }

  .flex {
    display: flex;
    margin-top: 28px;
  }

  .withdraw-container .container-row .withdraw-banks {
    display: inline-block;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item {
    width: 330px;
    height: 168px;
    cursor: pointer;
    position: relative;
    text-align: center;
    float: left;
    margin-left: 5px;
    margin-top: 10px;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item .bank-no {
    font-size: 14px;
    position: relative;
    display: block;
    width: 145px;
    margin: 0 auto;
    top: 100px;
    color: #fff;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zggs {
    background: url("../assets/img/topUp/zggs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zs {
    background: url("../assets/img/topUp/zs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgms {
    background: url("../assets/img/topUp/ms.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgjs {
    background: url("../assets/img/topUp/zgjs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgny {
    background: url("../assets/img/topUp/zgny.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zg {
    background: url("../assets/img/topUp/zg.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.gf {
    background: url("../assets/img/topUp/gf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zx {
    background: url("../assets/img/topUp/zx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zggd {
    background: url("../assets/img/topUp/zggd.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.jt {
    background: url("../assets/img/topUp/jt.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.zgyzcx {
    background: url("../assets/img/topUp/zgyzcx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.pf {
    background: url("../assets/img/topUp/pf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.pa {
    background: url("../assets/img/topUp/pa.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.xy {
    background: url("../assets/img/topUp/xy.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.hx {
    background: url("../assets/img/topUp/hx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.active {
    border: 1px solid #d4914d;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
    border-radius: 12px;
  }

  .withdraw-container .container-row .withdraw-banks .bank-item.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
    border-bottom-right-radius: 12px;
  }

  .withdraw-next {
    text-align: left;
    margin-left: 40px;
  }

  .withdraw-submit {
    display: inline-block;
    text-align: center;
    width: 234px;
    height: 45px;
    background: rgba(212, 145, 77, 1);
    border-radius: 6px;
    line-height: 45px;
    color: #fff;
    font-size: 14px;
  }

  .withdraw-container .container-row {
    padding: 0;
  }

  .withdraw-container .container-row.line {
    border-bottom: 1px solid #d5d5d5;
    height: 69px;
    line-height: 69px;
  }

  .withdraw-container .container-row .unit {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-left: 16px;
    display: inline-block;
    text-align: center;
  }

  .withdraw-container .container-row .withdraw-limit {
    color: #666666;
    font-size: 12px;
    text-align: left;
  }

  .withdraw-container .container-row ul.banklist {
    box-sizing: border-box;
    transform: scale(0.333);
  }

  .withdraw-container .container-row ul.banklist>li {
    float: left;
    margin-right: 13px;
    margin-bottom: 9px;
    width: 480px;
    height: 132px;
    border: 1px solid #dedede;
    cursor: pointer;
  }

  .withdraw-container .container-row ul.banklist>li.zggs {
    background-position: 0 0;
  }

  .withdraw-container .container-row ul.banklist>li.zs {
    background-position: -522px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgms {
    background-position: -1044px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgjs {
    background-position: -1566px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zgny {
    background-position: -2088px 0;
  }

  .withdraw-container .container-row ul.banklist>li.zg {
    background-position: 0 -618px;
  }

  .withdraw-container .container-row ul.banklist>li.gf {
    background-position: -522px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zx {
    background-position: -1044px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zggd {
    background-position: -1566px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.jt {
    background-position: -2088px -1082px;
  }

  .withdraw-container .container-row ul.banklist>li.zgyzcx {
    background-position: 0 -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.pf {
    background-position: -522px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.pa {
    background-position: -1044px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.xy {
    background-position: -1566px -2158px;
  }

  .withdraw-container .container-row ul.banklist>li.hx {
    background-position: -2088px -2158px;
  }

  .withdraw-container .container-row .wxActive {
    width: 160px;
    height: 44px;
    margin-right: 42px;
    border: 1px solid #d4914d;
    line-height: 44px;
    cursor: pointer;
    position: relative;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
    text-align: center;
    display: inline-block;
  }

  .withdraw-container .container-row .wxActive::after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
  }

  .pay-tip {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    text-align: left;
  }

  ul.pay-way {
    margin-top: 16px;
    margin-bottom: 60px;
  }

  ul.pay-way>li {
    width: 160px;
    height: 44px;
    margin-right: 42px;
    float: left;
    border: 1px solid #dedede;
    line-height: 44px;
    cursor: pointer;
    position: relative;
  }

  ul.pay-way>li.active {
    border-color: #d4914d;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
  }

  ul.pay-way>li.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  .transfer-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .transform-container {
    background: #f8f8f8;
    border: 1px solid #dedede;
    text-align: left;
    min-height: 447px;
    margin-bottom: 34px;
    margin-top: -1px;
  }

  .container-title {
    font-size: 18px;
    color: #333;
    margin-top: 27px;
    margin-left: 24px;
  }

  .container-inner {
    background: #fff;
  }

  .transform-container .container-inner {
    border: none;
  }

  .container-inner .inner-row {
    height: 34px;
    line-height: 34px;
    margin-bottom: 30px;
  }

  .container-inner .inner-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-right: 16px;
    display: inline-block;
    text-align: right;
    min-width: 99px;
  }

  .container-inner .inner-row .row-input {
    width: 222px;
    height: 34px;
    border: 1px solid #999799;
    line-height: 32px;
    padding: 0 20px;
    outline: none;
  }

  .ml-9 {
    margin-left: 9px;
  }

  .f14 {
    font-size: 14px;
    color: #333;
  }

  .mb-77 {
    margin-bottom: 77px;
  }

  .fl {
    float: left;
    padding-left: 20px;
  }

  .fr {
    float: right;
    margin-right: 100px;
  }
</style>

<style scoped lang="scss">
  .submit-line {
    width: 100%;
    margin-top: 60px;
  }

  .submit {
    width: 115px;
    height: 40px;
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

  .tl {
    text-align: left;
  }

  .tr {
    text-align: right;
  }

  .account-all {
    .all-row {
      background: #F9F9F9;
      border: 1px solid #C8C8C8;
      border-radius: 4px;
      width: 310px;
      height: 40px;
      margin-bottom: 20px;
      padding: 12px 20px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #191919;
      display: flex;
      justify-content: space-between;

      .cash {
        font-weight: 700;
        color: #CC3447;
      }

      &:last-child {
        margin-bottom: 30px;
      }
    }
  }

  .tabs {
    /* height: 42px;
    line-height: 42px; */
    height: 40px;
    line-height: 40px;
    /* background: rgba(255, 247, 240, 1); */
    display: flex;
    /* border-bottom: 1px solid #DADADA; */
  }

  .tabs .tab-title {
    width: 100px;
    background: #D8D8D8;
    color: #191919;
    margin-right: 20px;
    border-radius: 4px 4px 0 0;
    text-align: center;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    /* color: rgba(51, 51, 51, 1); */
    cursor: pointer;
    position: relative;
  }

  .tabs .tab-title>a {
    font-size: 14px;
    color: #191919;
    outline: none;
    text-decoration: none;
  }

  .tabs .tab-title:hover>a {
    color: #847B5F;
  }

  .tabs .tab-title.active>a {
    color: #BD8454;
  }

  .tabs .tab-title.active {
    /* border-top: 2px solid #A65B06; */
    color: #BD8454;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }

  /* .tabs .tab-title:after {
    content: '';
    height: 8px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 17px;
    width: 1px;
  } */

  .tabs .tab-title a {
    display: block;
    /* padding: 0 30px; */
  }

  .account-done {
    margin-top: 20px;

    .done-row {
      text-align: left;

      .exp {
        width: 120px;
        font-size: 12px;
        color: #191919;
        display: inline-block;
      }
    }
  }

  .transform-inner-title {
    margin-bottom: 20px;
    margin-top: 10px;
    text-align: left;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    color: #191919;

    .exp {
      font-size: 16px;
      display: inline-block;
    }

    .exp2 {
      font-size: 16px;
      color: #CC3447;
      line-height: 22px;
      display: inline-block;
    }
  }
</style>