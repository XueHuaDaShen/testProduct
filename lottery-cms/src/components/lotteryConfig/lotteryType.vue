<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>彩种：</label>
            <el-select v-model="gameid" clearable placeholder="所有彩种" class="small">
              <el-option-group v-for="group in lotteryList" :key="group.name" :label="group.name">
                <el-option v-for="item in group.childLotterys" :key="item.code" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group>
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
      <div v-for="(table, index) in lotteryTypeData" :key="index">
        <!-- header-row-class-name="table-header"  :span-method="objectSpanMethod" -->
        <el-table :data="table.childLotterys" stripe border style="width: 100%;font-size:12px;" :show-header="index==0">
          <el-table-column align="center" prop="name" label="彩种">
          </el-table-column>
          <!-- <el-table-column align="center" min-width="130" label="自定义名称">
            <template slot-scope="scope">
              <el-input @change="handleEditData(scope.row)" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column> -->
          <el-table-column align="center" width="110" label="最高奖金额" prop="max_prize">
            <!-- <template slot-scope="scope">
              <el-input type="text" @change="handleEditData(scope.row)" v-model="scope.row.max_prize"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column align="center" width="110" label="最大奖金组" prop="max_refund">
            <!-- <template slot-scope="scope">
              <el-input type="text" @change="handleEditData(scope.row)" v-model="scope.row.max_refund"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column align="center" width="110" label="最小奖金组" prop="min_refund">
            <!-- <template slot-scope="scope">
              <el-input type="text" @change="handleEditData(scope.row)" v-model="scope.row.min_refund"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column align="center" label="diff值" prop="diff">
            <!-- <template slot-scope="scope">
              <el-input type="text" @change="handleEditData(scope.row)" v-model="scope.row.diff"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column align="center" label="排序值" prop="order">
            <!-- <template slot-scope="scope">
              <el-input type="text" @change="handleEditData(scope.row)" v-model="scope.row.order"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column align="center" label="开启">
            <template slot-scope="scope">
              <el-switch @change="handleEditData(scope.row)" :inactive-value="0" :active-value="1" v-model="scope.row.enabled" active-color="#2D996E"
                inactive-color="#C83A4C"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button class="small edit">测试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="fenye">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
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
  export default {
    name: 'lotteryType',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        gameid: "",
        lotteryList: "",
        titleName: '彩种管理',
        routerArr: [{
            title: '开奖管理',
            name: 'lottery',
            checked: false
          },
          {
            title: '彩种管理',
            name: 'lotteryType',
            checked: false
          },
          {
            title: '玩法管理',
            name: 'playType',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 10,
        tableData: 0,
        lotteryTypeData: [],
        username: '',
        searchTime: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        ip: '',
        keywords: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
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
        if(v.url === 'lotteryType'){
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
      this.getLotteryList();
      this.getLotteryTypeList();
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
      succee() {
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
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        // console.log('row--------------当前行---------',row )
        // console.log('column-----------当前列---------',column )
        // console.log('rowIndex---------当前行号-------',rowIndex )
        // console.log('columnIndex------当前列号-------',columnIndex )
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: row.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getLotteryTypeList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
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
      getLotteryTypeList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/game/list', {
            gameid: vm.gameid
          },
          (success) => {
            vm.loading = false;
            // console.log('lotteryType--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryTypeData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
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
            vm.loading = false;
            // console.log('lotteryType--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryList = success.data;
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
        this.gameid = "";
      },
      handleSearch() {
        this.getLotteryTypeList();
        // console.log(this.username, this.searchTime, this.ip, this.keywords)
      },
      handleEditData(row) {
        // console.log('row', row)
        const vm = this;
        let o = new Object();
        for (let i in row) {
          if (i === '_id') {
            o.id = row._id
          } else {
            o[i] = row[i]
          }
        };
        request.http(
          'post',
          '/lottery/game/update',
          o,
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.succee();
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

</style>
