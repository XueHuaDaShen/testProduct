<template>
  <div>
    <div style="padding: 12px 20px 0px;">
      <div class="zhanneixin-search-term">
        <div class="zhanneixin-search-btn">
          <tableBtn :text="'发送短信'" :size="'medium'" :btnType="'success'" :plain="false" :func="handleSearch"></tableBtn>
        </div>
      </div>
      <div class="zhanneixin-content">
        <el-table
          :data="tableData"
          v-loading="dataLoading"
          empty-text="没有符合当前条件的记录"
          style="width: 100%">
          <el-table-column
            prop="num"
            label="编号"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="blance"
            align="center"
            label="余额">
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            label="操作时间">
          </el-table-column>
          <el-table-column
            prop="beizhu"
            align="center"
            label="备注信息">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import tableBtn from '../littleStyle/tableBtn.vue';
export default {
  name: 'zhanneixin',
  components: {
    tableBtn
  },
  props: {},
  data() {
    return {
      tableData: [{
        num: '1',
        type: 'string',
        money: '200',
        blance: '120',
        time: '2018-2-13',
        beizhu: '2564'
      }, {
        num: '2',
        type: 'num',
        money: '300',
        blance: '120',
        time: '2018-2-13',
        beizhu: '2564'
      }, {
        num: '3',
        type: 'obj',
        money: '210',
        blance: '120',
        time: '2018-2-13',
        beizhu: '2564'
      }, {
        num: '4',
        type: 'arr',
        money: '123',
        blance: '120',
        time: '2018-2-13',
        beizhu: '2564'
      }],
      keyWord: '',
      time1: '',
      time2: '',
      type: '',
      dataLoading: false,
    }
  },
  methods: {
    handleSearch() {},
  }
}
</script>
<style scoped>
  .zhanneixin-search-term{
    background-color: #fff;
    width: 96%;
    margin: 15px auto;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
    text-align:right;
    /* display:flex;
    flex-wrap:wrap; */
  }
  .zhanneixin-search-term>.zhanneixin-search-btn{
    padding:.5rem;
    padding-right:20px;
  }
  .zhanneixin-content{
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  }
</style>