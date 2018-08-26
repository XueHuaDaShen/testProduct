<!--棋牌竞技-->
<template>
  <div class="lottery-wrap search-form" v-loading="loading">
    <!-- <div class="record-tabs">
      <router-link :to="{name:'lotteryRecord'}" class="tab-item active">游戏记录
      </router-link>
      <router-link :to="{name:'trackRecord'}" class="tab-item">追号记录</router-link>
    </div> -->
    <div class="record-options">
      <div class="option-row">
        <span class="exp">游戏平台：</span>
        <el-select v-model="form.gameplatform.value" style="width:114px;" clearable>
          <el-option v-for="(o,index) in form.gameplatform.options" :label="o.platform" :value="o.name" :key="index"></el-option>
        </el-select>
        <span class="exp ml-20">游戏名：</span>
        <el-input v-model="form.ganmename" placeholder="请输入游戏名" style="width:114px;"></el-input>
      </div>
      <div class="option-row">
        <span class="exp">游戏时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        至
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time" @click="setTimeNowWeek">本周</a>
        <a class="time" @click="setTimeNowMonth">本月</a>
        <!-- <a class="time" @click="setTimeRecent3Days(-3)">近三日</a>&nbsp; -->
        <!-- <a class="time" @click="setTimeRecent3Days(-15)">近半月</a>&nbsp; -->
        <a class="time" @click="setTimeRecent3Days(-30)">近一月</a>
        <a class="submit" @click="handleSearch()">查询</a>
      </div>
    </div>
    <hr class="user-split-line">
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>游戏平台</th>
          <th>游戏名</th>
          <th>投注额</th>
          <th>盈利额</th>
          <th>游戏时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" class="group-item" v-if="!noResult" :key="item._id">
          <td>{{item.platform?item.platform:'--'}}</td>
          <td>{{item.game}}</td>
          <td>{{item.vote}}元</td>
          <td>{{item.profit}}元</td>
          <td>{{getTime(item.start_at)}}</td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本页小结</td>
          <td></td>
          <td>{{getCurrentPageVote}}</td>
          <td>{{getCurrentPageProfit}}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import request from "../axios/axios";
  import { getStatusDesc } from "../common/lotteryStatus";
  import moment from "moment";

  export default {
    data() {
      return {
        loading: false,
        form: {
          //form Start
          //开始结束时间
          dateFrom: {
            key: "startAt",
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          dateTo: {
            key: "endAt",
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //平台名
          gameplatform: {
            key: 'platform',
            value: "",
            options: [],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //游戏名
          gamename: {
            key: 'game',
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          }
          //form End
        },
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        agg: {} //投注统计
      };
    },
    methods: {
      getTime(time) {
        return moment(time).format("YYYY-MM-DD");
      },
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      //今天
      setTimeToday() {
        let date = new Date();
        let ymd = this.formatDate(date);
        this.form.dateTo.value = ymd + " 23:59:59";
        this.form.dateFrom.value = ymd + " 00:00:00";
      },
      //本周
      setTimeNowWeek() {
        let now = new Date();
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //当前日
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        //获得本周的开始日期
        let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        getWeekStartDate = this.formatDate(getWeekStartDate);
        this.form.dateFrom.value = getWeekStartDate + " 00:00:00";
        //获得本周的结束日期
        let getWeekEndDate = new Date(
          nowYear,
          nowMonth,
          nowDay + (6 - nowDayOfWeek)
        );
        getWeekEndDate = this.formatDate(getWeekEndDate);
        this.form.dateTo.value = getWeekEndDate + " 23:59:59";
      },
      //本月
      setTimeNowMonth() {
        let now = new Date();
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        //获得本月的开始日期
        let getMonthStartDate = new Date(nowYear, nowMonth, 1);
        getMonthStartDate = this.formatDate(getMonthStartDate);
        this.form.dateFrom.value = getMonthStartDate + " 00:00:00";

        //获得本月的结束日期
        let getMonthEndDate = new Date(
          nowYear,
          nowMonth,
          this.getMonthDays(nowYear, nowMonth)
        );
        getMonthEndDate = this.formatDate(getMonthEndDate);
        this.form.dateTo.value = getMonthEndDate + " 23:59:59";
      },
      //设置近几日
      setTimeRecent3Days(day) {
        let now = new Date();
        let previous = this.getDay(day);
        this.form.dateFrom.value = previous + " 00:00:00";
        let ymd = this.formatDate(now);
        this.form.dateTo.value = ymd + " 23:59:59";
      },
      getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
      },
      doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      },
      //获得某月的天数
      getMonthDays(myYear, myMonth) {
        var monthStartDate = new Date(myYear, myMonth, 1);
        var monthEndDate = new Date(myYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
      },
      //格式化年月日
      //格式化日期：yyyy-MM-dd
      formatDate(date) {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();
        if (mymonth < 10) {
          mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
          myweekday = "0" + myweekday;
        }
        return myyear + "-" + mymonth + "-" + myweekday;
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        // this.form.username.value = localStorage.getItem("loginname");
        data["pageSize"] = this.pageSize;
        data["pageNum"] = this.pageIndex;
        let errorMessage = "查询错误";
        for (let v in this.form) {
          if (this.form.hasOwnProperty(v)) {
            let obj = this.form[v];
            if (obj.visible === undefined || obj.visible) {
              if (obj.key) {
                if (obj.getValue) {
                  data[obj.key] = obj.getValue();
                } else if (obj.value) {
                  data[obj.key] = obj.value;
                }
              }
              if (obj.verify !== undefined && !obj.verify()) {
                validate = false;
                errorMessage = obj.error.message;
              }
            }
          }
        }
        if (!validate) {
          self.$alert(errorMessage, "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
          return false;
        } else {
          this.loading = true;
          let url = "/thirdpart/game/list";
          request.http(
            "get",
            url,
            data,
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
                  self.total = success.data.total;
                  if (self.total) {
                    self.noResult = false;
                    self.totalPageNum = success.data.total_page_num;
                    self.list = success.data.data;
                  } else {
                    self.noResult = true;
                    self.list = [];
                    // self.$alert('没有符合条件的记录', '系统提醒', {
                    //   confirmButtonText: '确定',
                    //   center: true,
                    // });
                  }
                } else {
                  self.noResult = true;
                  self.list = [];
                  // self.$alert('没有符合条件的记录', '系统提醒', {
                  //   confirmButtonText: '确定',
                  //   center: true,
                  // });
                }
              }
            },
            error => {
              self.loading = false;
              self.list = [];
              self.noResult = true;
              console.log("error", error);
            }
          );
          return true;
        }
      },
      //游戏名称列表
      getPlatform() {
        let self = this;
        let url = "/gameSetting/list";
        let gamelist = [];
        this.loading = true;
        request.http(
          "get",
          url, {},
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
                self.form.gameplatform.options = success.data;
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
            console.log("error", error);
          }
        );
      },
      getStatus(value) {
        return getStatusDesc(value);
      }
    },
    computed: {
      getCurrentPageVote() {
        let vote = 0.0;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].vote) {
              vote += this.list[i].vote;
            }
          }
        }
        return vote;
      },
      getCurrentPageProfit() {
        let profit = 0.0;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].profit) {
              profit += this.list[i].profit;
            }
          }
        }
        return profit;
      },
      getCurrentPageCash() {
        let cash = 0.0;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash) {
              cash += this.list[i].cash;
            }
          }
        }
        return cash;
      }
    },
    mounted() {
      this.setTimeToday();
      this.onSubmit();
      this.getPlatform();
    }
  };
