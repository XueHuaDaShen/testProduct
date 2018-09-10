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
      '$route'(to, from) {
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
          case 'no-bg':
            return 'wrap-no-bg';
          case 'ac-bg':
            return 'wrap-ac-bg';
          case 'default':
            return 'my-home-content-wrap'
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .el-loading-spinner .path {
    stroke: #777;
  }

  /* alert html弹框样式 加上.syxw-wrap-inner 即可 */
  .el-message-box.syxw-wrap-inner {
    background: #F4F4F4;
    border: 4px solid #BBBBBB;
    border-radius: 2px;
    padding-bottom: 20px;
    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.1);

    .el-message-box__header {
      padding: 20px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #191919;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
    }

    .el-message-box__content {
      padding: 20px;

      .el-message-box__message {
        .lottery-title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #191919;
          font-weight: bold;
          margin-bottom: 5px;
          text-align: center;

          >strong {
            color: #CC3447;
          }
        }

        .lottery-bottom {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #777777;
          font-weight: bold;
        }
      }
    }

    .el-message-box__headerbtn {
      top: 20px;
    }

    .el-message-box__btns {
      padding-top: 0;

      >button {
        background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
        border: 1px solid #DBB894;
        border-radius: 2px;
        width: 115px;
        height: 40px;
        font-size: 14px;
      }
    }
  }

  .my-home-content-wrap {
    width: 100%;
    color: #fff;
    background: #2d3236;
    background: url('../assets/img/bets-img/default-bj.png') no-repeat;
    background-size: 100% 100%;
    padding: 20px 0;
    // padding-top: 28px;
  }

  .content {
    width: 1024px;
    margin: 0 auto;
  }

  .wrap-home {
    padding-top: 0;
  }

  .wrap-lhc {
    width: 100%;
    color: #fff;
    background: url('../assets/img/bets-img/liuhecai-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-syxw {
    width: 100%;
    color: #fff;
    background: url('../assets/img/bets-img/shiyixuanwu-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-ks {
    width: 100%;
    color: #fff;
    background: url('../assets/img/bets-img/ks-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-pks {
    width: 100%;
    color: #fff;
    background: url('../assets/img/bets-img/pks-bj.png') no-repeat;
    background-size: cover;
  }

  /* .wrap-pks {
    width: 100%;
    color: #fff;
    background: url('../assets/img/bets-img/pks-bj.png');
  } */

  .wrap-dataCharts {
    width: 100%;
    color: #fff;
    background: #e6e6e6;
  }

  .wrap-no-bg {
    width: 100%;
    color: #fff;
  }

  .wrap-ac-bg {
    width: 100%;
    color: #fff;
    background: url('../assets/img/activity/Background.png') no-repeat;
    background-size: cover;
  }
</style>