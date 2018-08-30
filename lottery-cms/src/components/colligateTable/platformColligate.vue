<template>
  <div class="rechargeLot-wrap el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>查询时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
        <div class="wrap-container">
          <div class="container-body">
            <ul class="container-banner">
              <li class="banner-item item-bg1">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">盈利</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.profit)}} 元
                </p>
                <p class="item-row mt-10">
                </p>
              </li>
              <li class="banner-item item-bg2">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">有效投注</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.bid_valid)}} 元
                </p>
                <p class="item-row mt-10">
                  {{data.bid_people ? data.bid_people : 0}} 人
                </p>
              </li>
              <li class="banner-item item-bg3">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">中奖金额</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.reward)}} 元
                </p>
                <p class="item-row mt-10">
                  {{data.reward_people ? data.reward_people : 0}} 人
                </p>
              </li>
              <li class="banner-item item-bg4">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">游戏盈亏</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.game_profit)}} 元
                </p>
                <p class="item-row mt-10">
                  {{data.game_people ? data.game_people : 0}} 人
                </p>
              </li>
            </ul>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  充值金额
                </span>
                <span class="warning">{{formatMoney(data.recharge)}} 元</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  注册人数
                </span>
                <span class="warning">{{data.register_people ? data.register_people :0}} 人</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  返点金额
                </span>
                <span class="warning">{{formatMoney2(data.rebate,data.rebate_ex)}} 元</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  提现金额
                </span>
                <span class="warning">{{formatMoney(data.withdrawal)}} 元</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  首充人数
                </span>
                <span class="warning">{{data.first_recharge? data.first_recharge :0}} 人</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  游戏返点
                </span>
                <span class="warning">{{formatMoney(data.game_rebate)}} 元</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  回收
                </span>
                <span class="warning">{{formatMoney(data.undo)}} 元</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  最高在线人数
                </span>
                <span class="warning">{{data.max_online?data.max_online : 0}} 人</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  活动礼金
                </span>
                <span class="warning">{{formatMoney(data.gift)}} 元</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  主钱包
                </span>
                <span class="warning">{{formatMoney(data.cash)}} 元</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  会员登录人数
                </span>
                <span class="warning">{{data.game_people?data.game_people:0}} 人</span>
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
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "platformColligate",
    components: {
      tableBtn
      // DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        titleName: "综合报表",
        routerArr: [{
          title: "综合报表",
          name: "platformColligate",
          checked: false
        }],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 10,
        platformColligateListData: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime()) - 3600 * 1000 * 24 * 1);
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) -
                  3600 * 1000 * 24 * 1);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "本周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            }, {
              text: "上周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString())
                  .getTime() -
                  3600 * 1000 * 24 * 7);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1 - 3600 * 1000 * 24 * 7);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker
                  .$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "本月",
              onClick(picker) {
                let now = new Date();
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                //获得本月的开始日期
                let getMonthStartDate = new Date(nowYear, nowMonth, 1);
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(new Date(new Date(nowYear, nowMonth, days).toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 - 1);
                // console.log("start", getMonthStartDate.toLocaleString());
                // console.log("end", getMonthEndDate.toLocaleString());
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "上月",
              onClick(picker) {
                var firstdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                var date = new Date();
                var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                var enddate = new Date(new Date(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", firstdate.toLocaleString());
                // console.log("end", enddate.toLocaleString());
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 7);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        statusArr: [{
            value: "0",
            label: "未发工资"
          },
          {
            value: "1",
            label: "已发工资"
          }
        ],
        type: "",
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
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        currId: "",
        data: {}
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'platformColligate') {
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
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
      this.searchTime = [start, end];
      // console.log("searchTime", this.searchTime);
      this.getPlatformColligateList();
    },
    methods: {
      formatMoney2(value1, value2) {
        if (value1 || value2) {
          let final = parseFloat(value1) + parseFloat(value2);
          return final.toFixed(2);
        }
        return 0;
      },
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2);
        }
        return 0;
      },
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
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "未发工资";
          case 1:
            return "已发工资";
        }
      },
      formatTestUser(row, column, cellValue) {
        let t = "";
        if (cellValue === 1) {
          t = "是";
        } else {
          t = "否";
        }
        return t;
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getPlatformColligateList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getPlatformColligateList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        request.http(
          "get",
          "/statistic/platform/list", {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
            // loginname: vm.username,
            startTime: beginTime,
            endTime: endTime,
            is_test: vm.is_test
            // status: vm.status,
          },
          success => {
            vm.loading = false;
            // console.log("platformColligateList--------", success);
            let code = success.returncode;
            if (code === 200) {
              /* vm.platformColligateListData = success.data;
                vm.pageNum = Number(success.PageNum) || 1;
                vm.total = success.count; */
              if (success.data.length > 0) {
                vm.data = success.data[0];
                vm.succee();
              } else {
                vm.data = [];
                vm.message("暂无数据", "warning");
              }
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false;
            vm.data = [];
            vm.error();
            console.log(error);
          }
        );
      },
      handleReset() {
        this.username = "";
        this.searchTime = "";
        this.type = "";
        this.status = "";
        this.order_no = "";
        this.is_test = "0";
      },
      handleSearch() {
        // console.log(
        //   this.username,
        //   this.searchTime,
        //   this.type,
        //   this.status,
        //   this.order_no
        // );
        this.pageNum = 1;
        this.getPlatformColligateList();
      }
    }
  };

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>

<style scoped>
  .mt-10 {
    margin-top: 10px;
  }

</style>
