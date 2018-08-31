<template>
  <div class="admin-wrap el-custom">
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>用户名:</label>
            <el-input clearable v-model="adminName" placeholder="用户名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>群组：</label>
            <el-select clearable v-model="group.value" placeholder="选择" class="small" @focus="groupFocus()" :loading="group.loading"
              :loading-text="group.loadingText">
              <el-option v-for="item in group.options" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status.value" placeholder="选择" class="small">
              <el-option v-for="item in status.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createAdmin" size="medium" class="edit">添加后台用户</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" align="left" stripe border style="width: 100%;font-size:12px;" max-height="450">
        <el-table-column width="180" prop="loginname" label="用户名">
        </el-table-column>
        <el-table-column width="180" label="群组">
          <template slot-scope="scope">
            {{formatRole(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="create_at" :formatter="formatTime" width="180" label="添加时间">
        </el-table-column>
        <el-table-column :formatter="formatTime" width="180" label="上次登录时间">
          <template slot-scope="scope">
            {{formatTime2(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="handleChangeStatus(scope.row)" :active-value="0"
              :inactive-value="1" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="备注">
        </el-table-column>
        <el-table-column width="240" label="操作">
          <template slot-scope="scope">
            <el-row class="tr">
              <el-button @click="editPwd(scope.row)" class="small edit">修改密码</el-button>
              <el-button @click="updateRole(scope.row)" class="small edit">修改群组</el-button>
              <!-- <el-button @click="operateHistory(scope.row)" class="small no">操作记录</el-button> -->
            </el-row>
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
    <el-dialog title="添加后台用户" :visible.sync="dialogFormVisible" @close="resetForm('form')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">用户名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="form.loginname" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="form.pw" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">群组</span>
            <span class="exp-after">:</span>
            <el-select clearable v-model="form.willCheck" placeholder="选择" class="small">
              <el-option v-for="item in roleList" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">备注</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="form.message" clearable></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')" class="no">取 消</el-button>
        <el-button type="primary" @click="createAdminFn('form')" class="yes" :loading="createLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改群组" :visible.sync="dialogFormVisible2" @close="resetForm('updateRoleForm')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">用户名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="updateRoleForm.loginname" disabled></el-input>
          </div>
          <div class="form-row">
            <span class="exp">原群组</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="updateRoleForm.checked" disabled></el-input>
          </div>
          <div class="form-row">
            <span class="exp">新群组</span>
            <span class="exp-after">:</span>
            <el-select clearable v-model="updateRoleForm.willCheck" placeholder="选择" class="small">
              <el-option v-for="item in roleList" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateRoleForm')" class="no">取 消</el-button>
        <el-button type="primary" @click="updateUserRole('updateRoleForm')" class="yes" :loading="groupLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="操作记录" :visible.sync="dialogFormVisible3">
      <el-form ref="historyForm">
        <el-table align="left" :data="historyData" empty-text="暂无记录">
          <el-table-column property="adminname" label="用户名"></el-table-column>
          <el-table-column property="op" label="操作名称"></el-table-column>
          <el-table-column property="url" label="操作路径"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible4" @close="resetForm('pwdForm')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">用户名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="pwdForm.loginname" disabled></el-input>
          </div>
          <div class="form-row">
            <span class="exp">旧密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="pwdForm.oldpw" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">新密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="pwdForm.newpw" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">确认密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="pwdForm.checkPass" clearable></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pwdForm')" class="no">取 消</el-button>
        <el-button type="primary" @click="editPwdFn('pwdForm')" class="yes" :loading="psdLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js';
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment';
  import MD5 from 'MD5';
  import {
    trim,
    regexpPsd,
    regexpInput,
    email
  } from "../../lib/utils/validator";
  export default {
    name: 'admin',
    components: {
      tableBtn,
    },
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwdForm.newpw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        index1: 0,
        index2: 0,
        createLoading: false,
        groupLoading: false,
        psdLoading: false,
        titleName: '用户列表',
        routerArr: [{
            title: '用户列表',
            name: 'admin',
            checked: false
          },
          {
            title: '群组列表',
            name: 'role',
            checked: false
          }
        ],
        loading: false,
        isCreate: false,
        adminName: '',
        group: {
          options: [],
          value: "",
          loading: false,
          loadingText: "正在加载..."
        },
        status: {
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "启用",
              value: "0"
            },
            {
              label: "禁用",
              value: "1"
            },
          ],
          value: ""
        },
        pageNum: 1,
        pageSize: 40,
        total: 0,
        activityLogListData: [],
        duration: 1000,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        historyData: [],
        md5Random: '',
        pwdForm: {
          loginname: '',
          loginid: '',
          oldpw: '',
          newpw: '',
          checkPass: ''
        },
        pwdrules: {
          loginname: [{
            required: true,
            message: '管理员名称',
            trigger: 'blur'
          }],
          loginid: [{
            required: true,
            message: '管理员电话',
            trigger: 'blur'
          }],
          oldpw: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }],
          newpw: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur',
            required: true
          }],
        },
        form: {
          loginname: '',
          phone: ''
        },
        rules: {
          loginname: [{
            required: true,
            message: '管理员名称',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '管理员电话',
            trigger: 'blur'
          }]
        },
        updateRoleForm: {
          loginname: "",
          checked: "",
          willCheck: ""
        },
        updateRoleRules: {
          checkList: [{
            type: 'array',
            required: true,
            message: '请至少选择一个角色',
            trigger: 'change'
          }]
        },
        formLabelWidth: '120px',
        editId: '',
        testUser: [{
            value: "",
            label: "全显示"
          }, {
            value: "0",
            label: "不显示"
          },
          {
            value: "1",
            label: "仅显示"
          }
        ],
        is_test: '',
        roleList: [],
        checkList: []
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
        if (v.url === 'admin') {
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
      this.getActivityLogList();
    },
    methods: {
      formatRole(row) {
        if (row.role_id && row.role_id.role_id && row.role_id.role_id.name) {
          return row.role_id.role_id.name;
        }
        return "--"
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
        }
        return "--"
      },
      formatTime2(row) {
        if (row.log && row.log.create_at) {
          return moment(row.log.create_at).format("YYYY-MM-DD HH:mm:ss");
        }
        return "--"
      },
      handleChangeRouter(name) {
        console.log(name)
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
        this.pageSize = val;
        this.getActivityLogList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
        console.log(`当前页: ${val}`);
      },
      handleChangeStatus(row) {
        // console.log(row)
        const vm = this;
        request.http(
          'post',
          '/admin/enable', {
            id: row._id,
            status: row.status.toString()
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              // vm.getActivityLogList();
              vm.success();
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
      handleChangeRole(val) {
        // console.log(val)
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.dialogFormVisible2 = false;
        this.dialogFormVisible4 = false;
        for (let i in this[formName]) {
          this[formName][i] = "";
        }
      },
      editPwd(row) {
        const vm = this;
        this.pwdForm.loginname = row.loginname;
        this.pwdForm.loginid = row._id;
        this.pwdForm.oldpw = '';
        this.pwdForm.newpw = '';
        this.pwdForm.checkPass = '';
        this.dialogFormVisible4 = true;
        request.login(
          'post',
          '/admin/random', {
            loginname: row.loginname
          },
          (success) => {
            if (success.returncode == '200') {
              vm.md5Random = success.data.random;
            }
            // console.log('/user/random---success', success)
          },
          (error) => {
            vm.error();
            // vm.loading = false;
            console.log('/user/random---error', error)
          }
        )
      },
      editPwdFn(formName) {
        const vm = this;
        if (!vm.pwdForm.oldpw) {
          this.$message({
            message: '请输入旧密码',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!regexpPsd(vm.pwdForm.oldpw)) {
          this.$message({
            message: '旧密码格式不规范',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.pwdForm.newpw) {
          this.$message({
            message: '请输入新密码',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!regexpPsd(vm.pwdForm.newpw)) {
          this.$message({
            message: '新密码格式不规范',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm.pwdForm.checkPass) {
          this.$message({
            message: '请输入确认密码',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!regexpPsd(vm.pwdForm.checkPass)) {
          this.$message({
            message: '确认密码格式不规范',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (vm.pwdForm.newpw != vm.pwdForm.checkPass) {
          this.$message({
            message: '两次新密码不一致',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        let data = {};
        data.oldpw = CryptoJS.HmacMD5(CryptoJS.MD5(vm[formName].oldpw).toString(), vm.md5Random).toString()
        data.newpw = MD5(vm[formName].newpw);
        data.loginname = vm[formName].loginname;
        data.loginid = vm[formName].loginid;
        vm.psdLoading = true;
        request.http(
          'post',
          '/admin/change/pw',
          data,
          (success) => {
            vm.psdLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.success();
              vm.resetForm(formName);
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.psdLoading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      operateHistory(row) {
        const vm = this;
        request.http(
          'get',
          '/auth/request/list', {
            adminname: row.loginname
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              success.data.filter(v => {
                vm.historyData.push(v)
              })
              vm.dialogFormVisible3 = true;
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
      getRoleDataList(type) {
        const vm = this;
        request.http(
          'get',
          '/auth/role/list', {
            page: 1,
            size: 100
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.roleList = success.data.data;
              if (type == 1) {
                vm.dialogFormVisible = true;
              } else if (type == 2) {
                vm.dialogFormVisible2 = true;
              }
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
      updateRole(row) {
        const vm = this;
        vm.updateRoleForm.loginname = row.loginname;
        this.getRoleDataList(2);
        vm.updateRoleForm.checked = "";
        this.editId = row._id;
        // return false
        request.http(
          'get',
          '/auth/role/user/list', {
            user_id: row._id
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              // success.data.filter(v => {
              //   vm.updateRoleForm.checkList.push(v._id)
              // })
              vm.updateRoleForm.checked = success.data[0].name;
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
      updateUserRole(formName) {
        const vm = this;
        let data = {};
        if (!vm.updateRoleForm.willCheck) {
          this.$message({
            message: '请选择新群组',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        // data.ids = vm.updateRoleForm.checkList.join(',')
        data.ids = vm.updateRoleForm.willCheck;
        data.user_id = vm.editId;
        vm.groupLoading = true;
        request.http(
          'post',
          '/auth/role/user/update',
          data,
          (success) => {
            vm.groupLoading = false;
            let code = success.returncode;
            if (code === 200) {
              // vm.getActivityLogList();
              vm.success();
              vm.resetForm(formName);
              vm.getActivityLogList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.groupLoading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      createAdmin() {
        this.form = {
          loginname: "",
          pw: "",
          willCheck: "",
          message: ""
        }
        this.getRoleDataList(1);
        // this.dialogFormVisible = true;
      },
      createAdminFn(formName) {
        const vm = this;
        let data = {};
        if (!vm[formName].loginname) {
          this.$message({
            message: '请填写用户名',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!email(vm[formName].loginname)) {
          this.$message({
            message: '用户名必须为邮箱',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm[formName].pw) {
          this.$message({
            message: '请填写密码',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!regexpPsd(vm[formName].pw)) {
          this.$message({
            message: '密码格式不规范',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm[formName].willCheck) {
          this.$message({
            message: '请选择群组',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!vm[formName].message) {
          this.$message({
            message: '请填写备注',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        data.loginname = vm[formName].loginname;
        data.password = MD5(vm[formName].pw);
        data.role_id = vm[formName].willCheck;
        data.message = vm[formName].message;
        vm.createLoading = true;
        request.http(
          'post',
          '/admin/create',
          data,
          (success) => {
            vm.createLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.getActivityLogList();
              vm.success();
              vm.resetForm('form');
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 303 || code === 303) {
              vm.$message({
                message: '用户名已存在',
                type: 'error',
                duration: vm.duration,
                center: true
              })
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
      groupFocus() {
        if (this.group.options.length != 0) {
          return;
        }
        const vm = this;
        vm.group.loading = true;
        request.http(
          'get',
          '/auth/role/list', {
            page: 1,
            size: 1000000,
          },
          (success) => {
            vm.group.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.group.options = success.data.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.group.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/admin/list', {
            page: vm.pageNum,
            size: vm.pageSize,
            loginname: trim(vm.adminName),
            status: vm.status.value,
            role: vm.group.value
          },
          (success) => {
            vm.loading = false;
            // console.log('activityLogList--------',success);
            let code = success.returncode;
            if (code === 200) {
              vm.activityLogListData = success.data.data;
              vm.pageNum = Number(success.data.page);
              vm.total = success.data.total;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleSearch() {
        this.getActivityLogList();
        // console.log(this.username, this.searchTime, this.ip, this.keywords)
      },
      handleReset() {
        this.adminName = "";
        this.group.value = "";
        this.status.value = "";
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .admin-wrap .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }

  .admin-wrap .el-checkbox {
    margin-right: 30px;
  }

  .tr {
    text-align: right
  }

</style>
