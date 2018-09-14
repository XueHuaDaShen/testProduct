<template>
  <div class="content">
    <div class="mail-wrap">
      <user-menu></user-menu>
      <div class="main">
        <div class="top-bar">
          <span>当前位置：</span>
          <span>消息中心</span>
          <i class="iconfont icon-Right"></i>
          <span>站内信</span>
        </div>
        <div class="project-content">
          <ul class="tabs">
            <li class="tab-title">
              <router-link :to="{ name:'mail'}">平台公告</router-link>
            </li>
            <li class="tab-title active">
              <router-link :to="{ name:'mail'}">站内信</router-link>
            </li>
          </ul>
          <div class="wrap-inner" v-if="!noResult" v-cloak>
            <div class="title">
              <h1>{{msg[0].topic}}</h1>
              <p>{{formatTime(msg[0].create_at)}}</p>
            </div>
            <hr class="user-split-line">
            <div class="mail-content">
              <div v-html="msg[0].content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from '../axios/axios';
  import moment from 'moment';

  export default {
    name: "mail",
    components: {
      UserMenu
    },
    data() {
      return {
        loading: false,
        msg: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 10, //单页条数
      }
    },
    methods: {
      formatTime(value) {
        if (value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      //获取公告列表
      getmailDetail(id) {
        let self = this;
        let url = '/user/message/list';
        this.loading = true;
        request.http('get', url, {
            id: id,
            page_num: self.pageIndex,
            page_size: self.pageSize
          },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.total = success.data.total;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.data.total_page_num;
                  self.msg = success.data.data;
                } else {
                  self.noResult = true;
                  self.noMessage();
                }
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
            self.noResult = true;
            self.msg = [];
            self.noMessage();
          })
      },
      noMessage() {
        let self = this;
        self.$alert('<div class="lottery-title">该公告不存在，请联系管理员</div>', '温馨提示', {
          confirmButtonText: '关闭',
          center: true,
          dangerouslyUseHTMLString: true,
          customClass: "syxw-wrap-inner",
          callback: action => {
            setTimeout(function() {
              self.$router.push({ name: 'mail' });
            }, 1000)
          }
        })
      },
      // status:  { type: String ,default:1 },                
      // 状态： 1未读  2 已读   3已删除
      updateMsg(id, status) {
        let self = this;
        let url = '/user/message/update';
        this.loading = true;
        request.http('post', url, {
            id: id,
            status: status
          },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {

              }
              else {
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
          })
      },
    },
    mounted() {
      let self = this;
      // console.log("id", this.$route.query);
      let id = this.$route.query && this.$route.query.id;
      if (id) {
        this.getmailDetail(id);
        this.updateMsg(id, '2');
      } else {
        self.noMessage();
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    },
    watch: {
      $route(to, from) {
        // react to route changes...
        // console.log("to", to);
        // console.log("from", from);
        let query = to.query;
        if (query.id) {
          this.getmailDetail(query.id);
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .project-content {
    padding: 30px 20px;
  }

  .wrap-inner {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;
  }

  .tabs {
    height: 40px;
    line-height: 40px;
    display: flex;
  }

  .tabs .tab-title {
    width: 100px;
    background: #d8d8d8;
    color: #191919;
    margin-right: 20px;
    border-radius: 2px 2px 0 0;
    text-align: center;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    cursor: pointer;
    position: relative;
  }

  .tabs .tab-title>a {
    font-size: 14px;
    color: #191919;
    outline: none;
    text-decoration: none;
  }

  .tabs .tab-title:hover>a {
    color: #847b5f;
  }

  .tabs .tab-title.active>a {
    color: #bd8454;
  }

  .tabs .tab-title.active {
    color: #bd8454;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
  }

  .tabs .tab-title a {
    display: block;
  }

  .title {
    font-family: PingFangSC-Regular;
    color: #777777;
  }

  .title>h1 {
    font-size: 24px;
    font-weight: 700;
  }

  .title>p {
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .no-result p {
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
  }

  table,
  td {
    border-collapse: collapse;
  }

  .mail-wrap {
    font-family: MicrosoftYaHei;
    color: #191919;
    margin: 0 auto;
    width: 1090px;
    position: relative;
  }

  .mail-content {
    margin-top: 24px;
    text-align: left;
    font-size: 14px;
    color: #777;
    width: 100%;

    .content-photo {
      text-align: center;
      margin-bottom: 20px;
      width: 100%;

      >img {
        width: auto;
        height: auto;
        display: inline-block;
        max-width: 100%;
      }
    }
  }

  .main {
    width: 1024px;
    min-height: 600px;
    background: #fff;
    margin: 0 auto;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    /* border-bottom: 1px solid #DADADA; */
    /* padding-left: 20px; */
    padding: 30px 20px 0;
    text-align: left;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .row {
    height: 52px;
    line-height: 52px;
    font-size: 14px;
    width: 100%;
    padding: 0 2px;
    cursor: pointer;
  }

  .row:nth-child(2n+1) {
    background: #FFF7EF;
  }

  .pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>