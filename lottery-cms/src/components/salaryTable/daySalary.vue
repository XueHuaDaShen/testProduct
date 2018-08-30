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
            <el-input clearable v-model="username" placeholder="用户名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>查询时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
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
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button @click="multiplerefund" class="edit">批量发放</el-button>
          <el-button @click="onekeyrefund" class="edit">一键发放</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="daySalaryListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable='checkboxInit'>
        </el-table-column>
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="parent.name" label="上级代理">
        </el-table-column>
        <!-- <el-table-column align="center" prop="proxy" width="110" label="代理层级关系">
        </el-table-column> -->
        <el-table-column align="center" prop="personal_salary" width="110" label="个人实发工资" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="team_flow" label="团队流水" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="team_salary" width="110" label="团队工资总额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="day" :formatter="formatTime" width="110" label="应发工资日期">
        </el-table-column>
        <el-table-column align="center" prop="pay_at" :formatter="formatTime" width="110" label="实发工资日期">
        </el-table-column>
        <!-- <el-table-column align="center" prop="pay_at" width="80" :formatter="formatTestUser" label="测试用户">
        </el-table-column> -->
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="发放状态">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="一键发放" :before-close="closeOneKeyForm" :visible.sync="onekeyVisible">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">应发时间</span>
            <span class="exp-after">:</span>
            <el-date-picker v-model="onekeyForm.time" align="right" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onekeyrefundFn" class="yes">确 定</el-button>
        <el-button @click="closeOneKeyForm" class="no">取 消</el-button>
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
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "daySalary",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '工资报表',
        routerArr: [{
            title: "游戏返点",
            name: "gameRebate",
            checked: false,
          }, {
            title: '工资报表',
            name: 'daySalary',
            checked: false
          },
          {
            title: '分红报表',
            name: 'monthProfit',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 10,
        daySalaryListData: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime()) - 3600 * 1000 * 24 * 1);
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) -
                  3600 * 1000 * 24 * 1);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "本周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            }, {
              text: "上周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString())
                  .getTime() -
                  3600 * 1000 * 24 * 7);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1 - 3600 * 1000 * 24 * 7);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker
                  .$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "本月",
              onClick(picker) {
                let now = new Date();
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                //获得本月的开始日期
                let getMonthStartDate = new Date(nowYear, nowMonth, 1);
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(new Date(new Date(nowYear, nowMonth, days).toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 - 1);
                // console.log("start", getMonthStartDate.toLocaleString());
                // console.log("end", getMonthEndDate.toLocaleString());
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "上月",
              onClick(picker) {
                var firstdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                var date = new Date();
                var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                var enddate = new Date(new Date(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", firstdate.toLocaleString());
                // console.log("end", enddate.toLocaleString());
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 7);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        statusArr: [{
            value: "",
            label: "全部"
          }, {
            value: "0",
            label: "未发工资"
          },
          {
            value: "1",
            label: "已发工资"
          }
        ],
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
        type: "",
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        currId: "",
        onekeyForm: {
          time: ""
        },
        onekeyVisible: false,
        multipleSelection: []
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
        if (v.url === 'daySalary') {
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
      this.getDaySalaryList();
    },
    methods: {
      closeOneKeyForm() {
        this.onekeyVisible = false;
        this.resetForm();
      },
      // 初始化已发放工资行  不可选中
      checkboxInit(row, index) {
        if (row.status == 1)
          return 0; //不可勾选
        else
          return 1; //可勾选
      },
      // 批量发放
      multiplerefund() {
        const vm = this;
        if (vm.multipleSelection.length == 0) {
          this.$message({
            message: "未勾选行",
            type: "warning",
            duration: vm.duration,
            center: true
          });
          return;
        }
        this.$confirm('确定向所选用户发放返点吗?', '批量发放', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.http(
            "post",
            "/statistic/multiplesalary", {
              ids: vm.multipleSelection
            },
            success => {
              let code = success.returncode;
              if (code === 200) {
                vm.$message({
                  message: "发放工资成功",
                  type: "success",
                  duration: vm.duration,
                  center: true
                });
                setTimeout(function () {
                  vm.getDaySalaryList();
                }, 1500);
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm);
              } else {
                vm.$message({
                  message: "发放工资失败",
                  type: "error",
                  duration: vm.duration,
                  center: true
                });
              }
            },
            error => {
              vm.error();
              console.log(error);
            }
          );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 一键发放
      onekeyrefund() {
        this.onekeyVisible = true;
        this.resetForm();
      },
      onekeyrefundFn() {
        const vm = this;
        if (!this.onekeyForm.time) {
          this.$message({
            message: "请选择时间",
            type: "error",
            duration: vm.duration
          });
          return;
        }
        request.http(
          "post",
          "/statistic/onekeysalary", {
            refundTime: vm.onekeyForm.time
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.$message({
                message: "发放工资成功",
                type: "success",
                duration: vm.duration,
                center: true
              });
              vm.closeOneKeyForm();
              setTimeout(function () {
                vm.getDaySalaryList();
              }, 1500);
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        );
      },
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "--"
      },
      handleSelectionChange(val) {
        // this.multipleSelection = val;
        // console.log("val", val);
        if (val.length != 0) {
          for (let i = 0; i < val.length; i++) {
            let o = val[i];
            if (o._id) {
              this.multipleSelection.push(o._id);
            }
          }
        } else {
          this.multipleSelection = [];
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
        // console.log(name)
      },
      succee() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration
        });
      },
      error() {
        const vm = this;
        this.$message({
          message: "加载失败",
          type: "error",
          duration: vm.duration
        });
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "未发工资";
          case 1:
            return "已发工资";
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getDaySalaryList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getDaySalaryList();
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
        if (cellValue) {
          return moment(cellValue).utcOffset(8).format("YYYY-MM-DD");
        }
        return '--'
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
      getDaySalaryList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        // console.log(beginTime,endTime)
        request.http(
          "get",
          "/statistic/daily/salary/list", {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
            loginname: trim(vm.username),
            startTime: beginTime,
            endTime: endTime,
            status: vm.status,
            is_test: vm.is_test,
            order: "day",
            desc: "-1"
          },
          success => {
            vm.loading = false;
            // console.log("daySalaryList--------", success);
            let code = success.returncode;
            if (code === 200) {
              vm.daySalaryListData = success.data;
              vm.pageNum = Number(success.PageNum) || 1;
              vm.total = success.count;
              vm.succee();
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
        this.order_no = "";
        this.is_test = "0";
      },
      handleSearch() {
        this.pageNum = 1;
        this.getDaySalaryList();
      },
      resetForm() {
        this.onekeyForm.time = "";
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
