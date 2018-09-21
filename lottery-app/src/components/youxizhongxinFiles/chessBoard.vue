<template>
  <div class="chess-wrap" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- <iframe id='chessGame' scrolling="no" frameborder="0"></iframe> -->
    <myDialog v-if="showDialog" :dialogText="dialogText" :dialogTitle="dialogTitle"></myDialog>
  </div>
</template>
<script>
  import request from '@/axios/axios';
  import myDialog from '@/components/publicModel/dialogSuccess';
  import { formatJson } from '@/assets/js/validator';
  // import qs from 'qs';
  export default {
    components: {
      myDialog
    },
    data() {
      return {
        loading: false,
        showDialog: false,
        dialogText: '',
        dialogTitle: '',
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
      const vm = this;
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
            window.location.href = data.url;
            // let chess = document.getElementById('chessGame');
            // chess.src = data.url;
            // vm.changeFrameHeight();
          } else {
            vm.showDialog = true;
            vm.dialogTitle = '系统提示'
            vm.dialogText = '登录失败，请重新登录';
          }
        }
      },
      error => {
        vm.loading = false;
        vm.showDialog = true;
        vm.dialogTitle = '系统提示'
        vm.dialogText = '登录失败，请重新登录';
        console.log("error", error);
      });
      
      // window.onresize = function() {
      //   vm.changeFrameHeight();
      // }
    },
    methods: {
      // changeFrameHeight() {
      //   var ifm = document.getElementById("chessGame");
      //   ifm.height = document.documentElement.clientHeight;
      //   ifm.width = document.documentElement.clientWidth;
      // }
    },
  }
</script>
<style scoped>
</style>