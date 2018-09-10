<template>
  <div class="liveVideo-wrap">
    <div class="liveVideoList">
      <dl>
        <dt class="agsx-dt">
          <span>AG视讯</span>
        </dt>
        <dd>真人视讯现场，美女荷官</dd>
        <button class="beginBtn noActive">即将上线</button>
        <!-- <button class="beginBtn" :disabled="isClick" @click="getLoginForm">立即开始</button> -->
      </dl>
      <div class="split-bar"></div>
    </div>
    <!-- <agGame v-if="formData" :formData="formData"></agGame> -->
    <!-- <div class="liveVideoList">
      <dl>
        <dt class="bbinyxg-dt">
          <span>BBIN游戏馆</span>
        </dt>
        <dd>真人视讯现场，美女荷官</dd>
        <dd class="beginBtn" @click="onSubmit">立即开始</dd>
      </dl>
      <div class="split-bar"></div>
    </div>
    <div class="liveVideoList">
      <dl>
        <dt class="igyxg-dt">
          <span>IG游戏馆</span>
        </dt>
        <dd>真人视讯现场，美女荷官</dd>
        <dd class="beginBtn">立即开始</dd>
      </dl>
      <div class="split-bar"></div>
    </div> -->
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import agGame from './agGame'
export default {
  name: 'liveVideo',
  components: {
    agGame
  },
  data() {
    return {
      isClick: false,
      formData: ''
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    getLoginForm() {
      const vm = this;
      vm.isClick = true;
      let url = "/ag/user/login";
      request.http(
        "post",
        url, {gameType: 18},
        success => {
          vm.isClick = false;
          let code = success.returncode;
          console.log('form----', success)
          if (code == 200) {
            vm.formData = success.data;
          } else if(code == 101 || code == 103 || code == 106) {
            request.loginAgain(vm)
          }
        },
        error => {
          vm.isClick = false;
        }
      );
    }
  },
}
</script>
<style lang="scss" scoped>
.liveVideo-wrap{
  .liveVideoList{
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
      dt.agsx-dt{
        background:url('/static/img/sort1.png') no-repeat;
        background-size:100% 100%;
      }
      dt.bbinyxg-dt{
        background:url('/static/img/bbinyxg.png') no-repeat;
        background-size:100% 100%;
      }
      dt.igyxg-dt{
        background:url('/static/img/igyxg.png') no-repeat;
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


