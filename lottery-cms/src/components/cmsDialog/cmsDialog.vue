<template>
  <div class="dialog-user-info" v-show="visible_">
    <div class="dialog-bj"></div>
    <div class="dialog-content">
      <i class="el-icon-close dialog-close" @click="handleCloseClick"></i>
      <div class="dialog-title">{{title_}}</div>
      <div class="content-wrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editor',
    props: {
      title: {
        type: String,
        default: "",
        required: true
      },
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
    },
    data() {
      return {
        load: false,
        title_: this.title,
        visible_: this.visible
      }
    },
    watch: {
      title() {
        this.title_ = this.title;
      },
      visible() {
        this.visible_ = this.visible;
      }
    },
    methods: {
      handleCloseClick() {
        this.visible_ = false;
        this.$emit("closeChange", false)
      },
    },
  }

</script>
<style>
  .dialog-user-info {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .dialog-user-info>.dialog-bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    background: #000;
    opacity: .3;
  }

  .dialog-user-info>.dialog-content {
    width: 900px;
    height: 600px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 102;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #000;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    background: #fff;
  }

  .dialog-user-info .dialog-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    /* z-index:101; */
    color: #fff;
  }

  .dialog-user-info .dialog-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    text-align: left;
    padding-left: 20px;
    background: #409EFF;
  }

  .dialog-user-info .content-wrap {
    height: 522px;
    overflow: auto;
    padding: 15px;
  }

  .dialog-user-info table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .dialog-user-info table th {
    text-align: right;
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  .dialog-user-info table td {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
  }

  /* .cover{
  display: inline-block;
  max-width: 100%;
  height: 64px;
  padding: 2px;
  line-height: 1.6;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0;
  -webkit-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
}
.img-file{
    display: block;
    width: auto;
    padding: .5em;
    font-size: 1rem;
    line-height: 1.2;
    color: #555;
    vertical-align: middle;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 0;
    -webkit-appearance: none;
    -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
} */

</style>
