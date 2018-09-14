<template>
  <div>
    <div class="full">
      <div class="swiper-content">
        <!-- <a class="arrow-left" href='javascript:void(0)'></a>
        <a class="arrow-right" href='javascript:void(0)'></a> -->
        <div class="cover-left"></div>
        <div class="swiper-container" id="mySwiper" v-loading="loading">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in bannerlist" :key="index">
              <!-- 窗口 -->
              <a v-if="item.act===1" :href="item.url" :title="item.title">
                <img :src="item.activity_photo" />
              </a>
              <!-- 新窗口 -->
              <a target="_blank" v-if="item.act===2" :href="item.url" :title="item.title">
                <img :src="item.activity_photo" />
              </a>
              <!-- 游戏 -->
              <router-link v-if="item.act===3" :title="item.title" :to="{name:item.gamecode,query:{id:item.game,p_code:item.gamecode,s_code:item.gamecode}}">
                <img :src="item.activity_photo" />
              </router-link>
              <!-- 活动 -->
              <router-link v-if="item.act===4" :to="{name:'activityDetail',query:{id:item.activity}}" :title="item.title">
                <img :src="item.activity_photo" />
              </router-link>
              <!-- 公告 -->
              <!-- :style="{backgroundImage: 'url(' + item.activity_photo + ')'} "  -->
              <router-link v-if="item.act===5" :to="{name:'noticeDetail',query:{id:item.notice}}" :title="item.title">
                <img :src="item.activity_photo" />
              </router-link>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="cover-right"></div>
      </div>
    </div>
    <div class="tips" v-if="!noresult" v-cloak>
      <!-- <div class="swiper-container" id="noticeSwiper">
        <div class="swiper-wrapper">
          <router-link class="swiper-slide" v-for="(item,index) in items" :key="index" :to="{ name: 'noticeDetail', query: { id: item._id }}" style="text-decoration:none">
            <span class="scroll-item-text">{{item.title}}</span>
          </router-link>
        </div>
      </div> -->
      <vue-seamless-scroll :data="items" :class-option="optionLeft" class="seamless-warp2" :style="{'width':seamless_width}">
        <ul class="item" :style="{'width':seamless_width}">
          <li v-for="(item,index) in items" :key="index">
            <router-link :to="{ name: 'noticeDetail', query: { id: item._id }}">{{item.title}}</router-link>
          </li>
        </ul>
      </vue-seamless-scroll>
    </div>
  </div>
</template>
<script>
  import Swiper from "swiper";
  import "swiper/dist/css/swiper.css";
  import request from "../axios/axios.js";
  import vueSeamlessScroll from "vue-seamless-scroll";
  export default {
    components: {
      vueSeamlessScroll
    },
    data() {
      return {
        bannerlist: [],
        mySwiper: null,
        items: [],
        noresult: false,
        noticeSwiper: null,
        loading: false,
        seamless_width: '',
        items_width: ''
      };
    },
    methods: {
      toNoticeDetail(id) {
        this.$router.push({ name: "noticeDetail", query: { id: id } });
      },
      mousePre() {
        // console.log('mySwiper', this.mySwiper);
        this.mySwiper.swipePrev();
      },
      mouseNext() {
        this.mySwiper.swipeNext();
      },
      // 排序
      compare(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        };
      },
      getBanner() {
        let self = this;
        self.loading = true;
        request.http(
          "get",
          "/ad/list", {},
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              let bannerlist = success.data;
              if (success.data.total != 0) {
                let data = success.data.data;
                data.sort(self.compare("order "));
                self.bannerlist = data;
                self.$nextTick(function() {
                  self.swiperInit();
                });
              } else {
                self.bannerlist = [];
                self.swiperInit();
              }
            } else if (
              success.returncode == 101 ||
              success.returncode == 103 ||
              success.returncode == 106
            ) {
              request.loginAgain(self);
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
            console.log("获取用户信息失败", error);
          }
        );
      },
      //获取公告列表
      getNotices() {
        let self = this;
        let url = "/notice/list";
        request.http(
          "get",
          url,
          {
            pagenum: 1,
            pagesize: 10000
          },
          success => {
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                if (success.data.total) {
                  self.noresult = false;
                  let data = success.data.data;
                  let final = [];
                  for (let i = 0; i < data.length; i++) {
                    let o = data[i];
                    if (o.isRoll === 1) {
                      final.push(o);
                    }
                  }
                  self.items = final;
                  // self.$nextTick(function() {
                  //   self.noticeSwiperInit();
                  // });
                } else {
                  self.noresult = true;
                  self.items = [];
                }
              } else {
                self.$message({
                  showClose: true,
                  message: success.data.msg,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.noresult = true;
            self.items = [];
            console.log("数据异常", error);
          }
        );
      },
      swiperInit() {
        let self = this;
        this.mySwiper = new Swiper("#mySwiper", {
          loop: true,
          speed: 1000,
          loopAdditionalSlides: 20,
          navigation: {
            nextEl: ".arrow-right",
            prevEl: ".arrow-left"
          },
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          pagination: {
            el: ".swiper-pagination",
            // type: 'custom',
            clickable: true,
            bulletClass: "my-bullet",
            bulletActiveClass: "my-bullet-active",
            renderBullet: function(index, className) {
              // return '<span class=" ' + className + ' ">' + (index + 1) + '</span>';
              return '<span class=" ' + className + ' "></span>';
            }
          }
        });
        this.mySwiper.el.onmouseover = function() {
          self.mySwiper.autoplay.stop();
        };
        this.mySwiper.el.onmouseleave = function() {
          self.mySwiper.autoplay.start();
        };
      },
      noticeSwiperInit() {
        let self = this;
        this.noticeSwiper = new Swiper("#noticeSwiper", {
          loop: true,
          speed: 1000,
          loopAdditionalSlides: 20,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          }
        });
        this.noticeSwiper.el.onmouseover = function() {
          self.noticeSwiper.autoplay.stop();
        };
        this.noticeSwiper.el.onmouseleave = function() {
          self.noticeSwiper.autoplay.start();
        };
      },
      initScroll() {
        let width = `${document.documentElement.clientWidth}`;
        this.seamless_width = width + "px";
        this.items_width = parseFloat(width) + 100 + "px";
        const vm = this;
        window.onresize = function temp() {
          vm.seamless_width = `${document.documentElement.clientWidth}` + "px";
          vm.items_width = parseFloat(`${document.documentElement.clientWidth}`) + 100 + "px";
        };
      }
    },
    computed: {
      optionLeft() {
        return {
          direction: 2,
          limitMoveNum: 2
        }
      }
    },
    created() {
      this.initScroll();
    },
    mounted() {
      this.getBanner();
      this.getNotices();
    }
  };
