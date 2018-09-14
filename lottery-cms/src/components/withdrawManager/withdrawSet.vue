<template>
  <div>
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
          <div class="search-btn">
            <el-button type="success" @click="createSet" size="medium">添加设置</el-button>
            <el-button type="danger" @click="handleSearch" size="medium">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawSetListData" header-row-class-name="table-header" stripe border style="width: 100%">
        <el-table-column align="center" prop="name" label="支付方式">
        </el-table-column>
        <el-table-column align="center" prop="max_withdraw_times_daily" width="110" label="每天提款最大次数">
        </el-table-column>
        <el-table-column align="center" prop="max_withdraw_every_time" label="每笔提款最大值">
        </el-table-column>
        <el-table-column align="center" prop="min_withdraw_every_time" label="每笔提款最小值">
        </el-table-column>
        <el-table-column align="center" prop="max_recharge_every_time" label="每笔最高存款">
        </el-table-column>
        <el-table-column align="center" prop="min_recharge_every_time" label="每笔最低存款">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="text" @click="editSet(scope.row)">编辑</el-button>
            <el-button size="text" @click="deleteSet(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="添加设置" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="支付方式" prop="name">
          <el-input v-model.trim="ruleForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="每天最多提款金额" prop="max_cash_daily">
          <el-input type="number" v-model="ruleForm.max_cash_daily"></el-input>
        </el-form-item> -->
        <el-form-item label="每天提款最大次数" prop="max_withdraw_times_daily">
          <el-input type="number" v-model.trim="ruleForm.max_withdraw_times_daily"></el-input>
        </el-form-item>
        <el-form-item label="每笔提款最大值" prop="max_withdraw_every_time">
          <el-input type="number" v-model.trim="ruleForm.max_withdraw_every_time"></el-input>
        </el-form-item>
        <el-form-item label="每笔提款最小值" prop="min_withdraw_every_time">
          <el-input type="number" v-model.trim="ruleForm.min_withdraw_every_time"></el-input>
        </el-form-item>
        <el-form-item label="每笔最高存款" prop="max_recharge_every_time">
          <el-input type="number" v-model.trim="ruleForm.max_recharge_every_time"></el-input>
        </el-form-item>
        <el-form-item label="每笔最低存款" prop="min_recharge_every_time">
          <el-input type="number" v-model.trim="ruleForm.min_recharge_every_time"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="create_at">
          <el-input v-model="ruleForm.create_at"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button v-if="isCreate" type="primary" @click="createSetFn('ruleForm')">确 定</el-button>
        <el-button v-if="!isCreate" type="primary" @click="editSetFn('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div style="width:860px;margin:0 auto;padding-top:20px;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="每天最多提款金额" prop="max_cash_daily">
          <el-input type="number" v-model="ruleForm.max_cash_daily"></el-input>
        </el-form-item>
        <el-form-item label="每天提款最大次数" prop="max_withdraw_times_daily">
          <el-input type="number" v-model="ruleForm.max_withdraw_times_daily"></el-input>
        </el-form-item>
        <el-form-item label="每笔提款最大值" prop="max_withdraw_every_time">
          <el-input type="number" v-model="ruleForm.max_withdraw_every_time"></el-input>
        </el-form-item>
        <el-form-item label="每笔提款最小值" prop="min_withdraw_every_time">
          <el-input type="number" v-model="ruleForm.min_withdraw_every_time"></el-input>
        </el-form-item>
        <el-form-item label="每笔最高存款" prop="max_recharge_every_time">
          <el-input type="number" v-model="ruleForm.max_recharge_every_time"></el-input>
        </el-form-item>
        // <el-form-item label="有效时间区间" required>
          <el-col :span="11">
            <el-form-item prop="effect_time1">
              <el-date-picker type="datetime" placeholder="开始时间" v-model="ruleForm.effect_time1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="effect_time2">
              <el-date-picker type="datetime" placeholder="结束时间" v-model="ruleForm.effect_time2" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item> //
        // <el-form-item label="有效时间区间" required>
          <el-col :span="11">
            <el-form-item prop="effect_time">
              <el-date-picker type="datetime" v-model="ruleForm.effect_time" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item> //
        <el-form-item label="每笔最低存款" prop="min_recharge_every_time">
          <el-input type="number" v-model="ruleForm.min_recharge_every_time"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_at">
          <el-input v-model="ruleForm.create_at"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div> -->
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import {
    trim
  } from "../../lib/utils/validator";
  import moment from 'moment'
  export default {
    name: 'withdrawSet',
    mounted() {
      // this.getConfig();
      this.getDataList();
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '支付设置',
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
        username: '',
        loading: false,
        withdrawSetListData: [],
        pageNum: 1,
        pageSize: 40,
        total: 0,
        dialogFormVisible: false,
        isCreate: false,
        editId: '',
        ruleForm: {
          id: '',
          // max_cash_daily: '',
          name: '',
          max_withdraw_times_daily: '',
          max_withdraw_every_time: '',
          min_withdraw_every_time: '',
          max_recharge_every_time: '',
          min_recharge_every_time: '',
          // create_at: ''
        },
        rules: {
          // max_cash_daily: [{
          //   required: true,
          //   message: '每天最多提款金额',
          //   trigger: 'blur'
          // }],
          name: [{
            required: true,
            message: '支付方式',
            trigger: 'blur'
          }],
          max_withdraw_times_daily: [{
            required: true,
            message: '每天提款最大次数',
            trigger: 'blur'
          }],
          max_withdraw_every_time: [{
            required: true,
            message: '每笔提款最大值',
            trigger: 'blur'
          }],
          min_withdraw_every_time: [{
            required: true,
            message: '每笔提款最小值',
            trigger: 'blur'
          }],
          max_recharge_every_time: [{
            required: true,
            message: '每笔最高存款',
            trigger: 'blur'
          }],
          min_recharge_every_time: [{
            required: true,
            message: '每笔最低存款',
            trigger: 'blur'
          }]
          // create_at: [{
          //   required: true,
          //   message: '创建时间',
          //   trigger: 'blur'
          // }]
        },
        duration: 1000,
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
        if (v.url === 'withdrawSet') {
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
      handleReset() {
        this.username = '';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
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
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      editSet(item) {
        const vm = this;
        this.dialogFormVisible = true;
        this.isCreate = false;
        for (let i in vm.ruleForm) {
          vm.ruleForm[i] = item[i]
        }
        vm.editId = item._id;
      },
      editSetFn(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          let data = {};
          for (let i in vm.ruleForm) {
            data[i] = vm.ruleForm[i]
          }
          data.id = vm.editId;
          if (valid) {
            request.http(
              'post',
              '/pay/setting/update',
              data,
              (success) => {
                let code = success.returncode;
                if (code === 200) {
                  vm.success();
                  vm.dialogFormVisible = false;
                  vm.getDataList();
                  vm.resetForm('ruleForm');
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
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
      createSet() {
        this.ruleForm = {
          name: '',
          max_withdraw_times_daily: '',
          max_withdraw_every_time: '',
          min_withdraw_every_time: '',
          max_recharge_every_time: '',
          min_recharge_every_time: ''
        }
        this.dialogFormVisible = true;
        this.isCreate = true;
      },
      createSetFn(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          let data = {};
          for (let i in vm.ruleForm) {
            if (i !== 'id') {
              data[i] = vm.ruleForm[i]
            }
          }
          if (valid) {
            request.http(
              'post',
              '/pay/setting/create',
              data,
              (success) => {
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.getDataList();
                  // vm.success();
                  vm.resetForm('ruleForm');
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
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
      deleteSet(row) {
        const vm = this;
        this.$alert('确定继续该操作吗', '温馨提示', {
          showCancelButton: true,
          center: true,
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/pay/setting/delete', {
                  id: row._id
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getDataList();
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  } else {
                    alert(success.returncode)
                  }
                },
                (error) => {
                  vm.error();
                  console.log(error)
                }
              )
            }
          }
        });
      },
      // submitForm(formName) {
      //   const vm = this;
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       request.http(
      //         'post',
      //         '/trade/withdraw/config/update',
      //         vm.ruleForm,
      //         (success) => {
      //           let code = success.returncode;
      //           if (code === 200) {
      //             vm.success();
      //             for (let i in vm.ruleForm) {
      //               vm.ruleForm[i] = success.data[i]
      //             }
      //             vm.ruleForm.id = success.data._id
      //           } else if (code === 101 || code === 103 || code === 106) {
      //             request.loginAgain(vm)
      //           } else {
      //             alert(success.returncode)
      //           }
      //         },
      //         (error) => {
      //           vm.error();
      //           console.log(error)
      //         }
      //       )
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
        // console.log(`当前页: ${val}`);
      },
      getConfig() {
        const vm = this;
        request.http(
          'get',
          '/trade/withdraw/config', {},
          (success) => {
            // console.log('config--------', success);
            let code = success.returncode;
            if (code === 200) {
              for (let i in vm.ruleForm) {
                vm.ruleForm[i] = success.data[i]
              }
              vm.ruleForm.id = success.data._id
              // vm.lotteryList = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },

      getDataList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/pay/setting/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            name: trim(vm.username)
          },
          (success) => {
            vm.loading = false;
            // console.log('withdrawLotList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawSetListData = success.data;
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
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
