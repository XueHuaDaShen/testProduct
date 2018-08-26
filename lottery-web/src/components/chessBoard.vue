<template>
  <div class="chess-wrap" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <iframe id='chessGame' scrolling="no" frameborder="0"></iframe>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import { formatJson } from '../lib/utils/validator';
  // import qs from 'qs';
  export default {
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
      }
    },
    created() {
      let vm = this;
      window.onload = function() {
        vm.loading = true;
        request.http('post', '/ky/user/login', {
            kindId: 0
          },
          success => {
            vm.loading = false;
            // console.log('success', formatJson(success));
            /* let jsonString = JSON.parse(formatJson(success));
            if (jsonString && jsonString.d && jsonString.d.url) {
              vm.url = jsonString.d.url;
              let chess = document.getElementById('chessGame');
              chess.src = vm.url;
              vm.changeFrameHeight();
            } else {
              vm.$alert('登录失败，请重新登录', '系统提示', {
                confirmButtonText: '确定',
                callback: action => {}
              })
            } */
            if (success.returncode == 200) {
              let data = success.data;
              if (data && data.url) {
                let chess = document.getElementById('chessGame');
                chess.src = data.url;
                vm.changeFrameHeight();
              } else {
                vm.$alert('登录失败，请刷新当前页面重试', '系统提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
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
      };
      window.onresize = function() {
        vm.changeFrameHeight();
      }
    },
    methods: {
      changeFrameHeight() {
        var ifm = document.getElementById("chessGame");
        ifm.height = document.documentElement.clientHeight;
        ifm.width = document.documentElement.clientWidth;
      }
    },
  }
</script>
<style scoped>
</style>