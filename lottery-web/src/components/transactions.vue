<!--帐变记录-->
<template>
  <div class="transactions-wrap" v-loading="loading">
    <form class="record-options search-form" action="">
      <div class="option-row mb-20">
        <span class="exp w-60">用户名：</span>
        <el-input v-model="form.loginname.value" type="text" placeholder="填写用户名" clearable style="width:114px">
        </el-input>
        <span class="exp ml-20">类型：</span>
        <el-select v-model="form.type.value" placeholder="请选择" clearable @focus="getTypeOptions" :loading="form.type.loading" :loading-text="form.type.loadingtext" style="width:114px">
          <el-option v-for="(item,index) in form.type.options" :key="index" :label="item.name" :value="item.type">
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
        <a class="time" @click="setTimeNowWeek">本周</a>
        <a class="time" @click="setTimeNowMonth">本月</a>
        <a class="time" @click="setTimeRecent3Days">近一月</a>
        <a class="submit ml-20" @click="handleSearch()">查询</a>
      </div>
    </form>
    <hr class="user-split-line">
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>编号</th>
          <th>时间</th>
          <th>帐变类型</th>
          <th>游戏</th>
          <th>奖期</th>
          <th>玩法</th>
          <th>变动金额</th>
          <th style="border-right: 1px solid #dddddd;">余额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" class="group-item" :key="index" v-if="!noResult">
          <td>{{item._id}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{getType(item.type)}}</td>
          <td>{{getName(item.gameid)}}</td>
          <td>{{getNo(item.issue_no)}}</td>
          <td>{{getName(item.lotteryid)}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.trade_current ? item.trade_current.toFixed(2) :"--"}}</td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10" style="border-right: 1px solid #dddddd;">
            <p style="color:#777;font-weight:bold;margin:35px 0;font-size:14px;">没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>本月资金变动</td>
          <td>{{getCurrentPageAmount}}</td>
          <td style="border-right: 1px solid #dddddd;">{{getCurrentPageCurrentTrade}}</td>
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
  import request from '../axios/axios';
  import moment from 'moment';

  export default {
    data() {
      return {
        loading: false,
        //form Start
        form: {
          //开始结束时间
          dateFrom: {
            key: 'beginTime',
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
            key: 'endTime',
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
          type: {
            loading: false,
            loadingtext: "正在搜索...",
            key: 'type',
            options: [{ name: '全部', type: '' }],
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
          loginname: {
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
        },
        //form End
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        typelist: []
      }
    },
    methods: {
      getTypeList() {
        let self = this;
        let url = '/trade/type/list';
        this.loading = true;
        request.http('get', url, {}, (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              let data = success.data;
              if (data.length != 0) {
                self.typelist = data;
              }
            } else {
              self.$message({
                showClose: true,
                message: "系统出错，请联系管理员",
                type: "error"
              });
            }
          }
        }, (error) => {
          self.loading = false;
          console.log('error', error);
        })
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
      getName(id) {
        if (id && id.name) {
          return id.name;
        }
        return '--'
      },
      getNo(issue_no) {
        if (issue_no) {
          return issue_no;
        }
        return '--'
      },
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        data['PageSize'] = this.pageSize;
        data['PageNum'] = this.pageIndex;
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
          let url = '/user/trade/list';
          request.http('get', url, data, (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.total = success.count;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.totalPage;
                  self.list = success.data;
                } else {
                  self.noResult = true;
                  self.list = [];
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
            console.log('error', error);
          })
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
      getType(type) {
        for (let i = 0; i < this.typelist.length; i++) {
          let o = this.typelist[i];
          if (type === o.type) {
            return o.name;
          }
        }
        return "--"
      },
      getTypeOptions(e) {
        if (this.form.type.options.length > 1) {
          return;
        }
        let self = this;
        let url = '/trade/type/list';
        this.form.type.loading = true;
        request.http('get', url, {}, (success) => {
          self.form.type.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              let data = success.data;
              if (data.length != 0) {
                let options = [{ name: '全部', type: '' }];
                self.form.type.options = options.concat(data);
              }
            } else {
              self.$message({
                showClose: true,
                message: "系统出错，请联系管理员",
                type: "error"
              });
            }
          }
        }, (error) => {
          self.form.type.loading = false;
          console.log('error', error);
        })
      }
    },
    computed: {
      getCurrentPageAmount() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].amount) {
              amount += this.list[i].amount;
            }
          }
        }
        return amount.toFixed(2);
      },
      getCurrentPageCurrentTrade() {
        let trade = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].trade_current) {
              trade += this.list[i].trade_current;
            }
          }
        }
        return trade.toFixed(2);
      }
    },
    mounted() {
      if (this.$route.query && this.$route.query.loginname) {
        this.form.loginname.value = this.$route.query.loginname;
      }
      this.setTimeToday();
      this.getTypeList();
      this.handleSearch();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
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

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .tip {
    height: 33px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
    width: 200px;
    display: inline-block;
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

  .transactions-wrap {
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

  .transactions-wrap .record-options {
    background: #FFFFFF;
  }

  .transactions-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 14px;
    color: #191919;
    font-weight: bold;
  }

  .transactions-wrap .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .transactions-wrap .record-group {
    width: 944px;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .transactions-wrap .record-group .group-title {
    background: #F6F6F6;
    color: #777;
  }

  .transactions-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
  }

  /* .transactions-wrap .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  } */

  .transactions-wrap .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .transactions-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #C38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .transactions-wrap .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .transactions-wrap .record-group .group-item:nth-child(2n+1) {
    /* background: #F7F7F7; */
  }

  .transactions-wrap .record-group .record-bottom {
    width: 100%;
    background: #f6f6f6;
    margin-top: 74px;
  }

  .transactions-wrap .record-group .record-bottom .group-item {
    height: 50px;
    line-height: 50px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .success {
    color: #099F4C;
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
</style>
<link />