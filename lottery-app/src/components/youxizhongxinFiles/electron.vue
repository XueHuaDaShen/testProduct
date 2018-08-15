<template>
  <div class="electron-wrap">
    <div class="electronList">
      <dl>
        <dt class="agdz-dt">
          <span>AG电子</span>
        </dt>
        <dd>大鱼满屏，惊喜不断</dd>
        <dd class="beginBtn noActive">即将上线</dd>
      </dl>
      <div class="split-bar"></div>
    </div>
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
export default {
  name: 'electron',
  data() {
    return {}
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {},
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
        background:url('/static/img/sort1.png') no-repeat;
        background-size:100% 100%;
      }
      dt.byyxg-dt{
        background:url('/static/img/byyxg.png') no-repeat;
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


