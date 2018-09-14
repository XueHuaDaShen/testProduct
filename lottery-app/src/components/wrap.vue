<template>
  <div id="app-wrap">
    <myHeader class="myHeader" :style="{zIndex: getShowHeader?10:1}" @showPlayModeDialog="handleShowPlayModeDialog"></myHeader>
    <main class="myMain">
      <!-- <transition :name="transitionName"> -->
        <router-view class="public-wrap"/>
      <!-- </transition> -->
    </main>
    <myFooter class="myFooter" v-if="showFooter"></myFooter>
    <div class="play-mode-dialog" :class="showPlayModeDialog?'showPlayModeDialog':''" @click="handleHidePlayModeDialog">
      <div class="dialog-bj"></div>
      <div class="dialog-content">
        <div class="play-wrap">
          <h3>玩法选择</h3>
          <div class="select-play">
            <span v-for="(play, pi) in playData" :key="pi" :class="play.checked?'active':''" @click="handleSelectPlay($event, play)">{{play.title}}</span>
          </div>
          <div class="split-bar"></div>
          <div style="-webkit-box-flex:1;overflow-y:auto;padding-bottom:.3rem;">
            <div class="select-type" v-if="type.show" v-for="(type, ti) in typeData" :key="ti">
              <h4>{{type.title}}：</h4>
              <ul>
                <li v-if="item.show" v-for="(item, index) in type.data" :key="index.toString()" :class="item.checked?'active':''" @click="handleSelectType($event, item, typeData)">{{item.title}}</li>
              </ul>
            </div>
          </div>
        </div>
        <span class="play-confirm-btn" @click="handleSelectConfirm($event)">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import myHeader from "./header";
