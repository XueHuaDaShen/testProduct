<!--团队充提-->
<template>
  <div class="top-up-wrap" v-loading="loading">
    <div class="record-options search-form">
      <div class="option-row mb-20">
        <span class="exp w-60">用户属性：</span>
        <el-select v-model="form.userTypes.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in form.userTypes.options" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="option-row mb-30">
        <span class="exp w-60">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span style="margin:0 5px;font-weight:bold;color:#777;font-size:14px;">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time ml-20" @click="setTimeNowWeek">本周</a>
        <a class="time ml-20" @click="setTimeNowMonth">本月</a>
        <a class="time ml-20" @click="setTimeRecent3Days">近一月</a>
        <a class="submit ml-20" @click="handleSearch()">查询</a>
      </div>
    </div>
    <hr class="user-split-line">
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>用户属性</th>
          <th>团队人数</th>
          <th>充值总额</th>
          <th>提现总额</th>
          <th style="border-right: 1px solid #dddddd;">可用余额</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in list" v-cloak v-if="!noResult" :key="index">
          <td>{{item.loginname?item.loginname:"--"}}</td>
          <td>{{getUserType(item.username[0].status,item.loginname)}}</td>
          <td>{{item.username[0].inferior_num ? item.username[0].inferior_num +1 :1}}</td>
          <td>{{item.recharge?formatMoney(item.recharge):0}}</td>
          <td>{{item.withdrawal?formatMoney(item.withdrawal):0}}</td>
          <td style="border-right: 1px solid #dddddd;">{{item.username[0].cash?formatMoney(item.username[0].cash):0}}</td>
        </tr>
        <tr v-if="noResult" class="no-result group-item">
          <td colspan="10" style="border-right: 1px solid #dddddd;">
            <p style="color:#777;font-weight:bold;margin:35px 0;font-size:14px;">没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td colspan="3">所在区间统计：</td>
          <td>{{getCurrentPageCZ}}</td>
          <td>{{getCurrentPageTX}}</td>
          <td style="border-right: 1px solid #dddddd;">{{getCurrentPageCash}}</td>
        </tr>
      </tfoot>
    </table>
    <!-- <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
  import request from '../axios/axios'

  export default {
    data() {
      return {
        teamNum: 0,
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
          //用户属性
          userTypes: {
            key: 'who',
            value: '',
            options: [{ text: '全部', value: '' }, { text: '自己', value: '2' }, { text: '下级', value: '1' }],
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
          /*  //用户名
           username: {
             key: 'loginname',
             value: localStorage.getItem('loginname'),
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
           } */
          // form End
        },
        list: [],
        noResult: true,
        // totalPageNum: 0, //总页数
        // total: 0, //总条数
        // pageIndex: 1, //当前页
        // pageSize: 5 //单页条数
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2).toString();
        }
        return '0'
      },
      onSubmit() {
        let validate = true,
          data = {},
          vm = this;
        let errorMessage = '查询错误';
        // data["PageSize"] = this.pageSize;
        // data["PageNum"] = this.pageIndex;
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
          vm.$alert(`<div class="lottery-title">${errorMessage}</div>`, '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        } else {
          this.loading = true;
          vm.list = [];
          let url = '/user/team/recharge/withdraw/list';
          request.http('get', url, data, (success) => {
            vm.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                if (success.data.length != 0) {
                  vm.noResult = false;
                  if (success.self.length != 0) {
                    vm.list = vm.list.concat(success.self);
                  }
                  vm.list = vm.list.concat(success.data);
                  vm.teamNum = vm.list.length;
                } else {
                  vm.noResult = true;
                  vm.list = [];
                }
              } else if (success.returncode == 303) {
                vm.list = [];
                vm.noResult = true;
              }
            }
          }, (error) => {
            vm.loading = false;
            vm.list = [];
            vm.noResult = true;
            console.log('error', error);
          })
          return true;
        }
      },
      getUserType(value, name) {
        let loginname = localStorage.getItem('loginname');
        if (loginname === name) {
          return '自己'
        }
        switch (value) {
          case 0:
            return '代理'
          case 1:
            return '会员'
        }
      }
    },
    filters: {
      // filterOwner(val) {
      //   if (val) {
      //     let loginname = localStorage.getItem('loginname').toString();
      //     if (loginname === val) {
      //       return '自己';
      //     } else {
      //       return val;
      //     }
      //   }
      //   return "--"
      // }
    },
    computed: {
      getCurrentUserName() {
        return localStorage.getItem('loginname');
      },
      getCurrentPageCZ() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].recharge) {
              amount += this.list[i].recharge;
            }
          }
        }
        return amount;
      },
      getCurrentPageTX() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].withdrawal) {
              amount += this.list[i].withdrawal;
            }
          }
        }
        return amount;
      },
      getCurrentPageCash() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].cash) {
              amount += this.list[i].cash;
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
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
  }

  .record-tabs {
    height: 44px;
    background: rgba(212, 145, 77, 1);
    border-radius: px;
    padding: 5px;
    display: table;
  }

  .record-tabs .tab-item {
    width: 64px;
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
    background: #FFFFFF;
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

  /* .record-group .group-title>th:after {
    content: '';
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
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #C38755;
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
    color: #099F4C;
  }

  .failed {
    color: #C83A4C
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