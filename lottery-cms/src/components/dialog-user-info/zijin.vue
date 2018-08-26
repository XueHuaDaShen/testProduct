<template>
  <div>
    <div style="padding: 12px 20px 0px;">
      <div class="zijin-content">
        <el-table :data="tableData" v-loading="dataLoading" empty-text="没有符合当前条件的记录" style="width: 100%">
          <el-table-column prop="num" label="编号" align="center" width="180">
          </el-table-column>
          <el-table-column prop="type" label="类型" align="center" width="180">
          </el-table-column>
          <el-table-column prop="money" align="center" label="金额">
          </el-table-column>
          <el-table-column prop="blance" align="center" label="余额">
          </el-table-column>
          <el-table-column prop="time" align="center" label="操作时间">
          </el-table-column>
          <el-table-column prop="beizhu" align="center" label="备注信息">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import request from '../../axios/axios';
  export default {
    name: 'zijin',
    components: {
      tableBtn
    },
    props: {},
    data() {
      return {
        tableData: [],
        dataLoading: false,
      }
    },
    methods: {
      getSummaries() {
        var vm = this;
        vm.dataLoading = true;
        request.http(
          'get',
          '/user/cash/locked/list', {},
          (success) => {
            vm.dataLoading = false;
            let code = success.returncode;
            if (code === 200) {
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
      }
    },
    mounted() {
      this.getSummaries();
    }
  }

</script>
<style scoped>
  .zijin-content {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

</style>
