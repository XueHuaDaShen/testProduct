<template>
  <div>
    <div class="row">
      <h2 id="rhdj" class="mb-20">
        <span class="v-line"></span>如何兑奖</h2>
      <div class="row-text">
        <p class="mb-20 t-first">
          开奖号码公布后，系统会自动把奖金全部派送到用户的平台账户，用户可在"彩票记录"中 查询投注是否中奖及奖金情况。若中奖用户超过5分钟未收到奖金，请联系客服并提供购彩记录请求查询帮助。
        </p>
        <p class="mb-20 t-first">
          <strong>平台各彩种开奖时间表如下：</strong>
        </p>
        <p class="mb-10 t-first">
          <strong>
          时时彩销售及开奖时间
          </strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/ssc_table.png" width="675" />
        </p>
        <p class="mb-10 t-first">
          <strong>11选5销售及开奖时间</strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/syxw_table.png" width="675" />
        </p>
        <p class="mb-10 t-first">
          <strong>快三销售及开奖时间</strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/ks_table.png" width="675" />
        </p>
        <p class="mb-10 t-first">
          <strong>PK10销售及开奖时间</strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/pks_table.png" width="675" />
        </p>
        <p class="mb-10 t-first">
          <strong>福彩3D销售及开奖时间</strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/lhc_table.png" width="675" />
        </p>
        <p class="mb-10 t-first">
          <strong>体彩P3/P5销售及开奖时间</strong>
        </p>
        <p class="mb-20">
          <img src="../../assets/img/help/tc_table.png" width="675" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'zhgl',
    data() {
      return {
        s_p: '', // id位置
        s_id: '', // 组件name
      }
    },
    watch: {
      $route(to, from) {
        // react to route changes...
        console.log("to", to);
        let query = to.query;
        if (query.s_p) {
          document.querySelector('#' + query.s_p).scrollIntoView(true);
        }
      }
    },
    methods: {
      getIndex() {
        let hrefArr = window.location.hash.split('/');
        let arr = hrefArr[hrefArr.length - 1];
        if (arr.indexOf("?") != -1) {
          this.s_id = arr.split("?")[0];
          let ar2 = arr.split('?')[1];
          this.s_p = ar2.split('=')[1];
          let id = '#' + this.s_p;
          document.querySelector(id).scrollIntoView(true);
        }
      }
    },
  }
</script>

<style scoped lang='scss'>
  .t-first {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;
  }

  .t-special {
    color: #BD8454;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 18px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
  }

  .t-second {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;
    line-height: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-10 {
    margin-bottom: 10px;
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
    min-height: 469px;

    .help-main-inner {
      padding: 20px 25px;
    }

    .row {
      text-align: left;
      font-size: 12px;
      color: #191919;

      h2 {
        font-weight: 700;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #BD8454;
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