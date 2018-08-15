<template>
  <div class="my-loading-view">
    <!-- <img src="@/assets/img/loading.gif" class="loading-icon"> -->
    <div class="loading-bj"></div>
    <div class="loading-showbox">
      <div class="loading-loader">
        <svg class="loading-circular" viewBox="25 25 50 50">
          <circle class="loading-path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
        </svg>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/loading.scss';

.my-loading-view{
  width:100%;
  height:100%;
  position: absolute;
  left:0;
  top:0;
  z-index:99999;
  .loading-bj{
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    background:#000;
    opacity:.5;
  }
}
</style>

