<template>
  <div class="rechargeLot-wrap el-custom">
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
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px;"></el-input>
          </div>
          <!--           <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </div> -->
          <div class="search-inner-wrap">
            <label>平台名：</label>
            <el-select clearable v-model="channel" placeholder="请选择平台" class="small">
              <el-option v-for="item in platformArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>资金方向：</label>
            <el-select clearable v-model="type" placeholder="资金方向" class="small">
              <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
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
    <div class="data-table" v-loading="loading">
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="channel" width="110" label="平台">
        </el-table-column>
        <el-table-column align="center" prop="amount" label="总金额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="type" :formatter="isTypeFn" label="资金方向">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <!-- <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
        <!-- <el-table-column align="center" prop="status" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1" size="text" @click="toRechargeFn(scope.row)">充值审核</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog width="30%" title="充值审核" :center="false" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="审核" prop="rechargeStatus" :label-width="formLabelWidth">
          <el-select v-model="form.rechargeStatus" placeholder="请选择状态">
            <el-option label="充值成功" value="2"></el-option>
            <el-option label="充值失败" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际充值金额" prop="realRecharge" :label-width="formLabelWidth">
          <el-input v-model="form.realRecharge" placeholder="请输入实际充值金额">
          </el-input>
        </el-form-item>
        <el-form-item label="手续费" prop="shouxufei" :label-width="formLabelWidth">
          <el-input v-model="form.shouxufei" placeholder="请输入手续费">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
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
    name: "exchange",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      var validateRecharge = (rule, value, callback) => {
        if (!price(value)) {
          callback(new Error("金额必须大于0"));
        } else {
          callback();
        }
      };
      return {
        index1: 0,
        index2: 0,
        titleName: '转账记录',
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
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        rechargeListData: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
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
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        platformArr: [{
            value: "",
            label: "所有"
          },
          {
            value: "ky",
            label: "ky"
          },
          {
            value: "ag",
            label: "ag"
          },
          {
            value: "pt",
            label: "pt"
          }
        ],
        typeArr: [{
            value: "",
            label: "所有"
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
        statusArr: [{
            value: "",
            label: "全部"
          },
          {
            value: "1",
            label: "转账成功"
          },
          {
            value: "2",
            label: "转账失败"
          }
        ],
        type: "",
        status: "",
        channel: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        form: {
          rechargeStatus: "",
          realRecharge: "",
          shouxufei: ""
        },
        rules: {
          rechargeStatus: [{
            required: true,
            message: "请选择状态",
            trigger: "change"
          }],
          realRecharge: [{
              required: true,
              message: "请输入金额",
              trigger: "change"
            },
            {
              trigger: "blur",
              validator: validateRecharge
            }
          ],
          shouxufei: [{
            required: true,
            message: "请输入金额",
            trigger: "change"
          }]
        },
        formLabelWidth: "120px",
        currId: "",
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
        if (v.url === 'exchange') {
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
        return "--"
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
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "成功";
          case 2:
            return "失败";
        }
      },
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "转出";
          case 2:
            return "转入";
        }
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
      formatTime(row, column, cellValue) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            request.http(
              "post",
              "/trade/recharge/update", {
                id: vm.currId,
                status: vm.form.rechargeStatus,
                cash_recharged: vm.form.realRecharge,
                cash_service_fee: vm.form.shouxufei
              },
              success => {
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.getRechargeLotList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.error();
                console.log(error);
              }
            );
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      toRechargeFn(row) {
        this.dialogFormVisible = true;
        this.currId = row._id;
      },
      getRechargeLotList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          "get",
          "/exchange/list", {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            type: vm.type,
            status: vm.status,
            channel: vm.channel,
            is_test: vm.is_test
          },
          success => {
            vm.loading = false;
            // console.log("rechargeLogList--------", success);
            let code = success.returncode;
            if (code === 200) {
              vm.rechargeListData = success.data.data;
              vm.pageNum = Number(success.data.page_num);
              vm.total = success.data.total;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      handleReset() {
        this.username = "";
        this.searchTime = "";
        this.type = "";
        this.status = "";
        this.channelIn = "";
        this.channelOut = "";
        this.is_test = '0';
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
