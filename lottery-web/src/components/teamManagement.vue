<!--团队管理-->
<template>
  <div class="team-manage-wrap search-form" v-loading="loading">
    <div class="record-options">
      <div class="option-row mb-30">
        <!-- <span class="exp w-60">奖金组：</span>
        <input v-model="form.refund.value" class="username-input" style="width:114px" /> -->
        <span class="exp w-60">下级用户名：</span>
        <input v-model="form.username.value" class="username-input" style="width:114px" />
        <span class="tip">（仅限查询当前用户的下级）</span>
      </div>
      <!-- <div class="option-row mb-30">
        <span class="exp w-60">时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span class="exp">至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker> &nbsp;&nbsp;
        <a class="time ml-20" @click="setTimeToday">今日</a>&nbsp;
        <a class="time ml-20" @click="setTimeNowWeek">本周</a>&nbsp;
        <a class="time ml-20" @click="setTimeNowMonth">本月</a>&nbsp;
        <a class="time ml-20" @click="setTimeRecent3Days">近一月</a>
        <a class="submit ml-20" @click="handleSearch()">查询</a>
      </div> -->
    </div>
    <hr class="user-split-line">
    <div class="btn-line">
      <a class="reg" @click="regAccount()">注册开户</a>
    </div>
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>奖金组</th>
          <!-- <th>临时奖金组</th> -->
          <!-- <th>下级</th> -->
          <th>团队人数</th>
          <th>注册日期</th>
          <th>最新登陆</th>
          <th>当前余额</th>
          <th>在线</th>
          <th>操作</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in list" v-cloak v-if="!noResult" :key="index">
          <td>{{item.loginname}}</td>
          <td>{{item.refund}}</td>
          <!-- <td>{{item.refund}}</td> -->
          <!-- <td>{{item.totalCharge}}</td> -->
          <td>{{item.inferior_num ? item.inferior_num : 1}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{item.log ? getTime(item.log):'--'}}</td>
          <td>{{formatMoney(item.cash)}}</td>
          <td>{{getOnline(item.is_online)}}</td>
          <td>
            <!-- <router-link :to="{name:'salaryGroupSet',query:{loginname:item.loginname}}">奖金组/返点</router-link> -->
            <!-- <router-link :to="{name:'withdraw',query:{id:2,loginname:item.loginname}}">转账</router-link> -->
            <!-- <router-link :to="{name:'transactions',query:{loginname:item.loginname}}">帐变</router-link> -->
          </td>
        </tr>
        <tr v-if="noResult" class="no-result group-item">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <!-- 签订契约 Start-->
    <el-dialog :visible.sync="dialog.visible" :before-close="dialogChange" class="dialog-class" width='800px'>
      <div slot='title' class="dialog-header">
        <span class="title">{{dialog.title}}</span>
        <i class="close" @click="dialogChange"></i>
      </div>
      <div v-loading="dialog.loading" class="item">
        <div class="dialog-row mb-20 time-row">
          <label class="exp">用户名：</label>
          <el-input v-model.trim="dialogForm.loginname.value" type="text" placeholder="请输入用户名" style="width:114px" clearable />
        </div>
        <div class="dialog-row mb-30 time-row">
          <label class="exp">登录密码：</label>
          <el-input v-model.trim="dialogForm.password.value" :type="dialogForm.password.type" placeholder="请输入登录密码" style="width:114px" clearable />
        </div>
        <div class="dialog-row time-row">
          <div class="percentage-row">
            <span class="title">设置奖金组</span>
            <el-input v-model.number="dialogForm.salary.group" @blur="handleInputGroup" style="width:114px" />
            <el-slider v-model.number="dialogForm.salary.group" class="slider" :max="dialogForm.salary.max" :min="dialogForm.salary.min" :step="dialogForm.salary.step" @change="salarySlideChange"></el-slider>
            <span class="rebatesRateTitle">预计平均返点率</span>
            <span class="rebatesRate" v-text="rebatesRate"></span>
          </div>
        </div>
      </div>
      <div class="dialog-footer" slot='footer' v-loading="dialog.loading">
        <a class="contract-link-commit" @click="regNow()">立即开户</a>
      </div>
    </el-dialog>
    <!-- 签订契约 End -->
  </div>
