<template>
  <div class="el-custom">
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
        <!-- <el-button style="margin-left:.5rem;position:absolute;right:1rem;top:16px;" :plain="false" @click="createMenu" round
          type="success">添加菜单</el-button> -->
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createMenu('一', '')" size="medium" class="edit">添加一级菜单</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" fixed align="left" stripe border style="width: 100%;font-size:12px;">
        <el-table-column width="200" label="一级菜单" prop="menu_name">
          <template slot-scope="scope">
            <span>{{scope.row.menu_name}}</span>
            <el-button class="small my-add-button" @click="createMenu('二', scope.row._id)" icon="el-icon-plus" type="success"
              circle></el-button>
            <!-- <el-button @click="editMenu(scope.row)" class="small edit">编辑</el-button> -->
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" label="操作" prop="order">
          <template slot-scope="scope">
            <el-button @click="editMenu('一', scope.row)" class="small edit" style="padding:0 12px;">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="二级菜单">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- -->
              <el-table :data="props.row.child" :show-header="false" :default-expand-all="true">
                <el-table-column fixed prop="menu_name">
                  <template slot-scope="scope">
                    <span>{{scope.row.menu_name}}</span>
                    <el-button class="small my-add-button" @click="createMenu('三', scope.row._id)" icon="el-icon-plus"
                      type="success" circle></el-button>
                    <!-- <el-button @click="editMenu(scope.row)" class="small edit">编辑</el-button> -->
                  </template>
                </el-table-column>
                <el-table-column align="center" width="80" label="排序值" prop="order">
                  <template slot-scope="scope">
                    <el-button @click="editMenu('二', props.row, scope)" class="small edit" style="padding:0 12px;">编辑</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-table :data="props.row.child" :show-header="false">
                        <el-table-column fixed prop="menu_name">
                        </el-table-column>
                        <el-table-column prop="url">
                        </el-table-column>
                        <el-table-column width="180" align="center">
                          <template slot-scope="scope">
                            <el-button @click="editMenu('三', props.row, scope)" class="small edit" style="padding:0 12px;">编辑</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="fenye">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
        :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
    <el-dialog :title="operateTitle" :visible.sync="dialogFormVisible" @close="resetForm('form')">
      <div class="body-middle">
        <div class="form">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item :label="menu_type+'级菜单'" prop="menu_name">
              <el-input v-model.trim="form.menu_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
              <el-input v-model.number="form.order" @blur="()=>{!isNaN(form.order)&&(form.order = Math.floor(form.order))}"
                auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" prop="url" v-if="menu_type === '三'">
              <el-input v-model.trim="form.url" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')" class="no">取 消</el-button>
        <el-button v-if="isCreate" type="primary" @click="createMenuFn('form')" class="yes" :loading="createLoading">确
          定</el-button>
        <el-button v-if="!isCreate" type="primary" @click="editMenuFn('form')" class="yes" :loading="updateLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment'
  export default {
    name: 'my-menu',
    components: {
      tableBtn,
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        operateTitle: '',
        menu_type: '一', // 创建菜单的类型 一级，二级，三级
        parentId: '',
        createLoading: false,
        updateLoading: false,
        titleName: '设置项',
        routerArr: [{
          title: '设置项',
          name: 'menu',
          checked: false
        }, ],
        loading: false,
        isCreate: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        activityLogListData: [],
        duration: 1000,
        dialogFormVisible: false,
        form: {
          menu_name: '',
          order: '',
          url: ''
        },
        rules: {
          menu_name: [{
            required: true,
            message: '菜单名称',
            trigger: 'blur'
          }],
          order: [{
            required: true,
            message: '排序值必须为正整数',
            type: 'number',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: '菜单路径',
            trigger: 'blur'
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
        if (v.url === 'menu') {
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
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      editMenu(type, row, scope) {
        const vm = this;
        this.operateTitle = '修改菜单';
        let item;
        if (type === '一') {
          item = row;
        } else {
          item = row.child[scope.$index];
          vm.parentId = row._id;
        }
        this.menu_type = type;
        this.dialogFormVisible = true;
        this.isCreate = false;
        for (let i in vm.form) {
          vm.form[i] = item[i]
        }
        vm.editId = item._id;
      },
      editMenuFn(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          let data = {};
          for (let i in vm.form) {
            data[i] = vm.form[i]
          }
          if (this.menu_type === '二' || this.menu_type === '三') {
            data.parentid = vm.parentId;
          }
          data.id = vm.editId;
          if (valid) {
            vm.updateLoading = true;
            request.http(
              'post',
              '/auth/menu/update',
              data,
              (success) => {
                vm.updateLoading = false;
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
                vm.updateLoading = false;
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
      createMenu(type, id) {
        this.operateTitle = '添加菜单';
        this.menu_type = type;
        this.parentId = id;
        this.form = {
          menu_name: '',
          order: '',
          url: ''
        }
        this.dialogFormVisible = true;
        this.isCreate = true;
      },
      createMenuFn(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          let data = {};
          for (let i in vm.form) {
            data[i] = vm.form[i]
          }
          if (this.menu_type === '二' || this.menu_type === '三') {
            data.parentid = this.parentId;
          }
          if (valid) {
            vm.createLoading = true;
            request.http(
              'post',
              '/auth/menu/create',
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
                } else if (code === 302) {
                  this.$alert('菜单已存在', '系统提示', {
                    confirmButtonText: '确定',
                    callback: action => {}
                  });
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/auth/menu/list', {
            page: vm.pageNum,
            size: vm.pageSize
          },
          (success) => {
            vm.loading = false;
            // console.log('activityLogList--------',success);
            let code = success.returncode;
            if (code === 200) {
              vm.activityLogListData = success.data;
              // vm.pageNum = Number(success.data.page);
              // vm.total = success.data.total;
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
      }
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */
  .my-add-button {
    padding: 0 !important;
    width: 24px !important;
    position: absolute;
    right: 10px;
    background: #2D996E !important;
  }

</style>
