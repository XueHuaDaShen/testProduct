<template>
  <div class="hello">
    <header class="header">
      <div>
        <router-link class="nav-left" :to="{name: 'home'}">
          <img src="../assets/img/Logo@3x.png">
        </router-link>
        <router-link :to="{name:'download'}" class="download"><img src="@/assets/img/bets-img/xiazai-icon.png" class="xiazai-icon">下载中心</router-link>
        <a @click="open" class="server"><img src="@/assets/img/bets-img/kefu-icon.png" class="kefu-icon">联系客服</a>
      </div>
    </header>
    <div class="introduce-content">
      <p class="b_top">
        <img src="../assets/img/introduce/b_top.png" />
      </p>
      <p class="intro-title">
        必赢产品
      </p>
      <div class="product-list">
        <div class="list-item">
          <div class="item-media m1"></div>
          <div class="item-text">
            <p class="text-top">彩票游戏</p>
            <p class="text-detail">国际知名游戏品牌强势入驻；强大的资金后盾保障，信誉最佳；强大的IT技术支持，平台稳定快捷。</p>
          </div>
        </div>
        <div class="list-item">
          <div class="item-media m2"></div>
          <div class="item-text">
            <p class="text-top">电子游戏</p>
            <p class="text-detail">国际知名游戏品牌强势入驻；强大的资金后盾保障，信誉最佳；强大的IT技术支持，平台稳定快捷。</p>
          </div>
        </div>
        <div class="list-item">
          <div class="item-media m3"></div>
          <div class="item-text">
            <p class="text-top">体育竞技</p>
            <p class="text-detail">手机投注方便快捷；每月提供100,000场体育赛事，覆盖亚盘、欧门球赛；国际盘口，下注无忧；充值、提现极速到账。</p>
          </div>
        </div>
        <div class="list-item">
          <div class="item-media m4"></div>
          <div class="item-text">
            <p class="text-top">真人娱乐</p>
            <p class="text-detail">真人线上游戏平台采用了最先进的HD串流高画质以及独立多重分割视窗。</p>
          </div>
        </div>
      </div>
      <p class="intro-title">
        关于必赢
      </p>
      <div class="about">
        <div class="about-text">
          <p class="text-title">我们是一家权威认证的国际博彩平台</p>
          <p class="text-detail">东南亚必赢集团总成立于2010年，集团行业涉及房地产、互联网，博彩、传媒、体育、旅游等多个产业，在新加坡、马来西亚、泰国、澳门、印尼、柬埔寨拥有实体公司和综合业务。在集团的强大实力为背景依托下，必赢博彩是B2C和B2B市场领先的电子博彩运营商，拥有四个主要产品垂直领域（彩票，体育，电子游艺，真人娱乐）以及多个产品。必赢博彩根据菲律宾政府颁发的国内外线上、线下博彩许可证，在全球开展业务活动。公司拥有数千名精英员工，为全球的客户提供优良的服务。</p>
        </div>
      </div>
      <p class="intro-title">
        必赢博彩 · 一路伴您 · 赢取未来
      </p>
      <div class="introduce-list">
        <div class="list-item">
          <div class="item-text i1">
            <img src="../assets/img/introduce/icon_1.png" />
            <p class="text-bottom">强大的资金保障
              <br/>100%兑现赔付,保您畅赢无忧
            </p>
          </div>
        </div>
        <div class="list-item">
          <div class="item-text i2">
            <img src="../assets/img/introduce/icon_2.png" />
            <p class="text-bottom">健全资金风险管控力
              <br/> 为您遮风挡雨,畅赢无阻
            </p>
          </div>
        </div>
        <div class="list-item">
          <div class="item-text i3">
            <img src="../assets/img/introduce/icon_3.png" />
            <p class="text-bottom">精英团队
              <br/> 独一无二，成就必赢 ​
            </p>
          </div>
        </div>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
  import myFooter from './footer';
  export default {
    name: 'introduce',
    components: {
      myFooter,
    },
    data() {
      return {}
    },
    methods: {
      open() {
        window.open('https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1', 'newwindow', 'height=700, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      }
    }
  }
</script>

<style scoped lang='scss'>
  .b_top {
    width: 100%;
    >img {
      width: 100%;
      display: inline-block;
    }
  }

  .intro-title {
    margin-top: 60px;
    height: 36px;
    font-size: 36px;
    font-family: MicrosoftYaHei;
    color: #3a3949;
    line-height: 36px;
    text-align: center;
    margin-bottom: 58px;
    &::after {
      content: "";
      display: block;
      width: 88px;
      height: 8px;
      background: rgba(189, 132, 84, 1);
      border-radius: 4px;
      margin: 0 auto;
      margin-top: 20px;
    }
  }

  .product-list {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .list-item {
      width: 253px;
      height: 383px;
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
      .item-media {
        height: 168px;
        background: #eee;
        background-size: 100%;
        &.m1 {
          background: url('../assets/img/introduce/item_1.png') no-repeat;
        }
        &.m2 {
          background: url('../assets/img/introduce/item_2.png') no-repeat;
        }
        &.m3 {
          background: url('../assets/img/introduce/item_3.png') no-repeat;
        }
        &.m4 {
          background: url('../assets/img/introduce/item_4.png') no-repeat;
        }
      }
      .item-text {
        height: 215px;
        width: 100%;
        text-align: center;
        background: #3A3949;
        padding: 0 10px;
        .text-top {
          font-size: 28px;
          font-family: MicrosoftYaHei;
          color: #deb958;
          padding: 30px 0;
        }
        .text-detail {
          text-align: left;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .about {
    height: 545px;
    position: relative;
    background: url('../assets/img/introduce/b_about.png') no-repeat;
    background-size: 100%;
    .about-text {
      height: 428px;
      width: 455px;
      position: absolute;
      top: 0;
      right: 90px;
      padding: 57px 25px;
      background: #3A3949;
      .text-title {
        font-size: 22px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        text-align: center;
      }
      .text-detail {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: rgba(248, 248, 251, 1);
        line-height: 26px;
        text-align: left;
        margin-top: 60px;
      }
    }
  }

  .introduce-list {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 73px;
    .list-item {
      width: 339px;
      height: 316px;
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
      .item-text {
        height: 100%;
        width: 100%;
        background: #eee;
        background-size: 100%;
        padding: 58px 33px 80px;
        &.i1 {
          background: url('../assets/img/introduce/intro_1.png') no-repeat;
        }
        &.i2 {
          background: url('../assets/img/introduce/intro_2.png') no-repeat;
        }
        &.i3 {
          background: url('../assets/img/introduce/intro_3.png') no-repeat;
        }
        >img {
          display: block;
          height: 85px;
          width: 85px;
          margin: 0 auto;
        }
        .text-bottom {
          font-size: 20px;
          font-family: MicrosoftYaHei;
          color: white;
          line-height: 24px;
          text-align: center;
          margin-top: 48px;
        }
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

  .introduce-content {
    font-family: 'Microsoft Yahei';
    background: #EEEEEE;
    min-height: 550px;
    width: 1200px;
    margin: 0 auto;
  }

  li {
    list-style: none;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }
</style>