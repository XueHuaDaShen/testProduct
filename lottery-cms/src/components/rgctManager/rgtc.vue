<!--人工提出-->
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
                <span class="exp">提出类型</span>
                <span>:</span>
                <el-select clearable v-model="ruleForm.type.value" placeholder="类型" class="small">
                  <el-option v-for="item in ruleForm.type.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-show="ruleForm.type.value">
                <div class="tl content-row">
                  <span class="exp">提出金额</span>
                  <span>:</span>
                  <el-input v-model="ruleForm.amount" style="width:114px;"></el-input>
                </div>
                <div class="tl content-row">
                  <span class="exp">备注</span>
                  <span>:</span>
                  <el-input v-model="ruleForm.message" style="width:228px;"></el-input>
                </div>
                <!-- <div class="tl content-row">
                <span class="exp">备注：</span>
                <el-input type="text" v-model="ruleForm.message" placeholder="备注" style="width:300px"></el-input>
              </div> -->
                <div class="tl content-row clearfix">
                  <el-button type="primary" @click="recharge()" class="yes fr">确认提出</el-button>
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
  import request from '../../axios/axios.js';
  import {
    trim,
    price
  } from "../../lib/utils/validator";
  export default {
    name: 'rgtc',
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '人工提出',
        routerArr: [{
            title: '人工提出',
            name: 'rgtc',
            checked: false
          },
          {
            title: '人工存入',
            name: 'rgcr',
            checked: false
          },
        ],
        ruleForm: {
          loginname: "", // 用户名
          amount: "", // 存入金额
          // 类型
          type: {
            options: [{
              label: '手动申请出款',
              value: 63,
            }, {
              label: '人工撤销-派奖',
              value: 11,
            }, {
              label: '人工撤销-返点',
              value: 13,
            }, {
              label: '人工撤销-分红',
              value: 30,
            }, {
              label: '人工撤销-其他',
              value: 64,
            }],
            value: ""
          },
          message: "", // 备注
        },
        rechargeType: '充值',
        duration: 1000,
        hasLoginname: false,
        hasTypeSearched: false,
        user: {
          type: '',
          cash: '',
          loginname: ""
        },
        loading: false,
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if(v.url === 'rgtc'){
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
    },
    filters: {
      filterType: function (value) {
        if (value) {
          return "会员";
        }
        return "代理";
      }
    },
    watch: {
      "ruleForm.amount" () {
        if (this.ruleForm.amount) {
          let cash = this.user.cash;
          if (parseFloat(this.ruleForm.amount) > parseFloat(cash)) {
            this.ruleForm.amount = "";
          }
        }
      }
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
      },
      success() {
        const vm = this;
        this.$message({
          message: '加载成功',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: '加载失败',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      rechargeFn() {
        const vm = this;
        let data = {
          loginname: vm.ruleForm.loginname,
          type: vm.ruleForm.type.value,
          amount: vm.ruleForm.amount,
          message: vm.ruleForm.message,
        };
        request.http(
          'post',
          '/trade/user/cash/decrease',
          data,
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.$message({
                message: '提款成功',
                type: 'success',
                duration: vm.duration,
                center: true
              })
              vm.resetForm();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      resetForm() {
        this.ruleForm.loginname = "";
        this.ruleForm.type.value = "";
        this.ruleForm.amount = "";
        this.ruleForm.message = "";
        this.user.cash = "";
        this.user.type = "";
        this.user.loginname = "";
        this.hasLoginname = false;
      },
      // 充值
      recharge() {
        const vm = this;
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: '请先输入账号',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.type.value) {
          this.$message({
            message: '请选择提出类型',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.amount) {
          this.$message({
            message: '请输入交易金额',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!price(vm.ruleForm.amount)) {
          this.$message({
            message: '交易金额格式不正确',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.message) {
          this.$message({
            message: '请输入备注',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.rechargeFn();
      },
      // 查询当前用户存在否
      searchLoginname() {
        const vm = this;
        if (!vm.ruleForm.loginname) {
          this.$message({
            message: '请先输入账号',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.loading = true;
        request.http(
          'get',
          '/user/list', {
            loginname: trim(vm.ruleForm.loginname),
          },
          (success) => {
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
                  message: '暂无此用户',
                  type: 'error',
                  duration: vm.duration,
                  center: true
                })
              }
            } else if (code === 101 || code === 103 || code === 106) {
              vm.hasLoginname = false;
              request.loginAgain(vm)
            } else {
              vm.hasLoginname = false;
              vm.$message({
                message: '暂无此用户',
                type: 'error',
                duration: vm.duration,
                center: true
              })
            }
          },
          (error) => {
            vm.loading = false;
            vm.hasLoginname = false;
            vm.error();
          }
        )
      },
    }
  }

</script>
<style scoped>
  /* @import '../../publicCss/header.css '; */

  .warning-color {
    color: #C83A4C;
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

  .line-top {
    border-top: 1px solid #ddd;
  }

  .pt-30 {
    padding-top: 30px;
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
