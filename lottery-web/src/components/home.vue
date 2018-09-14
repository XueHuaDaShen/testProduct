<template>
  <div class="hello" v-loading="loading">
    <myHeader></myHeader>
    <div class="my-home-content-wrap" :class="setBgColor()">
      <router-view></router-view>
      <div id="system-tip-panel" v-if="lotteryed">
        <div class="panel-bj"></div>
        <em class="panel-close"><img src="@/assets/img/panel-close.png" @click="handleClosePanel"></em>
        <h2 class="panel-title">{{panelTitle}}</h2>
        <div class="panel-content">
          <p class="panel-text" v-for="(item, i) in prizeArr" :key="i">恭喜您的 {{item.gamename+'('+item.lotteryname+')'}} 已中奖<i class="panel-money">{{Number(item.award_cash).toFixed(2)}}</i>元</p>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import lottery from './lottery';
  import myHeader from './header';
  import myFooter from './footer';
  import request from '@/axios/axios';

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
        panelTitle: '中奖通知',
        prizeArr: [],
        lotteryed: false,
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
      const vm = this;
      // this.bodyBG = localStorage.getItem('bodyBG');
      localStorage.setItem('bodyBG', 'home');
      this.bodyBG = 'home';
      this.$store.dispatch('setbodyBG', 'home');
      vm.getBetsDataList();
      vm.getChaseDataList();
      setInterval(() => {
        vm.getBetsDataList();
        vm.getChaseDataList();
      }, 10*1000);
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
      // 关闭通告框
      handleClosePanel() {
        this.lotteryed = false;
      },
      // 获取投注号码
      getBetsDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/issue/vote/list', { page_size: 30, self: 1 },
          (success) => {
            // console.log(success);
            let code = success.returncode;
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              // console.log()
              // vm.betsDataList = success.data.data
              vm.$store.dispatch('setVoteDataList', success.data.data)
              vm.formatBetsData(success.data.data)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      // 我的追号
      getChaseDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/chase/list', { page_size: 30, self: 1 },
          (success) => {
            // console.log(success);
            let code = success.returncode;
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              // console.log()
              // vm.chaseDataList = success.data.data
              vm.$store.dispatch('setChaseDataList', success.data.data)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      formatBetsData(data) {
        const vm = this;
        let waitingPrize = this.$store.state.waitingPrize;
        let arr = [];
        data.filter(v => {
          if(!v.luck_no || v.status == 1){
            arr.push(v);
          }
        })
        this.$store.dispatch('setWaitingPrize', arr);
        if(waitingPrize.length !== 0){
          this.prizeArr = [];
          for(let i=0; i<waitingPrize.length; i++){
            let v = waitingPrize[i];
            for(let j=0; j<data.length; j++){
              let k = data[j];
              if(v._id === k._id && Number(k.status) === 5){
                this.prizeArr.push(k);
              }
            }
          }
          if(this.prizeArr.length > 0){
            this.lotteryed = true;
            let arr = [];
            data.filter(v => {
              if(!v.luck_no){
                arr.push(v);
              }
            })
            this.$store.dispatch('setWaitingPrize', arr);
            setTimeout(() => {
              vm.lotteryed = false;
            }, 15*1000);
          }else{
            this.lotteryed = false;
          }
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .el-loading-spinner>svg .path {
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
  #system-tip-panel{
    width:254px;
    position: fixed;
    right:20px;
    top:500px;
    padding:10px;
    z-index:9999;
    .panel-bj{
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      z-index:1;
      opacity: 0.9;
      background: #64646C;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.50), inset 0 1px 4px 0 rgba(255,255,255,0.50);
      border-radius: 2px;
    }
    em.panel-close{
      position: absolute;
      z-index:2;
      right:10px;
      top:15px;
      width:12px;
      height:12px;
      cursor:pointer;
      img{
        width:100%;
        height:100%;
        display:block;
      }
    }
    h2.panel-title{
      text-align:center;
      height:22px;
      line-height:22px;
      font-size:16px;
      color:#fff;
      margin-bottom:10px;
      position: relative;
      z-index:2;
    }
    div.panel-content{
      padding:22px 13px;
      background: #FFFFFF;
      border-radius: 2px;
      position: relative;
      z-index:2;
      min-height:76px;
      p.panel-text{
        font-size: 12px;
        color: #191919;
        text-align:left;
        margin-bottom:20px;
        &:last-child{
          margin-bottom:0;
        }
      }
      i.panel-money{
        color:#c83a4c;
        font-style:normal;
      }
    }
  }

  .my-home-content-wrap {
    width: 100%;
    color: #fff;
    background: #2d3236;
    background: url('../img/default-bj.png') no-repeat;
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
    background: url('../img/liuhecai-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-syxw {
    width: 100%;
    color: #fff;
    background: url('../img/shiyixuanwu-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-ks {
    width: 100%;
    color: #fff;
    background: url('../img/ks-bj.png') no-repeat;
    background-size: cover;
  }

  .wrap-pks {
    width: 100%;
    color: #fff;
    background: url('../img/pks-bj.png') no-repeat;
    background-size: cover;
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