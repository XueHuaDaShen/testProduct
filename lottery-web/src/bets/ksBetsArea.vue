<template>
  <div class="ks-bets-wrap">
    <div class="ks-content" v-if="type === 'andValue'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText(prize)}}</i></span></div>
      <hr class="my-split-line">
      <div class="and-value-bets">
        <span v-for="(k, i) in andValue" :key="i" @click="handleCheckBetsNum(k, andValue)" :class="setStyle(k)">{{k}}</span>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'sizeDouble'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="size-double-bets">
        <span class="dice" v-for="(k, i) in sizeDouble" :key="i" @click="handleCheckBetsNum(k, sizeDouble)" :class="setStyle(k)">{{k}}</span>
        <div><em @click="handleclickAll(sizeDouble)">全</em><em @click="handleclickClean(sizeDouble)">清</em></div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeSame'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="three-same-bets">
        <div class="nums-wrap" v-for="(item, index) in threeSame" :key="index" @click="handleCheckBetsNum(item, threeSame)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'twoSame'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="two-same-bets">
        <div class="nums-area">
          <div class="nums-wrap-par" v-for="(item, index) in twoSame" :key="index">
            <div class="nums-wrap" v-for="(v, vi) in item" :key="vi" @click="handleCheckBetsNum(v, c_twoSame)" :class="setStyle(v)">
              <span class="dice" v-for="(k, ki) in v.toString().split('')" :key="ki.toString()" :class="'dice'+k"></span>
            </div>
          </div>
        </div>
        <div class="operate-area">
          <div class="nums-wrap" v-for="(item, index) in twoSameOperate" @click="handleClickDouble(item)" :key="index">
            <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeNoSame'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="three-no-same-bets">
        <div class="nums-wrap" v-for="(item, index) in threeNoSame" :key="index" @click="handleCheckBetsNum(item, threeNoSame)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'twoNoSame'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="two-no-same-bets">
        <div class="nums-wrap" v-for="(item, index) in twoNoSame" :key="index" @click="handleCheckBetsNum(item, twoNoSame)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'threeLink'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="three-link-bets">
        <div class="nums-wrap" v-for="(item, index) in threeLink" :key="index" @click="handleCheckBetsNum(item, threeLink)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>

    <div class="ks-content" v-if="type === 'singleDice'">
      <div class="rule">{{betsArr.plan}}<span>单注奖金：<i>{{setPrizeText([ksPrize])}}</i></span></div>
      <hr class="my-split-line">
      <div class="single-dice-bets">
        <div class="nums-wrap" v-for="(item, index) in singleDice" :key="index" @click="handleCheckBetsNum(item, singleDice)" :class="setStyle(item)">
          <span class="dice" v-for="(k, i) in item.toString().split('')" :key="i.toString()" :class="'dice'+k"></span>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import lottery from '../../static/lottery';
