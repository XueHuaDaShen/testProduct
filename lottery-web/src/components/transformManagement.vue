<!--额度兑换记录-->
<template>
  <div class="transactions-wrap" v-loading="loading">
    <form class="record-options search-form" action="">
      <div class="option-row mb-20">
        <span class="exp w-60">类型：</span>
        <el-select v-model="form.type.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="(item,index) in form.type.options" :key="index" :label="item.key" :value="item.value">
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
          <th>流水号</th>
          <th>时间</th>
          <th>转账金额</th>
          <th>类型</th>
          <th>自/至</th>
          <th>转账前余额</th>
          <th>转账后余额</th>
          <th style="border-right: 1px solid #dddddd;">状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" class="group-item" :key="index" v-if="!noResult">
          <td>{{item._id}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{item.amount}}元</td>
          <td>{{getType(item.type)}}</td>
          <td v-if="item.type === 2">{{getPlatform(item.channel)}}</td>
          <td v-if="item.type === 1">{{getPlatform(item.channel)}}</td>
          <td v-if="item.type === 0">--</td>
          <td>
            {{item.before_cash?item.before_cash.toFixed(2):'--'}}
          </td>
          <td>
            {{item.after_cash?item.after_cash.toFixed(2):'--'}}
          </td>
          <td style="border-right: 1px solid #dddddd;"><a :style="{'color':item.status == 2 ? '#777' : '#191919'}">{{getStatus(item.status)}}</a></td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10" style="border-right: 1px solid #dddddd;">
            <p style="color:#777;font-weight:bold;margin:35px 0;font-size:14px;">没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本月资金变动</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{getCurrentPageAmount}}</td>
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
            key: 'startAt',
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
            key: 'endAt',
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
            options: [
              { key: '全部', value: '' },
              { key: '转出', value: 1 },
              { key: '转入', value: 2 }
            ],
            value: '',
            getValue() {
              if (this.value || this.value == 0) {
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
          //转入方
          channelIn: {
            key: 'channelIn',
            value: '',
            options: [
              { key: '主账户', value: 'main' },
              { key: 'KY', value: 'ky' },
              { key: 'AG', value: 'ag' },
              { key: 'PT', value: 'pt' }
            ],
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
          //转出方
          channelOut: {
            key: 'channelOut',
            value: '',
            options: [
              { key: '主账户', value: 'main' },
              { key: 'KY', value: 'ky' },
              { key: 'AG', value: 'ag' },
              { key: 'PT', value: 'pt' }
            ],
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
      }
    },
    methods: {
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
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        data['pageSize'] = this.pageSize;
        data['pageNum'] = this.pageIndex;
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
          self.$alert(`<div class="lottery-title">${errorMessage}</div>`, '系统提示', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        } else {
          this.loading = true;
          let url = '/exchange/list';
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
                  self.list = success.data.data;
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
        let text = "";
        switch (type) {
          case 0:
            text = "默认";
            break;
          case 1:
            text = "转出";
            break;
          case 2:
            text = "转入";
            break;
        }
        return text;
      },
      getStatus(status) {
        let text = '';
        switch (status) {
          case 0:
            text = "默认";
            break;
          case 1:
            text = "成功";
            break;
          case 2:
            text = "失败";
            break;
        }
        return text;
      },
      getPlatform(plat) {
        return plat;
      }
    },
    watch: {
      "form.channelIn.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (newValue == 'main') {
              this.form.channelOut.options = [
                { key: 'KY', value: 'ky' },
                { key: 'AG', value: 'ag' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'ky') {
              this.form.channelOut.options = [{ key: '主账户', value: 'main' },
                { key: 'AG', value: 'ag' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'ag') {
              this.form.channelOut.options = [{ key: '主账户', value: 'main' },
                { key: 'KY', value: 'ky' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'pt') {
              this.form.channelOut.options = [{ key: '主账户', value: 'main' },
                { key: 'AG', value: 'ag' },
                { key: 'KY', value: 'ky' }
              ];
            }
          } else {
            this.form.channelOut.options = [{ key: '主账户', value: 'main' },
              { key: 'KY', value: 'ky' },
              { key: 'AG', value: 'ag' },
              { key: 'PT', value: 'pt' }
            ];
            this.form.channelOut.value = '';
          }
        }
      },
      "form.channelOut.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (newValue == 'main') {
              this.form.channelIn.options = [
                { key: 'KY', value: 'ky' },
                { key: 'AG', value: 'ag' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'ky') {
              this.form.channelIn.options = [{ key: '主账户', value: 'main' },
                { key: 'AG', value: 'ag' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'ag') {
              this.form.channelIn.options = [{ key: '主账户', value: 'main' },
                { key: 'KY', value: 'ky' },
                { key: 'PT', value: 'pt' }
              ];
            } else if (newValue == 'pt') {
              this.form.channelIn.options = [{ key: '主账户', value: 'main' },
                { key: 'AG', value: 'ag' },
                { key: 'KY', value: 'ky' }
              ];
            }
          } else {
            this.form.channelIn.options = [{ key: '主账户', value: 'main' },
              { key: 'KY', value: 'ky' },
              { key: 'AG', value: 'ag' },
              { key: 'PT', value: 'pt' }
            ];
            this.form.channelIn.value = '';
          }
        }
      },
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
        return amount;
      },
    },
    mounted() {
      this.setTimeToday();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
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

  .transactions-wrap {
    color: #333333;
    width: 100%;
    margin: 0 auto;
    min-height: 731px;
    padding: 30px 20px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .transactions-wrap .record-options {
    background: #ffffff;
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

  .transactions-wrap .record-group {
    width: 944px;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .transactions-wrap .record-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .transactions-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    padding: 15px 0;
    color: #777;
  }

  .transactions-wrap .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
  }

  .transactions-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    /* background: #c38755; */
    font-weight: bold;
    color: #191919;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    cursor: auto;
  }

  .transactions-wrap .record-group .group-item a.success {
    /* background: #C83A4C; */
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .transactions-wrap .record-group .group-item a.applying {
    /* background: #4d86fa; */
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .transactions-wrap .record-group .group-item a.failure {
    /* background: #74a402; */
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .transactions-wrap .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .transactions-wrap .record-group .group-item:nth-child(2n + 1) {
    /* background: #f7f7f7; */
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