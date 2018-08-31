<template>
  <div class="rechargeLot-wrap el-custom">
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
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>流水号：</label>
            <el-input clearable v-model="order_no" placeholder="流水号" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>入款类型：</label>
            <el-select clearable v-model="incomeType.value" placeholder="请选择" class="small" :loading="incomeType.loading"
              :loading-text="incomeType.loadingText">
              <!-- <el-option v-for="(item,index) in incomeType.options" :key="index" :label="item.name" :value="item.type">
              </el-option> -->
              <el-option-group v-for="group in incomeType.options" :key="group._id" :label="group.name">
                <el-option v-for="item in group.child" :key="item.code" :label="item.name" :value="item.type">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status.value" placeholder="请选择" class="small">
              <el-option v-for="(item,index) in status.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </div> -->
          <!-- <div class="search-inner-wrap">
            <label>打码量：</label>
            <el-select clearable v-model="status" placeholder="请选择" class="small">
              <el-option v-for="item in statusArr" :key="item.val" :label="item.label" :value="item.val">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="cashid" label="流水号" width="260px">
        </el-table-column>
        <el-table-column align="center" prop="loginid.loginname" label="用户名" width="126">
        </el-table-column>
        <el-table-column align="center" label="入款类型">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="入款时间">
        </el-table-column>
        <el-table-column align="center" prop="amount" width="110" label="入款额">
        </el-table-column>
        <el-table-column align="center" prop="load" label="打码量要求">
        </el-table-column>
        <el-table-column align="center" prop="stake" label="有效投注">
        </el-table-column>
        <el-table-column align="center" label="核算至" prop="update_at" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="完成状态">
        </el-table-column>
        <!-- <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
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
    name: 'stakecountList',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '打码量核查',
        routerArr: [{
            title: '用户登录记录',
            name: 'userLog',
            checked: false
          },
          {
            title: '打码量核查',
            name: 'stakecountList',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        withdrawListData: [],
        userid: '',
        id: "", // 流水号
        loginname: '',
        username: '', // 用户名
        incomeType: {
          value: "",
          options: [],
          loadingText: "正在搜索...",
          loading: false,
        },
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
        status: {
          value: "",
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "未完成",
              value: "0"
            },
            {
              label: "已完成",
              value: "1"
            },
          ],
        },
        type: '',
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
            value: "",
            label: "全显示"
          },
          {
            value: "0",
            label: "不显示"
          },
          {
            value: "1",
            label: "仅显示"
          }
        ],
        is_test: '0',
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
        if (v.url === 'stakecountList') {
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
      if (query.param) {
        this.username = query.param;
      }
      this.getWithdrawLotList();
      this.getTypeList();
    },
    methods: {
      // 入款类型list
      getTypeList(event) {
        let vm = this;
        if (vm.incomeType.options.length != 0) {
          return;
        }
        vm.incomeType.loading = true;
        let url = "/trade/type/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.incomeType.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                let options = success.data;
                if (options.length != 0) {
                  for (let i = 0; i < options.length; i++) {
                    let group = options[i].child;
                    options[i].child = [];
                    for (let j = 0; j < group.length; j++) {
                      let direct = group[j].direct;
                      if (direct === "IN") {
                        options[i].child.push(group[j]);
                      } else {
                        continue;
                      }
                    }
                  }
                  vm.incomeType.options = options;
                }
              } else {
                vm.incomeType.loading = false;
              }
            }
          },
          error => {
            vm.incomeType.loading = false;
          }
        );
      },
      getType(value) {
        if (this.incomeType.options.length == 0) {
          return;
        }
        let name = "";
        let options = [];
        for (let i = 0; i < this.incomeType.options.length; i++) {
          let group = this.incomeType.options[i].child;
          options = options.concat(group);
        }
        for (let j = 0; j < options.length; j++) {
          let type = options[j].type;
          if (value === type) {
            name = options[j].name;
            break;
          }
        }
        return name;
      },
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
            return '未完成';
          case 1:
            return '完成';
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
            cashid: trim(vm.order_no),
            /* beginTime: beginTime,
            endTime: endTime, */
            type: vm.incomeType.value,
            status: vm.status.value,
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
        this.order_no = "";
        this.incomeType.value = "";
        this.status.value = "";
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
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>
