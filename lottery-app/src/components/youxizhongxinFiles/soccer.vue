<template>
  <div class="soccer-wrap">
    <div class="soccerList">
      <dl>
        <dt class="sbty-dt">
          <span>沙巴体育</span>
        </dt>
        <dd>最精彩的体育投注</dd>
        <dd class="beginBtn noActive">即将上线</dd>
      </dl>
      <div class="split-bar"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'soccer',
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
.soccer-wrap{
  .soccerList{
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
      dt.sbty-dt{
        background:url('/static/img/sort2.png') no-repeat;
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


