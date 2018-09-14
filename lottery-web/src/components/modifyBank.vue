<template>
  <div class="bank-wrap search-form record-options" v-loading="loading">
    <div class="tab-line">
      <p>银行卡绑定</p>
    </div>
    <div class="binding-wrap">
      <el-steps :active="bindActive" align-center>
        <el-step title="验证老银行卡"></el-step>
        <el-step title="输入银行卡信息"></el-step>
        <el-step title="确认银行卡信息"></el-step>
        <el-step title="绑定结果"></el-step>
      </el-steps>
      <div class="binding-inner">
        <div v-show="bindActive === 1" class="item">
          <table>
            <tbody>
              <tr v-if="!addMore">
                <td align="right" class="exp">银行卡号：</td>
                <td align="left">
                  <el-input v-model.trim="validateForm.bankText" clearable disabled class="content">
                  </el-input>
                </td>
              </tr>
              <tr v-else>
                <td align="right" class="exp">选择验证银行卡：</td>
                <td align="left">
                  <el-select class="content" v-model="bankcards.value" clearable placeholder="请选择你要验证的银行卡" :loading="bankcards.loading" :loading-text="bankcards.loadingtext" @change="changeUserBankCardsItem" @focus="focusUserBankCards">
                    <el-option v-for="option in bankcards.options" :key="option._id" :label="option.card_no" :value="option._id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户人姓名：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="validateForm.realName" clearable class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">银行账号：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="validateForm.inputBankNo" clearable class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">资金密码：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="validateForm.bankPsd" clearable type="password" class="content">
                  </el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-line">
            <!-- <a class="back" @click="previousBank">返回</a> -->
            <a class="submit" type="submit" @click="validateOldBankInfo">下一步</a>
          </div>
        </div>
        <div v-show="bindActive === 2" class="item">
          <table>
            <tbody>
              <tr>
                <td align="right" class="exp">开户银行：</td>
                <td align="left">
                  <el-select v-model="banks.value" class="content" clearable placeholder="请选择开户银行" :loading="banks.loading" :loading-text="banks.loadingtext" @change="changeBankItem" @focus="focusBank">
                    <el-option v-for="item in banks.options" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户银行区域：</td>
                <td align="left">
                  <el-select v-model="provinces.value" clearable placeholder="请选择开户省" :loading="provinces.loading" :loading-text="provinces.loadingtext" @change="changeProItem" @focus="focusPro" class="content">
                    <el-option v-for="item in provinces.options" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                  <el-select v-model="cities.value" clearable placeholder="请选择开户市" @change="changeCityItem" :loading="cities.loading" :loading-text="cities.loadingtext" class="content">
                    <el-option v-for="item in cities.options" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">支行名称：</td>
                <td align="left">
                  <el-select v-model="subbranchs.value" clearable placeholder="请选择支行名称" :loading="subbranchs.loading" :loading-text="subbranchs.loadingtext" @change="changeSubBranchItem" class="content">
                    <el-option v-for="item in subbranchs.options" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户人姓名：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="accountName" clearable class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">银行账号：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="bankCard" clearable class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">确认银行账号：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="bankCard2" clearable class="content">
                  </el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-line">
            <a class="submit" type="submit" @click="validateBankInfo">下一步</a>
          </div>
        </div>
        <div v-show="bindActive === 3" class="item">
          <table>
            <tbody>
              <tr>
                <td align="right" class="exp">开户银行：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="inputBank" :disabled="true" class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户银行区域：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="getKhyhArea" :disabled="true" class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">支行名称：</td>
                <td align="left">
                  <el-input placeholder="请选择支行名称" v-model.trim="inputSubBranch" :disabled="true" class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户人姓名：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="inputAccountName" :disabled="true" class="content">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">银行账号：</td>
                <td align="left">
                  <el-input placeholder="请输入内容" v-model.trim="inputBankCard" :disabled="true" class="content">
                  </el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-line">
            <a class="back" @click="previousBank">返回上一步</a>
            <a class="submit" type="submit" @click="onSubmit">确认无误</a>
          </div>
        </div>
        <div v-show="bindActive === 4" class="step3">
          <p>恭喜你，你的尾号
            <span>{{bindSuccess.card_no | filterEnd}}</span> 银行卡绑定成功。</p>
          <div class="bank-info" :class="'b'+getBankBg(bindSuccess.bank)">
            <span class="info-no">{{bindSuccess.card_no | filterName}}</span>
          </div>
          <p class="small-tip mt-60" style="margin-bottom: 10px;">现在您可以进行“银行卡管理”</p>
          <router-link :to="{name:'bank'}" class="btn-binding mt-20" style="margin-top: 10px;">银行卡管理</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../axios/axios";
  import { bankCard } from "../../src/lib/utils/validator";
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        bindSuccess: {}, // 绑定成功后的信息
        loading: false,
        bindActive: 1, //当前绑定状态
        //开户行
        banks: {
          loading: false,
          loadingtext: "正在搜索...",
          value: "",
          text: "",
          options: []
        },
        //开户省
        provinces: {
          loading: false,
          loadingtext: "正在搜索...",
          value: "",
          text: "",
          options: []
        },
        //开户市
        cities: {
          loading: false,
          loadingtext: "正在搜索...",
          value: "",
          text: "",
          options: []
        },
        //支行名称
        subbranchs: {
          loading: false,
          loadingtext: "正在搜索...",
          value: "",
          text: "",
          options: []
        },
        accountName: "", //开户人姓名
        bankCard: "", //银行账号
        bankCard2: "", //确认银行账号
        //确认开户行
        inputBank: "",
        //确认开户银行区域
        inputAccountArea: {
          pro: "",
          city: ""
        },
        //确认支行名称
        inputSubBranch: "",
        inputAccountName: "", //确认开户人姓名
        inputBankCard: "", //确认银行账号
        //深度监听银行id和城市id属性
        filter: {
          bankid: "",
          cityid: ""
        },
        validateForm: {
          bankText: "", //卡号text
          bankid: "", //银行卡的_id
          realName: "", //真实姓名
          inputBankNo: "", //输入的卡号
          bankPsd: "" //输入的资金密码
        },
        //当前已绑定银行卡列表
        bankcards: {
          loading: false,
          loadingtext: "正在搜索...",
          options: [],
          value: ""
        },
        addMore: false
      };
    },
    filters: {
      filterName(str) {
        if (str) {
          let strLength = str.split('').length;
          let starStr = "***********";
          let final = str.substr(0, 4) + starStr + str.substr(strLength - 4, strLength);
          return final;
        }
        return;
      },
      filterEnd(str) {
        if (str) {
          let strLength = str.split('').length;
          let final = str.substr(strLength - 4, strLength);
          return final;
        }
        return;
      }
    },
    watch: {
      bindActive(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            switch (newValue) {
              case 1:
                //若开户行列表为空，调用获取开户行列表api
                if (this.banks.options.length === 0) {
                  this.getBankList();
                }
                //若省份列表为空，调用获取省份列表api
                if (this.provinces.options.length === 0) {
                  this.getProList();
                }
                break;
            }
          }
        }
      },
      //赋值filter.bankid
      "banks.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.filter.bankid = newValue;
        }
      },
      //赋值filter.cityid
      "cities.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.filter.cityid = newValue;
        }
      },
      filter: {
        handler: "getBankCityChange",
        deep: true
      },
      accountName(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            this.inputAccountName = newValue;
          }
        }
      },
      bankCard(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            this.inputBankCard = newValue;
          }
        }
      }
    },
    methods: {
      previousBank() {
        // this.$router.push({ name: "bank" });
        this.bindActive = 2;
      },
      //验证旧银行卡开户信息
      validateOldBankInfo() {
        if (!this.validateForm.realName) {
          this.$message({
            showClose: true,
            message: "请填写开户人姓名",
            type: "error"
          });
          return;
        }
        if (!this.validateForm.inputBankNo) {
          this.$message({
            showClose: true,
            message: "请填写银行账号",
            type: "error"
          });
          return;
        }
        if (!bankCard(this.validateForm.inputBankNo)) {
          this.$message({
            showClose: true,
            message: "请填写正确的银行账号",
            type: "error"
          });
          return;
        }
        if (!this.validateForm.bankPsd) {
          this.$message({
            showClose: true,
            message: "请填写资金密码",
            type: "error"
          });
          return;
        }
        let self = this;
        let url = "/user/bankcard/update";
        self.loading = true;
        request.login(
          "post",
          "/user/random",
          {
            loginname: localStorage.getItem("loginname")
          },
          success => {
            if (success.returncode == 200) {
              let random = success.data.random;
              let cash_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(self.validateForm.bankPsd).toString(),
                random
              ).toString();
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
                      request.http(
                        "post",
                        url,
                        {
                          _id: self.validateForm.bankid,
                          card_no: self.validateForm.inputBankNo,
                          realname: self.validateForm.realName,
                          // cash_password: cash_password
                        },
                        success => {
                          self.loading = false;
                          if (success.returncode) {
                            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                              request.loginAgain(self);
                            } else if (success.returncode == 200) {
                              self.bindActive = 2;
                            } else if (success.returncode == 301) {
                              self.$alert('<div class="lottery-title">验证失败，请重新填写</div>', '系统提醒', {
                                confirmButtonText: '关闭',
                                center: true,
                                dangerouslyUseHTMLString: true,
                                customClass: "syxw-wrap-inner",
                                callback: action => {
                                  self.validateForm.realName = "";
                                  self.validateForm.inputBankNo = "";
                                }
                              })
                            } else if (success.returncode == 305) {
                              self.$alert('<div class="lottery-title">验证失败，请重新填写</div>', '系统提醒', {
                                confirmButtonText: '关闭',
                                center: true,
                                dangerouslyUseHTMLString: true,
                                customClass: "syxw-wrap-inner",
                                callback: action => {
                                  self.validateForm.realName = "";
                                  self.validateForm.inputBankNo = "";
                                }
                              })
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
                          console.log("数据异常", error);
                        }
                      );
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
            console.log("/user/random---error", error);
          }
        );
      },
      //验证银行卡开户信息
      validateBankInfo() {
        if (!this.banks.value) {
          this.$message({
            showClose: true,
            message: "请选择开户银行",
            type: "error"
          });
          return;
        }
        if (!this.provinces.value) {
          this.$message({
            showClose: true,
            message: "请选择开户银行省份",
            type: "error"
          });
          return;
        }
        if (!this.cities.value) {
          this.$message({
            showClose: true,
            message: "请选择开户银行城市",
            type: "error"
          });
          return;
        }
        if (!this.subbranchs.value) {
          this.$message({
            showClose: true,
            message: "请选择开户支行",
            type: "error"
          });
          return;
        }
        if (!this.accountName) {
          this.$message({
            showClose: true,
            message: "请填写开户人姓名",
            type: "error"
          });
          return;
        }
        if (!this.bankCard) {
          this.$message({
            showClose: true,
            message: "请填写银行账号",
            type: "error"
          });
          return;
        }
        if (!bankCard(this.bankCard)) {
          this.$message({
            showClose: true,
            message: "请填写正确的银行账号",
            type: "error"
          });
          return;
        }
        if (!this.bankCard2) {
          this.$message({
            showClose: true,
            message: "请确认银行账号",
            type: "error"
          });
          return;
        }
        if (!bankCard(this.bankCard2)) {
          this.$message({
            showClose: true,
            message: "请填写正确的确认银行账号",
            type: "error"
          });
          return;
        }
        if (this.bankCard2 !== this.bankCard) {
          this.$message({
            showClose: true,
            message: "两次输入的银行卡号必须一致",
            type: "error"
          });
          return;
        }
        this.bindActive = 3;
      },
      changeBankItem(value) {
        this.subbranchs.options = [];
        this.subbranchs.value = "";
        if (value) {
          let obj = {};
          obj = this.banks.options.find(item => {
            return item.bank_id === value;
          });
          this.inputBank = obj.bank_name;
        }
      },
      getBankCityChange() {
        // console.log("this.filter", this.filter);
        if (this.filter.bankid && this.filter.cityid) {
          this.getSubBranchList(this.filter.cityid, this.filter.bankid);
        } else {
          this.subbranchs.options = [];
          this.subbranchs.value = "";
        }
      },
      //获取银行列表
      getBankList() {
        let self = this;
        let url = "/user/bank/list";
        this.banks.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.banks.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.banks.options = success.data.banks;
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
            self.banks.loading = false;
            console.log("数据异常", error);
          }
        );
      },
      //获取省份列表
      getProList() {
        let self = this;
        let url = "/user/province/list";
        self.provinces.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.provinces.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.provinces.options = success.data.provinces;
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
            self.provinces.loading = false;
            console.log("数据异常", error);
          }
        );
      },
      //省份选中值更改
      changeProItem(value) {
        if (value) {
          let obj = {};
          obj = this.provinces.options.find(item => {
            return item.code === value;
          });
          this.cities.options = [];
          this.cities.value = "";
          this.subbranchs.options = [];
          this.subbranchs.value = "";
          this.inputAccountArea.pro = obj.name;
          this.getCityList(obj.code);
        } else {
          this.cities.options = [];
          this.cities.value = "";
          this.subbranchs.options = [];
          this.subbranchs.value = "";
        }
      },
      changeCityItem(value) {
        if (value) {
          let obj = {};
          obj = this.cities.options.find(item => {
            return item.code === value;
          });
          this.inputAccountArea.city = obj.name;
        }
      },
      changeSubBranchItem(value) {
        if (value) {
          let obj = {};
          obj = this.subbranchs.options.find(item => {
            return item.bank_id === value;
          });
          this.inputSubBranch = obj.bank_name;
        }
      },
      //获取城市列表
      getCityList(proid) {
        let self = this;
        let url = "/user/city/list";
        this.cities.loading = true;
        request.http(
          "get",
          url,
          {
            provinceid: proid
          },
          success => {
            self.cities.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.cities.options = success.data.cities;
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
            self.cities.loading = false;
          }
        );
      },
      //获取支行列表
      getSubBranchList(cityid, bankid) {
        let self = this;
        let url = "/user/subbranch/list";
        self.subbranchs.loading = true;
        request.http(
          "get",
          url,
          {
            city_id: cityid,
            pid: bankid
          },
          success => {
            self.subbranchs.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.subbranchs.options = success.data.subbranchs;
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
            self.subbranchs.loading = false;
            console.log("数据异常", error);
          }
        );
      },
      //确认修改
      onSubmit() {
        let self = this;
        let url = "",
          data = {};
        this.loading = true;
        request.login(
          "post",
          "/user/random",
          {
            loginname: localStorage.getItem("loginname")
          },
          success => {
            if (success.returncode == 200) {
              let random = success.data.random;
              let cash_password = CryptoJS.HmacMD5(
                CryptoJS.MD5("qwe123").toString(),
                random
              ).toString();
              //addMore为false或者空，则调用修改银行卡api
              //addMore为true,则调用新增银行卡api
              if (!this.addMore) {
                url = "/user/bankcard/update";
                data = {
                  _id: self.validateForm.bankid,
                  bank: self.inputBank,
                  province: self.inputAccountArea.pro,
                  city: self.inputAccountArea.city,
                  subbranch: self.inputSubBranch,
                  realname: self.validateForm.realName,
                  card_no: self.validateForm.inputBankNo,
                  cash_password: cash_password,
                  newrealname: self.accountName,
                  newcard_no: self.bankCard
                };
              } else {
                url = "/user/bankcard/bind";
                data = {
                  _id: self.validateForm.bankid,
                  bank: self.inputBank,
                  province: self.inputAccountArea.pro,
                  city: self.inputAccountArea.city,
                  subbranch: self.inputSubBranch,
                  realname: self.inputAccountName,
                  card_no: self.bankCard,
                  cash_password: cash_password
                };
              }
              request.http(
                "post",
                url,
                paramCryptFn(data),
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                      request.loginAgain(self);
                    } else if (success.returncode == 200) {
                      self.bindActive = 4;
                      self.bindSuccess = success.data;
                    } else if (success.returncode == 301) {
                      self.$alert('<div class="lottery-title">绑定失败，请重新填写</div>', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        dangerouslyUseHTMLString: true,
                        customClass: "syxw-wrap-inner",
                        callback: action => {
                          self.bindActive = 2;
                          self.validateForm.realName = "";
                          self.validateForm.inputBankNo = "";
                        }
                      })
                    } else if (success.returncode == 302) {
                      self.$alert('<div class="lottery-title">此卡已绑定,不可重复绑定</div>', '系统提醒', {
                        confirmButtonText: '确定',
                        center: true,
                        dangerouslyUseHTMLString: true,
                        customClass: "syxw-wrap-inner",
                        callback: action => {
                          self.bindActive = 2;
                          self.validateForm.realName = "";
                          self.validateForm.inputBankNo = "";
                        }
                      })
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
                  console.log("数据异常", error);
                  self.$alert('<div class="lottery-title">绑定失败，请重新绑定</div>', '系统提醒', {
                    confirmButtonText: '确定',
                    center: true,
                    dangerouslyUseHTMLString: true,
                    customClass: "syxw-wrap-inner",
                    callback: action => {
                      self.$router.push({ name: "bank" });
                    }
                  })
                }
              );
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
            console.log("/user/random---error", error);
          }
        );
      },
      getBankBg(name) {
        switch (name) {
          case "招商银行":
            return "1001";
          case "中国工商银行":
            return "1002";
          case "中国建设银行":
            return "1003";
          case "浦发银行":
            return "1004";
          case "中国农业银行":
            return "1005";
          case "中国民生银行":
            return "1006";
          case "平安银行":
            return "1010";
          case "兴业银行":
            return "1009";
          case "交通银行":
            return "1020";
          case "中信银行":
            return "1021";
          case "中国光大银行":
            return "1022";
          case "华夏银行":
            return "1025";
          case "中国银行":
            return "1026";
          case "广发银行":
            return "1027";
          case "邮政储蓄银行":
            return "1066";
          case "农村合作信用社":
            return "1023";
          case "上海银行":
            return "1024";
          case "北京银行":
            return "1032";
          case "南京银行":
            return "1054";
          case "宁波银行":
            return "1056";
          case "上海农商银行":
            return "1082";
          case "华润银行":
            return "4006";
          case "江苏银行":
            return "4830";
          case "广东南粤银行":
            return "4835";
          default:
            return "1099";
        }
      },
      //银行select获取焦点
      focusBank(event) {
        if (this.banks.options.length === 0) {
          this.getBankList();
        }
      },
      //省份select获取焦点
      focusPro(event) {
        if (this.provinces.options.length === 0) {
          this.getProList();
        }
      },
      //获取绑定的银行卡列表
      //列表数组为空数组，则没有绑定
      //否则，有绑定银行卡
      getUserBankList() {
        let self = this;
        let url = "/user/bankcard/list";
        self.bankcards.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.bankcards.loading = false;
            if (success.returncode == 200) {
              if (success.data) {
                if (success.data.bankcards.length != 0) {
                  self.bankcards.options = success.data.bankcards;
                } else {}
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
            self.bankcards.loading = false;
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
          }
        );
      },
      //需要验证的银行卡列表获取焦点
      focusUserBankCards(event) {
        if (this.banks.options.length === 0) {
          this.getUserBankList();
        }
      },
      changeUserBankCardsItem(value) {
        if (value) {
          let obj = {};
          obj = this.bankcards.options.find(item => {
            return item._id === value;
          });
          this.validateForm.bankid = obj._id;
        }
      }
    },
    mounted() {
      //获取验证旧银行卡的文本和唯一id
      if (
        this.$route.query &&
        this.$route.query.banktext &&
        this.$route.query.bankid
      ) {
        this.validateForm.bankText = this.$route.query.banktext;
        this.validateForm.bankid = this.$route.query.bankid;
      }
      //判断是否是新增更多银行卡
      // addMore：true  表示更多
      // addMore:false或者无该字段  表示第一次添加银行卡
      this.addMore = this.$route.query.addMore;
    },
    computed: {
      //开户银行区域
      getKhyhArea() {
        return this.inputAccountArea.pro + this.inputAccountArea.city;
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>
<style scoped lang="scss">
  .submit-line {
    width: 100%;
    margin-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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

  .bank-info {
    width: 276px;
    height: 174px;
    display: inline-block;
    position: relative;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);

    .info-no {
      position: relative;
      display: block;
      margin: 0 auto;
      top: 90px;
      color: #FFFFFF;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 20px;
      text-align: center;
    }
  }

  .bank-wrap {
    color: #191919;
    padding: 30px 20px;
    width: 100%;
  }

  .bank-info.b1002 {
    background: url("../assets/img/topUp/zggs.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1001 {
    background: url("../assets/img/topUp/zs.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1006 {
    background: url("../assets/img/topUp/ms.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1003 {
    background: url("../assets/img/topUp/zgjs.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1005 {
    background: url("../assets/img/topUp/zgny.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1026 {
    background: url("../assets/img/topUp/zg.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1027 {
    background: url("../assets/img/topUp/gf.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1021 {
    background: url("../assets/img/topUp/zx.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1022 {
    background: url("../assets/img/topUp/zggd.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1020 {
    background: url("../assets/img/topUp/jt.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1066 {
    background: url("../assets/img/topUp/zgyzcx.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1004 {
    background: url("../assets/img/topUp/pf.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1010 {
    background: url("../assets/img/topUp/pa.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1009 {
    background: url("../assets/img/topUp/xy.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1025 {
    background: url("../assets/img/topUp/hx.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b4830 {
    background: url("../assets/img/topUp/js.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1056 {
    background: url("../assets/img/topUp/nb.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b4835 {
    background: url("../assets/img/topUp/gdny.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1054 {
    background: url("../assets/img/topUp/nj.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b4006 {
    background: url("../assets/img/topUp/hr.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1032 {
    background: url("../assets/img/topUp/bj.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1023 {
    background: url("../assets/img/topUp/nchzxys.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1024 {
    background: url("../assets/img/topUp/sh.png") no-repeat;
    background-size: cover;
  }

  .bank-info.b1082 {
    background: url("../assets/img/topUp/shns.png") no-repeat;
    background-size: cover;
  }

  .bank-item.b1099 {
    background: url("../assets/img/topUp/other.png") no-repeat;
    background-size: cover;
  }

  .mt-60 {
    margin-top: 60px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .ml-300 {
    margin-left: 300px;
  }

  .bank-wrap {
    padding: 30px 20px;
    color: #191919;
    width: 100%;
  }

  .bank-list table {
    width: 100%;
  }

  .bank-list th {
    height: 34px;
    background: #d4914d;
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
    margin: 30px auto 0;
    width: 140px;
    height: 48px;
    line-height: 46px;
    display: block;
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
    background: #eeeeee;
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
    font-weight: bold;
  }

  /* .binding-inner .item-input {
    width: 241px;
    height: 38px;
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    line-height: 38px;
    margin-left: 13px;
    padding: 0 7px;
  } */

  .binding-inner .item-input:focus {
    border: 1px solid #e89406;
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

  .step3 .complete {
    display: block;
    width: 90px;
    height: 90px;
    margin: 0 auto;
    margin-top: 136px;
    color: #d2d2d2;
    font-size: 90px;
    line-height: 90px;
  }

  .step3 p {
    text-align: center;
    margin-top: 60px;
    font-family: PingFangSC-Regualr;
    font-size: 16px;
    color: #191919;
    margin-bottom: 20px;
  }

  .step3 p.small-tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #777777;
  }

  .tab-line {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 16px;
    color: #191919;
    text-align: left;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>