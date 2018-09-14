<!--充值申请列表-->
<template>
  <div class="mydeposit-wrap">
    <form class="record-options search-form" action="">
      <div class="option-row mb-20">
        <span class="exp w-60">充值渠道：</span>
        <el-select v-model="form.type.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in form.type.options" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="option-row mb-30">
        <span class="exp w-60">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <span style="margin:0 5px;font-weight:bold;color:#777;font-size:14px;">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time ml-20" @click="setTimeNowWeek">本周</a>
        <a class="time ml-20" @click="setTimeNowMonth">本月</a>
        <a class="time ml-20" @click="setTimeRecent3Days">近一月</a>
        <a class="submit ml-20" @click="handleSearch">查询</a>
      </div>
    </form>
    <hr class="user-split-line">
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>订单号</th>
          <th>充值渠道</th>
          <th>申请时间</th>
          <th>申请金额</th>
          <th>实际充值</th>
          <th>手续费</th>
          <th style="border-right: 1px solid #dddddd;">状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" class="group-item" :key="item.order_no" v-if="!noResult">
          <td>{{item.order_no}}</td>
          <td>{{getType(item.type)}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{item.cash_apply}}</td>
          <td>{{item.cash_recharged}}</td>
          <td>{{item.cash_service_fee}}</td>
          <td>
            <a :class="getStatus(item.status).class">{{getStatus(item.status).text}}</a>
          </td>
          <!-- <td>
            <a class="submit">订单详情</a>
          </td> -->
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
          <td>本月资金变动</td>
          <td></td>
          <td>{{getCurrentPageApply}}</td>
          <td>{{getCurrentPageRecharged}}</td>
          <td></td>
          <td style="border-right: 1px solid #dddddd;"></td>
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
  import moment from "moment";

  export default {
    data() {
      return {
        loading: false,
        //form Start
        form: {
          //开始结束时间
          dateFrom: {
            key: "begintime",
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
            key: "endtime",
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
          type: {
            key: "type",
            // 1：微信 2：支付宝 3：银行卡转账 4：银联转账 5：网银快捷 6：银联扫码 
            options: [
              { key: "全部", value: '' },
              { key: "微信", value: '1' },
              { key: "支付宝", value: '2' },
              { key: "银行卡转账", value: '3' },
              { key: "银联转账", value: '101' },
              { key: "网银快捷", value: '113' },
              { key: "银联扫码", value: '111' },
            ],
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
        this.handleSearch();
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
        this.handleSearch();
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
        this.handleSearch();
      },
      //设置近几日
      setTimeRecent3Days() {
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
        this.form.dateTo.value = end;
        this.form.dateFrom.value = start;
        this.handleSearch();
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
          let url = "/user/trade/recharge/list";
          request.http(
            "get",
            url,
            data,
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
            status["text"] = "申请充值";
            status["class"] = "applying";
            break;
          case 2:
            status["text"] = "充值成功";
            status["class"] = "success";
            break;
          case 3:
            status["text"] = "充值失败";
            status["class"] = "failure";
            break;
        }
        return status;
      },
      getType(data) {
        // 1：微信 2：支付宝 3：银行卡转账 4：银联转账 5：网银快捷 6：银联扫码 
        let status = "";
        switch (parseInt(data)) {
          case 1:
            status = "微信";
            break;
          case 2:
            status = "支付宝";
            break;
          case 3:
            status = "银行卡转账";
            break;
          case 101:
            status = "银联转账";
            break;
          case 113:
            status = "网银快捷";
            break;
          case 111:
            status = "银联扫码";
            break;
        }
        return status;
      }
    },
    computed: {
      getCurrentPageApply() {
        let cash_apply = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash_apply) {
              cash_apply += this.list[i].cash_apply;
            }
          }
        }
        return cash_apply.toFixed(2);
      },
      getCurrentPageRecharged() {
        let cash_recharged = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash_recharged) {
              cash_recharged += this.list[i].cash_recharged;
            }
          }
        }
        return cash_recharged.toFixed(2);
      }
    },
    mounted() {
      this.setTimeToday();
      this.onSubmit();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>
<style scoped>
  .mb-30 {
    margin-bottom: 30px;
  }

  .w-60 {
    width: 70px;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
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

  .mydeposit-wrap {
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

  .mydeposit-wrap .record-options {
    background: #ffffff;
  }

  .mydeposit-wrap .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .mydeposit-wrap .record-group {
    width: 944px;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .mydeposit-wrap .record-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .mydeposit-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
    color: #777;
  }

  /* .mydeposit-wrap .record-group .group-title>th:after {
    content: "";
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  } */

  .mydeposit-wrap .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .mydeposit-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    /* background: #c38755; */
    color: #777;
    font-weight: bold;
    cursor: auto;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .mydeposit-wrap .record-group .group-item a.submit {
    height: 30px;
    /* background: #C83A4C; */
    color: #191919;
    font-weight: bold;
    display: inline-block;
    line-height: 30px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    vertical-align: middle;
  }

  .mydeposit-wrap .record-group .group-item a.success {
    /* background: #C83A4C; */
    color: #191919;
    font-weight: bold;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mydeposit-wrap .record-group .group-item a.applying {
    color: #777;
    font-weight: bold;
    /* background: #4d86fa; */
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mydeposit-wrap .record-group .group-item a.failure {
    /* background: #74a402; */
    color: #777;
    font-weight: bold;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .mydeposit-wrap .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .mydeposit-wrap .record-group .group-item:nth-child(2n + 1) {
    /* background: #f7f7f7; */
  }

  .mydeposit-wrap .record-group .record-bottom {
    width: 100%;
    background: #f6f6f6;
    margin-top: 74px;
  }

  .mydeposit-wrap .record-group .record-bottom .group-item {
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
</style>
<link />