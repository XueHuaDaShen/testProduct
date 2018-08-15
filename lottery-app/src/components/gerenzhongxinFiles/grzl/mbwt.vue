<template>
  <div class="mbwt-wrap">
    <p class="mbwt-tip">安全问题是您进行资金操作时的必要凭证，平台将在您执行重要资金操作时向您验证;请谨慎设置，安全问题设置后不可更改。</p>
    <ul>
      <li class="li-wrap">
        <div class="que">
          <span>问题一：</span>
          <publicSelect
            v-if="showQue1"
            class="select-wrap"
            placeholder="请选择安全问题一"
            :selectList="queOneList"
            :label="selectTxt"
            :value="selectVal"
            :callback="getQue1SelectedOption">
          </publicSelect>
        </div>
        <div class="ans">
          <span>答案：</span>
          <input type="text" v-model="ans1">
        </div>
      </li>
      <li class="li-wrap">
        <div class="que">
          <span>问题二：</span>
          <publicSelect
            v-if="showQue2"
            class="select-wrap"
            placeholder="请选择安全问题二"
            :selectList="queTwoList"
            :label="selectTxt"
            :value="selectVal"
            :callback="getQue2SelectedOption">
          </publicSelect>
        </div>
        <div class="ans">
          <span>答案：</span>
          <input type="text" v-model="ans2">
        </div>
      </li>
      <li class="li-wrap">
        <div class="que">
          <span>问题三：</span>
          <publicSelect
            v-if="showQue3"
            class="select-wrap"
            placeholder="请选择安全问题三"
            :selectList="queThreeList"
            :label="selectTxt"
            :value="selectVal"
            :callback="getQue3SelectedOption">
          </publicSelect>
        </div>
        <div class="ans">
          <span>答案：</span>
          <input type="text" v-model="ans3">
        </div>
      </li>
    </ul>
    <button class="submit-btn" @click="setQuestion">提交</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    
    <div class="edit-success-dialog" v-if="showDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <em class="close-em" @click="showDialog = false">×</em>
        <p>{{setQuestionSuccessText}}</p>
        <button class="submit-btn" @click="successConfirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import publicSelect from '@/components/publicModel/select';
