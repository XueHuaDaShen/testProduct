<!--棋牌竞技-->
<template>
  <div class="lottery-wrap search-form" v-loading="loading">
    <div class="record-options search-form">
      <div class="option-row mb-20">
        <span class="exp">游戏平台：</span>
        <el-select v-model="form.gameplatform.value" style="width:114px;" clearable>
          <el-option v-for="(o,index) in form.gameplatform.options" :label="o" :value="o" :key="index"></el-option>
        </el-select>
        <span class="exp ml-20">游戏类型：</span>
        <el-select v-model.trim="gameType" clearable placeholder="请选择" class="small">
          <el-option v-for="(item,index) in gameOptions" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
        <span class="exp ml-20">游戏名：</span>
        <el-input v-model="form.ganmename" placeholder="请输入游戏名" style="width:114px;"></el-input>
      </div>
      <div class="option-row mb-20">
        <span class="exp">用户属性：</span>
        <el-select v-model="form.userTypes.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in form.userTypes.options" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
        <span class="exp ml-20">用户名：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="form.username.value" clearable>
        </el-input>
      </div>
      <div class="option-row">
        <span class="exp">游戏时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span style="margin:0 5px;font-weight:bold;color:#777;font-size:14px;">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time" @click="setTimeNowWeek">本周</a>
        <a class="time" @click="setTimeNowMonth">本月</a>
        <a class="time" @click="setTimeRecent3Days(-30)">近一月</a>
        <a class="submit ml-20" @click="handleSearch()">查询</a>
      </div>
    </div>
    <hr class="user-split-line">
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>有效投注</th>
          <th style="border-right: 1px solid #dddddd;">游戏盈亏</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in agg" :key="index" v-if="!aggNoResult">
          <td>{{item._id ? item._id.loginname : '--'}}</td>
          <td>{{item.vote_valid | formatMoney}}</td>
          <td style="border-right: 1px solid #dddddd;" class="success">{{item.profit | formatMoney}}</td>
        </tr>
        <tr v-if="aggNoResult" class="no-result">
          <td colspan="10" style="border-right: 1px solid #dddddd;">
            <p style="color:#777;font-weight:bold;margin:35px 0;font-size:14px;">没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>所在区间统计：</td>
          <td>{{getCurrentPageCash('vote_valid')}}</td>
          <td style="border-right: 1px solid #dddddd;" class="success">{{getCurrentPageCash('profit')}}</td>
        </tr>
      </tfoot>
    </table>
    <div class="record-pagination clearfix" v-if="!aggNoResult">
      <el-pagination @size-change="handleSizeChangeAgg" @current-change="handleCurrentChangeAgg" :current-page.sync="aggpage_num" :page-size="aggpage_size" layout="total, prev, pager, next" :total="aggtotal">
      </el-pagination>
    </div>
    <div style="margin-bottom:20px;"></div>
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>平台</th>
          <th>游戏类型</th>
          <th>游戏名</th>
          <th>投注额</th>
          <th>有效投注</th>
          <th>盈利额</th>
          <th style="border-right: 1px solid #dddddd;">游戏时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" class="group-item" v-if="!noResult" :key="item._id">
          <td>{{item.platform?item.platform:'--'}}</td>
          <td>{{item.game_type | filterGameType}}</td>
          <td>{{item.game}}</td>
          <td>{{item.vote}}元</td>
          <th>{{item.vote_valid}}元</th>
          <td>{{item.profit}}元</td>
          <td>{{getTime(item.start_at)}}</td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10" style="border-right: 1px solid #dddddd;">
            <p style="color:#777;font-weight:bold;margin:35px 0;font-size:14px;">没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本页小结</td>
          <td></td>
          <td></td>
          <td>{{getCurrentPageVote}}</td>
          <td>{{getCurrentPageVoteValid}}</td>
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
        gameType: '',
        gameOptions: [
          // PVP： 棋牌， FISH： 捕鱼， LIVE： 真人， RNG： 电子， SPORTS： 体育 
          {
            value: 'PVP',
            text: '棋牌'
          },
          {
            value: 'FISH',
            text: '捕鱼'
          },
          {
            value: 'LIVE',
            text: '真人'
          },
          {
            value: 'RNG',
            text: '电子'
          },
          {
            value: 'SPORTS',
            text: '体育'
          },
        ],
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
          },
          //用户名
          username: {
            key: 'loginname',
            value: '',
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //用户属性
          userTypes: {
            key: 'self',
            value: 1,
            options: [{ text: '全部', value: 2 }, { text: '自己', value: 1 }, { text: '下级', value: 0 }],
            getValue() {
              if (this.value || this.value == 0) {
                return this.value;
              }
              return 2;
            },
            reset() {
              this.value = 2;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //form End
        },
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        agg: [], //投注统计
        aggpage_size: 15,
        aggpage_num: 1,
        aggtotal: 0,
        aggtotal_page_num: 0,
        aggNoResult: true,
      };
    },
    methods: {
      getCurrentPageCash(key) {
        let amount = 0.00;
        if (this.agg.length != 0) {
          for (let i = 0; i < this.agg.length; i++) {
            if (this.agg[i][key]) {
              amount += this.agg[i][key];
            }
          }
        }
        return parseFloat(amount).toFixed(2);
      },
      getTime(time) {
        return moment(time).format("YYYY-MM-DD HH:mm:ss");
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
        this.handleSearch();
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
        this.handleSearch();
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
        this.handleSearch();
      },
      //设置近几日
      setTimeRecent3Days(day) {
        let now = new Date();
        let previous = this.getDay(day);
        this.form.dateFrom.value = previous + " 00:00:00";
        let ymd = this.formatDate(now);
        this.form.dateTo.value = ymd + " 23:59:59";
        this.handleSearch();
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
      handleSizeChangeAgg(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeAgg(val) {
        this.aggpage_num = val;
        this.onSubmit();
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        if (this.form.userTypes.value == 1) {
          this.form.username.value = localStorage.getItem('loginname');
        }
        data["pageSize"] = this.pageSize;
        data["pageNum"] = this.pageIndex;
        data['aggpage_size'] = this.aggpage_size;
        data['aggpage_num'] = this.aggpage_num;
        data['game_type'] = this.gameType;
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
          self.$alert(`<div class="lottery-title">${errorMessage}</div>`, '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
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
                  }
                  self.aggtotal = success.data.aggtotal;
                  if (self.aggtotal) {
                    self.aggNoResult = false;
                    self.aggtotal_page_num = success.data.aggtotal_page_num;
                    self.agg = success.data.aggdata;
                  } else {
                    self.aggNoResult = true;
                    self.agg = [];
                  }
                } else {
                  self.noResult = true;
                  self.list = [];
                  self.aggNoResult = true;
                  sefl.agg = [];
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
      getCurrentPageVoteValid() {
        let vote = 0.0;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].vote_valid) {
              vote += this.list[i].vote_valid;
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
    },
    mounted() {
      this.setTimeToday();
      this.form.username.value = localStorage.getItem('loginname');
      this.onSubmit();
      this.getPlatform();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    },
    filters: {
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2);
        }
        return 0;
      },
      filterGameType(cellValue) {
        if (cellValue) {
          switch (cellValue) {
            case 'PVP':
              return '棋牌';
            case 'FISH':
              return '捕鱼';
            case 'LIVE':
              return '真人';
            case 'RNG':
              return '电子';
            case 'SPORTS':
              return '体育';
          }
        }
        return "--";
      },
    },
  };
</script>
<style scoped>
  .mb-20 {
    margin-bottom: 20px;
  }

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
    font-size: 14px;
    color: #191919;
    font-weight: bold;
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
    padding-bottom: 30px;
  }

  .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
    font-size: 14px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    font-weight: bold;
    color: #CFA072;
    border: 1px solid #CFA072;
    text-align: center;
    margin-left: 20px;
  }

  .record-options .option-row>a.time:hover {
    color: #fff;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%)
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
    width: 80px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    font-family: microsoft yahei;
    box-shadow: none;
    border: none;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
  }

  .ml-20 {
    margin-left: 20px;
  }
</style>