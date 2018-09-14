<template>
  <div class="liveVideo-wrap">
    <div class="liveVideoList">
      <dl>
        <dt class="agsx-dt">
          <span>开元棋牌</span>
        </dt>
        <dd>最好玩的棋牌游戏</dd>
        <dd class="beginBtn" @click="startGame">立即开始</dd>
      </dl>
      <div class="split-bar"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'liveVideo',
  data() {
    return {}
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    startGame() {
      this.$router.push({
        name: 'chessBoard'
      })
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
        background:url('../../assets/h5-img/sort3.png') no-repeat;
        background-size:100% 100%;
      }
      dt.bbinyxg-dt{
        background:url('../../assets/h5-img/bbinyxg.png') no-repeat;
        background-size:100% 100%;
      }
      dt.igyxg-dt{
        background:url('../../assets/h5-img/igyxg.png') no-repeat;
        background-size:100% 100%;
      }
      dd{
        margin-top:.2rem;
      }
      dd.beginBtn{
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
      dd.noActive{
        background:#ccc;
        color:#646464;
      }
    }
  }
}
</style>


