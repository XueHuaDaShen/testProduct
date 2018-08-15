<template>
  <div class="ssc-wrap">
    <!-- 公用 区 -->
    <div class="split-bar" v-if="betsData.checkBit"></div>
    <!-- 任选 位数 区 -->
    <div class="optional-wei" style="margin-bottom:.3rem;" v-if="betsData.checkBit">
      <span v-for="(wei, wi) in optionalArr" :key="wi" @click="handleClickLabel(wei, wi)" :class="setIsChecked(wei)?'active':''">{{wei}}位</span>
    </div>
    <div class="lottery-kind number" v-if="betsData.type!=='text' && betsData.type.indexOf('and')<0 && betsData.type!=='special' && betsData.type!=='sizeDouble' && betsData.type!=='interest' && betsData.type!=='tiger-end'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in balls" :key="i" @click="selectNum(bi, v, balls)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
        </div>
      </div>
    </div>
    <!-- 和值 区 -->
    <div class="lottery-kind number and" v-if="betsData.type.indexOf('and')>-1">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in andArr" :key="i" @click="selectNum(bi, v, andArr)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
        </div>
      </div>
    </div>
    <!-- 特殊号码 区 -->
    <div class="lottery-kind number special" v-if="betsData.type==='special'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in specialArr" :key="i" @click="selectNum(bi, v, specialArr)">{{v}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 大小单双 区 -->
    <div class="lottery-kind number sizeDouble" v-if="betsData.type==='sizeDouble'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in sizeDouble" :key="i" @click="selectNum(bi, v, sizeDouble)">{{v}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 趣味 区 -->
    <div class="lottery-kind number interest" v-if="betsData.type==='interest' && betsData.area==='interest'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li class="interest-li" v-if="(betsData.betsTitle.length===5)?bi<2:bi<1" :class="checkInStyle(bi, v)" v-for="(v, i) in interest" :key="i" @click="selectNum(bi, v, interest)">{{v}}</li>
            <li v-if="(betsData.betsTitle.length===5)?bi>1:bi>0" :class="checkInStyle(bi, v)" v-for="(v, i) in balls" :key="i" @click="selectNum(bi, v, balls)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate" v-if="(betsData.betsTitle.length===5)?bi>1:bi>0">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
        </div>
      </div>
    </div>
    <div class="lottery-kind number interest" v-if="betsData.type==='interest' && betsData.area==='interestArea'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li class="interestArea-li" v-if="(betsData.betsTitle.length===5)?bi<2:bi<1" :class="checkInStyle(bi, v)" v-for="(v, i) in interestArea" :key="i" @click="selectNum(bi, v, interestArea)">{{v}}</li>
            <li v-if="(betsData.betsTitle.length===5)?bi>1:bi>0" :class="checkInStyle(bi, v)" v-for="(v, i) in balls" :key="i" @click="selectNum(bi, v, balls)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate" v-if="(betsData.betsTitle.length===5)?bi>1:bi>0">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
        </div>
      </div>
    </div>
    <!-- 龙虎 区 -->
    <div class="lottery-kind number tiger-end" v-if="betsData.type==='tiger-end'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in tiger" :key="i" @click="selectNum(bi, v, tiger)">{{v}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 文本域 区 -->
    <div class="lottery-kind text" v-if="betsData.type==='text'">
      <div class="split-bar"></div>
      <div class="text-wrap">
        <textarea
          name=""
          id="bets-textarea"
          placeholder="粘贴或输入你的投注内容"
          v-model="betsNumber"
          ref="betsArea"
          @keyup="handleInputBetsNum"
          cols="30" rows="10">
        </textarea>
        <div class="text-btn">
          <span @click="handleHelp">帮助</span>
          <em></em>
          <span @click="cleanErrorRepeat">清理错误与重复</span>
          <em></em>
          <span @click="cleanBetsText">清空文本框</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ssc',
  props: {
    betsData: {
      type: Object
    }
  },
  data() {
    return {
      balls: [], // 号码数组 0-9
      andArr: [], // 和值数组
      specialArr: ['豹子', '顺子', '对子'],
      sizeDouble: ['大', '小', '单', '双'],
      tiger: ['龙', '虎', '和'],
      interestArr: [],
      interest: ['小(0-4)', '大(5-9)'],
      interestArea: ['一区(0,1)', '二区(2,3)', '三区(4,5)', '四区(6,7)', '五区(8,9)'],
      dingDS: ['5单0双', '4单1双', '3单2双', '2单3双', '1单4双', '0单5双'],
      optionalArr: ['万', '千', '百', '十', '个'],
      isCheckOptional: [], // 选中的位数
      betsArr: [], // 投注数组
      oprateArr: [
        {title: '全', type: 'all'},
        {title: '大', type: 'large'},
        {title: '小', type: 'small'},
        {title: '奇', type: 'odd'},
        {title: '偶', type: 'even'},
        {title: '清', type: 'clean'}
      ], // 操作按钮
      lotteryType: 'text', // 投注类型 文本 或者 非文本
      betsNumber: '',
    }
  },
  created() {
    // console.log(this.betsData)
    let valueLen, isDouble;
    this.andArr = [];
    // 0-9 十个数字
    for(let i=0; i<10; i++){
      this.balls.push(i.toString())
    }
    // 投注号码 数组集合
    this.betsArr = [];
    for(let i in this.betsData.betsTitle){
      this.betsArr.push([]);
    }
    // 和值数组
    try{
      valueLen = this.betsData.valueLen;
      isDouble = this.betsData.isDouble;
      if(isDouble){
          for(let i=0; i<=valueLen*9; i++){
          this.andArr.push(i.toString());
        }
      }else{
        for(let i=1; i<valueLen*9; i++){
          this.andArr.push(i.toString());
        }
      }
    }catch(e){}
    if(this.betsData.checkBit){
      this.isCheckOptional = this.betsData.checkLen
      this.$emit('sendWei', this.isCheckOptional);
    }
    // console.log(this.betsArr)
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    // 号码选中样式
    checkInStyle(index, item) {
      // let c = '';
      // let val = this.betsArr[index].indexOf(item);
      // if(val > -1){
      //   c = 'active';
      // }else{
      //   c = ''
      // }
      // return c;
      
      let s = '';
      let v = '';
      let val = item.toString();
      if(val.indexOf('区') > -1){
        v = val.slice(0, 2)
      }else if(val.indexOf('(') > -1){
        v = val.slice(0, 1)
      }else{
        v = val
      }
      // console.log('判断数字------------',item, v)
      if(this.betsArr[index].indexOf(v.toString()) > -1){
        s = 'active'
      }else{
        s = ''
      }
      return s;
    },
    // 选择号码
    selectNum(index, item, arr) {
      // let val = this.betsArr[index].indexOf(item);
      // if(val > -1){
      //   this.betsArr[index].splice(val, 1)
      // }else{
      //   this.betsArr[index].push(item)
      // }
      // this.betsArr[index].sort((a, b) => {
      //   return a -b;
      // })

      // this.setBetsNumber();

      let filterArr = [];
      arr.filter(v => {
        filterArr.push(v.toString().replace(/\(\d\W\d\)/g,function(){return ''}))
      })
      let val = item.toString().replace(/\(\d\W\d\)/g,function(){return ''});
      let exist = this.betsArr[index].indexOf(val);
      if(exist > -1){
        this.betsArr[index].splice(exist,1);
      }else{
        this.betsArr[index].push(val);
      }
      this.betsArr[index].sort((a, b) => {
        let ai = filterArr.indexOf(a);
        let bi = filterArr.indexOf(b);
        return ai -bi;
      })
      this.setBetsNumber();
    },
    // 点击操作按钮
    handleClickOprate(type, index) {
      let arr = this.andArr.length===0?this.balls:this.andArr;
      let arrLen = arr.length;
      if(type === 'clean'){
        for(let i=this.betsArr[index].length-1; i>=0; i--){
          this.betsArr[index].splice(i, 1)
        }
      }else{
        this.betsArr[index].length = 0;
      }
      for(let i=0; i<arrLen; i++){
        if(type === 'all'){
          this.betsArr[index].push(arr[i])
        }else if(type === 'large'){
          if(i > (Math.ceil(arrLen/2) -1 )){
            this.betsArr[index].push(arr[i])
          }
        }else if(type === 'small'){
          if(i < (Math.ceil(arrLen/2) )){
            this.betsArr[index].push(arr[i])
          }
        }else if(type === 'odd'){
          if(i % 2 !== 0){
            this.betsArr[index].push(arr[i])
          }
        }else if(type === 'even'){
          if(i % 2 === 0){
            this.betsArr[index].push(arr[i])
          }
        }
      }

      this.setBetsNumber();
    },
    // 格式化投注号码
    setBetsNumber() {
      this.betsNumber = '';
      let symCode = '-';

      const vm = this;
      if (this.betsData.type.indexOf('and') > -1) {
        symCode = '-'
      } else {
        symCode = '';
      }
      if (this.betsData.type === 'text') {
        // let numArr = [];
        // this.betsArr.filter(v => {
        //   numArr.push(v.join(''))
        // })
        // this.betsNumber = data.join("|")
      } else {
        var data = this.betsArr;
        var arr = [];
        for (let i in data) {
          arr.push(data[i])
        }
        var str1 = '';
        var str2 = '';
        var arr1 = [];
        arr.filter(v => {
          if(v.length !== 0){
            if (v[0].indexOf('区') > -1 || v[0].indexOf('子') > -1) {
              arr1.push(v.join('-'))
            } else {
              arr1.push(v.join(symCode))
            }
          }else{
            arr1.push(v.join(symCode))
          }
        })
        this.betsNumber = arr1.join("|")
      }
      // console.log(this.betsArr, this.betsNumber)
      this.$emit('sendBetsNumber', {data: this.betsArr, betsNumber: this.betsNumber})
    },
    // 选中的 位数
    setIsChecked(k) {
      var val = false;
      if(this.isCheckOptional.indexOf(k) > -1){
        val = true
      }else{
        val = false;
      }
      return val
    },
    // 选择 位数
    handleClickLabel(k) {
      const vm = this;
      var index = this.isCheckOptional.indexOf(k);
      var valueLen = this.betsData.valueLen;
      if( index > -1 ){
        if(this.isCheckOptional.length < (valueLen+1)){
          this.isCheckOptional.splice(index,1)
          this.isCheckOptional.push(k);
        }else{
          this.isCheckOptional.splice(index,1)
        }
      }else{
        this.isCheckOptional.push(k);
      }
      let arr1 = [];
      this.isCheckOptional.filter(v => {
        if(v === '万'){ arr1.push({val: 5, text: v}) };
        if(v === '千'){ arr1.push({val: 4, text: v}) };
        if(v === '百'){ arr1.push({val: 3, text: v}) };
        if(v === '十'){ arr1.push({val: 2, text: v}) };
        if(v === '个'){ arr1.push({val: 1, text: v}) };
      })
      let arr2 = [];
      arr1.sort((a,b) => {return b.val-a.val}).filter(v => {arr2.push(v.text)})
      // console.log(arr2)
      this.$emit('sendWei', arr2);
      // this.setBets(this.betsArr.data);
      this.setBetsNumber();
    },
    // 输入 投注号码
    handleInputBetsNum() {
      const vm = this;
      vm.ssc_checkBetsText(false);
    },
    // 格式化投注号码
    ssc_checkBetsText(isCheck, optionalLen) {
      const len = this.betsData.numLen;
      const isDouble = this.betsData.isDouble;
      const order = this.betsData.order;
      //分割符
      const sym = ' ';
      const opArrLen = optionalLen || 1;
      //将投注的号码进行检测
      var checkedBetsNum = this.betsNumber.replace(/[\W\_]+/g,function(n){
        if(!/[\u4e00-\u9fa5]/g.test(n)){
          return sym
        }else{
          return n
        }
      })
      //检测后的投注号码 数组
      var numArr = checkedBetsNum.split(sym);
      var c_numArr = checkedBetsNum.split(sym);
      //被删除的元素集合，以及剩余有效元素集合
      var delArr = [], lifeArr = [];
      for(let i=numArr.length-1; i>=0; i--){
        for(let j=i-1; j>=0; j--){
          if(order){
            let currVal = c_numArr[i].split('').sort((a, b) => {return a-b}).join('');
            let nextVal = c_numArr[j].split('').sort((a, b) => {return a-b}).join('');
            if(nextVal === currVal){
              delArr.push(numArr[i])
              c_numArr.splice(i,1,'')
            }
          }else{
            if(c_numArr[j] === c_numArr[i]){
              delArr.push(numArr[i])
              c_numArr.splice(i,1,'')
            }
          }
        }
      }
      for(let i in c_numArr){
        let value = Number(c_numArr[i]);
        if(!isNaN(value)){
          if(c_numArr[i].length !== len){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }else{
          delArr.push(c_numArr[i])
          c_numArr.splice(i,1,'')
        }
      }
      if(isDouble === 0){
        //一注号码每一个都不能一样
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length !== l){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }else if(isDouble === 1){
        //可以有两个一样(即可以有一个不一样)
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length === 1){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }else if(isDouble === 3){
        //必须有两个一样
        for(let i=c_numArr.length-1; i>=0; i--){
          let val = c_numArr[i];
          let l = val.length;
          let arr = [];
          val.split('').filter(k => {
            if(arr.indexOf(k) < 0){
              arr.push(k)
            }
          })
          if(arr.length !== 2){
            delArr.push(c_numArr[i])
            c_numArr.splice(i,1,'')
          }
        }
      }
      // numArr.filter((v, i) => {
      //   let n = delArr.indexOf(v)
      //   if(n < 0){
      //     lifeArr.push(v)
      //   }
      // })
      for(let i=delArr.length-1; i>=0; i--){
        if(delArr[i] === ''){
          delArr.splice(i,1)
        }
      }
      c_numArr.filter(v => {
        if(v !== ''){
          lifeArr.push(v)
        }
      })
      if(isCheck){
        // this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
        this.betsNumber = lifeArr.join(sym);
        this.filterNumber = delArr.join(sym);
        // if(this.getclearBetsNum){
        //   this.betsNumber = '';
        //   this.$refs['betsArea'].placeholder = this.defaultText;
        //   this.$emit('eidtToBets', false)
        //   this.$store.dispatch('setclearBetsNum', false)
        // }
      }
      // console.log(this.betsNumber)
      // this.betsArr.data = lifeArr;
      this.$emit('sendBetsNumber', {data: [], betsNumber: lifeArr.join(sym)})
      var bets = lifeArr.length || 0;
      this.$store.dispatch('setBets', bets * opArrLen);
    },
    // 帮助
    handleHelp() {},
    // 清理错误与重复
    cleanErrorRepeat() {
      this.ssc_checkBetsText(true)
    },
    // 清空文本框
    cleanBetsText() {
      this.betsNumber = '';
    },
  },
}
</script>
<style lang="scss" scoped>
.ssc-wrap{
  ul{
    -webkit-box-flex:1;
    display:flex;
    flex-wrap:wrap;
    li{
      width:.8rem;
      height:.8rem;
      border-radius:50%;
      overflow: hidden;
      font-size: .48rem;
      text-align: center;
      line-height:.8rem;
      background: #303040;
      border: .02rem solid #5B5B8C;
      margin-right:.3rem;
      margin-top:.3rem;
    }
    li.active{
      background: yellow !important;
      color:#000;
    }
  }
  strong{
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-align:center;
    -webkit-box-pack:center;
    width:.38rem;
    white-space: wrap;
    font-size:.38rem;
    margin:.3rem .46rem 0 .46rem;
  }
  .optional-wei{
    width:100%;
    height:.6rem;
    margin-top:.3rem;
    span{
      float: left;
      height:100%;
      width:1.14rem;
      text-align:center;
      line-height:.6rem;
      background: #292932;
      border: .02rem solid #303040;
      border-radius: 1rem;
      margin-left:.3rem;
    }
    span.active{
      background: yellow !important;
      color:#000;
    }
  }
  .lottery-kind{
    .betsList{
      .bets-wrap{
        width:6.9rem;
        // height:2.44rem;
        display:-webkit-box;
        -webkit-box-align:center;
        margin:.3rem;
        padding-bottom:.3rem;
        border: .01rem solid #333333;
        border-radius: .08rem;
        // color: #939DB8;
      }
      .oprate{
        padding:0 .72rem;
        display:-webkit-box;
        -webkit-box-pack:justify;
        font-size: .32rem;
        color: #4A4A62;
        margin-bottom:.3rem;
        em{
          display: block;
          font-style:normal;
        }
      }
    }
    .text-wrap{
      width:6.9rem;
      height:4.75rem;
      border: .01rem solid #333333;
      border-radius: .08rem;
      margin:.3rem;
      padding:.3rem;
      padding-bottom:.2rem;
      #bets-textarea{
        width:6.3rem;
        height:3.6rem;
        background: #292932;
        border-radius: .08rem;
        border:none;
        outline: none;
        padding:.2rem .3rem;
        color:#646464;
        resize:none;
      }
      .text-btn{
        margin-top:.2rem;
        height:.45rem;
        text-align:right;
        font-size:.32rem;
        // color: #4A4A62;
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:end;
        span{
          display:block;
        }
        em{
          display:block;
          width:.03rem;
          height:.3rem;
          background:#c7c7c7;
          margin:0 .3rem;
          margin-top: .06rem;
        }
      }
    }
  }
  .and{
    li{
      margin-right:0;
      margin-left:.3rem;
    }
  }
  .special{
    li{
      width:1.64rem;
      height:.82rem;
      border-radius:1rem;
      margin-right:0;
      margin-left:.3rem;
      background: #292932;
      border: .02rem solid #303040;
      font-size:.38rem;
    }
  }
  .sizeDouble{
    strong{
      margin-left:1.02rem;
      margin-right:1.02rem;
    }
    li{
      font-size:.38rem;
    }
  }
  .interest{
    .interest-li, .interestArea-li{
      width:1.64rem;
      height:.82rem;
      border-radius:1rem;
      margin-right:0;
      margin-left:.3rem;
      background: #292932;
      border: .02rem solid #303040;
      font-size:.38rem;
    }
    .interestArea-li{
      width:2rem;
    }
  }
  .tiger-end{
    strong{
      width:auto;
    }
    li{
      font-size:.38rem;
    }
  }
}
</style>


