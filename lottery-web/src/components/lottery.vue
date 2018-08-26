<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'lottery',
  data() {
    return {
      gameid: '',
      p_code: 'ssc',
      s_code: 'cqssc',
    }
  },
  mounted() {
    this.loadRoute();
  },
  watch: {
    '$route' (to, from) {
      let t_s_code = to.query.s_code;
      let f_s_code = from.query.s_code;
      this.loadRoute();
      // console.log('to------',to)
      // console.log('from------',from)
    }
  },
  methods: {
    loadRoute() {
      const vm = this;
      vm.gameid = vm.$route.query.id;
      vm.p_code = vm.$route.query.p_code;
      vm.s_code = vm.$route.query.s_code;
      // if(vm.s_code === 'plw'){
        vm.$router.push({
          name: vm.s_code,
          query: {
            id: vm.gameid,
            p_code: vm.p_code,
            s_code: vm.s_code
          }
        })
      // }else{
      //   vm.$router.push({
      //     name: vm.p_code,
      //     query: {
      //       id: vm.gameid,
      //       p_code: vm.p_code,
      //       s_code: vm.s_code
      //     }
      //   })
      // }
    }
  }
}
</script>

