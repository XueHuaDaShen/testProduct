<template>
  <div class="activity-detail-wrap" v-if="showWrap">
    <h2 class="activity-title">{{activityDetail.title}}</h2>
    <p class="acitvity-time">{{moment(activityDetail.create_at).format('YYYY-MM-DD HH-mm-ss')}}</p>
    <img :src="activityDetail.content_photo">
    <div class="activity-text-content">
      <h3>活动细节</h3>
      <div class="text-inner" v-html="activityDetail.content"></div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import moment from 'moment';
export default {
  name: 'activityDetail',
  data() {
    return {
      moment: moment,
      activityId: '',
      showWrap: false,
      activityDetail: null,
    }
  },
  created() {
    this.$store.dispatch('setTitle', '活动详情');
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setCleanBtn', false)
    this.$store.dispatch('setPlayModeStatus', false);
    this.activityId = this.$route.query.id;
    this.getActivityDetail(this.activityId)
  },
  mounted() {},
  methods: {
    getActivityDetail(id) {
      const vm = this;
      vm.showWrap = false;
      let url = "/activity/list";
      request.http(
        "get",
        url, { id: id },
        success => {
          console.log(success)
          if (success.returncode && success.returncode == 200) {
            if (success.data.total != 0) {
              try{
                let data = success.data.data;
                vm.activityDetail = data[0];
                vm.showWrap = true;
              }catch(e){
                alert('活动列表---'+e)
              }
            }else{
              alert('活动尚未开始');
              vm.$router.push({
                name: 'activityList'
              })
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
.activity-detail-wrap{
  width:100%;
  height:100%;
  .activity-title{
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
  .activity-text-content{
    padding: .3rem 0 .3rem .3rem;
    h3{
      font-size:.3rem;
      margin-bottom:.2rem;
    }
  }
}
</style>

