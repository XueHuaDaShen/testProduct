<template>
  <div class="grzxsy-wrap">
    <div class="user-info">
      <span class="user-avatar"><img src="@/assets/img/avatar.png"></span>
      <span class="user-name">{{username}}</span>
    </div>
    <div class="split-bar"></div>
    <ul class="zjglList">
      <li v-for="(item, index) in dataList" :key="index" :class="showItemList===item.code?'active':''" @click="handleShowItemList(item)">
        <div class="item">
          <span :class="item.code"></span>
          <p>{{item.title}}</p>
          <em class="sanjiao down-sanjiao" v-if="item.code !== 'kfzx'"></em>
        </div>
        <ol class="item-list" :id="item.code+'-ol'">
          <!-- <router-link v-for="(list, li) in item.list" :key="li.toString()" :to="{name: list.url}" @click="handleTolink($event)"> -->
            <li v-for="(list, li) in item.list" :key="li.toString()" @click="handleTolink(list.url, $event)">
              <p>{{list.title}}</p>
              <em class="sanjiao right-sanjiao"></em>
            </li>
          <!-- </router-link> -->
        </ol>
      </li>
    </ul>
    <div class="log-out" @click="logOut">退出登录</div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
export default {
  name: 'grzxsy',
  data() {
    return {
      msg: '个人中心首页',
      username: '',
      showItemList: '',
      // 个人中心页面中 所显示的 列表数据
      dataList: [
        // {
        //   title: '客服中心',
        //   code: 'kfzx',
        //   list: []
        // },
        {
          title: '个人资料',
          code: 'grzl',
          list: [
            {title: '个人资料', code: 'grzl', url: 'grzl'},
            {title: '密码管理', code: 'mmgl', url: 'mmgl'},
            {title: '密保问题', code: 'mbwt', url: 'mbwt'},
            {title: '银行卡管理', code: 'yhkgl', url: 'yhkgl'}
          ]
        },
        {
          title: '资金明细',
          code: 'zjmx',
          list: [
            {title: '帐变记录', code: 'zbjl', url: 'zbjl'},
            {title: '充值申请', code: 'czsq', url: 'czsq'},
            {title: '提现申请', code: 'txsq', url: 'txsq'},
            // {title: '转账记录', code: 'zzjl', url: 'zzjl'},
            {title: '额度兑换记录', code: 'eddhjl', url: 'eddhjl'},
            {title: '打码量记录', code: 'dmljl', url: 'dmljl'}
          ]
        },
        {
          title: '投注记录',
          code: 'tzjl',
          list: [
            {title: '彩票记录', code: 'cpjl', url: 'cpjl'},
            {title: '追号记录', code: 'zhjl', url: 'zhjl'},
            {title: '游戏记录', code: 'yxjl', url: 'yxjl'}
          ]
        },
        {
          title: '代理中心',
          code: 'dlzx',
          list: [
            {title: '团队管理', code: 'tdgl', url: 'tdgl'},
            {title: '推广链接', code: 'tglj', url: 'tglj'},
            {title: '开户注册', code: 'khzc', url: 'khzc'}
          ]
        }
      ],
    }
  },
  created() {
    this.username = localStorage.getItem('loginname');
    this.$store.dispatch('setFooterStatus', true);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setTitle', '个人中心');
    this.setListHeight();
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    // 显示隐藏列表
    handleShowItemList(item) {
      const vm = this;
      let prevEl, currEl;
      currEl = document.getElementById(item.code+'-ol');
      // if(item.code === 'kfzx'){
      //   // let script = document.createElement('script');
      //   // let src = 'https://ytpfx.livechatvalue.com/chat/chatClient/monitor.js?jid=8295678173&companyID=1027559&configID=43462&codeType=custom&ss=1'
      //   // // let src = 'https://ytpfx.livechatvalue.com/chat/chatClient/monitor.js'
      //   // script.setAttribute('language', 'javascript')
      //   // script.setAttribute('src', src)
      //   // document.getElementsByTagName('body')[0].insertBefore(script, document.getElementById('app'));
      //   location.href = 'https://ytpfx.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=1027559&configID=43463&jid=8295678173&s=1';
      //   return false;
      // }
      if(this.showItemList !== ''){
        if(vm.showItemList === item.code){
          this.showItemList = '';
          currEl.style.height = 0;
        }else{
          prevEl = document.getElementById(vm.showItemList+'-ol');
          prevEl.style.height = 0;
          this.showItemList = item.code;
          currEl.style.height = item.height + 'rem';
        }
      }else{
        vm.showItemList = item.code;
        currEl.style.height = item.height + 'rem';
      }
      
    },

    // 设置ol 列表的高度
    setListHeight() {
      const vm = this;
      let h = '1.05'; // 单位rem
      this.dataList.filter(v => {
        let curr_h = (v.list.length * h).toFixed(2);
        v.height = curr_h;
      })
    },
    // 跳转页面的时候阻止冒泡
    handleTolink(url, e) {
      e.stopPropagation()
      this.$router.push({
        name: url
      })
    },

    // 退出登录
    logOut() {
      request.logout(this);
    }
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/publicStyle.scss';
.grzxsy-wrap{
  position: relative;
  width:7.5rem;
  min-height:100%;
  .user-info{
    width:100%;
    height:2.75rem;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-align:center;
    -webkit-box-pack:center;
    span{
      display:block;
    }
    .user-avatar{
      width:1.5rem;
      height:1.5rem;
      border-radius:50%;
      overflow:hidden;
      // background: #292932;
      // border: .02rem solid #c7c7c7;
    }
    .user-name{
      height:.45rem;
      line-height:.45rem;
      font-size: .32rem;
      // color: #939DB8;
      letter-spacing: .02rem;
      margin-top:.2rem;
    }
  }
  .zjglList{
    margin-top:.1rem;
    margin-bottom:.3rem;
    padding:0 .3rem;
    li{
      border-bottom:.01rem solid #333;
      font-size: .32rem;
      display:block;
      .item{
        display:-webkit-box;
        -webkit-box-pack:start;
        -webkit-box-align:center;
        height:1.05rem;
        // color: #939DB8;
        position: relative;
        span{
          display:block;
          width:.52rem;
          height:.52rem;
          margin-right:.3rem;
          background:#c7c7c7;
        }
        .sanjiao{
          // @include backSanjiao(.22rem, .22rem, #c7c7c7, .04rem, 135deg);
          // right:.05rem;
          // bottom:.35rem;
        }
        .kfzx{
          background:url('/static/img/customer.png') no-repeat;
          background-size:100% 100%;
        }
        .grzl{
          background:url('/static/img/grzl_icon.png') no-repeat;
          background-size:100% 100%;
        }
        .zjmx{
          background:url('/static/img/zjmx_icon.png') no-repeat;
          background-size:100% 100%;
        }
        .tzjl{
          background:url('/static/img/tzjl_icon.png') no-repeat;
          background-size:100% 100%;
        }
        .dlzx{
          background:url('/static/img/dlzx_icon.png') no-repeat;
          background-size:100% 100%;
        }
      }
      ol{
        width:100%;
        margin-bottom:0;
        background: #292932;
        border-radius: 0 0 .08rem .08rem;
        overflow:hidden;
        height:0;
        transition: all .3s;
        a{
          display:block;
          color: #939DB8;
          text-decoration: none;
          border-bottom:.01rem solid #333;
        }
        li{
          height:1.05rem;
          position: relative;
          display:-webkit-box;
          -webkit-box-pack:start;
          -webkit-box-align:center;
          border-bottom:none;
          color:#646464;
          border-bottom:.01rem solid #333;
          &:last-child{
            border-bottom:none;
          }
          p{
            margin-left:.76rem;
          }
          .sanjiao{
            // @include backSanjiao(.22rem, .22rem, #646464, .04rem, 45deg);
            // right:.35rem;
            // bottom:.3rem;
          }
        }
      }
    }
    li.active{
      border-bottom:none;
      ol{
        height:auto;
        transition: all .3s;
        margin-bottom:.1rem;
      }
    }
  }
  .log-out{
    height:.98rem;
    background: #212129;
    font-size:.32rem;
    text-align: center;
    line-height:.98rem;
    margin-top:2.26rem;
    margin-bottom:.65rem;
  }
}
</style>


