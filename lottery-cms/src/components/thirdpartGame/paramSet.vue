<!-- 参数配置 -->
<template>
  <div class="contract-manage el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="content-middle content-header">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button @click="openContractDialog" size="medium" class="edit">新增第三方平台</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column prop="platform" align="center" width="110" label="平台代号">
        </el-table-column>
        <el-table-column prop="name" align="center" width="110" label="平台名">
        </el-table-column>
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">
            {{getStatus(scope.row.disabled)}}
          </template>
        </el-table-column>
        <el-table-column label="返点" align="center">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.refund" :key="index">
              <span>{{item.range}}</span>
              <span>&nbsp;-&nbsp;</span>
              <span>{{item.rate}}%</span>
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="is_test" :formatter="formatTestUser" align="center" width="80" label="测试用户">
        </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="getContractDetail(scope.row)" class="small edit">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
    <!-- 新增契约 S-->
    <el-dialog :title="contractDialogAdd.title" :before-close="closeContractForm" :visible.sync="contractDialogAdd.visible">
      <div class="body-top" style="border:none">
        <div class="top-row">
          <span class="exp">平台代号：</span>
          <el-input v-model="contractFrom.platform" class="w-217" placeholder="请输入平台代号" type="text" />
        </div>
        <div class="top-row">
          <span class="exp">平台名称：</span>
          <el-input v-model="contractFrom.name" class="w-217" placeholder="请输入平台名称" type="text" />
        </div>
        <div class="top-row">
          <span class="exp">是否开启：</span>
          <el-switch inactive-value="1" active-value="0" v-model="contractFrom.disabled" active-color="#2D996E"
            inactive-color="#C83A4C"></el-switch>
        </div>
      </div>
      <table class="dialog-table">
        <tr>
          <td class="title">流水</td>
          <td class="title">返点</td>
          <td class="title" style="width:80px">操作</td>
        </tr>
        <tr v-for="(item,index) in contractItems" :key="index">
          <td align="left" class="td-right">
            {{contractDialogAdd.dialogContentexp1}}：
            <el-input class="type2" v-model="item.range" style="width:72px" />
          </td>
          <td align="left" class="td-right">
            {{contractDialogAdd.dialogContentexp2}}：
            <el-input class="type2" v-model="item.rate" style="width:72px" /> %
          </td>
          <td>
            <a class="contract-dialog-delete" @click="closeContractItem(item)"></a>
          </td>
        </tr>
        <tfoot>
          <tr>
            <td colspan="3">
              <a class="contract-dialog-add" @click="addContractItem()">
                <i></i>
                <span>增加</span>
              </a>
            </td>
          </tr>
        </tfoot>
      </table>
      <div slot="footer" class="dialog-footer mt-30">
        <div v-show="contractDialogAdd.dialogNew">
          <el-button :plain="false" @click="onSubmit" class="yes" :loading="createLoading">确 定</el-button>
          <el-button @click="closeContractForm()" class="no">取 消</el-button>
        </div>
        <div v-show="!contractDialogAdd.dialogNew">
          <el-button :plain="false" @click="updateContract(2)" class="yes" :loading="editLoading">提交</el-button>
          <el-button @click="updateContract(3)" class="no" :loading="forbidLoading">停用</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增契约 end-->
  </div>
