<template>
  <div class="mydeposit-wrap">
    <form class="record-options search-form" action="">
      <div class="option-row">
        <span class="exp">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <span class="exp">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        &nbsp;&nbsp;
        <a class="time">今日</a>
        <a class="time">本周</a>
        <a class="time">本月</a>
        <a class="time">近三日</a>
        <a class="time">近半月</a>
        <a class="time">近一月</a>
        &nbsp;
        <a class="search" @click="onSubmit">搜索</a>
      </div>
      <div class="option-row">
        <span class="exp">类型：</span>
        <el-select v-model="form.type.value" placeholder="请选择" clearable>
          <el-option v-for="item in form.type.options" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </form>
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>编号</th>
          <th>时间</th>
          <th>充值金额</th>
          <th>余额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in 2" class="group-item" :key="index">
          <td>E678936787
          </td>
          <td>2018-4-21</td>
          <td>￥600.00元</td>
          <td>￥30000.89元</td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本页小结</td>
          <td>本月资金变动</td>
          <td>0.0000</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="record-pagination clearfix">
      <span>第一页，共2条</span>
      <a>>></a>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';

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
          type: {
            key: 'type',
            // 1： 微信 2：支付宝 3：银行转账
            options: [
              { key: '微信', value: 1 },
              { key: '支付宝', value: 2 },
              { key: '银行转账', value: 3 },
            ],
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
        },
        //form End
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 5, //单页条数
      }
    },
    methods: {
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        data['page_size'] = this.pageSize;
        data['page_num'] = this.pageIndex;
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
          let url = '/user/trade/recharge/list';
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
                  self.$alert('没有符合条件的记录', '系统提醒', {
                    confirmButtonText: '确定',
                    center: true,
                  });
                }
              } else {
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
    },
    mounted() {
      this.onSubmit();
    }
  }
</script>
<style scoped>
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
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .mydeposit-wrap .record-options {
    padding: 34px 0;
    background: #FFFFFF;
  }

  .mydeposit-wrap .record-options .option-row .exp {
    display: inline-block;
    margin: 0 14px;
    font-size: 12px;
  }

  .mydeposit-wrap .record-options .option-row {
    text-align: left;
    margin-bottom: 20px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .mydeposit-wrap .record-options .option-row>a.time {
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

  .mydeposit-wrap .record-options .option-row>a.time:hover {
    background: #D4914D;
    color: #fff;
  }

  .search {
    width: 91px;
    height: 30px;
    background: #C38755;
    color: #fff;
    display: inline-block;
    line-height: 30px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    text-align: center;
    border-radius: 6px;
  }

  .mydeposit-wrap .record-group {
    width: 978px;
    margin: 0 auto;
  }

  .mydeposit-wrap .record-group .group-title {
    background: #D4914D;
    color: #fff;
  }

  .mydeposit-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    height: 34px;
  }

  .mydeposit-wrap .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  }

  .mydeposit-wrap .record-group .group-item {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #DDDDDD;
  }

  .mydeposit-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #C38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .mydeposit-wrap .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .mydeposit-wrap .record-group .group-item:nth-child(2n+1) {
    background: #F7F7F7;
  }

  .mydeposit-wrap .record-group .record-bottom {
    width: 100%;
    background: #F0BD88;
    margin-top: 74px;
  }

  .mydeposit-wrap .record-group .record-bottom .group-item {
    height: 34px;
    line-height: 34px;
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
    float: right;
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
    float: right;
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
  }
</style>
<link/>