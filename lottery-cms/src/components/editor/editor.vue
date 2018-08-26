<template>
  <div class="dialog-user-info" v-loading="load">
    <div class="dialog-bj"></div>
    <div class="dialog-content">
      <i class="el-icon-close dialog-close" @click="handleCloseClick"></i>
      <div class="dialog-title">添加活动公告</div>
      <div class="content-wrap">
        <div>
          <table>
            <tbody>
              <!-- <tr>
                  <th>所属栏目：</th>
                  <td>系统活动</td>
                </tr> -->
              <tr>
                <th>标题：</th>
                <td>
                  <el-input v-model="activityParam.title" placeholder="请输入标题"></el-input>
                </td>
              </tr>
              <tr>
                <th>内容：</th>
                <td>
                  <div id="editorElem" style="text-align:left">
                    <p>{{activityParam.content}}</p>
                  </div>
                </td>
              </tr>
              <!-- <tr>
                  <th>封面图：</th>
                  <td>
                    <img class="cover" src="http://img.ayl.ag/upload/201710/19222636b107.jpeg">
                    <p style="padding-top: .5rem;"><input class="img-file" type="file"></p>
                  </td>
                </tr> -->
              <tr>
                <th></th>
                <td>
                  <el-button style="margin-left:.5rem" :plain="false" size="small" @click="saveFn" round type="success">保存</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tableBtn from '../littleStyle/tableBtn';
  import E from 'wangeditor'
  export default {
    name: 'editor',
    props: {
      activityParam: {
        type: Object,
        required: true
      }
    },
    components: {
      tableBtn
    },
    data() {
      return {
        load: false,
        editorContent: '',
        editor: null,
      }
    },
    methods: {
      handleSearch() {},
      handleCloseClick() {
        this.$emit("closeEditor", false)
      },
      saveFn() {
        this.activityParam.content = this.editor.txt.text();
        this.editor.txt.html('<p>' + this.activityParam.content + '</p>')
        this.activityParam.func(this.activityParam, this.load);
      },
    },
    mounted() {
      this.editor = new E('#editorElem')
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      this.editor.create()
      // console.log(this.activityParam.content)
    }
  }

</script>
<style scoped>
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

  .content-wrap {
    height: 522px;
    overflow: auto;
  }

  .content-wrap>div {
    margin: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  table th {
    text-align: right;
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  table td {
    text-align: left;
    padding: 16px 8px;
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
