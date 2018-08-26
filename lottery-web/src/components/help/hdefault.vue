<template>
  <div class="row">
    <h2>默认页面</h2>
    <div class="row-text">
      <p>
        <span class="s-t1">时时彩属于高频彩，投注区分为万位、千位、百位、十位和个位，各位号码范围为0～9，每期从各位上开出1个号码组成中奖号码。玩法即是竞猜5位开奖号码的全部号码、部分号码或部分 号码特征。时时彩分星彩玩法和大小单双玩法。目前上线了重庆、天津、新疆、黑龙江、河内地区的时时彩以及自主研发的BWin60秒、BWin120秒。
        </span>
        <br/>
      </p>
    </div>
  </div>
  <!-- <div class="help-main-inner" v-if="firstIndex!=0">
            <div class="row" v-for="(item__,index__) in second" :key="index__">
              <h2 :id="'order'+index__">{{item__.name}}</h2>
              <div class="row-text">
                <div v-for="(tip,tipindex) in item__.content" :key="tipindex" class="row-content">
                  <p>
                    <span style="color: rgb(255, 0, 0);">{{tip.title}}</span>
                  </p>
                  <p v-for="(content,cindex) in tip.desc" :key="cindex">{{content}}</p>
                </div>
              </div>
            </div>
          </div> -->
  <!-- <div class="row">
              <h2>{{tips.title1}}</h2>
              <div class="row-text">
                <p>
                  <span style="line-height: 1em;margin-bottom:20px;display:inline-block ">{{tips.title2}}</span>
                  <br/>
                </p>
                <div v-for="(tip,tipindex) in tips.content" :key="tipindex" class="row-content">
                  <p>
                    <span style="color: rgb(255, 0, 0);">{{tip.name}}</span>
                    {{tip.desc}}
                  </p>
                  <p v-for="(content,cindex) in tip.content" :key="cindex">{{content}}</p>
                </div>
              </div>
            </div> -->
</template>

<script>
  export default {
    name: 'hdefault',
    data() {
      return {

      }
    },
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
    height: 39px;
  }

  .server {
    margin-left: 35px;
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
    width: 210px;
    float: left;
    background: #2C2D2F;
    .help-sider-inner {}
    .ul-first {
      li {
        // background: url(add.gif) no-repeat 290px 13px;
        &.open {
          // background-image: url(reduce.gif);
          .ul-second {
            display: block;
          }
        }
      }
    }
    a {
      display: block;
      color: #e0d6c0;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #565656;
      padding: 0 15px;
      text-align: left;
    }
    .ul-second {
      display: none;
      li {
        background: #404040;
      }
      a {
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

  li {
    list-style: none;
  }

  .help-content {
    font-family: 'Microsoft Yahei';
    background: #777;
    padding: 30px 0;
    min-height: 550px;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  .s-t1 {
    line-height: 1em;
    margin-bottom: 20px;
    display: inline-block
  }
</style>