<template>
  <div class="rechargeLot-wrap">
    <DialogUserInfo v-if="dialog" :userid="userid" :loginname="loginname" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <el-input clearable v-model="username" placeholder="姓名"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态">
              <el-option v-for="item in statusArr" :key="item.val" :label="item.label" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>订单号：</label>
            <el-input clearable v-model="order_no" placeholder="订单号"></el-input>
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
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="order_no" label="订单编号">
        </el-table-column>
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cash_apply" width="110" label="提交金额(￥)">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="提交时间">
        </el-table-column>
        <el-table-column align="center" prop="cash_recharged" label="到账金额">
        </el-table-column>
        <el-table-column align="center" prop="update_at" :formatter="formatTime" label="到账时间">
        </el-table-column>
        <el-table-column align="center" prop="card_no" label="银行卡号">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1||scope.row.status==2||scope.row.status==3||scope.row.status==4||scope.row.status==5"
              size="text" @click="toWithdrawFn(scope.row)">提现审核</el-button>
            <el-button size="text" @click="toWithdrawDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 提现审核 dialog start -->
    <el-dialog width="30%" :before-close="handleClose" title="提现审核" :center="false" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="当前状态" :label-width="formLabelWidth">
          <span>{{getStatus(form.status)}}</span>
        </el-form-item>
        <el-form-item label="审核" prop="statusSelected" :label-width="formLabelWidth">
          <el-select v-model="form.statusSelected" placeholder="请选择状态">
            <el-option v-for="option in form.statusOptions" :key="option.value" :label="option.text" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="textarea">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="form.textarea.value">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 提现审核 dialog end -->
    <!-- 提现详情 dialog start -->
    <el-dialog width="30%" :before-close="handledetailClose" title="提现审核详情" :center="false" :visible.sync="detailDialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="当前状态：" :label-width="formLabelWidth" label-position="top">
          <span>{{getStatus(detailForm.status)}}</span>
        </el-form-item>
        <el-form-item label="审核时间：" :label-width="formLabelWidth" label-position="top">
          <span>{{(getTime(detailForm.update_at))}}</span>
        </el-form-item>
        <el-form-item label="一审：" :label-width="formLabelWidth" v-if="detailForm.message1" label-position="top">
          <div>审核人： {{detailForm.auditor1}}</div>
          <div>备注:
            <el-input type="textarea" autosize v-model="detailForm.message1" :disabled="true">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="二审：" :label-width="formLabelWidth" v-if="detailForm.message2" label-position="top">
          <div>审核人： {{detailForm.auditor2}}</div>
          <div>备注:
            <el-input type="textarea" autosize v-model="detailForm.message2" :disabled="true">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="终审：" :label-width="formLabelWidth" v-if="detailForm.message3" label-position="top">
          <div>审核人： {{detailForm.auditor3}}</div>
          <div>备注:
            <el-input type="textarea" autosize v-model="detailForm.message3" :disabled="true">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="出账：" :label-width="formLabelWidth" v-if="detailForm.message4" label-position="top">
          <div>审核人： {{detailForm.auditor4}}</div>
          <div>备注:
            <el-input type="textarea" autosize v-model="detailForm.message4" :disabled="true">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="银行：" :label-width="formLabelWidth" v-if="detailForm.message5" label-position="top">
          <div>审核人： {{detailForm.auditor5}}</div>
          <div>备注:
            <el-input type="textarea" autosize v-model="detailForm.message5" :disabled="true">
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 提现详情 dialog end -->
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
    name: 'withdrawLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '提现记录',
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
        pageSize: 10,
        total: 10,
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
        typeArr: [{
          value: '1',
          label: '微信'
        }, {
          value: '2',
          label: '支付宝'
        }, {
          value: '3',
          label: '银行卡转账'
        }],
        statusArr: [{
          value: '1',
          label: '申请'
        }, {
          value: '2',
          label: '审核通过'
        }, {
          value: '3',
          label: '银行退单'
        }, {
          value: '4',
          label: '审核失败'
        }, {
          value: '5',
          label: '到账'
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
        if(v.url === 'withdrawLog'){
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
      success() {
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
            return '默认';
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
          case 8:
            return '到账';
        }
      },
      getStatus(status) {
        // console.log(typeof cellValue)
        switch (status) {
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
          case 8:
            return '到账';
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
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              id: vm.currId,
              status: vm.form.statusSelected,
            }
            data[vm.form.textarea.key] = vm.form.textarea.value
            let url = '/trade/withdraw/update'
            request.http(
              'post', url, data,
              (success) => {
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.resetForm('form');
                  vm.getWithdrawLotList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.resetForm('form');
                vm.error();
                console.log(error)
              }
            )
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      // open 提现审核dialog
      toWithdrawFn(row) {
        const vm = this;
        this.dialogFormVisible = true;
        this.form.status = row.status;
        this.currId = row._id;
      },
      // open 提现详情 dialog
      toWithdrawDetail(row) {
        this.detailDialogVisible = true;
        this.detailForm = row;
        this.currId = row._id;
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
          '/trade/withdraw/apply/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            type: vm.type,
            status: vm.status,
            order_no: trim(vm.order_no),
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
              vm.success();
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
    watch: {
      "form.status" (newVal, oldVal) {
        if (newVal) {
          if (newVal != oldVal) {
            switch (newVal) {
              case 1:
                this.form.statusOptions = [{
                    text: '一审通过',
                    value: 2
                  },
                  {
                    text: '审核失败',
                    value: 7
                  },
                ];
                this.form.textarea.key = 'message1';
                break;
              case 2:
                this.form.statusOptions = [{
                    text: '二审通过',
                    value: 3
                  },
                  {
                    text: '审核失败',
                    value: 7
                  },
                ];
                this.form.textarea.key = 'message2';
                break;
              case 3:
                this.form.statusOptions = [{
                    text: '终审通过',
                    value: 4
                  },
                  {
                    text: '审核失败',
                    value: 7
                  }
                ];
                this.form.textarea.key = 'message3';
                break;
              case 4:
                this.form.statusOptions = [{
                  text: '出账',
                  value: 5
                }];
                this.form.textarea.key = 'message4';
                break;
              case 5:
                this.form.statusOptions = [{
                  text: '已到账',
                  value: 8
                }, {
                  text: '银行退单',
                  value: 6
                }];
                this.form.textarea.key = 'message5';
                break;
            }
          }
        }
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
