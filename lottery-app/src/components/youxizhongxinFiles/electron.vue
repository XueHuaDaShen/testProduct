<template>
  <div class="electron-wrap">
    <div class="electronList">
      <dl>
        <dt class="agdz-dt">
          <span>AG电子</span>
        </dt>
        <dd>人气爆棚，激情无限</dd>
        <!-- <button class="beginBtn noActive">即将上线</button> -->
        <button class="beginBtn" :disabled="isClick" @click="getLoginFormElectron">立即开始</button>
      </dl>
      <div class="split-bar"></div>
    </div>
    <div class="electronList">
      <dl>
        <dt class="agby-dt">
          <span>AG捕鱼</span>
        </dt>
        <dd>大鱼满屏，惊喜不断</dd>
        <!-- <button class="beginBtn noActive">即将上线</button> -->
        <button class="beginBtn" :disabled="isClick" @click="getLoginFormFish">立即开始</button>
      </dl>
      <div class="split-bar"></div>
    </div>
    <!-- <agGame v-if="formData" :formData="formData"></agGame> -->
    <!-- <div class="electronList">
      <dl>
        <dt class="byyxg-dt">
          <span>波音游戏馆</span>
        </dt>
        <dd>大鱼满屏，惊喜不断</dd>
        <dd class="beginBtn">立即开始</dd>
      </dl>
    </div> -->
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import agGame from './agGame'
export default {
  name: 'electron',
  components: {
    agGame
  },
  data() {
    return {
      isClick: false,
      formData: '',
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    // 电子
    getLoginFormElectron() {
      this.$router.push({
        name: 'agGame',
        query: {
          gameType: 'A00070'
        }
      })
      // const vm = this;
      // vm.isClick = true;
      // let url = "/ag/user/login";
      // request.http(
      //   "post",
      //   url, {gameType: 500},
      //   success => {
      //     vm.isClick = false;
      //     let code = success.returncode;
      //     // console.log('form----', success)
      //     if (code == 200) {
      //       vm.formData = success.data;
      //     } else if(code == 101 || code == 103 || code == 106) {
      //       request.loginAgain(vm)
      //     }
      //   },
      //   error => {
      //     vm.isClick = false;
      //   }
      // );
    },
    // 捕鱼
    getLoginFormFish() {
      this.$router.push({
        name: 'agGame',
        query: {
          gameType: 'A00012'
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.electron-wrap{
  .electronList{
    dl{
      width:6.9rem;
      height:2.1rem;
      margin:.3rem;
      border: .01rem solid #333333;
      border-radius: .08rem;
      position: relative;
      dt{
        width:2.1rem;
        height:100%;
        margin-right:.3rem;
        background: #292932;
        border-radius: .08rem;
        overflow:hidden;
        position: relative;
        float:left;
        span{
          display:block;
          width:2.1rem;
          height:.5rem;
          background:#303040;
          text-align:center;
          line-height:.5rem;
          position: absolute;
          left:0;
          bottom:0;
        }
      }
      dt.agdz-dt{
        background:url('../../assets/h5-img/sort1.png') no-repeat;
        background-size:100% 100%;
      }
      dt.agby-dt{
        background:url('../../assets/h5-img/agdz.png') no-repeat;
        background-size:100% 100%;
      }
      dt.byyxg-dt{
        background:url('../../assets/h5-img/byyxg.png') no-repeat;
        background-size:100% 100%;
      }
      dd{
        margin-top:.2rem;
      }
      button.beginBtn{
        position: absolute;
        width:1.52rem;
        height:.64rem;
        background: #CC3447;
        border-radius: .08rem;
        right:.3rem;
        bottom:.3rem;
        text-align:center;
        line-height:.64rem;
      }
      button.noActive{
        background:#ccc;
        color:#646464;
      }
    }
  }
}
</style>


