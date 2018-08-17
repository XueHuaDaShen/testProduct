<template>
  <div class="activity-detail-wrap">
    <p class="no-result" style="padding:.3rem;text-align:center;" v-if="noResult">暂无活动</p>
    <ul class="huodongList" v-if="!noResult">
      <li v-for="(activity, index) in huodongList" :key="index" @click="toActivityDetail(activity._id)">
        <a>
          <img :src="activity.activity_photo" class="a1" :alt="activity.title">
        </a>
        <div class="desc">
          <h2 class="activity-title">{{activity.title}}</h2>
          <p class="acitvity-time">{{moment(activity.create_at).format('YYYY-MM-DD HH-mm-ss')}}</p>
        </div>
        <div class="status"><span class="span-bj" :class="activity.open==1?'active':''"></span><span class="inner">{{setActivityStatus(activity.open)}}</span></div>
      </li>
    </ul>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import moment from 'moment';
export default {
  name: 'activityList',
  data() {
    return {
      moment: moment,
      noResult: false, // 是否有活动
      huodongList: [], // 活动列表
    }
  },
  created() {
    this.$store.dispatch('setTitle', '活动列表');
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setCleanBtn', false)
    this.$store.dispatch('setPlayModeStatus', false);
    this.getActivities()
  },
  mounted() {},
  methods: {
    // 获取活动列表
    getActivities() {
      const vm = this;
      let url = "/activity/list";
      request.http(
        "get",
        url, { page_num: 1, page_size: 1000 },
        success => {
          if (success.returncode && success.returncode == 200) {
            if (success.data.total != 0) {
              try{
                let data = success.data.data;
                vm.huodongList = data;
                vm.noResult = false;
              }catch(e){
                alert('活动列表---'+e)
              }
            } else {
              vm.huodongList = [];
              vm.noResult = true;
            }
          }
        },
        error => {
          vm.huodongList = [];
          vm.noResult = true;
        }
      );
    },
    // 活动状态
    setActivityStatus(status) {
      switch(status) {
        case 1: return '进行中';
        case 2: return '未开始';
        case 3: return '已结束';
      }
    },
    toActivityDetail(id) {
      this.$router.push({
        name: 'activityDetail',
        query: {
          id: id
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.activity-detail-wrap{
  width:100%;
  height:100%;
  .huodongList{
    width:100%;
    display:flex;
    flex-wrap:wrap;
    margin-bottom:1.83rem;
    li{
      width:3.3rem;
      background: #303040;
      border-radius: .08rem;
      margin-left:.3rem;
      margin-top:.3rem;
      overflow:hidden;
      position: relative;
      a{
        display:block;
        width:100%;
        height:1.85rem;
        img{
          width:100%;
          height:100%;
        }
      }
      .desc{
        display:-webkit-box;
        -webkit-box-orient:vertical;
        padding:.22rem 0 .2rem .2rem;
        h2{
          width:2.8rem;
          height:.4rem;
          line-height:.4rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin-bottom:.1rem;
          font-size:.28rem;
        }
        p{
          font-size:.26rem;
          color:#777;
        }
      }
      .status{
        width: 1.16rem;
        height: .42rem;
        color: #FFFFFF;
        position: absolute;
        left:0;
        top:.2rem;
        .inner{
          position: absolute;
          left:0;
          top:0;
          width:100%;
          height:100%;
          z-index:3;
          width: 1.16rem;
          height: .42rem;
          line-height: .42rem;
          text-align: center;
          font-size: .28rem;
          font-weight: 700;
        }
        .span-bj{
          position: absolute;
          left:0;
          top:0;
          width:100%;
          height:100%;
          opacity: 0.9;
          background: #777777;
          border-radius:0 1rem 1rem 0;
          z-index:2;
        }
        span.active{
          background: #CC3447;
        }
      }
    }
  }
}
</style>