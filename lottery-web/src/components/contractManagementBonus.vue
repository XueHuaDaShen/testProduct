<!--契约管理 - 分红契约-->
<template>
  <div class="lottery-wrap" v-loading="loading">
    <div class="record-tabs">
      <router-link :to="{name:'contractManagementSalary'}" class="tab-item">
        工资契约
      </router-link>
      <router-link :to="{name:'contractManagementBonus'}" class="tab-item active">分红契约</router-link>
    </div>
    <div class="clearfix">
      <a class="contract-add-link" @click="openContractDialog()">
        <i></i>
        <span>签订契约</span>
      </a>
    </div>
    <div class="tab-line">上级契约</div>
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>契约类型</th>
          <th>签订时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in type1.contractList" v-cloak v-if="!type1.noResult" :key="index">
          <td>{{getType(item.type)}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{getStatus(item.status)}}</td>
          <td>
            <a class="contract-link-detail" @click="getsjContractDetail(item._id)" :class="{edit:item.status == 1}">{{item.status ==1 ?'操作':'详情'}}</a>
          </td>
        </tr>
        <tr v-if="type1.noResult" class="no-result group-item">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="type1HandleSizeChange" @current-change="type1HandleCurrentChange" :current-page.sync="type1.pageIndex" :page-size="type1.pageSize" layout="total, prev, pager, next" :total="type1.total">
      </el-pagination>
    </div>
    <div class="tab-line mt-58">下级契约</div>
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>契约类型</th>
          <th>下级</th>
          <th>签订时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in type2.contractList" v-cloak v-if="!type2.noResult" :key="index">
          <td>{{getType(item.type)}}</td>
          <td>{{item.loginname}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>{{getStatus(item.status)}}</td>
          <td>
            <a class="contract-link-detail" @click="getContractDetail(item._id)">详情</a>
          </td>
        </tr>
        <tr v-if="type2.noResult" class="no-result group-item">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="type2HandleSizeChange" @current-change="type2HandleCurrentChange" :current-page.sync="type2.pageIndex" :page-size="type2.pageSize" layout="total, prev, pager, next" :total="type2.total">
      </el-pagination>
    </div>
    <!-- 签订契约 Start-->
    <contract-dialog :visible="contractDialogAdd.visible" :title="contractDialogAdd.title" @visibleChange="contractDialogAddChange">
      <div v-loading="contractDialogAdd.loading">
        <table class="dialog-table">
          <tr>
            <td class="td-left">契约类型：</td>
            <td align="left" class="td-right">分红契约</td>
          </tr>
          <tr>
            <td class="td-left">下级用户名：</td>
            <td align="left" class="td-right">
              <input placeholder="请输入下级用户名" class="type1" v-model="form.loginname" />
            </td>
          </tr>
          <tr>
            <td class="td-left">资金密码：</td>
            <td align="left" class="td-right">
              <input placeholder="请输入资金密码" class="type1" v-model="form.psd" type="password" />
            </td>
          </tr>
        </table>
        <table class="mt-20 dialog-table">
          <tr>
            <td class="title">亏损金额</td>
            <td class="title">分红比例</td>
            <td class="title">操作</td>
          </tr>
          <tr v-for="(item,index) in contractItems" :key="index">
            <td align="center" class="td-right">
              <input placeholder="请输入亏损金额" class="type2" v-model="item.quota" />
            </td>
            <td align="center" class="td-right">
              <input placeholder="请输入分红比例" class="type2" v-model="item.profit" /> %
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
        <div class="dialog-footer">
          <a class="contract-link-commit" @click="validatorCashPsd(1)">提交契约</a>
        </div>
      </div>
    </contract-dialog>
    <!-- 签订契约 End -->
    <!--  契约详情 Start-->
    <contract-dialog :visible="contractDialogDetail.visible" :title="contractDialogDetail.title" @visibleChange="contractDialogDetailChange">
      <div v-loading="contractDialogDetail.loading">
        <table class="dialog-table">
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
        <table class="mt-20 dialog-table">
          <tr>
            <td class="title">工资流水</td>
            <td class="title">工资金额</td>
            <td class="title">操作</td>
          </tr>
          <tr v-for="(item,index) in contractItems" :key="index">
            <td align="left" class="td-right">
              亏损金额
              <input placeholder="请输入投注金额" class="type2" v-model="item.quota" />
            </td>
            <td align="left" class="td-right">
              月分红比例
              <input placeholder="请输入月分红比例" class="type2" v-model="item.profit" /> %
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
            <tr>
              <td class="td-left">资金密码：</td>
              <td align="left" class="td-right" colspan="2">
                <input placeholder="请输入资金密码" class="type1" v-model="form.psd" type="password" />
              </td>
            </tr>
          </tfoot>
        </table>
        <div class="dialog-footer">
          <a class="contract-link-commit delete" @click="validatorCashPsd(3)">删除契约</a>
          <a class="contract-link-commit" @click="validatorCashPsd(2)">提交契约</a>
        </div>
      </div>
    </contract-dialog>
    <!-- 契约详情 End -->
    <!--  上级契约详情 Start-->
    <contract-dialog :visible="sjcontractDialogDetail.visible" :title="sjcontractDialogDetail.title" @visibleChange="sjcontractDialogDetailChange">
      <div v-loading="sjcontractDialogDetail.loading">
        <table class="dialog-table">
          <tr>
            <td class="td-left">契约类型：</td>
            <td align="left" class="td-right">{{getType(sjcontractDialogDetail.data.type)}}</td>
            <td class="td-left">契约编号：</td>
            <td align="left" class="td-right">{{sjcontractDialogDetail.data._id}}</td>
          </tr>
          <tr>
            <td class="td-left">契约甲方：</td>
            <td align="left" class="td-right">{{sjcontractDialogDetail.data.superior_loginname}}</td>
            <td class="td-left">契约乙方：</td>
            <td align="left" class="td-right">{{sjcontractDialogDetail.data.loginname}}</td>
          </tr>
          <tr>
            <td class="td-left">签订时间：</td>
            <td align="left" class="td-right">{{getTime(sjcontractDialogDetail.data.create_at)}}</td>
            <td class="td-left">当前状态：</td>
            <td align="left" class="td-right">{{getStatus(sjcontractDialogDetail.data.status)}}</td>
          </tr>
        </table>
        <table class="mt-20 dialog-table">
          <tr>
            <td class="title">工资流水</td>
            <td class="title">工资金额</td>
          </tr>
          <tr v-for="(item,index) in contractItems" :key="index">
            <td align="left" class="td-right">
              投注金额
              <input placeholder="请输入投注金额" class="type2" v-model="item.quota" disabled/>
            </td>
            <td align="left" class="td-right">
              日工资比例
              <input placeholder="请输入日工资比例" class="type2" v-model="item.profit" disabled /> %
            </td>
          </tr>
          <tfoot v-show='sjcontractDialogDetail.data.status == 1'>
            <tr>
              <td class="td-left">资金密码：</td>
              <td align="left" class="td-right" colspan="2">
                <input placeholder="请输入资金密码" class="type1" v-model="form.psd" type="password" />
                <span class="tip">&nbsp;（6-16位数字或者字母组合）</span>
              </td>
            </tr>
          </tfoot>
        </table>
        <div class="dialog-footer" v-show='sjcontractDialogDetail.data.status == 1'>
          <a class="contract-link-commit delete" @click="validatorCashPsd(5)">取消签订</a>
          <a class="contract-link-commit" @click="validatorCashPsd(4)">同意签订</a>
        </div>
      </div>
    </contract-dialog>
    <!-- 契约详情 End -->
  </div>
</template>
<script>
  import request from "../axios/axios.js";
  import contractDialog from "./contractDialog/contractDialog.vue";
  import moment from "moment";

  export default {
    components: {
      contractDialog
    },
    data() {
      return {
        loading: false,
        form: {
          loginname: "", // 下级用户名
          psd: "" // 资金密码
        },
        list: [],
        noResult: true,
        contractDialogAdd: {
          visible: false,
          title: "分红契约",
          salaryItemVisible: false,
          loading: false,
        },
        contractDialogDetail: {
          visible: false,
          title: "契约详情",
          salaryItemVisible: false,
          data: {},
          loading: false,
        },
        sjcontractDialogDetail: {
          visible: false,
          title: "契约详情",
          salaryItemVisible: false,
          data: {},
          loading: false,
        },
        // 上级契约
        type1: {
          contractList: [],
          totalPageNum: 0, //总页数
          total: 0, //总条数
          pageIndex: 1, //当前页
          pageSize: 5 //单页条数
        },
        // 下级契约
        type2: {
          contractList: [],
          totalPageNum: 0, //总页数
          total: 0, //总条数
          pageIndex: 1, //当前页
          pageSize: 5 //单页条数
        },
        contractItems: []
      };
    },
    methods: {
      openContractDialog() {
        this.resetContractForm();
        this.contractDialogAdd.visible = true;
        this.getContractList();
      },
      closeContractItem(item) {
        this.contractItems.splice(this.contractItems.indexOf(item), 1);
      },
      addContractItem() {
        let contractItem = { quota: "", profit: "" };
        this.contractItems.push(contractItem);
      },
      // 验证资金密码
      /* 1. 新增契约
      2. 更新契约
      3. 删除契约
      4.同意签订契约
      5.取消签订 */
      validatorCashPsd(type) {
        let password = this.form.psd;
        let self = this;
        if (!password) {
          this.$message({
            showClose: true,
            message: "资金密码不能为空",
            type: "error"
          });
          return;
        }
        if (!this.regexpPsd(password)) {
          this.$message({
            showClose: true,
            message: "资金密码格式不符合要求",
            type: "error"
          });
          return;
        }
        this.loading = true;
        request.login(
          "post",
          "/user/random",
          {
            loginname: localStorage.getItem("loginname")
          },
          success => {
            if (success.returncode == "200") {
              let random = success.data.random;
              let new_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(password).toString(),
                random
              ).toString();
              request.http(
                "post",
                "/verifyCashPW",
                {
                  cash_password: new_password
                },
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (success.returncode == 200) {
                      if (type == 1) {
                        self.onSubmit();
                      } else if (type == 2 || type == 3 || type == 4 || type == 5) {
                        self.updateContract(type);
                      }
                    } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                      request.loginAgain(self)
                    } else if (
                      success.returncode == 301 ||
                      success.returncode == 305
                    ) {
                      self.$message({
                        showClose: true,
                        message: "资金密码不正确",
                        type: "error"
                      });
                    }
                  }
                },
                error => {
                  self.loading = false;
                  this.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              );
            } else {
              self.loading = false;
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
          }
        );
      },
      //匹配6-16位数字和字母组合
      regexpPsd(psd) {
        let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$");
        if (exp.test(psd)) {
          return true;
        }
        return false;
      },
      //合同详情
      getContractDetail(contractid) {
        let self = this;
        self.contractDialogDetail.visible = true;
        let data = {
          contractid: contractid
        };
        self.loading = true;
        let url = "/contract/detail";
        request.http(
          "get",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.contractDialogDetail.data = success.data;
                self.contractItems = success.data.content;
              }
            }
          },
          error => {
            self.loading = fasle;
            self.contractDialogDetail.data = {};
          }
        );
        return true;
      },
      //上级合同详情
      getsjContractDetail(contractid) {
        let self = this;
        self.sjcontractDialogDetail.visible = true;
        let data = {
          contractid: contractid
        };
        self.sjcontractDialogDetail.loading = true;
        let url = "/contract/detail";
        request.http(
          "get",
          url,
          data,
          success => {
            self.sjcontractDialogDetail.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.sjcontractDialogDetail.data = success.data;
                self.contractItems = success.data.content;
              }
            }
          },
          error => {
            self.sjcontractDialogDetail.loading = false;
            self.sjcontractDialogDetail.data = {};
          }
        );
        return true;
      },
      // 合同更新
      /* status: 1,
     _id: '5b0fbaa28eb6f45c09325b66',
     content: [{quota: 100, profit: 1},{ quota:1000, profit:10}] } */
      /* type： 2 更新;3 删除;4 同意签订;5 取消签订 */
      updateContract(type) {
        let self = this;
        let contractid = self.contractDialogDetail.data._id;
        let status = self.contractDialogDetail.data.status;
        if (type == 4 || type == 5) {
          contractid = self.sjcontractDialogDetail.data._id;
          status = self.sjcontractDialogDetail.data.status;
        }
        let content = self.contractItems;
        let data = {};
        let message = "";
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.quota || !item.profit) {
            this.$message({
              showClose: true,
              message: "投注资金或者月分红比例不能为空",
              type: "error"
            });
            return;
          }
        }
        if (type == 2) {
          data = {
            contractid: contractid,
            content: content
          };
          message = "更新";
        }
        else if (type == 3) {
          data = {
            contractid: contractid,
            status: 3
          };
          message = "删除";
        }
        else if (type == 4) {
          data = {
            contractid: contractid,
            status: 2
          };
          message = "同意";
        }
        else if (type == 5) {
          data = {
            contractid: contractid,
            status: 3
          };
          message = "否定";
        }
        if (type == 4 || type == 5) {
          self.sjcontractDialogDetail.loading = true;
        } else {
          self.contractDialogDetail.loading = true;
        }
        let url = "/contract/update";
        request.http(
          "post",
          url,
          data,
          success => {
            if (type == 4 || type == 5) {
              self.sjcontractDialogDetail.loading = false;
            } else {
              self.contractDialogDetail.loading = false;
            }
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "契约" + message + "成功",
                  type: "success"
                });
                setTimeout(function() {
                  if (type == 4 || type == 5) {
                    self.sjcontractDialogDetail.loading = false;
                    self.sjcontractDialogDetail.visible = false;
                  } else {
                    self.contractDialogDetail.loading = false;
                    self.contractDialogDetail.visible = false;
                  }
                  self.resetContractForm();
                  self.getContractList(1);
                  self.getContractList(2);
                }, 1000)
              }
            }
          },
          error => {
            if (type == 4 || type == 5) {
              self.sjcontractDialogDetail.loading = false;
              self.sjcontractDialogDetail.visible = false;
            } else {
              self.contractDialogDetail.loading = false;
              self.contractDialogDetail.visible = false;
            }
            self.resetContractForm();
            self.contractDialogDetail.data = {};
            self.$message({
              showClose: true,
              message: "契约" + message + "失败",
              type: "success"
            });
          }
        );
        return true;
      },
      getTime(time) {
        return moment(time).format("YYYY-MM-DD , HH:mm:ss");
      },
      getType(type) {
        //  类型 1: 工资 2：分红
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
      getStatus(status) {
        // 状态 1： 申请 2： 生效 3： 取消
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
      type1HandleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      type1HandleCurrentChange(val) {
        this.type1.pageIndex = val;
        this.getContractList(1);
      },
      type2HandleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      type2HandleCurrentChange(val) {
        this.type2.pageIndex = val;
        this.getContractList(2);
      },
      contractDialogAddChange(value) {
        this.contractDialogAdd.visible = false;
      },
      contractDialogDetailChange(value) {
        this.contractDialogDetail.visible = false;
      },
      sjcontractDialogDetailChange(value) {
        this.sjcontractDialogDetail.visible = false;
      },
      onSubmit() {
        let self = this;
        let loginname = self.form.loginname;
        if (!loginname) {
          this.$message({
            showClose: true,
            message: "下级用户名不能为空",
            type: "error"
          });
          return;
        }
        if (!this.regexpPsd(loginname)) {
          this.$message({
            showClose: true,
            message: "下级用户名格式不正确",
            type: "error"
          });
          return;
        }
        if (self.contractItems.length == 0) {
          this.$message({
            showClose: true,
            message: "请点击加号新增一条契约",
            type: "error"
          });
          return;
        }
        for (let i = 0; i < self.contractItems.length; i++) {
          let item = self.contractItems[i];
          if (!item.quota || !item.profit) {
            this.$message({
              showClose: true,
              message: "投注资金或者月分红比例不能为空",
              type: "error"
            });
            return;
          }
        }
        let data = {
          loginname: self.form.loginname,
          content: self.contractItems,
          type: 2
        };
        let url = "/contract/create";
        self.contractDialogAdd.loading = true;
        request.http(
          "post",
          url,
          data,
          success => {
            self.contractDialogAdd.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$message({
                  showClose: true,
                  message: "契约签订成功",
                  type: "success"
                });
                setTimeout(function() {
                  self.contractDialogAdd.visible = false;
                  self.getContractList(1);
                  self.getContractList(2);
                }, 1000)
              } else if (success.returncode == 301) {
                self.$message({
                  showClose: true,
                  message: "下级用户不存在",
                  type: "error"
                });
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
            self.contractDialogAdd.loading = false;
            self.$message({
              showClose: true,
              message: "契约签订失败",
              type: "success"
            });
          }
        );
        return true;
      },
      // 获取契约列表
      getContractList(type) {
        let self = this;
        let data = {};
        data["type"] = type;
        data["category"] = 2;
        if (type == 1) {
          data["page_num"] = self.type1.pageIndex;
          data["page_size"] = self.type1.pageSize;
        } else if (type == 2) {
          data["page_num"] = self.type2.pageIndex;
          data["page_size"] = self.type2.pageSize;
        }
        self.loading = true;
        let url = "/contract/list";
        request.http(
          "get",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                if (type == 1) {
                  self.type1.total = success.data.total;
                  if (self.type1.total) {
                    self.type1.noResult = false;
                    self.type1.totalPageNum = success.data.total_page_num;
                    self.type1.contractList = success.data.data;
                  } else {
                    self.type1.noResult = true;
                    self.type1.contractList = [];
                  }
                } else if (type == 2) {
                  self.type2.total = success.data.total;
                  if (self.type2.total) {
                    self.type2.noResult = false;
                    self.type2.totalPageNum = success.data.total_page_num;
                    self.type2.contractList = success.data.data;
                  } else {
                    self.type2.noResult = true;
                    self.type2.contractList = [];
                  }
                }
              }
            }
          },
          error => {
            self.loading = fasle;
          }
        );
        return true;
      },
      //重置 contractDialog的表单内容
      resetContractForm() {
        this.form.loginname = "";
        this.form.psd = "";
        this.contractItems = [];
      }
    },
    computed: {
      getCurrentUserName() {
        return localStorage.getItem("loginname ");
      },
      getAllContractList() {}
    },
    mounted() {
      this.getContractList(1);
      this.getContractList(2);
    }
  };
