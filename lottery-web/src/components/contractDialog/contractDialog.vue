<template>
  <div class="contract-dialog search-form" v-show="visible_">
    <div class="dialog-header">
      <span class="title">{{title_}}</span>
      <i class="close" @click="close()"></i>
    </div>
    <div class="dialog-body">
      <el-dialog :visible.sync="visible_" :top="top_" :show-close='elCloseVisible' custom-class="dialog-class" :before-close="handleClose">
        <slot></slot>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title_: this.title,
        visible_: this.visible,
        top_: this.top,
        elCloseVisible: false,
        modalValue: false,
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      top: {
        type: String,
        default: '15px'
      },
    },
    watch: {
      'visible' () {
        this.visible_ = this.visible;
      },
      'title' () {
        this.title_ = this.title;
      },
      'top' () {
        this.top_ = this.top;
      }
    },
    methods: {
      close() {
        this.visible_ = false;
        this.$emit('visibleChange', false);
      },
      handleClose() {
        this.visible_ = false;
        this.$emit('visibleChange', false);
      }
    }
  }
</script>
<style scoped>
  .contract-dialog {
    background: transparent;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 10000;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 762px;
    margin: 0 auto;
    margin-top: 15vh;
  }

  .dialog-header .title {
    font-size: 24px;
    color: #FFFFFF;
  }

  .dialog-header .close {
    background: url("../../assets/img/icon_Quit@3x.png");
    display: inline-block;
    height: 32px;
    width: 32px;
    background-size: cover;
    cursor: pointer;
  }

  .contract-add-class {}

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>