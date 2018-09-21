<template>
  <div class="live-casino">
    <div class="header">
      <div class="title">
        <span class="v-line"></span>
        <span class="text">其他娱乐</span>
      </div>
    </div>
    <div class="main">
      <el-row type="flex" justify="space-between">
        <div class="item" :to="{path:'/liveCasino'}" target='_blank'>
          <div class="m-body">
            <div class="media m1">
            </div>
            <div class="special">
              <router-link class="recent-link" :to="{path:'/liveCasino'}" target='_blank'>AG娱乐</router-link>
            </div>
          </div>
          <div class="footer clearfix">
            <div class="title fl">
              <span>真人娱乐</span>
              <span class="item-vline"></span>
              <span>Live Casino</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="m-body">
            <div class="media m2">
            </div>
            <div class="special">
              <router-link class="recent-link" :to="{path:'/slots'}" target='_blank'>AG电子</router-link>
              <router-link class="recent-link" :to="{path:'/fishGame'}" target='_blank'>AG捕鱼达人</router-link>
            </div>
          </div>
          <div class="footer clearfix">
            <div class="title fl">
              <span>电子游戏</span>
              <span class="item-vline"></span>
              <span>Slots</span>
            </div>
          </div>
        </div>
        <!-- <div class="item">
          <div class="m1">
            <div class="media">
              <a class="recent-link">近期上线</a>
            </div>
          </div>
          <div class="footer clearfix">
            <div class="title fl">
              <span>真人娱乐</span>
              <span class="item-vline"></span>
              <span>Live Casino</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="m2">
            <div class="media">
              <a class="recent-link">近期上线</a>
            </div>
          </div>
          <div class="footer clearfix">
            <div class="title fl">
              <span>电子游戏</span>
              <span class="item-vline"></span>
              <span>Slots</span>
            </div>
          </div>
        </div> -->
        <div class="item">
          <div class="m-body">
            <div class="media m3">
            </div>
            <div class="special">
              <a class="recent-link">沙巴体育</a>
            </div>
          </div>
          <div class="footer clearfix">
            <div class="title fl">
              <span>体育游戏</span>
              <span class="item-vline"></span>
              <span>Sports</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="m-body">
            <div class="media m4">
            </div>
            <div class="special">
              <router-link class="recent-link" :to="{path:'/chessBoard'}" target='_blank'>开元棋牌</router-link>
            </div>
          </div>
          <div class="footer clearfix ">
            <div class="title fl ">
              <span>棋牌游戏</span>
              <span class="item-vline "></span>
              <span>Chess Game</span>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <!-- <scoll :data="tip " :class-option="classOption " class="scroll-wrap tips ">
      <ul class="scroll-content ">
        <li v-for="(item,index) in tip " :key="index ">
          <span>{{item}}</span>
        </li>
      </ul>
    </scoll> -->
  </div>
</template>
<script>
  // import Scroll from 'vue-seamless-scroll';
  export default {
    // components: {
    //   scoll: Scroll
    // },
    // data() {
    //   return {
    //     tip: ['微', '信', '.支', '付', '宝', '在', '线', '支', '付', ',qq', '钱', '包', '.网', '银', '转', '账', '入', '款', '成', '功', '率', '100%！', '下', '载', '安', '卓', '.苹', '果', 'app', ',安', '全', '速', '度', '快', ',100%', '防', '止', '域', '名', '被', '劫', '持', '到', '其', '它', '冒', '充', '太', '阳', '城', '的', '网', '站!']
    //   }
    // },
    // computed: {
    //   classOption() {
    //     return {
    //       direction: 2,
    //       hoverStop: false,
    //       waitTime: 0,
    //     }
    //   }
    // }
  }
</script>
<style scoped lang="scss">
  .recent-link {
    width: 140px;
    height: 34px;
    display: none;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-weight: bold;
    line-height: 34px;
    border: 1px solid #BD8454;
    border-radius: 4px;
    font-size: 14px;
    color: #BD8454;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }

    &+& {
      margin-top: 20px;
    }
  }

  .item-vline {
    display: inline-block;
    width: 1px;
    height: 12px;
    border-right: 1px solid #939DB8;
    vertical-align: middle;
    margin: 0 5px;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 25px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
  }

  .scroll-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .scroll-content {
    position: relative;
    transition: top 0.5s;
    padding-left: 50px;
  }

  .scroll-content li {
    display: inline-block;
  }

  .mt2 {
    margin-top: 2px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .live-casino {
    width: 1024px;
    margin-top: 20px;
    height: 346px;
  }

  .live-casino:hover {
    box-shadow: 0 2px 4px #000;
  }

  .live-casino .header {
    height: 65px;
    padding: 20px;
    background-size: 100% 100%Z;
    background: #F4F4F4;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .header .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #BD8454;
  }

  .header .title .text {
    vertical-align: middle;
    display: inline-block;
    font-weight: 700;
  }

  .header .title .en {
    vertical-align: middle;
    display: inline-block;
    margin-left: 5px;
  }

  .live-casino .main {
    background: #F4F4F4;
    padding: 20px;
    padding-top: 0;
  }

  .header-fl {
    float: left;
  }

  .header-fr {
    float: right;
  }

  .clearfix:after {
    content: ". ";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  .item {
    width: 231px;
    cursor: pointer;
    text-decoration: none;
  }

  .item .media {
    height: 230px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item .special {
    height: 230px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }


  .item .m-body {
    width: 100%;
    overflow: hidden;
    position: relative;

    &:hover {
      background: rgba(0, 0, 0, 0.8) !important;
    }

    &:hover .media {
      filter: blur(20px);
      z-index: 2;
    }

    &:hover .special {
      .recent-link {
        display: inline-block;
      }
    }
  }

  .item .m1 {
    background: url('../assets/img/image_1.png') no-repeat;
    background-size: cover;
    height: 230px;
  }

  .item .m2 {
    background: url('../assets/img/image_2.png') no-repeat;
    height: 230px;
    background-size: cover;
  }

  .item .m3 {
    background: url('../assets/img/image_3.png') no-repeat;
    background-size: cover;
    height: 230px;
  }

  .item .m4 {
    background: url('../assets/img/image_4.png') no-repeat;
    background-size: cover;
    height: 230px;
  }

  .item .footer {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin-top: 10px;
  }

  .footer .title span {
    color: #000000;
    letter-spacing: 1.25px;
  }

  .footer .link {
    font-size: 14px;
    letter-spacing: 0.88px;
    display: inline-block;
    vertical-align: middle;
    height: 30px;
    width: 120px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    padding-left: 10px;
    padding-right: 9px;
    background: #872D5E;
  }

  .j-t-click {
    display: inline-block;
    vertical-align: middle;
    background: #E1C79B;
    border-radius: 4px;
    height: 26px;
    color: #000;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    line-height: 26px;
    padding-left: 10px;
    padding-right: 9px;
  }

  .tips {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    background: #1B1B1B;
    border: 2px solid #E1C79B;
    text-align: center;
    height: 40px;
    width: 100%;
    line-height: 36px;
    margin: 10px 0;
  }
</style>