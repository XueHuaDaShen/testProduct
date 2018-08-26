<!-- 转账管理 -->
<template>
  <div class="contract-manage">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap"><label>订单号：</label><el-input clearable v-model="form.order_no" placeholder="订单号"></el-input></div>
          <div class="search-inner-wrap"><label>转账从：</label><el-input clearable v-model="form.transferFrom" placeholder="转账从"></el-input></div>
          <div class="search-inner-wrap"><label>转账到：</label><el-input clearable v-model="form.transferTo" placeholder="转账到"></el-input></div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="form.status.selected" placeholder="请选择状态">
              <el-option v-for="item in form.status.options" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="form.searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-btn">
            <el-button type="danger" @click="handleSearch" size="medium">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium">重置</el-button>
          </div>

          <!-- <el-select v-model="form.type.selected" clearable placeholder="类型" style="width:10%;margin-left:15px;float:left;">
            <el-option v-for="(item,index) in form.type.options" :key="index" :label="item.key" :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch" style="width:10%;margin-left:15px;float:left;"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%">
        <el-table-column prop="order_no" align="center" label="编号">
        </el-table-column>
        <el-table-column align="center" label="日期">
          <template slot-scope="scope">
            {{getTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column prop="loginid.loginname" align="center" label="转账从">
        </el-table-column>
        <el-table-column prop="transfer_loginid.loginname" align="center" label="转账到">
        </el-table-column>
        <el-table-column prop="trade_before" align="center" label="转账前余额">
        </el-table-column>
        <el-table-column prop="trade_current" align="center" label="转账后余额">
        </el-table-column>
        <el-table-column prop="amount" align="center" label="金额">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{getStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
          layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import request from "../../axios/axios";
import tableBtn from "../littleStyle/tableBtn";
import moment from "moment";
import { trim } from "../../lib/utils/validator";

export default {
  name: "transfer",
  components: {
    tableBtn
  },
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: '转账记录',
      routerArr: [
        {title: '转账记录', name: 'transfer', checked: false},
      ],
      loading: false,
      list: [],
      form: {
        order_no: "", // 订单号
        transferFrom: "", // 转账从
        transferTo: "", // 转账到
        //类型 4转入 5转出
        type: {
          options: [
            {
              key: "转出",
              value: [5]
            }
          ],
          selected: null,
          getValue() {
            if (this.selected) {
              return this.selected;
            }
            return [5];
          }
        },
        // 状态 0: 默认 1： 提交 2， 处理中 3： 成功 4： 失败
        status: {
          options: [
            {
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
          },{
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
      testUser: [{
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      is_test: '',
      totalPageNum: 0, //总页数
      total: 0, //总条数
      pageIndex: 1, //当前页
      pageSize: 5 //单页条数
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
      if(v.url === 'transfer'){
        this.titleName = v.menu_name;
      }
      o.title = v.menu_name;
      o.name = v.url;
      o.checked = false;
      this.routerArr.push(o);
    })
    this.routerArr.filter(v => {
      if(this.titleName === v.title){
        v.checked = true
      }else{
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
    handleSearch() {
      this.pageIndex = 1;
      this.getList();
    },
    handleReset() {
      this.form.order_no = '';
      this.form.transferFrom = '';
      this.form.transferTo = '';
      this.form.status.selected = '';
      this.form.searchTime = '';
      this.is_test = '';
    },
    formatTestUser(row, column, cellValue) {
      let t = '';
      if(cellValue === 1){
        t = '是'
      }else{
        t = '否'
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
        beginTime: beginTime,
        endTime: endTime,
        outUser: trim(vm.form.transferFrom),
        inUser: trim(vm.form.transferTo),
        status: vm.form.status.selected,
        type: vm.form.type.getValue(),
        order_no: trim(vm.form.order_no),
        PageSize: vm.pageSize,
        PageNum: vm.pageIndex,
        is_test: vm.is_test
      };
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
              } else {
                vm.list = [];
                vm.$alert("没有符合条件的记录", "系统提醒", {
                  confirmButtonText: "确定",
                  center: true
                });
              }
            } else if (success.returncode == 303) {
              vm.list = [];
              vm.$alert("没有符合条件的记录", "系统提醒", {
                confirmButtonText: "确定",
                center: true
              });
            } else if (success.returncode == 303) {
              vm.list = [];
              vm.$alert("没有符合条件的记录", "系统提醒", {
                confirmButtonText: "确定",
                center: true
              });
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
    getType(type) {
      let text = "";
      switch (type) {
        case 4:
          text = "转入";
          break;
        case 5:
          text = "转出";
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
      // console.log(`每页 ${val} 条`);
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

.contract-manage .contract-table {
}

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
