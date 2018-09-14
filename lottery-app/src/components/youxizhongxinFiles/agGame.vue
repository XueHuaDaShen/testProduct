<template>
  <div class="chess-wrap" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <iframe id='agGame' scrolling="no" frameborder="0"></iframe>
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
      request.http(
        'post',
        '/ag/user/login',
        {
          gameType: vm.$route.query.gameType
        },
        success => {
          vm.loading = false;
          if (success.returncode == 200) {
            let data = success.data;
            if (data && data.url) {
              let agGame = document.getElementById('agGame');
              agGame.src = data.url;
              vm.changeFrameHeight();
            } else {
              vm.dialogTitle = '系统提示'
              vm.dialogText = '登录失败，请重新登录';
              vm.showDialog = true;
            }
          }
        },
        error => {
          vm.loading = false;
          vm.dialogTitle = '系统提示'
          vm.dialogText = '登录失败，请重新登录';
          vm.showDialog = true;
          console.log("error", error);
        }
      );
      window.onresize = function() {
        vm.changeFrameHeight();
      }
    },
    methods: {
      changeFrameHeight() {
        var ifm = document.getElementById("agGame");
        ifm.height = document.documentElement.clientHeight;
        ifm.width = document.documentElement.clientWidth;
      }
    },
  }
</script>
<style scoped>
</style>