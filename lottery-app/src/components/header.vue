<template>
  <div class="header-wrap">
    <div class="header-content">
      <span class="header-sanjiao left-sanjiao" v-if="getBack" @click="back"></span>
      <span class="title-text" v-if="getTitleText !== '首页'">{{getTitleText}}</span>
      <span class="title-icon" v-if="getTitleText === '首页'"><img src="@/assets/img/header-logo.png"></span>
      <div class="select-bets-mode-btn" v-if="getPlayMode" @click="handleShowPlayModeDialog">
        <span>{{getPlayName[0]?getPlayName[0].join(''):''}}</span>
        <em class="slide-down-em-white"></em>
      </div>
      <span class="clean" v-if="getCleanBtn" @click="cleanShoppingCart">清空</span>
      <div class="header-kfzx" v-if="getTitleText === '个人中心'" @click="kfzxFn">
        <span class="kfzx-icon"></span>
        <p>客服中心</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myHeader',
  data() {
    return {
      
    }
  },
  created() {
    // console.log(this)
    // console.log(this.getPlayName[0])
  },
  computed: {
    getTitleText() {
      return this.$store.state.title
    },
    getBack() {
      return this.$store.state.showBack
    },
    getPlayMode() {
      return this.$store.state.showPlayMode
    },
    getPlayName() {
      return this.$store.state.playName
    },
    getCleanBtn() {
      return this.$store.state.showCleanBtn
    }
  },
  methods: {
    // 后退
    back() {
      // this.$router.back(-1);
      // console.log(this)
      // return false;
      // if(this.$route.path === '/yhkgl'){
      //   this.$router.push({
      //     name: 'grzxsy'
      //   })
      // }else 
      if(this.$route.path === '/recharge'){
        this.$router.push({
          name: 'zjglsy'
        })
      }else{
        this.$router.back(-1);
      }
      this.$store.dispatch('setFooterStatus', true)
      this.$store.dispatch('setBackStatus', false)
      this.$store.dispatch('setPlayModeStatus', false)
      this.$store.dispatch('setCleanBtn', false)
    },
    // 显示玩法弹框
    handleShowPlayModeDialog() {
      // console.log(1)
      this.$emit('showPlayModeDialog', '')
    },
    // 清空购彩篮
    cleanShoppingCart() {
      this.$store.dispatch('setShoppingCartData', [])
    },
    // 客服中心
    kfzxFn() {
      // let script = document.createElement('script');
      // let src = 'https://ytpfx.livechatvalue.com/chat/chatClient/monitor.js?jid=8295678173&companyID=1027559&configID=43462&codeType=custom&ss=1'
      // // let src = 'https://ytpfx.livechatvalue.com/chat/chatClient/monitor.js'
      // script.setAttribute('language', 'javascript')
      // script.setAttribute('src', src)
      // document.getElementsByTagName('body')[0].insertBefore(script, document.getElementById('app'));
      location.href = 'https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1';
      return false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/publicStyle.scss';
$color:#c7c7c7;
.header-wrap{
  width:100%;
  .header-content{
    width:100%;
    height:.88rem;
    color: $color;
    font-size:.36rem;
    text-align:center;
    line-height: .88rem;
    position: relative;
    border-bottom:.01rem solid #333;
    .header-sanjiao{
      // @include backSanjiao(.3rem, .3rem, #E1C79B, .04rem, -135deg);
      // @include backSanjiao(.3rem, .3rem, #c7c7c7, .04rem, -135deg);
      // left:.3rem;
      // bottom:.3rem;
    }
    .title-text{
      height:.5rem;
      line-height:.5rem;
      display:inline-block;
    }
    .title-icon{
      display:inline-block;
      width:2.92rem;
      height:.5rem;
      margin-top:.18rem;
    }
    .class_2{
      color:#E1C79B;
    }
    .clean{
      position: absolute;
      right:.3rem;
      bottom:.24rem;
      height:.4rem;
      font-size:.28rem;
      line-height:.4rem;
      color:#C83C4A;
    }
    .select-bets-mode-btn{
      position: absolute;
      width:1.7rem;
      height:.4rem;
      right:.3rem;
      bottom:.2rem;
      color:#C83C4A;
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:justify;
      span{
        display:block;
        width:1.4rem;
        height:100%;
        line-height:.4rem;
        overflow:hidden;
        text-overflow:ellipsis;
        text-align:center;
        white-space: nowrap;
        // text-align:left;
        font-size:.28rem;
      }
      em{
        display:block;
        width:.2rem;
        height:.12rem;
        background:#fff;
      }
    }
    .header-kfzx{
      position: absolute;
      height:.37rem;
      right:.3rem;
      bottom:.2rem;
      font-size:.26rem;
      display:-webkit-box;
      -webkit-box-align:center;
      span{
        display:block;
        width:.37rem;
        height:.34rem;
        background:url('../assets/h5-img/customer.png') no-repeat;
        background-size:100% 100%;
        margin-right:.1rem;
      }
      p{
        display:block;
        height:.37rem;
        line-height:.42rem;
      }
    }
  }
}
</style>


