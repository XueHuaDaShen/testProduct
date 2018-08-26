/* 电子游艺 */
<template>
  <div class="recreation-wrap">
    <div class="header clearfix">
      <div class="header-fl title">
        <span class="text">电子游艺</span>
        <span class="en">FECREATION</span>
      </div>
    </div>
    <div class="main">
      <a class="icon1"></a>
      <a class="icon2"></a>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    }
  }
</script>
<style scoped>
  .recreation-wrap {
    width: 678px;
    float: left;
    margin-top: 10px;
    background: url(../assets/img/Recreation_3@3x.png) no-repeat;
    background-size: cover;
  }

  .recreation-wrap:hover {
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
  }

  .recreation-wrap .header {
    height: 40px;
    padding: 5px 10px;
  }

  .title {
    font-family: PingFangSC-Regular;
  }

  .title .text {
    font-size: 18px;
    color: #FFFFFF;
    vertical-align: middle;
    display: inline-block;
  }

  .title .en {
    font-size: 14px;
    color: #FFFFFF;
    vertical-align: middle;
    display: inline-block;
    margin-left: 5px;
  }

  .recreation-wrap .main {
    height: 300px;
    position: relative;
  }

  .recreation-wrap .main .icon2 {
    display: inline-block;
    position: absolute;
    height: 120px;
    width: 140px;
    bottom: 30px;
    right: 30px;
    background: url("../assets/img/Species_5@3x.png") no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .recreation-wrap .main .icon1 {
    display: inline-block;
    position: absolute;
    height: 120px;
    width: 140px;
    bottom: 30px;
    right: 195px;
    background: url("../assets/img/Species_1@3x.png") no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .header-fl {
    float: left;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>