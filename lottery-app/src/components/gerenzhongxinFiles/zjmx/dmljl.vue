<template>
  <div class="dmljl-wrap">
    <div class="public-search-copy-header">
      <span class="back" @click="goBack"></span>
      <span class="title-text">打码量记录</span>
      <span class="search" @click="handleSearch">搜索</span>
    </div>
    <ul class="public-search-list-wrap-ul">
      <li>
        <span>开始时间：</span>
        <em class="slide-down-em-white"></em>
        <input type="text" readonly v-model="start_time" @click="showdatetime1=true">
      </li>
      <li>
        <span>结束时间：</span>
        <em class="slide-down-em-white"></em>
        <input type="text" readonly v-model="end_time" @click="showdatetime2=true">
      </li>
      <li>
        <span>状态：</span>
        <publicSelect
          class="select-wrap"
          v-if="showSelect"
          placeholder="请选择状态"
          optionHeight='1'
          :selectList="statusList"
          :defaultSelected="status"
          label="name"
          value="val"
          :callback="selectStatus">
        </publicSelect>
      </li>
    </ul>
    <div class="split-bar"></div>
    <h2 class="search-title-wrap"><em></em>搜索记录</h2>
    <div class="public-search-table">
      <table>
        <thead>
          <tr>
            <td :style="{width: Math.floor(100/tableHead.length)+'%', margin: '0 '+(100/tableHead.length-Math.floor(100/tableHead.length)).toFixed(1)+'%'}" v-for="(head, hi) in tableHead" :key="hi">{{head}}</td>
          </tr>
        </thead>
        <tbody v-if="tableData.length===0">
          <tr>
            <td class="empty-data" :colspan="tableHead.length">{{emptyText}}</td>
          </tr>
        </tbody>
        <tbody v-if="tableData.length!==0">
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{getType(item.type)}}</td>
            <td>{{moment(item.recharge_at).format('YYYY-MM-DD HH:mm:ss')}}</td>
            <td>{{item.amount||0}}</td>
            <td>{{item.load||0}}</td>
            <td>{{item.stake||0}}</td>
            <td>{{setTypeText(item.status, 'statusList', 'val')}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <datetime :class="showdatetime1?'showdatetime':''" datetimeWrapId='zzjl-datetime-wrap1' timeType="yyyy-mm-dd hh:mm" :callback="getstart_time" :datetime="start_time"></datetime>
    <datetime :class="showdatetime2?'showdatetime':''" datetimeWrapId='zzjl-datetime-wrap2' timeType="yyyy-mm-dd hh:mm" :callback="getend_time" :datetime="end_time"></datetime>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import publicSelect from '@/components/publicModel/select';
import datetime from '@/components/publicModel/date';
import moment from 'moment';
export default {
  name: 'dmljl',
  components: {
    publicSelect,
    datetime
  },
  data() {
    return {
      moment: moment,
      start_time: '',
      end_time: '',
      status: '',
      statusList: [
        {name: '不满足', val: '0'},
        {name: '满足', val: '1'}
      ],
      typeList: [],
      tableHead: ['入款类型', '时间', '入款额', '打码量', '完成量', '状态'],
      tableData: [],
      emptyText: '暂无数据',
      showSelect: true,
      showdatetime1: false,
      showdatetime2: false,
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setHeader', false);
    this.getTypeList();
    this.getTableData();
  },
  mounted() {},
  watch: {},
  computed: {
    getTitleText() {
      return this.$store.state.title
    },
  },
  methods: {
    getType(type) {
      for (let i = 0; i < this.typelist.length; i++) {
        let o = this.typelist[i];
        if (type === o.type) {
          return o.name;
        }
      }
      return "--"
    },
    // 打码类型
    getTypeList() {
      let vm = this;
      let url = '/trade/type/list';
      request.http('get', url, {}, (success) => {
        if (success.returncode) {
          if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
            request.loginAgain(vm);
          } else if (success.returncode == 200) {
            let data = success.data;
            if (data.length != 0) {
              vm.typelist = data;
            }
          }
        }
      }, (error) => {
        console.log('error', error);
      })
    },
    // 选择申请状态
    selectStatus(item) {
      this.status = item.val
    },
    // 设置状态/类型的文字
    setTypeText(type, arr, k) {
      let text;
      for(let i in this[arr]){
        let v = this[arr][i];
        if(type == v[k]){
          text = v.name;
          break;
        }
      }
      return text
    },
    // 获取开始时间
    getstart_time(param) {
      if(param.year){
        this.start_time = param.year + '-'+ param.month + '-'+ param.date + ' '+ param.hour + ':'+ param.minute;
      }else{
        this.start_time = '';
      }
      this.showdatetime1 = param.showdatetime;
      // console.log(param)
    },
    // 获取结束时间
    getend_time(param) {
      if(param.year){
        this.end_time = param.year + '-'+ param.month + '-'+ param.date + ' '+ param.hour + ':'+ param.minute;
      }else{
        this.end_time = '';
      }
      this.showdatetime2 = param.showdatetime;
      // console.log(param)
    },
    // 后退
    goBack() {
      // console.log(this)
      // console.log('back')
      // return false;
      this.$router.back(-1);
      this.$store.dispatch('setHeader', true);
      this.$store.dispatch('setFooterStatus', true);
      this.$store.dispatch('setBackStatus', false);
      this.$store.dispatch('setPlayModeStatus', false);
      this.$store.dispatch('setCleanBtn', false);
    },
    // 获取表格数据
    getTableData() {
      const vm = this;
      request.http(
        'get',
        '/user/stackcount/list',
        {
          page_num: 1,
          page_size: 99999,
          begintime: vm.start_time,
          endtime: vm.end_time,
          status: vm.status
        },
        (success) => {
          // console.log(success)
          if(success.returncode === 200){
            vm.tableData = success.data
            // vm.showSelect = true;
          }
        },
        (error) => {}
      )
    },
    // 搜索
    handleSearch() {
      this.getTableData()
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.dmljl-wrap{
  .showdatetime{
    height:100%;
  }
}
</style>


