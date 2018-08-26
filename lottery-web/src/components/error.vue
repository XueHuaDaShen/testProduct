<template>
  <div class="error-wrap">
    <h1>很抱歉，您访问的页面不存在</h1>
    <a href="/home">返回首页</a>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style scoped>
  .wrap-mt10 {
    margin: 10px 0 0 0
  }

  .grid-content {
    width: 322px;
    height: 186px;
    cursor: pointer;
  }

  .grid-content > a {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .a1 {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    transition: all 0.3s ease-in;
  }

  .a1:hover {
    transform: scale(1.1);
  }

  .a2:hover {
    transform: scale(1.1);
  }

  .a3:hover {
    transform: scale(1.1);
  }

  .a2 {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    transition: all 0.3s ease-in;
  }

  .a3 {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    transition: all 0.3s ease-in;
  }

  .a1:hover {
    /*background: #18A4F3;*/
    opacity: 1;
  }

  .a2:hover {
    /*background: #D54C4C;*/
    opacity: 1;
  }

  .a3:hover {
    /*background: #AB189F;*/
    opacity: 1;
  }

  .label-tag {
    position: absolute;
    left: 0;
    top: 10px;
    font-family: PingFangSC-Semibold;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0.75px;
    background: rgba(0, 0, 0, 0.80);
    border-bottom-right-radius: 25%;
    border-top-right-radius: 25%;
    height: 26px;
    width: 80px;
    line-height: 26px;
  }
</style>
