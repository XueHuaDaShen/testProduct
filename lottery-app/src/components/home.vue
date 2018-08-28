<template>
  <div class="shouye-wrap public-wrap">
    <div class="tip" id="a_swiper" style="position:relative;z-index:88;overflow:hidden;">
      <ul class="swiper-wrapper scroll-content">
        <router-link tag='li' class="swiper-slide" v-for="(item,index) in noticeList" :key="index" :to="{name:'noticeDetail',query:{id:item._id}}">
          <span class="laba"></span>
          <em>{{item.title}}</em>
        </router-link>
      </ul>
    </div>
    <!-- <div class="banner-wrap" style="z-index:99;position:relative" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="swiper-content" v-if="bannerlist.length>0">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide b1" v-for="(item, index) in bannerlist" :key="index">
              窗口
              <a v-if="item.act===1" :href="item.url" :title="item.title">
                <img :src="item.activity_photo" />
              </a>
              新窗口
              <a target="_blank" v-if="item.act===2" :href="item.url" :title="item.title">
                <img :src="item.activity_photo" />
              </a>
              游戏
              <router-link v-if="item.act===3" :title="item.title" :to="{name:item.gamecode,query:{id:item.game,p_code:item.gamecode,s_code:item.gamecode}}">
                <img :src="item.activity_photo" />
              </router-link>
              活动
              <router-link v-if="item.act===4" :to="{name:'activityDetail',query:{id:item.activity}}" :title="item.title">
                <img :src="item.activity_photo" />
              </router-link>
              公告
              <router-link v-if="item.act===5" :to="{name:'noticeDetail',query:{id:item.notice}}" :title="item.title">
                <img :src="item.activity_photo" />
              </router-link>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div> -->
    <div class="split-bar"></div>
    <div class="nav-bar">
      <span></span>
      <em>彩票大厅</em>
      <p class="more" @click="toMore('lottery')">更多<i class="right-sanjiao"></i></p>
    </div>
    <ul class="caipiaoList">
      <router-link v-for="(lottery, li) in lotteryList" :key="li" :to="{ name: lottery.gamecode.split('.')[0]==='lhc'?'lhc':'betsView', query:{id: lottery.gameid, name: lottery.gamename, code: lottery.gamecode.split('.')[0]==='qt'?lottery.gamecode.split('.')[1]:lottery.gamecode.split('.')[0]} }">
        <li>
          <span><img :src="'../static/img/'+lottery.gamecode.split('.')[0]+'_icon.png'"></span>
          <em>{{lottery.gamename}}</em>
        </li>
      </router-link>
    </ul>
    <div class="split-bar"></div>
    <div class="nav-bar">
      <span></span>
      <em>综合娱乐</em>
      <p class="more" @click="toMore('liveVideo')">更多<i class="right-sanjiao"></i></p>
    </div>
    <ul class="yuleList">
      <router-link class="agdz-li" tag="li" :to="{name: 'chessBoard'}">
        <div class="li-bj"></div>
        <span>立即进入</span>
        <span class="span-bj"></span>
      </router-link>
      <router-link class="byyxg-li" tag="li" :to="{name: 'liveVideo'}">
        <div class="li-bj"></div>
        <span>立即进入</span>
        <span class="span-bj"></span>
      </router-link>
      <router-link class="sbty-li" tag="li" :to="{name: 'electron'}">
        <div class="li-bj"></div>
        <span>立即进入</span>
        <span class="span-bj"></span>
      </router-link>
      <router-link class="agsx-li" tag="li" :to="{name: 'soccer'}">
        <div class="li-bj"></div>
        <span>立即进入</span>
        <span class="span-bj"></span>
      </router-link>
      <!-- <li class="bbinyxg-li">
        <span>BBIN游戏馆</span>
      </li>
      <li class="igyxg-li">
        <span>IG游戏馆</span>
      </li> -->
    </ul>
    <div class="split-bar"></div>
    <div class="nav-bar">
      <span></span>
      <em>最新活动</em>
      <p class="more" @click="toMore('activityList')">更多<i class="right-sanjiao"></i></p>
    </div>
    <p class="no-result" style="padding:.3rem;text-align:center;" v-if="noResult">暂无活动</p>
    <ul class="huodongList" v-if="!noResult">
      <li v-for="(activity, index) in huodongList" :key="index" @click="toActivityDetail(activity._id)">
        <a>
          <img :src="activity.activity_photo" class="a1" :alt="activity.title">
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import request from '@/axios/axios.js'
import '@/../node_modules/swiper/dist/css/swiper.css';
import Swiper from 'swiper';
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      loading: true,
      mySwiper: null,
      bannerlist: [], // banner图
      lotteryList: [], // 彩票列表
      noResult: false, // 是否有活动
      huodongList: [], // 活动列表
      noticeList: [], // 公告列表
    }
  },
  beforeCreate() {
  },
  created() {
    // alert('islogout-----'+localStorage.getItem('islogout'))
    // alert('phone-token-----'+localStorage.getItem('phone-token'))
    // alert('loginname-----'+localStorage.getItem('loginname'))
    // alert('refund-----'+localStorage.getItem('refund'))
    // alert('blance-----'+localStorage.getItem('blance'))
    this.$store.dispatch('setTitle', '首页');
    this.$store.dispatch('setFooterStatus', true);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setCleanBtn', false)
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setPlayName', []);
    this.$store.dispatch('setShoppingCartData', []);
  },
  mounted() {
    // this.getBanner();
    this.getLotteryList();
    this.getActivities();
    this.getNotice();
  },
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    // 获取banner 图
    getBanner() {
      const vm = this;
      this.loading = true;
      request.http('get', '/ad/list', {},
        (success) => {
          // console.log(success)
          this.loading = false;
          if (success.returncode == 200) {
            // let bannerlist = success.data;
            if (success.data.total != 0) {
              try{
                vm.bannerlist = success.data.data;
                vm.$nextTick(function() {
                  vm.initSwiperData()
                })
              }catch(e){
                alert('banner图---'+e)
              }
            } else {
              vm.bannerlist = [];
              vm.initSwiperData()
            }
          }
        },
        (error) => {
          console.log('获取用户信息失败', error)
        }
      )
    },
    initSwiperData() {
      this.mySwiper = new Swiper('.swiper-container', {
        loop: true,
        speed: 1000,
        // onlyExternal: true,
        // loopedSlides: 20,
        loopAdditionalSlides: 20,
        navigation: {
          nextEl: '.arrow-left',
          prevEl: '.arrow-right',
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          // type: 'custom',
          clickable: true,
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active',
          renderBullet: function(index, className) {
            // return '<span class="' + className + '">' + (index + 1) + '</span>';
            return '<span class="' + className + '"></span>';
          },
        },
        onSlideChangeEnd: function(swiper) {
          //alert(swiper.activeIndex);
          if (swiper.activeIndex == 40) {
            swiper.swipeTo(0, 0)
          }
        },
      });
    },
    // 获取公告
    getNotice() {
      const vm = this;
      let url = "/notice/list";
      request.http(
        "get",
        url, { pagenum: 1, pagesize: 1000 },
        success => {
          if (success.returncode && success.returncode == 200) {
            if (success.data.total != 0) {
              try{
                let data = success.data.data;
                vm.noticeList = data;
                vm.$nextTick(() => {
                  let ele_height = document.getElementById('a_swiper').offsetHeight;
                  // console.log(ele_height)
                  new Swiper('#a_swiper', {
                    direction: 'vertical',
                    loop: true,
                    speed: 1000,
                    onlyExternal: true,
                    loopAdditionalSlides: 20,
                    height: ele_height,
                    autoplay: true,
                    allowTouchMove: false,
                  });
                })
              }catch(e){
                alert('活动列表---'+e)
              }
            } else {
              vm.huodongList = [];
            }
          }
        },
        error => {
          vm.huodongList = [];
        }
      );
    },
    // 获取彩票列表
    getLotteryList() {
      const vm = this;
      request.http(
        'get',
        '/lottery/hots',
        {},
        (success) => {
          // console.log(success.data)
          if (success.returncode && success.returncode == 200) {
            vm.lotteryList = success.data;
            // vm.lotteryList.sort((a, b) => {
            //   return a.order-b.order
            // })
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取活动列表
    getActivities() {
      const vm = this;
      let url = "/activity/list";
      request.http(
        "get",
        url, { page_num: 1, page_size: 1000 },
        success => {
          if (success.returncode && success.returncode == 200) {
            if (success.data.total != 0) {
              try{
                let data = success.data.data;
                vm.huodongList = data;
                vm.noResult = false;
              }catch(e){
                alert('活动列表---'+e)
              }
            } else {
              vm.huodongList = [];
              vm.noResult = true;
            }
          }
        },
        error => {
          vm.huodongList = [];
          vm.noResult = true;
        }
      );
    },
    toActivityDetail(id) {
      this.$router.push({
        name: 'activityDetail',
        query: {
          id: id
        }
      })
    },
    // 更多
    toMore(name) {
      this.$router.push({
        name: name
      })
    },

  },
}
</script>
<style lang="scss">

.my-bullet {
  width: .18rem;
  height: .18rem;
  // text-align: center;
  // line-height: .18rem;
  cursor: pointer;
  display: inline-block;
  margin: 0 .1rem;
  border-radius: 50%;
  background: #8D8D8D;
  opacity:1;
}

.my-bullet-active {
  background: #fff;
}
</style>

<style lang="scss" scoped>
.shouye-wrap{
  // padding-bottom:1.83rem;
  em{
    font-style:normal;
  }
  img{
    width:100%;
    height:100%;
  }
  .tip{
    ul{
      width:100%;
      height:.84rem;
      li{
        width:100%;
        height:.84rem;
        padding:.2rem .2rem .3rem .2rem;
        font-size:.3rem;
        display:-webkit-box;
        -webkit-box-align:center;
      }
    }
    .laba{
      display:block;
      width:.34rem;
      height:.34rem;
      // background:#c7c7c7;
      background:url('/static/img/horn.png') no-repeat;
      background-size:100% 100%;
    }
    em{
      display:block;
      width:5rem;
      margin-left:.1rem;
      overflow: hidden;
      text-overflow:ellipse;
      white-space: nowrap;
    }
  }
  .banner-wrap{
    width:100%;
    height:3rem;
    .swiper-content, .swiper-container{
      height:100%;
    }
    .b1{
      // background:red;
    }
    .b2{
      // background:green;
    }
    .b3{
      // background:blue;
    }
    .swiper-slide {
      height:100%;
      position: relative;
      a{
        display:block;
        width:100%;
        height:100%;
      }
      img {
        max-width: 100%;
        height:100%;
        opacity: 0.7;
        -webkit-transition: all linear 300ms;
        transition: all linear 300ms;
      }
      a:hover img {
        opacity: 1;
      }
    }
  }
  .nav-bar{
    padding:.3rem;
    font-size:.32rem;
    display:-webkit-box;
    -webkit-box-align:center;
    position: relative;
    span{
      display:block;
      width:.08rem;
      height:.36rem;
      background:#C7C7C7;
    }
    em{
      display:block;
      margin-left:.16rem;
    }
    p.more{
      position: absolute;
      top:.3rem;
      right:.3rem;
      i.right-sanjiao{
        position: static;
        display:inline-block;
        margin-left:.2rem;
      }
    }
  }
  .caipiaoList{
    width:100%;
    border-bottom:.01rem solid #333;
    display:flex;
    flex-wrap:wrap;
    li{
      width:2.5rem;
      height:2.49rem;
      border-top:.01rem solid #333;
      border-right:.01rem solid #333;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      &::nth-child(3n){
        border-right:none;
      }
      span{
        display:block;
        width:1.3rem;
        height:1.3rem;
        // background:#c7c7c7;
        border-radius:50%;
        overflow:hidden;
      }
      em{
        display:block;
        margin-top:.14rem;
      }
    }
  }
  .yuleList{
    width:100%;
    display:-webkit-box;
    // display:flex;
    // flex-wrap:wrap;
    overflow-x:auto;
    padding-left:.3rem;
    position: relative;
      // height:2.1rem;
    li{
      width:2.4rem;
      height:2.1rem;
      // margin-bottom:.3rem;
      position: relative;
      .li-bj{
        width:2.1rem;
        height:2.1rem;
        background: #292932;
        border-radius: .08rem;
        overflow:hidden;
      }
      &:last-child{
        margin-right:.3rem;
      }
      span{
        display:block;
        width:2.1rem;
        height:.5rem;
        text-align:center;
        line-height:.5rem;
        position: absolute;
        left:0;
        bottom:0;
        z-index:3;
      }
      span.span-bj{
        display:block;
        width:2.1rem;
        height:.5rem;
        background:#303040;
        position: absolute;
        left:0;
        bottom:0;
        opacity:.9;
        z-index:2;
        border-radius:0 0 .08rem .08rem;
      }
    }
    li.agdz-li>div{
      background:url('/static/img/image_4.png') no-repeat;
      background-size:100% 100%;
    }
    li.byyxg-li>div{
      background:url('/static/img/image_1.png') no-repeat;
      background-size:100% 100%;
    }
    li.sbty-li>div{
      background:url('/static/img/image_2.png') no-repeat;
      background-size:100% 100%;
    }
    li.agsx-li>div{
      background:url('/static/img/image_3.png') no-repeat;
      background-size:100% 100%;
    }
    li.bbinyxg-li{
      background:url('/static/img/bbinyxg.png') no-repeat;
      background-size:100% 100%;
    }
    li.igyxg-li{
      background:url('/static/img/igyxg.png') no-repeat;
      background-size:100% 100%;
    }
  }
  .huodongList{
    width:100%;
    display:flex;
    flex-wrap:wrap;
    margin-bottom:1.83rem;
    li{
      width:3.3rem;
      height:1.85rem;
      background: #292932;
      border-radius: .08rem;
      margin-left:.3rem;
      margin-bottom:.3rem;
      overflow:hidden;
      position: relative;
      a{
        display:block;
        width:100%;
        height:100%;
      }
    }
  }
}
</style>

