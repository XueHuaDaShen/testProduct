<template>
  <div class="notice-detail-wrap" v-if="showWrap">
    <h2 class="notice-title">{{noticeDetail.title}}</h2>
    <p class="acitvity-time">{{moment(noticeDetail.create_at).format('YYYY-MM-DD HH-mm-ss')}}</p>
    <img :src="noticeDetail.content_photo">
    <div class="notice-text-content">
      <h3>活动细节</h3>
      <div class="text-inner" v-html="noticeDetail.content"></div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import moment from 'moment';
export default {
  name: 'noticeDetail',
  data() {
    return {
      moment: moment,
      noticeId: '',
      showWrap: false,
      noticeDetail: null,
    }
  },
  created() {
    this.$store.dispatch('setTitle', '活动详情');
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setCleanBtn', false)
    this.$store.dispatch('setPlayModeStatus', false);
    this.noticeId = this.$route.query.id;
    this.getnoticeDetail(this.noticeId)
  },
  mounted() {},
  methods: {
    getnoticeDetail(id) {
      const vm = this;
      vm.showWrap = false;
      let url = "/notice/list";
      request.http(
        "get",
        url, { id: id },
        success => {
          console.log(success)
          if (success.returncode && success.returncode == 200) {
            if (success.data.total != 0) {
              try{
                let data = success.data.data;
                vm.noticeDetail = data[0];
                vm.showWrap = true;
              }catch(e){
                alert('活动列表---'+e)
              }
            }
          }
        },
        error => {
          vm.huodongList = [];
          vm.noResult = true;
        }
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-detail-wrap{
  width:100%;
  height:100%;
  .notice-title{
    width:6.9rem;
    height:.59rem;
    margin:.3rem .3rem .2rem .3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size:.42rem;
  }
  .acitvity-time{
    margin-left:.3rem;
    margin-bottom:.3rem;
    color:#777;
  }
  .notice-text-content{
    padding: .3rem;
    h3{
      font-size:.3rem;
      margin-bottom:.2rem;
    }
  }
}
</style>

