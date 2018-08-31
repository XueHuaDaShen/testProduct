<template>
  <div>
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
        <!-- <el-button style="margin-left:.5rem;position:absolute;right:1rem;top:16px;" :plain="false" @click="createActivity" round
          type="success">添加公告</el-button> -->
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-btn">
            <el-button type="success" @click="createActivity" size="medium">添加公告</el-button>
          </div>
          <!-- <el-input style="width:15%;margin-left:15px;float:left;" v-model="username" placeholder="姓名"></el-input>
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            align="right"
            style="margin-left:15px;float:left;width:38%"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-input style="width:15%;margin-left:15px;float:left;" v-model="ip" placeholder="操作IP"></el-input>
          <el-input style="width:10%;margin-left:15px;float:left;" v-model="keywords" placeholder="关键词"></el-input>
          <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" stripe border style="width: 100%"
        max-height="450">
        <el-table-column align="center" prop="type" label="类型">
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>
        <el-table-column align="center" prop="content" label="内容">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editActivity(scope.row)" size="small">编辑</el-button>
            <el-button type="text" @click="deleteActivity(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <editor v-if="showEditor" @closeEditor="handlecloseEditor" :activityParam="activityParam"></editor>
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn';
  import editor from '../editor/editor';
  import moment from 'moment'
  export default {
    name: 'activityLog',
    components: {
      tableBtn,
      DialogUserInfo,
      editor
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '活动公告',
        routerArr: [{
          title: '活动公告',
          name: 'activityLog',
          checked: false
        }, ],
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
        total: 0,
        activityLogListData: [],
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
        ip: '',
        keywords: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
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
        if (v.url === 'activityLog') {
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
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
        // console.log(`当前页: ${val}`);
      },
      handlecloseEditor(val) {
        this.showEditor = val;
      },
      editActivity(item) {
        const vm = this;
        for (let i in vm.activityParam) {
          vm.activityParam[i] = item[i]
        }
        vm.activityParam.id = item._id;
        vm.activityParam.func = (param, load) => {
          load = true;
          request.http(
            'post',
            '/activity/update', {
              id: param.id,
              title: param.title,
              content: param.content,
              type: param.type || '1'
            },
            (success) => {
              // console.log('activityLogList--------',success);
              load = false
              let code = success.returncode;
              if (code === 200) {
                vm.getActivityLogList();
                vm.showEditor = false;
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm)
              } else {
                alert(success.returncode)
              }
            },
            (error) => {
              load = false;
              vm.error();
              console.log(error)
            }
          )
        }
        this.showEditor = true;
      },
      createActivity() {
        this.showEditor = true;
        const vm = this;
        for (let i in vm.activityParam) {
          vm.activityParam[i] = ''
        }
        vm.activityParam.func = (param, load) => {
          load = true;
          request.http(
            'post',
            '/activity/create', {
              title: param.title,
              content: param.content,
              type: param.type || '1'
            },
            (success) => {
              // console.log('activityLogList--------',success);
              load = false
              let code = success.returncode;
              if (code === 200) {
                vm.getActivityLogList();
                vm.showEditor = false;
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm)
              } else {
                alert(success.returncode)
              }
            },
            (error) => {
              load = false;
              vm.error();
              console.log(error)
            }
          )
        }

      },
      deleteActivity(item) {
        const vm = this;
        this.$alert('确定继续该操作吗', '温馨提示', {
          showCancelButton: true,
          center: true,
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/activity/delete', {
                  id: item._id
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
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
        let beginTime = '',
          endTime = '';
        if (vm.setTime !== '') {
          let beginTime = new Date(vm.searchTime[0]);
          let endTime = new Date(vm.searchTime[1]);
        }
        request.http(
          'get',
          '/activity/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize
          },
          (success) => {
            vm.loading = false;
            // console.log('activityLogList--------',success);
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
      handleReset() {
        this.username = '';
        this.searchTime = '';
        this.ip = '';
        this.keywords = '';
      },
      handleSearch() {
        // this.getActivityLogList();
        // console.log(this.username, this.searchTime, this.ip, this.keywords)
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