</template>
<script>
  import request from "../../axios/axios";
  import tableBtn from "../littleStyle/tableBtn";
  import moment from "moment";
  import cmsDialog from "../cmsDialog/cmsDialog";
  import {
    trim,
    regexpPsd,
    regexpInput
  } from "../../lib/utils/validator";

  export default {
    name: "contractManage",
    components: {
      tableBtn,
      cmsDialog
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        createLoading: false,
        editLoading: false,
        forbidLoading: false,
        titleName: "参数配置",
        routerArr: [{
          title: "参数配置",
          name: "paramSet",
          checked: false
        }],
        loading: false,
        list: [],
        contractFrom: {
          platform: "", // 平台代号
          name: "", // 平台名称
          disabled: "", // 是否开启
          id: ""
        },
        contractItems: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 40, //单页条数
        contractDialogAdd: {
          visible: false,
          title: "平台参数设置",
          dialogNew: true,
          salaryItemVisible: false,
          loading: false,
          dialogContentexp1: "金额", //对话框工资流水exp
          dialogContentexp2: "比例" //对话框工资金额exp
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
        if (v.url === 'contractManage') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      });
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        });
        // console.log(name)
      },
      onSubmit() {
        let self = this;
        let platform = self.contractFrom.platform;
        let name = self.contractFrom.name;
        let disabled = self.contractFrom.disabled;
        let exp1 = self.contractDialogAdd.dialogContentexp1;
        let exp2 = self.contractDialogAdd.dialogContentexp2;
        if (!platform) {
          this.$message({
            showClose: true,
            message: "平台代号不能为空",
            type: "error",
            center: true
          });
          return;
        }
        if (!regexpInput(platform)) {
          this.$message({
            showClose: true,
            message: "平台代号要求3-20位字母或者数字",
            type: "error",
            center: true
          });
          return;
        }
        if (!name) {
          this.$message({
            showClose: true,
            message: "平台名称不能为空",
            type: "error",
            center: true
          });
          return;
        }
        if (!name) {
          this.$message({
            showClose: true,
            message: "平台名称不能为空",
            type: "error",
            center: true
          });
          return;
        }
        if (self.contractItems.length == 0) {
          this.$message({
            showClose: true,
            message: "请点击加号新增一条返点设置",
            type: "error",
            center: true
          });
          return;
        }
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.range || !item.rate) {
            this.$message({
              showClose: true,
              message: exp1 + "或者" + exp2 + "不能为空",
              type: "error",
              center: true
            });
            return;
          }
        }
        let data = {
          platform: platform,
          refund: self.contractItems,
          disabled: disabled,
          name: name
        };
        // console.log('data', data);
        let url = "/gameSetting/create";
        self.createLoading = true;
        request.http(
          "post",
          url,
          data,
          success => {
            self.createLoading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "平台新增成功",
                  type: "success",
                  center: true
                });
                setTimeout(function () {
                  self.contractDialogAdd.visible = false;
                  self.getList();
                }, 1000);
              } else if (success.returncode == 301) {
                self.$message({
                  showClose: true,
                  message: "301",
                  type: "error",
                  center: true
                });
              }
            }
          },
          error => {
            self.createLoading = false;
            self.$message({
              showClose: true,
              message: "平台新增失败",
              type: "error",
              center: true
            });
          }
        );
        return true;
      },
      closeContractItem(item) {
        this.contractItems.splice(this.contractItems.indexOf(item), 1);
      },
      addContractItem() {
        let contractItem = {
          range: "",
          rate: ""
        };
        this.contractItems.push(contractItem);
      },
      openContractDialog() {
        this.resetContractForm();
        this.contractDialogAdd.dialogNew = true;
        this.contractDialogAdd.visible = true;
      },
      //重置 contractDialog的表单内容
      resetContractForm() {
        this.contractFrom.platform = "";
        this.contractFrom.name = "";
        this.contractFrom.disabled = 1;
        this.contractFrom.id = "";
        this.contractItems = [];
      },
      closeContractForm() {
        this.contractDialogAdd.visible = false;
        this.resetContractForm();
      },
      getList() {
        let self = this;
        this.loading = true;
        let url = "/gameSetting/list";
        self.loading = true;
        request.http(
          "get",
          url, {
            // pageSize: self.pageSize,
            // pageNum: self.pageIndex
          },
          success => {
            self.loading = false;
            if (success.returncode) {
              if (
                success.returncode === 103 ||
                success.returncode === 106 ||
                success.returncode === 101
              ) {
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
                  self.$alert("没有符合条件的记录", "系统提醒", {
                    confirmButtonText: "确定",
                    center: true
                  });
                }
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
      getStatus(status) {
        let text = "";
        switch (status) {
          case 1:
            text = "停用";
            break;
          case 0:
            text = "启用";
            break;
        }
        return text;
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
      //合同详情
      getContractDetail(row) {
        let self = this;
        self.resetContractForm();
        self.contractDialogAdd.visible = true;
        self.contractDialogAdd.dialogNew = false;
        for (let i in row.refund) {
          let arr = {};
          arr['range'] = row.refund[i].range;
          arr['rate'] = row.refund[i].rate;
          self.contractItems.push(arr);
        }
        self.contractFrom.platform = row.platform;
        self.contractFrom.name = row.name;
        self.contractFrom.disabled = row.disabled.toString();
        self.contractFrom.id = row._id;
        /* let data = {
          id: contractid
        };
        self.contractDialogAdd.loading = true;
        let url = "/gameSetting/list";
        request.http(
          "get",
          url,
          data,
          success => {
            self.contractDialogAdd.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.contractDialogAdd.data = success.data;
                self.contractItems = success.data.content;
              }
            }
          },
          error => {
            self.contractDialogAdd.loading = false;
            self.contractDialogAdd.data = {};
          }
        ); */
      },
      // 合同更新
      /* status: 1,
       _id: '5b0fbaa28eb6f45c09325b66',
       content: [{range: 100, profit: 1},{ range:1000, profit:10}] } */
      /* type： 2 更新;3 删除 */
      updateContract(type) {
        let self = this;
        let platform = self.contractFrom.platform;
        let name = self.contractFrom.name;
        let disabled = self.contractFrom.disabled;
        let refund = self.contractItems;
        let id = self.contractFrom.id;
        let data = {};
        let message = "";
        if (self.contractItems.length == 0) {
          this.$message({
            showClose: true,
            message: "请点击加号新增一条返点设置",
            type: "error",
            center: true
          });
          return;
        }
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.range || !item.rate) {
            this.$message({
              showClose: true,
              message: "资金或者工资比例不能为空",
              type: "error",
              center: true
            });
            return;
          }
        }
        if (type == 2) {
          data = {
            platform: platform,
            name: name,
            disabled: disabled,
            refund: refund,
            id: id
          };
          message = "更新";
          self.editLoading = true;
        } else if (type == 3) {
          data = {
            id: id,
            disabled: 1
          };
          message = "删除";
          self.forbidLoading = true;
        }
        let url = "/gameSetting/update";
        request.http(
          "post",
          url,
          data,
          success => {
            if (success.returncode) {
              if (type == 2) {
                self.editLoading = false;
              } else if (type == 3) {
                self.forbidLoading = false;
              }
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "平台" + message + "成功",
                  type: "success",
                  center: true
                });
                self.contractDialogAdd.visible = false;
                self.resetContractForm();
                self.getList();
              }
            }
          },
          error => {
            if (type == 2) {
              self.editLoading = false;
            } else if (type == 3) {
              self.forbidLoading = false;
            }
            self.$message({
              showClose: true,
              message: "平台" + message + "失败",
              type: "error",
              center: true
            });
          }
        );
        return true;
      }
    },
    mounted() {
      this.getList();
    },
    watch: {
      "contractDialogAdd.dialogNew"() {
        if (this.contractDialogAdd.dialogNew) {
          this.contractDialogAdd.title = "平台参数设置";
        } else {
          this.contractDialogAdd.title = "平台参数修改";
        }
      }
    }
  };

</script>
<style scoped>
  /* @import "../../publicCss/header.css"; */

  .top-row {
    display: flex;
    justify-content: flex-start;
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
    vertical-align: middle;
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
    border-collapse: collapse;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-table td {
    font-size: 12px;
    line-height: 38px;
    height: 40px;
    text-align: center;
    color: #191919;
    border-left: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }


  .dialog-table tfoot td {
    border: none;
  }

  .dialog-table td.title {
    border: none;
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
