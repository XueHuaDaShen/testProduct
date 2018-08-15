<template>
  <div class="footer-wrap">
    <ul class="footer-content">
      <li class="shouye-li" :class="liClass==='shouye'?'active':''" @click="changeRouter('shouye')">
        <router-link :to="{name: 'home'}">
          <span class="shouye-icon"></span>
          <em>首页</em>
        </router-link>
      </li>
      <li class="youxi-li" :class="liClass==='youxi'?'active':''" @click="changeRouter('youxi')">
        <router-link :to="{name: 'lottery'}">
          <span class="youxi-icon"></span>
          <em>游戏中心</em>
        </router-link>
      </li>
      <li class="zijin-li" :class="liClass==='zijin'?'active':''" @click="changeRouter('zijin')">
        <router-link :to="{name: 'zjglsy'}">
          <span class="zijin-icon"></span>
          <em>资金管理</em>
        </router-link>
      </li>
      <li class="geren-li" :class="liClass==='geren'?'active':''" @click="changeRouter('geren')">
        <router-link :to="{name: 'grzxsy'}">
          <span class="geren-icon"></span>
          <em>个人中心</em>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'myFooter',
  data() {
    return {
      liClass: 'shouye'
    }
  },
  created() {
    // console.log(this.$route)
    this.setFooterNavClass(this.$route.path)
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  watch: {
    '$route' (to, from) {
      // let t_s_code = to.query.s_code;
      // let f_s_code = from.query.s_code;
      // this.loadRoute();
      // console.log('to------',to)
      // console.log('from------',from)
      this.setFooterNavClass(to.path)
    }
  },
  methods: {
    changeRouter(text) {
      this.liClass = text;
    },
    setFooterNavClass(path) {
      path = path.split('/')[1];
      if(path === 'wrap'){
        this.liClass = 'shouye';
      }
      if(path === 'youxizhongxin'){
        this.liClass = 'youxi';
      }
      if(path === 'zijinguanli'){
        this.liClass = 'zijin';
      }
      if(path === 'gerenzhongxin'){
        this.liClass = 'geren';
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-wrap{
  width:100%;
}
.footer-content{
  width:100%;
  height:.98rem;
  display:-webkit-box;
  -webkit-box-pack:justify;
  border-top:.01rem solid #333;
  li{
    height:100%;
    a{
      height:100%;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:end;
      color:#646464;
      text-decoration: none;
    }
    font-size:.2rem;
    span{
      display:block;
      background:#646464;
    }
    .shouye-icon{
      width:.46rem;
      height:.46rem;
      background:url('/static/img/home.png') no-repeat;
      background-size:100% 100%;
    }
    .youxi-icon{
      width:.55rem;
      height:.42rem;
      background:url('/static/img/youxi.png') no-repeat;
      background-size:100% 100%;
    }
    .zijin-icon{
      width:.44rem;
      height:.46rem;
      background:url('/static/img/zijin.png') no-repeat;
      background-size:100% 100%;
    }
    .geren-icon{
      width:.44rem;
      height:.46rem;
      background:url('/static/img/geren.png') no-repeat;
      background-size:100% 100%;
    }
    em{
      display:block;
      font-style:normal;
      margin-top:.08rem;
      margin-bottom:.02rem;
    }
  }
  li.active{
    em{
      color:#CC3447;
    }
    span{
      background:#CC3447;
    }
    .shouye-icon{
      background:url('/static/img/homed.png') no-repeat;
      background-size:100% 100%;
    }
    .youxi-icon{
      background:url('/static/img/youxied.png') no-repeat;
      background-size:100% 100%;
    }
    .zijin-icon{
      background:url('/static/img/zijined.png') no-repeat;
      background-size:100% 100%;
    }
    .geren-icon{
      background:url('/static/img/gerened.png') no-repeat;
      background-size:100% 100%;
    }
  }
  .shouye-li{
    margin-left:.74rem;
  }
  // .youxi-li{
  //   margin-left:1.24rem;
  // }
  // .zijin-li{
  //   margin-left:1.08rem;
  // }
  .geren-li{
    margin-right:.56rem;
  }
}
</style>


