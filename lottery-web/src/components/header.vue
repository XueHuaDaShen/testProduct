<template>
  <div class="position-re search-form">
    <div class="header clearfix">
      <div class="container">
        <div class="header-left">
          <ul>
            <li>
              <span class="pc-client" @click="openKf()">人工客服</span>
            </li>
            <li>
              <router-link target="_blank" :to="{name:'download'}">手机客户端</router-link>
            </li>
          </ul>
        </div>
        <ul class="header-right">
          <li @mouseleave="headerToggle(0)">
            <a @mouseover="headerToggle(1)" :class="{'active':this.headerActivited ===1}">
              <span>平台公告</span>
              <el-badge :value="announcement.num" :hidden="announcement.hidden" :max="announcement.max" class="badge">
              </el-badge>
            </a>
            <div class="announce-wrap" v-show="this.headerActivited === 1" v-loading="announcement.hidden">
              <ul>
                <li v-for="item in announcement.data" :key="item.title">
                  <i class="iconfont icon-Right"></i>
                  <router-link :to="{name:'noticeDetail',query:{'id':item._id}}">{{item.title}}</router-link>
                </li>
              </ul>
            </div>
          </li>
          <li @mouseleave="headerToggle(0)">
            <a @mouseover="headerToggle(2)" :class="{'active':this.headerActivited ===2}">
              管理中心
            </a>
            <div class="header-wrap" v-show="this.headerActivited === 2">
              <div class="item" v-for="data_ in tabs.data" v-cloak :key="data_.type">
                <div class="title">{{data_.title}}</div>
                <ul>
                  <li v-for="item in data_.desc" :key="item.component">
                    <router-link :to="{ name:item.component}">
                      {{item.value}}
                      <el-badge :value="announcement.num" :hidden="announcement.hidden" :max="announcement.max" v-if="item.component === 'notice'" class="badge">
                      </el-badge>
                      <span v-if="item.component === 'mail'">({{mail.num}})</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li @mouseleave="headerToggle(0)">
            <a class="user" @mouseover="hasProfile" :class="{'active':this.headerActivited ===3}">
              <img class="user-icon" src="../assets/img/icon_User@3x.png">
              <span> 账户余额：{{getBlance}}元</span>
            </a>
            <div class="user-wrap" v-show="this.headerActivited === 3" v-loading="profile.loading">
              你好，
              <span>{{profile.nickName}}</span>
              <br/>
              <p>
                <router-link :to="{name:'topUp'}" class="chongzhi">立即充值</router-link>
              </p>
              <p class="fund-btn">
                <router-link :to="{name:'withdraw'}" class="tikuan">提款</router-link>
              </p>
              <p class="row-logout">
                <a class="logout" @click="logout()">
                  <span class="ico-logout"></span> 退出游戏</a>
              </p>
              <p class="info" v-if="profile.lastTimeVisible">
                <span>上次登录</span>
                <span>{{profile.lastTime}}</span>
              </p>
            </div>
          </li>
          <li>
            <a @click="cashRefresh()" style="display: flex;align-items: center;justify-content:center;">
              <div class="icon-refresh" :class="cashLoading ? 'active' : ''"></div>
            </a>
          </li>
          <li @mouseleave="headerToggle(0)">
            <router-link @mouseover="headerToggle(4)" :class="{'active':this.headerActivited ===4}" :to="{name:'topUp'}">充值</router-link>
          </li>
          <li @mouseleave="headerToggle(0)">
            <router-link @mouseover="headerToggle(5)" :class="{'active':this.headerActivited ===5}" :to="{name:'withdraw'}">提现</router-link>
          </li>
          <!-- <li @mouseleave="headerToggle(0)">
            <router-link @mouseover="headerToggle(6)" :class="{'active':this.headerActivited ===4}" :to="{name:'transfer'}">转账</router-link>
          </li> -->
          <li @mouseleave="headerToggle(0)">
            <router-link @mouseover="headerToggle(7)" :class="{'active':this.headerActivited ===4}" :to="{name:'transform'}">额度转换</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="nav clearfix">
      <div class="container">
        <router-link class="nav-left" :to="{name:'home'}">
          <img src="../assets/img/Logo@3x.png">
        </router-link>
        <ul class="nav-right">
          <li @mouseleave="navToggle(0)">
            <router-link @mouseover="navToggle(0)" :to="{name:'home'}">首页
            </router-link>
          </li>
          <li @mouseleave="navToggle(0)">
            <a :class="{'active':this.navActivited ===1}" @mouseover="getLotteryList">彩票</a>
            <span class="icon-single"></span>
            <div class="nav-wrap lottery-content" :style="this.navActivited === 1 ? 'visibility:visible':'visibility:hidden'">
              <div class="lottery-list clearfix" v-loading="loading">
                <div :span="12" v-for="lottery in getLotteryData" class="lottery-item" :key="lottery.code">
                  <dl>
                    <span class="v-line"></span>
                    <span style="vertical-align: middle;display: inline-block;">{{lottery.name}}</span>
                  </dl>
                  <dt>
                    <router-link :to="{name:item.code,query:{id:item._id,p_code:lottery.code,s_code:item.code}}" v-for="item in lottery.children" :key="item._id">
                      {{item.name}}
                    </router-link>
                  </dt>
                </div>
              </div>
            </div>
          </li>
          <li @mouseleave="navToggle(0)">
            <a @mouseover="navToggle(2)" :class="{'active':this.navActivited ===2}">真人娱乐</a>
            <span class="icon-single"></span>
            <div class="nav-wrap live live1" :style="this.navActivited === 2 ? 'visibility:visible':'visibility:hidden'">
              <div style="text-align:left">
                <span class="v-line"></span>
                <span>AG娱乐</span>
              </div>
              <img alt="AG娱乐" class="logo0" src="../assets/img/Logo_0.png">
              <a class="item-link noallowed">即将上线</a>
            </div>
          </li>
          <li @mouseleave="navToggle(0)">
            <a @mouseover="navToggle(3)" :class="{'active':this.navActivited ===3}">电子游艺</a>
            <span class="icon-single"></span>
            <div class="nav-wrap live live2" :style="this.navActivited === 3 ? 'visibility:visible':'visibility:hidden'">
              <div style="text-align:left">
                <span class="v-line"></span>
                <span>AG电子</span>
              </div>
              <img alt="AG电子" class="logo0" src="../assets/img/Logo_0.png">
              <a class="item-link noallowed">即将上线</a>
            </div>
          </li>
          <li @mouseleave="navToggle(0)">
            <a @mouseover="navToggle(4)" :class="{'active':this.navActivited ===4}">体育竞技</a>
            <span class="icon-single"></span>
            <div class="nav-wrap live live2" :style="this.navActivited === 4 ? 'visibility:visible':'visibility:hidden'">
              <div style="text-align:left">
                <span class="v-line"></span>
                <span>沙巴体育</span>
              </div>
              <img alt="沙巴体育" class="logo1" src="../assets/img/Logo_1.png">
              <a class="item-link noallowed">即将上线</a>
            </div>
          </li>
          <li @mouseleave="navToggle(0)">
            <a @mouseover="navToggle(5)" :class="{'active':this.navActivited ===5}">棋牌竞技
            </a>
            <span class="icon-single"></span>
            <div class="nav-wrap live live2" :style="this.navActivited === 5 ? 'visibility:visible':'visibility:hidden'">
              <div style="text-align:left">
                <span class="v-line"></span>
                <span>开元棋牌</span>
              </div>
              <img alt="开元棋牌" class="logo2" src="../assets/img/Logo_2.png">
              <router-link class="item-link" :to="{name:'chessBoard'}" target='_blank'>立即参加</router-link>
            </div>
          </li>
          <li @mouseleave="navToggle(0)">
            <router-link @mouseover="navToggle(6)" :class="{'active':this.navActivited ===6}" :to="{name:'activityList'}">优惠活动</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import * as manage from '../assets/json/manage.json'
  import request from '../axios/axios'
  import moment from 'moment'

  export default {
    data() {
      return {
        blance: "0.00",
        navActivited: 0 /*当前选中的导航栏*/ ,
        headerActivited: 0 /*当前选中的header*/ ,
        tabs: {
          data: manage
        },
        loading: false,
        profile: {
          loading: false,
          lastTimeVisible: false,
          nickName: "",
          lastTime: ""
        },
        announcement: {
          hidden: false,
          num: 0,
          max: 10,
          data: []
        },
        mail: {
          hidden: false,
          num: 0,
          max: 10,
          data: []
        },
        //公告定时对象
        myInterval: null,
        //站内信定时对象
        myMailInterval: null,
        pageIndex: 1,
        pageSize: 10,
        blance: '',
        cashLoading: false,
      };
    },
    methods: {
      // 打开客服
      openKf() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      },
      // 定时获取公告列表
      getNewAnnouncement() {
        this.myInterval = setInterval(this.getNotices(), 60 * 60 * 1000);
      },
      // 定时获取站内信列表
      getNewMail() {
        this.myMailInterval = setInterval(this.getMails(), 60 * 60 * 1000);
      },
      cashRefresh() {
        this.cashLoading = true;
        let self = this;
        request.http(
          "get",
          "/user/profile", {},
          success => {
            self.cashLoading = false;
            if (success.returncode == 200) {
              this.blance = success.data.cash;
              this.$store.dispatch('setBlance', this.blance);
              localStorage.setItem('blance', this.blance);
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          error => {
            self.cashLoading = false;
            console.log("刷新余额失败", error);
          });
      },
      logout() {
        let vm = this;
        request.logout(vm);
      },
      // 导航栏切换
      navToggle(index) {
        this.navActivited = index;
      },
      // header切换
      headerToggle(index) {
        this.headerActivited = index;
      },
      //彩票列表
      getLotteryList() {
        this.navActivited = 1;
        let self = this;
        if (this.$store.state.lotteryArr.length == 0) {
          self.loading = true;
          request.http(
            "get",
            "/lottery/game/list", {},
            success => {
              self.loading = false;
              if (success.returncode == 200) {
                self.$store.dispatch("setLotteryArr", success.data);
              } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
                request.loginAgain(self)
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            },
            error => {
              self.loading = false;
              console.log("数据异常", error);
            }
          );
        }
      },
      hasProfile() {
        this.headerToggle(3);
        let nickName = localStorage.getItem("nickName");
        let lastLoginTime = localStorage.getItem("lastTime");
        if (nickName) {
          this.profile.loading = false;
          this.profile.nickName = nickName;
        } else {
          this.profile.loading = true;
          this.getProfile();
        }
        if (lastLoginTime) {
          this.profile.lastTimeVisible = true;
          this.profile.lastTime = lastLoginTime;
        } else {
          this.profile.lastTimeVisible = false;
        }
      },
      //获取用户信息
      getProfile() {
        let self = this;
        request.http(
          "get",
          "/user/profile", {},
          success => {
            self.profile.loading = false;
            if (success.returncode == 200) {
              let profile = success.data;
              if (profile.nickname) {
                localStorage.setItem("nickName", profile.nickname);
                self.profile.nickName = localStorage.getItem("nickName");
              } else {
                self.profile.nickName = localStorage.getItem("loginname");
              }
              if (profile.log) {
                this.profile.lastTimeVisible = true;
                let time = moment(profile.log).format("YYYY-MM-DD HH:mm:ss");
                localStorage.setItem("lastTime", time);
                self.profile.lastTime = localStorage.getItem("lastTime");
              } else {
                this.profile.lastTimeVisible = false;
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          error => {
            self.profile.loading = false;
            console.log("获取用户信息失败", error);
          }
        );
      },
      //获取公告列表
      getNotices() {
        let self = this;
        let url = "/notice/list";
        this.announcement.hidden = true;
        request.http(
          "get",
          url,
          {
            pagenum: self.pageIndex,
            pagesize: self.pageSize
          },
          success => {
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.announcement.num = success.data.daynotice;
                if (self.announcement.num) {
                  self.announcement.hidden = false;
                  self.announcement.data = success.data.data;
                } else {
                  self.announcement.hidden = true;
                }
              }
            }
          },
          error => {
            self.announcement.hidden = true;
            self.announcement.data = [];
            console.log("数据异常", error);
          }
        )
      },
      //获取站内信列表
      getMails() {
        let self = this;
        let url = "/user/message/list";
        this.mail.hidden = true;
        request.http(
          "get",
          url,
          {
            pagenum: self.pageIndex,
            pagesize: self.pageSize
          },
          success => {
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.mail.num = success.data.unread;
                if (self.mail.num) {
                  self.mail.hidden = false;
                  self.mail.data = success.data.data;
                } else {
                  self.mail.hidden = true;
                }
              }
            }
          },
          error => {
            self.mail.hidden = true;
            self.mail.data = [];
            console.log("数据异常", error);
          }
        );
      }
    },
    computed: {
      getLotteryData() {
        let lotteryArr = this.$store.state.lotteryArr;
        let otherObj = {};
        let otherArr = [];
        let newArr = [];
        for (let i = 0; i < lotteryArr.length; i++) {
          let arrItem = lotteryArr[i];
          if (arrItem.code === 'pks' || arrItem.code === 'lhc' || arrItem.code === 'qt') {
            otherArr = otherArr.concat(arrItem.children);
            // console.log('otherArr', otherArr);
            continue;
          }
          newArr = newArr.concat(arrItem);
        }
        otherObj['name'] = 'PK10 ／ 六合彩 ／ 其他';
        otherObj['children'] = otherArr;
        newArr = newArr.concat(otherObj);
        // console.log(newArr);
        return newArr;
      },
      getBlance() {
        let blance = this.$store.state.blance;
        return parseFloat(blance).toFixed(2) || 0;
      }
    },
    destroyed() {
      clearInterval(this.myInterval);
      clearInterval(this.myMailInterval);
    },
    mounted() {
      this.getNewAnnouncement();
      this.getNewMail();
      this.blance = Number(localStorage.getItem('blance'));
      this.$store.dispatch('setBlance', this.blance);
    }
  };
