<template>
  <div class="hello" v-loading="loading">
    <myHeader></myHeader>
    <div class="my-home-content-wrap" :class="setBgColor()">
      <router-view></router-view>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import lottery from './lottery';
  import myHeader from './header';
  import myFooter from './footer';
  import request from '../axios/axios';

  export default {
    name: 'home',
    components: {
      lottery,
      myHeader,
      myFooter
    },
    data() {
      return {
        loading: false,
        data: this.$store.state.lotteryArr,
        bodyBG: 'default'
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.name === 'home') {
          localStorage.setItem('bodyBG', 'home');
          this.bodyBG = 'home';
          this.$store.dispatch('setbodyBG', 'home');
        }
        // console.log('to------', to)
        // console.log('from------', from)
      }
    },
    created() {
      // this.bodyBG = localStorage.getItem('bodyBG');
      localStorage.setItem('bodyBG', 'home');
      this.bodyBG = 'home';
      this.$store.dispatch('setbodyBG', 'home');
      // this.getLotteryList();
      // this.getUserInfo();
      // console.log(this.getsetbodyBG)
    },
    computed: {
      getsetbodyBG() {
        return this.$store.state.bodyBG;
      }
    },
    methods: {
      // 设置背景色
      setBgColor() {
        switch (this.getsetbodyBG) {
          case 'lhc':
            return 'wrap-lhc';
          case 'syxw':
            return 'wrap-syxw';
          case 'ks':
            return 'wrap-ks';
          case 'pks':
            return 'wrap-pks';
          case 'dataCharts':
            return 'wrap-dataCharts';
          case 'home':
            return 'wrap-home';
          case 'default':
            return 'my-home-content-wrap'
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .my-home-content-wrap {
    width: 100%;
    color: #fff;
    background: #2d3236;
    background: url('../img/default-bj.png') no-repeat;
    background-size: 100% 100%;
    padding: 20px 0;
  }

  .content {
    width: 1024px;
    margin: 0 auto;
  }

  .wrap-home{
    padding-top:0;
  }

  .wrap-lhc {
    width: 100%;
    color: #fff;
    background: url('../img/liuhecai-bj.jpg') no-repeat;
    background-size: 100% 100%;
  }

  .wrap-syxw {
    width: 100%;
    color: #fff;
    background: url('../img/shiyixuanwu-bj.png') no-repeat;
    background-size: 100% 100%;
  }

  .wrap-ks {
    width: 100%;
    color: #fff;
    background: url('../img/ks-bj.png') no-repeat;
    background-size: 100% 100%;
  }

  .wrap-pks {
    width: 100%;
    color: #fff;
    background: url('../img/pks-bj.png') no-repeat;
    background-size: 100% 100%;
  }

  /* .wrap-pks {
    width: 100%;
    color: #fff;
    background: url('../img/pks-bj.png');
  } */

  .wrap-dataCharts {
    width: 100%;
    color: #fff;
    background: #e6e6e6;
  }
</style>