</script>
<style scoped>
  .contract-link-detail {
    width: 66px;
    height: 30px;
    line-height: 30px;
    background: #6ab355;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    color: #fff;
  }

  .contract-link-detail.edit {
    background: #b35555;
  }

  .mt-58 {
    margin-top: 58px;
  }

  .tab-line {
    border-left: 8px solid #d4914d;
    height: 20px;
    line-height: 20px;
    text-align: left;
    padding: 0 6px;
    margin-bottom: 18px;
    font-size: 14px;
  }

  .no-result p {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .record-group .no-result.group-item {
    border-bottom: 1px solid #eeeeee;
  }

  .inline {
    display: inline-block;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  a {
    text-decoration: none;
    color: #333333;
    cursor: pointer;
  }

  .lottery-wrap {
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  .record-tabs {
    height: 44px;
    background: rgba(212, 145, 77, 1);
    border-radius: 4px;
    padding: 5px;
    display: table;
  }

  .record-tabs .tab-item {
    width: 88px;
    height: 34px;
    display: table-cell;
    vertical-align: middle;
    line-height: 34px;
    color: #fff;
  }

  .record-tabs .tab-item.active {
    background: #f9efef;
    border-radius: 4px;
    color: #333;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .record-options {
    background: #ffffff;
    padding-top: 27px;
    padding-bottom: 39px;
  }

  .record-options .option-row {
    text-align: left;
    margin-bottom: 20px;
    font-size: 12px;
    color: #333333;
  }

  .record-options .option-row>input[type="text"] {
    display: inline-block;
    width: 158px;
    height: 30px;
    line-height: 30px;
    padding: 4px 5px;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #ffffff;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
    margin: 0 14px;
  }

  .record-options .option-row .exp {
    width: 100px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
  }

  .ml-160 {
    margin-left: 160px;
  }

  .record-options .option-row .exp-input {
    width: 100px;
    height: 30px;
    display: inline-block;
    line-height: 28px;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    text-indent: 8px;
  }

  .record-options .option-row .exp-input:focus {
    outline: none;
    border-color: #d4914d;
  }

  .record-options .option-row .exp-large-input {
    display: inline-block;
    width: 171px;
    height: 45px;
    line-height: 45px;
    padding: 4px 0;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #fef1ab;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
    text-indent: 8px;
  }

  .link-create {
    width: 124px;
    height: 44px;
    background: -webkit-linear-gradient(#ffb126, #9a4e02);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#ffb126, #9a4e02);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#ffb126, #9a4e02);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(#ffb126, #9a4e02);
    /* 标准的语法 */
    border-radius: 4px;
    cursor: pointer;
    line-height: 44px;
    text-decoration: none;
    display: inline-block;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }

  .ml-86 {
    margin-left: 86px;
  }

  .record-options .option-row .exp-large-input:focus {
    outline: none;
  }

  .record-group {
    width: 978px;
    margin: 0 auto;
  }

  .record-group .group-title {
    background: #d4914d;
    color: #fff;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    height: 34px;
  }

  .record-group .group-title>th:after {
    content: " ";
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  }

  .record-group .group-item {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
  }

  .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 56px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    border: 1px solid #8d8d8d;
    text-align: center;
    margin-right: 3px;
  }

  .record-options .option-row>a.time:hover {
    background: #d4914d;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .record-group .group-item:nth-child(2n + 1) {
    background: #f7f7f7;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #f0bd88;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 34px;
    line-height: 34px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .success {
    color: #099f4c;
  }

  .failed {
    color: #e10c0c;
  }

  .record-pagination {
    padding: 30px 0;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  .record-pagination>a {
    float: right;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #e9e9e9;
    margin-left: 11px;
    font-size: 12px;
  }

  .record-pagination>span {
    float: right;
    font-size: 12px;
    margin-left: 20px;
  }

  .record-options .option-row>a.submit {
    position: relative;
    display: inline-block;
    height: 28px;
    padding: 0 29px;
    line-height: 25px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    font-family: microsoft yahei;
    background-color: #d4914d;
    border: 1px solid #ccc;
    box-shadow: none;
    margin-left: 20px;
  }

  .contract-add-link {
    background: #b35555;
    border-radius: 4px;
    width: 120px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    color: #ffffff;
    float: right;
  }

  .contract-add-link>span {}

  .contract-add-link>i {
    width: 14px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    background: url("../img/user.png") no-repeat;
    background-size: cover;
    height: 16px;
  }

  .contract-add-class {
    border-radius: 8px;
    background: transparent;
  }

  .dialog-table {
    width: 100%;
    border: 1px solid #e8e8e8;
  }

  .dialog-table td {
    border: 1px solid #e8e8e8;
    color: #333;
    font-size: 14px;
    line-height: 48px;
    height: 50px;
  }

  .dialog-table td.title {
    border: 1px solid #e8e8e8;
    color: #333;
    font-size: 14px;
    line-height: 48px;
    height: 50px;
    background: #f2f2f2;
  }

  .dialog-table .td-left {
    background: #f2f2f2;
  }

  .dialog-table .td-right {
    padding-left: 20px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .contract-dialog-add {
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .contract-dialog-add>i {
    background: url("../assets/img/icon_Add@3x.png") no-repeat;
    background-size: cover;
    height: 20px;
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  .contract-dialog-delete {
    background: url("../assets/img/icon_Delete@3x.png") no-repeat;
    background-size: cover;
    height: 20px;
    width: 20px;
    display: inline-block;
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

  input.type2 {
    width: 112px;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    display: inline-block;
    margin: 0 10px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
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
</style>