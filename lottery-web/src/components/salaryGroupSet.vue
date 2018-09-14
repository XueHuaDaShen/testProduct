<!--奖金组设置-->
<template>
  <div class="top-up-wrap" v-loading="loading">
    <div class="nav-inner">
      <ul class="list">
        <li>
          <a @click="previous">
            <<&nbsp;返回团队管理</a> </li> <li>
              <a class="active">奖金组设置</a>
        </li>
      </ul>
    </div>
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>用户属性</th>
          <th>奖金组</th>
          <th>下级人数</th>
          <th>团队余额</th>
          <th>在线</th>
          <th>最近登录时间</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in list" v-cloak v-if="!noResult" :key="index">
          <td>{{item.loginname}}</td>
          <td>{{item.who}}</td>
          <td>{{item.refund}}</td>
          <td>-</td>
          <td>{{item.cash}}</td>
          <td>{{getOnline(item.is_online)}}</td>
          <td>{{getTime(item.log)}}</td>
        </tr>
        <tr v-if="noResult" class="no-result group-item">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
  import request from '../axios/axios'
  import moment from 'moment'

  export default {
    data() {
      return {
        loading: false,
        form: {
          //form Start
          //开始结束时间
          dateFrom: {
            key: 'begintime',
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
          dateTo: {
            key: 'endtime',
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
          //下级用户名
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
          //用户名
          refund: {
            key: 'refund',
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
          }
          //form End
        },
        list: [],
        noResult: true,
        // totalPageNum: 0, //总页数
        // total: 0, //总条数
        // pageIndex: 1, //当前页
        // pageSize: 5, //单页条数
      }
    },
    methods: {
      previous() {
        this.$router.push({
          name: "teamManagement",
        });
      },
      getTime(time) {
        return moment(time).format("YYYY-MM-DD , HH:mm:ss");
      },
      getOnline(value) {
        switch (value) {
          case 0:
            return '离线';
          case 1:
            return '在线';
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      //今天
      setTimeToday() {
        let date = new Date();
        let ymd = this.formatDate(date);
        this.form.dateTo.value = ymd + ' 23:59:59';
        this.form.dateFrom.value = ymd + ' 00:00:00';
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
        this.form.dateFrom.value = getWeekStartDate + ' 00:00:00';
        //获得本周的结束日期
        let getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        getWeekEndDate = this.formatDate(getWeekEndDate);
        this.form.dateTo.value = getWeekEndDate + ' 23:59:59';
      },
      //本月
      setTimeNowMonth() {
        let now = new Date();
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        //获得本月的开始日期
        let getMonthStartDate = new Date(nowYear, nowMonth, 1);
        getMonthStartDate = this.formatDate(getMonthStartDate);
        this.form.dateFrom.value = getMonthStartDate + ' 00:00:00';

        //获得本月的结束日期
        let getMonthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowYear, nowMonth));
        getMonthEndDate = this.formatDate(getMonthEndDate);
        this.form.dateTo.value = getMonthEndDate + ' 23:59:59';
      },
      //设置近几日
      setTimeRecent3Days(day) {
        let now = new Date();
        let previous = this.getDay(day);
        this.form.dateFrom.value = previous + ' 00:00:00';
        let ymd = this.formatDate(now);
        this.form.dateTo.value = ymd + ' 23:59:59';
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
        return (myyear + "-" + mymonth + "-" + myweekday);
      },
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        let errorMessage = '查询错误';
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
          data['page_size'] = this.pageSize;
          data['page_num'] = this.pageIndex;
          let url = '/user/team/user/list';
          request.http('get', url, data, (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.total = success.data.total;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.data.total_page_num;
                  self.list = success.data.data
                } else {
                  self.noResult = true;
                  self.$alert('<div class="lottery-title">没有符合条件的记录</div>', '系统提醒', {
                    confirmButtonText: '确定',
                    center: true,
                    dangerouslyUseHTMLString: true,
                    customClass: "syxw-wrap-inner",
                    callback: action => {}
                  })
                }
              } else {
                self.noResult = false;
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          }, (error) => {
            self.loading = false;
            self.noResult = true;
            console.log('error', error);
          })
          return true;
        }
      },
      getSalaryGroup(loginname) {
        let data = { loginname: loginname },
          self = this;
        this.loading = true;
        let url = '/user/profile';
        request.http('get', url, data, (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              self.total = success.data.total;
              if (self.total) {
                self.noResult = false;
                self.totalPageNum = success.data.total_page_num;
                self.list = success.data.data
              } else {
                self.noResult = true;
                self.list = [];
                self.$alert('<div class="lottery-title">没有符合条件的记录</div>', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {}
                })
              }
            } else {
              self.noResult = true;
              self.list = [];
            }
          }
        }, (error) => {
          self.loading = false;
          self.noResult = true;
          self.list = [];
        })
      },
    },
    computed: {
      getCurrentUserName() {
        return localStorage.getItem('loginname');
      }
    },
    mounted() {
      let loginname = this.$route.query.loginname;
      if (loginname) {
        this.getSalaryGroup(loginname);
      } else {
        this.$alert('<div class="lottery-title">当前奖金组不存在，请联系管理员</div>', '系统提醒', {
          confirmButtonText: '确定',
          center: true,
          dangerouslyUseHTMLString: true,
          customClass: "syxw-wrap-inner",
          callback: action => {
            this.previous();
          }
        })
      }
    }
  }
