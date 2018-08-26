<template>
  <div style="height: 100%;">
    <banner></banner>
    <div class="content">
      <el-row>
        <lotteryEntrance></lotteryEntrance>
        <announce></announce>
      </el-row>
      <el-row>
        <otherCasino></otherCasino>
      </el-row>
      <!-- <el-row>
        <recreation></recreation>
        <sports></sports>
      </el-row>
      <liveCasino></liveCasino> -->
      <activityWrap></activityWrap>
      <slider></slider>
    </div>
  </div>
</template>
<script>
  import activityWrap from './activityWrap';
  import lotteryEntrance from './lotteryEntrance';
  import announce from './announce';
  // import recreation from './recreation';
  // import sports from './sports';
  import otherCasino from './otherCasino';
  import request from '../axios/axios.js'
  import banner from './banner';
  import slider from './slider/index.vue';

  export default {
    name: 'Index',
    components: {
      banner,
      activityWrap,
      lotteryEntrance,
      announce,
      // recreation,
      // sports,
      otherCasino,
      slider
    },
    data() {
      return {
        myInterval: null, // 定时器
        getIssueTime: 10, // 获取最新一期 期号的定时 s
      }
    },
    created() {
      this.newIssueInterval();
    },
    beforeDestroy() {
      // console.log('beforeDestroy')
    },
    destroyed() {
      const vm = this;
      clearInterval(vm.myInterval)
      // console.log('Destroy')
    },
    methods: {
      // 定时获取最新的期数
      getNewIssue() {
        const vm = this;
        var time = vm.getIssueTime;
        vm.myInterval = setInterval(vm.newIssueInterval, (time * 1000))
      },
      newIssueInterval() {
        const vm = this;
        // console.log(new Date().getSeconds())
        request.http(
          'get',
          '/lottery/refresh', {},
          (success) => {
            // console.log(success);
            // console.log(new Date().getSeconds())
            let latestIssue = success.data.latestIssue;
            let code = success.returncode;
            if (latestIssue === -1) {
              vm.activityBegin = true
            } else {
              vm.activityBegin = false;
            }
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              vm.$store.dispatch('setBlance', success.data.cash);
              localStorage.setItem('blance', success.data.cash);
            }
          },
          (error) => {
            console.log(error)
          }
        )

      },
    }
  }
</script>
<style scoped>
  .content {
    width: 1024px;
    margin: 0 auto;
  }
</style>