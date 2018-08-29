/* 提现 */
<template>
  <div class="order-detail-wrap content search-form">
    <user-menu></user-menu>
    <div class="main" v-loading="loading">
      <div class="top-bar">
        <span>当前位置：</span>
        <span>资金管理</span>
        <i class="iconfont icon-Right"></i>
        <span>提现</span>
      </div>
      <div class="project-content">
        <ul class="tabs">
          <li class="tab-title">
            <router-link :to="{ name:'topUp'}">充值</router-link>
          </li>
          <li class="tab-title active">
            <router-link :to="{ name:'withdraw'}">提现</router-link>
          </li>
          <!-- <li class="tab-title ">
            <router-link :to="{ name:'transfer'}">转账</router-link>
          </li> -->
          <li class="tab-title ">
            <router-link :to="{ name:'transform'}">额度转换</router-link>
          </li>
        </ul>
        <div v-show='withdrawItemActive === 1 && !bankcards.showNextStep' class="wrap-inner">
          <div class="inner-pay-title">
            提现规则
          </div>
          <div class="withdraw-tip mb-30">
            <p class="tip-row">提款时间：
              <span class="red">全天24小时</span>
            </p>
            <p class="tip-row">
              每天限制提款
              <span class="red">{{bankcards.max_withdraw_times_daily}}次</span>,您今天已经提款
              <span class="red">{{bankcards.times}}次</span>
            </p>
            <p class="tip-row">
              最小提款额：
              <span class="red">{{bankcards.min_withdraw_every_time}}元</span>
              ,最大提款额:
              <span class="red">{{bankcards.max_withdraw_every_time}}元</span>
            </p>
            <p class="tip-row">
              需完成所有打码量要求方可提现
            </p>
          </div>
          <hr class="user-split-line">
          <!-- 提现 START-->
          <div class="withdraw-container item">
            <div class="time-row mb-20">
              <span class="last-exp">用户名：</span>
              <span class="last-exp">{{getUserName}}</span>
            </div>
            <div class="time-row mb-20">
              <span class="last-exp">可提现余额：</span>
              <el-popover placement="right" :disabled="dml == 0" v-model="tooltipVisible">
                <div class="flex-tip">
                  <i class="el-icon-warning"></i>
                  <span class="tooltip" style="margin-left:5px;">您尚未完成打码量</span>
                  <el-button @click="goDML()" size="mini" type="primary" style="margin-left:5px;">查看</el-button>
                </div>
                <p class="cash" slot="reference">{{getBlance}}元</p>
              </el-popover>
            </div>
            <div class="time-row mb-30">
              <span class="last-exp">提现余额：</span>
              <el-input placeholder="请输入提现金额" v-model="form.cash_apply" class="content" type="number" clearable></el-input>
              <!-- <input placeholder="请输入提现金额" v-model="form.cash_apply" class="content" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode))"/> -->
            </div>
            <div class="inner-pay-title mb-20">
              可提现银行卡
            </div>
            <div class="time-row">
              <ul class="withdraw-banks">
                <li class="bank-item" v-for="(item,index) in bankcards.data" :key="item._id" :class="['b'+item.bank[0].bank_id,{'active':bankcards.active === index+1}]" @click="bankActiveToggle(index+1,item._id)">
                  <span class="bank-no">{{item.card_no}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="submit-line">
            <a class="submit" type="submit" @click="goNextStep()" v-if="dml === 0">下一步</a>
            <a class="submit no-allowed" type="submit" v-if="dml != 0">下一步</a>
          </div>
          <!-- 提现 END-->
        </div>
        <!-- 提现 下一步 Start -->
        <div v-show='withdrawItemActive === 1 && bankcards.showNextStep'>
          <div class="withdraw-container binding-inner">
            <div class="table-xinxi item">
              <div class="time-row mb-20">
                <span class="exp">用户名：</span>
                <span class="con">{{getUserName}}</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">可提现金额：</span>
                <span class="con error">{{getBlance}}&nbsp;元</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">提现金额：</span>
                <span class="con error">{{nextStep.withdraw}}&nbsp;元</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">手续费：</span>
                <span class="con">免费</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">开户银行：</span>
                <span class="con"> {{nextStep.bank_name}}</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">开户城市：</span>
                <span class="con">{{nextStep.province}}{{nextStep.city}}</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">开户人姓名：</span>
                <span class="con">{{nextStep.real_name}}</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">个人银行账号：</span>
                <span class="con"> {{nextStep.card_no}}</span>
              </div>
              <div class="time-row mb-20">
                <span class="exp">确认资金密码：</span>
                <el-input placeholder="输入资金密码" v-model="nextStep.input_cash_psd" type="password" class="con" clearable />
              </div>
            </div>
            <div class="submit-line">
              <el-button class="submit" type="submit" @click="validatorCashPsd(nextStep.input_cash_psd)" :disabled="disabled">确认提现</el-button>
            </div>
          </div>
        </div>
        <!-- 提现 下一步 END -->
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from "../axios/axios";
  import * as validator from "../lib/utils/validator";
  import paramCryptFn from "../lib/cryptData";

  export default {
    name: "withdraw",
    components: {
      UserMenu
    },
    data() {
      return {
        submitDisabled: false,
        loading: false,
        withdrawItemActive: 1,
        form: {
          cash_apply: "", //充值数量,
          card_id: "" //用户银行卡的id，用于下一步获取指定_id的银行卡信息
        },
        result: {},
        bankcards: {
          data: [],
          translated: [],
          active: 0,
          max_withdraw_times_daily: 0, //单日提现次数
          max_withdraw_every_time: 0, //单次最大提现金额
          min_withdraw_every_time: 0, //单次最小提现金额
          times: "", // 单日还可以体现的次数
          showNextStep: false //显示银行卡提现下一步内容
        },
        nextStep: {
          withdraw: "", //提现金额
          bank_name: "", //银行名称
          province: "",
          city: "",
          subbranch: "", //支行名称
          card_no: "", //卡号
          real_name: "", //真实姓名
          input_cash_psd: "", //输入的资金密码
          card_id: "" //用户银行卡的id，用于下一步获取指定_id的银行卡信息
        },
        // 打码量数目 大于0，则满足打码量
        dml: 0,
        tooltipVisible: true,
        disabled: false,
      };
    },
    methods: {
      formatNum(e) {
        // console.log("formatNum", e);
        return /[\d]/.test(String.fromCharCode(e.keyCode));
      },
      goDML() {
        this.$router.push({
          name: "codeManagement",
          query: { module: 2, index: 5 }
        });
      },
      goNextStep() {
        let cash_apply = this.form.cash_apply;
        let active = this.bankcards.active;
        let self = this;
        if (this.dml != 0) {
          this.$alert("您尚未完成打码量", "系统提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        if (active === 0) {
          this.$alert("请选择提款的银行卡", "系统提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        if (!cash_apply || cash_apply == 0) {
          this.$alert("提现失败：提款金额不能小于0", "系统提示", {
            confirmButtonText: "确定",
            callback: action => {
              self.form.cash_apply = "";
            }
          });
          return;
        }
        if (
          cash_apply < self.bankcards.min_withdraw_every_time ||
          cash_apply > self.bankcards.max_withdraw_every_time
        ) {
          this.$alert(
            "提现金额应在[" +
            self.bankcards.min_withdraw_every_time +
            "元]至[" +
            self.bankcards.max_withdraw_every_time +
            "元]之间",
            "系统提示",
            {
              confirmButtonText: "确定",
              callback: action => {
                self.form.cash_apply = "";
              }
            }
          );
          return;
        }
        this.$router.push({
          name: "withdraw",
          query: {
            id: 1,
            nextStep: true,
            card_id: self.form.card_id,
            withdraw: self.form.cash_apply
          }
        });
      },
      // 提现
      onSubmit() {
        let self = this;
        let url = "/user/trade/withdraw";
        var data = {
          cash_apply: self.nextStep.withdraw,
          cardid: self.nextStep.card_id
          // bank: self.nextStep.subbranch
        };
        // console.log('data', data);
        this.loading = true;
        request.http(
          "post",
          url,
          paramCryptFn(data),
          success => {
            self.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.result = success.data;
                self.$alert(
                  "您的提现申请提交成功，我们会尽快审核！",
                  "系统提示",
                  {
                    confirmButtonText: "确定",
                    callback: action => {
                      localStorage.setItem("blance", success.data.cash);
                      self.$store.dispatch("setBlance", success.data.cash);
                      self.$router.push({
                        name: "mywithdraw"
                      });
                    }
                  }
                );
              } else if (success.returncode == 301) {
                self.result = success.data;
                self.$alert(self.result.message, "系统提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    self.$router.push({
                      name: "withdraw"
                    });
                  }
                });
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.loading = false;
            self.$alert(self.result.message, "系统提示", {
              confirmButtonText: "确定",
              callback: action => {
                self.$router.push({
                  name: "withdraw"
                });
              }
            });
          }
        );
      },
      bankActiveToggle(index, card_id) {
        this.bankcards.active = index;
        this.form.card_id = card_id;
      },
      //获取绑定的银行卡列表
      getUserBankList() {
        let self = this;
        let url = "/user/bankcard/list";
        let data = {};
        self.loading = true;
        request.http(
          "get",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              if (success.data) {
                if (success.data.bankcards.length != 0) {
                  self.bankcards.data = success.data.bankcards;
                  self.getWithdrawLimit();
                } else {
                  self.$alert("您未绑定银行卡，请绑定银行卡", "系统提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                      self.$router.push({ name: "bank" });
                    }
                  });
                }
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
      //获取银行卡提现的限额
      getWithdrawLimit() {
        let self = this;
        let url = "/user/trade/withdraw/config";
        self.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 200) {
                if (success.data) {
                  self.bankcards.max_withdraw_times_daily =
                    success.data.max_withdraw_times_daily;
                  self.bankcards.times = success.data.times ?
                    success.data.times :
                    0;
                  self.bankcards.min_withdraw_every_time =
                    success.data.min_withdraw_every_time;
                  self.bankcards.max_withdraw_every_time =
                    success.data.max_withdraw_every_time;
                }
              } else if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
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
      withdrawItemToggle(index) {
        this.withdrawItemActive = index;
        if (this.withdrawItemActive == 3) {
          this.refreshCash();
        }
      },
      // 获取用户资金
      refreshCash() {
        let self = this;
        self.transformTable.loading = true;
        request.http(
          "get",
          "/user/profile", {},
          success => {
            self.transformTable.loading = false;
            if (success.returncode == 200) {
              let profile = success.data;
              self.transformTable.cash = Number(profile.cash).toFixed(2);
              self.transformTable.cash_ky = Number(profile.cash_ky).toFixed(2);
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          error => {
            self.transformTable.loading = false;
            console.log("获取用户资金失败", error);
          }
        );
      },
      //获取指定的银行卡信息
      getUserBankInfo(_id) {
        let self = this;
        let url = "/user/bankcard/list";
        let data = { id: _id };
        self.loading = true;
        request.http(
          "get",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              if (success.data) {
                if (success.data.bankcards.length != 0) {
                  let data = success.data.bankcards[0];
                  self.nextStep.bank_name = data.bank[0].bank_name;
                  self.nextStep.province = data.province.name;
                  self.nextStep.city = data.city.name;
                  self.nextStep.real_name = data.realname;
                  self.nextStep.card_no = data.card_no;
                  self.nextStep.subbranch = data.subbranch[0].bank_name;
                } else {
                  self.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
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
      //验证资金密码
      // password 资金密码
      // type 1:提现 2:转账 3.额度转换
      validatorCashPsd(cash_password) {
        let password = cash_password;
        let self = this;
        self.disabled = true;
        setTimeout(() => {
          self.disabled = false
        }, 1000)
        if (this.dml != 0) {
          this.$message({
            showClose: true,
            message: "您尚未完成打码量",
            type: "error"
          });
          return;
        }
        if (!password) {
          this.$message({
            showClose: true,
            message: "资金密码不能为空",
            type: "error"
          });
          return;
        }
        if (!validator.regexpPsd(password)) {
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
                  if (success.returncode) {
                    if (success.returncode == 200) {
                      self.onSubmit();
                    } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    } else if (
                      success.returncode == 301 ||
                      success.returncode == 305
                    ) {
                      self.$alert("资金密码不正确", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {
                          self.nextStep.input_cash_psd = "";
                        }
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
      // 获取打码量是否满足提现需求
      getDML() {
        let self = this;
        this.loading = true;
        let url = "/user/stackcount/list";
        request.http(
          "get",
          url,
          {
            status: "0"
          },
          success => {
            self.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.dml = success.count;
                if (this.dml != 0) {
                  this.tooltipVisible = true;
                } else {
                  this.tooltipVisible = false;
                }
              }
            }
          },
          error => {
            self.loading = false;
            console.log("error", error);
          }
        );
      }
    },
    watch: {
      dml() {
        if (this.dml != 0) {
          this.tooltipVisible = true;
        } else {
          this.tooltipVisible = false;
        }
      },
      // "form.cash_apply" (newValue, oldValue) {
      //   if (newValue !== oldValue) {
      //     if (newValue) {
      //       if (!validator.positiveInt(newValue)) {
      //         this.form.cash_apply = 0;
      //       }
      //     }
      //   }
      // },
      $route(to, from) {
        // console.log("to", to);
        let query = to.query;
        if (query.id) {
          this.withdrawItemActive = parseInt(query.id);
          if (this.withdrawItemActive == 1) {
            // 提现
            if (query.hasOwnProperty("nextStep")) {
              this.bankcards.showNextStep = query.nextStep;
              this.nextStep.withdraw = query.withdraw;
              this.nextStep.card_id = query.card_id;
              this.getUserBankInfo(this.nextStep.card_id);
            }
          }
        } else {
          this.bankcards.showNextStep = false;
          this.getUserBankList();
        }
      }
    },
    computed: {
      //可用余额
      getBlance() {
        if (this.dml == 0) {
          let blance = localStorage.getItem("blance").toString();
          if (blance) {
            return parseFloat(blance).toFixed(2);
          }
        }
        return 0;
      },
      getUserName() {
        return localStorage.getItem("loginname");
      },
      getTotalCash() {
        let cash = Number(this.transformTable.cash);
        let cash_ky = Number(this.transformTable.cash_ky);
        return cash + cash_ky;
      },
      //转换银行卡列表中银行名为字母
      translateBankType() {
        let self = this;
        self.bankcards.translated = self.bankcards.data;
        for (let i = 0; i < self.bankcards.translated.length; i++) {
          let item = self.bankcards.translated[i];
          switch (item.bank[0].bank_name) {
            case "中国工商银行":
              item.bank[0].bank_name = "zggs";
              break;
            case "招商银行":
              item.bank[0].bank_name = "zs";
              break;
            case "中国民生银行":
              item.bank[0].bank_name = "zgms";
              break;
            case "中国建设银行":
              item.bank[0].bank_name = "zgjs";
              break;
            case "中国农业银行":
              item.bank[0].bank_name = "zgny";
              break;
            case "中国银行":
              item.bank[0].bank_name = "zg";
              break;
            case "广发银行":
              item.bank[0].bank_name = "gf";
              break;
            case "中信银行":
              item.bank[0].bank_name = "zx";
              break;
            case "中国光大银行":
              item.bank[0].bank_name = "zggd";
              break;
            case "交通银行":
              item.bank[0].bank_name = "jt";
              break;
            case "中国邮政储蓄银行":
              item.bank[0].bank_name = "zgyzcx";
              break;
            case "浦发银行":
              item.bank[0].bank_name = "pf";
              break;
            case "平安银行":
              item.bank[0].bank_name = "pa";
              break;
            case "兴业银行":
              item.bank[0].bank_name = "xy";
              break;
            case "华夏银行":
              item.bank[0].bank_name = "hx";
              break;
          }
          self.bankcards.translated[i].bank[0].bank_name = item.bank[0].bank_name;
        }
        return self.bankcards.translated;
      }
    },
    created() {
      //query字段
      //id:1 提现,2 转账，3 额度转换
      //nextStep:true 下一步显示,false 隐藏
      let query = this.$route.query;
      if (query.id) {
        this.withdrawItemActive = parseInt(query.id);
        if (query.hasOwnProperty("nextStep")) {
          this.bankcards.showNextStep = query.nextStep;
          this.nextStep.withdraw = query.withdraw;
          this.nextStep.card_id = query.card_id;
          this.getUserBankInfo(this.nextStep.card_id);
        }
      } else {
        this.getUserBankList();
        this.getDML();
      }
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

  .submit-line {
    width: 100%;
    margin-top: 60px;
    text-align: center;
  }

  .flex-tip {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  a.submit {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #cc3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 auto;
    &.no-allowed {
      background-color: #f5f7fa;
      color: #c0c4cc;
      border: 1px solid #e4e7ed;
    }
  }

  .submit {
    width: 115px;
    height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #cc3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 auto;
    &.no-allowed {
      background-color: #f5f7fa;
      color: #c0c4cc;
      border: 1px solid #e4e7ed;
    }
  }

  .time-row {
    text-align: left; // position: relative;
    .last-login-time {
      width: 200px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 12px;
      color: #191919;
      background: #ffffe1;
      border: 1px solid #c8c8c8;
      border-radius: 4px;
    }
    .last-exp {
      font-size: 12px;
      color: #191919;
      display: inline-block;
      width: 120px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }
    .last-tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #777777;
    }
  }

  .tooltip {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #191919;
    line-height: 20px;
    display: inline-block;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
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
    width: 200px;
    height: 40px;
    line-height: 40px;
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

  .binding-inner {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;
  }

  .binding-inner table {
    margin-left: 300px;
  }

  .binding-inner tr {
    line-height: 20px;
  }

  .binding-inner .exp {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #191919;
  }

  .binding-inner .con {
    font-size: 12px;
    color: #191919;
    font-family: PingFangSC-Regular;
    &.error {
      color: #cc3447;
    }
  }

  .cash {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 12px;
    color: #cc3447;
    display: inline-block;
    min-width: 100px;
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

  .no-allowed {
    cursor: not-allowed !important;
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
    min-height: 600px;
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

  .wrap-inner {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;
    .inner-pay-title {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 16px;
      color: #191919;
    }
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
    margin-top: 20px;
    text-align: left;
    font-size: 12px;
    padding: 20px;
    margin-bottom: 30px;
    width: 424px;
    height: 168px;
    background: #ffffe1;
    border: 1px solid #dddddd;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #001600;
    .tip-row {
      margin-bottom: 20px;
      text-align: left;
      .red {
        color: #cc3447;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
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
    text-align: left;
    padding: 20px;
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
    margin-top: 28px;
  }

  .withdraw-container .container-row .withdraw-banks {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .withdraw-container .withdraw-banks .bank-item {
    width: 276px;
    height: 174px;
    display: inline-block;
    cursor: pointer;
    position: relative;
    text-align: center;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }

  .withdraw-container .withdraw-banks .bank-item .bank-no {
    position: relative;
    display: block;
    margin: 0 auto;
    top: 90px;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 14px;
    color: #ffffff;
    width: 190px;
  }

  .withdraw-container .withdraw-banks .bank-item.b1002 {
    background: url("../assets/img/topUp/zggs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1001 {
    background: url("../assets/img/topUp/zs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1006 {
    background: url("../assets/img/topUp/ms.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1003 {
    background: url("../assets/img/topUp/zgjs.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1005 {
    background: url("../assets/img/topUp/zgny.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1026 {
    background: url("../assets/img/topUp/zg.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1027 {
    background: url("../assets/img/topUp/gf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1021 {
    background: url("../assets/img/topUp/zx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1022 {
    background: url("../assets/img/topUp/zggd.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1020 {
    background: url("../assets/img/topUp/jt.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1066 {
    background: url("../assets/img/topUp/zgyzcx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1004 {
    background: url("../assets/img/topUp/pf.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1010 {
    background: url("../assets/img/topUp/pa.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1009 {
    background: url("../assets/img/topUp/xy.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1025 {
    background: url("../assets/img/topUp/hx.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b4830 {
    background: url("../assets/img/topUp/js.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1056 {
    background: url("../assets/img/topUp/nb.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b4835 {
    background: url("../assets/img/topUp/gdny.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1054 {
    background: url("../assets/img/topUp/nj.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b4006 {
    background: url("../assets/img/topUp/hr.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1032 {
    background: url("../assets/img/topUp/bj.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1023 {
    background: url("../assets/img/topUp/nchzxys.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1024 {
    background: url("../assets/img/topUp/sh.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1082 {
    background: url("../assets/img/topUp/shns.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.b1099 {
    background: url("../assets/img/topUp/other.png") no-repeat;
    background-size: cover;
  }

  .withdraw-container .withdraw-banks .bank-item.active {
    border: 1px solid #cc3447;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
    border-radius: 12px;
  }

  .withdraw-container .withdraw-banks .bank-item.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 24px;
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
    margin: 29px auto 47px;
    background: #fff;
    width: 934px;
    height: 435px;
    border: 1px solid #999799;
    padding-top: 43px;
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
  .account-all {
    margin-top: 30px;
    width: 400px;
    border: 1px solid #333;
    td {
      border: 1px solid #333;
      height: 34px;
      padding-left: 5px;
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
    background: #d8d8d8;
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
    color: #847b5f;
  }

  .tabs .tab-title.active>a {
    color: #bd8454;
  }

  .tabs .tab-title.active {
    /* border-top: 2px solid #A65B06; */
    color: #bd8454;
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
    margin-top: 30px;
    width: 340px;
    td.exp {
      min-width: 150px;
      font-size: 14px;
    }
    td.content {
      text-align: right;
    }
    td {
      padding: 5px 0;
    }
    .submit {
      display: inline-block;
      text-align: center;
      width: auto;
      height: 30px;
      background: #d4914d;
      border-radius: 6px;
      line-height: 30px;
      color: #fff;
      font-size: 14px;
      padding: 0 35px;
      margin: 15px 0;
    }
  }

  .transform-inner-title {
    height: 34px;
    line-height: 34px;
    margin-bottom: 30px;
    .exp {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 20px;
      display: inline-block;
    }
    .exp2 {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 20px;
      display: inline-block;
    }
  }
</style>