</script>
<style scoped lang="scss">
  .seamless-warp2 {
    overflow: hidden;
    height: 40px;
    margin: 0 auto;

    ul.item {
      li {
        float: left;
        margin-right: 100px;
        list-style: none;

        &:first-child {
          margin-left: 100px;
        }

        >a {
          font-size: 14px;
          font-weight: bold;
          color: #999;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .tips {
    font-family: PingFangSC-Regular;
    color: #ffffff;
    background: #2A2A2A;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    width: 100%;
    cursor: pointer;
  }

  .scroll-wrap {
    /* width: 1024px;
    margin: 0 auto; */
    overflow: hidden;
    height: 40px;
    width: 100%;
    cursor: pointer;
    /* padding-left: 300px; */
  }

  .scroll-content {
    position: relative;
    transition: left 0.5s;
    width: 2000px;
  }

  .scroll-content li {
    display: inline-block;
    /* margin-right: 1024px; */
  }

  .scroll-item-text {
    font-size: 14px;
    color: #ffffff;
  }

  .clearfix:after {
    content: ". ";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 266px;
    margin: 0;
  }

  .b1 {
    background: chartreuse;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .b2 {
    background-image: url("../assets/img/Banner.png ");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .b3 {
    background: burlywood;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
<style lang="scss">
  .full {
    width: 100%;
    overflow: hidden;
    min-width: 1000px;
  }

  .swiper-content {
    width: 1024px;
    margin: 0 auto;
    position: relative;
  }

  /* @media screen and (min-width:1400px) {
    .swiper-content {
      width: 1200px;
    }
  }

  @media screen and (min-width:1660px) {
    .swiper-content {
      width: 1460px;
    }
  } */

  .cover-left {
    width: 2000px;
    position: absolute;
    left: -2000px;
    top: 0;
    opacity: 0.7;
    background: #000;
    height: 300px;
    z-index: 10;
  }

  .cover-right {
    width: 2000px;
    position: absolute;
    right: -2000px;
    top: 0;
    background: #000;
    opacity: 0.7;
    height: 300px;
    z-index: 10;
  }

  #mySwiper.swiper-container {
    overflow: visible;
    height: 300px;

    .swiper-slide {
      height: 300px;
      position: relative;
      cursor: pointer;

      img {
        max-width: 100%;
        width: 100%;
        height: 100%;
        // opacity: 0.7;
        -webkit-transition: all linear 300ms;
        transition: all linear 300ms;
      }

      a {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
        background-size: cover;
        text-decoration: none;
        cursor: pointer;
      }

      a:hover img {
        opacity: 1;
      }
    }

    .my-bullet {
      width: 40px;
      height: 6px;
      text-align: center;
      line-height: 9px;
      font-size: 12px;
      color: #000;
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: inline-block;
      margin: 0 5px;
    }

    .my-bullet-active {
      color: #fff;
      background: #f4f4f4;
    }
  }

  .arrow-left {
    background: url("../assets/img/arrows.png") no-repeat left top;
    position: absolute;
    left: -40px;
    top: 50%;
    margin-top: -40px;
    width: 35px;
    height: 80px;
    z-index: 15;
    outline: none;
  }

  .arrow-right {
    background: url("../assets/img/arrows.png") no-repeat right top;
    position: absolute;
    right: -40px;
    top: 50%;
    margin-top: -40px;
    width: 35px;
    height: 80px;
    z-index: 15;
    outline: none;
  }
</style>