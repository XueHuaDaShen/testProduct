<template>
  <div class="zhjl-wrap">
    <div class="public-search-copy-header">
      <span class="back" @click="goBack"></span>
      <span class="title-text">追号记录</span>
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
        <span>游戏名：</span>
        <publicSelect
          class="select-wrap"
          v-if="showGameSelect"
          placeholder="请选择游戏名"
          optionHeight='1'
          :selectList="gameNameList"
          :defaultSelected="game_name"
          label="name"
          value="_id"
          :callback="selectGameName">
        </publicSelect>
      </li>
      <li>
        <span>玩法群：</span>
        <publicSelect
          class="select-wrap"
          v-if="showPlayGroupSelect"
          placeholder="请选择玩法群"
          optionHeight='1'
          :selectList="playGroups"
          defaultSelected=""
          label="name"
          value="_id"
          :callback="selectOptions">
        </publicSelect>
      </li>
      <li>
        <span>玩法：</span>
        <publicSelect
          class="select-wrap"
          v-if="showPlaySelect"
          placeholder="请选择玩法"
          optionHeight='1'
          :selectList="playName"
          :defaultSelected="gameid"
          label="name"
          value="_id"
          :callback="selectPlay">
        </publicSelect>
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
          <tr v-for="(item, index) in tableData" :key="index" @click="toLotteryDetail(item._id)">
            <td>{{item.gamename}}</td>
            <td>{{item.lotteryname}}</td>
            <td>{{item.start_issue_no?item.start_issue_no.substr(2):''}}</td>
            <td>{{item.issue_num_finished+'/'+item.issue_num}}</td>
            <td>{{item.total_vote_cash}}</td>
            <td>{{item.award_cash}}</td>
            <td>{{item.is_hit_stop==1?'是':'否'}}</td>
            <td>{{getChaseStatus(item.status)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <datetime :class="showdatetime1?'showdatetime':''" datetimeWrapId='zhjl-datetime-wrap1' timeType="yyyy-mm-dd hh:mm" :callback="getstart_time" :datetime="start_time"></datetime>
    <datetime :class="showdatetime2?'showdatetime':''" datetimeWrapId='zhjl-datetime-wrap2' timeType="yyyy-mm-dd hh:mm" :callback="getend_time" :datetime="end_time"></datetime>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import {getChaseStatus} from '@/assets/js/filterStatus.js';
import publicSelect from '@/components/publicModel/select';
import datetime from '@/components/publicModel/date';
export default {
  name: 'zhjl',
  components: {
    publicSelect,
    datetime
  },
  data() {
    return {
      getChaseStatus: getChaseStatus,
      start_time: '',
      end_time: '',
      game_name: '',
      gameid: '',
      status: '',
      statusList: [
        {name: '进行中', val: '1'},
        {name: '已结束', val: '2'},
        {name: '用户取消', val: '3'},
        {name: '系统取消', val: '4'}
      ],
      gameNameList: [],
      playGroups: [],
      playName: [],
      tableHead: ['游戏', '玩法', '起始奖期', '进度', '总金额', '已中金额', '追中及停', '状态'],
      tableData: [],
      emptyText: '暂无数据',
      showSelect: true,
      showGameSelect: false,
      showPlayGroupSelect: true,
      showPlaySelect: true,
      showdatetime1: false,
      showdatetime2: false,
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setHeader', false);
    this.$store.dispatch('setTitle', '彩票记录');
    this.getGameList();
    this.getTableData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 选择游戏名
    selectGameName(item) {
      this.getPlayGroups(item._id)
    },
    // 选择玩法群
    selectOptions(item) {
      this.getPlayGame(item)
    },
    // 选择玩法
    selectPlay(item) {
      this.gameid = item._id;
    },
    // 选择状态
    selectStatus(item) {
      this.status = item.val;
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
      this.$store.dispatch('setFooterStatus', true);
      this.$store.dispatch('setBackStatus', false);
      this.$store.dispatch('setPlayModeStatus', false);
      this.$store.dispatch('setCleanBtn', false);
      this.$store.dispatch('setHeader', true);
    },
    // 获取表格数据
    getTableData() {
      const vm = this;
      request.http(
        'get',
        '/lottery/chase/list',
        {
          page_num: 1,
          page_size: 99999,
          begintime: vm.start_time,
          endtime: vm.end_time,
          gameid: vm.gameid,
          status: vm.status
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
      this.getTableData();
    },
    // 游戏名称列表
    getGameList() {
      let vm = this;
      let url = '/lottery/game/list';
      let gamelist = [];
      request.http('get', url, {}, (success) => {
        let code = success.returncode;
        if (code) {
          if (code == 103 || code == 106 || code == 101) {
            request.loginAgain(vm);
          } else if (code == 200) {
            for (let i = 0; i < success.data.length; i++) {
              let item = success.data[i].children;
              gamelist = gamelist.concat(item);
            }
            vm.gameNameList = gamelist;
            vm.showGameSelect = true;
          }
        }
      }, (error) => {
        console.log('error', error);
      })
    },
    // 玩法群
    getPlayGroups(gameid) {
      let vm = this;
      let url = '/lottery/game/detail';
      let groups = [];
      request.http('get', url, { gameid: gameid }, (success) => {
        let code = success.returncode;
        if (code) {
          if (code == 103 || code == 106 || code == 101) {
            request.loginAgain(vm);
          } else if (code == 200) {
            let children = success.data.children;
            for (let i = 0; i < children.length; i++) {
              groups = groups.concat(children[i]);
            }
            vm.playGroups = groups;
            // console.log(groups)
            vm.showPlayGroupSelect=  false;
            setTimeout(() => {
              vm.showPlayGroupSelect=  true;
            }, 100);
          }
        }
      }, (error) => {
        console.log('error', error);
      })
    },
    // 玩法
    getPlayGame(item) {
      const vm = this;
      let arr = [];
      this.playName = [];
      for (let i = 0; i < item.children.length; i++) {
        arr = arr.concat(item.children[i]);
      }
      for (let i = 0; i < arr.length; i++) {
        this.playName = this.playName.concat(arr[i].children);
      }
      // console.log(this.playName)
      this.showPlaySelect = false;
      setTimeout(() => {
        vm.showPlaySelect = true;
      }, 100);
    },
    // 去往投注详情
    toLotteryDetail(id) {
      this.$router.push({
        name: 'chaseDetail',
        query: {
          id: id,
          code: 'zhjl'
        }
      })
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.zhjl-wrap{
  .showdatetime{
    height:100%;
  }
}
</style>


