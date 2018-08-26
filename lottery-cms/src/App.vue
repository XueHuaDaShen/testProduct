<template>
  <div id="app" style="margin:0;height:100%;">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .el-date-range-picker table {
    table-layout: auto;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }

</style>
