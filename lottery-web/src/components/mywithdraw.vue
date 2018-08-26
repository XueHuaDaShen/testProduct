<!--提现申请列表-->
<template>
  <div class="mywithdraw-wrap">
    <form class="record-options search-form" action="">
      <div class="option-row mb-20">
        <span class="exp w-60">状态：</span>
        <el-select v-model="form.status.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="(item,index) in form.status.options" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="option-row mb-30">
        <span class="exp w-60">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <span class="exp">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time ml-20" @click="setTimeNowWeek">本周</a>
        <a class="time ml-20" @click="setTimeNowMonth">本月</a>
        <a class="time ml-20" @click="setTimeRecent3Days">近一月</a>
        <a class="search ml-20" @click="handleSearch">查询</a>
      </div>
    </form>
    <hr class="user-split-line">
    <div>
      <table class="record-group">
        <thead>
          <tr class="group-title">
            <th>订单号</th>
            <th>时间</th>
            <!-- <th>账户</th> -->
            <th>申请金额</th>
            <th>手续费</th>
            <th>到账金额</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-item" v-for="item in list" :key="item.order_no" v-if="!noResult">
            <td>{{item.order_no}}</td>
            <td>{{getTime(item.create_at)}}</td>
            <!-- <td>{{item.card_no}}</td> -->
            <td>{{item.cash_apply}}</td>
            <td>{{item.cash_service_fee?item.cash_service_fee:0}}</td>
            <td>{{item.cash_withdrawed?item.cash_withdrawed:0 }}</td>
            <td>
              <a :class="getStatus(item.status).class">{{getStatus(item.status).text}}</a>
            </td>
            <td>{{item.message ? item.message:"--"}}</td>
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
            <td>本月资金变动</td>
            <td>{{getCurrentPageApply}}</td>
            <td>{{getCurrentPageFee}}</td>
            <td>{{getCurrentPageReal}}</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import request from "../axios/axios";
  import moment from "moment";
  import paramCryptFn from '../lib/cryptData'

  export default {
    data() {
      return {
        loading: false,
        //form Start
        form: {
          //开始结束时间
          dateFrom: {
            key: "beginTime",
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
            key: "endTime",
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
          status: {
            //状态： 1：申请 2：一审， 3： 二审， 4： 三审 5： 出账 6：银行退单 7：审核失败 8： 到账
            key: "status",
            options: [
            {
              value: ['1', '2', '3', '4', '5', '6', '7'],
              label: '全部'
            },
            {
              value: ['1', '2', '3', '4'],
              label: '申请'
            }, {
              value: ['5'],
              label: '出账'
            }, {
              value: ['6'],
              label: '银行退单'
            }, {
              value: ['7'],
              label: '审核失败'
            }],
            value: ['1', '2', '3', '4', '5', '6', '7'],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return ['1', '2', '3', '4', '5', '6', '7'];
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
        },
        //form End
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15 //单页条数
      };
    },
    methods: {
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      //今天
      setTimeToday() {
        const end = new Date();
        const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
        end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
        this.form.dateTo.value = end;
        this.form.dateFrom.value = start;
      },
      //本周
      setTimeNowWeek() {
        let now = new Date();
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //当前日
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
          .getTime() + 24 * 60 * 60 * 1000 - 1);
        this.form.dateTo.value = getWeekEndDate;
        this.form.dateFrom.value = getWeekStartDate;
      },
      //本月
      setTimeNowMonth() {
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
        this.form.dateTo.value = getMonthEndDate;
        this.form.dateFrom.value = getMonthStartDate;
      },
      //设置近几日
      setTimeRecent3Days() {
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
        this.form.dateTo.value = end;
        this.form.dateFrom.value = start;
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        data["page_size"] = this.pageSize;
        data["page_num"] = this.pageIndex;
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
          let url = "/user/trade/withdraw/list";
          request.http(
            "get",
            url,
            paramCryptFn(data),
            success => {
              self.loading = false;
              if (success.returncode) {
                if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                  request.loginAgain(self);
                } else if (success.returncode == 200) {
                  self.total = success.data.total;
                  if (self.total) {
                    self.noResult = false;
                    self.totalPageNum = success.data.total_page_num;
                    self.list = success.data.data;
                  } else {
                    self.list = [];
                    self.noResult = true;
                    /* self.$alert("没有符合条件的记录", "系统提醒", {
                      confirmButtonText: "确定",
                      center: true,
                      callback: action => {

                      }
                    }); */
                  }
                } else {
                  self.list = [];
                  self.noResult = true;
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
              self.list = [];
              self.noResult = true;
              console.log("error", error);
            }
          );
          return true;
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      getTime(time) {
        return moment(time).format("YYYY-MM-DD HH:mm:ss");
      },
      getStatus(data) {
        let status = {};
        switch (parseInt(data)) {
          case 1:
            status["text"] = "申请";
            status["class"] = "applying";
            break;
          case 2:
            status["text"] = "申请";
            status["class"] = "applying";
            break;
          case 3:
            status["text"] = "申请";
            status["class"] = "applying";
            break;
          case 4:
            status["text"] = "申请";
            status["class"] = "applying";
            break;
          case 5:
            status["text"] = "出账";
            status["class"] = "success";
            break;
          case 6:
            status["text"] = "银行退单";
            status["class"] = "failure";
            break;
          case 7:
            status["text"] = "审核失败";
            status["class"] = "failure";
            break;
            // case 8:
            //   status["text"] = "到账";
            //   status["class"] = "success";
            //   break;
        }
        return status;
      }
    },
    mounted() {
      this.setTimeToday();
      this.onSubmit();
    },
    computed: {
      getCurrentPageApply() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash_apply) {
              amount += this.list[i].cash_apply;
            }
          }
        }
        return amount;
      },
      getCurrentPageFee() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash_service_fee) {
              amount += this.list[i].cash_service_fee;
            }
          }
        }
        return amount;
      },
      getCurrentPageReal() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash_withdrawed) {
              amount += this.list[i].cash_withdrawed;
            }
          }
        }
        return amount;
      },
    }
  };