export default {
  name: 'ksBetsArea',
  props: {
    betsArr: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    adjust: {},
    userRefund: {
      type: Number
    },
    diff: {
      type: Number
    },
    maxRefund: {
      type: Number
    },
    moneyType: {
      type: String,
      default: '元'
    },
    ksPrize: {
      type: Number,
    },
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
      twoNoSame: [],
      threeLink: ['123', '234', '345', '456'],
      singleDice: ['6', '5', '4', '3', '2', '1'],

      prize: 0,
    }
  },
  mounted() {
    this.setAndValue();
    this.setTwoSame()
    this.setThreeNoSame()
    this.setTwoNoSame()
    if(this.type === 'andValue'){
      this.andValuePrize(this.betsArr.data);
    }
    // console.log(this.betsArr)
    // console.log(this.type)
  },
  methods: {
    toThousands(num) {
      var re=/\d{1,3}(?=(\d{3})+$)/g;
      var n1=(num || 0).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
      return n1
    },
    setPrizeText(prizeArea) {
      let n;
      if(prizeArea.length === 1){
        n = ((prizeArea[0]/this.userRefund)*this.adjust).toFixed(2);
      }else{
        n = ((prizeArea[0]/this.userRefund)*this.adjust).toFixed(2) + ' - ' + ((prizeArea[1]/this.userRefund)*this.adjust).toFixed(2);
      }
      return n
    },
    setStyle(val) {
      // console.log(this.betsArr)
      try{
        let index = this.betsArr.data.indexOf(val);
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
      let extra = this.betsArr.extra;
      let probArr = [];
      // console.log(this.betsArr)
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
      // console.log(this.betsArr.data.indexOf(item))
      for(let i=this.betsArr.data.length-1; i>=0; i--){
        let n = this.betsArr.data[i].split('')[1];
        if(n === val){
          c++
          this.betsArr.data.splice(i, 1);
        }
      }
      if(c !== 5){
        this.c_twoSame.filter((v, i) => {
          let n = v.split('')[1];
          if(n === val){
            vm.betsArr.data.push(v)
          }
        })
      }
      this.betsArr.data.sort((a, b) => {
        let ai = vm.c_twoSame.indexOf(a);
        let bi = vm.c_twoSame.indexOf(b);
        return ai -bi;
      })
      let bets = lottery.valueEnd(this.betsArr.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendBetsArr', this.betsArr)
      // console.log(c)
    },
    handleCheckBetsNum(val, arr) {
      // console.log(val,arr)
      let index = this.betsArr.data.indexOf(val);
      if(index > -1){
        this.betsArr.data.splice(index, 1)
      }else{
        this.betsArr.data.push(val)
      }
      if(this.type === 'andValue'){
        this.andValuePrize(this.betsArr.data)
      }
      this.betsArr.data.sort((a, b) => {
        let ai = arr.indexOf(a);
        let bi = arr.indexOf(b);
        return ai -bi;
      })
      // console.log(this.betsArr.data)
      let bets = lottery.valueEnd(this.betsArr.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendBetsArr', this.betsArr)
    },
    handleclickAll(sizeDouble) {
      this.betsArr.data = sizeDouble
      let bets = lottery.valueEnd(this.betsArr.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendBetsArr', this.betsArr)
    },
    handleclickClean(sizeDouble) {
      this.betsArr.data = [];
      let bets = lottery.valueEnd(this.betsArr.data);
      this.$store.dispatch('setBets', bets);
      this.$emit('sendBetsArr', this.betsArr)
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
      // console.log(arr1)
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
      // console.log(this.threeNoSame)
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
    margin-left:5px;
    border-radius:8px;
    &:first-child{
      margin-left:0;
    }
  }
  .dice1{
    background: url('../img/dice1.png') no-repeat;
    background-size:100% 100%;
  }
  .dice2{
    background: url('../img/dice2.png') no-repeat;
    background-size:100% 100%;
  }
  .dice3{
    background: url('../img/dice3.png') no-repeat;
    background-size:100% 100%;
  }
  .dice4{
    background: url('../img/dice4.png') no-repeat;
    background-size:100% 100%;
  }
  .dice5{
    background: url('../img/dice5.png') no-repeat;
    background-size:100% 100%;
  }
  .dice6{
    background: url('../img/dice6.png') no-repeat;
    background-size:100% 100%;
  }
  .ks-content{
    width:100%;
  }
  .rule{
    text-align:left;
    font-size:12px;
    color:#777;
    span{
      display:inline;
      margin-left:10px;
    }
    i{
      font-style:normal;
      color:#CC3447;
      font-size:18px;
    }
  }
  .and-value-bets{
    width:100%;
    padding-top:20px;
    padding-left:60px;
    display:flex;
    flex-wrap:wrap;
    span{
      display:block;
      width:56px;
      height:56px;
      line-height:56px;
      text-align:center;
      margin-left:20px;
      margin-bottom:10px;
      // border:1px solid #ccc;
      // background:rgba(255,255,255,1);
      // border-radius:6px;
      // box-shadow:0px 3px 3px rgba(0,0,0,0.18);
      cursor: pointer;
      font-size:32px;
      color:#4f4f4f;

      background: #F0F0F0;
      background-image: linear-gradient(-226deg, #F2F2F2 0%, #EEEEEE 46%, #C7C8CA 100%);
      box-shadow: 0px 3px 3px 0px rgba(0,0,0,0.38);
      border-radius: 15px;
    }
    span.curr{
      background:#F60;
      color:#fff;
    }
  }
  .size-double-bets{
    width:100%;
    padding-top:20px;
    padding-left:60px;
    display:flex;
    flex-wrap:wrap;
    div{
      line-height:76px;
      // margin-left:30px;
    }
    span{
      display:block;
      width: 56px;
      height: 56px;
      line-height: 56px;
      border-radius: 50%;
      // font-family: STHeitiSC-Light;
      font-size: 32px;
      color: #4f4f4f;
      text-align: center;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0;
      background-image: linear-gradient(-180deg, #FFFFFF 5%, #BCBCBC 97%);
      // border: 1px solid #DDDDDD;
      margin:10px;
      cursor: pointer;
    }
    em{
      font-style:normal;
      margin-left:20px;
      font-size:14px;
      cursor: pointer;
      display:inline-block;
      width:30px;
      height:30px;
      text-align:center;
      line-height:30px;
      background: #FFFFFF;
      border: 1px solid #DDDDDD;
      font-size: 14px;
      color: #4F4F4F;
      border-radius:50%;
    }
    span.curr{
      background:#F60;
      color:#fff;
    }
  }
  .three-link-bets{
    width:100%;
    padding-top:20px;
    padding-left:120px;
    display:flex;
    flex-wrap:wrap;
    .nums-wrap{
      // padding:5px 10px;
      // padding:0 5px;
      padding:5px;
      cursor: pointer;
      span{
        display: inline-block;
        width: 48px;
        height: 48px;
        line-height: 48px;
        color: #444;
        border-radius: 8px;
      }
    }
    .nums-wrap.curr{
      background:#F60;
    }
    .nums-wrap:hover{
      background: #f5f5f5;
    }
    .curr:hover{
      background: #F60;
    }
  }
  div.two-no-same-bets{
    padding-left:90px;
  }
  .three-same-bets, .three-no-same-bets, .two-no-same-bets, .single-dice-bets{
    width:100%;
    padding-top:20px;
    padding-left:120px;
    display:flex;
    flex-wrap:wrap;
    .nums-wrap{
      // padding:5px 10px;
      // padding:0 5px;
      padding:5px;
      cursor: pointer;
      span{
        display: inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        color: #444;
        border-radius: 8px;
      }
    }
    .nums-wrap.curr{
      background:#F60;
    }
    .nums-wrap:hover{
      background: #f5f5f5;
    }
    .curr:hover{
      background: #F60;
    }
  }
  .three-no-same-bets{
    padding-left:10px;
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
  .three-link-bets{
    padding-left:10px;
  }
  .single-dice-bets{
    .nums-wrap{
      // padding:5px 10px;
      // padding:0 5px;
      padding:5px;
      cursor: pointer;
      span{
        display: inline-block;
        width: 57px;
        height: 57px;
        line-height: 57px;
        color: #444;
        border-radius: 8px;
      }
    }
  }
  .two-same-bets{
    width:100%;
    padding-top:20px;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    .nums-area{
      display:-webkit-box;
      .num-wrap-par{
        display:-webkit-box;
        -webkit-box-orient:vertical;
      }
      .curr{
        background: #F60;
      }
      .curr:hover{
        background: #F60;
      }
    }
    .operate-area{
      display:-webkit-box;
      margin-top:10px;
      .nums-wrap{
        -webkit-box-flex:1;
      }
      .curr:hover{
        background: #F60;
      }
    }
    .nums-wrap{
      // padding:5px 10px;
      // padding:0 5px;
      padding:5px;
      cursor: pointer;
      span{
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        color: #444;
        border-radius: 4px;
      }
    }
    .nums-wrap:hover{
      background: #f5f5f5;
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
</style>


