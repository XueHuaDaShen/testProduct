<!-- 契约管理 -->
<template>
  <div class="contract-manage el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
        <!-- <el-button style="margin-left:.5rem;position:absolute;right:1rem;top:16px;" :plain="false" @click="openContractDialog" round
          type="success">新增契约</el-button> -->
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>契约编号：</label>
            <el-input v-model="form.contract_no" placeholder="契约编号" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>类型：</label>
            <el-select v-model="form.type.selected" clearable placeholder="类型" class="small">
              <el-option v-for="item in form.type.options" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>甲方：</label>
            <el-input v-model="form.jiafang" placeholder="甲方" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>乙方：</label>
            <el-input v-model="form.yifang" placeholder="乙方" clearable style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select v-model="form.status.selected" clearable placeholder="状态" class="small">
              <el-option v-for="item in form.status.options" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
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
    <div class="content-middle content-header">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button @click="openContractDialog" size="medium" class="edit">新增总代契约</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;" max-height="450">
        <el-table-column prop="_id" align="center" label="编号">
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="superior_loginid.loginname" align="center" label="甲方">
        </el-table-column>
        <el-table-column prop="loginid.loginname" label="乙方" align="center">
        </el-table-column>
        <el-table-column label="签订日期" align="center">
          <template slot-scope="scope">
            {{getTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">
            {{getStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="is_test" :formatter="formatTestUser" align="center" width="80" label="测试用户">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="getContractDetail(scope.row._id)" class="small edit">详情</el-button>
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
    <!-- 新增契约 S-->
    <el-dialog :title="contractDialogAdd.title" :before-close="closeContractForm" :visible.sync="contractDialogAdd.visible">
      <div class="body-top" style="border:none">
        <div class="top-row">
          <span class="exp">契约类型：</span>
          <el-select v-model="contractFrom.type.selected" placeholder="契约类型" @change='contractFromTypeChanged'>
            <el-option v-for="item in contractFrom.type.options" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="top-row">
          <span class="exp">甲方：</span>
          <!-- <el-input v-model="contractFrom.jiafang" class="w-217" placeholder="请输入上级用户名" /> -->
          <span class="w-217">平台</span>
        </div>
        <div class="top-row">
          <span class="exp">乙方：</span>
          <el-input v-model="contractFrom.yifang" class="w-217" placeholder="请输入下级用户名" />
        </div>
      </div>
      <table class="dialog-table">
        <tr>
          <td class="title">流水</td>
          <td class="title">工资</td>
          <td class="title" style="width:80px">操作</td>
        </tr>
        <tr v-for="(item,index) in contractItems" :key="index">
          <td align="left" class="td-right">
            {{contractDialogAdd.dialogContentexp1}}：
            <el-input class="type2" v-model="item.quota" style="width:72px" />
          </td>
          <td align="left" class="td-right">
            {{contractDialogAdd.dialogContentexp2}}：
            <el-input class="type2" v-model="item.profit" style="width:72px" />%
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
        <el-button :plain="false" @click="onSubmit" class="yes" :loading="addLoading">新增契约</el-button>
        <el-button @click="closeContractForm()" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增契约 end-->
    <!-- 契约详情 start-->
    <el-dialog :visible.sync="contractDialogDetail.visible" :title="contractDialogDetail.title" :before-close="closeDetailForm">
      <div class="body-top" style="border:none">
        <table class="dialog-table2">
          <tr>
            <td class="td-left">契约类型：</td>
            <td align="left" class="td-right">{{getType(contractDialogDetail.data.type)}}</td>
            <td class="td-left">契约编号：</td>
            <td align="left" class="td-right">{{contractDialogDetail.data._id}}</td>
          </tr>
          <tr>
            <td class="td-left">契约甲方：</td>
            <td align="left" class="td-right">{{contractDialogDetail.data.superior_loginname}}</td>
            <td class="td-left">契约乙方：</td>
            <td align="left" class="td-right">{{contractDialogDetail.data.loginname}}</td>
          </tr>
          <tr>
            <td class="td-left">签订时间：</td>
            <td align="left" class="td-right">{{getTime(contractDialogDetail.data.create_at)}}</td>
            <td class="td-left">当前状态：</td>
            <td align="left" class="td-right">{{getStatus(contractDialogDetail.data.status)}}</td>
          </tr>
        </table>
      </div>
      <table class="dialog-table">
        <tr>
          <td class="title">流水</td>
          <td class="title">工资</td>
          <td class="title" style="width:80px">操作</td>
        </tr>
        <tr v-for="(item,index) in contractItems" :key="index">
          <td align="left" class="td-right">
            投注金额：
            <el-input class="type2" v-model="item.quota" style="width:72px" />
          </td>
          <td align="left" class="td-right">
            日工资比例：
            <el-input class="type2" v-model="item.profit" style="width:72px" />%
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
        <el-button :plain="false" @click="updateContract(2)" class="yes" :loading="updateLoading">提交契约</el-button>
        <el-button @click="updateContract(3)" class="no" :loading="deleteLoading">删除契约</el-button>
      </div>
    </el-dialog>
    <!-- 契约详情 end-->
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
  } from '../../lib/utils/validator';

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
        addLoading: false,
        updateLoading: false,
        deleteLoading: false,
        titleName: '契约管理',
        routerArr: [{
            title: '契约管理',
            name: 'contractManage',
            checked: false
          },
          {
            title: '契约设置',
            name: 'contractSet',
            checked: false
          },
        ],
        loading: false,
        list: [],
        form: {
          contract_no: "", // 契约编号
          // 类型
          type: {
            options: [{
                value: "",
                text: "所有类型"
              },
              {
                value: 1,
                text: "工资"
              },
              {
                value: 2,
                text: "分红"
              }
            ],
            selected: ""
          },
          jiafang: "", // 甲方
          yifang: "", // 乙方
          // 状态
          //  1: 有效  2: 取消
          status: {
            options: [{
                value: "",
                text: "所有状态"
              },
              {
                value: 1,
                text: "已申请"
              },
              {
                value: 2,
                text: "已生效"
              },
              {
                value: 3,
                text: "已取消"
              }
            ],
            selected: ""
          }
        },
        contractFrom: {
          // 类型
          type: {
            options: [{
                value: 1,
                text: "工资"
              },
              {
                value: 2,
                text: "分红"
              }
            ],
            selected: 1
          },
          jiafang: "", // 甲方
          yifang: "", // 乙方
        },
        contractItems: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 40, //单页条数
        detailDialog: {
          visible: false,
          title: "契约详情",
          id: "", // 契约id
          item: {},
          superior_loginname: '',
          loginname: '',
          content: [],
          loading: false
        },
        contractDialogAdd: {
          visible: false,
          title: "契约新增",
          salaryItemVisible: false,
          dialogContentexp1: '提出金额', //对话框工资流水exp
          dialogContentexp2: '日工资比例', //对话框工资金额exp
        },
        contractDialogDetail: {
          visible: false,
          title: "契约详情",
          salaryItemVisible: false,
          data: {},
          loading: false,
        },
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
        is_test: '0',
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
          v.checked = true
        } else {
          v.checked = false
        }
      })
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
      contractFromTypeChanged(value) {
        if (value) {
          switch (value) {
            case 1:
              this.contractDialogAdd.dialogContentexp1 = '投注资金';
              this.contractDialogAdd.dialogContentexp2 = '日工资比例';
              break;
            case 2:
              this.contractDialogAdd.dialogContentexp1 = '投注资金';
              this.contractDialogAdd.dialogContentexp2 = '月分红比例';
              break;
          }
        }
      },
      onSubmit() {
        let self = this;
        let jiafang = self.contractFrom.jiafang;
        let yifang = self.contractFrom.yifang;
        let type = self.contractFrom.type.selected;
        let exp1 = self.contractDialogAdd.dialogContentexp1;
        let exp2 = self.contractDialogAdd.dialogContentexp2;
        if (!type) {
          this.$message({
            showClose: true,
            message: "契约类型不能为空",
            type: "error",
            center: true
          });
          return;
        }
        if (!yifang) {
          this.$message({
            showClose: true,
            message: "乙方姓名不能为空",
            type: "error",
            center: true
          });
          return;
        }
        if (!regexpInput(yifang)) {
          this.$message({
            showClose: true,
            message: "乙方姓名格式不正确",
            type: "error",
            center: true
          });
          return;
        }
        if (self.contractItems.length == 0) {
          this.$message({
            showClose: true,
            message: "请点击加号新增一条契约",
            type: "error",
            center: true
          });
          return;
        }
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.quota || !item.profit) {
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
          loginname: yifang,
          superiorname: "bwin",
          content: self.contractItems,
          type: type.toString(),
          status: '1',
          accumulate: '0'
        };
        let url = "/agency/contract/create";
        if (jiafang === 'admin') {
          url = "/agency/agent/create";
        }
        self.addLoading = true;
        request.http(
          "post",
          url,
          data,
          success => {
            if (success.returncode) {
              self.addLoading = false;
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "契约签订成功",
                  type: "success",
                  center: true
                });
                setTimeout(function () {
                  self.contractDialogAdd.visible = false;
                  self.getList();
                  self.getList();
                }, 1000)
              } else {
                self.$message({
                  showClose: true,
                  message: success.data.msg,
                  type: "error",
                  center: true
                });
              }
            }
          },
          error => {
            self.addLoading = false;
            self.$message({
              showClose: true,
              message: "契约签订失败",
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
          quota: "",
          profit: ""
        };
        this.contractItems.push(contractItem);
      },
      openContractDialog() {
        this.resetContractForm();
        this.contractDialogAdd.visible = true;
      },
      //重置 contractDialog的表单内容
      resetContractForm() {
        this.contractFrom.jiafang = "";
        this.contractFrom.yifang = "";
        this.contractItems = [];
      },
      closeContractForm() {
        this.contractDialogAdd.visible = false;
        this.resetContractForm();
      },
      closeDetailForm() {
        this.contractDialogDetail.visible = false;
      },
      handleSearch() {
        this.getList();
      },
      handleReset() {
        this.form.contract_no = "";
        this.form.type.selected = "";
        this.form.jiafang = "";
        this.form.yifang = "";
        this.form.status.selected = "";
      },
      getList() {
        let self = this;
        let data = {
          PageSize: self.pageSize,
          PageNum: self.pageIndex,
          type: self.form.type.selected,
          superior_loginid: trim(self.form.jiafang),
          loginid: trim(self.form.yifang),
          _id: trim(self.form.contract_no),
          status: self.form.status.selected,
          is_test: self.is_test
        };
        this.loading = true;
        let url = "/agency/contract/list";
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
                self.total = success.data.count;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.data.totalPage;
                  self.list = success.data.data;
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
      getType(type) {
        let text = "";
        switch (type) {
          case 1:
            text = "工资";
            break;
          case 2:
            text = "分红";
            break;
        }
        return text;
      },
      getTime(time) {
        return moment(time).format("YYYY/MM/DD HH:mm:ss");
      },
      getStatus(status) {
        let text = "";
        switch (status) {
          case 1:
            text = "申请";
            break;
          case 2:
            text = "生效";
            break;
          case 3:
            text = "取消";
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
      /* contractDialogCloseCallBack(value) {
        this.contractDialogAdd.visible = value;
      }, */
      /*  contractDialogItemCloseCallBack(value) {
         this.contractDialogDetail.visible = value;
       }, */
      closeCallBack(value) {
        this.detailDialog.visible = value;
      },
      openDialog(item, superior_loginname, loginname, content) {
        this.detailDialog.item = item;
        this.detailDialog.id = item._id;
        this.detailDialog.superior_loginname = superior_loginname;
        this.detailDialog.loginname = loginname;
        this.detailDialog.content = content;
        this.detailDialog.visible = true;
      },
      // 取消契约
      cancelContract() {
        let self = this;
        let data = {
          id: self.detailDialog.id,
          status: 3
        };
        this.detailDialog.loading = true;
        let url = "/agency/contract/update";
        request.http(
          "post",
          url,
          data,
          success => {
            self.detailDialog.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || code === 106) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$alert("契约取消成功", "系统提醒", {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {
                    self.detailDialog.id = "";
                    self.detailDialog.visible = false;
                    self.getList();
                  }
                });
              }
            }
          },
          error => {
            self.detailDialog.loading = false;
            self.$alert("契约取消成功", "系统提醒", {
              confirmButtonText: "确定",
              center: true,
              callback: action => {
                self.detailDialog.id = "";
              }
            });
          }
        );
        return true;
      },
      //合同详情
      getContractDetail(contractid) {
        let self = this;
        self.contractDialogDetail.visible = true;
        let data = {
          contractid: contractid
        };
        self.contractDialogDetail.loading = true;
        let url = "/agency/contract/detail";
        request.http(
          "get",
          url,
          data,
          success => {
            self.contractDialogDetail.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.contractDialogDetail.data = success.data;
                if (success.data.content) {
                  self.contractItems = success.data.content;
                } else {
                  self.contractItems = [];
                }
              }
            }
          },
          error => {
            self.contractDialogDetail.loading = false;
            self.contractDialogDetail.data = {};
          }
        );
        return true;
      },
      // 合同更新
      /* status: 1,
     _id: '5b0fbaa28eb6f45c09325b66',
     content: [{quota: 100, profit: 1},{ quota:1000, profit:10}] } */
      /* type： 2 更新;3 删除 */
      updateContract(type) {
        let self = this;
        let contractid = self.contractDialogDetail.data._id;
        let status = self.contractDialogDetail.data.status;
        let content = self.contractItems;
        let data = {};
        let message = "";
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.quota || !item.profit) {
            this.$message({
              showClose: true,
              message: "投注资金或者日工资比例不能为空",
              type: "error",
              center: true
            });
            return;
          }
        }
        if (type == 2) {
          data = {
            id: contractid,
            content: content
          };
          message = "更新";
          self.updateLoading = true;
          let url = "/agency/contract/update";
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
                    message: "契约" + message + "成功",
                    type: "success",
                    center: true
                  });
                  setTimeout(function () {
                    self.contractDialogDetail.visible = false;
                    self.resetContractForm();
                    self.getList();
                    self.getList();
                  }, 1000)
                }
              }
            },
            error => {
              self.updateLoading = false;
              self.resetContractForm();
              self.contractDialogDetail.data = {};
              self.$message({
                showClose: true,
                message: "契约" + message + "失败",
                type: "error",
                center: true
              });
            }
          );
        } else if (type == 3) {
          data = {
            id: contractid,
            status: 3
          };
          message = "删除";
          this.$confirm('此操作将删除该契约, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let url = "/agency/contract/update";
            self.deleteLoading = true;
            request.http(
              "post",
              url,
              data,
              success => {
                self.deleteLoading = false;
                if (success.returncode) {
                  if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                    request.loginAgain(self);
                  } else if (success.returncode == 200) {
                    self.$message({
                      showClose: true,
                      message: "契约" + message + "成功",
                      type: "success",
                      center: true
                    });
                    setTimeout(function () {
                      self.contractDialogDetail.visible = false;
                      self.resetContractForm();
                      self.getList();
                      self.getList();
                    }, 1000)
                  }
                }
              },
              error => {
                self.deleteLoading = false;
                self.resetContractForm();
                self.contractDialogDetail.data = {};
                self.$message({
                  showClose: true,
                  message: "契约" + message + "失败",
                  type: "error",
                  center: true
                });
              }
            );
          }).catch(() => {
            return;
          });
        }
      },
    },
    computed: {},
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
