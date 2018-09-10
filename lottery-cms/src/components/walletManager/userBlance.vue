<template>
  <div class="rechargeLot-wrap el-custom">
    <DialogUserInfo v-if="dialog" :loginname="loginname" :userid="userid" @sendDiglogShow="handleDialogShow"
      @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>用户名：</label>
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>排序栏：</label>
            <el-select clearable v-model="order" placeholder="请选择" class="small">
              <el-option v-for="item in orderArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>顺序</label>
            <el-select clearable v-model="desc" placeholder="请选择" class="small">
              <el-option v-for="item in descArr" :key="item.val" :label="item.title" :value="item.val">
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
    <div class="data-table" v-loading="loading">
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cash" label="主钱包" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="cash_ky" label="KY" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="cash_ag" label="AG" :formatter="formatMoney">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    price,
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "userBlance",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '用户余额',
        routerArr: [{
            title: '转账记录',
            name: 'exchange',
            checked: false
          },
          {
            title: '用户余额',
            name: 'userBlance',
            checked: false
          }
        ],
        orderArr: [{
            value: "cash",
            label: "主钱包"
          },
          {
            value: "cash_ky",
            label: "KY"
          },
          {
            value: "cash_ag",
            label: "AG"
          }
        ],
        order: "",
        descArr: [{
            title: '升序',
            val: '1'
          },
          {
            title: '降序',
            val: '-1'
          }
        ],
        desc: '-1',
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        rechargeListData: [],
        userid: "",
        loginname: "",
        username: "",
        typeArr: [{
            value: "0",
            label: "默认"
          },
          {
            value: "1",
            label: "转出"
          },
          {
            value: "2",
            label: "转入"
          }
        ],
        type: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
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
        if (v.url === 'userBlance') {
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
      this.getRechargeLotList();
    },
    methods: {
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "0.00";
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getRechargeLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getRechargeLotList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      getRechargeLotList() {
        const vm = this;
        vm.rechargeListData = [];
        request.http(
          "get",
          "/user/profile/loginname", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            order: vm.order,
            desc: vm.desc
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.rechargeListData = success.data.data;
              vm.pageNum = Number(success.data.page_num);
              vm.total = success.data.total;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              this.$message({
                message: success.data.msg,
                type: "error",
                duration: vm.duration,
                center: true
              });
            }
          },
          error => {
            vm.loading = false;
            vm.error();
          }
        );
      },
      handleReset() {
        this.username = "";
      },
      handleSearch() {
        this.pageNum = 1;
        this.getRechargeLotList();
      }
    }
  };

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>