export default {
  name: 'mbwt',
  components: {
    publicSelect
  },
  data() {
    return {
      selectVal: '_id', // 选项值的 字段
      selectTxt: 'content', // 选项文本 字段

      showDialog: false,
      setQuestionSuccessText: '',

      que1: '',
      que2: '',
      que3: '',

      showQue1: false,
      showQue2: false,
      showQue3: false,

      ans1: '',
      ans2: '',
      ans3: '',

      queOneList: [],
      queTwoList: [],
      queThreeList: [],

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '安全管理');
    this.questionOne();
    this.questionTwo();
    this.questionThree();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取问题一的选中项
    getQue1SelectedOption(item) {
      this.que1 = item._id
    },
    // 获取问题二的选中项
    getQue2SelectedOption(item) {
      this.que2 = item._id
    },
    // 获取问题三的选中项
    getQue3SelectedOption(item) {
      this.que3 = item._id
    },
    // 获取选中的值
    handleGetSelected(data) {
      // console.log(data)
      let item = data[0];
      let val = data[1];
      this[val] = item[this.selectVal];
    },
    // 获取问题列表
    getQuestion(num, arr, showQue) {
      const vm = this;
      vm[showQue] = false;
      request.http(
        'get',
        '/user/bankcard/safe/question/list',
        {num: num},
        (success) => {
          // console.log(success)
          if(success.returncode == 200) {
            vm[arr] = success.data.questions;
            vm[showQue] = true;
          }
        },
        (error) => {}
      )
    },
    // 问题1
    questionOne() {
      this.getQuestion(1, 'queOneList', 'showQue1')
    },
    // 问题2
    questionTwo() {
      this.getQuestion(2, 'queTwoList', 'showQue2')
    },
    // 问题3
    questionThree() {
      this.getQuestion(3, 'queThreeList', 'showQue3')
    },
    // 设置安全问题
    setQuestion() {
      const vm = this;
      if (vm.que1 === '') {

        vm.tipText = '请选择问题一';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else if (vm.ans1 === '') {

        vm.tipText = '答案一不能为空';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else if (vm.que2 === '') {

        vm.tipText = '请选择问题二';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else if (vm.ans2 === '') {

        vm.tipText = '答案二不能为空';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else if (vm.que3 === '') {

        vm.tipText = '请选择问题三';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else if (vm.ans3 === '') {

        vm.tipText = '答案三不能为空';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;

      } else {
        request.http(
          'post',
          '/user/bankcard/safe/question/create',
          {
            questions: [
              {questionid: vm.que1, content: vm.ans1},
              {questionid: vm.que2, content: vm.ans2},
              {questionid: vm.que3, content: vm.ans3},
            ]
          },
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code) {
              if (code == 103 || code == 106 || code == 101) {
                request.loginAgain(vm);
              } else if (code == 200) {
                vm.showDialogFn('问题设置成功')
                vm.initQueAndAns();
              } else {
                // console.log('error', code);
              }
            }
          },
          (error) => {}
        )
      }
    },
    // 初始化问题和答案
    initQueAndAns() {
      vm.que1 = '';
      vm.que2 = '';
      vm.que3 = '';

      vm.ans1 = '';
      vm.ans2 = '';
      vm.ans3 = '';
    },
    // 显示弹框
    showDialogFn(text) {
      this.$store.dispatch('setHeader', false);
      this.setQuestionSuccessText = text;
      this.showDialog = true;
    },
    // 问题设置成功后路由返回上一层
    successConfirm() {
      this.$router.back(-1)
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.mbwt-wrap{
  .mbwt-tip{
    color:#646464;
    margin:.3rem .35rem;
    display:block;
  }
  ul{
    width:100%;
    display: table;
    .li-wrap{
      height:1.76rem;
      padding:0 .3rem;
      background: #292932;
      // display:-webkit-box;
      // -webkit-box-align:center;
      margin-top:.3rem;
      .que{
        border-bottom: .01rem solid #3C3C3C;
      }
      .que, .ans{
        height:.88rem;
        display:-webkit-box;
        -webkit-box-align:center;
        position: relative;
      }
      span{
        display:block;
        margin-left:.3rem;
      }
      .select-wrap{
        -webkit-box-flex:1;
        height:.88rem;
        position: relative;
        p{
          display: block;
          line-height:.88rem;
          padding-left:.1rem;
          color:#646464;
        }
        p.selected{
          color:#c7c7c7;
        }
        em{
          position: absolute;
          width:.243rem;
          height:.163rem;
          background:#c7c7c7;
          right:0;
          top:.357rem;
        }
        ol{
          display:block;
          position: absolute;
          z-index:33;
          overflow: hidden;
          right:0;
          top:.88rem;
          width:100%;
          height:0;
          transition: all .3s;
          padding-left:.1rem;
          // padding-right:.3rem;
          // li.default-option{
          //   color:#c7c7c7;
          // }
          li{
            margin:0;
            height:.88rem;
            padding-left:.1rem;
            padding-right:.3rem;
            background:#fff;
            color:#000;
            line-height:.88rem;
          }
          li.active{
            background:#c7c7c7;
          }
        }
      }
      .showOptions{
        ol.option{
          height:4.4rem;
          transition: all .3s;
        }
      }
      input{
        display:block;
        -webkit-box-flex:1;
        padding-right:.3rem;
        padding-left:.1rem;
        outline: none;
        border: none;
        background: #292932;
        color:#c7c7c7;
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
    }
  }
  .edit-success-dialog{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    .dialog-bj{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background: #000;
      opacity:.8;
    }
    .dialog-content{
      width:6rem;
      height:3rem;
      position: absolute;
      left:0;
      top:0;
      bottom:0;
      right:0;
      margin:auto;
      border-radius:.16rem;
      background: #fff;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      em.close-em{
        position: absolute;
        right:.3rem;
        top:.3rem;
        width:.46rem;
        height:.46rem;
        border-radius:50%;
        overflow:hidden;
        background:#191919;
        font-size:.5rem;
        color:#fff;
        // text-align:center;
        text-indent: .06rem;
        line-height:.46rem;
      }
      p{
        display:block;
        margin-bottom:.6rem;
        font-size:.32rem;
        color:#C83C4A;
      }
      button.submit-btn{
        height:.88rem;
        line-height:.88rem;
        margin:0;
      }
    }
  }
  button.submit-btn{
    display:block;
    width:4.4rem;
    height:.8rem;
    background: #C83C4A;
    border-radius: .08rem;
    margin-top:1.2rem;
    margin-left:1.55rem;
    font-size:.32rem;
    line-height:.8rem;
  }
}
</style>


