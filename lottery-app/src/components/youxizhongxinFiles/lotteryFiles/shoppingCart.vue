<template>
  <div class="shoppingCart-wrap" style="padding-bottom:0;" @click="showRefundOptions=false">
    <div class="shopping-content">
      <ul class="shopping-list">
        <li v-for="(shop, si) in getShoppingCart" :key="si">
          <i @click="deleteCurrentItem(si)">×</i>
          <p class="bets-number">
            <span v-for="(n, ni) in shop.vote_no.split('|')" :key="ni">{{renderNumber(n)}}<em v-if="ni<shop.vote_no.split('|').length-1"></em></span>
          </p>
          <p class="bets-text">
            <span>{{shop.title}}</span>
            <span>{{shop.vote_num}}注 {{shop.multiple*multiple}}倍 {{((shop.vote_cash/shop.multiple) * (shop.multiple*multiple)).toFixed(2)}}元</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="shopping-footer">
      <div class="top">
        <div class="one">
          <div class="multiple">
            <em>倍数：</em>
            <p class="math-model">
              <span class="reduce" @click="handleReduceMultiple"><i class="hor"></i></span>
              <input type="text" v-model.trim="multiple" @blur="handleBlurMultiple" @focus="handleFocusMultiple">
              <span class="plus" @click="handlePlusMultiple"><i class="hor"></i><i class="ver"></i></span>
            </p>
          </div>
          <div class="chese-num">
            <em>追号：</em>
            <p class="math-model">
              <span class="reduce" @click="handleReduceChaseIssue"><i class="hor"></i></span>
              <input type="text" v-model.trim="chaseIssue" @blur="handleBlurChaseIssue" @focus="handleFocusChaseIssue">
              <span class="plus" @click="handlePlusChaseIssue"><i class="hor"></i><i class="ver"></i></span>
            </p>
          </div>
        </div>
        <div class="two">
          <div class="refund-wrap">
            <em>返点：</em>
            <p class="refund-p" :class="showRefundOptions?'showRefund':''" @click="handleShowRefundOptions($event)">
              <span>{{refundArr[rfIndex]}}</span>
              <em></em>
              <ul class="refund-options">
                <li :class="rfIndex===0?'active':''" @click="changeRefundValue(0, $event)">{{refundArr[0]}}</li>
                <li :class="rfIndex===1?'active':''" @click="changeRefundValue(1, $event)">{{refundArr[1]}}</li>
              </ul>
            </p>
          </div>
          <p class="lottery-stop">
            <input type="checkbox" id="is-hot" v-model="is_hit_stop">
            <i></i>
            中奖后停止追号
          </p>
        </div>
        <p class="user-blance">余额：¥ {{blance.toFixed(2)}}</p>
      </div>
      <div class="bot">
        <p>共追号 {{chaseIssue}} 期，共 {{getAllBets()}} 注   <span>¥ {{(getAllMoney()*chaseIssue*multiple).toFixed(2)}}</span></p>
        <button class="toBets" @click="toBets" :disabled="isClick">立即下注</button>
      </div>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <!-- <div class="alert-tip-text" v-if="issueChange">当前期号发生变化，请重新投注</div> -->
    <div class="alert-tip-text" v-if="issueChange" style="color:#C83C4A">请注意当前已进入下一期</div>
    
    <div class="confirm-bets-dialog" v-if="betsOk">
      <div class="dialog-content">
        <h2 class="dialog-title">投注结果<em class="close-em" @click="handleCloseSuccessDialog('betsOk')">×</em></h2>
        <p>
          恭喜您，投注成功！您可以点击
          <router-link :to="{name:'cpjl'}">
            “游戏记录”
          </router-link>
        </p>
        <router-link :to="{name:orderDetail,query:{id:betsId}}">
          <button class="confirm-to-bets">注单详情</button>
        </router-link>
      </div>
    </div>
    <div class="dialog-bj" v-if="betsOk"></div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import paramCryptFn from '@/assets/js/cryptData.js'
