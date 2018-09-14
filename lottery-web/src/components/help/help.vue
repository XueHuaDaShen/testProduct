<template>
  <div class="hello">
    <header class="header">
      <div>
        <router-link class="nav-left" :to="{name: 'home'}">
          <img src="@/assets/img/Logo@3x.png">
        </router-link>
        <router-link :to="{name:'download'}" class="download"><img src="../../img/xiazai-icon.png" class="xiazai-icon">下载中心</router-link>
        <a @click="open" class="server"><img src="../../img/kefu-icon.png" class="kefu-icon">联系客服</a>
      </div>
    </header>
    <div class="help-content">
      <div class="g_33">
        <div class="help-sider">
          <div class="help-sider-inner">
            <ul class="ul-first">
              <li class="top">
                <div class="text-center">
                  <span class="cn">帮助中心</span>
                  <span class="en">Help Center</span>
                </div>
              </li>
              <li v-for="(item,index) in data" :key="index" :class="{'open':activeIndex===index && item.isShow}">
                <a @click="switchSecond(item,index)" class="a-one">{{item.s_t}}
                  <span :class="activeIndex===index && item.isShow ? 'down':'up'" class="normal"></span>
                </a>
                <ul class="ul-second" v-show="activeIndex===index && item.isShow">
                  <li v-for="(item_,index_) in item.s_t2" :key="index_" :class="{'active':item_.path === s_p }">
                    <router-link :to="{name:item.s_id,query:{'s_p':item_.path}}" class="a-two">{{item_.name}}</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="help-main">
          <div class="help-main-inner">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from '../footer';
  import help from '../../assets/json/help.json';
  import hdefault from './hdefault';
  import cpwf from './cpwf';
  export default {
    name: 'h_index',
    components: {
      myFooter,
      hdefault,
      cpwf
    },
    data() {
      return {
        data: help,
        s_p: '', // id位置
        s_id: '', // 组件name
        activeIndex: -1,
      }
    },
    methods: {
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      },
      // 开启关闭 下级菜单
      switchSecond(item, index) {
        this.activeIndex = index;
        let visible = !item.isShow;
        for (let i = 0; i < this.data.length; i++) {
          if (index === i) {
            this.data[i].isShow = visible;
          }
        }
      },
      sliderToggle() {
        let hrefArr = window.location.hash.split('/');
        let arr = hrefArr[hrefArr.length - 1];
        if (arr.indexOf("?") != -1) {
          this.s_id = arr.split("?")[0];
          let ar2 = arr.split('?')[1];
          this.s_p = ar2.split('=')[1];
          console.log('sliderToggle')
          console.log('this.s_p', this.s_p)
          let id = '#' + this.s_p;
          // document.querySelector(id).scrollIntoView(true);
        }
      }
    },
    watch: {
      $route(to, from) {
        let hrefArr = window.location.hash.split('/');
        let arr = hrefArr[hrefArr.length - 1];
        if (arr.indexOf("?") != -1) {
          this.s_id = arr.split("?")[0];
          let ar2 = arr.split('?')[1];
          this.s_p = ar2.split('=')[1];
          console.log('route')
          console.log('this.s_p', this.s_p)
        }
      }
    },
    mounted() {
      this.sliderToggle();
    }
  }
</script>

<style scoped lang='scss'>
  .header {
    width: 100%;
    height: 80px;
    background: #1B1B1B;
  }

  .header>div {
    width: 1024px;
    height: 100%;
    margin: 0 auto;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
  }

  .header>div a {
    font-size: 16px;
    color: #fff;
    letter-spacing: 1px;
    text-decoration: none;
    position: relative;
    .xiazai-icon{
      width:16px;
      height:18px;
      position: absolute;
      left:-21px;
      top:0;
    }
    .kefu-icon{
      width:20px;
      height:21px;
      position: absolute;
      left:-25px;
      top:-2px;
    }
  }

  .nav-left {
    width: 173.9px;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .nav-left>img {
    width: 100%;
  }

  .server {
    margin-left: 65px;
  }

  .g_33 {
    margin-left: auto;
    margin-right: auto;
    clear: both;
    width: 1240px;
    &:after {
      content: " ";
      display: block;
      height: 0;
      visibility: hidden;
      clear: both;
    }
  }

  .help-sider {
    width: 200px;
    float: left;
    background: #2C2D2F;
    box-shadow: 0 2px 50px rgba(0, 0, 0, 0.1);
    .help-sider-inner {
      width: 100%;
    }
    .ul-first {
      width: 100%;
      >li {
        width: 100%;
        &.top {
          background: url('../../assets/img/help/Head.png') no-repeat;
          background-size: 100%;
          height: 120px;
          justify-content: center;
          display: flex;
          align-items: center;
          .text-center {
            .cn {
              display: block;
              font-family: PingFangSC-Regular;
              font-weight: 700;
              font-size: 16px;
              color: #FFF100;
              letter-spacing: 8px;
              border-bottom: 2px solid #FFF100;
              padding-bottom: 5px;
            }
            .en {
              display: block;
              font-family: PingFangSC-Regular;
              font-weight: 700;
              font-size: 16px;
              color: #FFFFFF;
              margin-top: 5px;
            }
          }
        }
        &.open {
          .ul-second {
            display: block;
          }
        }
      }
    }
    a.a-one {
      border-bottom: 1px solid #565656;
      text-align: left;
      background: #3D3D3D;
      padding: 20px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span.normal {
        background: url('../../assets/img/help/icon_Enter@3x.png') no-repeat;
        background-size: 100%;
        height: 8px;
        width: 14px;
        display: inline-block;
        transition: all 0.3s;
      }
      span.down {
        transform: rotate(180deg)
      }
      span.up {
        transform: rotate(0)
      }
    }
    .ul-second {
      display: none;
      padding: 0 20px;
      background: #373737;
      li {
        padding: 20px 0;
        border-bottom: 1px solid #505050;
        text-align: left;
        &:last-child {
          border-bottom: none;
        }
        &:before {
          content: "";
          height: 8px;
          width: 8px;
          display: inline-block;
          background: #C5C5C5;
          margin-right: 10px;
          border-radius: 50%;
        }
        &.active::before {
          background: #FFF100;
        }
        &.active {
          .a-two {
            color: #FFF100;
          }
        }
      }
      a.a-two {
        color: #C5C5C5;
        font-size: 12px;
        text-align: left;
      }
    }
  }

  .help-main {
    width: 1020px;
    float: right;
    background: #FFF;
    .help-main-inner {
      padding: 20px 25px;
    }
    .row {
      text-align: left;
      font-size: 12px;
      color: #191919;
      h2 {
        font-size: 16px;
        font-weight: normal;
        color: #191919;
        height: 32px;
        line-height: 32px; // background: url(row-title-bg.gif) 0 bottom no-repeat;
        border-bottom: 1px solid #191919;
      }
    }
    .row-text {
      line-height: 180%;
      color: #494949;
      margin: 10px 0;
      padding-bottom: 20px;
    }
    .row-content {
      margin-bottom: 20px;
    }
  }

  .help-content {
    font-family: 'Microsoft Yahei';
    background: #777;
    padding: 20px 0;
    min-height: 550px;
  }

  li {
    list-style: none;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }
</style>