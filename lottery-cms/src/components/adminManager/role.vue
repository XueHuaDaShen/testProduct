<template>
  <div class="role-wrap el-custom">
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>角色名：</label>
            <el-input clearable v-model="roleName" placeholder="角色名" style="width:114px;"></el-input>
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
          <el-button type="success" @click="createRole" size="medium" class="edit">添加群组</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" align="left" stripe border style="width: 100%;font-size:12px;"
        max-height="450">
        <el-table-column prop="name" label="角色名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button @click="editRole(scope.row)" class="small edit">编辑</el-button> -->
            <el-button @click="updateMenu(scope.row)" class="small edit">菜单更新</el-button>
            <el-button @click="membersView(scope.row)" class="small no">查看成员</el-button>
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
    <el-dialog title="添加群组" :visible.sync="dialogFormVisible" @close="resetForm('form')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row form-top">
            <span class="exp">群组名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="form.name" clearable></el-input>
          </div>
          <div class="form-row form-top">
            <span class="exp">备注</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="form.message" clearable></el-input>
          </div>
          <div class="split-line"></div>
          <div class="form-row form-cen">
            <h2 class="form-cen-title">权限设置<span class="exp-after">:</span></h2>
            <div v-for="(item, index) in menuList" :key="index">
              <h2 class="form-cen-title">
                <el-checkbox v-model="checkedMenu[index].checkAll" @change="handleCheckAllChange($event, index)">{{item.menu_name}}</el-checkbox>
              </h2>
              <el-checkbox-group style="text-align:left" v-model="checkedMenu[index].data" @change="handleChangeRole($event, index)">
                <el-checkbox v-for="(menu, mi) in item.child" :key="mi" :label="menu._id">{{menu.menu_name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!-- <div class="form-row form-cen file-inner">
            <h2 class="form-cen-title">权限设置<span class="exp-after">:</span></h2>
            <el-checkbox-group style="text-align:left" v-model="form.checkList" @change="handleChangeRole">
              <el-checkbox v-for="(item, index) in menuList" :key="index" :label="item._id">{{item.menu_name}}</el-checkbox>
            </el-checkbox-group>
          </div> -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')" class="no">取 消</el-button>
        <el-button type="primary" @click="createRoleFn('form')" class="yes" :loading="createLoading">确 定</el-button>
        <!-- <el-button v-if="!isCreate" type="primary" @click="editRoleFn('form')" class="yes">确 定</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="菜单更新" :visible.sync="dialogFormVisible2" @close="resetForm('updateMenuForm')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row form-top">
            <span class="exp">群组名</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="updateMenuForm.name" disabled></el-input>
          </div>
          <div class="form-row form-top">
            <span class="exp">备注</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model.trim="updateMenuForm.message" clearable></el-input>
          </div>
          <div class="split-line"></div>
          <div class="form-row form-cen">
            <h2 class="form-cen-title">权限设置<span class="exp-after">:</span></h2>
            <div v-for="(item, index) in menuList" :key="index">
              <h2 class="form-cen-title">
                <el-checkbox v-model="checkedMenu[index].checkAll" @change="handleCheckAllChange($event, index)">{{item.menu_name}}</el-checkbox>
              </h2>
              <el-checkbox-group style="text-align:left" v-model="checkedMenu[index].data" @change="handleChangeRole($event, index)">
                <el-checkbox v-for="(menu, mi) in item.child" :key="mi" :label="menu._id">{{menu.menu_name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateMenuForm')" class="no">取 消</el-button>
        <el-button type="primary" @click="updateUserMenu('updateMenuForm')" class="yes" :loading="updateLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看成员" :visible.sync="dialogFormVisible3">
      <div class="body-middle">
        <div class="form">
          <el-table align="left" :data="membersData" empty-text="请添加成员">
            <el-table-column property="loginname" label="用户名"></el-table-column>
            <el-table-column property="is_forbid" label="状态" width="200">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.is_forbid" @change="handleChangeStatus(scope.row)" :active-value="0"
                  :inactive-value="1" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false" class="no">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible3 = false" class="yes">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment'
  export default {
    name: 'role',
    components: {
      tableBtn,
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        checkAll: false,
        createLoading: false,
        updateLoading: false,
        titleName: '群组列表',
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
        pageNum: 1,
        pageSize: 40,
        roleName: '',
        total: 0,
        activityLogListData: [],
        duration: 1000,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        membersData: [],
        form: {
          name: "",
          message: "",
          checkList: []
        },
        rules: {
          name: [{
            required: true,
            message: '角色名称',
            trigger: 'blur'
          }],
        },
        checkedMenu: [],
        menuList: [],
        updateMenuForm: {
          checkList: [],
          name: "",
          message: ""
        },
        updateMenuRules: {
          checkList: [{
            type: 'array',
            required: true,
            message: '请至少选择一个角色',
            trigger: 'change'
          }]
        },
        formLabelWidth: '120px',
        editId: '',
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
        if (v.url === 'role') {
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
      handleChangeRole(val, index) {
        // console.log(val)
        let checkedCount = val.length;
        this.checkedMenu[index].checkAll = checkedCount === this.menuList[index].child.length;
      },
      handleCheckAllChange(val, index) {
        this.checkedMenu[index].data = [];
        if (val) {
          this.menuList[index].child.filter(v => {
            this.checkedMenu[index].data.push(v._id);
          })
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getActivityLogList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
        // console.log(`当前页: ${val}`);
      },
      // 获取菜单列表
      getMenuDataList(type, row) {
        const vm = this;
        request.http(
          'get',
          '/auth/menu/list', {
            page: 1,
            size: 100
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.formatMenuData(success.data);
              if (type == 1) {
                vm.dialogFormVisible = true;
              } else if (type == 2) {
                vm.getSetedMenuList(row);
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
      // 格式化菜单列表
      formatMenuData(data) {
        const vm = this;
        vm.menuList = [];
        vm.checkedMenu = [];
        data.filter(v => {
          let o = new Object();
          vm.checkedMenu.push({
            data: [],
            checkAll: false
          })
          for (let i in v) {
            if (i === 'child') {
              o[i] = [];
            } else {
              o[i] = v[i];
            }
          }
          v.child.filter(k => {
            k.child.filter(m => {
              o.child.push(m);
            })
          })
          vm.menuList.push(o)
        })
      },
      //
      handleChangeStatus(row) {
        // console.log(row)
        const vm = this;
        request.http(
          'post',
          '/admin/enable', {
            id: row._id,
            is_forbid: row.is_forbid
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
      membersView(row) {
        const vm = this;
        vm.membersData = [];
        request.http(
          'get',
          '/admin/role/list', {
            id: row._id
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              success.data.filter(v => {
                vm.membersData.push(v.user_id)
              })
              vm.dialogFormVisible3 = true;
              // console.log(success)
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              // alert(success.returncode)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      updateMenu(row) {
        const vm = this;
        this.getMenuDataList(2, row);
        vm.updateMenuForm.checkList = [];
        vm.updateMenuForm.name = row.name
        vm.updateMenuForm.message = row.message;
        this.editId = row._id;
      },
      // 获取已经配置过的menu
      getSetedMenuList(row) {
        const vm = this;
        request.http(
          'get',
          '/auth/role/menu/list', {
            role_id: row._id
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              success.data.filter((v, vi) => {
                v.child.filter(k => {
                  k.child.filter(m => {
                    vm.checkedMenu[vi].data.push(m._id);
                  })
                })
                if (vm.checkedMenu[vi].data.length === vm.menuList[vi].child.length) {
                  vm.checkedMenu[vi].checkAll = true;
                }
              })
              // console.log(vm.checkedMenu)
              vm.dialogFormVisible2 = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 306) {
              vm.$message({
                message: '角色尚未配置菜单',
                type: 'warning',
                duration: vm.duration,
                center: true
              })
            } else if (code === 305) {
              vm.$message({
                message: '用户尚未配置到角色',
                type: 'warning',
                duration: vm.duration,
                center: true
              })
            } else if (code === 304) {
              vm.$message({
                message: '用户不存在',
                type: 'warning',
                duration: vm.duration,
                center: true
              })
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      updateUserMenu(formName) {
        const vm = this;
        let data = {};
        let ids = [];
        vm.checkedMenu.filter(v => {
          ids.push(...v.data)
        })
        data.ids = ids.join(',');
        data.message = vm.updateMenuForm.message;
        data.role_id = vm.editId;
        vm.updateLoading = true;
        request.http(
          'post',
          '/auth/role/menu/update',
          data,
          (success) => {
            vm.updateLoading = false;
            let code = success.returncode;
            if (code === 200) {
              // vm.getActivityLogList();
              vm.success();
              vm.resetForm(formName);
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.updateLoading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.dialogFormVisible2 = false;
        if (formName === "form") {
          for (let i in this[formName]) {
            if (i === "checkList") {
              this[formName].checkList = [];
              continue;
            }
            this[formName][i] = "";
          }
        }
      },
      editRole(item) {
        const vm = this;
        this.dialogFormVisible = true;
        this.isCreate = false;
        for (let i in vm.form) {
          vm.form[i] = item[i]
        }
        vm.editId = item._id;
      },
      editRoleFn(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          let data = {};
          for (let i in vm.form) {
            data[i] = vm.form[i]
          }
          data.id = vm.editId;
          if (valid) {
            request.http(
              'post',
              '/auth/role/update',
              data,
              (success) => {
                let code = success.returncode;
                if (code === 200) {
                  vm.getActivityLogList();
                  vm.success();
                  vm.resetForm('form');
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
      createRole() {
        this.form.name = "";
        this.form.message = "";
        this.form.checkList = [];
        this.getMenuDataList(1);
      },
      createRoleFn(formName) {
        const vm = this;
        let data = {};
        let ids = [];
        vm.checkedMenu.filter(v => {
          ids.push(...v.data)
        })
        data.ids = ids.join(',');
        data.name = vm.form.name;
        data.message = vm.form.message;
        vm.createLoading = true;
        request.http(
          'post',
          '/auth/role/create',
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
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/auth/role/list', {
            page: vm.pageNum,
            size: vm.pageSize,
            name: vm.roleName
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
        this.roleName = '';
        // this.searchTime = '';
        // this.ip = '';
        // this.keywords = '';
      },
    }
  }

</script>
<style lang="scss" scoped>
  .role-wrap {
    .form {
      padding: 0;

      div.split-line {
        width: 100%;
        height: 1px;
        background: #E6E6E6;
      }

      .form-top {
        padding: 0 68px;
      }

      .form-cen {
        padding: 0 30px;
        margin-top: 30px;
        position: relative;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        font-size: 12px;
        height: 377px;
        margin-bottom: 20px;
        overflow-y: auto;

        .form-cen-title {
          font-size: 16px;
          color: #191919;
          text-align: left;
          width: 100%;

          span.exp-after {
            font-weight: normal;
          }
        }

        >div {
          width: 100%;
          padding: 30px 0 10px 0;
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid #E6E6E6;
        }
      }
    }
  }

</style>

<style>
  /* @import '../../publicCss/header.css'; */

  .role-wrap .form .form-cen-title span.el-checkbox__label {
    font-size: 16px !important;
  }

  .role-wrap .form .el-checkbox__label {
    padding-left: 5px;
  }

  .role-wrap .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }

  .role-wrap .el-checkbox {
    margin-right: 30px;
    margin-bottom: 20px;
  }

</style>
