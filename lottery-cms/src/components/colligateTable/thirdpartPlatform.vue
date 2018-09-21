<template>
  <div class="thirdpart-platform-wrap el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="wrap-container">
          <div class="container-body" v-loading="cashLoading">
            <div class="body-card" v-for="(item,index) in cashFinal" :key="index">
              <div class="card-top">
                <div class="top-left">{{item.vender}} - {{item.account}}</div>
                <div class="top-right">
                  <a class="right-cell" style="padding-right:20px;">
                    <span class="vt-mid">更新时间：</span>
                    <span class="vt-mid">{{ item.update_at | filterTime}}</span>
                  </a>
                  <a class="right-cell" @click="refresh()">
                    <img width="12px" height="11px" src="../../assets/icon_Refresh@3x.png" class="vt-mid" />
                    <span class="vt-mid">刷新</span>
                  </a>
                </div>
              </div>
              <div class="card-content">
                <div class="content-item">
                  <span class="inline-flx">
                    <i class="icon-tip-small"></i>
                    可用分数
                  </span>
                  <span class="warning">{{item.balance | filterCash}}</span>
                </div>
                <div class="content-item">
                  <span class="inline-flx">
                    <i class="icon-tip-small"></i>
                    用户总余额
                  </span>
                  <span class="warning">{{item.cash | filterCash}}</span>
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
  import moment from "moment";
  import {
    formatCash
  } from "../../lib/utils/validator";
  export default {
    name: "thirdpartPlatform",
    data() {
      return {
        cashFinal: [],
        cashLoading: false,
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        titleName: "第三方平台",
        routerArr: [{
          title: "第三方平台",
          name: "thirdpartPlatform",
          checked: false
        }, {
          title: "综合报表",
          name: "platformColligate",
          checked: false
        }],
        testUser: [{
            value: "",
            label: "全部显示"
          },
          {
            value: "0",
            label: "不显示"
          },
          {
            value: "1",
            label: "仅显示"
          }
        ],
        is_test: "0",
        duration: 1000,
      };
    },
    created() {
      this.getCash();
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'thirdpartPlatform') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      });
      // const end = new Date();
      // const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      // end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
      // this.searchTime = [start, end];
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        });
      },
      succee() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration,
          center: true
        });
      },
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
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
      formatTestUser(row, column, cellValue) {
        let t = "";
        if (cellValue === 1) {
          t = "是";
        } else {
          t = "否";
        }
        return t;
      },
      getCash() {
        const vm = this;
        vm.cashLoading = true;
        request.http(
          "get",
          "/user/aggthirdmoney", {
            is_test: vm.is_test
          },
          success => {
            vm.cashLoading = false;
            let code = success.returncode;
            if (code === 200) {
              if (success.data.length > 0) {
                vm.cashFinal = success.data;
              } else {
                vm.cashFinal = [];
                vm.message("查看失败", "warning");
              }
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              vm.message(`请求失败,错误码:${code}`, "warning");
              vm.cashFinal = [];
            }
          },
          error => {
            vm.cashLoading = false;
            vm.cashFinal = [];
            vm.error();
            console.log(error);
          }
        );
      },
      refresh() {
        const vm = this;
        vm.cashLoading = true;
        request.http(
          "get",
          "/user/refreshmoney", {},
          success => {
            vm.cashLoading = false;
            let code = success.returncode;
            if (code === 200) {
              this.getCash();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              vm.message(`刷新失败,错误码:${code}`, "warning");
            }
          },
          error => {
            vm.cashLoading = false;
            vm.error();
            console.log(error);
          }
        );
      },
    },
    filters: {
      filterTime(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return '--'
      },
      filterCash(val) {
        if (val) {
          return formatCash(val);
        }
        return '0.00'
      }
    },
  };

</script>
<style lang="scss">
  /* @import "../../publicCss/header.css"; */

  .thirdpart-platform-wrap .el-form-item__content {
    text-align: left;
  }

  .thirdpart-platform-wrap .wrap-container {
    border-top: none;
    margin-top: 0;

    .container-body {
      width: 852px;

      .body-card {
        width: 100%;
        height: 200px;
        padding: 0 20px;
        box-shadow: 0 10px 20px rgba($color: #000, $alpha: 0.1);
        display: flex;
        flex-direction: column;

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E6E6E6;
          height: 62px;

          .top-left {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #191919;
            font-weight: bold;
          }

          .top-right {
            display: table;
            height: 100%;

            .right-cell {
              display: table-cell;
              vertical-align: middle;
              font-family: PingFangSC-Medium;
              font-size: 12px;
              color: #777777;
              font-weight: bold;
            }

            >a {
              text-decoration: none;
              cursor: pointer;
            }

            .vt-mid {
              vertical-align: middle;
            }

            .cell-pl5 {
              padding-left: 5px;
            }
          }
        }

        .card-content {
          padding: 20px 0;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          flex: 1;

          .content-item {
            flex: 0.5;
            height: 97px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .icon-tip-small {
              width: 12px;
              height: 12px;
              display: inline-block;
              background: url("../../assets/icon_Note@3x_2.png") no-repeat;
              background-size: cover;
              margin-right: 5px;
            }

            .inline-flx {
              justify-content: center;
              margin-bottom: 10px;
              font-size: 12px;
              color: #191919;
            }

            .warning {
              font-family: PingFangSC-Medium;
              font-size: 20px;
              color: #C83A4C;
              font-weight: bold;
            }
          }

          .content-item+.content-item {
            border-left: 1px solid #e6e6e6;
          }
        }
      }

      .body-card {
        margin-bottom: 30px;
      }
    }
  }

</style>

<style scoped>
  .mt-10 {
    margin-top: 10px;
  }

</style>