</script>
<style scoped>
  * {
    box-sizing: border-box;
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .w-60 {
    width: 60px;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .no-result p {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #333;
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

  .mywithdraw-wrap {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .mywithdraw-wrap .record-options {
    background: #ffffff;
  }

  .mywithdraw-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
    color: #191919;
  }

  .mywithdraw-wrap .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .mywithdraw-wrap .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
  }

  .mywithdraw-wrap .record-options .option-row>a.time:hover {
    background: #C83A4C;
    color: #fff;
  }

  .search {
    width: 80px;
    height: 30px;
    background: #C83A4C;
    color: #fff;
    display: inline-block;
    line-height: 30px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    text-align: center;
    border-radius: 2px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .mywithdraw-wrap .record-group {
    /* width: 978px; */
    width: 100%;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .mywithdraw-wrap .record-group .group-title {
    background: #F6F6F6;
    color: #fff;
  }

  .mywithdraw-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
    color: #777;
  }

  /* .mywithdraw-wrap .record-group .group-title>th:after {
    content: "";
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  } */

  .mywithdraw-wrap .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .mywithdraw-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #c38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .mywithdraw-wrap .record-group .group-item a.success {
    background: #e1701d;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mywithdraw-wrap .record-group .group-item a.applying {
    background: #4d86fa;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mywithdraw-wrap .record-group .group-item a.failure {
    background: #74a402;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mywithdraw-wrap .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .mywithdraw-wrap .record-group .group-item:nth-child(2n + 1) {
    /* background: #f7f7f7; */
  }

  .mywithdraw-wrap .record-group .record-bottom {
    width: 100%;
    background: #F6F6F6;
    margin-top: 74px;
  }

  .mywithdraw-wrap .record-group .record-bottom .group-item {
    /* height: 34px; */
    /* line-height: 34px; */
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
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
</style>
<link/>