</script>
<style scoped>
  .tip {
    height: 33px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
    width: 200px;
    display: inline-block;
  }

  .username-input {
    display: inline-block;
    width: 100px;
    height: 30px;
    border: 1px solid #8D8D8D;
    line-height: 28px;
    text-indent: 8px;
  }

  .username-input:focus {
    border-color: #D4914D;
    outline: none;
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

  .top-up-wrap {
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  .record-tabs {
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
    background: #F9EFEF;
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
    padding: 39px 0;
    background: #FFFFFF;
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
    border: 1px solid #8D8D8D;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #FFFFFF;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all .2s;
    margin: 0 14px;
  }

  .record-options .option-row>a {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: auto;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    border: 1px solid #D4914D;
    margin-right: 3px;
  }

  .record-options .option-row>a:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group {
    width: 978px;
    margin: 0 auto;
  }

  .record-group .group-title {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    height: 34px;
  }

  .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  }

  .record-group .group-item {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .record-group .group-item a {
    height: 32px;
    background: #C38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    padding: 0 10px;
  }

  .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 56px;
    height: 30px;
    line-height: 28px;
    border-radius: 5px;
    border: 1px solid #8D8D8D;
    text-align: center;
    margin-right: 3px;
  }

  .record-options .option-row>a.time:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .record-group .group-item:nth-child(2n+1) {
    background: #F7F7F7;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #F0BD88;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 34px;
    line-height: 34px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .success {
    color: #099F4C;
  }

  .failed {
    color: #E10C0C
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
    background: #E9E9E9;
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
    height: 28px;
    padding: 0 29px;
    line-height: 26px;
    text-align: center;
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    background-color: #D4914D;
    border: 1px solid #CCC;
    -webkit-box-shadow: none;
    box-shadow: none;
    margin-left: 20px;
  }

  .nav-inner {
    float: left;
    background-color: #F5F5F5;
    font-size: 14px;
    position: relative;
    font-size: 14px;
    width: 100%;
    text-align: left;
  }

  .nav-inner>ul.list {
    font-size: 12px;
  }

  .nav-inner ul.list>li {
    display: inline-block;
  }

  .nav-inner ul.list>li>a {
    display: inline-block;
    padding: 10px 40px;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    color: #333;
  }

  .nav-inner ul.list>li>a.active {
    border-top: 2px solid #A65B06;
    color: #A65B06;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
  }
</style>