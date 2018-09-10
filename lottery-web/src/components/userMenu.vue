<template>
  <div class="left-menu">
    <!-- <div class="top-left-logo">
      <span></span>
    </div> -->
    <dl>
      <!--缩减代码START-->
      <dt @mouseleave="menuToggle(0)" v-for="(data_,index) in tabs.data" :key="data_.iconClass">
        <a @mouseover="menuToggle(index+1)" :class="{'active':menuActivated ===(index+1)}">
          <span :class="data_.iconClass"></span>
          <em>{{data_.title}}</em>
        </a>
        <div class="second-menu" v-show="menuActivated === (index+1)">
          <div style="background:#fff;border-radius:2px;box-shadow:rgba(0, 0, 0, 0.1) 0 2px 50px 0px;">
            <!-- <div class="title">{{data_.title}}</div> -->
            <ul>
              <li v-for="item in data_.desc" :key="item.key">
                <router-link :to="{ name:item.component}">
                  {{item.value}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </dt>
      <!--缩减代码END-->
    </dl>
  </div>
</template>

<script>
  import * as manage from "../assets/json/manage.json";
  import "../assets/img/manage/icon_1.png";
  import "../assets/img/manage/icon_2.png";
  import "../assets/img/manage/icon_3.png";
  import "../assets/img/manage/icon_4.png";
  import "../assets/img/manage/icon_5.png";
  import "../assets/img/manage/icon_1_active.png";
  import "../assets/img/manage/icon_2_active.png";
  import "../assets/img/manage/icon_3_active.png";
  import "../assets/img/manage/icon_4_active.png";
  import "../assets/img/manage/icon_5_active.png";
  import "../assets/img/manage/setting.png";

  export default {
    name: "user-menu",
    data() {
      return {
        menuActivated: 0 /*当前选中的menu*/ ,
        tabs: {
          //用户管理中心模块数组
          data: manage
        }
      };
    },
    methods: {
      menuToggle(index) {
        this.menuActivated = index;
      }
    }
  };
</script>

<style scoped>
  .left-menu dt>a .icon_1 {
    background: url("../assets/img/manage/icon_1.png");
    background-size: cover;
  }

  .left-menu dt>a:hover .icon_1 {
    background: url("../assets/img/manage/icon_1_active.png");
    background-size: cover;
  }

  .left-menu dt>a.active .icon_1 {
    background: url("../assets/img/manage/icon_1_active.png");
    background-size: cover;
  }

  .left-menu dt>a .icon_2 {
    background: url("../assets/img/manage/icon_2.png");
    background-size: cover;
  }

  .left-menu dt>a:hover .icon_2 {
    background: url("../assets/img/manage/icon_2_active.png");
    background-size: cover;
  }

  .left-menu dt>a.active .icon_2 {
    background: url("../assets/img/manage/icon_2_active.png");
    background-size: cover;
  }

  .left-menu dt>a .icon_3 {
    background: url("../assets/img/manage/icon_3.png");
    background-size: cover;
  }

  .left-menu dt>a:hover .icon_3 {
    background: url("../assets/img/manage/icon_3_active.png");
    background-size: cover;
  }

  .left-menu dt>a.active .icon_3 {
    background: url("../assets/img/manage/icon_3_active.png");
    background-size: cover;
  }

  .left-menu dt>a .icon_4 {
    background: url("../assets/img/manage/icon_4.png");
    background-size: cover;
  }

  .left-menu dt>a:hover .icon_4 {
    background: url("../assets/img/manage/icon_4_active.png");
    background-size: cover;
  }

  .left-menu dt>a.active .icon_4 {
    background: url("../assets/img/manage/icon_4_active.png");
    background-size: cover;
  }

  .left-menu dt>a .icon_5 {
    background: url("../assets/img/manage/icon_5.png");
    background-size: cover;
  }

  .left-menu dt>a:hover .icon_5 {
    background: url("../assets/img/manage/icon_5_active.png");
    background-size: cover;
  }

  .left-menu dt>a.active .icon_5 {
    background: url("../assets/img/manage/icon_5_active.png");
    background-size: cover;
  }

  .left-menu dt>a .icon_3 {
    background: url ("../assets/img/manage/icon_3.png");
    background-size: cover;
  }

  .left-menu dt>a {
    width: 100%;
    display: block;
    height: 74px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    /* line-height: 74px; */
    cursor: pointer;
  }

  .left-menu dt>a em {
    display: block;
    color: #777;
    font-style: normal;
    font-size: 12px;
    margin-top: 5px;
    font-weight: bold;
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  .left-menu {
    width: 74px;
    background: #fbfbfb;
    position: absolute;
    left: -62px;
    /* border-radius: 4px; */
  }

  .left-menu .top-left-logo {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #CC3447;
  }

  .left-menu .top-left-logo>span {
    display: inline-block;
    width: 23px;
    height: 23px;
    vertical-align: middle;
    color: #fff;
    font-size: 20px;
    background: url("../assets/img/manage/setting.png");
    background-size: cover;
  }

  .left-menu dl {
    margin: 20px 0;
  }

  .left-menu dt {
    width: 100%;
    height: 74px;
    position: relative;
    margin-bottom: 10px;
  }

  .left-menu dt:last-child {
    margin-bottom: 0;
  }

  .left-menu dt:hover {
    background: #BD8454;
  }

  .left-menu dt:hover a>em {
    color: #fff;
  }

  .left-menu dt .second-menu {
    position: absolute;
    left: 74px;
    background: none;
    z-index: 10000;
    top: 0;
    width: 160px;
    padding-left: 21px;
    /* margin-left: 2px; */
  }

  .left-menu dt .second-menu ul {
    background: #fff;
    padding: 20px 0;
  }

  .left-menu dt .second-menu .title {
    font-size: 16px;
    color: #fff;
    height: 36px;
    line-height: 36px;
    text-align: left;
    padding-left: 10px;
  }

  .left-menu dt .second-menu li {
    text-align: left;
    float: none;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    padding: 0 10px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .left-menu dt .second-menu li:last-child {
    margin-bottom: 0;
  }

  .left-menu dt .second-menu li:hover {
    /* background: #fff; */
    background: #BD8454;
  }

  .left-menu dt .second-menu li:hover a {
    color: #fff;
  }

  .left-menu dt .second-menu li a {
    border: none;
    color: #777;
    margin: 0 5px;
    display: block;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
  }

  .left-menu dt a span {
    display: inline-block;
    vertical-align: middle;
    /* width: 36px;
    height: 36px; */
  }

  .left-menu dt a span.icon_1 {
    width: 24px;
    height: 28px;
  }

  .left-menu dt a span.icon_2 {
    width: 26px;
    height: 30.2px;
  }

  .left-menu dt a span.icon_3 {
    width: 30px;
    height: 30px;
  }

  .left-menu dt a span.icon_4 {
    width: 27px;
    height: 30px;
  }

  .left-menu dt a span.icon_5 {
    width: 28px;
    height: 22px;
  }
</style>