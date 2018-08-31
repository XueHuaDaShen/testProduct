<!-- 支付宝 -->
<template>
  <div class="ali-wrap">
    <DialogUserInfo v-if="dialog" :userid="userid" :loginname="loginname" @sendDiglogShow="handleDialogShow"
      @closeDialog="handleCloseDialog"></DialogUserInfo>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
        <!-- <el-button style="margin-left:.5rem;position:absolute;right:1rem;top:16px;" :plain="false" @click="createUsercount" round
          type="success">新增账户</el-button> -->
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-btn">
            <el-button type="success" @click="createUsercount" size="medium">新增账户</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="usercountDataList" header-row-class-name="table-header" stripe border style="width: 100%"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="account_no" label="支付宝账号">
        </el-table-column>
        <el-table-column align="center" prop="qr_code" label="收款二维码">
        </el-table-column>
        <el-table-column label="是否开启" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="elswitch.activeValue"
              :inactive-value="elswitch.inactiveValue">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editUsercount(scope.row)" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增账户" :before-close="closeCreate" :visible.sync="createDialog">
      <el-form :model="createForm" :rules="rules" ref="createForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号" prop="account_no">
          <el-input type="text" v-model="createForm.account_no"></el-input>
        </el-form-item>
        <el-form-item label="收款二维码" prop="qr_code">
          <el-input type="text" v-model="createForm.qr_code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('createForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('createForm')">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog title="修改账户" :before-close="closeUpdate" :visible.sync="updateDialog">
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号" prop="account_no">
          <el-input type="text" v-model="updateForm.account_no"></el-input>
        </el-form-item>
        <el-form-item label="收款二维码" prop="qr_code">
          <el-input type="text" v-model="updateForm.qr_code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('updateForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('updateForm')">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  export default {
    name: 'paymentAli',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '收款账户-支付宝',
        routerArr: [{
            title: '收款账户-微信',
            name: 'paymentWx',
            checked: false
          },
          {
            title: '收款账户-支付宝',
            name: 'paymentAli',
            checked: false
          },
          {
            title: '收款账户-银行卡',
            name: 'paymentBank',
            checked: false
          },
        ],
        loading: false,
        opText: '',
        pageNum: 1,
        pageSize: 40,
        total: 0,
        userid: '',
        loginname: '',
        usercountDataList: [],
        createForm: {
          name: '',
          account_no: '',
          qr_code: '',
          type: 2
        },
        updateForm: {
          id: '',
          name: '',
          account_no: '',
          qr_code: '',
        },
        rules: {
          name: [{
            required: true,
            message: '用户名',
            trigger: 'blur'
          }],
          account_no: [{
            required: true,
            message: '账号',
            trigger: 'blur'
          }],
          qr_code: [{
            required: true,
            message: '二维码',
            trigger: 'blur'
          }]
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        createDialog: false,
        updateDialog: false,
        rowKey: "",
        elswitch: {
          activeValue: 0,
          inactiveValue: 1
        }
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
        if (v.url === 'paymentAli') {
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
      this.getUsercountList();
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
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("status", value, this.rowKey);
      },
      //玩法修改
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/trade/account/update";
        data['id'] = id;
        data[key] = value;
        request.http('post', url, data, (success) => {
          self.loading = false;
          let code = success.returncode;
          if (code === 200) {
            self.message('修改成功', 'success');
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(self)
          }
        }, (error) => {
          self.loading = false;
          self.message('修改失败', 'error');
        })
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
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        });
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '开启';
          case 1:
            return '关闭';
        }
      },
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return '支付宝';
          case 2:
            return '支付宝';
          case 3:
            return '银行卡转账';
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getUsercountList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        // this.dialog = true;
        // this.userid = row._id;
        // this.loginname = row.name;
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
      editUsercount(row) {
        this.updateDialog = true;
        this.opText = '编辑';
        for (let i in this.updateForm) {
          this.updateForm[i] = row[i]
        }
        this.updateForm.id = row._id
      },
      createUsercount() {
        this.createDialog = true;
        this.opText = '新增';
      },
      createFn() {
        const vm = this;
        request.http(
          'post',
          '/trade/account/create',
          vm.createForm,
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.createDialog = false;
              vm.getUsercountList();
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
      },
      updateFn() {
        const vm = this;
        request.http(
          'post',
          '/trade/account/update',
          vm.updateForm,
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.updateDialog = false;
              vm.getUsercountList();
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
      },
      submitForm(formName) {
        const vm = this;
        // console.log(1)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'createForm') {
              vm.createFn();
            } else if (formName === 'updateForm') {
              vm.updateFn();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.updateDialog = false;
        this.createDialog = false;
        this.$refs[formName].resetFields();
      },
      getUsercountList() {
        const vm = this;
        request.http(
          'get',
          '/trade/account/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            type: 2
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.usercountDataList = success.data;
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
      closeCreate() {
        this.createDialog = false;
        this.$refs['createForm'].resetFields();
      },
      closeUpdate() {
        this.updateDialog = false;
        this.$refs['updateForm'].resetFields();
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .ali-wrap .el-form-item__content {
    text-align: left;
  }

  .ali-wrap {
    width: 70%
  }

</style>
