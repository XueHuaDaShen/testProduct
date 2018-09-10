<template>
  <div class="live-wrap" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- <iframe id='liveGame' scrolling="no" frameborder="0"></iframe> -->
    <!-- <div id="liveGame"></div> -->
    <agGame v-if="formData" :formData="formData"></agGame>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import { formatJson } from '../lib/utils/validator';
  // import qs from 'qs';
  import agGame from './agGame'
  export default {
    components: {
      agGame
    },
    data() {
      return {
        loading: false,
        form: {
          account: localStorage.getItem('loginname'),
          s: 0,
          money: 0,
          orderId: '',
          startTime: '',
          endTime: ''
        },
        formData: ''
      }
    },
    created() {
      let vm = this;
      vm.loading = true;
      request.http('post', '/ag/user/login', {
          gameType: '500'
        },
        success => {
          vm.loading = false;
          if (success.returncode == 200) {
            let data = success.data;
            if (data) {
              vm.formData = data;
              // vm.changeFrameHeight();
            } else {
              vm.$alert('登录失败，请刷新当前页面重试', '系统提示', {
                confirmButtonText: '确定',
                callback: action => {}
              })
            }
          } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
            request.loginAgain(vm)
          } else {
            vm.$alert('登录失败，请刷新当前页面重试', '系统提示', {
              confirmButtonText: '确定',
              callback: action => {}
            })
          }
        },
        error => {
          vm.loading = false;
          vm.$alert('登录失败，请刷新当前页面重试', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          console.log("error", error);
        });
      // window.onresize = function() {
      //   vm.changeFrameHeight();
      // }
    },
    mounted() {
      console.log(document);
      document.login.submit();
    },
    methods: {
      changeFrameHeight() {
        var ifm = document.getElementById("liveGame");
        ifm.height = document.documentElement.clientHeight;
        ifm.width = document.documentElement.clientWidth;
      }
    },
  }
</script>
<style scoped>
</style>