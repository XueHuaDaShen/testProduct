<!-- 用户银行卡列表 -->
<template>
  <div class="contract-manage el-custom">
    <DialogUserInfo :loginname="loginname" :userid="userid" @closeDialog="handleCloseDialog" :dialogVisible="dialog"></DialogUserInfo>
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
            <el-input v-model.trim="form.loginname" placeholder="用户名" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>账户名：</label>
            <el-input v-model.trim="form.realname" placeholder="账户名" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>开户银行：</label>
            <el-select v-model="form.bank.selected" clearable placeholder="开户银行" class="small" @focus="getBankList()"
              :loading="form.bank.loading" :loading-text="form.bank.loadingText">
              <el-option v-for="item in form.bank.options" :key="item._id" :label="item.bank_name" :value="item.bank_name">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>银行卡号：</label>
            <el-input v-model.trim="form.card_no" placeholder="银行卡号" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="form.is_test.value" placeholder="测试用户" class="small">
              <el-option v-for="item in form.is_test.options" :key="item.value" :label="item.label" :value="item.value">
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
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{getLoginName(scope.row)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户银行" prop="bank">
        </el-table-column>
        <el-table-column align="center" label="开户城市">
          <template slot-scope="scope">
            <span>{{scope.row.province === scope.row.city?scope.row.city : scope.row.province + scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡号" prop="card_no">
        </el-table-column>
        <el-table-column align="center" label="账户名" prop="realname">
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            {{getTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{getStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="is_test" :formatter="formatTestUser" align="center" width="80" label="测试用户">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="lock(scope.row.loginid._id,1)" class="small yes" v-if="scope.row.status == 0">锁定</el-button>
            <el-button @click="lock(scope.row.loginid._id,0)" class="small edit" v-if="scope.row.status == 1">解锁</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../../axios/axios";
  import tableBtn from "../littleStyle/tableBtn";
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import moment from "moment";
  import {
    trim,
    regexpPsd,
    regexpInput
  } from '../../lib/utils/validator';

  export default {
    name: "bankList",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '银行卡列表',
        routerArr: [{
          title: '银行卡列表',
          name: 'bankList',
          checked: false
        }, ],
        loading: false,
        list: [],
        loginname: "",
        userid: "",
        dialog: false,
        form: {
          loginname: "",
          realname: "",
          bank: {
            selected: "",
            options: [],
            loading: false,
            loadingText: "正在加载..."
          },
          card_no: "",
          is_test: {
            value: "0",
            options: [{
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
          }
        },
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 40, //单页条数
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
        if (v.url === 'bankList') {
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
    },
    methods: {
      handleCloseDialog(val) {
        this.dialog = val;
      },
      getLoginName(row) {
        if (row.loginid && row.loginid.loginname) {
          return row.loginid.loginname
        }
        return ""
      },
      getUserInfoFn(row) {
        if (row.loginid && row.loginid.loginname) {
          this.dialog = true;
          this.userid = row.loginid._id;
          this.loginname = row.loginid.loginname;
        }
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
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
      handleSearch() {
        this.pageIndex = 1;
        this.getList();
      },
      handleReset() {
        // this.form.contract_no = "";
        // this.form.jiafang = "";
        // this.form.yifang = "";
        this.form.loginname = "";
        this.form.realname = "";
        this.form.bank.selected = "";
        this.form.card_no = "";
        this.form.is_test.value = "0";
      },
      getList() {
        let self = this;
        let data = {
          PageSize: self.pageSize,
          PageNum: self.pageIndex,
          loginname: trim(self.form.loginname),
          realname: trim(self.form.realname),
          bank: self.form.bank.selected,
          card_no: trim(self.form.card_no),
          // is_test: self.form.is_test.value
        };
        this.loading = true;
        let url = "/user/bankcard/list";
        request.http(
          "get",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode === 103 || success.returncode === 106 || success.returncode === 101) {
                request.loginAgain(self);
              } else if (success.returncode === 200) {
                self.total = success.count;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.totalPage;
                  self.list = success.data;
                } else {
                  self.noResult = true;
                  self.list = [];
                }
              } else {
                self.noResult = true;
                self.list = [];
              }
            }
          },
          error => {
            self.loading = false;
            self.noResult = true;
            self.list = [];
          }
        );
        return true;
      },
      getTime(time) {
        return moment(time).format("YYYY/MM/DD HH:mm:ss");
      },
      getStatus(value) {
        switch (value) {
          case 1:
            return "锁定";
          case 0:
            return "未锁定";
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getList();
      },
      getBankList() {
        if (this.form.bank.options.length != 0) {
          return;
        }
        const vm = this;
        let url = "/bank/list";
        vm.form.bank.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            vm.form.bank.loading = false;
            if (success.returncode) {
              if (success.returncode === 103 || success.returncode === 106 || success.returncode === 101) {
                request.loginAgain(vm);
              } else if (success.returncode === 200) {
                if (success.data.banks.length != 0) {
                  vm.form.bank.options = success.data.banks;
                } else {
                  vm.form.bank.options = [];
                }
              }
            }
          },
          error => {
            vm.form.bank.loading = false;
            vm.form.bank.options = [];
          }
        );
      },
      lock(loginid, status) {
        let act = "";
        const vm = this;
        if (status == 1) {
          act = "锁定";
        } else {
          act = "解锁";
        }
        this.$confirm('确定' + act + '该用户么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = "/user/bankcard/lock";
          vm.loading = true;
          request.http(
            "post",
            url, {
              loginid: loginid,
              status: status
            },
            success => {
              vm.loading = false;
              if (success.returncode) {
                if (success.returncode === 103 || success.returncode === 106 || success.returncode === 101) {
                  request.loginAgain(vm);
                } else if (success.returncode === 200) {
                  let message = "";
                  if (status == 1) {
                    message = "锁定成功";
                  } else {
                    message = "解锁成功";
                  }
                  vm.$message({
                    showClose: true,
                    message: message,
                    type: "success",
                    center: true
                  });
                  vm.getList();
                }
              }
            },
            error => {
              vm.loading = false;
              let message = "";
              if (status == 1) {
                message = "锁定失败";
              } else {
                message = "解锁失败";
              }
              vm.$message({
                showClose: true,
                message: message,
                type: "error",
                center: true
              });
            }
          );
        }).catch(() => {});
      }
    },
    mounted() {
      this.getList();
    },
  };

</script>
<style scoped>
  /* @import "../../publicCss/header.css"; */

  .top-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .w-217 {
    width: 300px;
  }

  .tip {
    height: 40px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 40px;
    width: 200px;
    display: inline-block;
  }

  input.type2 {
    width: 112px;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    display: inline-block;
    margin: 0 10px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    margin-left: 5px;
  }

  input.type2:focus {
    outline: none;
  }

  input.type1 {
    width: 112px;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }

  input.type1:focus {
    outline: none;
  }

  .contract-dialog-add {
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .contract-dialog-add>i {
    background: url("../../assets/icon_Add@3x.png") no-repeat;
    background-size: cover;
    height: 14px;
    width: 14px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  .contract-dialog-add>span {
    display: inline-block;
    vertical-align: middle
  }

  .contract-dialog-delete {
    background: url("../../assets/icon_Delete@3x.png") no-repeat;
    background-size: cover;
    height: 14px;
    width: 14px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }

  .contract-link-commit {
    background: #b35555;
    border-radius: 4px;
    width: 120px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    color: #ffffff;
    line-height: 50px;
    margin: 35px 0;
    display: inline-block;
  }

  .contract-link-commit.delete {
    background: #777;
  }

  .dialog-table {
    width: 100%;
    /* border: 1px solid #e8e8e8; */
  }

  .dialog-table td {
    border: 1px solid #e8e8e8;
    font-size: 12px;
    line-height: 38px;
    height: 40px;
    text-align: center;
    color: #191919;
  }

  .dialog-table td.title {
    border: 1px solid #e8e8e8;
    line-height: 38px;
    height: 40px;
    background: #f0f0f0;
    text-align: center;
    font-size: 12px;
    color: #191919;
  }

  .dialog-table .td-left {
    background: #f2f2f2;
  }

  .dialog-table .td-right {
    padding-left: 20px;
    text-align: left;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .contract-manage .contract-link {
    text-decoration: none;
    cursor: pointer;
    display: inline-block;
  }

  .contract-manage .table-row {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .contract-manage .contract-table {}

  .contract-manage .contract-table .table-row .exp {
    font-weight: 500;
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  .contract-manage .contract-table .table-row .content {
    text-align: left;
    padding: 16px 8px;
  }

  .contract-manage li {
    list-style: none;
  }

  .contract-manage .quota {
    color: #dd514c;
  }

  .contract-manage .profit {
    color: #5eb95e;
  }

  .dialog-table .td-left {
    background: #f2f2f2;
  }

  .dialog-table .td-right {
    padding-left: 20px;
  }

  .dialog-table {
    width: 100%;
    /* border: 1px solid #e8e8e8; */
  }

  .dialog-table2 td {
    font-size: 12px;
    line-height: 38px;
    height: 40px;
    text-align: center;
    color: #191919;
  }

  .dialog-table2 td.title {
    border: 1px solid #e8e8e8;
    line-height: 38px;
    height: 40px;
    background: #f0f0f0;
    text-align: center;
    font-size: 12px;
    color: #191919;
  }


  .dialog-table2 .td-right {
    padding-left: 5px;
    text-align: left;
  }

</style>
