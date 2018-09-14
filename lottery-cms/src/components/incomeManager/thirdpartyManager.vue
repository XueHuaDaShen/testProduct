<!-- 第三方渠道管理 -->
<template>
  <div class="wx-wrap el-custom">
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
            <label>状态：</label>
            <el-select clearable v-model="status.value" placeholder="状态" class="small">
              <el-option v-for="(item,index) in status.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createUsercount" size="medium" class="edit">新增第三方支付</el-button>
        </div>
      </div>
    </div>
    <!-- table S-->
    <div class="data-table" v-loading="loading">
      <el-table :data="usercountDataList" header-row-class-name="table-header" align="center" stripe border style="width: 100%;font-size:12px"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" label="名称" prop="name">
        </el-table-column>
        <el-table-column align="center" prop="system" label="支付系统">
        </el-table-column>
        <el-table-column align="center" label="支付方式" prop="method">
        </el-table-column>
        <el-table-column align="center" label="所属层级">
          <template slot-scope="scope">
            <ul v-if="scope.row.group && scope.row.group.length !=0">
              <li v-for="(item,index) in getCheckedGroup(scope.row)" :key="index">
                {{item.name}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="是否开启" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="elswitch.activeValue"
              :inactive-value="elswitch.inactiveValue" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="editUsercount(scope.row)" size="small" class="small edit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <!-- 新增第三方支付 S-->
    <el-dialog title="新增第三方支付" :before-close="closeCreate" :visible.sync="createDialog">
      <div class="body-top clearfix">
        <div class="top-row">
          <el-checkbox :indeterminate="createForm.group.isIndeterminate" v-model="createForm.group.checkAll" @change="handleCreateFormCheckAllChange">
            <span class="f16">
              会员等级
            </span>
          </el-checkbox>
        </div>
        <div class="top-row">
          <el-checkbox-group v-model="createForm.group.checked" @change="handleCreateFormCheckedChange">
            <el-checkbox v-for="(option,index) in updateForm.group.options" :label="option._id" :key="index">{{option.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">名称</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="createForm.name"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">支付系统</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="createForm.system"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">支付方式</span>
            <span class="exp-after">:</span>
            <!-- <el-select clearable v-model="createForm.type.value" placeholder="支付方式" class="small">
              <el-option v-for="(item,index) in createForm.type.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
            <el-input type="text" v-model.trim="createForm.type.value"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('createForm')" class="yes" :loading="createLoading">确 定</el-button>
          <el-button @click="closeCreate()" class="no">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 编辑第三方支付 S-->
    <el-dialog title="编辑第三方支付" :before-close="closeUpdate" :visible.sync="updateDialog">
      <div class="body-top clearfix">
        <div class="top-row">
          <el-checkbox :indeterminate="updateForm.group.isIndeterminate" v-model="updateForm.group.checkAll" @change="handleUpdateFormCheckAllChange">
            <span class="f16">
              会员等级
            </span>
          </el-checkbox>
        </div>
        <div class="top-row">
          <el-checkbox-group v-model="updateForm.group.checked" @change="handleUpdateFormCheckedChange">
            <el-checkbox v-for="(option,index) in updateForm.group.options" :label="option._id" :key="index">{{option.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="body-middle">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" class="demo-ruleForm">
          <el-form-item label="名称：" prop="name">
            <el-input type="text" v-model.trim="updateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="支付系统：" prop="system">
            <el-input type="text" v-model.trim="updateForm.system"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：" prop="type.value">
            <!-- <el-select clearable v-model="updateForm.type.value" placeholder="支付方式" class="small">
              <el-option v-for="(item,index) in updateForm.type.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
            <el-input type="text" v-model.trim="updateForm.type.value"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('updateForm')" class="yes" :loading="updateLoading">确 定</el-button>
          <el-button @click="closeUpdate()" class="no">取 消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  export default {
    name: "thirdpartyManager",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '第三方渠道',
        routerArr: [{
            title: '第三方渠道',
            name: 'thirdpartyManager',
            checked: false
          }, {
            title: '扫码管理',
            name: 'paymentWx',
            checked: false
          },
          {
            title: '银行卡管理',
            name: 'paymentBank',
            checked: false
          },
          {
            title: 'BWIN入款记录',
            name: 'rechargeLog',
            checked: false
          },
          {
            title: '第三方入款记录',
            name: 'thirdRechargeLog',
            checked: false
          },
          {
            title: '前端展示',
            name: 'tradeAccountLog',
            checked: false
          },
        ],
        createLoading: false,
        updateLoading: false,
        loading: false,
        opText: "",
        pageNum: 1,
        pageSize: 40,
        total: 0,
        userid: "",
        loginname: "",
        status: {
          value: '',
          options: [{
              label: '开启',
              value: 0
            },
            {
              label: '关闭',
              value: 1
            }
          ]
        },
        usercountDataList: [],
        createForm: {
          name: "",
          system: "",
          type: {
            value: "",
            // options: [{
            //     label: "网关PG",
            //     value: 4
            //   },
            //   {
            //     label: "银联扫码",
            //     value: 5
            //   },
            //   {
            //     label: "银联快捷",
            //     value: 6
            //   }
            // ]
          },
          group: {
            checkAll: false,
            checked: [],
            options: [],
            isIndeterminate: true
          }
        },
        updateForm: {
          id: "",
          name: "",
          system: "",
          type: {
            value: "",
            // options: [{
            //     label: "网关PG",
            //     value: 4
            //   },
            //   {
            //     label: "银联扫码",
            //     value: 5
            //   },
            //   {
            //     label: "银联快捷",
            //     value: 6
            //   }
            // ]
          },
          group: {
            checkAll: false,
            checked: [],
            options: [],
            isIndeterminate: true
          }
        },
        rules: {
          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],
          system: [{
            required: true,
            message: "请输入支付系统",
            trigger: "blur"
          }],
          'type.value': [{
            required: true,
            message: "请输入支付方式",
            trigger: "blur"
          }],
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
        },
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'thirdpartyManager') {
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
      this.getGroupList()
    },
    methods: {
      getCheckedGroup(row) {
        let finalGroup = [];
        if (row.group && row.group.length != 0) {
          let group = row.group;
          for (let i = 0; i < group.length; i++) {
            let o = group[i];
            if (o.is_deleted === 1) {
              continue;
            }
            finalGroup.push(o);
          }
        }
        return finalGroup;
      },
      // 获取层级
      getGroupList() {
        let vm = this;
        vm.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.loading = false;
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
                  /* for (let i = 0; i < options.length; i++) {
                    let typeArr = new Array();
                    let option = options[i];
                    typeArr.push(option.type);
                    option.type = typeArr;
                  } */
                  let optionsNew = [];
                  for (let i = 0; i < options.length; i++) {
                    let newOption = {};
                    newOption["name"] = options[i].name;
                    newOption["_id"] = options[i]._id;
                    optionsNew.push(newOption);
                  }
                  vm.createForm.group.options = optionsNew;
                  vm.updateForm.group.options = optionsNew;
                }
              } else {
                vm.loading = false;
              }
            }
          },
          error => {
            vm.loading = false;
          }
        );
      },
      getType(value) {
        switch (value) {
          case 1:
            return "微信";
          case 2:
            return "支付宝";
          case 3:
            return "银行卡";
          case 4:
            return "网关PG";
          case 5:
            return "银联扫码";
          case 6:
            return "银联快捷";
        }
      },
      handleCreateUploadChange(file, fileList) {
        // this.fileList3 = fileList.slice(-3);
        if (fileList.length > 1) {

        }
      },
      handleUpdateFormCheckAllChange(val) {
        let options = [];
        for (let i = 0; i < this.updateForm.group.options.length; i++) {
          options.push(this.updateForm.group.options[i]._id);
        }
        this.updateForm.group.checked = val ? options : [];
        this.updateForm.group.isIndeterminate = false;
      },
      handleUpdateFormCheckedChange(value) {
        let options = [];
        if (value.length != 0) {
          for (let i = 0; i < value.length; i++) {
            options.push(value[i]);
          }
        }
        this.updateForm.group.checked = options;
        let checkedCount = value.length ? value.length : 0;
        this.updateForm.group.checkAll = checkedCount === this.updateForm.group.options.length;
        this.updateForm.group.isIndeterminate = checkedCount > 0 && checkedCount < this.updateForm.group.options.length;
      },
      handleCreateFormCheckAllChange(val) {
        let options = [];
        for (let i = 0; i < this.createForm.group.options.length; i++) {
          options.push(this.createForm.group.options[i]._id);
        }
        this.createForm.group.checked = val ? options : [];
        this.createForm.group.isIndeterminate = false;
      },
      handleCreateFormCheckedChange(value) {
        let options = [];
        for (let i = 0; i < value.length; i++) {
          options.push(value[i]);
        }
        this.createForm.group.checked = options;
        let checkedCount = value.length;
        this.createForm.group.checkAll = checkedCount === this.createForm.group.options.length;
        this.createForm.group.isIndeterminate = checkedCount > 0 && checkedCount < this.createForm.group.options.length;
      },
      handleSearch() {
        this.pageNum = 1;
        this.getUsercountList();
      },
      handleReset() {
        this.status.value = '';
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
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("status", value.toString(), this.rowKey);
      },
      //是否开启
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/trade/account/update";
        data["id"] = id;
        data[key] = value;
        request.http(
          "post",
          url,
          data,
          success => {
            self.loading = false;
            let code = success.returncode;
            if (code === 200) {
              self.message("修改成功", "success");
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(self);
            }
          },
          error => {
            self.loading = false;
            self.message("修改失败", "error");
          }
        );
      },
      success() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration,
          center: true
        });
      },
      error() {
        const vm = this;
        this.$message({
          message: "加载失败",
          type: "error",
          duration: vm.duration,
          center: true
        });
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
            return "开启";
          case 1:
            return "关闭";
        }
      },
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "微信";
          case 2:
            return "支付宝";
          case 3:
            return "银行卡转账";
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getUsercountList();
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
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      editUsercount(row) {
        this.updateDialog = true;
        this.resetForm("updateForm");
        for (let i in this.updateForm) {
          if (i == "type") {
            this.updateForm[i].value = row["method"];
            continue;
          }
          if (i == "group") {
            let options = [];
            for (let i = 0; i < row["group"].length; i++) {
              if (row.group[i].is_deleted === 1) {
                continue;
              }
              options.push(row.group[i]._id);
            }
            this.updateForm.group.checked = options;
            this.updateForm.group.checkAll = this.updateForm.group.checked.length === this.updateForm.group.options.length;
            continue;
          }
          this.updateForm[i] = row[i];
        }
        this.updateForm.id = row._id;
      },
      createUsercount() {
        this.createDialog = true;
        this.resetForm("createForm");
      },
      createFn() {
        const vm = this;
        let data = {};
        data["group"] = vm.createForm.group.checked;
        data["name"] = vm.createForm.name;
        data["system"] = vm.createForm.system;
        data["method"] = vm.createForm.type.value;
        data["channel"] = 1;
        vm.createLoading = true;
        request.http(
          "post",
          "/trade/account/create",
          data,
          success => {
            let code = success.returncode;
            vm.createLoading = false;
            if (code === 200) {
              vm.createDialog = false;
              vm.resetForm("createForm");
              vm.getUsercountList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.createLoading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      updateFn() {
        const vm = this;
        let data = {};
        data["id"] = vm.updateForm.id;
        data["group"] = vm.updateForm.group.checked;
        data["name"] = vm.updateForm.name;
        data["system"] = vm.updateForm.system;
        data["method"] = vm.updateForm.type.value;
        data["channel"] = 1;
        vm.updateLoading = true;
        request.http(
          "post",
          "/trade/account/update",
          data,
          success => {
            vm.updateLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.updateDialog = false;
              vm.resetForm("updateForm");
              vm.getUsercountList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.updateLoading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      submitForm(formName) {
        const vm = this;
        if (vm[formName].group.checked.length == 0) {
          vm.message("至少选择一个层级", "error");
          return;
        }
        if (vm[formName].name === '') {
          vm.message("请输入名称", "error");
          return;
        }
        if (vm[formName].type.value === '') {
          vm.message("请选择支付方式", "error");
          return;
        }
        if (vm[formName].system === '') {
          vm.message("请输入支付系统", "error");
          return;
        }
        if (formName === "createForm") {
          vm.createFn();
        } else if (formName === "updateForm") {
          vm.updateFn();
        }
      },
      resetForm(formName) {
        this[formName].group.checked = [];
        this[formName].group.checkAll = false;
        this[formName].name = "";
        this[formName].type.value = "";
        this[formName].system = "";
        if (formName == "updateForm") {
          this.updateForm.id = "";
        }
      },
      getUsercountList() {
        const vm = this;
        request.http(
          "get",
          "/trade/account/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            channel: 1,
            status: vm.status.value
          },
          success => {
            vm.loading = false
            let code = success.returncode;
            if (code === 200) {
              vm.usercountDataList = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      closeCreate() {
        this.createDialog = false;
        this.resetForm('createForm');
      },
      closeUpdate() {
        this.updateDialog = false;
        this.resetForm('updateForm');
      }
    },
    mounted() {
      this.getUsercountList();
    }
  }

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .wx-wrap .el-form-item__content {
    text-align: left;
  }

  .wx-wrap {
    /* width: 70%; */
  }

</style>
