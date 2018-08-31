<template>
  <div>
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
        </div> -->
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="tradeLogListData" header-row-class-name="table-header" stripe border style="width: 100%">
        <el-table-column width="180" prop="name" align="center" label="类型">
        </el-table-column>
        <el-table-column align="left" label="打码量">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.indicator" @change="handelChangeIndicator(scope.row)" :label="-1">默认</el-radio>
            <el-radio v-model="scope.row.indicator" :label="2">自定义</el-radio>
            <el-input v-if="scope.row.showInput = scope.row.indicator===2" @blur="handleBlur(scope.row)" v-model="scope.row.myValue"
              type="number" min='0.1' style="width:20%;margin-right:30px;" placeholder="请输入内容"></el-input>
            <el-radio v-model="scope.row.indicator" @change="handelChangeIndicator(scope.row)" :label="0">无打码</el-radio>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn';
  // import moment from 'moment'
  export default {
    name: 'tradeLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '交易设置',
        routerArr: [{
          title: '交易设置',
          name: 'tradeLog',
          checked: false
        }, ],
        loading: false,
        showEditor: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        tradeLogListData: [],
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        indicator: 0,
        editIndicator: 0
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
        if (v.url === 'tradeLog') {
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
      this.getTradeLogList();
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
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getTradeLogList();
        // console.log(`当前页: ${val}`);
      },
      handlecloseEditor(val) {
        this.showEditor = val;
      },
      handelChangeIndicator(row) {
        let id = row._id;
        let num = row.indicator || 0;
        this.resetIndicator(id, num)
        // console.log(num)
      },
      handleBlur(row) {
        let id = row._id;
        let num = row.myValue;
        let next = row.showInput;
        if (next) {
          if (Number(num) <= 0) {
            return false;
          } else {
            this.resetIndicator(id, num)
          }
        }
        // console.log(row)
        // console.log(row.indicator)
      },
      initData(data) {
        const vm = this;
        this.tradeLogListData = [];
        data.filter(v => {
          let o = v;
          o.myValue = v.indicator ? (v.indicator > 0 ? v.indicator : 1) : 1;
          if (v.indicator !== undefined) {
            if (v.indicator === -1) {
              o.indicator = -1;
            } else if (v.indicator === 0) {
              o.indicator = 0;
            } else {
              o.indicator = 2;
            }
          } else {
            o.indicator = 0;
          }
          o.showInput = false;
          vm.tradeLogListData.push(o);
        })
        // console.log(this.tradeLogListData)
      },
      getTradeLogList() {
        const vm = this;
        request.http(
          'get',
          '/trade/type/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize
          },
          (success) => {
            vm.loading = false;
            // console.log('tradeLogList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.initData(success.data)
              // vm.tradeLogListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
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
      resetIndicator(id, num) {
        const vm = this;
        request.http(
          'post',
          '/trade/type/update', {
            id: id,
            indicator: num
          },
          (success) => {
            // vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
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

</style>
