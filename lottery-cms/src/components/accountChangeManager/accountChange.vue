<!-- 帐变记录 -->
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
            <el-input clearable v-model="form.loginname" placeholder="用户名" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>帐变类型：</label>
            <el-select clearable v-model="form.type.selected" placeholder="请选择类型" class="small" @focus="getTypeList" :loading="form.type.loading"
              :loading-text="form.type.loadingText">
              <el-option-group v-for="group in form.type.options" :key="group._id" :label="group.name">
                <el-option v-for="item in group.child" :key="item.code" :label="item.name" :value="item.type">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>查询时间：</label>
            <el-date-picker v-model="form.searchTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试账号" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
          <!-- <el-select v-model="form.type.selected" clearable placeholder="类型" style="width:10%;margin-left:15px;float:left;">
            <el-option v-for="(item,index) in form.type.options" :key="index" :label="item.key" :value="item.value">
            </el-option>
          </el-select> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{scope.row.loginid.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" align="center" label="变动金额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column prop="trade_current" align="center" label="账户余额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="交易时间">
          <template slot-scope="scope">
            {{getTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column prop="order_no" align="center" label="流水号">
        </el-table-column>
        <!-- <el-table-column prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
        <el-table-column prop="message" align="center" label="备注">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
          :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "../../axios/axios";
  import tableBtn from "../littleStyle/tableBtn";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import moment from "moment";
  import {
    trim
  } from "../../lib/utils/validator";

  export default {
    name: "accountChange",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        loginname: "",
        userid: "",
        dialog: false,
        titleName: "帐变记录",
        routerArr: [{
          title: "帐变记录",
          name: "accountChange",
          checked: false
        }],
        loading: false,
        list: [],
        form: {
          loginname: "", // 用户名
          order_no: "", // 订单号
          transferFrom: "", // 帐变从
          transferTo: "", // 帐变到
          //类型 4转入 5转出
          type: {
            options: [],
            selected: "",
            getValue() {
              if (this.selected) {
                return this.selected;
              }
              // return [5];
            },
            loading: false,
            loadingText: "正在搜索..."
          },
          // 状态 0: 默认 1： 提交 2， 处理中 3： 成功 4： 失败
          status: {
            options: [{
                value: 0,
                text: "默认"
              },
              {
                value: 1,
                text: "提交"
              },
              {
                value: 2,
                text: "处理中"
              },
              {
                value: 3,
                text: "成功"
              },
              {
                value: 4,
                text: "失败"
              }
            ],
            selected: ""
          },
          searchTime: ""
        },
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(
                  new Date(new Date(new Date().toLocaleDateString()).getTime()) -
                  3600 * 1000 * 24 * 1
                );
                end.setTime(
                  new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
                  ) -
                  3600 * 1000 * 24 * 1
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime()
                );
                end.setTime(
                  new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
                  )
                );
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
                let getWeekStartDate = new Date(
                  nowYear,
                  nowMonth,
                  nowDay - nowDayOfWeek
                );
                let getWeekEndDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay + (6 - nowDayOfWeek)
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "上周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay - nowDayOfWeek
                    ).toLocaleDateString()
                  ).getTime() -
                  3600 * 1000 * 24 * 7
                );
                let getWeekEndDate = new Date(
                  new Date(
                    new Date(
                      nowYear,
                      nowMonth,
                      nowDay + (6 - nowDayOfWeek)
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1 -
                  3600 * 1000 * 24 * 7
                );
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
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
                var days =
                  (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(
                  new Date(
                    new Date(nowYear, nowMonth, days).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", getMonthStartDate.toLocaleString());
                // console.log("end", getMonthEndDate.toLocaleString());
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "上月",
              onClick(picker) {
                var firstdate = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 1,
                  1
                );
                var date = new Date();
                var day = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  0
                ).getDate();
                var enddate = new Date(
                  new Date(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() - 1,
                      day
                    ).toLocaleDateString()
                  ).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                // console.log("start", firstdate.toLocaleString());
                // console.log("end", enddate.toLocaleString());
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 7
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 30
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                );
                const start = new Date(
                  new Date(new Date().toLocaleDateString()).getTime() -
                  3600 * 1000 * 24 * 90
                );
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        testUser: [{
            value: "",
            label: "全显示"
          },
          {
            value: "0",
            label: "不显示"
          },
          {
            value: "1",
            label: "仅显示"
          }
        ],
        is_test: "",
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 10, //单页条数
        duration: 1000
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
        if (v.url === 'accountChange') {
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
      if (query && query.param) {
        this.form.loginname = query.param;
      }
      // console.log(query, menus[this.index1].child[this.index2])
    },
    methods: {
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "--"
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      getUserInfoFn(row) {
        if (row.loginid && row.loginid.loginname && row.loginid._id) {
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
        });
        // console.log(name)
      },
      handleSearch() {
        this.pageIndex = 1;
        this.getList();
      },
      handleReset() {
        this.form.loginname = "";
        // this.form.order_no = '';
        // this.form.transferFrom = '';
        // this.form.transferTo = '';
        // this.form.status.selected = '';
        this.form.type.selected = null;
        this.form.searchTime = "";
        this.is_test = "";
      },
      formatTestUser(row, column, cellValue) {
        let t = "";
        if (cellValue === 1) {
          t = "是";
        } else {
          t = "否";
        }
        return t;
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getList() {
        let vm = this;
        let beginTime = vm.form.searchTime[0],
          endTime = vm.form.searchTime[1];
        if (beginTime) {
          beginTime = new Date(vm.form.searchTime[0]);
        }
        if (endTime) {
          endTime = new Date(vm.form.searchTime[1]);
        }
        let data = {
          outUser: trim(vm.form.loginname),
          beginTime: beginTime,
          endTime: endTime,
          is_test: vm.is_test,
          // order_no: trim(vm.form.order_no),
          // outUser: trim(vm.form.transferFrom),
          // inUser: trim(vm.form.transferTo),
          // status: vm.form.status.selected,
          PageSize: vm.pageSize,
          PageNum: vm.pageIndex
        };
        if (vm.form.type.selected) {
          let typeFinal = [];
          typeFinal.push(vm.form.type.selected);
          data["type"] = typeFinal;
        }
        this.loading = true;
        let url = "/trade/list";
        request.http(
          "get",
          url,
          data,
          success => {
            vm.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                vm.total = success.count;
                if (vm.total) {
                  vm.totalPageNum = success.totalPage;
                  vm.list = success.data;
                  vm.message("请求成功", "success");
                } else {
                  vm.list = [];
                  // vm.$alert("没有符合条件的记录", "系统提醒", {
                  //   confirmButtonText: "确定",
                  //   center: true
                  // });
                }
              } else if (success.returncode == 303) {
                vm.list = [];
                // vm.$alert("没有符合条件的记录", "系统提醒", {
                //   confirmButtonText: "确定",
                //   center: true
                // });
              } else if (success.returncode == 303) {
                vm.list = [];
                // vm.$alert("没有符合条件的记录", "系统提醒", {
                //   confirmButtonText: "确定",
                //   center: true
                // });
              }
            }
          },
          error => {
            vm.loading = false;
            vm.list = [];
          }
        );
        return true;
      },
      // 获取帐变类型list
      getTypeList(event) {
        let vm = this;
        if (vm.form.type.options.length != 0) {
          return;
        }
        vm.form.type.loading = true;
        let url = "/trade/type/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.form.type.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                let options = success.data;
                if (options.length != 0) {
                  for (let i = 0; i < options.length; i++) {
                    let typeArr = new Array();
                    let option = options[i];
                    typeArr.push(option.type);
                    option.type = typeArr;
                  }
                  vm.form.type.options = options;
                }
              } else {
                vm.form.type.loading = false;
              }
            }
          },
          error => {
            vm.form.type.loading = false;
          }
        );
      },
      message(message, type) {
        const vm = this;
        vm.$message({
          message: message,
          type: type,
          duration: vm.duration,
          center: true
        });
      },
      getType(type) {
        let text = "";
        switch (type) {
          case 1001:
            text = "充值";
            break;
          case 1:
            text = "在线充值";
            break;
          case 20:
            text = "人工充值-充值";
            break;
          case 12:
            text = "人工充值-返点";
            break;
          case 21:
            text = "人工充值-理赔";
            break;
          case 1002:
            text = "提现";
            break;
          case 17:
            text = "提取现金";
            break;
          case 2:
            text = "提现冻结";
            break;
          case 3:
            text = "提现解冻";
            break;
          case 63:
            text = "手动申请出款";
            break;
          case 1003:
            text = "撤销";
            break;
          case 11:
            text = "人工撤销-派奖";
            break;
          case 13:
            text = "人工撤销-返点";
            break;
          case 30:
            text = "人工撤销-分红";
            break;
          case 64:
            text = "人工撤销-其他";
            break;
          case 1004:
            text = "转账";
            break;
          case 5:
            text = "转账转出";
            break;
          case 1005:
            text = "日工资";
            break;
          case 40:
            text = "日工资转入";
            break;
          case 1006:
            text = "分红";
            break;
          case 41:
            text = "分红转入";
            break;
          case 1007:
            text = "活动";
            break;
          case 42:
            text = "促销派奖-充值";
            break;
          case 43:
            text = "促销派奖-注册";
            break;
          case 1008:
            text = "投注";
            break;
          case 6:
            text = "彩票投注";
            break;
          case 7:
            text = "撤单返款";
            break;
          case 10:
            text = "派发奖金";
            break;
          case 14:
            text = "投注返点";
            break;
          case 15:
            text = "下级投注返点";
            break;
          case 60:
            text = "退回投注";
            break;
          case 1009:
            text = "追号";
            break;
          case 8:
            text = "追号冻结";
            break;
          case 9:
            text = "投注解冻";
            break;
          case 16:
            text = "追号返款";
            break;
          case 1010:
            text = "第三方";
            break;
          case 61:
            text = "额度转入";
            break;
          case 62:
            text = "额度转出";
            break;
          case 66:
            text = "撤销出款";
            break;
        }
        return text;
      },
      getTime(time) {
        return moment(time).format("YYYY-MM-DD HH:mm:ss");
      },
      getStatus(status) {
        let text = "";
        switch (status) {
          case 0:
            text = "默认";
            break;
          case 1:
            text = "提交";
            break;
          case 2:
            text = "处理中";
            break;
          case 3:
            text = "成功";
            break;
          case 4:
            text = "失败";
            break;
        }
        return text;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getList();
      }
    },
    mounted() {
      this.handleSearch();
    }
  };

</script>
<style>
  /* @import "../../publicCss/header.css"; */

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

</style>
