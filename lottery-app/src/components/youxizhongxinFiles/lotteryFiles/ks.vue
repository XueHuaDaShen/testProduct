<template>
  <div class="ks-bets-wrap">
    <div class="split-bar"></div>
    <div class="ks-content" v-if="type === 'andValue'">
      <div class="and-value-bets bets-wrap">
        <span v-for="(k, i) in andValue" :key="i" @click="handleCheckBetsNum(k, andValue)" :class="setStyle(k)">{{k}}</span>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'sizeDouble'">
      <div class="size-double-bets bets-wrap">
        <span class="dice" v-for="(k, i) in sizeDouble" :key="i" @click="handleCheckBetsNum(k, sizeDouble)" :class="setStyle(k)">{{k}}</span>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeSame'">
      <div class="three-same-bets bets-wrap">
        <div class="nums-wrap" v-for="(item, index) in threeSame" :key="index" @click="handleCheckBetsNum(item, threeSame)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content two-same-bets-wrap" v-if="type === 'twoSame'">
      <div v-for="(item, index) in twoSame" :key="index">
        <div class="two-same-bets bets-wrap">
          <div class="nums-wrap" v-for="(v, vi) in item" :key="vi" @click="handleCheckBetsNum(v, c_twoSame)" :class="setStyle(v)">
            <span class="dice" v-for="(k, ki) in v.toString().split('')" :key="ki.toString()" :class="'dice'+k"></span>
          </div>
        </div>
        <div class="split-bar" v-if="index!=twoSame.length-1"></div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeNoSame'">
      <div v-for="(item, index) in c_threeNoSame" :key="index">
        <div class="two-same-bets bets-wrap">
          <div class="nums-wrap" v-for="(v, vi) in item" :key="vi" @click="handleCheckBetsNum(v, threeNoSame)" :class="setStyle(v)">
            <span class="dice" v-for="(k, ki) in v.toString().split('')" :key="ki.toString()" :class="'dice'+k"></span>
          </div>
        </div>
        <div class="split-bar" v-if="index!=c_threeNoSame.length-1"></div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'twoNoSame'">
      <div class="two-no-same-bets bets-wrap">
        <div class="nums-wrap" v-for="(item, index) in twoNoSame" :key="index" @click="handleCheckBetsNum(item, twoNoSame)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeLink'">
      <div class="three-link-bets bets-wrap">
        <div class="nums-wrap" v-for="(item, index) in threeLink" :key="index" @click="handleCheckBetsNum(item, threeLink)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'singleDice'">
      <div class="single-dice-bets bets-wrap">
        <div class="nums-wrap" v-for="(item, index) in singleDice" :key="index" @click="handleCheckBetsNum(item, singleDice)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import lottery from '@/assets/js/lottery.js';