</script>
<style scoped>
  .user-split-line {
    background: #ddd;
    height: 1px;
    border: none;
    margin-bottom: 30px;
    width: 100%;
  }

  .no-result p {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .inline {
    display: inline-block;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  a {
    text-decoration: none;
    color: #333333;
    cursor: pointer;
  }

  .lottery-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
    color: #191919;
  }

  .lottery-wrap {
    color: #333333;
    width: 100%;
    margin: 0 auto;
    min-height: 731px;
    padding: 30px 20px;
  }

  .record-tabs {
    width: 192px;
    height: 44px;
    background: rgba(212, 145, 77, 1);
    border-radius: 4px;
    padding: 5px;
    display: table;
  }

  .record-tabs .tab-item {
    width: 88px;
    height: 34px;
    display: table-cell;
    vertical-align: middle;
    line-height: 34px;
    color: #fff;
  }

  .record-tabs .tab-item.active {
    background: #f9efef;
    border-radius: 4px;
    color: #333;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .record-options {
    background: #ffffff;
  }

  .record-options .option-row {
    text-align: left;
    margin-bottom: 20px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .record-options .option-row>input[type="text"] {
    display: inline-block;
    width: 158px;
    height: 30px;
    line-height: 30px;
    padding: 4px 5px;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #ffffff;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
    margin: 0 14px;
  }

  .record-options .option-row>a {
    display: inline-block;
    font-size: 12px;
    width: 64px;
    height: 25px;
    line-height: 25px;
    border-radius: 2px;
    border: 1px solid #ccc;
    margin-right: 3px;
  }

  .record-options .option-row>a:hover {
    background: #C83A4C;
    color: #fff;
  }

  .record-group {
    width: 944px;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .record-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
  }

  /* .record-group .group-title > th:after {
  content: "";
  height: 16px;
  background: rgba(222, 222, 222, 1);
  position: absolute;
  right: 0;
  top: 9px;
  width: 1px;
} */

  .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
  }

  .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #c38755;
    color: #fff;
    display: block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    overflow-x: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
    margin: 0 auto;
  }

  .record-options .option-row>a.time {
    display: inline-block;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
    margin-right: 20px;
  }

  .record-options .option-row>a.time:hover {
    background: #C83A4C;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .record-group .group-item:nth-child(2n + 1) {
    /* background: #f7f7f7; */
  }

  .record-group .record-bottom {
    width: 100%;
    background: #f6f6f6;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 50px;
    line-height: 50px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .success {
    color: #099f4c;
  }

  .record-pagination {
    padding: 30px 0;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  .record-pagination>a {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #e9e9e9;
    margin-left: 11px;
    font-size: 12px;
  }

  .record-pagination>span {
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
  }

  .record-options .option-row>a.submit {
    position: relative;
    display: inline-block;
    height: 30px;
    line-height: 28px;
    text-align: center;
    /* vertical-align: middle; */
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    font-family: microsoft yahei;
    background-color: #C83A4C;
    border: 1px solid #ccc;
    box-shadow: none;
    /* margin-left: 20px; */
  }

  .ml-20 {
    margin-left: 20px;
  }
</style>