<template>
  <div id="app" onselectstart="return false;">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  /* ballon.css 样式复写 */
  [data-balloon]:after {
    font-weight: bold !important;
    font-size: 16px !important;
    padding: .1em 1em;
    min-height: 1.5em;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }

  /* .order-detail-wrap{
    padding-top:20px;
  } */
  #app .main .top-bar {
    font-weight: 800;
  }

  #app .tabs {
    font-weight: 800;
  }

  #app .lottery-nav span {
    display: block;
    -webkit-box-flex: 1;
    line-height: 43px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #000;
    font-weight: 800;
  }

  #app .lottery-nav .currentTabs {
    border-top: 4px solid #BD8454;
    background: #F4F4F4;
    color: #BD8454;
    font-weight: 800;
    line-height: 36px;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  [v-cloak] {
    display: none;
  }
</style>