<template>
  <div>
    <div class="row">
      <h2 id="mm" class="mb-20">
        <span class="v-line"></span>密码</h2>
      <div class="row-text">
        <p class="t-first mb-10">
          1、登陆密码
        </p>
        <p class="t-second mb-10">
          （1）设定
        </p>
        <p>
          <span class="s-t1"><span style="font-weight:bold;">代理代为开户</span>：初始登陆密码由代理代为设定，用户在初次登陆时应及时修改登陆密码。 <span style="font-weight:bold;">主链接开户</span>：玩家在注册时设定登陆密码，初次登陆时需再修改登陆密码。
          </span>
        </p>
        <p class="t-second">
          （2）修改
        </p>
        <p>
          <span class="s-t1">玩家登陆平台后，可在“<strong>账户管理</strong>”—“<strong>密码管理</strong>”一栏进行修改，即可修改登陆密码。
          </span>
        </p>
        <p class="t-second">
          （3）遗失
        </p>
        <p class="mb-20">
          <span class="s-t1">如玩家忘记登陆密码，可联系官网在线客服并按照要求提供相关资料后找回密码。
          </span>
        </p>
        <p class="t-first mb-20">
          2、资金密码
        </p>
        <p class="t-second mb-10">
          （1）设定
        </p>
        <p>
          <span class="s-t1">初始账号未设置资金密码，需玩家登陆平台后自行设定（不能与登陆密码相同）。为了自身资金安全，请仔细保管资金密码，切勿轻易泄露。
          </span>
        </p>
        <p class="t-second mb-10">
          （2）修改
        </p>
        <p>
          <span class="s-t1">玩家登陆平台后，可在“<strong>用户中心</strong>”—“<strong>密码管理</strong>”一栏进行修改，先输入旧的资金密码，再输入新的资金密码，即可完成资金密码的修改。
          </span>
        </p>
        <p class="t-second mb-10">
          （3）遗失
        </p>
        <p class="mb-20">
          <span class="s-t1">如果玩家忘记资金密码，需联系在线客服进行处理，并配合提供相关信息，一旦确认信息完全无误，客服将为玩家重置资金密码，并通过邮件或短信告知。
          </span>
        </p>
      </div>
    </div>
    <div class="row">
      <h2 id="grzl" class="mb-20">
        <span class="v-line"></span>个人资料</h2>
      <div class="row-text">
        <p>
          点击进入“<strong>密码管理</strong>”页面，输入一个新的昵称，点击“<strong>保存</strong>”即可完成昵称修改。注册时请填写个人有效邮箱地址，以便接收活动及促销信息。
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
    font-size: 14px;
    color: #191919;
    font-weight: 700;
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