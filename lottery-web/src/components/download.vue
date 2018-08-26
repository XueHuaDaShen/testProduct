<template>
  <div class="hello">
    <header class="header">
      <div>
        <router-link class="nav-left" :to="{name: 'home'}">
          <img src="../assets/img/Logo@3x.png">
        </router-link>
        <p class="nav-title">
          下载中心
          <br/>
          <span class="qianse">Download Center</span>
        </p>
      </div>
    </header>
    <div class="introduce-content">
      <div class="b_top">
        <div class="top_inner">
          <p class="inner-logo">
            <img src="../assets/img/download/Logo@3x.png" />
            <!-- <img src="../assets/img/download/Logo_White.png" /> -->
          </p>
          <p class="inner-title">
            <img src="../assets/img/download/text.png" />
          </p>
          <div class="inner-jianjie">
            <div class="j-item">
              <span>
                体验佳
              </span>
            </div>
            <div class="j-item">
              <span>
                安全
              </span>
            </div>
            <div class="j-item">
              <span>
                可开户
              </span>
            </div>
            <div class="j-item">
              <span>
                可充值
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="download_content">
        <div class="content_inner">
          <div class="swiper-outer">
            <div class="swiper-container phone_animate" id="swiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide p1">
                </div>
                <div class="swiper-slide p2">
                </div>
                <div class="swiper-slide p3">
                </div>
                <div class="swiper-slide p4">
                </div>
                <div class="swiper-slide p5">
                </div>
                <div class="swiper-slide p6">
                </div>
              </div>
            </div>
          </div>
          <div class="txt_wrap " :style="tabActive === 1 ? 'visibility:visible':'visibility:hidden'">
            <p>iOS系统手机下载</p>
            <div class="wrap-inner">
              <div class="wrap-left">
                <p>ios应用证书信任操作步骤</p>
                <ul class="steps">
                  <li class="steps-item">1 打开手机（设置）</li>
                  <li class="steps-item">2 找到（通用）项，点击进入</li>
                  <li class="steps-item">3 上拉界面，点击（描述文件）或（设备管理）</li>
                  <li class="steps-item">4 出现企业级应用，点击该应用证书</li>
                  <li class="steps-item">5 选择（信任）证书操作</li>
                </ul>
              </div>
              <div class="wrap-right">
                <p>扫描二维码进行下载</p>
                <img src="../assets/img/download/bwin_qr_ios.jpg" />
              </div>
            </div>
          </div>
          <div class="txt_wrap" :style="tabActive === 2 ? 'visibility:visible':'visibility:hidden'">
            <p>安卓系统手机下载</p>
            <div class="wrap-inner">
              <div class="wrap-left">
                <p>安装流程</p>
                <ul class="steps">
                  <li class="steps-item">1 使用微信或其他工具扫描二维码</li>
                  <li class="steps-item">2 在打开的页面点击安装</li>
                  <li class="steps-item">3 系统将自动下载应用程序</li>
                  <li class="steps-item">4 下载完成后点选安装</li>
                  <li class="steps-item">5 点击开启精彩应用</li>
                </ul>
              </div>
              <div class="wrap-right">
                <p>扫描二维码进行下载</p>
                <img src="../assets/img/download/bwin_qr_apk.jpg" />
              </div>
            </div>
          </div>
          <div class="txt_wrap" :style="tabActive === 3 ? 'visibility:visible':'visibility:hidden'">
            <p>扫码登录手机</p>
            <div class="wrap-inner">
              <div class="wrap-left">
                <p>安装流程</p>
                <ul class="steps">
                  <li class="steps-item">1 使用微信或其他工具扫描二维码</li>
                  <li class="steps-item">2 进入必赢登录页面</li>
                  <li class="steps-item">3 可选择记住登录密码</li>
                </ul>
              </div>
              <div class="wrap-right">
                <p>扫描二维码进行下载</p>
                <img src="../assets/img/download/bwin_qr_h5.png" />
              </div>
            </div>
          </div>
          <ul class="txt-tabs ">
            <li class="tabs-item" @click="tabToggle(1)" :class="{'active':tabActive === 1}">
              <div class="left-icon i1"></div>
              <p class="right-txt">
                iOS系统手机下载
                <br/>
                <span class="txt-bottom">版本号 1.0</span>
              </p>
            </li>
            <li class="tabs-item" @click="tabToggle(2)" :class="{'active':tabActive === 2}">
              <div class="left-icon i2"></div>
              <p class="right-txt">
                安卓系统手机下载
                <br/>
                <span class="txt-bottom">版本号 1.0</span>
              </p>
            </li>
            <li class="tabs-item" @click="tabToggle(3)" :class="{'active':tabActive === 3}">
              <div class="left-icon i3"></div>
              <p class="right-txt">
                扫码登录手机
                <br/>
                <span class="txt-bottom">任意手机型号</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from './footer';
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.css';
  export default {
    name: 'download',
    components: {
      myFooter,
    },
    data() {
      return {
        tabActive: 1
      }
    },
    methods: {
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      },
      tabToggle(index) {
        this.tabActive = index;
      },
      swiperInit() {
        let self = this;
        this.swiper = new Swiper('#swiper', {
          loop: true,
          speed: 1000,
          autoplay: {
            delay: 1500,
            disableOnInteraction: false,
          },
          effect: 'fade',
          // allowTouchMove: false,
        });
        // this.swiper.el.onmouseover = function() {
        //   self.swiper.autoplay.stop();
        // }
        // this.swiper.el.onmouseleave = function() {
        //   self.swiper.autoplay.start();
        // }
      }
    },
    mounted() {
      const vm_ = this;
      setTimeout(function() {
        vm_.swiperInit();
      }, 2000);
    }
  }
