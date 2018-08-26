<template>
  <div class="slider">
    <div class="s-item" @click="open()">
      <div class="bg bg1"></div>
      <p>客服</p>
    </div>
    <div class="s-item">
      <div class="bg bg2"></div>
      <p>QQ</p>
      <div class="inner-hover">
        <img src="../../assets/img/qq_qr_code.png" />
      </div>
    </div>
    <div class="s-item">
      <div class="bg bg3"></div>
      <p>微信</p>
      <div class="inner-hover">
        <img src="../../assets/img/wc_qr_code.png" />
      </div>
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
<style lang="scss" scoped>
  .slider {
    background: #F4F4F4;
    position: fixed;
    right: 20px; // top: 460px;
    top: 50%;
    margin-top: -105px;
    z-index: 5000;
    height: 210px;
    .s-item {
      width: 70px;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-bottom: 1px solid #DDDDDD;
      cursor: pointer;
      .inner-hover {
        display: none; // padding: 20px;
        position: absolute;
        right: 70px;
        top: 0;
        width: 212px;
        height: 212px;
        margin-right: 20px;
        z-index: 5000;
        background: #F4F4F4;
        box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.50);
        >img {
          width: 100%;
          display: block;
        }
      }
      .bg1 {
        background: url("../../assets/img/icon_Customer_serviceu@3x.png") no-repeat;
        background-size: 100%;
        width: 30px;
        height: 30px;
      }
      .bg2 {
        background: url("../../assets/img/icon_QQu@3x.png") no-repeat;
        background-size: 100%;
        height: 29px;
        width: 26px;
      }
      .bg3 {
        background: url("../../assets/img/icon_WeChatu@3x.png") no-repeat;
        background-size: 100%;
        height: 26px;
        width: 32px
      }
      >p {
        font-weight: 700;
        font-size: 12px;
        color: #777777;
        text-align: center;
        margin-top: 10px;
      }
      &:first-child:hover {
        background: #C83C4A;
      }
      &:hover {
        background: #777777;
        &:after {
          content: "";
          width: 20px;
          position: absolute;
          right: 70px;
          top: 0;
          bottom: 0;
        }
        .inner-hover {
          display: block;
        }
        .bg1 {
          background: url("../../assets/img/icon_Customer_service@3x.png") no-repeat;
          background-size: 100%;
        }
        .bg2 {
          background: url("../../assets/img/icon_QQ@3x.png") no-repeat;
          background-size: 100%;
        }
        .bg3 {
          background: url("../../assets/img/icon_WeChat@3x.png") no-repeat;
          background-size: 100%;
        }
        >p {
          color: #FFFFFF;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>