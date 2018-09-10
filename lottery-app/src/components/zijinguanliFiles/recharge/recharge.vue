<template>
  <div class="recharge-wrap">
    <div class="recharge-kind" v-for="(recharge, ri) in rechargeList" :key="ri" v-if="showRechargeList">
      <h2 class="recharge-title-wrap"><em></em>{{recharge.name}}</h2>
      <ul>
        <router-link v-for="(kind, ki) in recharge.list" :key="ki.toString()" :to="{name: recharge.url, query:{kindCode: kind.code, id: kind.id}}">
          <li v-if="kind.show">{{kind.name}}</li>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
export default {
  name: 'recharge',
  components: {},
  data() {
    return {
      showRechargeList: false,
      rechargeList: [
        {
          name: '快捷支付',
          url: 'bankCard',
          list: [
            {name: '银行卡转账', url: 'bankCard', code: 'yhkzz', show: false},
            {name: '网银快捷', url: 'bankCard', code: 'wykj', show: false},
            {name: '银联快捷', url: 'qrCode', code: 'ylzz', show: false}
          ]
        },
        {
          name: '扫码支付',
          url: 'qrCode',
          list: [
            {name: '支付宝扫码', url: 'qrCode', code: 'zfbsm', show: false},
            {name: '微信扫码', url: 'qrCode', code: 'wxsm', show: false},
            {name: '银联扫码', url: 'qrCode', code: 'ylsm', show: false}
          ]
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '充值');
    this.getRechargeType()
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    handleGetSelected(val) {
      // console.log(val)
    },
    // 获取充值渠道
    getRechargeType() {
      const vm = this;
      vm.$store.dispatch('setLoading', true);
      request.http(
        'get',
        '/user/trade/recharge/account',
        {
          platform: 'app'
        },
        (success) => {
          vm.$store.dispatch('setLoading', false);
          // console.log(success)
          if(success.returncode === 200){
            // vm.tableData = success.data.data
            vm.formatData(success.data)
            // vm.showSelect = true;
          }
        },
        (error) => {
          vm.$store.dispatch('setLoading', false);
        }
      )
    },
    // 格式化数据
    formatData(data) {
      let arr1 = [], arr2 = [];
      data.filter(v => {
        if(v.type == 1){
          arr1.push(v);
        }else{
          arr2.push(v);
        }
      })
      this.setRanderDataList(arr1, 0)
      this.setRanderDataList(arr2, 1)
      this.showRechargeList = true;
      // console.log(arr1, arr2)
    },
    // 设置渲染列表
    setRanderDataList(data, index) {
      const vm = this;
      data.sort((a, b) => {
        return a.order-b.order;
      })
      data.filter((v, vi) => {
        vm.rechargeList[index].list[vi].name = v.name;
        vm.rechargeList[index].list[vi].id = v._id;
        vm.rechargeList[index].list[vi].show = true;
      })
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.recharge-wrap{
  .recharge-kind{
    width:100%;
    ul{
      width:6.9rem;
      margin:0 .3rem;
      li{
        width:100%;
        height:1.05rem;
        background: #292932;
        border: .02rem solid #303040;
        border-radius: .08rem;
        line-height:1.05rem;
        text-align:center;
        font-size:.32rem;
        margin-bottom:.3rem;
      }
    }
  }
  h2.recharge-title-wrap{
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
}
</style>


