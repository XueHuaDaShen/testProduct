<template>
  <div class="psd-wrap search-form record-options" v-loading="loading">
    <div class="issue">
      <div class="issue-one">
        <p class="issue-title-two">为了您的资金安全，请验证您的口令</p>
      </div>
      <div class="issue-two item">
        <ul>
          <li style="margin:20px 0;text-align:left;">
            <span class="safe-title" align="left" style="text-indent:35px;">问题：</span>
            <span class="issue-input">{{validateSafeQ.random.question}}</span>
          </li>
          <li class="li-error" style="text-align:left;">
            <span class="safe-title" right="left" style="text-indent:35px;">答案：</span>
            <el-input placeholder="请输入答案" v-model="validateSafeQ.random.input" clearable class="content" style="margin-bottom:0">
            </el-input>
          </li>
          <li>
            <span class="error">连续输错超过
              <span class="r-b">6</span>次系统将强制登出并冻结帐号</span>
          </li>
          <li style="margin-top: 60px">
            <a class="submit" type="submit" @click="makeSure()">确定</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';

  export default {
    data() {
      return {
        loading: false,
        //验证安全问题
        validateSafeQ: {
          questions: [],
          //随机其中一个问题
          random: {
            question: '',
            questionid: '',
            input: ''
          }
        },
      }
    },
    methods: {
      getUserSafeQ() {
        let self = this,
          url = '/user/bankcard/safe/question/get';
        this.loading = true;
        request.http('get', url, {},
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                if (success.data != null) {
                  self.validateSafeQ.questions = success.data.questions;
                  let length = self.validateSafeQ.questions.length;
                  let arrIndex = self.getRandom(0, length - 1);
                  self.validateSafeQ.random.question = self.validateSafeQ.questions[arrIndex].questionid.content;
                  self.validateSafeQ.random.questionid = self.validateSafeQ.questions[arrIndex].questionid._id;
                } else {
                  self.$router.go(-1);
                }
              }
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
          })
      },
      getRandom(begin, end) {
        let num = Math.round(Math.random() * (end - begin) + begin);
        return num;
      },
      makeSure() {
        if (!this.validateSafeQ.random.input) {
          this.$alert('<div class="lottery-title">答案不能为空</div>', '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner"
          })
          return false;
        }
        let self = this,
          url = '/user/bankcard/safe/question/certify';
        this.loading = true;
        request.http('post', url, {
            questions: [
            {
              questionid: self.validateSafeQ.random.questionid,
              content: self.validateSafeQ.random.input
            }]
          },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                let query = self.$route.query;
                if (query != null) {
                  //跳转至修改银行卡组件
                  //判断是否是新增更多银行卡
                  // addMore：true  表示更多
                  // addMore:false或者无该字段  表示第一次添加银行卡
                  this.addMore = this.$route.query.addMore;
                  if (!this.addMore) {
                    self.$router.push({ name: 'modifyBank', query: { bankid: query.id, banktext: query.banktext } });
                  } else {
                    self.$router.push({ name: 'modifyBank', query: { addMore: true } });
                  }
                }
              } else if (success.returncode == 303) {
                self.$alert('<div class="lottery-title">答案不正确</div>', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner"
                })
              } else if (success.returncode == 301) {
                self.$alert('<div class="lottery-title">错误码301</div>', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner"
                })
              } else if (success.returncode == 302) {
                self.$alert('<div class="lottery-title">错误码302</div>', '系统提醒', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner"
                })
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
          }
        )
      }
    },
    mounted() {
      this.getUserSafeQ();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  }
</script>
<style scoped>
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
    margin-left: 364px;
    line-height: 22px;
    text-align: left;
  }

  .issue-title-one {
    color: #5a5a5a;
  }

  .issue-title-two {
    color: #777;
    font-weight: bold;
    font-size: 16px;
  }

  .warning {
    color: orange;
  }

  .issue-two {
    /* width: 395px; */
    /* margin: 40px auto; */
    display: -webkit-box;
    -webkit-box-pack: center;
  }

  .issue-two li {
    /* height: 40px; */
    font-size: 12px;
    color: #191919;
    /* text-align: left; */
  }

  .issue-two li .safe-title {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    color: #191919;
    /* width: 75px; */
    /* text-align: right; */
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

  .submit {
    width: 140px;
    height: 48px;
    line-height: 46px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    border: 1px solid #DDDDDD;
    border-radius: 2px;
  }

  .error {
    display: inline-block;
    color: #777;
    margin-top: 10px;
    text-indent: 75px;
    /* color: orangered; */
  }

  .r-b {
    font-weight: bold;
    /* font-size: 24px; */
    margin: 0 5px;
  }
</style>