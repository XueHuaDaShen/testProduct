<template>
  <div>
    <div class="row">
      <h2 id="ctl" class="mb-20">
        <span class="v-line"></span>充提类</h2>
      <div class="row-text">
        <p class="t-first mb-10">
          1、完成银⾏行行转账15分钟以上充值仍未到账的原因及解决办法
        </p>
        <p class="t-second mb-20">
          （1）汇款未使用平台提供的最新银行信息
          <br/> （2）汇款时候附言填写错误或者未填写
          <br/> （3）平台填写金额与实际汇款金额不一致
          <br/> （4）平台填写充值信息之后，超过30分钟才进行汇款
          <br/> 以上任何一点都会引起您的充值未到账，请及时联系客服，并提供银行回单截图等相关证明。
        </p>
        <p class="t-first mb-10">
          2、未能成功提现的原因及解决办法
        </p>
        <p class="t-second">
          （1）玩家未完打码量要求
          <br/> （2）提现绑定的银行卡信息有误
          <br/> （3）银行卡被银行冻结或过期
          <br/> -由（1）引起的提现失败，请玩家自行遵守平台提现规定后再进行提现操作
          <br/> -由（2）（3）引起的提现失败，请玩家选择匹配正确的银行卡再进行提现操作。
        </p>
      </div>
    </div>
    <div class="row">
      <h2 id="yxl" class="mb-20">
        <span class="v-line"></span>游戏类</h2>
      <div class="row-text">
        <p class="t-first mb-10">
          1、第三方开奖机构不开奖，投注单如何处理？
        </p>
        <p class="t-second mb-20">
          如果官方机构延迟开奖，平台将顺延开奖时间，如果官方未开奖，平台将对本期所有投注做撤单处理，如果在撤单之后官方开奖，仍维持撤单处理。撤单后，投注金额将如数返回到您的 账户中。
        </p>
        <p class="t-first mb-10">
          2、单体投注最高奖金是多少？
        </p>
        <p class="t-second mb-20">
          单人单期投注最高奖金额为40万，可购买倍数=奖金限额40万除以单倍奖金。
        </p>
        <p class="t-first mb-10">
          3、可追号期数是怎么算的？
        </p>
        <p class="t-second mb-20">
          最大可追号期数为该彩种24小时内全部期数。
        </p>
      </div>
    </div>
    <div class="row">
      <h2 id="aql" class="mb-20">
        <span class="v-line"></span>安全类</h2>
      <div class="row-text">
        <p class="t-first mb-10">
          1、如何避免账户被盗用？
        </p>
        <p class="t-second mb-20">
          （1）提高网络安全意识，请不要随意上不明的网站，不接受不明信息来源的文件，防止木马入侵电脑，并定期对电脑进行安全检查，避免电脑中病毒和木马导致账户被盗；
          <br/> （2）首次登录平台，修改初始登录密码并设定账户资金密码和密保问题，同时锁定您需要用来提款的银行账户；
          <br/> （3）妥善保管您的登录密码和资金密码，同时切勿相信他人以任何理由向您索要账户的登录密码及资金密码；
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cjwt',
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
    font-size: 14px;
    color: #191919;
    font-weight: 700;
  }

  .t-second {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;
    line-height: 20px;
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
        font-weight: 700; // height: 25px;
        // line-height: 25px;
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

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 18px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
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