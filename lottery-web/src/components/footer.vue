<template>
  <div class="footer">
    <div class="container">
      <div class="footer-top">
        <img src="../assets/img/Logo@3x.png">
      </div>
      <div class="footer-cen">
        <router-link target="_blank" :to="{name:'introduce'}">必赢品牌</router-link>
        <router-link target="_blank" :to="{name:'cjwt'}">帮助中心</router-link>
        <router-link target="_blank" :to="{name:'introduce'}">联系我们</router-link>
        <!-- <a @click="open">联系我们</a> -->
        <router-link target="_blank" :to="{name:'download'}">手机客户端</router-link>
        <router-link target="_blank" :to="{name:'antiHijacking'}">防劫持教程</router-link>
      </div>
      <div class="footer-bot">© 2018 必赢游戏版权所有</div>
      <div class="footer-tip">必赢游戏郑重提示：彩票有风险，投注需谨慎，不向未满18周岁的青少年出售彩票</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      }
    }
  }
</script>

<style scoped>
  .help .footer .container {
    width: 1244px;
  }

  .footer {
    width: 100%;
    background: #191919;
    color: #fff;
  }

  .footer .container {
    width: 1024px;
    margin: 0 auto;
    height: 300px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .footer-top {
    margin-top: 21px;
    height: 39px;
    text-align: left;
  }

  .footer-top>img {
    height: 39px;
  }

  .footer-cen {
    margin-top: 20px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    font-weight: 700;
  }

  .footer-cen a {
    margin-right: 60px;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }

  .footer-bot {
    margin-top: 60px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #BD8454;
    text-align: center;
  }

  .footer-tip {
    margin-top: 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #777777;
    text-align: center;
  }
</style>