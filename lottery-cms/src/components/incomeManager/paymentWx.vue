<!-- 扫码支付管理 -->
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
          <el-button type="success" @click="createUsercount" size="medium" class="edit">新增扫码支付</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="usercountDataList" header-row-class-name="table-header" align="center" stripe border style="width: 100%;font-size: 12px;"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" label="名称" prop="name">
        </el-table-column>
        <el-table-column align="center" prop="method" label="支付方式">
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
        <el-table-column align="center" prop="account_no" label="微信账号">
        </el-table-column>
        <el-table-column align="center" prop="qr_code" label="收款二维码">
          <template slot-scope="scope">
            <img style="width:50px;height:50px;" :src="scope.row.qr_code">
          </template>
        </el-table-column>
        <el-table-column label="是否开启" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="elswitch.activeValue" :inactive-value="elswitch.inactiveValue"
              active-color="#2D996E" inactive-color="#C83A4C">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增扫码支付" :before-close="closeCreate" :visible.sync="createDialog">
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
            <el-input type="text" v-model="createForm.name"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">支付方式</span>
            <span class="exp-after">:</span>
            <el-select clearable v-model="createForm.type.value" placeholder="支付方式" class="small">
              <el-option v-for="(item,index) in createForm.type.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">账号名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="createForm.account_no"></el-input>
          </div>
          <div class="form-row file-inner">
            <span class="exp">二维码</span>
            <span class="exp-after">:</span>
            <el-upload class="upload-demo" :action="createForm.qr_code.action" :on-change="handleCreateUploadChange" :file-list="createForm.qr_code.filterList"
              :list-type="createForm.qr_code.listStyle" :limit="createForm.qr_code.limit" :auto-upload="false" :on-remove="handleCreateRemoveAc">
              <el-button size="small" class="small edit">上传</el-button>
            </el-upload>
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
    <el-dialog title="编辑扫码支付" :before-close="closeUpdate" :visible.sync="updateDialog">
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
        <div class="form">
          <div class="form-row">
            <span class="exp">名称</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="updateForm.name"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">支付方式</span>
            <span class="exp-after">:</span>
            <el-select clearable v-model="updateForm.type.value" placeholder="支付方式" class="small">
              <el-option v-for="(item,index) in updateForm.type.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">账号名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="updateForm.account_no"></el-input>
          </div>
          <div class="form-row file-inner">
            <span class="exp">二维码</span>
            <span class="exp-after">:</span>
            <el-upload class="upload-demo" :action="updateForm.qr_code.action" :on-change="handleUpdateUploadChange" :file-list="updateForm.qr_code.filterList"
              :list-type="updateForm.qr_code.listStyle" :limit="updateForm.qr_code.limit" :auto-upload="false" :on-remove="handleUpdateRemoveAc">
              <el-button size="small" class="small edit">上传</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('updateForm')" class="yes">确 定</el-button>
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
    name: "paymentWx",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '扫码管理',
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
            title: '入款记录',
            name: 'rechargeLog',
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
        pageSize: 10,
        total: 10,
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
          type: {
            value: "",
            options: [{
                label: "微信",
                value: "微信扫码"
              },
              {
                label: "支付宝",
                value: "支付宝扫码"
              }
            ]
          },
          group: {
            checkAll: false,
            checked: [],
            options: [],
            isIndeterminate: true
          },
          account_no: "",
          qr_code: {
            action: 'test',
            filterList: [],
            limit: 1,
            listStyle: 'picture',
            file: {},
            code_base64: ""
          },
        },
        updateForm: {
          id: "",
          name: "",
          type: {
            value: "",
            options: [{
                label: "微信",
                value: "微信扫码"
              },
              {
                label: "支付宝",
                value: "支付宝扫码"
              }
            ]
          },
          group: {
            checkAll: false,
            checked: [],
            options: [],
            isIndeterminate: true
          },
          account_no: "",
          qr_code: {
            action: 'test',
            filterList: [],
            limit: 1,
            listStyle: 'picture',
            file: {},
            code_base64: ""
          },
        },
        rules: {
          name: [{
            required: true,
            message: "用户名",
            trigger: "blur"
          }],
          account_no: [{
            required: true,
            message: "账号",
            trigger: "blur"
          }],
          qr_code: [{
            required: true,
            message: "二维码",
            trigger: "blur"
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
        if (v.url === 'paymentWx') {
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
      this.getGroupList();
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
        const vm = this;
        // console.log("file", file);
        // console.log("fileList", fileList);

        const isJPG = file.raw.type === 'image/jpeg';
        const isPNG = file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG || isPNG)) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
          this.createForm.qr_code.filterList = [];
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          this.createForm.qr_code.filterList = [];
          return false;
        }
        var r = new FileReader(); //本地预览
        r.onload = function () {
          vm.createForm.qr_code.code_base64 = r.result;
          // console.log(r.result)
        }
        r.readAsDataURL(file.raw);
        if (fileList.length > 1) {

        }
      },
      handleCreateRemoveAc(file, fileList) {
        // console.log("file", file);
        // console.log("fileList", fileList);
        if (fileList.length == 0) {
          this.createForm.qr_code.code_base64 = "";
        }
      },
      handleUpdateRemoveAc(file, fileList) {
        // console.log("file", file);
        // console.log("fileList", fileList);
        if (fileList.length == 0) {
          this.updateForm.qr_code.code_base64 = "";
        }
      },
      handleUpdateUploadChange(file, fileList) {
        // this.fileList3 = fileList.slice(-3);
        const vm = this;
        // console.log("file", file);
        // console.log("fileList", fileList);
        const isJPG = file.raw.type === 'image/jpeg';
        const isPNG = file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG || isPNG)) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
          this.updateForm.qr_code.filterList = [];
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          this.updateForm.qr_code.filterList = [];
          return false;
        }
        var r = new FileReader(); //本地预览
        r.onload = function () {
          vm.updateForm.qr_code.code_base64 = r.result;
          // console.log(r.result)
        }
        r.readAsDataURL(file.raw);
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
          if (i == "qr_code") {
            this.updateForm[i].filterList = [{
              name: "",
              url: row[i]
            }];
            this.updateForm[i].code_base64 = row[i];
            continue;
          }
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
        let data = {
          system: "bwin",
          channel: 2
        };
        for (let i in vm.createForm) {
          if (i === 'qr_code') {
            data.qr_code = vm.createForm.qr_code.code_base64;
          } else if (i === 'group') {
            data["group"] = vm.createForm.group.checked;
          } else if (i === 'type') {
            data["method"] = vm.createForm.type.value;
          } else {
            data[i] = vm.createForm[i];
          }
        }
        vm.createLoading = true;
        request.http(
          "post",
          "/trade/account/create",
          data,
          success => {
            vm.createLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.createDialog = false;
              vm.resetForm("updateForm");
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
        let data = {
          system: "bwin",
          channel: 2
        };
        for (let i in vm.updateForm) {
          if (i === 'qr_code') {
            data.qr_code = vm.updateForm.qr_code.code_base64;
          } else if (i === 'group') {
            data["group"] = vm.updateForm.group.checked;
          } else if (i === 'type') {
            data["method"] = vm.updateForm.type.value;
          } else {
            data[i] = vm.updateForm[i];
          }
        }
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
        if (vm[formName].qr_code.code_base64 === '') {
          vm.message("请选择二维码图片", "error");
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
        this[formName].qr_code.code_base64 = "";
        this[formName].qr_code.fileList = [];
        if (formName == "updateForm") {
          this.updateForm.id = "";
        }
      },
      getUsercountList() {
        const vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/trade/account/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            // type: [1, 2],
            status: vm.status.value,
            channel: 2,
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
        this.resetForm("createForm");
      },
      closeUpdate() {
        this.updateDialog = false;
        this.resetForm("updateForm");
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

</style>
