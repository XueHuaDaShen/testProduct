<template>
  <div class="el-custom">
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
            <label>展现状态：</label>
            <el-select clearable v-model="enabled.value" placeholder="展现状态" class="small">
              <el-option v-for="item in enabled.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>活动状态：</label>
            <el-select clearable v-model="activityStatus.value" placeholder="活动状态" class="small">
              <el-option v-for="item in activityStatus.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" class="small yes">搜索</el-button>
            <el-button @click="handleReset" class="small no">重置</el-button>
          </div>
        </div> -->
      </div>
    </div>
    <!-- <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="openDialog()" size="medium">添加活动</el-button>
        </div>
      </div>
    </div> -->
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450">
        <el-table-column align="center" prop="name" label="项目">
        </el-table-column>
        <el-table-column align="center" prop="url" label="网址">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="更新时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="editForm(scope.row)" class="small edit">修改</el-button>
            <!-- <el-button type="text" @click="deleteActivity(scope.row)" size="small">删除</el-button> -->
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
    <!-- 新增 S-->
    <el-dialog :title="formTitle" :before-close="closeForm" :visible.sync="formVisible">
      <div class="body-middle">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="链接名称：" prop="name">
            <el-input type="text" v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="链接地址：" prop="url">
            <el-input type="text" v-model.trim="form.url"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-show="formCreate">
          <el-button type="primary" @click="createActivity('form')" class="yes">确 定</el-button>
          <el-button @click="closeForm()" class="no">取 消</el-button>
        </div>
        <div v-show="!formCreate">
          <el-button type="primary" @click="editActivity()" class="yes">确 定</el-button>
          <!-- <el-button @click="deleteActivity()" class="no">删 除</el-button> -->
          <el-button @click="closeForm()" class="no">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增 END -->
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn';
  import moment from 'moment'
  const groupOptions = [{
    key: "未分级",
    value: 1
  }, {
    key: "VIP1",
    value: 2
  }, {
    key: "VIP2",
    value: 3
  }, {
    key: "VIP3",
    value: 4
  }];
  const groupValueOptions = [1, 2, 3, 4];
  export default {
    name: 'linkManager',
    components: {
      tableBtn,
      DialogUserInfo,
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '链接管理',
        routerArr: [{
          title: '链接管理',
          name: 'linkManager',
          checked: false
        }],
        id: "", // 编辑的link的id
        loading: false,
        showEditor: false,
        activityParam: {
          title: '', // 活动标题
          content: '', // 互动内容
          type: '1', // 活动类型
          func: null, // 活动函数
        },
        pageNum: 1,
        pageSize: 40,
        enabled: {
          value: "",
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "已上架",
              value: 1
            },
            {
              label: "未上架",
              value: 0
            },
          ]
        },
        activityStatus: {
          value: "",
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "未开始",
              value: 0
            },
            {
              label: "进行中",
              value: 1
            },
            {
              label: "已结束",
              value: 2
            },
          ]
        },
        formTitle: "新增链接",
        formCreate: true,
        total: 0,
        activityLogListData: [],
        ip: '',
        keywords: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        // 用于 新增和编辑的form
        form: {
          name: "",
          url: ""
        },
        editor: null,
        editorContent: '',
        formVisible: false,
        rules: {
          name: [{
            required: true,
            message: '请输入链接名称',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: '请输入链接地址',
            trigger: 'blur'
          }]
        },
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
        if (v.url === 'linkManager') {
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
      resetForm(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
      },
      handleFormCheckAllChange(val) {
        this.form.group.checked = val ? groupValueOptions : [];
        this.form.group.isIndeterminate = false;
      },
      handleFormCheckedChange(value) {
        this.form.group.checked = value;
        let checkedCount = value.length;
        this.form.group.checkAll = checkedCount === this.form.group.options.length;
        this.form.group.isIndeterminate = checkedCount > 0 && checkedCount < this.form.group.options.length;
      },
      closeForm() {
        this.formVisible = false
        this.resetForm('form');
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
      handlecloseEditor(val) {
        this.showEditor = val;
      },
      editActivity() {
        const vm = this;
        vm.$refs['form'].validate(valid => {
          if (valid) {
            vm.loading = true;
            request.http(
              'post',
              '/link/update', {
                id: vm.id,
                name: vm.form.name,
                url: vm.form.url
              },
              (success) => {
                vm.loading = false
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.getActivityLogList();
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
        })
      },
      openDialog() {
        // this.showEditor = true;
        this.formVisible = true;
        this.formCreate = true;
        this.resetForm('form');
        this.formTitle = "新增链接";
      },
      editForm(item) {
        this.formCreate = false;
        this.formVisible = true;
        this.resetForm('form');
        this.formTitle = "编辑链接";
        for (let i in this.form) {
          this.form[i] = item[i]
        }
        this.id = item._id;
      },
      deleteActivity() {
        const vm = this;
        this.$alert('确定继续该操作吗', '温馨提示', {
          showCancelButton: true,
          center: true,
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/link/delete', {
                  id: vm.id
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.resetForm("form");
                    vm.formVisible = false;
                    vm.getActivityLogList();
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
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/link/list', {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.activityLogListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
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
      createActivity(formName) {
        const vm = this;
        vm.$refs[formName].validate(valid => {
          if (valid) {
            vm.loading = true;
            request.http(
              'post',
              '/link/create', {
                name: vm.form.name,
                url: vm.form.url,
              },
              (success) => {
                vm.loading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.getActivityLogList();
                  // vm.showEditor = false;
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.loading = true;
                vm.error();
                console.log(error)
              }
            )
          } else {
            console.log("error submit!!");
            return false;
          }
        })
      },
      handleReset() {
        this.username = '';
        this.searchTime = '';
        this.ip = '';
        this.keywords = '';
      },
      handleSearch() {
        this.getActivityLogList();
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
