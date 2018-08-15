<template>
  <div class="syxw-wrap">
    <!-- 公用 区 -->
    <div class="split-bar" v-if="betsData.checkBit"></div>
    <div class="lottery-kind number" v-if="betsData.type!=='dantuo'&&betsData.type.indexOf('interest')<0&&betsData.type.indexOf('cai')<0">
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
    <!-- 猜中位 区 -->
    <div class="lottery-kind number" v-if="betsData.type.indexOf('cai')>-1">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li :class="checkInStyle(bi, v)" v-if="i>1&&i<9" v-for="(v, i) in balls" :key="i" @click="selectNum(bi, v, balls)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
        </div>
      </div>
    </div>
    <!-- 定单双 区 -->
    <div class="lottery-kind number special" v-if="betsData.type.indexOf('interest')>-1">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in dingDS" :key="i" @click="selectNum(bi, v, dingDS)">{{v}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 任选胆拖 区 -->
    <div class="lottery-kind number" v-if="betsData.type==='dantuo'">
      <div class="betsList" v-for="(bets, bi) in betsData.betsTitle" :key="bi">
        <div class="split-bar"></div>
        <div class="bets-wrap">
          <strong class="bets-title">{{bets.charAt(1)==='位'?bets.charAt(0):bets}}</strong>
          <ul>
            <li :class="checkInStyle(bi, v)" v-for="(v, i) in balls" :key="i" @click="handleClickDanTuoBetsNum(betsArr[bi], v, bi)">{{v}}</li>
          </ul>
        </div>
        <div class="oprate" v-if="betsData.showOprateBtn&&bi!==0">
          <em v-for="(v, i) in oprateArr" :key="i" @click="handleClickOprate(v.type, bi)">{{v.title}}</em>
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
  name: 'syxw',
  props: {
    betsData: {
      type: Object
    }
  },
  data() {
    return {
      balls: [], // 号码数组 0-9
      dingDS: ['5单0双', '4单1双', '3单2双', '2单3双', '1单4双', '0单5双'],
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
      lastPush: '',
    }
  },
  created() {
    // console.log(this.betsData)
    let valueLen, isDouble;
    // 0-11 12个数字
    for(let i=1; i<12; i++){
      if(i<10){
        this.balls.push('0'+i)
      }else{
        this.balls.push(i.toString())
      }
    }
    // 投注号码 数组集合
    this.betsArr = [];
    for(let i in this.betsData.betsTitle){
      this.betsArr.push([]);
    }
    // console.log(this.betsArr)
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    handleClickDanTuoBetsNum(item, i, itemIndex) {
      const vm = this;
      let index = item.indexOf(i);
      if(itemIndex === 0){
        if(index > -1){
          item.splice(index,1);
        }else{
          if(item.length >= vm.betsData.danNum){
            let lastIndex = item.indexOf(this.lastPush);
            if(lastIndex > -1){
              item[lastIndex] = i
            }
          }else{
            item.push(i);
          }
        }
        itemIndex = 1;
        this.lastPush = i;
      }else{
        if(index > -1){
          item.splice(index,1);
        }else{
          item.push(i);
        }
        itemIndex = 0;
      }
      item.sort((a, b) => {
        return a-b
      })
      // itemIndex = itemIndex === 0?1:0;
      item.filter(v => {
        let nIndex = vm.betsArr[itemIndex].indexOf(v);
        if(nIndex > -1){
          vm.betsArr[itemIndex].splice(nIndex,1);
        }
      })
      this.setBetsNumber();
      // this.setBets(this.betsArr);
    },
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
      let arr = this.balls;
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

      if(this.betsData.type === 'dantuo'){
        let arr1 = this.betsArr[0];
        let len = arr1.length;
        for(let i=len-1; i>=0; i--){
          if(this.betsArr[1].indexOf(arr1[i]) > -1){
            arr1.splice(i, 1)
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
      // console.log(this.betsNumber)
      this.$emit('sendBetsNumber', {data: this.betsArr, betsNumber: this.betsNumber})
    },
    // 输入 投注号码
    handleInputBetsNum() {
      const vm = this;
      vm.syxw_checkBetsText(false);
    },
    // 格式化投注号码
    syxw_checkBetsText(isCheck, optionalLen) {

      const len = this.betsData.numLen;
      const isDouble = this.betsData.isDouble;
      const order = this.betsData.order;
      //分割符
      const sym = 'mySym';
      const opArrLen = optionalLen || 1;
      //将投注的号码进行检测
      let c1, c2, c3, c4=[], c5=[];
      let copy_c4=[];
      c1 = this.betsNumber.replace(/\s+/g,function(v){return sym});
      c2 = c1.replace(/[\W\_]/g,(n)=>{
        if(!/[\u4e00-\u9fa5]/g.test(n)){
        return ' '
        }else{
          return n
        }
      });
      c3 = c2.split(' ');
      c3.filter(v => {
        c4.push(v.replace(/mySym/g,()=>{return ' '}))
      })
      c4.filter(v => {
        let num = v.replace(/(^\s*)|(\s*$)/g,()=>{return ''});
        if(num!==''){
          c5.push(num)
          copy_c4.push(num)
        }
      })
      //检测后的投注号码 数组 c5
      
      //被删除的元素集合，以及剩余有效元素集合
      var delArr = [], lifeArr = [];
      for(let i in copy_c4){
        let val = copy_c4[i];
        let isVaildVal = val.split(' ').every((n) => {
          return ( !isNaN (n) && Number(n) > 0 && Number(n) < 12 && n.toString().length === 2 )
        })
        if(isVaildVal){
          if(val.split(' ').length !== len){
            delArr.push(copy_c4[i])
            copy_c4.splice(i,1,'')
          }
        }else{
          delArr.push(copy_c4[i])
          copy_c4.splice(i,1,'')
        }
      }
      for(let i=copy_c4.length-1; i>=0; i--){
        for(let j=i-1; j>=0; j--){
          if(copy_c4[i] !== ''){
            if(order){
              let currVal = copy_c4[i].split(' ').sort((a, b) => {return a-b}).join('');
              let nextVal = copy_c4[j].split(' ').sort((a, b) => {return a-b}).join('');
              if(nextVal === currVal){
                delArr.push(copy_c4[i])
                copy_c4.splice(i,1,'')
              }
            }else{
              if(copy_c4[j] === copy_c4[i]){
                delArr.push(copy_c4[i])
                copy_c4.splice(i,1,'')
              }
            }
          }
        }
      }
      for(let i=copy_c4.length-1; i>=0; i--){
        let val = copy_c4[i];
        let l = val.split(' ').length;
        let arr = [];
        val.split(' ').filter(k => {
          if(arr.indexOf(k) < 0){
            arr.push(k)
          }
        })
        if(arr.length !== l){
          delArr.push(copy_c4[i])
          copy_c4.splice(i,1,'')
        }
      }
      for(let i=delArr.length-1; i>=0; i--){
        if(delArr[i] === ''){
          delArr.splice(i,1)
        }
      }
      copy_c4.filter((v, i) => {
        if(v !== ''){
          lifeArr.push(v)
        }
      })
      if(isCheck){
        // this.dialogFormVisible = delArr.length>0&&delArr[0]!=='';
        this.betsNumber = lifeArr.join('|');
        this.filterNumber = delArr.join('|');
        // if(this.getclearBetsNum){
        //   this.betsNumber = '';
        //   this.$refs['betsArea'].placeholder = this.defaultText;
        //   this.$emit('eidtToBets', false)
        //   this.$store.dispatch('setclearBetsNum', false)
        // }
      }
      let textBetsArr = [];
      lifeArr.filter(v => {
        textBetsArr.push(v.split(' ').join('-'))
      })
      
      this.$emit('sendBetsNumber', {data: [], betsNumber: textBetsArr.join('|')})
      var bets = lifeArr.length || 0;
      this.$store.dispatch('setBets', bets * opArrLen);

      // this.betsArr.data = lifeArr;
      // var bets = lifeArr.length || 0;
      // this.$store.dispatch('setBets', bets * opArrLen);
    },
    // 帮助
    handleHelp() {},
    // 清理错误与重复
    cleanErrorRepeat() {
      this.syxw_checkBetsText(true)
    },
    // 清空文本框
    cleanBetsText() {
      this.betsNumber = '';
    },
  },
}
</script>
<style lang="scss" scoped>
.syxw-wrap{
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
}
</style>


