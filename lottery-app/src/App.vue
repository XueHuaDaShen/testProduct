<template>
  <div id="app">
    <loadingView v-if="getLoading"></loadingView>
    <!-- <transition :name="transitionName"> -->
      <router-view style="width:100%;height:100%"/>
    <!-- </transition> -->
  </div>
</template>

<script>
import loadingView from '@/components/loading';
export default {
  name: 'App',
  components: {
    loadingView
  },
  computed: {
    getLoading() {
      return this.$store.state.showLoading;
    }
  },
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      // console.log(to,from)
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.transitionName = 'slide-left';
      }else{
        this.transitionName = 'slide-right';
      }
    }
  }
}
</script>

<style>
html{
  width:100%;
  height:100%;
  background:url('./assets/img/login-bj.png') no-repeat;
  background-size:cover;
}
body{
  width:100%;
  height:12.94rem;
  /* min-height:100%; */
  /* min-height:13.34rem; */
}
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
ul,ol,li{
  list-style:none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif, PingFangSC-Medium;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  height:100%;
}

.display-none-input{
  position: absolute;
  left:0;
  top:0;
  z-index:-5;
  width:1px;
  height:1px;
  opacity: 0;
}

.alert-tip-text{
  position: fixed;
  right:0;
  left:0;
  top:0;
  bottom:0;
  margin:auto;
  width:5rem;
  height:.68rem;
  line-height:.68rem;
  border-radius:.08rem;
  text-align:center;
  color:#fff;
  background:#000;
  z-index:9999;
}

input::-webkit-input-placeholder { /* WebKit browsers */
  color: #646464;
}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #646464;
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #646464;
}
input:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #646464;
}
img{
  display:block;
  width:100%;
}
::-webkit-scrollbar {/*隐藏滚轮*/
  display: none;
}
.split-bar{
  width:100%;
  height:.2rem;
  background:#212129;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
