<template>
  <div class="yxzxsy-wrap">
    <nav class="yxdt-navList">
      <span class="nav-item" v-for="(item, index) in nav" :key="index" @click="changeYxzxsyNav(item.name)">
        <router-link :class="currNav===item.name?'active':''" :to="{name: item.url}">{{item.title}}</router-link>
      </span>
      <em class="curr-tag" :class="currNav+'-place'"></em>
    </nav>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'yxzxsy',
  data() {
    return {
      msg: '游戏中心首页',
      nav: [
        {title: '彩票游戏', url: 'lottery', name: 'lottery'},
        {title: '棋牌竞技', url: 'chess', name: 'chess'},
        {title: '真人视讯', url: 'liveVideo', name: 'liveVideo'},
        {title: '电子游艺', url: 'electron', name: 'electron'},
        {title: '体育竞技', url: 'soccer', name: 'soccer'}
      ],
      currNav: 'lottery'
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('setFooterStatus', true);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setCleanBtn', false);
    this.currNav = this.$route.name;
    this.setScroll(this.currNav);
    this.$store.dispatch('setTitle', '游戏大厅')
  },
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    changeYxzxsyNav(val) {
      this.currNav = val;
      this.setScroll(val);
      
    },
    setScroll(val) {
      let defaultLeft = 55;
      let ele = document.getElementsByClassName('yxdt-navList')[0];
      let left = ele.scrollLeft;
      if(val === 'lottery'){
        if(left == defaultLeft){
          let st = setInterval(() => {
            left --;
            if(left <= 0){
              clearInterval(st);
            }
            ele.scrollLeft = left;
          }, 3)
        }
      }else if(val === 'soccer'){
        if(left == 0){
          let st = setInterval(() => {
            left ++;
            if(left >= defaultLeft){
              clearInterval(st);
            }
            ele.scrollLeft = left;
          }, 3)
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.yxzxsy-wrap{
  .yxdt-navList{
    width:100%;
    height:1rem;
    padding:0 0 0 .3rem;
    display:-webkit-box;
    -webkit-box-align:center;
    // -webkit-box-pack:justify;
    border-bottom:.01rem solid #333;
    position: relative;
    overflow-x:auto;
    a{
      text-decoration: none;
      display:block;
      color:#646464;
    }
    a.active{
      color:#CC3447;
    }
    span{
      display:block;
      // width:27.5%;
      width:1.42rem;
      margin-right:.3rem;
    }
    .curr-tag{
      position: absolute;
      bottom:0;
      width:.2rem;
      height:.12rem;
      background: #CC3447;
      margin-left:-.1rem;
      left:14.5%;
      font-style:normal;
      transition: all .3s;
      background:url('/static/img/up_red_sanjiao.png') no-repeat;
      background-size:100% 100%;
    }
    em.lottery-place{
      left:11.5%;
    }
    em.chess-place{
      left:34.5%;
    }
    em.liveVideo-place{
      left:57%;
    }
    em.electron-place{
      left:80%;
    }
    em.soccer-place{
      left:103.5%;
    }
  }
}
</style>


