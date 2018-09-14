<template>
  <div class="rechargeLot-wrap el-custom">
    <DialogUserInfo :loginname="loginname" :userid="userid" @closeDialog="handleCloseDialog" :dialogVisible="dialog"></DialogUserInfo>
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
            <label>用户名：</label>
            <el-input clearable v-model.trim="username" placeholder="用户名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>排序栏：</label>
            <el-select v-model="order" clearable placeholder="请选择分类" class="small">
              <el-option v-for="item in orderArr" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>顺序：</label>
            <el-select v-model="desc" clearable placeholder="请选择顺序" class="small">
              <el-option v-for="item in descArr" :key="item.val" :label="item.title" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-checkbox v-model="dateChecked" :true-label="0" :false-label="1">累计显示</el-checkbox>
          </div>
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
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="userColligateListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="总计" :summary-method="getSummaries">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" label="上层代理" prop="parent.name">
        </el-table-column>
        <el-table-column align="center" prop="day" width="150" label="时间" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" prop="recharge" label="充值" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="withdrawal" label="提现" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="undo" label="回收" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="bid_valid" label="有效投注" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="reward" label="返奖" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="rebate" label="返点" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="rebate_ex" label="代理返点" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="salary" label="工资" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="commission" label="分红" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="gift" label="活动" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="game_profit" label="游戏盈亏" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="game_rebate" label="游戏返点" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="profit" label="盈亏" :formatter="formatMoney">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "userColligate",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        dateChecked: 1,
        index1: 0,
        index2: 0,
        titleName: "会员报表",
        routerArr: [{
            title: "会员报表",
            name: "userColligate",
            checked: false
          },
          {
            title: "代理报表",
            name: "teamColligate",
            checked: false
          }
        ],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        userColligateListData: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
        pickerDefaultTime: ["00:00:00", "23:59:59"],
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(
                  new Date(new Date(new Date().toLocaleDateString()).getTime()) -
                  3600 * 1000 * 24 * 1
                );
                end.setTime(
                  new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
                  ) -
                  3600 * 1000 * 24 * 1
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime()
                );
                end.setTime(
                  new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
                  )
                );
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
                let getWeekStartDate = new Date(
                  nowYear,
                  nowMonth,
                  nowDay - nowDayOfWeek
                );
                let getWeekEndDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay + (6 - nowDayOfWeek)
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "上周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay - nowDayOfWeek
                    ).toLocaleDateString()
                  ).getTime() -
                  3600 * 1000 * 24 * 7
                );
                let getWeekEndDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay + (6 - nowDayOfWeek)
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1 -
                  3600 * 1000 * 24 * 7
                );
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
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
                var days =
                  (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(
                  new Date(
                    new Date(nowYear, nowMonth, days).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", getMonthStartDate.toLocaleString());
                // console.log("end", getMonthEndDate.toLocaleString());
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "上月",
              onClick(picker) {
                var firstdate = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 1,
                  1
                );
                var date = new Date();
                var day = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  0
                ).getDate();
                var enddate = new Date(
                  new Date(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() - 1,
                      day
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", firstdate.toLocaleString());
                // console.log("end", enddate.toLocaleString());
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 7
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 30
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 90
                );
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
            label: "全显示"
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
        orderArr: [{
            title: "充值",
            code: "recharge"
          },
          {
            title: "提现",
            code: "withdrawal"
          },
          {
            title: "有效投注",
            code: "bid_valid"
          },
          {
            title: "返奖",
            code: "rebate"
          },
          {
            title: "盈利",
            code: "profit"
          },
          {
            title: "游戏盈利",
            code: "game_profit"
          },
          {
            title: "时间",
            code: "day"
          }
        ],
        descArr: [{
            title: "升序",
            val: "1"
          },
          {
            title: "降序",
            val: "-1"
          }
        ],
        order: "day",
        desc: "-1",
        is_test: "0",
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        currId: ""
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
        if (v.url === "userColligate") {
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
      if (this.$route.query && this.$route.query.param) {
        this.username = this.$route.query.param;
      }
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      end.setTime(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
        )
      );
      this.searchTime = [start, end];
      this.getUserColligateList();
    },
    methods: {
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "总计";
            return;
          }
          let values = data.map(item => Number(item[column.property]));
          // if (index === 6) {
          //   values = data.map(item => Number(item['vote_cash']));
          // }
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = parseFloat(sums[index]).toFixed(2);
            sums[index] += " 元";
          } else {
            sums[index] = "--";
          }
        });

        return sums;
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
      succee() {
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
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "0.00";
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getUserColligateList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getUserColligateList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        // this.dialog = true;
        // this.userid = row.loginid;
        // this.loginname = row.loginname;
        this.username = row.loginname;
        if (this.searchTime) {
          if (this.searchTime.toString() !== "") {
            this.getUserColligateList();
          }
        }
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue)
            .utcOffset(8)
            .format("YYYY-MM-DD");
        }
        return "--";
      },
      getUserColligateList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime) {
          if (vm.searchTime.toString() !== "") {
            beginTime = new Date(vm.searchTime[0]);
            endTime = new Date(vm.searchTime[1]);
          }
        }
        vm.loading = true;
        request.http(
          "get",
          "/statistic/user/list", {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
            loginname: trim(vm.username),
            startTime: beginTime,
            endTime: endTime,
            is_test: vm.is_test,
            order: vm.order,
            desc: Number(vm.desc),
            date: vm.dateChecked
            // status: vm.status,
          },
          success => {
            vm.loading = false;
            // console.log("userColligateList--------", success);
            let code = success.returncode;
            if (code === 200) {
              vm.userColligateListData = success.data;
              vm.pageNum = Number(success.PageNum) || 1;
              vm.total = success.count;
              vm.succee();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false;
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
        this.order = "";
        this.desc = "";
        this.dateChecked = 1;
      },
      handleSearch() {
        this.pageNum = 1;
        this.getUserColligateList();
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