import myFooter from "./footer";
import request from '@/axios/axios';
export default {
  name: 'wrap',
  components: {
    myHeader,
    myFooter
  },
  data() {
    return {
      showPlayModeDialog: false, // 是否显示弹框
      playData: [], // 玩法数据 五星, 四星, ...
      typeData: [], // 类型数据 直选复式, 直选组合, ...
      lottery3id: '', // 玩法id, 五星, 四星, 三星 ...
      lottery3name: '', // 玩法名称
      lotteryid: '', // 投注方式id, 直选复式, 直选组合, 组选, ...
      lotteryname: '', // 投注方式名称
      isOk: false, // 是否选择了 完整的玩法
      copyItem: null, // 保留要更新的数据
      transitionName: ''
    }
  },
  computed: {
    showFooter() {
      return this.$store.state.showFooter;
    },
    getPlayData() {
      return this.$store.state.playData;
    },
    getShowHeader() {
      return this.$store.state.showHeader;
    }
  },
  created() {
    // console.log(this.showFooter)
  },
  methods: {
    //获取个人资料
    getUserProfile() {
      const vm = this;
      request.http(
        'get',
        '/user/profile',
        {},
        (success) => {
          if(success.returncode && success.returncode == 200){
            let blance = success.data.cash;
            localStorage.setItem('blance', blance);
            vm.$store.dispatch('setBlance', blance)
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 隐藏弹框
    handleHidePlayModeDialog() {
      this.showPlayModeDialog = false;
    },
    // 选择玩法
    handleSelectPlay(e, play) {
      e.stopPropagation();
      this.lottery3id = play.lottery3id;
      this.lottery3name = play.title;
      this.playData.filter(v => {
        v.checked = false;
      })
      play.checked = true;
      this.isOk = false;
      this.typeData = play.value;
    },
    // 选择类型
    handleSelectType(e, item, arr) {
      e.stopPropagation();
      arr.filter(v => {
        v.data.filter(k => {
          k.checked = false;
        })
      })
      item.checked = true;
      this.lotteryid = item.lotteryid;
      this.lotteryname = item.title;
      this.isOk = true;
      this.copyItem = item;
    },
    // 确认选择
    handleSelectConfirm(e) {
      e.stopPropagation();
      this.showPlayModeDialog = false;
      if(this.isOk){
        this.$store.dispatch('setBetsData', this.copyItem);
        this.$store.dispatch('setBets', 0);
        this.$store.dispatch('setMultiple', 1);
        this.$store.dispatch('setShowLotteryComponents', false);
        this.$store.dispatch('setPlayName', [ [this.lottery3name, this.lotteryname], [this.lottery3id, this.lotteryid] ])
      }
    },
    // 设置 玩法选项、类型选项 的状态
    setOptionsStatus(arr, playName) {
      const vm = this;
      this.lottery3id = playName[1][0];
      this.lotteryid = playName[1][1];
      arr.filter(v => {
        v.checked = false;
        if(v.lottery3id === vm.lottery3id){
          v.checked = true;
          vm.typeData = v.value;
        }
        v.value.filter(k => {
          k.data.filter(m => {
            m.checked = false;
            if(m.lotteryid === this.lotteryid){
              m.checked = true;
            }
          })
        })
      })
    },
    // 显示玩法弹框的事件
    handleShowPlayModeDialog() {
      this.playData = this.$store.state.playData;
      let playName = this.$store.state.playName;
      this.lottery3name = playName[0][0]
      this.lotteryname = playName[0][1]
      let data = [];
      this.setOptionsStatus(this.playData, playName)
      this.isOk = false;
      this.showPlayModeDialog = true;
    },
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      // console.log(to,from)
      this.getUserProfile();
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.transitionName = 'slide-left';
      }else{
        this.transitionName = 'slide-right';
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/publicStyle.scss';
button{
  color:#c7c7c7;
  font-size:.28rem;
  border:none;
  outline: none;
}
a{
  color:#c7c7c7;
  text-decoration: none;
}
.lim_m_b{
  bottom:105px;
}
#app-wrap{
  width:100%;
  height:100%;
  background: #1E1E28;
  color:#c7c7c7;
  font-size:.28rem;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  position: relative;
  button.disabled-btn{
    background: #666;
  }
  .slide-down-em-white{
    background:url('../assets/h5-img/down-white-sanjiao.png') no-repeat;
    background-size:100% 100%;
  }
  .option-view-input{
    overflow: hidden;
    padding-right:.7rem;
  }
  .public-wrap{
    width:100%;
    height:100%;
    padding-top:.88rem;
    padding-bottom:.98rem;
    overflow-y:auto;
  }
  .myHeader{
    position: fixed;
    left:0;
    top:0;
    z-index:10;
    background: #1E1E28;
  }
  .myFooter{
    position: fixed;
    left:0;
    bottom:0;
    z-index:10;
    background: #1E1E28;
  }
  .myMain{
    width:100%;
    height:100%;
    // -webkit-box-flex:1;
    // overflow-y:auto;
    overflow:hidden;
    position: relative;
    // top:-.88rem;
    top:0;
    left:0;
    z-index:5;
  }
  .play-mode-dialog{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:0;
    transition:all .3s;
    z-index:20;
    .dialog-bj{
      position: absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      opacity: 0.5;
      background: #000000;
    }
    .dialog-content{
      position: absolute;
      left:0;
      bottom:0;
      width:100%;
      height:10.44rem;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      color: #C7C7C7;
      .play-wrap{
        -webkit-box-flex:1;
        // padding-bottom:.3rem;
        overflow:hidden;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        background: #1E1E28;
        h3{
          padding:.3rem 0;
          font-size: .36rem;
          text-align:center;
          font-weight:500;
        }
        .select-play{
          display:flex;
          flex-wrap:wrap;
          // padding-bottom:.1rem;
          span{
            float:left;
            width:1.5rem;
            height:.68rem;
            background: #292932;
            border: .02rem solid #303040;
            border-radius: .08rem;
            text-align:center;
            line-height:.68rem;
            margin-left:.3rem;
            margin-bottom:.3rem;
          }
          span.active{
            background:yellow;
            color:#000;
          }
        }
        .select-type{
          padding:.3rem;
          padding-bottom:0;
          padding-right:0;
          h4{
            font-size:.32rem;
          }
          ul{
            display:flex;
            flex-wrap:wrap;
            li{
              padding:.14rem .28rem;
              background: #292932;
              border: .02rem solid #303040;
              border-radius: .08rem;
              margin-right:.3rem;
              margin-top:.3rem;
              // font-size:.28rem;
            }
            li.active{
              background:yellow;
              color:#000;
            }
          }
        }
      }
      .play-confirm-btn{
        display:block;
        width:100%;
        height:.98rem;
        text-align:center;
        line-height:.98rem;
        background: #C83C4A;
        font-size:.32rem;
        font-weight:bold;
      }
    }
  }
  .showPlayModeDialog{
    height:100%;
  }


}
.left-sanjiao{
  position: absolute;
  width:.2rem;
  height:.36rem;
  z-index:6;
  left:.3rem;
  bottom:.22rem;
  background:url('../assets/h5-img/left_jiantou.png') no-repeat;
  background-size:100% 100%;
}
.right-sanjiao{
  position: absolute;
  width:.15rem;
  height:.27rem;
  z-index:6;
  right:.3rem;
  bottom:.4rem;
  background:url('../assets/h5-img/right_jiantou.png') no-repeat;
  background-size:100% 100%;
}
.down-sanjiao{
  position: absolute;
  width:.27rem;
  height:.15rem;
  z-index:6;
  right:0;
  bottom:.45rem;
  background:url('../assets/h5-img/down_jiantou.png') no-repeat;
  background-size:100% 100%;
}
  
.public-search-copy-header{
  width:100%;
  height:.88rem;
  position: fixed;
  left:0;
  top:0;
  z-index:20;
  background:#1E1E28;
  font-size:.36rem;
  text-align:center;
  line-height: .88rem;
  border-bottom:.01rem solid #333;
  .back{
    // @include backSanjiao(.3rem, .3rem, #E1C79B, .04rem, -135deg);
    // @include backSanjiao(.3rem, .3rem, #c7c7c7, .04rem, -135deg);
    // left:.3rem;
    // bottom:.3rem;
    position: absolute;
    width:.2rem;
    height:.36rem;
    z-index:6;
    left:.3rem;
    bottom:.22rem;
    background:url('../assets/h5-img/left_jiantou.png') no-repeat;
    background-size:100% 100%;
  }
  .search{
    position: absolute;
    right:.3rem;
    bottom:.2rem;
    color:#C83C4A;
    font-size:.28rem;
    line-height: .4rem;
  }
}
.public-search-list-wrap-ul{
  margin-bottom:.3rem;
  li{
    height:1rem;
    background: #292932;
    position: relative;
    display:-webkit-box;
    -webkit-box-align:center;
    border-bottom:.01rem solid #333;
    span{
      display:block;
      margin-left:.3rem;
    }
    .select-wrap{
      -webkit-box-flex:1;
      height:100%;
      position: relative;
    }
    em{
      position: absolute;
      width:.243rem;
      height:.163rem;
      background:#c7c7c7;
      right:.309rem;
      top:.357rem;
    }
    input{
      display:block;
      -webkit-box-flex:1;
      height:100%;
      padding-right:.3rem;
      padding-left:.1rem;
      outline: none;
      border: none;
      background: none;
      color:#c7c7c7;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #646464;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #646464;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #646464;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #646464;
    }
  }
}
h2.search-title-wrap{
  height:1.05rem;
  display:-webkit-box;
  -webkit-box-pack:start;
  -webkit-box-align:center;
  text-align:left;
  font-size:.32rem;
  em{
    display:block;
    width:.08rem;
    height:.36rem;
    background:#c7c7c7;
    margin-left:.3rem;
    margin-right:.16rem;
    margin-top:.03rem;
  }
}
.public-search-table{
  width:100%;
  // -webkit-box-flex:1;
  max-height:8rem;
  overflow-y:auto;
  table{
    width:100%;
    table-layout:fixed;
    border-collapse: collapse;
    thead{
      width:100%;
      background:#292932;
      td{
        text-align:center;
        font-size:.24rem;
        padding:.28rem 0;
      }
    }
    tbody{
      td{
        padding:.2rem 0;
        text-align:center;
        border-bottom:.01rem solid #333;
        word-wrap:break-word;
      }
      .empty-data{
        text-align:center;
        padding:.28rem 0;
      }
    }
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
