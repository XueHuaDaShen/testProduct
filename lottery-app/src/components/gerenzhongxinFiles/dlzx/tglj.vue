<template>
  <div class="tglj-wrap">
    <textarea class="display-none-input" name="" id="tglj-copy-url-input" cols="30" rows="10"></textarea>
    <div class="public-search-copy-header">
      <span class="back" @click="goBack"></span>
      <span class="title-text">推广链接</span>
      <span class="search" @click="handleSearch">搜索</span>
    </div>
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
            <td>{{setTypeText(item.type)}}</td>
            <td>{{item.refund}}</td>
            <td>{{moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')}}</td>
            <td>{{item.effect_time+'天'}}</td>
            <td>{{item.user_num||0}}</td>
            <td class="oprate-td">
              <span class="look-span" @click="lookLinkUrl(item.url, item.code)">查看</span>
              <span class="delete-span" @click="deleteLink(item._id)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="dialog-delete-wrap" v-if="showDeleteDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <em class="close-em" @click="showDeleteDialog = false">×</em>
        <p>确认删除这条推广链接吗？</p>
        <button :disabled="isClick" @click="confirmDelete">确定</button>
      </div>
    </div>
    <div class="alert-tip-text copy-url-alert-wrap" v-if="tipText">
      <span>{{isCopyUrl}}</span>
      <span>{{tipText}}</span>
    </div>
    <div class="alert-tip-text" v-if="tipText2">{{tipText2}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import moment from 'moment';
export default {
  name: 'tglj',
  data() {
    return {
      moment: moment,
      isClick: false,
      tableHead: ['账户类型', '奖金组', '创建时间', '有效期', '注册人数', '操作'],
      tableData: [],
      emptyText: '暂无数据',
      showSelect: false,
      showdatetime1: false,
      showdatetime2: false,
      showDeleteDialog: false,

      deleteItemId: '',
      
      isCopyUrl: '', // 是否已经复制了 url
      tipText: '',
      tipTimeOut: 2.5, // s

      tipText2: '',
      tipTimeOut2: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setHeader', false);
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
    // 查看链接并复制
    lookLinkUrl(url, code) {
      const vm = this;
      let link = url.split('#')[0]+'reg.html?code='+code;
      this.tipText = link;
      // console.log(link)
      //
      var input = document.getElementById("tglj-copy-url-input");
      input.value = link; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.isCopyUrl = '链接已复制';
      //
      setTimeout(() => {
        vm.tipText = '';
        vm.isCopyUrl = '';
      }, vm.tipTimeOut*1000);
    },
    // 获取要删除的元素
    deleteLink(id) {
      this.showDeleteDialog = true;
      this.deleteItemId = id;
    },
    // 确定删除
    confirmDelete() {
      const vm = this;
      vm.isClick = true;
      request.http(
        'post',
        '/user/team/link/delete',
        {
          id: vm.deleteItemId,
        },
        (success) => {
          vm.isClick = false;
          // console.log(success)
          if(success.returncode === 200){
            vm.getTableData();
            vm.showDeleteDialog = false;
            vm.tipText2 = '删除成功'
            setTimeout(() => {
              vm.tipText2 = '';
            }, vm.tipTimeOut2*1000);
          }
        },
        (error) => {
          vm.isClick = false;
        }
      )
    },
    // 设置状态/类型的文字
    setTypeText(type) {
      switch(type) {
        case '0': return '代理';
        case '1': return '会员';
        default: return '';
      }
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
        '/user/team/link/list',
        {
          page_num: 1,
          page_ize: 99999,
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
.tglj-wrap{
  position: relative;
  .copy-url-alert-wrap{
    width:7rem;
    // padding:.3rem;
    text-align: left;
    height:1.5rem;
    // line-height: 1.5rem;
    display:-webkit-box;
    -webkit-box-orient: vertical;
    // -webkit-box-align:center;
    -webkit-box-pack:center;
    span{
      display:block;
      -webkit-box-flex:1;
      padding-left:.3rem;
    }
  }
  .showdatetime{
    height:100%;
  }
  table{
    .oprate-td{
      span{
        display:block;
      }
      span.delete-span{
        color:#C83C4A;
      }
    }
  }
  .display-none-input{
    position: absolute;
    left:0;
    top:0;
    z-index:-5;
    width:0;
    height:0;
    opacity: 0;
  }
  .dialog-delete-wrap{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    z-index:99;
    .dialog-bj{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background:#000;
      opacity:.5;
    }
    .dialog-content{
      width:6.9rem;
      height:3rem;
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin:auto;
      border-radius:.16rem;
      background: #fff;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      em.close-em{
        position: absolute;
        right:.3rem;
        top:.3rem;
        width:.46rem;
        height:.46rem;
        border-radius:50%;
        overflow:hidden;
        background:#191919;
        font-size:.5rem;
        color:#fff;
        // text-align:center;
        text-indent: .06rem;
        line-height:.46rem;
      }
      p{
        display:block;
        text-align:center;
        margin-bottom:.6rem;
        font-size:.3rem;
        color:#C83C4A;
      }
      button{
        width:1.2rem;
        height:.68rem;
        background:#C83C4A;
        border-radius:.08rem;
      }
    }
  }
}
</style>


