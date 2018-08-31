<template>
  <div>
    <div style="padding: 12px 20px 0px;">
      <div class="rizhi-search-term">
        <div class="rizhi-search-time">
          <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
        <!-- <div class="rizhi-search-keyWord">
          <el-input v-model="keyWord" placeholder="关键词"></el-input>
        </div> -->
        <div class="rizhi-search-btn">
          <tableBtn :text="'搜索'" :size="'medium'" :btnType="'success'" :plain="false" :func="handleSearch"></tableBtn>
        </div>
        <div class="rizhi-search-btn">
          <tableBtn :text="'重置'" :size="'medium'" :btnType="'info'" :plain="false" :func="handleReset"></tableBtn>
        </div>
      </div>
      <div class="rizhi-content">
        <el-table :data="tableData" v-loading="dataLoading" empty-text="没有符合当前条件的记录" style="width: 100%" max-height="450">
          <el-table-column prop="_id" label="编号" align="center" width="180">
          </el-table-column>
          <el-table-column prop="ip" label="ip地址" align="center" width="180">
          </el-table-column>
          <el-table-column prop="loginid.loginname" align="center" label="登录名">
          </el-table-column>
          <el-table-column prop="create_at" align="center" label="登录时间" :formatter="formatTime">
          </el-table-column>
          <el-table-column prop="detail" align="center" label="备注信息">
          </el-table-column>
        </el-table>
        <div class="rizhi-footer-page">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
            :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import request from '../../axios/axios.js';
  export default {
    name: 'rizhi',
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
        options3: [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }],
        tableData: [],
        keyWord: '',
        time1: '',
        time2: '',
        type: '',
        dataLoading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        searchTime: '',
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
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return '充值';
          case 2:
            return '提现冻结';
          case 3:
            return '提现取消或解冻';
          case 4:
            return '转入';
          case 5:
            return '转出';
          case 6:
            return '投注/加入游戏';
          case 7:
            return '撤单';
          case 8:
            return '追号冻结';
          case 9:
            return '追号解冻';
          case 10:
            return '派发奖金';
          case 11:
            return '撤销派发奖金';
          case 12:
            return '派发返点';
          case 13:
            return '撤销派发返点';
          case 14:
            return '投注返点';
          case 15:
            return '撤销追号返款';
          case 16:
            return '追号返款';
        }
      },
      getjilu() {
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
          '/user/log/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: vm.loginname,
            beginTime: beginTime,
            endTime: endTime
          },
          (success) => {
            vm.dataLoading = false;
            // console.log('jilu--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.tableData = success.data
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
    }
  }

</script>
<style scoped>
  * {
    box-sizing: border-box;
  }

  .rizhi-search-term {
    width: 100%;
    display: -webkit-box;
    -webkit-box-pack: start;
    padding: 20px;
    /* display:flex;
    flex-wrap:wrap; */
  }

  .rizhi-search-term>.rizhi-search-time {
    width: auto;
  }

  .rizhi-search-term>.rizhi-search-keyWord {
    width: auto;
    margin: 0 10px;
  }

  .rizhi-search-term>.rizhi-search-btn {
    width: auto;
  }

  .rizhi-content {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .rizhi-footer-page {
    padding: 20px 0;
  }

</style>
