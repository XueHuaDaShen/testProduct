<template>
  <div class="lottery-wrap">
    <div class="cue">
      <h3>重庆时时彩:</h3>
      <div class="lottery-num" v-if="showLotteryNum">
        <em v-for="(num, ni) in lastLotteryNumber.split(',')" :key="ni">{{num}}</em>
        <router-link :to="{ name: 'betsView', query:{id: '5b03b1911279962a87186abc', code: 'ssc'} }"><span>来一注</span></router-link>
      </div>
    </div>
    <div class="lotteryList" v-for="(item, index) in lotteryList" :key="index">
      <div class="split-bar"></div>
      <div class="nav-bar">
        <span :class="'l-'+(index+1)">{{setTagText(item.name.charAt(0))}}</span>
        <em>{{item.name}}</em>
      </div>
      <nav class="playList">
        <router-link v-for="(v, vi) in item.children" :key="vi.toString()" :to="{ name: item.code==='lhc'?'lhc':'betsView', query:{id: v._id, code: item.code==='qt'?v.code:item.code} }">{{v.name}}</router-link>
      </nav>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios';
export default {
  name: 'lottery',
  data() {
    return {
      lotteryList: [],
      lastLotteryNumber: '',
      showLotteryNum: false,
    }
  },
  created() {
    this.getLotteryList();
    this.newLotteryNum();
    this.$store.dispatch('setPlayName', [])
    this.$store.dispatch('setShoppingCartData', [])
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    getLotteryList() {
      const vm = this;
      vm.lotteryList = [];
      request.http(
        'get',
        '/lottery/game/list',
        {},
        (success) => {
          if (success.returncode && success.returncode == 200) {
            // vm.lotteryList = success.data;
            success.data.filter(v => {
              let arr = v.children.sort((a, b) => {return a.order-b.order})
              let o = new Object();
              for(let i in v){
                if(i === 'children'){
                  o.children = arr;
                }else{
                  o[i] = v[i];
                }
              }
              vm.lotteryList.push(o)
              // console.log(arr)
            })
            // vm.newLotteryNum(vm.lotteryList)
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    setTagText(val) {
      switch(val) {
        case '1': return '11';
        case 'P': return 'PK';
        case '其': return '幸';
        default: return val;
      }
    },
    // 获取最新的中奖号码
    newLotteryNum() {
      const vm = this;
      // console.log(new Date().getSeconds())
      request.http(
        'get',
        '/lottery/refresh', { gameid: '5b03b1911279962a87186abc' },
        (success) => {
          let code = success.returncode;
          if (code === 103 || code === 101 || code === 106) {
            request.loginAgain(vm)
          } else if (code === 200) {
            vm.lastLotteryNumber = success.data.issues[0].luck_no;
            vm.showLotteryNum = true;
          }
        },
        (error) => {
          console.log(error)
        }
      )

    },
  }
}
</script>
<style lang="scss" scoped>
.lottery-wrap{
  padding-bottom:.64rem;
  .cue{
    width:6.9rem;
    height:1.9rem;
    border:.01rem solid #333;
    border-radius:.08rem;
    margin:.3rem;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-pack:justify;
    h3{
      margin-left:.3rem;
      margin-top:.19rem;
    }
    .lottery-num{
      margin-bottom:.3rem;
      height:.64rem;
      display:-webkit-box;
      em,span{
        display:block;
      }
      em{
        width:.64rem;
        height:.64rem;
        background: #303040;
        line-height:.64rem;
        text-align:center;
        font-size:.4rem;
        font-style:normal;
        margin-left:.3rem;
        border-radius:50%;
      }
      span{
        width:1.4rem;
        height:.64rem;
        background:#CC3447;
        border-radius:.08rem;
        margin-left:.5rem;
        line-height:.64rem;
        text-align:center;
      }
    }
  }
  .lotteryList{
    .nav-bar{
      padding:.3rem;
      display:-webkit-box;
      -webkit-box-align:center;
      span{
        display:block;
        width:.45rem;
        height:.45rem;
        text-align:center;
        line-height:.45rem;
        color:#fff;
        border-radius:50%;
        font-size:.24rem;
      }
      em{
        display:block;
        margin-left:.1rem;
        font-style:normal;
        font-size:.32rem;
      }
      .l-1{
        background:#de4048;
      }
      .l-2{
        background:#8986fd;
      }
      .l-3{
        background:#fd6768;
      }
      .l-4{
        background:#fd6833;
      }
      .l-5{
        background:#415992;
      }
      .l-6{
        background:#f54878;
      }
    }
    .playList{
      width:100%;
      display:flex;
      flex-wrap:wrap;
      a{
        width:2.1rem;
        height:.64rem;
        background: #303040;
        border-radius: .08rem;
        margin-left:.3rem;
        margin-bottom:.3rem;
        overflow:hidden;
        position: relative;
        text-decoration: none;
        color:#c7c7c7;
        text-align:center;
        line-height:.64rem;
      }
    }
  }
}
</style>


