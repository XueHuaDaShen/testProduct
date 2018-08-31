<template>
  <div class="el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div> -->
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createSet" size="medium" class="edit">新增配置</el-button>
        </div>
      </div>
    </div>
    <!-- table -->
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawSetListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="name" label="名称">
        </el-table-column>
        <el-table-column align="center" label="出款">
          <el-table-column prop="max_withdraw_times_daily" label="每日次数" width="120" align="center">
          </el-table-column>
          <el-table-column prop="max_withdraw_every_time" label="单笔上限" width="120" align="center">
          </el-table-column>
          <el-table-column prop="min_withdraw_every_time" label="单笔下限" width="120" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="公司入款">
          <el-table-column prop="max_recharge_every_time" label="单笔上限" width="120" align="center">
          </el-table-column>
          <el-table-column prop="min_recharge_every_time" label="单笔下限" width="120" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="扫码入款">
          <el-table-column prop="max_recharge_scan" label="单笔上限" width="120" align="center">
          </el-table-column>
          <el-table-column prop="min_recharge_scan" label="单笔下限" width="120" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="第三方入款">
          <el-table-column prop="third_max_recharge_every_time" label="单笔上限" width="120" align="center">
          </el-table-column>
          <el-table-column prop="third_min_recharge_every_time" label="单笔下限" width="120" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="editSet(scope.row)" class="small edit">编辑</el-button>
            <el-button @click="deleteSet(scope.row)" class="small yes">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')" class="">
      <div class="body-top clearfix">
        <div class="top-row">
          <span style="font-size:16px;color:#191919;">名称</span>
        </div>
        <div class="top-row">
          <el-input v-model="ruleForm.name" auto-complete="off"></el-input>
        </div>
      </div>
      <div class="body-top clearfix">
        <div class="top-row">
          <span style="font-size:16px;color:#191919;">出款</span>
        </div>
        <div class="top-row">
          <div class="row-item">
            <p class="title">每日次数</p>
            <el-input class="small center" v-model="ruleForm.max_withdraw_times_daily"></el-input>
          </div>
          <div class="row-item">
            <p class="title">单笔上限</p>
            <el-input class="small center" v-model="ruleForm.max_withdraw_every_time"></el-input>
          </div>
          <div class="row-item">
            <p class="title">单笔下限</p>
            <el-input class="small center" v-model="ruleForm.min_withdraw_every_time"></el-input>
          </div>
        </div>
      </div>
      <div class="body-top clearfix">
        <div class="top-row">
          <span style="font-size:16px;color:#191919;">公司入款</span>
        </div>
        <div class="top-row">
          <div class="row-item">
            <p class="title">单笔上限</p>
            <el-input class="small center" v-model="ruleForm.max_recharge_every_time"></el-input>
          </div>
          <div class="row-item">
            <p class="title">单笔下限</p>
            <el-input class="small center" v-model="ruleForm.min_recharge_every_time"></el-input>
          </div>
        </div>
      </div>
      <div class="body-top clearfix">
        <div class="top-row">
          <span style="font-size:16px;color:#191919;">扫码入款</span>
        </div>
        <div class="top-row">
          <div class="row-item">
            <p class="title">单笔上限</p>
            <el-input class="small center" v-model="ruleForm.max_recharge_scan"></el-input>
          </div>
          <div class="row-item">
            <p class="title">单笔下限</p>
            <el-input class="small center" v-model="ruleForm.min_recharge_scan"></el-input>
          </div>
        </div>
      </div>
      <div class="body-top clearfix">
        <div class="top-row">
          <span style="font-size:16px;color:#191919;">第三方入款</span>
        </div>
        <div class="top-row">
          <div class="row-item">
            <p class="title">单笔上限</p>
            <el-input class="small center" v-model="ruleForm.third_max_recharge_every_time"></el-input>
          </div>
          <div class="row-item">
            <p class="title">单笔下限</p>
            <el-input class="small center" v-model="ruleForm.third_min_recharge_every_time"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isCreate" type="primary" @click="createSetFn('ruleForm')" class="yes" :loading="createLoading">确
          定</el-button>
        <el-button v-if="!isCreate" type="primary" @click="editSetFn('ruleForm')" class="yes" :loading="editLoading">确
          定</el-button>
        <el-button @click="resetForm('ruleForm')" class="no">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import {
    trim,
    positiveDecimal
  } from "../../lib/utils/validator";
  import moment from 'moment'
  export default {
    name: 'limitCashSet',
    mounted() {
      // this.getConfig();
      this.getDataList();
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        createLoading: false,
        editLoading: false,
        titleName: '限额设置',
        routerArr: [{
          title: '限额设置',
          name: 'limitCashSet',
          checked: false
        }, {
          title: '打码量设置',
          name: 'dmlSet',
          checked: false
        }],
        username: '',
        loading: false,
        withdrawSetListData: [],
        pageNum: 1,
        pageSize: 40,
        total: 0,
        dialogFormVisible: false,
        dialogFormTitle: "新增配置项",
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
          third_max_recharge_every_time: "",
          third_min_recharge_every_time: "",
          max_recharge_scan: "",
          min_recharge_scan: ""
          // create_at: ''
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
        if (v.url === 'limitCashSet') {
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
        this.getDataList();
      },
      success() {
        const vm = this;
        this.$message({
          message: '加载成功',
          type: 'success',
          duration: vm.duration
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: '加载失败',
          type: 'error',
          duration: vm.duration
        })
      },
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
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
        this.dialogFormTitle = "编辑配置项";
        this.isCreate = false;
        for (let i in vm.ruleForm) {
          vm.ruleForm[i] = item[i]
        }
        vm.editId = item._id;
      },
      editSetFn(formName) {
        const vm = this;
        let data = {};
        if (!vm.ruleForm.name) {
          this.$message({
            message: '请输入名称',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_withdraw_times_daily) {
          this.$message({
            message: '请输入每日次数(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_withdraw_times_daily)) {
          this.$message({
            message: '每日次数格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_withdraw_every_time) {
          this.$message({
            message: '请输入单笔上限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_withdraw_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_withdraw_every_time) {
          this.$message({
            message: '请输入单笔下限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_withdraw_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_withdraw_every_time > vm.ruleForm.max_withdraw_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_recharge_every_time) {
          this.$message({
            message: '请输入单笔上限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_recharge_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_recharge_every_time) {
          this.$message({
            message: '请输入单笔下限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_recharge_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_recharge_every_time > vm.ruleForm.max_recharge_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_recharge_scan) {
          this.$message({
            message: '请输入单笔上限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_recharge_scan)) {
          this.$message({
            message: '单笔上限格式不正确(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_recharge_scan) {
          this.$message({
            message: '请输入单笔下限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_recharge_scan)) {
          this.$message({
            message: '单笔下限格式不正确(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_recharge_scan > vm.ruleForm.max_recharge_scan) {
          this.$message({
            message: '单笔下限不得大于单笔上限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.third_max_recharge_every_time) {
          this.$message({
            message: '请输入单笔上限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.third_max_recharge_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.third_min_recharge_every_time) {
          this.$message({
            message: '请输入单笔下限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.third_min_recharge_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.third_min_recharge_every_time > vm.ruleForm.third_max_recharge_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        for (let i in vm.ruleForm) {
          data[i] = vm.ruleForm[i]
        }
        data.id = vm.editId;
        vm.edtiLoading = true;
        request.http(
          'post',
          '/pay/setting/update',
          data,
          (success) => {
            vm.edtiLoading = false;
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
            vm.edtiLoading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      createSet() {
        this.ruleForm = {
          name: '',
          max_withdraw_times_daily: '',
          max_withdraw_every_time: '',
          min_withdraw_every_time: '',
          max_recharge_every_time: '',
          min_recharge_every_time: '',
          third_max_recharge_every_time: '',
          third_min_recharge_every_time: "",
          max_recharge_scan: "",
          min_recharge_scan: ""
        }
        this.dialogFormVisible = true;
        this.dialogFormTitle = "新增配置项";
        this.isCreate = true;
      },
      createSetFn(formName) {
        const vm = this;
        let data = {};
        if (!vm.ruleForm.name) {
          this.$message({
            message: '请输入名称',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_withdraw_times_daily) {
          this.$message({
            message: '请输入每日次数(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_withdraw_times_daily)) {
          this.$message({
            message: '每日次数格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_withdraw_every_time) {
          this.$message({
            message: '请输入单笔上限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_withdraw_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_withdraw_every_time) {
          this.$message({
            message: '请输入单笔下限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_withdraw_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_withdraw_every_time > vm.ruleForm.max_withdraw_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(出款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_recharge_every_time) {
          this.$message({
            message: '请输入单笔上限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_recharge_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_recharge_every_time) {
          this.$message({
            message: '请输入单笔下限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_recharge_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_recharge_every_time > vm.ruleForm.max_recharge_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(公司入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.max_recharge_scan) {
          this.$message({
            message: '请输入单笔上限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.max_recharge_scan)) {
          this.$message({
            message: '单笔上限格式不正确(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.min_recharge_scan) {
          this.$message({
            message: '请输入单笔下限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.min_recharge_scan)) {
          this.$message({
            message: '单笔下限格式不正确(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.min_recharge_scan > vm.ruleForm.max_recharge_scan) {
          this.$message({
            message: '单笔下限不得大于单笔上限(扫码入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.third_max_recharge_every_time) {
          this.$message({
            message: '请输入单笔上限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.third_max_recharge_every_time)) {
          this.$message({
            message: '单笔上限格式不正确(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.ruleForm.third_min_recharge_every_time) {
          this.$message({
            message: '请输入单笔下限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!positiveDecimal(vm.ruleForm.third_min_recharge_every_time)) {
          this.$message({
            message: '单笔下限格式不正确(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.ruleForm.third_min_recharge_every_time > vm.ruleForm.third_max_recharge_every_time) {
          this.$message({
            message: '单笔下限不得大于单笔上限(第三方入款)',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        for (let i in vm.ruleForm) {
          if (i !== 'id') {
            data[i] = vm.ruleForm[i]
          }
        }
        vm.createLoading = true;
        request.http(
          'post',
          '/pay/setting/create',
          data,
          (success) => {
            vm.createLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.dialogFormVisible = false;
              vm.resetForm('ruleForm');
              vm.getDataList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.createLoading = false;
            vm.error();
            console.log(error)
          }
        )
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
        this.ruleForm = {
          name: '',
          max_withdraw_times_daily: '',
          max_withdraw_every_time: '',
          min_withdraw_every_time: '',
          max_recharge_every_time: '',
          min_recharge_every_time: '',
          third_max_recharge_every_time: '',
          third_min_recharge_every_time: "",
          max_recharge_scan: "",
          min_recharge_scan: ""
        }
        this.dialogFormVisible = false;
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getDataList();
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
<style scoped>
  /* @import '../../publicCss/header.css'; */

</style>
