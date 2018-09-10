<!--人工存入-->
<template>
  <div class="el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="rgcr-content" v-loading="loading">
            <div class="tl clearfix content-row">
              <span class="exp">账号</span>
              <span>:</span>
              <el-input type="text" v-model="ruleForm.loginname" style="width:114px;"></el-input>
              <el-button type="primary" @click="searchLoginname()" class="yes small" style="margin-left:30px;">查询</el-button>
            </div>
            <div v-if="hasLoginname">
              <div class="tl content-row pt-30 line-top">
                <span class="exp">账号类型</span>
                <span>:</span>
                <span class="warning-color cont">{{user.type | filterType}}</span>
              </div>
              <div class="tl content-row">
                <span class="exp">账号</span>
                <span>:</span>
                <span class="warning-color cont">{{user.loginname}}</span>
              </div>
              <div class="tl content-row line-down">
                <span class="exp">账号余额</span>
                <span>:</span>
                <span class="warning-color cont">{{user.cash}}</span>
              </div>
              <div class="tl content-row mt-30">
                <span class="exp">存入类型</span>
                <span>:</span>
                <el-select clearable v-model="ruleForm.type.value" placeholder="类型" class="small" @change="typeChange(ruleForm.type.value)">
                  <el-option v-for="item in ruleForm.type.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-show="ruleForm.type.value && hasTypeSearched">
                <div class="tl content-row">
                  <span class="exp">存入金额</span>
                  <span>:</span>
                  <el-input v-model="ruleForm.amount" style="width:114px;"></el-input>
                </div>
                <div class="tl content-row">
                  <span class="exp">打码量</span>
                  <span>:</span>
                  <el-radio v-model="indicatorSelected" label="1">
                    <span>默认值</span>
                    <el-input v-model="ruleForm.amountDefault" :disabled="true" style="width:150px" type="number"></el-input>
                    <span>元 =</span>
                    <el-input v-model="ruleForm.indicatorDefault" :disabled="true" style="width:150px" type="number"></el-input>
                    <span>倍</span>
                  </el-radio>
                  <br />
                </div>
                <div class="tl content-row">
                  <span class="exp"></span>
                  <span>&nbsp;</span>
                  <el-radio v-model="indicatorSelected" label="2" style="margin-top:10px">
                    <span>自定义</span>
                    <el-input v-model="ruleForm.amountCustom" style="width:150px" type="number" @focus="ammountCustomChange"
                      @change="acChange()"></el-input>
                    <span>元 =</span>
                    <el-input v-model="ruleForm.indicatorCustom" style="width:150px" type="number" @focus="indicatorCustomChange"
                      @change="icChange()"></el-input>
                    <span>倍</span>
                  </el-radio>
                </div>
                <!-- <div class="tl content-row">
                <span class="exp">备注：</span>
                <el-input type="text" v-model="ruleForm.message" placeholder="备注" style="width:300px"></el-input>
              </div> -->
                <div class="tl content-row clearfix">
                  <el-button type="primary" @click="recharge()" class="yes fr" :disabled="disabled">确认存入</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import {
    trim,
    price,
    positiveDecimal
  } from "../../lib/utils/validator";
  export default {
    name: "rgcr",
    data() {
      return {
        disabled: false,
        acFocus: false,
        icFocus: false,
        index1: 0,
        index2: 0,
        titleName: "人工存入",
        routerArr: [{
            title: "人工提出",
            name: "rgtc",
            checked: false
          },
          {
            title: "人工存入",
            name: "rgcr",
            checked: false
          }
        ],
        ruleForm: {
          loginname: "", // 用户名
          amount: "", // 存入金额
          // 类型
          type: {
            options: [{
                label: "人工充值-充值",
                value: 20
              },
              {
                label: "人工充值-返点",
                value: 12
              },
              {
                label: "人工充值-理赔",
                value: 21
              },
              {
                label: "促销派奖-充值",
                value: 42
              },
              {
                label: "促销派奖-注册",
                value: 43
              }
            ],
            value: ""
          },
          indicator: 0, // 打码量
          message: "", // 备注
          amountDefault: 0, // 默认打码量金额
          indicatorDefault: 0, // 默认打码量倍数
          amountCustom: 0, // 自定义打码量金额
          indicatorCustom: 0 // 自定义打码量倍数
        },
        indicatorSelected: "1",
        rules: {
          loginname: [{
            required: true,
            message: "用户名",
            trigger: "blur"
          }],
          amount: [{
            required: true,
            message: "充值金额",
            trigger: "blur"
          }],
          indicator: [{
            required: true,
            message: "打码量",
            trigger: "blur"
          }]
        },
        rechargeType: "充值",
        duration: 1000,
        is_test: "0",
        hasLoginname: false,
        hasTypeSearched: false,
        user: {
          type: "",
          cash: "",
          loginname: ""
        },
        loading: false
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem("menus"));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === "rgcr") {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      });
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      });
    },
    filters: {
      filterType: function (value) {
        if (value) {
          return "会员";
        }
        return "代理";
      }
    },
    methods: {
      typeChange(value) {
        this.ruleForm.amount = "";
        const vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/trade/type", {
            type: value
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              // if (success.count != 0) {
              //   vm.hasLoginname = true;
              //   let data = success.data[0];
              //   vm.user.cash = Number(data.cash).toFixed(2);
              //   vm.user.type = data.type;
              //   vm.user.loginname = data.loginname;
              // } else {
              //   vm.hasLoginname = false;
              //   vm.$message({
              //     message: '暂无此用户',
              //     type: 'error',
              //     duration: vm.duration
              //   })
              // }
              vm.hasTypeSearched = true;
              let indicator = success.data.indicator || 0;
              vm.ruleForm.indicatorDefault = indicator;
            } else if (code === 101 || code === 103 || code === 106) {
              vm.hasTypeSearched = false;
              request.loginAgain(vm);
            } else {
              vm.hasTypeSearched = false;
              vm.$message({
                message: "查询默认打码量失败",
                type: "error",
                duration: vm.duration,
                center: true
              });
            }
          },
          error => {
            vm.loading = false;
            vm.hasTypeSearched = false;
            vm.error();
          }
        );
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        });
        // console.log(name)
      },
      success() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration,
          center: true
        });
      },
      error() {
        const vm = this;
        this.$message({
          message: "加载失败",
          type: "error",
          duration: vm.duration,
          center: true
        });
      },
      rechargeFn() {
        const vm = this;
        let data = {
          loginname: vm.ruleForm.loginname,
          type: vm.ruleForm.type.value,
          amount: vm.ruleForm.amount
        };
        if (vm.indicatorSelected == 2) {
          data["indicator"] = vm.ruleForm.indicatorCustom;
        } else if (vm.indicatorSelected == 1) {
          data["indicator"] = vm.ruleForm.indicatorDefault;
        }
        vm.loading = true;
        request.http(
          "post",
          "/trade/user/cash/increase",
          data,
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.$message({
                message: "存款成功",
                type: "success",
                duration: vm.duration,
                center: true
              });
              vm.resetForm();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      // 充值
      recharge() {
        const vm = this;
        vm.disabled = true;
        setTimeout(() => {
          vm.disabled = false;
        }, 1000);
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: "请先输入账号",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!vm.ruleForm.type.value) {
          this.$message({
            message: "请选择存入类型",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!vm.ruleForm.amount) {
          this.$message({
            message: "请输入交易金额",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!price(parseFloat(vm.ruleForm.amount))) {
          this.$message({
            message: "交易金额格式不正确",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (vm.indicatorSelected == "2") {
          if (!positiveDecimal(parseFloat(vm.ruleForm.amountCustom))) {
            this.$message({
              message: "请输入自定义打码量金额",
              type: "error",
              duration: vm.duration,
              center: true
            });
            return;
          }
          if (!positiveDecimal(parseFloat(vm.ruleForm.indicatorCustom))) {
            this.$message({
              message: "请输入自定义打码量倍数",
              type: "error",
              duration: vm.duration,
              center: true
            });
            return;
          }
        }
        vm.rechargeFn();
      },
      // 查询当前用户存在否
      searchLoginname() {
        const vm = this;
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: "请先输入账号",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        vm.loading = true;
        request.http(
          "get",
          "/user/list", {
            loginname: trim(vm.ruleForm.loginname)
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              if (success.count != 0) {
                vm.hasLoginname = true;
                let data = success.data[0];
                vm.user.cash = Number(data.cash).toFixed(2);
                vm.user.type = data.type;
                vm.user.loginname = data.loginname;
              } else {
                vm.hasLoginname = false;
                vm.$message({
                  message: "暂无此用户",
                  type: "error",
                  duration: vm.duration,
                  center: true
                });
              }
            } else if (code === 101 || code === 103 || code === 106) {
              vm.hasLoginname = false;
              request.loginAgain(vm);
            } else {
              vm.hasLoginname = false;
              vm.$message({
                message: "暂无此用户",
                type: "error",
                duration: vm.duration,
                center: true
              });
            }
          },
          error => {
            vm.loading = false;
            vm.hasLoginname = false;
            vm.error();
          }
        );
      },
      resetForm() {
        this.ruleForm.loginname = "";
        this.ruleForm.type.value = "";
        this.ruleForm.amount = "";
        this.hasTypeSearched = false;
        this.ruleForm.indicator = "";
        this.ruleForm.message = "";
        this.ruleForm.amountDefault = "";
        this.ruleForm.indicatorDefault = "";
        this.ruleForm.amountCustom = "";
        this.ruleForm.indicatorCustom = "";
        this.hasLoginname = false;
      },
      ammountCustomChange(event) {
        this.acFocus = true;
        this.icFocus = false;
      },
      indicatorCustomChange(event) {
        this.icFocus = true;
        this.acFocus = false;
      },
      acChange(value) {},
      icChange(value) {}
    },
    watch: {
      "ruleForm.amount"() {
        if (this.ruleForm.amount) {
          if (this.indicatorSelected == 1) {
            this.ruleForm.amountDefault =
              this.ruleForm.amount * this.ruleForm.indicatorDefault;
          } else if (this.indicatorSelected == 2) {
            if (this.ruleForm.amountCustom) {
              this.ruleForm.indicatorCustom = parseFloat(
                this.ruleForm.amountCustom / this.ruleForm.amount
              ).toFixed(2);
            } else if (this.ruleForm.indicatorCustom) {
              this.ruleForm.amountCustom =
                this.ruleForm.indicatorCustom * this.ruleForm.amount;
            }
          }
        } else {
          this.ruleForm.amountCustom = "0";
          this.ruleForm.indicatorCustom = "0";
        }
      },
      indicatorSelected() {
        if (this.indicatorSelected == 1) {
          this.ruleForm.amountCustom = "0";
          this.ruleForm.indicatorCustom = "0";
        } else if (this.indicatorSelected == 2) {
          // if (!this.ruleForm.amount) {
          //   this.ruleForm.indicatorCustom = "0";
          //   this.ruleForm.amountCustom = "0";
          // }
        }
      },
      "ruleForm.amountCustom"() {
        if (this.ruleForm.amount) {
          if (this.acFocus && !this.icFocus) {
            if (this.ruleForm.amountCustom) {
              if (this.ruleForm.amount) {
                if (
                  parseFloat(this.ruleForm.amountCustom / this.ruleForm.amount) <
                  0.01
                ) {
                  this.ruleForm.indicatorCustom = "0";
                } else {
                  this.ruleForm.indicatorCustom = parseFloat(
                    this.ruleForm.amountCustom / this.ruleForm.amount
                  ).toFixed(2);
                }
              } else {
                this.ruleForm.indicatorCustom = "0";
              }
            } else {
              this.ruleForm.indicatorCustom = "0";
            }
          }
        } else {
          this.ruleForm.amountCustom = "0";
        }
      },
      "ruleForm.indicatorCustom"() {
        if (this.ruleForm.amount) {
          if (!this.acFocus && this.icFocus) {
            if (this.ruleForm.indicatorCustom) {
              if (this.ruleForm.amount) {
                if (parseFloat(this.ruleForm.indicatorCustom) < 0.01) {
                  this.ruleForm.amountCustom = "0";
                } else {
                  this.ruleForm.amountCustom =
                    this.ruleForm.indicatorCustom * this.ruleForm.amount;
                }
              } else {
                this.ruleForm.amountCustom = "0";
              }
            } else {
              this.ruleForm.amountCustom = "0";
            }
          }
        } else {
          this.ruleForm.indicatorCustom = "0";
        }
      }
    }
  };

</script>
<style scoped>
  /* @import '../../publicCss/header.css '; */

  .line-top {
    border-top: 1px solid #ddd;
  }

  .pt-30 {
    padding-top: 30px;
  }

  .warning-color {
    color: #c83a4c;
  }

  .fr {
    float: right;
  }

  .tl {
    text-align: left;
  }

  .line-down {
    border-bottom: 1px solid #ddd;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .rgcr-content {
    margin-bottom: 30px;
    width: 100%;
  }

  .rgcr-content .content-row {
    padding-bottom: 30px;
  }

  .exp {
    font-size: 12px;
    color: #191919;
    width: 60px;
    margin-right: 5px;
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .demo-ruleForm {
    margin-top: 20px;
  }

  .cont {
    font-size: 12px;
  }

</style>