export default {
  name: 'ksBetsArea',
  props: {
    betsData: {
      type: Object,
      required: true
    },
    // type: {
    //   type: String,
    //   required: true
    // },
    // adjust: {},
    // userRefund: {
    //   type: Number
    // },
    // diff: {
    //   type: Number
    // },
    // maxRefund: {
    //   type: Number
    // },
    // moneyType: {
    //   type: String,
    //   default: '元'
    // },
    // prize: {
    //   type: Number,
    // },
  },
  data() {
    return {
      andValue: [],
      andValueSelected: [],
      sizeDouble: ['大', '小', '单', '双'],
      threeSame: ['666', '555', '444', '333', '222', '111'],
      twoSame: [],
      c_twoSame: [],
      twoSameOperate: ['11', '22', '33', '44', '55', '66'],
      threeNoSame: [],
      c_threeNoSame: [],
      twoNoSame: [],
      threeLink: ['123', '234', '345', '456'],
      singleDice: ['6', '5', '4', '3', '2', '1'],

      type: '',
      prize: 0,
      adjust: 0,
      userRefund: 0,
      diff: 0,
      maxRefund: 0,
      moneyType: '元',
    }
  },
  mounted() {
    // console.log(this.betsData)
    this.type = this.betsData.type;
    this.setAndValue();
    this.setTwoSame()
    this.setThreeNoSame()
    this.setTwoNoSame()
    this.betsData.data = [];
    if(this.type === 'andValue'){
      this.andValuePrize(this.betsData.data);
    }
    // console.log(this.type)
  },
  methods: {
    toThousands(num) {
      var re=/\d{1,3}(?=(\d{3})+$)/g;
      var n1=(num || 0).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
      return n1
    },
    setStyle(val) {
      // console.log(this.betsData)
      try{
        let index = this.betsData.data.indexOf(val);
        let s = '';
        if(index > -1){
          s = 'curr'
        }else{
          s = '';
        }
        return s
      }catch(e){}
    },
    andValuePrize(arr) {
      let extra = this.betsData.extra;
      let probArr = [];
      // console.log(this.betsData)
      // console.log('arr--------',arr)
      // console.log('extra------',extra)
      if(arr.length === 0){
        for(let i in extra){
          probArr.push(extra[i])
        }
      }else{
        arr.filter(v => {
          probArr.push(extra[Number(v)])
        })
      }
      
      let min_probability =  Math.min.apply(Math, probArr);
      let max_probability =  Math.max.apply(Math, probArr);
      // console.log('rule----',this.userRefund, this.maxRefund, this.diff, min_probability, max_probability)

      let min_prize = 0, max_prize = 0;
      if(this.userRefund>this.maxRefund) {
        min_prize = (2*min_probability*(this.userRefund -this.diff ))/this.maxRefund;
        max_prize = (2*max_probability*(this.userRefund -this.diff ))/this.maxRefund;
      } else {
        min_prize = (2*min_probability*this.userRefund)/this.maxRefund;
        max_prize = (2*max_probability*this.userRefund)/this.maxRefund;
      }
      if(this.moneyType === '角'){
        min_prize = min_prize*0.1
        max_prize = max_prize*0.1
      }else if(this.moneyType === '分'){
        min_prize = min_prize*0.01
        max_prize = max_prize*0.01
      }

      if(probArr.length === 1){
        this.prize = [min_prize];
      }else{
        this.prize = [min_prize, max_prize];
      }
    },
    handleClickDouble(item) {
      const vm = this;
      let val = item.charAt(0);
      let c = 0;
      // console.log(item)
      // console.log(this.c_twoSame)
      // console.log(this.betsData.data.indexOf(item))
      for(let i=this.betsData.data.length-1; i>=0; i--){
        let n = this.betsData.data[i].split('')[1];
        if(n === val){
          c++
          this.betsData.data.splice(i, 1);
        }
      }
      if(c !== 5){
        this.c_twoSame.filter((v, i) => {
          let n = v.split('')[1];
          if(n === val){
            vm.betsData.data.push(v)
          }
        })
      }
      this.betsData.data.sort((a, b) => {
        let ai = vm.c_twoSame.indexOf(a);
        let bi = vm.c_twoSame.indexOf(b);
        return ai -bi;
      })
      let bets = lottery.valueEnd(this.betsData.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendbetsData', this.betsData)
      // console.log(c)
    },
    handleCheckBetsNum(val, arr) {
      // console.log(val,arr)
      let index = this.betsData.data.indexOf(val);
      if(index > -1){
        this.betsData.data.splice(index, 1)
      }else{
        this.betsData.data.push(val)
      }
      if(this.type === 'andValue'){
        this.andValuePrize(this.betsData.data)
      }
      this.betsData.data.sort((a, b) => {
        let ai = arr.indexOf(a);
        let bi = arr.indexOf(b);
        return ai -bi;
      })
      // console.log(this.betsData.data)
      let bets = lottery.valueEnd(this.betsData.data);
      this.$store.dispatch('setBets', bets);
      // this.$emit('sendbetsData', this.betsData)
      this.$emit('sendBetsNumber', {data: [this.betsData.data], betsNumber: this.betsData.data.join('|')})
    },
    handleclickAll(sizeDouble) {
      this.betsData.data = sizeDouble
      let bets = lottery.valueEnd(this.betsData.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendbetsData', this.betsData)
    },
    handleclickClean(sizeDouble) {
      this.betsData.data = [];
      let bets = lottery.valueEnd(this.betsData.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendbetsData', this.betsData)
    },
    setPrize(probability) {
      // console.log('rule----',this.userRefund, this.maxRefund, this.diff, probability)
      let prize = 0;
      if(this.userRefund>this.maxRefund) {
        prize = (2*probability*(this.userRefund -this.diff ))/this.maxRefund;
      } else {
        prize = (2*probability*this.userRefund)/this.maxRefund;
      }
      if(this.moneyType === '角'){
        prize = prize*0.1
      }else if(this.moneyType === '分'){
        prize = prize*0.01
      }
      return this.toThousands(prize.toFixed(2));
    },
    setAndValue() {
      for(let i=3; i<19; i++){
        if(i < 10){
          this.andValue.push('0'+i)
        }else{
          this.andValue.push(i.toString())
        }
      }
    },
    setTwoSame() {
      this.twoSame = [];
      for(let i=1; i<=6; i++){
        let arr = [];
        for(let j=1; j<=6; j++){
          let num = i.toString()+i;
          if(j !== i){
            if(j > i){
              num = num + j
            }else{
              num = j + num;
            }
            arr.push(num)
          }
        }
        this.twoSame.push(arr)
      }
      const vm = this;
      for(let i=0; i<5; i++){
        this.twoSame.filter(v => {
          vm.c_twoSame.push(v[i])
        })
      }
    },
    setTwoNoSame() {
      this.twoNoSame = [];
      let arr1 = [];
      for(let i=1; i<=6; i++){
        for(let j=1; j<=6; j++){
          if(i !== j){
            let arr2 = [];
            arr2.push(i);
            arr2.push(j);
            let num = arr2.sort((a, b) => {return a-b}).join('')
            if(arr1.indexOf(num) < 0)arr1.push(num)
          }
        }
      }
      for(let i=0; i<3; i++){
        this.twoNoSame.push(arr1[i])
        let n = i
        for(let j=0; j<4; j++){
          n += 3
          if(n<arr1.length){
            this.twoNoSame.push(arr1[n])
          }
        }
      }
      // console.log(this.twoNoSame)
    },
    setThreeNoSame() {
      this.threeNoSame = [];
      let c_arr1 = [];
      let arr1 = [];
      for(let i=1; i<=6; i++){
        for(let j=1; j<=6; j++){
          for(let k=i; k<=6; k++){
            if(i !== j && i !== k && j !== k){
              let arr2 = [];
              arr2.push(i);
              arr2.push(j);
              arr2.push(k);
              let num = arr2.sort((a, b) => {return a-b}).join('')
              if(arr1.indexOf(num) < 0)arr1.push(num)
            }
          }
        }
      }
      for(let i=0; i<4; i++){
        this.threeNoSame.push(arr1[i])
        let n = i
        for(let j=0; j<5; j++){
          n += 4
          if(n<arr1.length){
            this.threeNoSame.push(arr1[n])
          }
        }
      }
      for(let i=0; i<4; i++){
        let newArr = [];
        let len = 5;
        for(let j=len*i; j<len*i+5; j++){
          newArr.push(this.threeNoSame[j])
        }
        this.c_threeNoSame.push(newArr)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.my-split-line{
  width:100%;
  height:1px;
  background: #ddd;
  margin-top:20px;
  border:none;
}
.ks-bets-wrap{
  width:100%;
  .dice{
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
  }
  .dice1{
    background: url('/static/img/dice1.png') no-repeat;
    background-size:100% 100%;
  }
  .dice2{
    background: url('/static/img/dice2.png') no-repeat;
    background-size:100% 100%;
  }
  .dice3{
    background: url('/static/img/dice3.png') no-repeat;
    background-size:100% 100%;
  }
  .dice4{
    background: url('/static/img/dice4.png') no-repeat;
    background-size:100% 100%;
  }
  .dice5{
    background: url('/static/img/dice5.png') no-repeat;
    background-size:100% 100%;
  }
  .dice6{
    background: url('/static/img/dice6.png') no-repeat;
    background-size:100% 100%;
  }
  .ks-content{
    .bets-wrap{
      width:6.9rem;
      width:6.92rem;
      padding:.3rem .24rem;
      padding-right:0;
      padding-bottom:0;
      display:flex;
      flex-wrap:wrap;
      margin:.3rem;
      border: .01rem solid #333333;
      border-radius: .08rem;
    }
  }
  .ks-content{
    width:100%;
  
    .and-value-bets{
      span{
        display:block;
        width:.82rem;
        height:.82rem;
        line-height:.82rem;
        text-align:center;
        margin-right:.29rem;
        margin-bottom:.3rem;
        // border:1px solid #ccc;
        // background:rgba(255,255,255,1);
        // border-radius:6px;
        // box-shadow:0px 3px 3px rgba(0,0,0,0.18);
        cursor: pointer;
        font-size:.48rem;
        color:#191919;

        background: #F0F0F0;
        background-image: linear-gradient(-226deg, #F2F2F2 0%, #EEEEEE 46%, #C7C8CA 100%);
        box-shadow: 0px 3px 3px 0px rgba(0,0,0,0.38);
        border-radius: .15rem;
      }
      span.curr{
        background:#F60;
        color:#fff;
      }
    }
    div.size-double-bets{
      padding-bottom:.3rem;
      span{
        display:block;
        width:.82rem;
        height:.82rem;
        line-height:.82rem;
        background: #292932;
        border: .02rem solid #303040;
        border-radius: 50%;
        font-size:.38rem;
        text-align:center;
        margin-right:.3rem;
      }
      span.curr{
        background:#F60;
        color:#fff;
      }
    }
    div.two-no-same-bets{
      display:flex;
      flex-wrap:wrap;
      padding-left:0;
      // padding-right:0;
      .nums-wrap{
        // width:1.02rem;
        // height:1.74rem;
        padding:.2rem;
        background: #292932;
        border: .02rem solid #303040;
        border-radius: .08rem;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-box-align:center;
        -webkit-box-pack:center;
        margin:0;
        margin-left:.3rem;
        margin-bottom:.3rem;
        span{
          margin:0;
          display:block;
          width: .62rem;
          height: .62rem;
          line-height: .62rem;
          border-radius: .08rem;
          margin-bottom:.1rem;
          &:last-child{
            margin-bottom:0;
          }
        }
      }
      .nums-wrap.curr{
        background:#F60;
      }
      .curr:hover{
        background: #F60;
      }
    }
    .three-same-bets, .three-link-bets, .three-no-same-bets, .single-dice-bets{
      .nums-wrap{
        // width:3.06rem;
        // height:1.22rem;
        padding:.2rem;
        background: #292932;
        border: .02rem solid #303040;
        border-radius: .08rem;
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:center;
        margin:0;
        margin-right:.2rem;
        margin-bottom:.3rem;
        span{
          margin:0;
          display:block;
          width: .82rem;
          height: .82rem;
          line-height: .82rem;
          border-radius: .08rem;
          margin-right:.1rem;
          &:last-child{
            margin-right:0;
          }
        }
      }
      .nums-wrap.curr{
        background:#F60;
      }
      .curr:hover{
        background: #F60;
      }
    }
    .three-no-same-bets{
      .nums-wrap{
        // padding:5px 10px;
        // padding:0 5px;
        padding:5px;
        cursor: pointer;
        span{
          display: inline-block;
          width: 36px;
          height: 36px;
          line-height: 36px;
          color: #444;
          border-radius: 6px;
        }
      }
    }
    div.single-dice-bets{
      .nums-wrap{
        width:auto;
        height:auto;
        background: #292932;
        border: .02rem solid #303040;
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:center;
        border-radius: .08rem;
        padding:.1rem;
        margin:0;
        margin:0 .5rem;
        margin-bottom:.3rem;
        &:nth-child(2n){
          margin-right:.5rem;
        }
        span{
          display: block;
          width: .82rem;
          height: .82rem;
          line-height: .82rem;
          color: #444;
          border-radius: .08rem;
        }
      }
    }
    div.two-same-bets{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:justify;
      padding:.3rem;
      .nums-wrap{
        // width:1.02rem;
        // height:2.46rem;
        padding:.2rem;
        background: #292932;
        border: .02rem solid #303040;
        border-radius: .16rem;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-box-align:center;
        -webkit-box-pack:center;
        margin:0;
        span{
          display:block;
          width: .62rem;
          height: .62rem;
          line-height: .62rem;
          margin-bottom:.1rem;
          &:last-child{
            margin-bottom:0;
          }
        }
      }
      .curr{
        background: #F60;
      }
      .curr:hover{
        background: #F60;
      }
    }
    div.curr:hover{
      background: #F60;
    }
    .nums-wrap{
      margin:4px;
      border-radius:8px;
    }
  }
}
</style>