</script>

<style scoped lang='scss'>
  .b_top {
    width: 100%;
    height: 500px;
    overflow: hidden;
    .top_inner {
      width: 100%;
      background: url('../assets/img/download/Background-Image.png') no-repeat;
      background-size: cover;
      height: 100%;
      .inner-logo {
        padding: 60px 0 30px;
        >img {
          width: 120px;
          display: inline-block;
        }
      }
      .inner-title {
        padding-bottom: 30px;
        >img {
          width: 600px;
          display: inline-block;
        }
      }
      .inner-jianjie {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .j-item {
          margin-right: 30px;
          font-family: PingFangSC-Regular;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          &:last-child {
            margin-right: 0;
          }
          &:before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            background: url('../assets/img/download/Icon@3x.png') no-repeat;
            background-size: 100%;
            vertical-align: top;
          }
        }
      }
    }
  }

  .download_content {
    width: 100%;
    height: 800px;
    background: #fff;
    .content_inner {
      width: 1024px;
      height: 100%;
      position: relative;
      margin: 0 auto;
      .swiper-outer {
        background: url('../assets/img/download/iPhone_1@2x.png') no-repeat;
        background-size: 100%;
        position: absolute;
        top: -156px;
        left: 710px;
        width: 339px;
        height: 631px;
        animation: fadeInDown 1.2s linear 0.5s;
      }
      .phone_animate {
        height: 434px;
        width: 244px;
        position: absolute;
        left: 48px;
        top: 89px;
      }
      .p1 {
        background: url('../assets/img/download/image_1@2x.png') no-repeat;
        background-size: cover;
      }
      .p2 {
        background: url('../assets/img/download/image_2@2x.png') no-repeat;
        background-size: cover;
      }
      .p3 {
        background: url('../assets/img/download/image_3@2x.png') no-repeat;
        background-size: cover;
      }
      .p4 {
        background: url('../assets/img/download/image_4@2x.png') no-repeat;
        background-size: cover;
      }
      .p5 {
        background: url('../assets/img/download/image_5@2x.png') no-repeat;
        background-size: cover;
      }
      .p6 {
        background: url('../assets/img/download/image_6@2x.png') no-repeat;
        background-size: cover;
      }
      .txt_wrap {
        position: absolute;
        top: -53px;
        left: 0;
        width: 690px;
        height: 398px;
        background: #FFFFFF;
        box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        padding: 30px;
        animation: fadeInDown 1.2s linear 0.5s;
        >p {
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: #BD8454;
          margin-bottom: 30px;
          font-weight: 700;
        }
        .wrap-inner {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          .wrap-left {
            flex: 1;
            padding: 0 12px;
            >p {
              font-family: PingFangSC-Regular;
              font-weight: 700;
              font-size: 14px;
              color: #191919;
              margin-bottom: 10px;
            }
            .steps {
              border-left: 1px solid #D8D8D8;
              padding: 10px 0;
              padding-left: 12px;
              .steps-item {
                background: #F3F3F3;
                border: 1px solid #D8D8D8;
                width: 330px;
                height: 30px;
                font-size: 14px;
                color: #777777;
                font-weight: 700;
                font-family: PingFangSC-Regular;
                padding: 5px 0 5px;
                text-align: left;
                margin-bottom: 20px;
                &::before {
                  background: #777777;
                  width: 8px;
                  height: 8px;
                  display: inline-block;
                  content: "";
                  border-radius: 50%;
                  margin-left: -18px;
                  margin-right: 38px;
                }
                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
          .wrap-right {
            width: 250px;
            margin-left: 33px;
            >p {
              font-family: PingFangSC-Regular;
              font-weight: 700;
              font-size: 14px;
              color: #191919;
              margin-bottom: 10px;
            }
            >img {
              width: 250px;
              height: 250px;
              display: block;
            }
          }
        }
      }
      .txt-tabs {
        position: absolute;
        top: 375px;
        left: 0;
        width: 690px;
        height: 60px;
        background: #EAEAEA;
        border-radius: 8px;
        animation: fadeInDown 1.2s linear 0.5s;
        box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.30);
        .tabs-item {
          border-right: 1px solid #CECECE;
          font-family: PingFangSC-Regular;
          font-weight: 700;
          font-size: 14px;
          color: #191919;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          width: 230px;
          height: 100%;
          cursor: pointer;
          &:last-child {
            border-right: none;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &.active {
            background: #191919;
            color: #FFFFFF;
            .left-icon.i1 {
              background: url('../assets/img/download/icon_Apple@3x.png') no-repeat;
              background-size: 100%;
            }
            .left-icon.i2 {
              background: url('../assets/img/download/icon_Android@3x.png') no-repeat;
              background-size: 100%;
            }
            .left-icon.i3 {
              background: url('../assets/img/download/icon_Scancode@3x.png') no-repeat;
              background-size: 100%;
            }
          }
          .txt-bottom {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #777777;
          }
          .left-icon {
            height: 37px;
            width: 31px;
            background: #000;
            margin-right: 20px;
            &.i1 {
              background: url('../assets/img/download/icon_Appleu@3x.png') no-repeat;
              background-size: 100%;
            }
            &.i2 {
              background: url('../assets/img/download/icon_Androidu@3x.png') no-repeat;
              background-size: 100%;
            }
            &.i3 {
              background: url('../assets/img/download/icon_Scancodeu@3x.png') no-repeat;
              background-size: 100%;
            }
          }
          .right-txt {
            line-height: 20px;
            text-align: left;
          }
        }
      }
    }
  }

  @keyframes fadeInDown {
    0% {
      opacity: 0.5;
      transform: translate3d(0, -30px, 0)
    }
    100% {
      opacity: 1;
      transform: none
    }
  }

  /*   @keyframes fadeInRight {
    0% {
      opacity: 0.5;
      transform: translate3d(20px, 0, 0)
    }
    100% {
      opacity: 1;
      transform: none
    }
  } */

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
    -webkit-box-pack: start;
  }

  .header>div a {
    font-size: 16px;
    color: #777777;
    letter-spacing: 1px;
    text-decoration: none;
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

  .nav-title {
    border-left: 1px solid #323232;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    text-align: left;
    margin-left: 20px;
    line-height: 22px;
  }

  .qianse {
    color: #777777;
  }

  .server {
    margin-left: 35px;
  }

  .introduce-content {
    font-family: 'Microsoft Yahei';
    background: #EEEEEE;
    width: 100%;
  }

  li {
    list-style: none;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }
</style>