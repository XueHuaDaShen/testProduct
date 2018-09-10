<template>
  <div class="el-custom">
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
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>彩种：</label>
            <el-select v-model="gameid" clearable placeholder="所有彩种" class="small" @change="gameidChange">
              <el-option-group v-for="group in lotteryList" :key="group.name" :label="group.name">
                <el-option v-for="item in group.childLotterys" :key="item.code" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>玩法：</label>
            <el-select v-model="lotteryid" clearable placeholder="玩法" class="small">
              <el-option v-for="item in wanfalist.options" :key="item._id" :label="item.l3 +'-'+ item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="lotteryed" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.val" :label="item.label" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
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
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="betsLogList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="总计" :summary-method="getSummaries">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gamename" label="彩种">
        </el-table-column>
        <el-table-column align="center" label="玩法" prop="lotteryname">
        </el-table-column>
        <el-table-column align="center" prop="start_issue_no" label="开始期号">
        </el-table-column>
        <el-table-column align="center" className="betsNum" label="投注内容" width="120">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover" popper-class="lottery_popover" v-if="scope.row.vote_no.length > 15">
              <div class="row">
                <span style="word-break: normal;width: auto;display: block;white-space: pre-wrap;word-wrap: break-word;text-align: left;">{{scope.row.vote_no}}</span>
              </div>
              <el-button class="small edit" slot="reference">详细内容</el-button>
            </el-popover>
            <div v-else>{{scope.row.vote_no}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_vote_cash" label="追号金额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" width="80" label="已中金额">
          <template slot-scope="scope">
            <span style="color:green">￥{{scope.row.award_cash||0.00}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" label="追中即停">
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.is_hit_stop==1">是</span>
            <span style="color:red" v-if="scope.row.is_hit_stop==0">否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="追号进度">
          <template slot-scope="scope">
            {{scope.row.issue_num_finished+'/'+scope.row.issue_num}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="chaseDetail(scope.row)" class="small edit">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="追号详情" width="960px" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" stripe border>
        <el-table-column align="center" property="issue_no" label="期号" width="150"></el-table-column>
        <el-table-column align="center" property="luck_no" label="开奖结果" width="150"></el-table-column>
        <el-table-column align="center" property="vote_no" label="投注内容" width="150"></el-table-column>
        <el-table-column align="center" property="vote_cash" label="金额"></el-table-column>
        <el-table-column align="center" property="times" label="倍数" width="200"></el-table-column>
        <el-table-column align="center" property="status" label="追号状态" :formatter="getItemZHStatus"></el-table-column>
        <el-table-column align="center" property="status" label="中奖状态" :formatter="getStatusText"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer mt-30">
        <el-button type="primary" @click="dialogTableVisible = false" class="yes">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from '../../lib/utils/validator';
  export default {
    name: 'chaseLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        titleName: '彩票追号',
        routerArr: [{
            title: '彩票投注',
            name: 'betsLog',
            checked: false
          },
          {
            title: '彩票追号',
            name: 'chaseLog',
            checked: false
          }, {
            title: '棋牌游戏',
            name: 'thirdpart',
            checked: false
          }
        ],
        gameid: "",
        lotteryid: "",
        loading: false,
        dialogTableVisible: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        betsLogList: [],
        gridData: [],
        userid: '',
        loginname: '',
        username: '',
        searchTime: '',
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
        issue: '',
        betsMin: '',
        betsMax: '',
        betsNum: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,

        lotteryList: [],
        lotteryid: '',
        lotteryed: '',
        statusArr: [{
            label: '全部',
            val: ''
          }, {
            label: '进行中',
            val: '1'
          },
          {
            label: '已结束',
            val: '2'
          },
          {
            label: '用户取消',
            val: '3'
          },
          {
            label: '系统取消',
            val: '4'
          },
        ],
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
        is_test: '0',
        wanfalist: {
          options: [],
        }
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'chaseLog') {
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
      this.getBetsLotList();
      this.getLotteryList();
    },
    methods: {
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "0.00"
      },
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
          if (index === 6) {
            values = data.map(item => Number(item['award_cash']));
          }
          if ((index === 5 || index === 6) && !values.every(value => isNaN(value))) {
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
            if (index === 5 || index === 6) {
              sums[index] = "0.00元";
            } else
              sums[index] = "--";
          }
        });

        return sums;
      },
      gameidChange(val) {
        if (val) {
          this.getwanfalist(val);
        } else {
          this.wanfalist.options = [];
          this.lotteryid = ""
        }
      },
      getwanfalist(id) {
        let vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/lottery/list', {
            id: id
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.wanfalist.options = success.data;
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
      getItemZHStatus(row, column, cellValue) {
        let status;
        switch (cellValue) {
          case 1:
            status = '已投注';
            break;
          case 2:
            status = '等待中';
            break;
          case 3:
            status = '已撤销';
            break;
          case 4:
            status = '已投注';
            break;
          case 5:
            status = '已投注';
            break;
        }
        return status;
      },
      getStatusText(row, column, cellValue) {
        let status;
        switch (cellValue) {
          case 1:
            status = '待开奖';
            break;
          case 2:
            status = '-';
            break;
          case 3:
            status = '已撤销';
            break;
          case 4:
            status = '未中奖';
            break;
          case 5:
            status = '中奖';
            break;
        }
        return status;
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
          case 1:
            return '进行中';
          case 2:
            return '已结束';
          case 3:
            return '用户取消';
          case 4:
            return '系统取消';
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getBetsLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getBetsLotList();
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
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
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
      getBetsLotList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/lottery/chase/list', {
            page_num: vm.pageNum,
            page_size: vm.pageSize,
            beginTime: beginTime,
            endTime: endTime,
            beginAmount: vm.betsMin,
            endAmount: vm.betsMax,
            gameid: vm.gameid,
            issue_no: vm.issue,
            loginname: trim(vm.username),
            vote_no: vm.betsNum,
            status: vm.lotteryed,
            is_test: vm.is_test,
            lotteryid: vm.lotteryid
          },
          (success) => {
            vm.loading = false;
            // console.log('betsLogList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.betsLogList = success.data.data;
              vm.pageNum = Number(success.data.page_num);
              vm.total = success.data.total;
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
      getLotteryList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryList = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.username = '';
        this.issue = '';
        this.betsMax = '';
        this.betsMin = '';
        this.lotteryid = '';
        this.lotteryed = '';
        this.betsNum = '';
        this.searchTime = '';
        this.is_test = '0';
      },
      handleSearch() {
        this.getBetsLotList();
        // console.log(this.username, this.issue, this.betsMax, this.betsMin, this.lotteryid, this.lotteryed, this.betsNum, this.searchTime)
      },
      chaseDetail(row) {
        const vm = this;
        this.dialogTableVisible = true;
        request.http(
          'get',
          '/lottery/chase/detail', {
            chaseid: row._id
          },
          (success) => {
            // console.log('chaseDetail--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.gridData = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      }
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .betsNum {
    word-break: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .lottery_popover {
    overflow-y: scroll;
    max-height: 150px;
    width: 200px;
  }

</style>
