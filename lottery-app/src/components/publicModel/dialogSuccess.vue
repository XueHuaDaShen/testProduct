<template>
  <div class="dialog-success">
    <div class="dialog-bj"></div>
    <div class="dialog-wrap">
      <div class="dialog-content">
        <h2 class="dialog-title">{{dialogTitle}}</h2>
        <p>
          {{dialogText}}
        </p>
        <button @click="toLogin">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dialogSuccess',
  porps: {
    dialogTitle: {
      type: String
    },
    dialogText: {
      type: String
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    toLogin() {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-success{
  position: fixed;
  left:0;
  top:0;
  z-index:999;
  width:100%;
  height:100%;
  .dialog-bj{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0.5;
    background: #000000;
    z-index:1000;
  }
  .dialog-content{
    width:6.9rem;
    min-height:3rem;
    display:inline-block;
    vertical-align: middle;
    background: #fff;
    border-radius: .16rem;
    font-size:.32rem;
    // display:-webkit-box;
    // -webkit-box-orient:vertical;
    // -webkit-box-align:center;
    // -webkit-box-pack:start;
  }
  .dialog-wrap{
    position: fixed;
    z-index:1001;
    left:0;
    top:0;
    right:0;
    bottom:0;
    width:100%;
    height:100%;
    text-align:center;
    &::after{
      content: "";
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
    }
    h2.dialog-title{
      font-size:.36rem;
      color:#191919;
      margin-top:.3rem;
      position: relative;
      em.close-em{
        position: absolute;
        right:.3rem;
        bottom:0;
        width:.46rem;
        height:.46rem;
        border-radius:50%;
        overflow:hidden;
        background:#191919;
        font-size:.5rem;
        color:#fff;
        // text-align:center;
        line-height:.46rem;
        font-weight:normal;
      }
    }
    p{
      font-size:.32rem;
      color:#191919;
      margin-top:.3rem;
      a{
        color:#C83C4A;
      }
    }
    .confirm-to-bets{
      display:block;
      width:4.4rem;
      height:.8rem;
      border-radius: .08rem;
      margin:0 auto;
      margin-top:.6rem;
      margin-bottom:.3rem;
      font-size:.32rem;
      line-height:.8rem;
      background: #C83C4A;
    }
  }
  button{
    display:block;
    width:4.4rem;
    height:.88rem;
    line-height: .88rem;
    text-align: center;
    border-radius: .08rem;
    background: #C83C4A;
    color:#c7c7c7;
    position: relative;
    font-size:.32rem;
    margin:.3rem auto;
  }
}
</style>


