<template>
  <div>
    <div style="padding: 12px 20px 0px;">
      <div class="baobiao-search-term">
        <div class="baobiao-search-time">
          <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
        <div class="baobiao-search-btn">
          <tableBtn :text="'搜索'" :size="'medium'" :btnType="'success'" :plain="false" :func="handleSearch"></tableBtn>
        </div>
        <div class="baobiao-search-btn">
          <tableBtn :text="'重置'" :size="'medium'" :btnType="'info'" :plain="false" :func="handleReset"></tableBtn>
        </div>
      </div>
      <div class="baobiao-content">
        <el-table :data="tableData" show-summary :summary-method="getSummaries" v-loading="dataLoading" empty-text="没有符合当前条件的记录"
          style="width: 100%" max-height="450">
          <el-table-column label="投注" align="center" width="180">
            <template slot-scope="scope">
              {{scope.row.totalVote.toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="奖金">
            <template slot-scope="scope">
              {{scope.row.totalAward.toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="totalRefund" align="center" label="返点">
          </el-table-column>
          <el-table-column align="center" prop="profit" label="收益">
            <template slot-scope="scope">
              {{scope.row.profit.toFixed(2)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination> -->
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import request from '../../axios/axios.js';
  export default {
    name: 'baobiao',
    components: {
      tableBtn
    },
    props: {
      loginname: {
        type: String,
      }
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 40,
        total: 0,
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
        searchTime: '',
        dataLoading: false,
      }
    },
    methods: {
      handleSearch() {
        this.getbaobiao();
      },
      handleReset() {
        this.searchTime = '';
      },
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计：';
            return;
          }
          if (index === 3) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              // sums[index] += ' 元';
              return;
            }
          }
        });

        return sums;
      },
      getbaobiao() {
        var vm = this;
        vm.dataLoading = true;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        request.http(
          'get',
          '/user/trade/report', {
            loginname: vm.loginname,
            beginTime: beginTime,
            endTime: endTime
          },
          (success) => {
            vm.dataLoading = false;
            // console.log('baobiao--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.tableData = success.agg
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
        this.getbaobiao();
        // console.log(`当前页: ${val}`);
      },
    },
    mounted() {
      this.getbaobiao();
    },
  }

</script>
<style scoped>
  * {
    box-sizing: border-box;
  }

  .baobiao-search-term {
    width: 100%;
    display: -webkit-box;
    -webkit-box-pack: start;
    padding: 20px;
    /* display:flex;
    flex-wrap:wrap; */
  }

  .baobiao-search-term>.baobiao-search-time {
    width: auto;
  }

  .baobiao-search-term>.baobiao-search-btn {
    width: auto;
  }

  .baobiao-content {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

</style>
