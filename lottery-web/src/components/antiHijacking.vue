<template>
  <div class="hello">
    <header class="header">
      <div>
        <router-link class="nav-left" :to="{name: 'home'}">
          <img src="../assets/img/Logo@3x.png">
        </router-link>
        <p class="nav-title">
          防劫持教程
          <br/>
          <span class="qianse">Anti-hijacking tutorial</span>
        </p>
      </div>
    </header>
    <div class="introduce-content">
      <div class="b_top">
        <div class="top_inner">
          <p class="inner-logo">
            <img src="../assets/img/turoial/icon_Safety@3x.png" />
          </p>
          <p class="inner-title">
            <img src="../assets/img/turoial/text.png" />
          </p>
          <p class="inner-jianjie">
            近期您可能有碰见登录网站时，页面跳转到另外陌生网页的情况。这是由于您的网络供应商漏洞而造成的。可以通过手动指定DNS ( DNS用于将域名正确转换为您想访问的网站的作用) ，修改后你的网络应用将更加稳定、安全。
          </p>
        </div>
      </div>
      <div class="inner-content">
        <p class="title">具体修改方式</p>
        <ul class="content-intro">
          <li class="intro-item ">
            <div class="s_n">
              <span>1</span>
            </div>
            <p>点击桌面左下角的 [开始]按钮，打开 [控制面板]，查看方式为类别，点击 [网络和Internet]，再进入[网络和共享中心]。</p>
            <img src="../assets/img/turoial/image_1@2x.png" width="433" height="220" />
            <img src="../assets/img/turoial/image_2@2x.png" width="433" height="220" />
          </li>
          <li class="intro-item ">
            <div class="s_n">
              <span>2</span>
            </div>
            <p>点击[更改适配器设置]</p>
            <img src="../assets/img/turoial/image_3@2x.png" width="896" height="214" />
          </li>
          <li class="intro-item ">
            <div class="s_n">
              <span>3</span>
            </div>
            <p>右键点击当前活动的网络连接，点弹出菜单中的[属性]</p>
            <img src="../assets/img/turoial/image_4@2x.png" width="896" height="390" />
          </li>
          <li class="intro-item ">
            <div class="s_n">
              <span>4</span>
            </div>
            <p>选择[Internet 协议版本 4 (TCP/IPv4)]，再点击[属性]</p>
            <img src="../assets/img/turoial/image_5@2x.png" width="435" height="434" />
          </li>
          <li class="intro-item ">
            <div class="s_n">
              <span>5</span>
            </div>
            <p>选择 [使用下面的DNS服务器地址]，输入[首选 DNS服务器为 8.8.8.8]和[备用DNS服务器为8.8.4.4]，然后点击[确定]。</p>
            <img src="../assets/img/turoial/image_6@2x.png" width="479" height="588" />
          </li>
        </ul>
      </div>
      <p class="message">注：若完成手动修复本地DNS后仍无法解决问题，您可以参阅以下链接：
        <a href="https://support.microsoft.com/zh-cn/kb/972034" target="_blank">https://support.microsoft.com/zh-cn/kb/972034</a>
      </p>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from './footer';
  export default {
    name: 'tutorial',
    components: {
      myFooter,
    },
    data() {
      return {}
    },
  }
</script>

<style scoped lang='scss'>
  .b_top {
    width: 100%;
    height: 500px;
    overflow: hidden;
    .top_inner {
      width: 100%;
      background: url('../assets/img/turoial/Background-Image@2x.png') no-repeat;
      background-size: cover;
      height: 100%;
      .inner-logo {
        padding: 60px 0 30px;
        >img {
          width: 74px;
          display: inline-block;
        }
      }
      .inner-title {
        padding-bottom: 30px;
        >img {
          width: 320px;
          display: inline-block;
        }
      }
      .inner-jianjie {
        width: 858px;
        margin: 0 auto;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-weight: 700;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 30px;
      }
    }
  }

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
    .inner-content {
      border-left: 1px solid #D8D8D8;
      margin: 30px 0;
      padding-left: 39px;
      width: 989px;
      margin: 0 auto;
      margin-top: 30px;
      >p.title {
        text-align: left;
        width: 956px;
        font-family: PingFangSC-Regualr;
        font-weight: 700;
        font-size: 24px;
        color: #BD8454;
        letter-spacing: 0;
        padding-bottom: 30px;
      }
      .content-intro {
        .intro-item {
          width: 956px;
          margin-bottom: 30px;
          background: #fff;
          padding: 30px;
          text-align: left;
          position: relative;
          &:last-child {
            margin-bottom: 0;
          }
          >p {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #191919;
            letter-spacing: 0;
            padding-bottom: 30px;
          }
          >img {
            display: inline-block;
          }
          .s_n {
            position: absolute;
            left: -59px;
            top: 20px;
            width: 38px;
            height: 38px;
            display: block;
            background: #777777;
            border-radius: 50%;
            font-family: PingFangSC-Regualr;
            font-weight: 700;
            font-size: 28px;
            color: #FFFFFF;
            text-align: center;
            >span {
              line-height: 38px;
              vertical-align: middle;
              display: block;
            }
          }
        }
      }
    }
    >p.message {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: left;
      padding: 30px 0;
      width: 989px;
      margin: 0 auto;
      padding-left: 39px;
    }
  }

  li {
    list-style: none;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }
</style>