</template>
<script>
  import request from '../axios/axios'
  import contractDialog from "./contractDialog/contractDialog.vue";
  import moment from 'moment'
  import * as validator from "../lib/utils/validator.js";
  import paramCryptFn from '../lib/cryptData'

  export default {
    components: {
      contractDialog
    },
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
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        dialog: {
          visible: false,
          title: "注册账户",
          loading: false,
        },
        dialogForm: {
          loginname: {
            value: '',
          },
          password: {
            value: '',
            type: 'password'
          },
          salary: {
            group: 0,
            max: 0,
            min: 1800,
            step: 2
          },
        }
      }
    },
    methods: {
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2).toString();
        }
        return '0'
      },
      // 注册开户
      regAccount() {
        this.dialog.visible = true;
        this.resetDialog();
      },
      regNow() {
        let data = {},
          self = this;
        if (!this.dialogForm.loginname.value) {
          self.$message({
            message: '请填写用户名',
            type: 'error',
            duration: 1000
          })
          return false;
        }
        if (!validator.regexpInput(this.dialogForm.loginname.value)) {
          self.$message({
            message: '用户名需3-16位字符，只能包含英文字母或数字',
            type: 'error',
            duration: 1000
          })
          return false;
        }
        if (!this.dialogForm.password.value) {
          self.$message({
            message: '请填写登录密码',
            type: 'error',
            duration: 1000
          })
          return false;
        }
        if (!validator.regexpPsd(this.dialogForm.password.value)) {
          self.$message({
            message: '登录密码需6-16位字符，只能且必须同时包含数字和字母，不允许连续三位相同',
            type: 'error',
            duration: 1000
          })
          return false;
        }
        if (!this.dialogForm.salary.group) {
          self.$message({
            message: '请设置奖金组',
            type: 'error',
            duration: 1000
          })
          return false;
        }
        this.loading = true;
        let url = '/user/team/manual/create';
        data['loginname'] = this.dialogForm.loginname.value;
        data['password'] = CryptoJS.MD5(this.dialogForm.password.value).toString();
        data['refund'] = this.dialogForm.salary.group;
        request.http('post', url, paramCryptFn(data), (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              self.dialog.visible = false;
              self.$message({
                message: '用户创建成功！',
                type: 'success',
                duration: 1000
              })
              self.resetDialog();
              self.onSubmit();
            } else if (success.returncode == 303 || success.returncode == 305) {
              self.resetDialog();
              self.$message({
                message: '用户名已存在！',
                type: 'error',
                duration: 1000
              })
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
          self.resetDialog();
          self.$message({
            message: '用户创建失败',
            type: 'error',
            duration: 1000
          })
        })
      },
      resetDialog() {
        for (let i in this.dialogForm) {
          this.dialogForm[i].value = "";
          if (i === "salary") {
            this.dialogForm.salary.group = Number(localStorage.getItem('refund'));
          }
        }
      },
      dialogChange(value) {
        this.dialog.visible = false;
      },
      salarySlideChange(value) {
        if (value) {
          console.log('value', value)
        }
      },
      // 输入奖金组
      handleInputGroup() {
        const vm = this;
        let max = vm.dialogForm.salary.max;
        let min = vm.dialogForm.salary.min;

        let group = vm.dialogForm.salary.group;
        if (group < min) {
          group = min;
        }
        if (group > max) {
          group = max;
        }
        vm.dialogForm.salary.group = Number(group);
        // console.log(vm.multiple)
      },
      getTime(time) {
        if (time) {
          return moment(time).format("YYYY-MM-DD , HH:mm:ss");
        }
        return "--"
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
          self.$alert(errorMessage, '系统提醒', {
            confirmButtonText: '确定',
            center: true
          });
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
                if (self.total != 0) {
                  self.noResult = false;
                  self.totalPageNum = success.data.total_page_num;
                  self.list = success.data.data
                } else {
                  self.noResult = true;
                  self.list = [];
                }
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
    },
    computed: {
      getCurrentUserName() {
        return localStorage.getItem('loginname');
      },
      rebatesRate() {
        return ((this.dialogForm.salary.max - this.dialogForm.salary.group) / 2000 * 100).toFixed(2) + ' %';
      }
    },
    created() {
      this.dialogForm.salary.max = Number(localStorage.getItem('refund'));
      this.dialogForm.salary.group = Number(localStorage.getItem('refund'));
      // this.setTimeToday();
      this.handleSearch();
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style lang="scss">
  .team-manage-wrap .search-form .dialog-class {
    padding: 30px 20px;
    width: 800px;
    height: 360px;
    overflow: hidden;
  }

  .team-manage-wrap .search-form .dialog-header {
    width: 800px;
  }
</style>
<style scoped lang="scss">
  .dialog-row {
    display: flex;
    justify-content: center;
    align-items: center;

    .exp {
      width: 80px;
      text-align: right;
      display: inline-block;
      color: #191919;
      font-size: 12px;
      margin-right: 17px;
    }
  }

  .contract-link-commit {
    width: 115px;
    height: 40px;
    background: #CC3447;
    border-radius: 2px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FFFFFF;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    text-decoration: none;
    margin-top: 30px;
  }

  .percentage-row {
    height: 70px;
    line-height: 68px;
    width: 100%;
    font-size: 12px;
    color: #191919;
    text-align: left;
    background: #F6F6F6;
    border: 1px solid #DDDDDD;
    padding: 0 24px;

    .title {
      font-size: 12px;
      color: #191919;
      display: inline-block;
      margin-right: 10px;
      font-family: PingFangSC-Regular;
    }

    .left1-title {
      margin-left: 188px;
      display: inline-block;
    }

    .salary-input {
      width: 112px;
      height: 44px;
      line-height: 44px;
      display: inline-block;
      border: 1px solid #A6A6A6;
      border-radius: 6px;
      text-align: center;
      margin-left: 27px;
    }

    .slider {
      margin: 0 20px;
      width: 260px;
      display: inline-block;
      vertical-align: middle;
    }

    .rebatesRateTitle {
      font-size: 12px;
      color: #777777;
      font-family: PingFangSC-Regular;
    }

    .rebatesRate {
      margin-left: 10px;
      height: 30px;
      background: #fff;
      border-radius: 2px;
      color: #191919;
      border: 1px solid #ccc;
      display: inline-block;
      width: 114px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular;
    }
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .btn-line {
    text-align: right;
    margin-bottom: 20px;

    .reg {
      display: inline-block;
      line-height: 28px;
      height: 30px;
      border-radius: 6px;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #FFFFFF;
      padding: 0 18px;
      background-color: #2D996E;
    }
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .w-60 {
    width: 80px;
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

  .team-manage-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
  }

  .tip {
    height: 30px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 30px;
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

  .team-manage-wrap {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
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
    background: #FFFFFF;
  }

  .record-options .option-row {
    text-align: left;
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
  }

  .record-group .group-item:last-child {
    border-bottom: none;
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
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
  }

  .record-options .option-row>a.time:hover {
    background: #C83A4C;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .record-group .group-item:nth-child(2n+1) {
    /* background: #F7F7F7; */
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
    color: #E10C0C
  }

  .record-pagination {
    padding: 30px 0 10px 0;
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
    width: 80px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    background-color: #C83A4C;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    /* margin-left: 20px; */
  }
</style>