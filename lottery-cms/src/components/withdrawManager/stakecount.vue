<template>
  <div class="rechargeLot-wrap">
    <DialogUserInfo v-if="dialog" :userid="userid" :loginname="loginname" @sendDiglogShow="handleDialogShow"
      @closeDialog="handleCloseDialog"></DialogUserInfo>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model.trim="username" placeholder="姓名"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>打码量：</label>
            <el-select clearable v-model="status" placeholder="请选择状态">
              <el-option v-for="item in statusArr" :key="item.val" :label="item.label" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-btn">
            <el-button type="danger" @click="handleSearch" size="medium">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium">重置</el-button>
          </div>
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%">
        <el-table-column align="center" prop="load" label="打码量要求">
        </el-table-column>
        <el-table-column align="center" prop="amount" width="110" label="充值金额">
        </el-table-column>
        <el-table-column align="center" prop="stake" label="打码量投注额">
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: 'stakecount',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '打码量记录',
        routerArr: [{
            title: '提现记录',
            name: 'withdrawLog',
            checked: false
          },
          {
            title: '支付设置',
            name: 'withdrawSet',
            checked: false
          },
          {
            title: '打码量记录',
            name: 'stakecount',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        withdrawListData: [],
        userid: '',
        loginname: '',
        username: '',
        searchTime: '',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        statusArr: [{
          value: '0',
          label: '不满足'
        }, {
          value: '1',
          label: '满足'
        }],
        type: '',
        status: '',
        order_no: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        // 提现审核form
        form: {
          // 提现状态 span
          status: '',
          // 提现状态select options
          statusOptions: [],
          // 提现状态select selected
          statusSelected: '',
          // 备注
          textarea: {
            key: '',
            value: ''
          }
        },
        rules: {
          statusSelected: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          textarea: [{
            required: true,
            message: '请填写备注',
            trigger: 'change'
          }]
        },
        formLabelWidth: '120px',
        currId: '',
        detailDialogVisible: false,
        // 提现详情form
        detailForm: {},
        testUser: [{
            value: "0",
            label: "否"
          },
          {
            value: "1",
            label: "是"
          }
        ],
        is_test: '',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'stakecount') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
      this.getWithdrawLotList();
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
        // console.log(name)
      },
      succee() {
        const vm = this;
        this.$message({
          message: '加载成功',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: '加载失败',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '不满足';
          case 1:
            return '满足';
        }
      },
      getTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      formatTestUser(row, column, cellValue) {
        let t = '';
        if (cellValue === 1) {
          t = '是'
        } else {
          t = '否'
        }
        return t;
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getWithdrawLotList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/stakecount/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            status: vm.status,
            is_test: vm.is_test
          },
          (success) => {
            vm.loading = false;
            // console.log('withdrawLotList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.username = '';
        this.searchTime = '';
        this.type = '';
        this.status = '';
        this.order_no = '';
        this.is_test = '0';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
      },
      handleClose() {
        this.resetForm('form')
      },
      handledetailClose() {
        this.detailDialogVisible = false;
      }
    },
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>
