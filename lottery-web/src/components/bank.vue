<template>
  <div class="bank-wrap search-form" v-loading="loading">
    <div class="binding-wrap" v-if="bindingVisible">
      <div class="tule-title">
        <strong>银行卡绑定</strong>
      </div>
      <el-steps :active="bindActive" align-center>
        <el-step title="输入银行卡信息"></el-step>
        <el-step title="确认银行卡信息"></el-step>
        <el-step title="绑定结果"></el-step>
      </el-steps>
      <div class="binding-inner item">
        <div v-show="bindActive === 1">
          <table>
            <tbody>
              <tr>
                <td align="right" class="exp">开户银行：</td>
                <td align="left">
                  <el-select class="content" v-model="banks.value" clearable placeholder="请选择开户银行" :loading="banks.loading" :loading-text="banks.loadingtext" @change="changeBankItem">
                    <el-option v-for="item in banks.options" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户银行区域：</td>
                <td align="left">
                  <el-select class="content" v-model="provinces.value" clearable placeholder="请选择开户省" :loading="provinces.loading" :loading-text="provinces.loadingtext" @change="changeProItem">
                    <el-option v-for="item in provinces.options" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                  <el-select class="content" v-model="cities.value" clearable placeholder="请选择开户市" @change="changeCityItem">
                    <el-option v-for="item in cities.options" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">支行名称：</td>
                <td align="left">
                  <el-select class="content" v-model="subbranchs.value" clearable placeholder="请选择支行名称" :loading="subbranchs.loading" :loading-text="subbranchs.loadingtext" @change="changeSubBranchItem">
                    <el-option v-for="item in subbranchs.options" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户人姓名：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="accountName" clearable>
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">银行账号：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="bankCard" clearable>
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">确认银行账号：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="bankCard2" clearable>
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp"></td>
                <td align="left">
                  <a class="submit" type="submit" @click="validateBankInfo">下一步</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-show="bindActive === 2">
          <table class="second">
            <tbody>
              <tr>
                <td align="right" class="exp">开户银行：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="inputBank" :disabled="true">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户银行区域：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="inputAccountArea.pro+inputAccountArea.city" :disabled="true">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">支行名称：</td>
                <td align="left">
                  <el-input class="content" placeholder="请选择支行名称" v-model.trim="inputSubBranch" :disabled="true">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">开户人姓名：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="inputAccountName" :disabled="true">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">银行账号：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="inputBankCard" :disabled="true">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp">资金密码：</td>
                <td align="left">
                  <el-input class="content" placeholder="请输入内容" v-model.trim="inputCashPsd" type="password">
                  </el-input>
                </td>
              </tr>
              <tr>
                <td align="right" class="exp"></td>
                <td align="left">
                  <a class="submit" type="submit" @click="onSubmit">信息确认无误</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-show="bindActive === 3" class="step3">
          <p>恭喜你，你的尾号
            <span>{{bindSuccess.card_no | filterEnd}}</span> 银行卡绑定成功。</p>
          <div class="bank-info" :class="'b'+getBankBg(bindSuccess.bank)">
            <span class="info-no">{{bindSuccess.card_no | filterName}}</span>
          </div>
          <p class="small-tip mt-60">现在您可以进行“银行卡管理”</p>
          <a class="btn-binding mt-20" @click="getUserBankList">银行卡管理</a>
        </div>
      </div>
    </div>
    <div v-if="!isBindBank && !bindingVisible">
      <div class="no-binding">
        <span class="no-binding-tip">您还未绑定任何银行卡</span>
        <a class="btn-binding" @click="startBind">立即绑定</a>
      </div>
    </div>
    <div v-if="isBindBank" class="bank-list">
      <div class="tule-title">
        <strong>银行卡绑定规则</strong>
      </div>
      <div class="tips">
        <p>1. 一个游戏账户最多绑定
          <span>4 张</span>银行卡， 您目前绑定了
          <span>{{bankcards.count}} 张</span>卡，还可以绑定
          <span>{{restBankCount}} 张</span>。</p>
        <!-- <p>2. 银行卡信息锁定后，不能增加新卡绑定，已绑定的银行卡信息不能进行修改和删除。</p> -->
        <p>2. 发起第一次提现后, 系统会自动锁定银行卡。</p>
        <p>3. 为了您的账户资金安全，银行卡“新增”和“修改”将在操作完成2小时0分后，新卡才能发起“向平台提现”。</p>
      </div>
      <hr class="user-split-line">
      <div class="options">
        <!-- <a class="btn-option add" @click="addBankCard()" v-if="bankcards.count<4">新增银行卡</a>
        <a class="btn-option clock" @click="lockBankCard" v-if="bankcards.allStatus == 0">锁定银行卡</a> -->
        <a class="btn-option add" @click="addBankCard" v-if="bankcards.count<4">新增银行卡</a>
        <a class="btn-option clock" @click="lockBankCard" v-if="bankcards.allStatus == 0">锁定银行卡</a>
      </div>
      <table>
        <tbody>
          <tr>
            <th>银行名称</th>
            <th>卡号</th>
            <th>绑定时间</th>
            <th>银行卡状态</th>
            <th style="width:180px;">操作</th>
          </tr>
          <tr v-for="item in bankcards.data" class="group-item" :key="item._id">
            <td>{{item.bank[0].bank_name}}</td>
            <td>{{item.card_no}}</td>
            <td>{{getBindTime(item.create_at)}}</td>
            <td>{{getBankCardStatus(item.status)}}</td>
            <td>
              <a class="edit" @click="modifiedBankCard(item._id,item.card_no,item.status)">修改</a>
              <a class="delete" @click="deleteBankCard(item._id,item.card_no,item.status)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import request from "../axios/axios";
  import { bankCard } from "../lib/utils/validator";
  import moment from "moment";
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        bindSuccess: {}, // 绑定成功后的信息
        loading: false,
        isBindBank: false, //是否有绑定银行卡
        bindingVisible: false, //是否在绑定
        bindActive: 0, //当前绑定状态
        isSetBankPassword: 0, //是否绑定资金密码
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
        inputCashPsd: '', // 确认资金密码
        bankcards: {
          data: [],
          count: 0,
          allStatus: 0
        }, //用户绑定的银行卡列表
        //深度监听银行id和城市id属性
        filter: {
          bankid: "",
          cityid: ""
        }
      };
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
      //修改银行卡
      modifiedBankCard(id, banktext, status) {
        if (status == 0) {
          this.$router.push({
            name: "userCheckSafeQ",
            query: { id: id, banktext: banktext, urlName: "modifyBank" } //id:当前银行卡的_id，banktext:当前银行卡的文本,urlName:验证安全问题后，要跳转的组件name
          });
        } else if (status == 1) {
          this.$alert("银行卡已锁定", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
        }
      },
      //删除银行卡
      deleteBankCard(id, banktext, status) {
        if (status == 0) {
          this.$router.push({
            name: "destroyBank",
            query: { id: id, banktext: banktext } //id:当前银行卡的_id，banktext:当前银行卡的文本,urlName:验证安全问题后，要跳转的组件name
          });
        } else if (status == 1) {
          this.$alert("银行卡已锁定", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
        }
      },
      //锁定银行卡
      lockBankCard() {
        if (this.bankcards.allStatus == 1) {
          this.$alert("银行卡已锁定", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
        } else {
          this.$router.push({
            name: "lockBank"
          });
        }
      },
      getBankCardStatus(status) {
        let text = "";
        switch (status) {
          case 0:
            text = "未锁定";
            break;
          case 1:
            text = "锁定";
            break;
        }
        return text;
      },
      getBindTime(time) {
        return moment(time).format("YYYY年 MM月 DD日 , HH:mm:ss");
      },
      addBankCard() {
        if (this.bankcards.allStatus == 1) {
          this.$alert("银行卡已锁定，不可新增银行卡", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
        } else {
          this.$router.push({
            name: "userCheckSafeQ",
            query: { urlName: "modifyBank", addMore: true } //urlName:验证安全问题后，要跳转的组件name;adMore:是否是增加更多银行卡,如果是，modifyBank页面的银行卡就要出现可以多选的下拉框，而不是一个span
          });
        }
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
        this.bindActive = 2;
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
      startBind() {
        this.isSetBankPsd();
      },
      //获取绑定的银行卡列表
      //列表数组为空数组，则没有绑定
      //否则，有绑定银行卡
      getUserBankList() {
        let self = this;
        let url = "/user/bankcard/list";
        self.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              if (success.data) {
                if (success.data.bankcards.length != 0) {
                  self.bindingVisible = false;
                  self.isBindBank = true;
                  self.bankcards.data = success.data.bankcards;
                  self.bankcards.count = success.data.bankcards.length;
                  self.bankcards.allStatus = success.data.bankcards[0].status;
                } else {
                  self.bindingVisible = false;
                  self.isBindBank = false;
                }
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
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
      //获取银行卡列表
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
                  message: success.data.msg,
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
                  message: success.data.msg,
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
        this.loading = true;
        request.http(
          "get",
          url,
          {
            provinceid: proid
          },
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.cities.options = success.data.cities;
              } else {
                self.$message({
                  showClose: true,
                  message: success.data.msg,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.loading = false;
            console.log("数据异常", error);
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
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
                  message: success.data.msg,
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
      //用户是否设置资金密码
      isSetBankPsd() {
        let self = this;
        request.http(
          "get",
          "/user/bankcard/password/isSet", {},
          success => {
            if (success.returncode == 200) {
              self.isSetBankPassword = success.data.isSet;
              if (self.isSetBankPassword) {
                self.bindingVisible = true;
                self.bindActive = 1;
              } else {
                self.bindingVisible = false;
                self.bindActive = 0;
                self.$router.push({ name: "resetPsd" });
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          error => {
            console.log("数据异常", error);
          }
        );
      },
      //确认修改
      onSubmit() {
        let self = this;
        let url = "/user/bankcard/bind";
        if (!this.inputCashPsd) {
          this.$message({
            showClose: true,
            message: "请填写资金密码",
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
            if (success.returncode == 200) {
              let random = success.data.random;
              let cash_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(self.inputCashPsd).toString(),
                random
              ).toString();
              var data = {
                bank: self.inputBank,
                province: self.inputAccountArea.pro,
                city: self.inputAccountArea.city,
                subbranch: self.inputSubBranch,
                realname: self.accountName,
                card_no: self.bankCard,
                cash_password: cash_password
              }
              request.http(
                "post",
                url,
                paramCryptFn(data),
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 301 || success.returncode == 303) {
                      self.$alert("绑定失败，请重新绑定", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {
                          self.bindActive = 1;
                        }
                      });
                    } else if (success.returncode == 200) {
                      self.bindActive = 3;
                      self.bindSuccess = success.data;
                    } else if (success.returncode == 305) {
                      self.$alert("资金密码不正确", "系统提醒", {
                        confirmButtonText: "确定",
                        center: true,
                        callback: action => {}
                      });
                    } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    } else {
                      self.$message({
                        showClose: true,
                        message: success.data.msg,
                        type: "error"
                      });
                    }
                  }
                },
                error => {
                  self.loading = false;
                  console.log("数据异常", error);
                  self.$alert("绑定失败，请重新绑定", "系统提醒", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: action => {
                      self.$router.push({ name: "bank" });
                    }
                  });
                }
              );
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
            console.log("/user/random---error", error);
          }
        );
      }
    },
    computed: {
      restBankCount() {
        return 4 - this.bankcards.count;
      }
    },
    mounted() {
      this.getUserBankList();
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
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>
<style scoped lang="scss">
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

  .small-tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #777777;
  }

  .mt-60 {
    margin-top: 60px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .bank-list table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .bank-list th {
    /* height: 34px; */
    background: #F6F6F6;
    border-bottom: 1px solid #DDDDDD;
    color: #191919;
    font-size: 14px;
    padding: 15px 0;
  }

  .bank-list td {
    padding: 17px 0;
  }

  .bank-list td>a {
    display: inline-block;
    width: 60px;
    height: 30px;
    border-radius: 2px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    line-height: 30px;
    color: #fff;
    cursor: pointer;
  }

  .no-binding {
    height: 70px;
  }

  .no-binding-tip {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  .btn-binding {
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

  .mt-10 {
    margin-top: 10px;
  }

  .edit {
    color: #fff;
    background: #CC3447;
  }

  .delete {
    background: #777;
    /* color: #e00000; */
    margin-left: 20px;
  }

  .group-item {
    /* background: #eeeeee; */
    /* height: 52px; */
    border-bottom: 1px solid #ddd;
  }

  .group-item:last-child {
    border-bottom: none;
  }

  .group-item>td {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
  }

  /* .options {
    height: 183px;
    width: 100%;
    padding-top: 69px;
  } */

  .options {
    text-align: right;
    margin-bottom: 30px;
  }

  .options .btn-option {
    /* width: 144px;
    height: 45px;
    background: rgba(212, 145, 77, 1);
    border-radius: 6px;
    cursor: pointer;
    color: #fff;
    display: inline-block;
    line-height: 45px;
    vertical-align: middle; */
    width: 92px;
    height: 30px;
    border-radius: 2px;
    cursor: pointer;
    color: #fff;
    display: inline-block;
    line-height: 30px;
    vertical-align: middle;
    font-size: 12px;
    text-align: center;
    margin-left: 20px;
  }

  .options .add {
    background: #2D996E;
  }

  .options .clock {
    background: #CC3447;
  }

  .tule-title {
    text-align: left;
    padding-bottom: 20px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .tips {
    width: 612px;
    padding: 20px;
    background: #FFFFE1;
    border: 1px solid #DDDDDD;
    font-size: 12px;
    color: #191919;
    margin-bottom: 30px;
  }

  .tips>p>span {
    color: #ce3c4d;
  }

  .tips>p {
    /* font-size: 14px; */
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #666666;
    text-align: left;
    margin-bottom: 20px;
  }

  .tips>p:last-child {
    margin-bottom: 0;
  }

  .binding-inner table {
    margin-left: 300px;
    margin-top: 55px;
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
    font-family: MicrosoftYaHei;
    color: #191919;
    height: 38px;
    line-height: 38px;
    min-width: 100px;
  }

  /* .binding-inner .content {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    height: 38px;
    line-height: 38px;
  } */

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
    border: 1px solid #e89406;
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

  .el-step__head.is-finish {
    background-color: #ea1c1c;
    color: #fff;
    border-color: transparent;
  }

  .el-step__title.is-finish {
    color: #ea1c1c;
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
</style>