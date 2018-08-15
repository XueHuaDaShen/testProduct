<template>
  <div class="zjglsy-wrap">
    <div class="card-bg">
      <span class="blance-text">账户余额（元）</span>
      <span class="blance-num">{{blance.toFixed(2)}}</span>
      <span class="to-recharge" @click="toRecharge">充值</span>
    </div>
    <div class="split-bar"></div>
    <ul class="zjglList">
      <router-link :to="{name: 'tixian'}">
        <li>
          <span class="tixian"></span>
          <p>提现</p>
          <em class="sanjiao right-sanjiao"></em>
        </li>
      </router-link>
      <!-- <router-link :to="{name: 'zhuanzhang'}">
        <li>
          <span class="zhuanzhang"></span>
          <p>转账</p>
          <em class="sanjiao right-sanjiao"></em>
        </li>
      </router-link> -->
      <router-link :to="{name: 'zhuanhuan'}">
        <li>
          <span class="edu"></span>
          <p>额度转换</p>
          <em class="sanjiao right-sanjiao"></em>
        </li>
      </router-link>
      <!-- <li>
        <span class="jilu"></span>
        <p>充值记录</p>
        <em class="sanjiao"></em>
      </li> -->
    </ul>
  </div>
</template>
<script>
import request from '@/axios/axios';
export default {
  name: 'zjglsy',
  data() {
    return {
      msg: '资金管理首页',
      blance: 0,
      profile: null,
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', true);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setCleanBtn', false);
    this.$store.dispatch('setTitle', '资金管理');
    this.blance = Number(localStorage.getItem('blance'));
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {
    getBlance() {
      return this.$store.state.blance;
    }
  },
  methods: {
    // 去充值
    toRecharge() {
      this.$router.push({
        name: 'recharge'
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/publicStyle.scss';
.zjglsy-wrap{
  .card-bg{
    width:6.9rem;
    height:3.96rem;
    // border: 2px solid #5B5B8C;
    border-radius: .08rem;
    margin:.3rem;
    position: relative;
    background:url('/static/img/zjgl_bj_icon.png') no-repeat;
    background-size:100% 100%;
    .blance-text{
      position: absolute;
      left:.6rem;
      top:.6rem;
      color: #939DB8;
    }
    .blance-num{
      position: absolute;
      left:.6rem;
      top:1.1rem;
      font-size:.68rem;
      color: #E1C79B;
    }
    .to-recharge{
      position: absolute;
      width:1.52rem;
      height:.64rem;
      right:.3rem;
      bottom:.2rem;
      background:#C83C4A;
      text-align:center;
      line-height:.64rem;
      color:#fff;
      border-radius:.08rem;
    }
  }
  .zjglList{
    margin-top:.1rem;
    padding:0 .3rem;
    a{
      color:#c7c7c7;
      text-decoration: none;
    }
    li{
      display:-webkit-box;
      -webkit-box-pack:start;
      -webkit-box-align:center;
      border-bottom:.01rem solid #333;
      height:.85rem;
      font-size: .32rem;
      // color: #939DB8;
      position: relative;
      &:last-child{
        // border-bottom:none;
      }
      span{
        display:block;
        // background:#c7c7c7;
      }
      .sanjiao{
        // @include backSanjiao(.22rem, .22rem, #c7c7c7, .04rem, 45deg);
        right:.05rem;
        bottom:.3rem;
      }
      .tixian{
        width:.46rem;
        height:.46rem;
        margin-right:.3rem;
        background:url('/static/img/tixian_icon.png') no-repeat;
        background-size:100% 100%;
      }
      .edu{
        width:.46rem;
        height:.46rem;
        margin-right:.3rem;
        background:url('/static/img/edu_icon.png') no-repeat;
        background-size:100% 100%;
      }
      .zhuanzhang{
        width:.46rem;
        height:.46rem;
        // margin-left:.02rem;
        margin-right:.3rem;
        background:url('/static/img/zhuanzhang_icon.png') no-repeat;
        background-size:100% 100%;
      }
      .jilu{
        width:.42rem;
        height:.42rem;
        margin-left:.01rem;
        margin-right:.33rem;
      }
    }
  }
}
</style>


