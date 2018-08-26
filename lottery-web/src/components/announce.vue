<template>
  <div class="announce-wrap">
    <div class="header">
      <div class="title">
        <span class="v-line"></span>
        <span class="text">中奖公告</span>
      </div>
    </div>
    <div class="main">
      <!-- <scoll :data="items" :class-option="classOption" class="scroll-wrap" v-show="!noResult">
        <ul class="scroll-content">
          <li v-for="(item,index) in items" :key="index">
            <span>{{item.loginname | filterName}}&nbsp;恭喜赢得奖金{{formatMoney(item.award_cash)}}元</span>
          </li>
        </ul>
      </scoll> -->
      <div class="swiper-container" id="a_swiper" v-show="!noResult" style="height:100%">
        <ul class="swiper-wrapper scroll-content">
          <li class="swiper-slide" v-for="(item,index) in items" :key="index">
            <span>{{item.loginname | filterName}}&nbsp;恭喜赢得奖金{{formatMoney(item.award_cash)}}元</span>
          </li>
        </ul>
      </div>
      <p v-show="noResult" class="no-result">暂无数据</p>
    </div>
  </div>
</template>
<script>
  import Scroll from 'vue-seamless-scroll';
  import request from '../axios/axios.js';
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.css';
  export default {
    components: {
      scoll: Scroll
    },
    data() {
      return {
        items: [],
        noResult: false,
        a_swiper: null
      };
    },
    methods: {
      getData() {
        let self = this;
        self.loading = true;
        request.http('get', '/lottery/issue/latest/award', {},
          (success) => {
            self.loading = false;
            if (success.returncode == 200) {
              if (success.data.length != 0) {
                self.items = success.data;
                self.noResult = false;
                self.$nextTick(function() {
                  self.swiperInit()
                })
              } else {
                self.items = [];
                self.noResult = true;
              }
            } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          (error) => {
            self.items = [];
            self.noResult = true;
            self.loading = false;
            console.log('获取用户信息失败', error)
          }
        )
      },
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2).toString();
        }
        return '0';
      },
      swiperInit() {
        let self = this;
        this.a_swiper = new Swiper('#a_swiper', {
          direction: 'vertical',
          loop: true,
          speed: 1000,
          onlyExternal: true,
          loopAdditionalSlides: 20,
          height: 56,
          autoplay: true,
          allowTouchMove: false,
        });
        this.a_swiper.el.onmouseover = function() {
          self.a_swiper.autoplay.stop();
        }
        this.a_swiper.el.onmouseleave = function() {
          self.a_swiper.autoplay.start();
        }
      }
    },
    filters: {
      filterName(str) {
        // console.log("start", str);
        let strLength = str.split('').length;
        // let starNum = str.length - 3;
        let starStr = "***";
        // for (let i = 0; i < starNum; i++) {
        //   starStr += "*";
        // }
        let final = str.substr(0, 2) + starStr + str.substr(strLength - 1, strLength);
        // console.log('final', final);
        return final;
      }
    },
    mounted() {
      this.getData();
      // let items = this.items;
      // this.items = this.items.concat(items);
    },
  };
</script>
<style scoped>
  .no-result {
    margin-top: 30px;
    text-align: center;
    width: 100%;
    color: #191919;
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
    /* transition: top 0.5s; */
  }

  .scroll-content li {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
  }

  .announce-wrap {
    float: right;
    width: 280px;
    height: 530px;
    margin-top: 20px;
    background: #F4F4F4;
  }

  .announce-wrap:hover {
    box-shadow: 0 2px 4px #000;
  }

  .announce-wrap .header {
    height: 65px;
    padding: 20px;
    background-size: 100% 100%Z;
    background: #F4F4F4;
    border-bottom: 1px solid #ddd;
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

  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #BD8454;
  }

  .title .text {
    vertical-align: middle;
    display: inline-block;
    font-weight: 700;
  }

  .title .en {
    vertical-align: middle;
    display: inline-block;
    margin-left: 5px;
  }

  .announce-wrap .main {
    width: 100%;
    height: 465px;
    padding: 0 20px 20px;
  }

  .announce-wrap .main span {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.75px;
  }

  .announce-wrap .main li {
    list-style: none;
    text-align: left;
  }

  /* .announce-wrap .main li:first-child {
    padding-top: 0;
  } */

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>