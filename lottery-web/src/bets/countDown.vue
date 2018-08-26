<template>
  <div class="count-down-time-wrap">
    <div class="deadline">
      <div class="deadline-number">
        <em class="hour-left" :class="th1?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{h1}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{h1}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{h1}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{h1}}</span>
          </span>
        </em>
        <em class="hour-right" :class="th2?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{h2}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{h2}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{ch2}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{ch2}}</span>
          </span>
        </em>
        <span class="space">:</span>
        <em class="min-left" :class="tm1?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{m1}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{m1}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{cm1}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{cm1}}</span>
          </span>
        </em>
        <em class="min-right" :class="tm2?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{m2}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{m2}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{cm2}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{cm2}}</span>
          </span>
        </em>
        <span class="space">:</span>
        <em class="sec-left" :class="ts1?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{s1}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{s1}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{cs1}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{cs1}}</span>
          </span>
        </em>
        <em class="sec-right" :class="ts2?'min-left-anim':''">
          <b class="deadline-number-mask"></b>
          <span class="deadline-num deadline-num-next-t">
            <span class="inner">{{s2}}</span>
          </span>
          <span class="deadline-num deadline-num-next-b">
            <span class="inner">{{s2}}</span>
          </span>
          <span class="deadline-num deadline-num-t">
            <span class="inner">{{cs2}}</span>
          </span>
          <span class="deadline-num deadline-num-b">
            <span class="inner">{{cs2}}</span>
          </span>
        </em>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" style="margin-top:28vh" width="16%">
      <div class="tip-alert-content">
        <span>当前已进入第</span>
        <span class="tip-alert-content-issue">{{issue}} 期</span>
        <span>请留意期号变化({{alertCount}})</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../axios/axios.js'
  export default {
    name: 'countDown',
    props: {
      gameid: {
        type: String,
        required: true
      },
      issueNo: {
        type: Number,
        required: true
      }
    },
    created() {
      this.issue = this.issueNo+1;
      this.getCountTime();
    },
    data() {
      return {
        // 时间的每一个值
        h1: 0,
        h2: 0,
        m1: 0,
        m2: 0,
        s1: 0,
        s2: 0,
        // clone 的时间值
        ch1: 0,
        ch2: 0,
        cm1: 0,
        cm2: 0,
        cs1: 0,
        cs2: 0,
        // 是否添加 class
        th1: false,
        th2: false,
        tm1: false,
        tm2: false,
        ts1: false,
        ts2: false,

        alertCount: 3,
        dialogVisible: false,
        issue: '',
      }
    },
    methods: {
      getCountTime() {
        const vm = this;
        request.http(
          'get',
          '/lottery/refresh', { gameid: vm.gameid },
          (success) => {
            // console.log(success);
            // console.log(new Date().getSeconds())
            let latestIssue = success.data.latestIssue;
            let code = success.returncode;
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              vm.countDownTime = vm.secondsToTime(latestIssue.countdown);
              vm.setValue();
            } else {
              vm.countDownTime = '00:00:00';
              vm.setValue();
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      setValue() {
        const vm = this;
        // console.log(vm.countDownTime)
        let arr = this.countDownTime.split(':');
        vm.h1 = arr[0][0];
        vm.h2 = arr[0][1];
        vm.m1 = arr[1][0];
        vm.m2 = arr[1][1];
        vm.s1 = arr[2][0];
        vm.s2 = arr[2][1];

        vm.ch1 = arr[0][0];
        vm.ch2 = arr[0][1];
        vm.cm1 = arr[1][0];
        vm.cm2 = arr[1][1];
        vm.cs1 = arr[2][0];
        vm.cs2 = arr[2][1];
        let time = vm.h1 + vm.h2 + ':' + vm.m1 + vm.m2 + ':' + vm.s1 + vm.s2;
        if (vm.h1 == 0 && vm.h2 == 0 && vm.m1 == 0 && vm.m2 == 0 && vm.s1 == 0 && vm.s2 == 0) {
          this.$emit("sendTime", time)
          return false
        }
        this.setCountDown()
      },
      setCountDown() {
        const vm = this;
        var st = setInterval(() => {
          vm.s2--;
          if (vm.s2 < 0 && vm.s1 > 0) {
            vm.s2 = 9;
            vm.s1--;
            vm.ts1 = true;
          } else if (vm.s2 < 0 && vm.s1 < 1 && vm.m2 > 0) {
            vm.m2--;
            vm.s1 = 5;
            vm.s2 = 9;

            vm.tm2 = true;
            vm.ts1 = true;
          } else if (vm.s2 < 0 && vm.s1 < 1 && vm.m2 < 1 && vm.m1 > 0) {
            vm.m1--;
            vm.m2 = 9
            vm.s1 = 5;
            vm.s2 = 9;

            vm.tm1 = true;
            vm.tm2 = true;
            vm.ts1 = true;
          } else if (vm.s2 < 0 && vm.s1 < 1 && vm.m2 < 1 && vm.m1 < 1 && vm.h2 > 0) {
            vm.h2--;
            vm.m1 = 5;
            vm.m2 = 9
            vm.s1 = 5;
            vm.s2 = 9;

            vm.th2 = true;
            vm.tm1 = true;
            vm.tm2 = true;
            vm.ts1 = true;
          } else if (vm.s2 < 0 && vm.s1 < 1 && vm.m2 < 1 && vm.m1 < 1 && vm.h2 < 1 && vm.h1 > 0) {
            vm.h1--;
            vm.h2 = 9;
            vm.m1 = 5;
            vm.m2 = 9
            vm.s1 = 5;
            vm.s2 = 9;

            vm.th1 = true;
            vm.th2 = true;
            vm.tm1 = true;
            vm.tm2 = true;
            vm.ts1 = true;
          }
          vm.ts2 = true;
          setTimeout(function() {
            vm.th1 = false;
            vm.th2 = false;
            vm.tm1 = false;
            vm.tm2 = false;
            vm.ts1 = false;
            vm.ts2 = false;
            vm.ch1 = vm.h1;
            vm.ch2 = vm.h2;
            vm.cm1 = vm.m1;
            vm.cm2 = vm.m2;
            vm.cs1 = vm.s1;
            vm.cs2 = vm.s2;
          }, 600)
          let time = vm.h1 + vm.h2 + ':' + vm.m1 + vm.m2 + ':' + vm.s1 + vm.s2;
          vm.$emit("sendTime", time)
          if (vm.h1 == 0 && vm.h2 == 0 && vm.m1 == 0 && vm.m2 == 0 && vm.s1 == 0 && vm.s2 == 0) {
            vm.$emit("countdownisflase", false);
            vm.getCountTime();
            clearInterval(st);
            vm.getNextIssue();
          }
        }, 1000)
      },
      alertTip() {
        this.dialogVisible = true;
        this.alertCount = 3;
        const vm = this;
        var st = setInterval(() => {
          vm.alertCount--
          if (vm.alertCount === 0) {
            vm.dialogVisible = false;
            clearInterval(st);
          }
        }, 1000)
      },
      secondsToTime(s) {
        var t;
        if (s > -1) {
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          if (hour < 10) {
            t = '0' + hour + ":";
          } else {
            t = hour + ":";
          }

          if (min < 10) { t += "0"; }
          t += min + ":";
          if (sec < 10) { t += "0"; }
          t += sec;
        }
        return t;
      },
      getNextIssue() {
        const vm = this;
        request.http(
          'get',
          '/lottery/refresh', { gameid: vm.gameid },
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
              if(latestIssue !== -1){
                vm.issue = latestIssue.issue_no;
              }
              vm.alertTip();
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    }
  }
</script>
<style>
  .count-down-time-wrap .el-dialog__header {
    padding: 0;
  }

  .count-down-time-wrap .el-dialog__body {
    padding: 10px 0;
  }

  .tip-alert-content {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }

  .tip-alert-content span {
    display: block;
    font-size: 14px;
    font-weight: bold;
  }

  .tip-alert-content span.tip-alert-content-issue {
    color: #F60;
    font-size: 16px;
  }
</style>

<style scoped>
  @import '../linkCss/countDown.css';
</style>