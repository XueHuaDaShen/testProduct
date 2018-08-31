<template>
  <div class="rechargeLot-wrap el-custom">
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
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" prop="platform" label="平台">
        </el-table-column>
        <el-table-column align="center" prop="type" label="支付方式" :formatter="formatPayWay">
        </el-table-column>
        <el-table-column align="center" prop="name" label="渠道">
        </el-table-column>
        <el-table-column align="center" label="账户">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item,index) in scope.row.account" :key="index">
                {{item.name}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order" label="排序值">
        </el-table-column>
        <el-table-column align="center" label="展现状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="0"
              :inactive-value="1" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <div class="flex-row">
              <el-button class="small edit" @click="getDialogDetail(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑前端展示 start-->
      <el-dialog :visible.sync="dialog.visible" :title="dialog.title" :before-close="closeForm">
        <div class="body-top" style="border:none">
          <table class="dialog-table2">
            <tr>
              <td class="td-left" align="right">支付方式：</td>
              <td align="left" class="td-right">{{getType(dialog.data.type)}}</td>
            </tr>
            <tr>
              <td class="td-left" align="right">渠道：</td>
              <td align="left" class="td-right">{{dialog.data.name}}</td>
            </tr>
          </table>
        </div>
        <table class="dialog-table">
          <tr>
            <td class="title">账户</td>
            <td class="title" style="width:80px">操作</td>
          </tr>
          <tr v-for="(item,index) in contractItems" :key="index">
            <td align="left" class="td-right">
              <el-select clearable v-model="item._id" placeholder="请选择账户" class="small">
                <el-option v-for="(item_,index_) in usercountDataList" :key="index_" :label="item_.name" :value="item_._id">
                </el-option>
              </el-select>
            </td>
            <td>
              <a class="contract-dialog-delete" @click="closeItem(item)"></a>
            </td>
          </tr>
          <tfoot>
            <tr>
              <td colspan="3">
                <a class="contract-dialog-add" @click="addItem()">
                  <i></i>
                  <span>增加</span>
                </a>
              </td>
            </tr>
          </tfoot>
        </table>
        <div slot="footer" class="dialog-footer mt-30">
          <el-button :plain="false" @click="closeForm" class="no">取消</el-button>
          <el-button @click="updateForm" class="yes" :loading="updateLoading">确定</el-button>
        </div>
      </el-dialog>
      <!-- 契约详情 end-->
      <!-- <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: 'tradeAccountLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        updateLoading: false,
        rowKey: '',
        index1: '',
        index2: '',
        titleName: '前端展示',
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
            title: 'BWIN入款记录',
            name: 'rechargeLog',
            checked: false
          },
          {
            title: '第三方入款记录',
            name: 'thirdRechargeLog',
            checked: false
          },
          {
            title: '前端展示',
            name: 'tradeAccountLog',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        withdrawListData: [],
        typeArr: [{
          value: '1',
          label: '微信'
        }, {
          value: '2',
          label: '支付宝'
        }, {
          value: '3',
          label: '银行卡转账'
        }],
        type: '',
        platform: '',
        id: '',
        duration: 1000,
        dialog: {
          visible: false,
          title: "编辑前端展示",
          salaryItemVisible: false,
          data: {},
          loading: false,
        },
        usercountDataList: [],
        contractItems: [],
      }
    },
    created() {
      this.getWithdrawLotList();
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'outcomeLog') {
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
      //重置 contractDialog的表单内容
      resetForm() {
        this.contractItems = [];
        this.usercountDataList = [];
      },
      closeForm() {
        this.dialog.visible = false;
        this.resetForm();
      },
      updateForm() {
        const self = this;
        let contractid = self.dialog.data._id;
        let status = self.dialog.data.status;
        let content = [];
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i]._id;
          content.push(item);
        }
        let data = {};
        let message = "";
        for (let i = 0; i < content.length; i++) {
          let item = content[i];
          if (!item) {
            this.$message({
              showClose: true,
              message: "请选择账户！",
              type: "error",
              center: true
            });
            return;
          }
        }
        data = {
          id: contractid,
          account: content
        };
        message = "更新";
        self.updateLoading = true;
        let url = "/trade/accountType/update";
        request.http(
          "post",
          url,
          data,
          success => {
            if (success.returncode) {
              self.updateLoading = false;
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "账户" + message + "成功",
                  type: "success",
                  center: true
                });
                setTimeout(function () {
                  self.dialog.visible = false;
                  self.resetForm();
                  self.getWithdrawLotList();
                }, 1000)
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error",
                  center: true
                });
              }
            }
          },
          error => {
            self.updateLoading = false;
            self.resetForm();
            self.$message({
              showClose: true,
              message: "账户" + message + "失败",
              type: "error",
              center: true
            });
          }
        );
      },
      closeItem(item) {
        this.contractItems.splice(this.contractItems.indexOf(item), 1);
      },
      addItem() {
        let contractItem = {
          _id: ''
        };
        this.contractItems.push(contractItem);
      },
      getDialogDetail(row) {
        this.dialog.visible = true;
        this.dialog.data = row;
        for (let i = 0; i < row.account.length; i++) {
          let item = row.account[i]._id;
          this.contractItems.push({
            _id: item
          });
        }
        const self = this;
        self.dialog.loading = true;
        let url = "/trade/account/list";
        request.http(
          "get",
          url, {},
          success => {
            self.dialog.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.usercountDataList = success.data;
              }
            }
          },
          error => {
            self.dialog.loading = false;
            self.dialog.data = {};
          }
        );
        return true;
      },
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        console.log("value", value);
        this.modifiedEnabled("status", value.toString(), this.rowKey);
      },
      //是否开启
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/trade/accountType/update";
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
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      formatPayWay(row, column, cellValue) {
        if (cellValue) {
          switch (cellValue) {
            case 1:
              return '快捷支付';
            case 2:
              return '扫码支付';
          }
        }
        return '--';
      },
      getType(value) {
        if (value) {
          switch (value) {
            case 1:
              return '快捷支付';
            case 2:
              return '扫码支付';
          }
        }
        return '--';
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
      isStatusFn(row, column, cellValue) {
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
        }
      },
      getStatus(status) {
        // console.log(typeof cellValue)
        switch (status) {
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
            // case 8:
            //   return '到账';
        }
      },
      getTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getWithdrawLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      formatTime2(cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      getWithdrawLotList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/trade/accountType/list', {
            platform: vm.platform,
            type: vm.type,
            id: vm.id,
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawListData = success.data;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
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
        this.type = '';
        this.platform = '';
        this.id = '';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
      },
      handleClose() {
        this.resetForm('form')
      },
    },
  }

</script>
<style>
  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

  .rechargeLot-wrap .flex-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .rechargeLot-wrap .flex-row>button {
    flex: 1;
    padding: 0;
  }

</style>

<style scoped lang="scss">
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

  li {
    list-style: none;
  }

  .cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .detail-title {
    text-align: left;

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      margin-left: 30px;
      font-weight: 700;
    }
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
    text-align: center;
  }

</style>
