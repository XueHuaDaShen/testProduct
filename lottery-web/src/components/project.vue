<template>
  <div class="wrap clearfix">
    <user-menu></user-menu>
    <div class="main">
      <div class="top-bar clearfix" v-cloak>
        <div class="left">
          <span class="menu-logo">当前位置：</span>
          <span class="menu-content">{{tabs.moduleText}}</span>
          <span class="menu-sign">&gt;</span>
          <span class="menu-content">{{tabs.activatedText}}</span>
        </div>
      </div>
      <div class="project-content content">
        <ul class="tabs">
          <li class="tab-title" v-for="item in tabs.currentTabs" :class="{'active':item.component===tabs.activehref}" :key="item.component">
            <router-link v-text="item.value" @click="tabsTextToggle()" :to="{ name:item.component}"></router-link>
          </li>
        </ul>
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import password from './password';
  import bank from './bank';
  import reward from './reward';
  import lotteryRecord from './lotteryRecord';
  import liveRecord from './liveRecord';
  import recreationRecord from './recreationRecord';
  import sportsRecord from './sportsRecord';
  import chessRecord from './chessRecord';
  import * as manage from '../assets/json/manage.json';
  import userMenu from './userMenu';
  import myHeader from './header';
  import myFooter from './footer';

  export default {
    components: {
      password,
      bank,
      reward,
      lotteryRecord,
      liveRecord,
      recreationRecord,
      sportsRecord,
      chessRecord,
      userMenu,
      myHeader,
      myFooter
    },
    data() {
      return {
        menuActivated: 0,
        /*当前选中的menu*/
        tabs:
        {
          moduleText: '', //模块描述
          activatedText: '', //模块小类text
          activehref: "",
          //用户管理中心模块数组
          data: manage,
          //当前小类数组
          currentTabs: []
        }
      }
    },
    methods: {
      menuToggle(index) {
        this.menuActivated = index;
      },
      tabsTextToggle() {
        //加載activateTabs
        for (let i = 0; i < this.tabs.data.length; i++) {
          let item = this.tabs.data[i];
          let parentTitle = item.title;
          for (let j = 0; j < item.desc.length; j++) {
            let item_ = item.desc[j];
            let hrefArr = window.location.hash.split('/');
            // console.log("href", hrefArr);
            for (let i = 0; i < hrefArr.length; i++) {
              let part = hrefArr[i];
              if (part.indexOf("?") != -1) {
                part = part.split("?")[0];
              }
              if (item_.component === part) {
                this.tabs.activehref = part;
                this.tabs.activatedText = item_.value;
                this.tabs.moduleText = parentTitle;
                this.tabs.currentTabs = item.desc;
              }
            }
          }
        }
      }
    },
    mounted() {
      this.tabsTextToggle();
    },
    beforeUpdate() {
      this.tabsTextToggle();
    }
  }
</script>
<style>
  .project-content input {
    border-radius: 2px !important;
    border: 1px solid #ccc !important;
  }
</style>
<style scoped>
  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .wrap {
    margin: 0 auto;
    width: 1090px;
    position: relative;
  }

  .main {
    width: 1024px;
    /* float: left; */
    /* margin-left: 2px; */
    margin: 0 auto;
    min-height: 600px;
    background: #fff;
  }

  .top-bar {
    /* height: 42px;
    line-height: 42px; */
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    /* border-bottom: 1px solid #DADADA; */
    /* padding-left: 20px; */
    padding: 30px 20px 0;
  }

  .top-bar .menu-content {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
  }

  .content {
    padding: 0;
    padding: 20px;
  }

  .content>div {
    min-height: 600px;
    border: 1px solid #ddd;
  }

  .tabs {
    height: 40px;
    line-height: 40px;
    display: flex;
  }

  .tabs .tab-title {
    width: 100px;
    background: #D8D8D8;
    color: #191919;
    margin-right: 20px;
    border-radius: 2px 2px 0 0;
    text-align: center;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    cursor: pointer;
    position: relative;
    border: 1px solid #ddd;
  }

  .tabs .tab-title>a {
    font-size: 14px;
    color: #191919;
    outline: none;
  }

  .tabs .tab-title:hover>a {
    color: #847B5F;
  }

  .tabs .tab-title.active>a {
    color: #BD8454;
  }

  .tabs .tab-title.active {
    color: #BD8454;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
  }

  .tabs .tab-title a {
    display: block;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>