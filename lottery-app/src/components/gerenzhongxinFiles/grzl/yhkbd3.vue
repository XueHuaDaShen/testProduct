<template>
  <div class="yhkbd1-wrap">
    <div class="bind-yhk-step">
      <p class="active"></p>
      <p class="active"></p>
      <span class="step-one active">1</span>
      <span class="step-two active">2</span>
      <span class="step-three active">3</span>
    </div>
    <div class="step-one-title">3、绑定结果</div>
    <div class="bind-result-wrap">
      <p class="bind-result-title">恭喜你，你的尾号 {{bank_num}} 银行卡绑定成功。</p>
      <div class="bank-card-icon">
        <img :src="$store.state.productPath+bank_bj+'.png'" alt="" v-if="bank_bj">
        <!-- <p class="bank-name">{{bank_name}}</p> -->
        <!-- <p class="bank-type">{{bank_type}}</p> -->
        <p class="bank-num"><span>****</span> <span>****</span> <span>****</span><span>{{bank_num}}</span></p>
      </div>
    </div>
    <button class="submit-btn" @click="toBankManager">银行卡管理</button>
  </div>
</template>
<script>
export default {
  name: 'yhkbd1',
  data() {
    return {
      bankList1: [
        {title: '请选择性别', val: ''},
        {title: '男', val: '男'},
        {title: '女', val: '女'},
      ],
      bankList2: [
        {title: '请选择性别', val: ''},
        {title: '男', val: '男'},
        {title: '女', val: '女'},
      ],
      cityList: [
        {title: '请选择性别', val: ''},
        {title: '男', val: '男'},
        {title: '女', val: '女'},
      ],

      bank_bj: '',

      bank_name: '',
      bank_type: '',
      bank_num: '',
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '银行卡绑定');
    let query = this.$route.query;
    this.bank_name = query.bank;
    this.bank_type = query.type;
    this.bank_num = query.num;
    this.bank_bj = query.code;
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    handleGetSelected(val) {
      // console.log(val)
    },
    toBankManager() {
      this.$router.replace({
        name: 'yhkgl'
      })
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.yhkbd1-wrap{
  .bind-yhk-step{
    width:6.9rem;
    height: .5rem;
    margin:.3rem;
    display:-webkit-box;
    -webkit-box-align:center;
    position: relative;
    p{
      display:block;
      width:50%;
      height:.1rem;
      background:#DBDBDB;
    }
    p.active{
      background:#C83C4A;
    }
    span{
      position: absolute;
      width:.5rem;
      height:.5rem;
      background:#777;
      border-radius:50%;
      top:0;
      text-align:center;
      line-height:.5rem;
    }
    span.active{
      background:#C83C4A;
    }
    span.step-one{
      left:0;
    }
    span.step-two{
      left:50%;
      margin-left:-.25rem;
    }
    span.step-three{
      right:0;
    }
  }
  .step-one-title{
    width:100%;
    height:.45rem;
    text-align:center;
    line-height:.45rem;
    margin-bottom:.6rem;
    font-size:.32rem;
  }
  .bind-result-wrap{
    width:100%;
    p.bind-result-title{
      font-size:.32rem;
      color:#C83C4A;
      text-align:center;
      margin-bottom:.3rem;
    }
    .bank-card-icon{
      width:5.98rem;
      height:3.77rem;
      margin-left:.76rem;
      border-radius:.2rem;
      background:#C83C4A;
      position: relative;
      img{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
      }
      p.bank-num{
        position: absolute;
        width:100%;
        left:0;
        top:50%;
        z-index:1;
        text-align:center;
        span{
          margin-left:.4rem;
          font-size:.42rem;
          &:first-child{
            margin-left:0;
          }
        }
      }
    }
  }
  button.submit-btn{
    display:block;
    width:4.4rem;
    height:.8rem;
    background: #C83C4A;
    border-radius: .08rem;
    margin-top:1.2rem;
    margin-left:1.55rem;
    font-size:.32rem;
    line-height:.8rem;
  }
}
</style>