</script>
<style scoped lang="scss">
  li {
    list-style: none;
  }

  .icon-refresh {
    background: url('../assets/img/icon_Refresh@3x.png') no-repeat;
    background-size: cover;
    width: 18px;
    height: 16px;
    &.active {
      animation: rotating 1.2s linear infinite;
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0)
    }
    to {
      transform: rotate(360deg)
    }
  }

  .position-re {
    position: relative;
    width: 100%;
    height: 100px;
  }

  .announce-wrap {
    width: 300px;
    padding: 10px;
    margin-left: -150px;
    position: absolute;
    left: 50%;
    top: 36px;
    background: rgb(255, 255, 255);
    z-index: 10000;
    border-top: 1px solid #262732;
    line-height: 20px;
    font-size: 12px;
    text-align: left;
  }

  .announce-wrap ul {
    width: 100%;
  }

  .announce-wrap li {
    list-style: none;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }

  .announce-wrap li>a {
    color: #484848;
    font-size: 12px;
    cursor: pointer;
    margin-left: 5px;
    display: inline-block;
    width: 100%;
  }

  .announce-wrap li>a:hover {
    text-decoration: underline;
  }

  .announce-wrap li>i {
    color: #484848;
    font-size: 12px;
    cursor: pointer;
    display: inline-block;
  }

  .nav-left>img {
    height: 39px;
  }

  .header {
    width: 100%;
    background: #64646C;
    z-index: 1003;
    position: fixed;
    top: 0;
  }

  .nav {
    width: 100%;
    background: #191919;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 36px;
    z-index: 1002;
  }

  .container {
    width: 1024px;
    margin: 0 auto;
    color: #ffffff;
    font-size: 12px;
  }

  .header .container {
    height: 36px;
  }

  .nav .container {
    height: 64px;
    background: #191919;
  }

  .container .header-left {
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
  }

  .container .header-left>ul>li {
    display: inline-block;
    padding: 0 20px;
    line-height: 36px;
    border-right: 1px solid rgba(204, 204, 204, 0.12);
  }

  .container .header-left>ul>li:first-child {
    padding-left: 1px;
  }

  .container .header-left>ul>li:last-child {
    border-right: none;
  }

  .container .header-left>ul>li:after {
    opacity: 0.12;
    color: #FFFFFF;
    width: 1px;
    height: 36px;
    content: "";
  }

  .header-left a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
  }

  .header span {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    line-height: 36px;
  }

  .moble-client {
    /* margin-left: 35px; */
    font-weight: bold;
  }

  .header-right {
    float: right;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
  }

  ul.header-right>li {
    height: 100%;
    position: relative;
    list-style: none;
    border-right: 1px solid rgba(204, 204, 204, 0.12);
  }

  ul.header-right>li:last-child {
    border-right: none;
  }

  ul.header-right>li>a {
    cursor: pointer;
    line-height: 36px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    display: block;
    padding: 0 20px;
    color: #fff;
    text-decoration: none;
    position: relative;
    font-weight: bold;
  }

  ul.header-right>li>a>.badge {
    position: absolute;
    right: 0;
    top: 0;
  }

  ul.header-right>li>a:hover {
    background: #272727;
  }

  ul.header-right>li>a.active {
    background: #272727;
  }

  /* .header-right a.user {} */

  .user-icon {
    width: 13px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 7px;
    line-height: 36px;
  }

  .header-wrap {
    position: absolute;
    top: 36px;
    background: rgb(255, 255, 255);
    z-index: 10000;
    left: 50%;
    padding: 10px;
    border-top: 1px solid #262732;
    display: flex;
    margin-left: -230px;
  }

  .header-wrap .item {
    float: left;
    text-align: center;
    width: 110px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    min-height: 300px;
  }

  .header-wrap .item:last-child {
    border: none;
  }

  .header-wrap .item .logo0 {
    background: url("../assets//img/Logo_0.png") no-repeat;
    background-size: cover;
  }

  .header-wrap .item .logo1 {
    background: url("../assets//img/Logo_1.png") no-repeat;
    background-size: cover;
  }

  .header-wrap .item .logo2 {
    background: url("../assets//img/Logo_2.png") no-repeat;
    background-size: cover;
  }

  .header-wrap .item .logo-6 {
    background: url("../assets//img/Logo_6.png") no-repeat;
    background-size: cover;
  }

  .header-wrap .item .title {
    font-size: 14px;
    color: #000;
    height: 36px;
    line-height: 36px;
  }

  .header-wrap .item li {
    list-style: none;
    text-align: center;
    float: none;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
  }

  .pc-client {
    font-weight: bold;
  }

  .header-wrap .item li a:hover {
    background: #272727;
    color: #fff;
  }

  .header .item li a {
    border: none;
    color: #232323;
    margin: 0 5px;
    display: block;
    text-decoration: none;
    position: relative;
  }

  .header .item li a>.badge {
    position: absolute;
    right: 4px;
    top: 0px;
  }

  .nav-left {
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .nav-right {
    float: right;
    height: 100%;
    font-size: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    /* color: #E1C79B; */
    letter-spacing: 1px;
    flex-direction: row;
    background: #191919;
  }

  ul.nav-right>li {
    height: 100%;
    position: relative;
    list-style: none;
    padding: 0 20px;
    &:hover {
      .nav-wrap {
        transform: translateY(0) translateZ(0);
      }
    }
  }

  ul.nav-right>li:last-child {
    padding-left: 20px;
    padding-right: 0;
  }

  ul.nav-right>li .icon-single {
    display: none;
  }

  ul.nav-right>li:hover .icon-single {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    border-width: 6px;
    border-color: transparent transparent #BD8454 transparent;
    border-style: dashed dashed solid dashed;
    bottom: 22px;
    position: relative;
  }

  ul.nav-right>li>a {
    cursor: pointer;
    line-height: 64px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 4px solid transparent;
    height: 100%;
    display: block;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
  }

  ul.nav-right>li>a:hover {
    color: #BD8454;
  }

  ul.nav-right>li>a.active {
    color: #BD8454;
  }

  .nav-wrap {
    position: absolute;
    top: 64px;
    left: 50%;
    background: #fff;
    transform: translateY(-100%) translateZ(0);
    transition: all .3s ease-in-out;
    z-index: -200;
  }

  .nav-wrap.lottery-content {
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    width: 1024px;
    margin-left: -512px;
    min-height: 310px;
    background: #F4F4F4;
    /* border-radius: 4px; */
    padding: 20px 18px;
    position: fixed;
    top: 100px;
  }

  .nav-wrap.lottery {
    width: 762px;
    margin-left: -381px;
    min-height: 500px;
    background: #F4F4F4;
    padding: 20px 18px;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 18px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
  }

  .lottery-list {
    display: flex;
    background: #F4F4F4;
  }

  .lottery-list dl {
    letter-spacing: 0.88px;
    display: inline-block;
    text-align: left;
    margin-bottom: 20px;
    font-size: 16px;
    color: #000000;
    width: 100%;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 18px;
    color: #BD8454;
  }

  .lottery-list .lottery-item {
    float: left;
    text-align: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: -1px;
    margin-right: -1px;
    border-bottom: none;
    border-right: 1px solid #ddd;
  }

  .lottery-list .lottery-item:first-child {}

  .lottery-list .lottery-item:last-child {
    border-right: none;
  }

  .lottery-list .lottery-item:before {
    opacity: 0.12;
    color: #FFFFFF;
    width: 1px;
    height: 100%;
    content: "";
  }

  .lottery-list dt {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 245px;
  }

  .lottery-list dt a {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.75px;
    width: 100px;
    height: 30px;
    line-height: 28px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    background: #FFFFFF;
    text-decoration: none;
    background: #ECECEC;
    border: 1px solid #D0D0D0;
    border-radius: 2px;
  }

  .lottery-list dt a:hover {
    background: #C83A4C;
    color: #fff;
  }

  .lottery dl {
    display: table;
    width: 100%;
    background: rgba(225, 199, 155, 0.08);
    border: 1px solid #cdcdcd;
    min-height: 85px;
    padding: 0 10px 5px 0;
    border-top: 1px solid transparent;
    color: #333;
  }

  .lottery dt {
    width: 85px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  .lottery dd {
    display: table-cell;
    vertical-align: middle;
  }

  .lottery dd a {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.75px;
    width: 90px;
    height: 30px;
    line-height: 28px;
    float: left;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #cdcdcd;
    margin-top: 5px;
    margin-right: 5px;
    text-decoration: none;
    transition: all 0.3s;
  }

  .lottery dd a:hover {
    background: #333;
    color: #fff;
  }

  .live {
    width: 248px;
    padding: 20px;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
  }

  .live1 {
    margin-left: -124px;
  }

  .live2 {
    margin-left: -124px;
  }

  .live img {
    display: block;
    height: 76px;
    margin: 20px auto;
  }

  .live span {
    text-align: left;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    letter-spacing: 1.25px;
    display: line-block;
    font-size: 18px;
    color: #BD8454;
    vertical-align: middle;
  }

  .live .item-link {
    display: block;
    margin: 0 auto;
    background: #e1c79b;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.88px;
    width: 208px;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 700;
  }

  .live .item-link.noallowed {
    background-color: #ddd;
    color: #777;
  }

  .user-wrap {
    position: absolute;
    top: 36px;
    background: rgb(255, 255, 255);
    z-index: 10000;
    left: 50%;
    border-top: 1px solid #262732;
    width: 174px;
    padding: 10px 20px;
    margin-left: -87px;
    line-height: 24px;
    font-size: 12px;
    color: #000;
    text-align: left;
    min-height: 156px;
  }

  .user-wrap .chongzhi {
    display: block;
    background: #fb5b23;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 6px 0;
    margin-top: 5px;
    cursor: pointer;
    text-decoration: none;
  }

  .user-wrap .chongzhi:hover {
    background: #ff7516;
  }

  .user-wrap .tikuan {
    display: inline-block;
    padding: 5px 23px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    font-size: 14px;
    margin-right: 4px;
    cursor: pointer;
    text-decoration: none;
    color: #333;
  }

  .user-wrap .tikuan:hover {
    background: #262732;
    color: #fff;
  }

  .user-wrap .fund-btn {
    padding: 10px 0;
  }

  .user-wrap .row-logout {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-left: 0;
    border-right: 0;
    text-align: center;
    padding: 5px 0;
  }

  .user-wrap .row-logout>a.logout {
    color: #000;
    cursor: pointer;
  }

  .user-wrap .info {
    text-align: center;
    padding: 10px 0 0 0;
    color: rgba(39, 33, 56, 0.56);
  }

  .user-wrap .info>span {
    display: block;
    line-height: 20px;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>