<template>
  <div style="width:100%;height:100%;">
    <div>
      <div class="yinhangka-content">
        <el-table :data="tableData" v-loading="dataLoading" empty-text="没有符合当前条件的记录" style="width: 100%">
          <el-table-column prop="bank" label="开户行" align="center" width="180">
          </el-table-column>
          <el-table-column label="开户地区" align="center" width="180">
            <template slot-scope="scope">
              <span>
                {{scope.row.province}}&nbsp;&nbsp;{{scope.row.city}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="card_no" align="center" label="银行卡号" width="160">
          </el-table-column>
          <el-table-column prop="realname" label="账户名" align="center">
          </el-table-column>
          <el-table-column prop="create_at" width="160" :formatter="formatTime" align="center" label="添加时间">
          </el-table-column>
        </el-table>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total" class="abs">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import request from '../../axios/axios.js';
  export default {
    name: 'jilu',
    components: {
      tableBtn
    },
    props: {
      loginname: {
        type: String
      }
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 10,
        pickerOptions1: {
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
        tableData: [],
        dataLoading: false,
      }
    },
    methods: {
      handleSearch() {
        this.getjilu();
      },
      handleReset() {
        this.searchTime = '';
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      getjilu() {
        var vm = this;
        vm.tableData = [];
        vm.dataLoading = true;
        request.http(
          'get',
          '/user/bankcard/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: vm.loginname,
          },
          (success) => {
            vm.dataLoading = false;
            // console.log('yinhangka--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.tableData = success.data
              vm.showTable = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.dataLoading = false;
            console.log(error)
          }
        )
        // request.http('get', '/treasure/winner/list', {"page": 1,"size": 10}, 'callback', 'fallback');
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getjilu();
        // console.log(`当前页: ${val}`);
      },
    },
    mounted() {
      this.getjilu();
    },
  }

</script>
<style scoped>
  .yinhangka-content {
    background-color: #fff;
    /* width: 96%; */
    margin: 10px auto 30px;
    /* box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12); */
  }

  .abs {
    position: absolute;
    bottom: 5px;
    right: 0;
    left: 0;
  }

</style>
