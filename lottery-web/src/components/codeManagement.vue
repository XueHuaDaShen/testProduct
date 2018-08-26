<!--打码量管理 - 打码量查询-->
<template>
  <div class="transactions-wrap" v-loading="loading">
    <form class="record-options search-form" action="">
      <div class="option-row mb-30">
        <!-- <span class="exp w-60">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <span class="exp">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker> -->
        <span class="exp w-60">状态：</span>
        <el-select v-model="form.status.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="(item,index) in form.status.options" :key="index" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
        <a class="search ml-20" @click="handleSearch()">搜索</a>
      </div>
    </form>
    <hr class="user-split-line">
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>流水号</th>
          <th>入款类型</th>
          <th>入款时间</th>
          <th>入款额</th>
          <th>打码量要求</th>
          <th>有效投注</th>
          <th>核算至</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" class="group-item" :key="index" v-if="!noResult">
          <td>{{item.cashid ? item.cashid : ""}}</td>
          <td>{{getType(item.type)}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.load}}</td>
          <td>{{item.stake}}</td>
          <td>{{getTime(item.update_at)}}</td>
          <td>{{getStatus(item.status)}}</td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
      <!-- <tfoot class="record-bottom">
        <tr class="group-item">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>本月资金变动</td>
          <td>{{getCurrentPageAmount}}</td>
          <td>{{getCurrentPageCurrentTrade}}</td>
        </tr>
      </tfoot> -->
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
          status: {
            loading: false,
            loadingtext: "正在搜索...",
            key: 'status',
            options: [
              { key: '不满足', value: "0" },
              { key: '满足', value: "1" }
            ],
            value: '',
            getValue() {
              if (this.value || this.value == '0') {
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
                message: success.data.msg,
                type: "error"
              });
            }
          }
        }, (error) => {
          self.loading = false;
          console.log('error', error);
        })
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
          self.$alert(errorMessage, '系统提醒', {
            confirmButtonText: '确定',
            center: true
          });
          return false;
        } else {
          this.loading = true;
          let url = '/user/stackcount/list';
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
                  // self.$alert('没有符合条件的记录', '系统提醒', {
                  //   confirmButtonText: '确定',
                  //   center: true,
                  // });
                }
              } else {
                self.noResult = true;
                self.list = [];
                self.$message({
                  showClose: true,
                  message: success.data.msg,
                  type: "error"
                });
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
      getStatus(status) {
        let text = '';
        switch (status) {
          case 0:
            text = "不满足";
            break;
          case 1:
            text = "满足";
            break;
        }
        return text;
      }
    },
    computed: {
      getCurrentPageAmount() {
        let amount = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            amount += this.list[i].amount;
          }
        }
        return amount;
      },
    },
    mounted() {
      // this.setTimeToday();
      this.getTypeList();
      this.handleSearch();
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
    width: 60px;
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

  .transactions-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
    color: #191919;
  }

  .transactions-wrap .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .transactions-wrap .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
    cursor: pointer;
  }

  .transactions-wrap .record-options .option-row>a.time:hover {
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
    cursor: pointer;
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
    /* height: 34px; */
    padding: 15px 0;
    color: #777;
  }

  /* .transactions-wrap .record-group .group-title>th:after {
    content: "";
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
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .transactions-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #c38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .transactions-wrap .record-group .group-item a.success {
    background: #C83A4C;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .transactions-wrap .record-group .group-item a.applying {
    background: #4d86fa;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .transactions-wrap .record-group .group-item a.failure {
    background: #74a402;
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
<link/>