export default {
  name: 'shoppingCart',
  data() {
    return {
      countDownTime: '',
      liClass: 'shouye',
      orderDetail: 'betsDetail',
      isClick: false, // 双击
      betsNumber: [1234,1234,1234,1234,1234,1234,1234,1234,1234,1234,1234],
      blance: 0,
      multiple: 1, // 倍数
      maxMultiple: 20, // 最大倍数
      minMultiple: 1, // 最小倍数
      money: 0, // 金额
      price: 1, // 单价
      showRefundOptions: false, // 是否显示返点选项
      rfIndex: 1, // 返点索引
      refundArr: ['1800-7.58%', '1950-0%'], // 返点数组
      // getShoppingCart: this.$store.state.shoppingCartData, // 购彩篮数据
      chaseIssue: 1, // 追号期数
      maxChaseIssue: 120, // 最大追号期数
      minChaseIssue: 1, // 最小追号期数
      allBets: 1, // 当前总注数
      tipText: '',
      alertDur: 1.5, // 文本提示显示的时间 s
      issueChange: false, // 当前期号是否发生变化
      issueChangeTime: 3, // 期号变化弹框持续时间 s
      betsId: '',
      betsOk: false,
      is_hit_stop: 0,

      gameCode: '',
      gameid: '',
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setCleanBtn', true);
    this.$store.dispatch('setTitle', '购彩篮');
    this.blance = Number(localStorage.getItem('blance'));
    this.refundArr = this.$store.state.refundArr;
    // console.log(this.refundArr)
    this.gameCode = this.$route.query.gameCode;
    this.gameid = this.$route.query.gameid;
    this.getAllBets();
    this.newIssueInterval();
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {
    getShoppingCart() {
      return this.$store.state.shoppingCartData;
    },
    getIssue() {
      return this.$store.state.issue;
    }
  },
  watch: {
    '$getIssue' (o, n) {
      console.log(o,n)
      // this.$store.dispatch('setShoppingCartData', [])
      this.issueChange = true;
      const vm = this;
      setTimeout(()=>{
        vm.issueChange = false;
      },vm.issueChangeTime)
    }
  },
  methods: {
    newIssueInterval() {
      const vm = this;
      // console.log(new Date().getSeconds())
      request.http(
        'get',
        '/lottery/refresh', { gameid: vm.gameid },
        (success) => {
          // console.log(success);
          // console.log(new Date().getSeconds())
          let latestIssue = success.data.latestIssue;
          let code = success.returncode;
          if (code === 103 || code === 101 || code === 106) {
            request.loginAgain(vm)
          } else if (code === 200) {
            vm.$store.dispatch('setIssue', latestIssue.issue_no)
            vm.getCountDownTime(latestIssue.countdown);
            // localStorage.setItem('blance', success.data.cash);
          }
        },
        (error) => {
          console.log(error)
        }
      )

    },

    // 获取倒计时的开始时间
    getCountDownTime(s) {
      // let s = 499;
      // var t;
      if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        this.countDownTime = {hour, min, sec}
      }
      this.startTime()
      // return t;
    },
    // 开始计时
    startTime() {
      const vm = this;
      let {hour, min, sec} = this.countDownTime;
      let st = setInterval(() => {
        sec--;
        if(sec < 0 && min > 0){
          min--;
          sec = 59;
        }else if(min <= 0 && hour > 0){
          hour--;
          min = 59;
          sec = 59;
        }
        if(hour === 0 && min === 0 && sec === 0){
          clearInterval(st)
          // clearInterval(vm.myInterval);
          // vm.getNewIssue();
          vm.newIssueInterval();
        }
        this.countDownTime = {hour, min, sec};
      }, 1000)
    },
    // 删除购彩篮中某一条数据
    deleteCurrentItem(index) {
      this.getShoppingCart.splice(index,1)
      // console.log(this.getShoppingCart)
      // console.log(this.$store.state.shoppingCartData)
    },
    // 倍数聚焦
    handleFocusMultiple() {
      const vm = this;
      document.onkeyup = function() {
        vm.multiple = vm.multiple.toString().replace(/\D/g,function(){return ''})
        if(Number(vm.multiple) === 0){
          vm.multiple = 1;
        }else if (vm.multiple >= vm.maxMultiple) {
          vm.multiple = vm.maxMultiple
        }
        // console.log(vm.multiple)
      }
    },
    // 倍数失焦
    handleBlurMultiple() {
      document.onkeyup = null;
      if (this.multiple >= this.maxMultiple) {
        this.multiple = this.maxMultiple
      }
    },
    // 加减倍数
    handleReduceMultiple() {
      this.multiple--;
      if (this.multiple <= 0) {
        this.multiple = this.minMultiple
      }
    },
    handlePlusMultiple() {
      this.multiple++;
      if (this.multiple >= this.maxMultiple) {
        this.multiple = this.maxMultiple
      }
    },

    // 追号期数聚焦
    handleFocusChaseIssue() {
      const vm = this;
      document.onkeyup = function() {
        vm.chaseIssue = vm.chaseIssue.toString().replace(/\D/g,function(){return ''})
        if(Number(vm.chaseIssue) === 0){
          vm.chaseIssue = 1;
        }else if (vm.chaseIssue >= vm.maxChaseIssue) {
          vm.chaseIssue = vm.maxChaseIssue
        }
        // console.log(vm.chaseIssue)
      }
    },
    // 追号期数失焦
    handleBlurChaseIssue() {
      document.onkeyup = null;
      if (this.chaseIssue >= this.maxChaseIssue) {
        this.chaseIssue = this.maxChaseIssue
      }
    },
    // 加减追号期数
    handleReduceChaseIssue() {
      this.chaseIssue--;
      if (this.chaseIssue <= 0) {
        this.chaseIssue = this.minChaseIssue
      }
    },
    handlePlusChaseIssue() {
      this.chaseIssue++;
      if (this.chaseIssue >= this.maxChaseIssue) {
        this.chaseIssue = this.maxChaseIssue
      }
    },

    // 获取购彩篮总注数
    getAllBets() {
      let allBets = 0;
      this.getShoppingCart.filter(v => {
        allBets += Number(v.vote_num)
      })
      this.allBets = allBets;
      return this.allBets;
    },
    // 获取购彩篮总钱数
    getAllMoney() {
      let allPrice = 0;
      this.getShoppingCart.filter(v => {
        allPrice += Number(v.vote_cash)
      })
      return allPrice
    },

    // 投注号码显示样式
    renderNumber(num) {
      let s = '';
      if (this.gameCode === 'ssc') {
        if(num.indexOf('-') > -1){
          s = num.split('-').join(' ')
        }else{
          s = num.split('').join(' ')
        }
      } else {
        if(num.indexOf('-') > -1){
          s = num.split('-').join(' ')
        }else{
          s = num
        }
      }
      //  else if (this.gameCode === 'syxw') {
      //   if(num.indexOf('-') > -1){
      //     s = num.split('-').join(' ')
      //   }
      // } else if (this.gameCode === 'ks') {
      //   if(num.indexOf('-') > -1){
      //     s = num.split('-').join(' ')
      //   }
      // } else if (this.gameCode === 'pks') {
      //   if(num.indexOf('-') > -1){
      //     s = num.split('-').join(' ')
      //   }
      // }
      return s;
    },
    
    // 显示返点选项
    handleShowRefundOptions(e) {
      e.stopPropagation();
      this.showRefundOptions = !this.showRefundOptions;
    },
    // 设置返点
    changeRefundValue(val, e) {
      // e.stopPropagation();
      this.rfIndex = val;
    },
    handleCloseSuccessDialog(val) {
      this[val] = false;
      this.$store.dispatch('setHeader', true);
    },
    // 投注
    toBets() {
      const vm = this;
      vm.isClick = true;
      let betsMoney = (this.getAllMoney()*this.chaseIssue*this.multiple).toFixed(2);
      if(this.getShoppingCart.length === 0){
        return false;
      }
      if(this.blance < betsMoney){
        vm.tipText = '投注失败-余额不足';
        setTimeout(()=>{
          vm.tipText = '';
        },vm.alertDur*1000)
        this.isClick = false;
        return false;
      }
      if(this.chaseIssue > 1){
        this.orderDetail = 'chaseDetail';
        let arr = [];
        let type = 2; // 追号类型 1 利润率, 2 同倍, 3 翻倍; 默认2;
        let total_vote_cash = (this.getAllMoney()*this.chaseIssue*this.multiple).toFixed(2); // 注码总钱数
        let start_issue_no = this.$store.state.issue; // 开始期数
        let is_hit_stop = vm.is_hit_stop?1:0; // 追中及停 0 否, 1 是; 默认1;
        let refund = this.refundArr[this.rfIndex]; // 返点
        let issue_num = this.chaseIssue; // 追号期数
        let start_times = this.multiple; // 起始倍数
        let sum = this.getAllMoney(); // 购彩篮总钱数
        let chaseDetail = []; // 每注倍数集合
        // console.log(this.getShoppingCart)
        // console.log('投注')
        for(let i=0; i<issue_num; i++){
          chaseDetail.push(start_times);
        }
        this.getShoppingCart.filter(v => {
          let o = new Object();
          for(let i in v){
            if(i==='vote_cash'){
              o.vote_cash = (v.vote_cash/v.multiple) * (v.multiple*this.multiple);
            }else if(i==='multiple'){
              o.start_times = this.multiple;
            }else{
              o[i] = v[i]
            }
          }
          o.type = type;
          o.total_vote_cash = total_vote_cash;
          o.start_issue_no = start_issue_no;
          o.is_hit_stop = is_hit_stop;
          o.refund = refund;
          o.issue_num = issue_num;
          arr.push(o)
        })
        // console.log(arr)
        let param = {
          chaseList: arr,
          chaseDetail,
          sum
        }
        request.http(
          'post',
          '/lottery/chase/luckno',
          paramCryptFn(param),
          (success) => {
            vm.isClick = false;
            // console.log(success);
            let code = success.returncode;
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 304) {
              vm.tipText = '投注失败-余额不足';
              setTimeout(()=>{
                vm.tipText = '';
              },vm.alertDur*1000)
            } else if (code === 200) {
              // console.log()
              // vm.chaseSuccess = true;
              vm.$store.dispatch('setShoppingCartData', []);
              vm.chaseIssue = 1;
              vm.allBets = 0;
              vm.multiple = 1;
              vm.betsId = success.data.result[0]._id;
              vm.betsOk = true;
              vm.$store.dispatch('setHeader', false);
              vm.$store.dispatch('setBlance', success.data.cash);
              localStorage.setItem('blance', success.data.cash);
              // console.log(vm.$store)
            } else {
              alert(success.data.msg)
            }
          },
          (error) => {
            vm.isClick = false;
            console.log(error)
          }
        )
      }else{
        this.orderDetail = 'betsDetail';
        let arr = [];
        let issue_no = this.$store.state.issue; // 开始期数
        let refund = this.refundArr[this.rfIndex]; // 返点
        // console.log(this.getShoppingCart)
        // console.log('投注')
        this.getShoppingCart.filter(v => {
          let o = new Object();
          for(let i in v){
            if(i==='vote_cash'){
              o.vote_cash = (v.vote_cash/v.multiple) * (v.multiple*this.multiple);
            }else if(i==='multiple'){
              o.times = v.multiple*this.multiple;
            }else{
              o[i] = v[i]
            }
          }
          o.issue_no = issue_no;
          o.refund = refund;
          arr.push(o)
        })
        // console.log(arr)
        let param = {
          voteList: arr
        }
        // console.log(param)
        request.http(
          'post',
          '/lottery/issue/vote',
          paramCryptFn(param),
          (success) => {
            vm.isClick = false;
            // console.log(success);
            let code = success.returncode;
            
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 304) {
              vm.tipText = '投注失败-余额不足';
              setTimeout(()=>{
                vm.tipText = '';
              },vm.alertDur*1000)
            } else if (code === 200) {
              // console.log()
              // vm.betsDataList = success.data.data;
              // vm.betsSuccess = true;
              vm.$store.dispatch('setShoppingCartData', []);
              vm.chaseIssue = 1;
              vm.allBets = 0;
              vm.multiple = 1;
              // vm.handleClearChase();
              // vm.resetData();
              // vm.getBetsDataList();
              vm.betsId = success.data.result[0]._id;
              vm.betsOk = true;
              vm.$store.dispatch('setHeader', false);
              vm.$store.dispatch('setBlance', success.data.cash);
              localStorage.setItem('blance', success.data.cash);
              // console.log(vm.$store)
            } else {
              alert(success.data.msg)
            }
          },
          (error) => {
            vm.isClick = false;
            console.log(error)
          }
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.shoppingCart-wrap{
  position: relative;
  display:-webkit-box;
  -webkit-box-orient: vertical;
  width:100%;
  height:12.46rem;
  .math-model{
    width:2.42rem;
    height:100%;
    border-radius: .08rem;
    background: #1E1E28;
    overflow: hidden;
    display:-webkit-box;
    span{
      display:block;
      width:.68rem;
      position: relative;
      cursor: pointer;
      i{
        position: absolute;
        background:#c7c7c7;
        border-radius:1rem;
      }
      i.hor{
        width:.28rem;
        height:.04rem;
        left:.2rem;
        top:.32rem;
      }
      i.ver{
        width:.04rem;
        height:.28rem;
        top:.2rem;
        left:.32rem;
      }
    }
    input{
      display:block;
      height:100%;
      -webkit-box-flex:1;
      border:none;
      outline: none;
      text-align:center;
      padding:0 .2rem;
      font-size:.32rem;
      background: #1E1E28;
      border-left:.01rem solid #292932;
      border-right:.01rem solid #292932;
      color:#c7c7c7;
    }
  }
  .shopping-content{
    // height:8.72rem;
    -webkit-box-flex:1;
    overflow-y:auto;
    .shopping-list{
      padding:.3rem;
      li{
        width:100%;
        min-height:1.73rem;
        padding-left:.3rem;
        padding-right:.75rem;
        border: .01rem solid #333333;
        border-radius: .08rem;
        position: relative;
        color:#939DB8;
        margin-bottom:.3rem;
        &:last-child{
          margin-bottom:0;
        }
        i{
          position: absolute;
          width:.396rem;
          height:.396rem;
          color:#646464;
          text-align:center;
          line-height:.396rem;
          right:.34rem;
          top:.662rem;
          font-size:.6rem;
        }
        .bets-number{
          margin-top:.3rem;
          margin-bottom:.2rem;
          font-size:.38rem;
          min-height:.53rem;
          line-height:.53rem;
          color:#939DB8;
          span{
            display:inline-block;
          }
          em{
            display:inline-block;
            width:1px;
            height:.3rem;
            background:#646464;
            margin:0 .1rem;
          }
        }
        .bets-text{
          margin-bottom:.3rem;
        }
      }
    }
  }
  .shopping-footer{
    height:3.74rem;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    .top{
      height:2.76rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-pack:center;
      .two{
        margin:.2rem 0;
      }
      .multiple, .chese-num, .refund-wrap{
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:justify;
        height:.68rem;
        em{
          display: block;
          font-style:normal;
          line-height: .68rem;
        }
      }
      .multiple{
        float:left;
        margin-left:.3rem;
      }
      .chese-num{
        float:right;
        margin-right:.3rem;
      }
      .refund-wrap{
        float:left;
        margin-left:.3rem;
        .refund-p{
          width:2.42rem;
          height:100%;
          border-radius: .08rem;
          line-height:.68rem;
          background: #1E1E28;
          display:-webkit-box;
          position: relative;
          span{
            width:1.74rem;
            border-right:.01rem solid #292932;
            display:block;
            text-align:center;
            line-height:.68rem;
            font-size:.32rem;
          }
          em{
            display:inline-block;
            width:.2rem;
            height: .12rem;
            background:#c7c7c7;
            margin-left:.22rem;
            margin-bottom:.04rem;
          }
          .refund-options{
            position: absolute;
            bottom:0;
            left:0;
            width:100%;
            height:0;
            transition: all .3s;
            background:#fff;
            color:#191919;
            border-radius:.08rem;
            overflow:hidden;
            text-align:center;
            li.active{
              background: #ccc;
            }
          }
        }
        p.showRefund{
          .refund-options{
            height:1.36rem;
            transition: all .3s;
          }
        }
      }
      .lottery-stop{
        color:#646464;
        float:right;
        margin-right:.76rem;
        height:.4rem;
        line-height:.4rem;
        margin-top:.14rem;
        position: relative;
        #is-hot{
          position: absolute;
          left:0;
          top:.06rem;
          width:.28rem;
          height:.28rem;
          opacity: 0;
        }
        #is-hot:checked+i{
          background:url('/static/img/check_box_ed.png') no-repeat;
          background-size:100% 100%;
        }
        i{
          display:block;
          float: left;
          width:.28rem;
          height:.28rem;
          margin-right:.1rem;
          background:url('/static/img/check_box.png') no-repeat;
          background-size:100% 100%;
          margin-top:.06rem;
        }
      }
      p.user-blance{
        // float: left;
        margin-left:.3rem;
        height:.4rem;
        color:#646464;
      }
    }
    .bot{
      -webkit-box-flex:1;
      p{
        float: left;
        margin-left:.3rem;
        margin-top:.3rem;
        span{
          color:#C83C4A;
        }
      }
      .toBets{
        float:right;
        width:1.52rem;
        height:.64rem;
        background: #C83C4A;
        border-radius: .08rem;
        border:none;
        outline: none;
        margin-right:.3rem;
        margin-top:.17rem;
      }
    }
  }

  .dialog-bj{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0.5;
    background: #000000;
    z-index:1000;
  }
  .dialog-content{
    width:6.9rem;
    min-height:3rem;
    display:inline-block;
    vertical-align: middle;
    background: #fff;
    border-radius: .16rem;
    font-size:.32rem;
    // display:-webkit-box;
    // -webkit-box-orient:vertical;
    // -webkit-box-align:center;
    // -webkit-box-pack:start;
  }
  .confirm-bets-dialog{
    z-index:1001;
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    width:100%;
    height:100%;
    text-align:center;
    &::after{
      content: "";
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
    }
    h2.dialog-title{
      font-size:.36rem;
      color:#191919;
      margin-top:.3rem;
      position: relative;
      em.close-em{
        position: absolute;
        right:.3rem;
        bottom:0;
        width:.46rem;
        height:.46rem;
        border-radius:50%;
        overflow:hidden;
        background:#191919;
        font-size:.5rem;
        color:#fff;
        // text-align:center;
        line-height:.46rem;
        font-weight:normal;
      }
    }
    p{
      font-size:.32rem;
      color:#191919;
      margin-top:.3rem;
      a{
        color:#C83C4A;
      }
    }
    .confirm-to-bets{
      display:block;
      width:4.4rem;
      height:.8rem;
      border-radius: .08rem;
      margin:0 auto;
      margin-top:.6rem;
      margin-bottom:.3rem;
      font-size:.32rem;
      line-height:.8rem;
      background: #C83C4A;
    }
  }
}
</style>


