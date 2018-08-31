<template>
  <div class="psd-wrap search-form" v-loading="loading">
    <div v-if="!isSetSafeQ" v-cloak>
      <div v-if="!checkRules&&!isSetSafeQFirst">
        <div class="issue">
          <div class="issue-one">
            <p class="issue-title-one"> 安全问题是您进行资金操作时的必要凭证，平台将在您执行重要资金操作时向您验证；</p>
            <p class="issue-title-two">请谨慎设置，安全问题设置后不可更改。</p>
          </div>
          <div class="issue-two mt-30 item">
            <ul>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题一：</span>
                <el-select v-model="question1.selected" placeholder="请选择安全问题一" clearable class="content placeholder" @change="changeValueQ1">
                  <el-option v-for="item in question1.options" :key="item._id" :label="item.content" :value="item._id">
                  </el-option>
                </el-select>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <el-input class="content" v-model="question1.input" clearable type="text">
                </el-input>
              </li>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题二：</span>
                <el-select v-model="question2.selected" placeholder="请选择安全问题二" clearable class="content placeholder" @change="changeValueQ2">
                  <el-option v-for="item in question2.options" :key="item._id" :label="item.content" :value="item._id">
                  </el-option>
                </el-select>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <el-input class="content" v-model="question2.input" clearable type="text">
                </el-input>
              </li>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题三：</span>
                <el-select v-model="question3.selected" placeholder="请选择安全问题三" clearable class="content placeholder" @change="changeValueQ3">
                  <el-option v-for="item in question3.options" :key="item._id" :label="item.content" :value="item._id">
                  </el-option>
                </el-select>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <el-input class="content" v-model="question3.input" clearable type="text">
                </el-input>
              </li>
            </ul>
            <div class="submit-line">
              <a class="submit" type="submit" @click="setSafeQ()">提交修改</a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!checkRules&&isSetSafeQFirst">
        <div class="issue">
          <div class="issue-one">
            <p class="issue-title-one">以下是您刚刚设置的安全口令问题，请确认问题答案。</p>
            <p class="issue-title-two">安全口令设置后不可更改，请谨慎确认</p>
          </div>
          <div class="issue-two mt-30 item">
            <ul>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题1：</span>
                <span class="content" style="width:250px">{{question1.content}}</span>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <span class="content warning" style="width:250px">
                  {{question1.input}}
                </span>
              </li>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题2：</span>
                <span class="content" style="width:250px">{{question2.content}}</span>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <span class="content warning" style="width:250px">
                  {{question2.input}}
                </span>
              </li>
              <li class="mb-10 time-row">
                <span class="last-exp" align="right">问题3：</span>
                <span class="content" style="width:250px">{{question3.content}}</span>
              </li>
              <li class="mb-20 time-row">
                <span class="last-exp" right="left">答案：</span>
                <span class="content warning" style="width:250px">
                  {{question3.input}}
                </span>
              </li>
            </ul>
            <div class="submit-line">
              <a class="submit" type="submit" @click="previous()">上一步</a>
              <a class="submit" type="submit" @click="makeSureSafeQ()">确认修改</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSetSafeQ" class="success-wrap" v-cloak>
      <p class="success">您已设置安全口令，安全口令不可修改！</p>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';

  export default {
    data() {
      return {
        loading: false,
        isSetSafeQ: false, //是否设置安全问题
        isSetSafeQFirst: false, //是否填写了安全问题和答案
        question1: {
          options: [],
          selected: '',
          content: '',
          input: ''
        },
        question2: {
          options: [],
          selected: '',
          content: '',
          input: ''
        },
        question3: {
          options: [],
          selected: '',
          content: '',
          input: ''
        },
        checkRules: false, //确认问题答案
      }
    },
    methods: {
      //是否设置安全问题
      getIsSetSafeQ() {
        let self = this;
        this.loading = true;
        request.http('get', '/user/bankcard/safe/question/isSet', {},
          (success) => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              // console.log(success);
              if (!success.data.isSet) {
                /*self.$alert('资金密码设置成功，您还未设置安全问题！这将导致您的账号存在风险！', '系统提醒', {
                  confirmButtonText: '确定',
                });*/
                self.isSetSafeQ = false;
                self.getSafeArrayList();
              } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                request.loginAgain(self)
              } else {
                self.isSetSafeQ = true;
              }
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
            self.$message({
              showClose: true,
              message: '系统出错，请联系管理员',
              type: 'error'
            });
          })
      },
      //获取安全问题列表1,2,3
      getSafeArrayList() {
        let self = this;
        let url = '/user/bankcard/safe/question/list';
        /* let promiseArray = [request.http('get', url, { num: 1 }, (success) => {
         }, (error) => {
         }), request.http('get', url, { num: 2 }, (success) => {
         }, (error) => {
         }), request.http('get', url, { num: 3 }, (success) => {
         }, (error) => {
         })];
         Promise.all(promiseArray).then((success) => {
           self.loading = false;
           console.log('success', success)
         }, (error) => {
           self.loading = false;
           console.log('error', error)
         });
         return true;*/
        request.http('get', url, { num: 1 },
          (success) => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              // console.log(success);
              if (success.data.questions) {
                this.question1.options = success.data.questions;
                request.http('get', url, { num: 2 },
                  (success) => {
                    self.loading = false;
                    if (success.returncode && success.returncode == 200) {
                      // console.log(success);
                      if (success.data.questions) {
                        this.question2.options = success.data.questions;
                        request.http('get', url, { num: 3 },
                          (success) => {
                            self.loading = false;
                            if (success.returncode && success.returncode == 200) {
                              // console.log(success);
                              if (success.data.questions) {
                                this.question3.options = success.data.questions;
                              }
                            }
                          },
                          (error) => {
                            self.loading = false;
                            console.log('数据异常', error)
                            self.$message({
                              showClose: true,
                              message: '系统出错，请联系管理员',
                              type: 'error'
                            });
                          })
                      }
                    }
                  },
                  (error) => {
                    self.loading = false;
                    console.log('数据异常', error)
                    self.$message({
                      showClose: true,
                      message: '系统出错，请联系管理员',
                      type: 'error'
                    });
                  })
              }
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
            self.$message({
              showClose: true,
              message: '系统出错，请联系管理员',
              type: 'error'
            });
          })
      },
      changeValueQ1(value) {
        // console.log(value);
        let obj = {};
        obj = this.question1.options.find((item) => {
          return item._id === value;
        });
        this.question1.content = obj.content;
      },
      changeValueQ2(value) {
        // console.log(value);
        let obj = {};
        obj = this.question2.options.find((item) => {
          return item._id === value;
        });
        this.question2.content = obj.content;
      },
      changeValueQ3(value) {
        // console.log(value);
        let obj = {};
        obj = this.question3.options.find((item) => {
          return item._id === value;
        });
        this.question3.content = obj.content;
      },
      //设置安全问题
      setSafeQ() {
        if (!this.question1.selected || !this.question2.selected || !this.question3.selected) {
          this.$message({
            showClose: true,
            message: '请选择问题',
            type: 'error'
          });
          return;
        }
        if (!this.question1.input || !this.question2.input || !this.question3.input) {
          this.$message({
            showClose: true,
            message: '安全口令答案不可为空，请重新设置！',
            type: 'error'
          });
          return;
        }
        this.isSetSafeQFirst = true;
      },
      //上一步
      previous() {
        this.isSetSafeQFirst = false;
        this.question1.selected = '';
        this.question1.input = '';
        this.question2.selected = '';
        this.question2.input = '';
        this.question3.selected = '';
        this.question3.input = '';
      },
      //确认修改
      makeSureSafeQ() {
        let self = this;
        this.loading = true;
        request.http('post', '/user/bankcard/safe/question/create', {
          /*questionid: self.question1.selected,
          content: self.question1.input*/
          questions: [
          {
            questionid: self.question1.selected,
            content: self.question1.input
          }, {
            questionid: self.question2.selected,
            content: self.question2.input
          }, {
            questionid: self.question3.selected,
            content: self.question3.input
          }]
        }, (success) => {
          self.loading = false;
          self.isSetSafeQ = true;
        }, (error) => {
          self.loading = false;
          console.log('数据异常', error)
          self.$message({
            showClose: true,
            message: '系统出错，请联系管理员',
            type: 'error'
          });
        })
      }
    },
    mounted() {
      this.getIsSetSafeQ();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style scoped lang="scss">
  .submit-line {
    width: 100%;
    margin-top: 60px;
  }

  .submit {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 auto;
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .psd-wrap {
    color: #333333;
    min-height: 731px;
  }

  .question-title {
    line-height: 50px;
    background: #f7f6f3;
    border-bottom: 1px solid #e7e4dd;
    color: #e07413;
    padding-left: 35px;
    font-size: 14px;
    text-align: left;
  }

  .issue-one {
    padding-top: 30px;
    line-height: 22px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 16px;
  }

  .issue-title-one {
    color: #777777;
  }

  .issue-title-two {
    color: #777777;
  }

  .warning {
    color: orange;
  }

  .issue-two {}

  .issue-two li {
    height: 40px;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .issue-two li .last-exp {
    font-size: 12px;
    color: #191919;
    display: inline-block;
    text-align: right;
    font-family: PingFangSC-Regular;
    width: 48px;
  }

  .issuce-two li .safe-input {
    display: inline-block;
  }

  li {
    list-style: none;
  }

  .success-wrap {
    width: 100%;
    text-align: center;
    height: 303px;
    line-height: 303px;
  }

  .success {
    text-align: center;
    height: 303px;
    line-height: 303px;
  }
</style>