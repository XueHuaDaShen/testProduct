<template>
  <div class="yxjl-wrap">
    <div class="public-search-copy-header">
      <span class="back" @click="goBack"></span>
      <span class="title-text">游戏记录</span>
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
        <span>平台：</span>
        <publicSelect
          class="select-wrap"
          v-if="showSelect"
          placeholder="请选择平台"
          optionHeight='1'
          :selectList="platformList"
          :defaultSelected="platform"
          label="platform"
          value="_id"
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
            <td>{{item.platform}}</td>
            <td>{{item.game}}</td>
            <td>{{item.vote}}</td>
            <td>{{item.profit}}</td>
            <td>{{moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')}}</td>
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
  name: 'yxjl',
  components: {
    publicSelect,
    datetime
  },
  data() {
    return {
      moment: moment,
      start_time: '',
      end_time: '',
      platform: '',
      platformList: [],
      tableHead: ['游戏平台', '游戏名', '投注额', '盈利额', '游戏时间'],
      tableData: [],
      emptyText: '暂无数据',
      showSelect: false,
      showdatetime1: false,
      showdatetime2: false,
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setHeader', false);
    this.getTableData();
    this.getPlatformList();
  },
  mounted() {},
  watch: {},
  computed: {
    getTitleText() {
      return this.$store.state.title
    },
  },
  methods: {
    // 获取第三方平台列表
    getPlatformList() {
      const vm = this;
      request.http(
        'get',
        '/gameSetting/list',
        {
          pageNum: 1,
          pageSize: 99999
        },
        (success) => {
          // console.log(success)
          if(success.returncode === 200){
            vm.platformList = success.data
            vm.showSelect = true;
          }
        },
        (error) => {}
      )
    },
    // 选择申请状态
    selectStatus(item) {
      if(item._id === ''){
        this.platform = '';
      }else{
        this.platform = item.platform
      }
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
        '/thirdpart/game/list',
        {
          pageNum: 1,
          pageSize: 99999,
          begintime: vm.start_time,
          endtime: vm.end_time,
          platform: vm.platform
        },
        (success) => {
          // console.log(success)
          if(success.returncode === 200){
            vm.tableData = success.data.data
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
.yxjl-wrap{
  .showdatetime{
    height:100%;
  }
}
</style>


