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
          <!-- <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model="username" placeholder="用户名" style="width:114px;"></el-input>
          </div> -->
          <div class="search-inner-wrap">
            <label>平台名：</label>
            <el-select clearable v-model="platform" placeholder="请选择平台" class="small">
              <el-option v-for="item in platformArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>排序栏：</label>
            <el-select v-model="order" clearable placeholder="请选择分类" class="small">
              <el-option v-for="item in orderArr" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>顺序：</label>
            <el-select v-model="desc" clearable placeholder="请选择顺序" class="small">
              <el-option v-for="item in descArr" :key="item.val" :label="item.title" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-checkbox v-model="dateChecked" :true-label="0" :false-label="1" size="small">累计显示</el-checkbox>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="状态">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
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
    <div class="data-table" v-loading="loading">
      <el-table :data="lotteryColligateListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="总计" :summary-method="getSummaries">
        <!-- <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column align="center" prop="gamename" label="平台">
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{formatTime2(scope.row)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="gamename" label="游戏名">
        </el-table-column> -->
        <el-table-column align="center" prop="vote" label="投注额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="rebate" label="返点" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="user_count" label="玩家人数">
        </el-table-column>
        <el-table-column align="center" prop="profit" label="盈利" :formatter="formatMoney">
        </el-table-column>
        <!-- <el-table-column align="center" prop="bid_invalid" label="撤单总额">
        </el-table-column>
        <el-table-column align="center" prop="rebate_ex" label="代理返点">
        </el-table-column>
        <el-table-column align="center" prop="bid_valid" label="有效投注金额">
        </el-table-column>
        <el-table-column align="center" prop="reward" label="奖金">
        </el-table-column>
        <el-table-column align="center" prop="day" :formatter="formatTime" label="投注日期">
        </el-table-column>
        <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
        <!-- <el-table-column align="center" prop="pay_at" :formatter="formatTime" label="实发工资日期">
        </el-table-column> -->
        <!-- <el-table-column align="center" prop="status" :formatter="isStatusFn" label="发放工资">
        </el-table-column> -->
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
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "thirdpartTable",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        dateChecked: 1,
        index1: 0,
        index2: 0,
        titleName: '第三方游戏',
        routerArr: [{
          title: '彩票报表',
          name: 'lotteryColligate',
          checked: false
        }, {
          title: '第三方游戏',
          name: 'thirdpartTable',
          checked: false
        }],
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
        platform: "",
        orderArr: [{
            title: '投注额',
            code: 'vote'
          },
          {
            title: '返点',
            code: 'rebate'
          },
          {
            title: '玩家人数',
            code: 'user_count'
          },
          {
            title: '盈利',
            code: 'profit'
          },
          {
            title: '游戏时间',
            code: '_id.day'
          },
        ],
        descArr: [{
            title: '升序',
            val: '1'
          },
          {
            title: '降序',
            val: '-1'
          }
        ],
        order: '_id.day',
        desc: '-1',
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        lotteryColligateListData: [],
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
            value: "0",
            label: "未发工资"
          },
          {
            value: "1",
            label: "已发工资"
          }
        ],
        type: "",
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
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        currId: ""
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
        if (v.url === 'thirdpartTable') {
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
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      end.setTime(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
        )
      );
      this.searchTime = [start, end];
      this.getLotteryColligateList();
    },
    methods: {
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "总计";
            return;
          }
          let values = data.map(item => Number(item[column.property]));
          if ((index === 2 || index === 3 || index === 5) && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = parseFloat(sums[index]).toFixed(2);
            sums[index] += " 元";
          } else {
            if ((index === 2 || index === 3 || index === 5)) {
              sums[index] = "0.00元";
            } else
              sums[index] = "--";
          }
        });

        return sums;
      },
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "0.00"
      },
      formatTime2(row) {
        if (row._id && row._id.day) {
          return moment(row._id.day).utcOffset(8).format("YYYY-MM-DD");
        }
        return '--'
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
      succee() {
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
            return "未发工资";
          case 1:
            return "已发工资";
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getLotteryColligateList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getLotteryColligateList();
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
        return moment(cellValue).format("YYYY-MM-DD");
        // return moment(cellValue).format('YYYY-MM-DD')
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
      getLotteryColligateList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime) {
          if (vm.searchTime.toString() !== "") {
            beginTime = new Date(vm.searchTime[0]);
            endTime = new Date(vm.searchTime[1]);
          }
        }
        let data = {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          startTime: beginTime,
          endTime: endTime,
          is_test: vm.is_test,
          order: vm.order,
          platform: vm.platform,
          date: vm.dateChecked,
          desc: vm.desc
        };
        if (vm.desc) {
          data['desc'] = Number(vm.desc);
        }
        vm.loading = true;
        request.http(
          "get",
          "/statistic/game/list",
          data,
          success => {
            vm.loading = false;
            // console.log("lotteryColligateList--------", success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryColligateListData = success.data;
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
        // this.username = "";
        this.searchTime = "";
        // this.type = "";
        this.order = "";
        this.desc = "";
        this.is_test = "0";
        this.platform = "";
        this.dateChecked = 1;
      },
      handleSearch() {
        this.pageNum = 1;
        this.getLotteryColligateList();
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
