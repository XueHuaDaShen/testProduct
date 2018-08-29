<template>
  <div>
    <div class="bets-area-wrap ssc" v-if="lotteryType==='ssc'">
      <div class="optional-oprate" v-if="checkBit">
        <span @click="handleClickLabel(k, i)" :class="setIsChecked(k)?'checked':''" v-for="(k, i) in optionalArr" :key="i">
          <input :checked="setIsChecked(k)" type="checkbox">{{k}}位</span>
      </div>
      <div class="bets-wrap" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type!=='guts'&&betsArr.type!=='special'&&betsArr.type!=='sizeDouble'&&betsArr.type!=='interest'&&betsArr.type!=='tiger-end'">
          <b class="bets-num" :class="checkInStyle(item, i)" @click="handleClickBetsNum(item, k, balls, index, i)" v-for="(k, i) in balls" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='guts'">
          <b class="bets-num" :class="checkInStyle(item, i)" @click="handleGutsClick(item, k, balls)" v-for="(k, i) in balls" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap" style="padding-left:67px;padding-right:100px;" v-if="betsArr.item.oprateBtn==='bottom'">
          <b class="bets-num" style="font-size:20px;" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, andArr, index, i)" v-for="(k, i) in andArr" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap special-wrap" style="padding-left:165px;" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='special'">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, specialArr, index, i)" v-for="(k, i) in specialArr" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='sizeDouble'">
          <b class="bets-num" style="font-size:20px;font-weight:bold" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, sizeDouble, index, i)" v-for="(k, i) in sizeDouble" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='tiger-end'">
          <b class="bets-num" style="font-size:20px;font-weight:bold" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, tiger, index, i)" v-for="(k, i) in tiger" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap special-num-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='interest'">
          <b class="special-bets-num bets-num" v-if="(betsArr.data.length===5)?index<2:index<1" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, interestArr, index, i)" v-for="(k, i) in interestArr" :key="i">{{k}}</b>
          <div class="shuzi">
            <b class="bets-num" v-if="(betsArr.data.length===5)?index>1:index>0" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, balls, index, i)" v-for="(k, i) in balls" :key="i">{{k}}</b>
          </div>
        </div>
        <oprateBtn class="oprate-components" v-if="showOprateBtn&&betsArr.type!=='interest'" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="betsArr.item.oprateBtn==='bottom'?andArr:''" :len="betsArr.item.oprateBtn==='bottom'?andArr.length:10"
          :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
        <oprateBtn class="oprate-components" v-if="showOprateBtn&&betsArr.type==='interest'&&((betsArr.data.length===5)?index>1:index>0)" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="betsArr.item.oprateBtn==='bottom'?andArr:''"
          :len="betsArr.item.oprateBtn==='bottom'?andArr.length:10" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div class="vertical-oprate" v-for="(item, index) in betsArr.data" :key="(index+1)" v-if="betsArr.item.vertOprate&&index===(betsArr.data.length-1)">
        <div class="vertical-oprate-wrap" v-for="(k, i) in balls" :key="i">
          <span class="oprate-btn" :class="{'active':(0 === active && getIndexVer[i])}" @click="handleVertAllClick(betsArr.data, i, 0)">全</span>
          <span class="oprate-btn" :class="{'active':(1 === active && getIndexVer[i])}" @click="handleVertCleanClick(betsArr.data, i, 1)">清</span>
        </div>
      </div>
    </div>
    <div class="bets-area-wrap pks" v-if="lotteryType==='pks'">
      <div class="optional-oprate" v-if="checkBit">
        <span @click="handleClickLabel(k, i)" :class="setIsChecked(k)?'checked':''" v-for="(k, i) in optionalArr" :key="i">
          <input :checked="setIsChecked(k)" type="checkbox">{{k}}位</span>
      </div>
      <div class="bets-wrap" v-if="betsArr.type.indexOf('ranking') < 0 && betsArr.type.indexOf('tiger') < 0" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <!-- <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type!=='guts'&&betsArr.type!=='special'&&betsArr.type!=='sizeDouble'">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, pks_balls)" v-for="(k, i) in pks_balls" :key="i">{{k}}</b>
        </div> -->
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type.indexOf('guanyahe') < 0&&betsArr.type!=='sizeDouble'">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, pks_balls, index, i)" v-for="(k, i) in pks_balls" :key="i">{{k}}</b>
        </div>
        <!-- <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='bottom'&&betsArr.type.indexOf('end')">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, andArr)" v-for="(k, i) in andArr" :key="i">{{k}}</b>
        </div> -->
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='bottom'&&betsArr.type.indexOf('guanyahe') > -1">
          <b class="bets-num" style="margin-left:5px;" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, guanyahe, index, i)" v-for="(k, i) in guanyahe" :key="i">{{k}}</b>
        </div>
        <div class="bets-number-wrap" v-if="betsArr.item.oprateBtn==='right'&&betsArr.type==='sizeDouble'">
          <b class="bets-num" style="font-size:20px;font-weight:bold" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, sizeDouble, index, i)" v-for="(k, i) in sizeDouble" :key="i">{{k}}</b>
        </div>
        <oprateBtn class="oprate-components" v-if="showOprateBtn&&betsArr.type!=='interest'" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="pks_balls" :len="pks_balls.length" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item"
          @sendBallsArr="handlesendBallsArr"></oprateBtn>
        <oprateBtn class="oprate-components" v-if="showOprateBtn&&betsArr.type==='interest'&&((betsArr.data.length===5)?index>1:index>0)" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="pks_balls" :len="pks_balls.length" :betsIndex="index"
          :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div class="bets-wrap ranking-wrap" v-if="betsArr.type.indexOf('ranking') > -1">
        <div>
          <div v-if="index<5" v-for="(item, index) in betsArr.data" :key="index">
            <strong class="bets-title">{{item.title}}</strong>
            <div class="bets-number-wrap">
              <b class="bets-num" style="font-size:20px;font-weight:bold" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, sizeDouble, index, i)" v-for="(k, i) in sizeDouble" :key="i">{{k}}</b>
            </div>
          </div>
        </div>
        <div>
          <div v-if="index>4" v-for="(item, index) in betsArr.data" :key="index">
            <strong class="bets-title">{{item.title}}</strong>
            <div class="bets-number-wrap">
              <b class="bets-num" style="font-size:20px;font-weight:bold" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, sizeDouble, index, i)" v-for="(k, i) in sizeDouble" :key="i">{{k}}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="bets-wrap special-num-wrap" v-if="betsArr.type.indexOf('tiger') > -1" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap tiger-and-value-par">
          <b :style="index===i?'visibility: hidden;':''" class="tiger-and-value" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, tigerArr[index], index, i)" v-for="(k, i) in tigerArr[index]" :key="i">{{k.split('-')[0]+'龙'+k.split('-')[1]+'虎'}}</b>
        </div>
        <oprateBtn class="oprate-components float-right" :type="'pks-tiger'" :ballsArr="tigerArr[index]" :len="tigerArr[index].length" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div class="vertical-oprate" v-for="(item, index) in betsArr.data" :key="(index+1)" v-if="betsArr.item.vertOprate&&index===(betsArr.data.length-1)">
        <div class="vertical-oprate-wrap" v-for="(k, i) in balls" :key="i">
          <span class="oprate-btn" :class="{'active':(0 === active && getIndexVer[i])}" @click="handleVertAllClick(betsArr.data, i, 0)">全</span>
          <span class="oprate-btn" :class="{'active':(1 === active && getIndexVer[i])}" @click="handleVertCleanClick(betsArr.data, i, 1)">清</span>
        </div>
      </div>
    </div>
    <div class="bets-area-wrap syxw" v-if="lotteryType==='syxw'">
      <div class="optional-oprate" v-if="checkBit">
        <span @click="handleClickLabel(k, i)" :class="setIsChecked(k)?'checked':''" v-for="(k, i) in optionalArr" :key="i">
          <input :checked="setIsChecked(k)" type="checkbox">{{k}}位</span>
      </div>
      <div v-if="betsArr.type!=='dantuo'&&betsArr.type.indexOf('interest')<0&&betsArr.type.indexOf('cai')<0" class="bets-wrap" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, syxw, index, i)" v-for="(k, i) in syxw" :key="i">{{k}}</b>
        </div>
        <oprateBtn class="oprate-components" v-if="showOprateBtn" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="syxw" :len="syxw.length" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div v-if="betsArr.type.indexOf('cai')>-1" class="bets-wrap" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap">
          <b class="bets-num" v-if="i>1&&i<9" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, syxw, index, i)" v-for="(k, i) in syxw" :key="i">{{k}}</b>
        </div>
        <oprateBtn class="oprate-components" v-if="showOprateBtn" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="syxw" :len="syxw.length" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div v-if="betsArr.type==='dantuo'" class="bets-wrap" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap">
          <b class="bets-num" :class="checkInStyle(item, k)" @click="handleClickDanTuoBetsNum(item, k, index)" v-for="(k, i) in syxw" :key="i">{{k}}</b>
        </div>
        <oprateBtn class="oprate-components" v-if="showOprateBtn&&index!==0" :class="betsArr.item.oprateBtn==='right'?'float-right':'float-bottom'" :ballsArr="syxw" :len="syxw.length" :betsIndex="index" :betsArr="betsArr" :betsType="betsArr.item" @sendBallsArr="handlesendBallsArr"></oprateBtn>
      </div>
      <div v-if="betsArr.type.indexOf('interest')>-1" class="bets-wrap" v-for="(item, index) in betsArr.data" :key="index">
        <strong class="bets-title">{{item.title}}</strong>
        <div class="bets-number-wrap special-num-wrap">
          <b class="bets-num special-bets-num" :class="checkInStyle(item, k)" @click="handleClickBetsNum(item, k, dingDS, index, i)" v-for="(k, i) in dingDS" :key="i">{{k}}</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import oprateBtn from './oprateBtn';
  import lottery from '../../static/lottery';
  export default {
    name: 'betsAreaTen',
    props: {
      betsArr: {
        type: Object,
        required: true
      },
      lotteryType: {
        type: String,
      }
    },
    computed: {
      getIndexVer() {
        return this.$store.state.oprate_index_ver;
      },
    },
    components: {
      oprateBtn
    },
    created() {
      var valueLen = 1;
      var checkLen = ['十', '个']
      var isDouble = true;
      var area;
      const vm = this;
      for (let i = 3; i < 20; i++) {
        this.guanyahe.push(i.toString())
      }
      for (let i = 1; i < 12; i++) {
        if (i < 10) {
          vm.syxw.push('0' + i)
        } else {
          vm.syxw.push(i.toString())
        }
      }
      try {
        valueLen = this.betsArr.item.valueLen;
        isDouble = this.betsArr.item.isDouble;
        area = this.betsArr.item.area;
        this.danNum = this.betsArr.item.danNum;
        this.checkBit = this.betsArr.item.checkBit;
        this.isCheckOptional = this.betsArr.item.checkLen
        this.showOprateBtn = this.betsArr.item.showOprateBtn;
      } catch (e) {}
      this.andArr = [];
      if (isDouble) {
        for (let i = 0; i <= valueLen * 9; i++) {
          this.andArr.push(i);
        }
      } else {
        for (let i = 1; i < valueLen * 9; i++) {
          this.andArr.push(i);
        }
      }
      if (area === 'interest') {
        this.interestArr = this.interest;
      } else {
        this.interestArr = this.interestArea;
      }
      for (let i = 1; i < 11; i++) {
        let arr = [];
        for (let j = 1; j < 11; j++) {
          arr.push(i + '-' + j)
        }
        this.tigerArr.push(arr);
      }
      var count = 2;
      if (this.checkBit) {
        this.$emit('sendWei', this.isCheckOptional);
      }
    },
    data() {
      return {
        active: -1,
        balls: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        pks_balls: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        tigerArr: [],
        syxw: [],
        specialArr: ['豹子', '顺子', '对子'],
        sizeDouble: ['大', '小', '单', '双'],
        tiger: ['龙', '虎', '和'],
        interestArr: [],
        interest: ['小(0-4)', '大(5-9)'],
        interestArea: ['一区(0,1)', '二区(2,3)', '三区(4,5)', '四区(6,7)', '五区(8,9)'],
        dingDS: ['5单0双', '4单1双', '3单2双', '2单3双', '1单4双', '0单5双'],
        optionalArr: ['万', '千', '百', '十', '个'],
        andArr: [],
        isCheckOptional: [],
        checkBit: false,
        showOprateBtn: true,
        danNum: 2,
        lastPush: '',
        guanyahe: [],
      }
    },
    methods: {
      checkInStyle(item, val) {
        let s = '';
        let v = '';
        val = val.toString();
        if (val.indexOf('区') > -1) {
          v = val.slice(0, 2)
        } else if (val.indexOf('(') > -1) {
          v = val.slice(0, 1)
        } else {
          v = val
        }
        // console.log('判断数字------------',item, v)
        if (item.data.indexOf(v.toString()) > -1) {
          s = 'balls-number-active'
        } else {
          s = ''
        }
        return s;
      },
      handleClickBetsNum(item, i, arr, index_hor, index_ver) {
        let o = {};
        o[index_hor] = false;
        let o2 = {};
        o2[index_ver] = false;
        this.$store.dispatch('setOprateIndexHor', o);
        this.$store.dispatch('setOprateIndexVer', o2);
        let filterArr = [];
        // console.log(arr)
        // console.log('i---',i)
        // console.log('item----',item)
        arr.filter(v => {
          filterArr.push(v.toString().replace(/\(\d\W\d\)/g, function() { return '' }))
        })
        // console.log(item, val)
        let val = i.toString().replace(/\(\d\W\d\)/g, function() { return '' });
        let index = item.data.indexOf(val);
        // console.log('选中某一个数字------------',val)
        if (index > -1) {
          item.data.splice(index, 1);
        } else {
          item.data.push(val);
        }
        item.data.sort((a, b) => {
          let ai = filterArr.indexOf(a);
          let bi = filterArr.indexOf(b);
          return ai - bi;
        })
        // item.data.sort((a, b) => {
        //   return a-b
        // })
        // console.log(item.data)
        // if(this.lotteryType === 'pks'){
        this.$emit('sendProb', true)
        // }
        this.setBets(this.betsArr.data);
      },
      handleClickDanTuoBetsNum(item, i, itemIndex) {
        const vm = this;
        // console.log(item)
        let index = item.data.indexOf(i);
        if (itemIndex === 0) {
          if (index > -1) {
            item.data.splice(index, 1);
          } else {
            if (item.data.length >= vm.danNum) {
              let lastIndex = item.data.indexOf(this.lastPush);
              if (lastIndex > -1) {
                item.data[lastIndex] = i
              }
            } else {
              item.data.push(i);
            }
          }
          itemIndex = 1;
          this.lastPush = i;
        } else {
          if (index > -1) {
            item.data.splice(index, 1);
          } else {
            item.data.push(i);
          }
          itemIndex = 0;
        }
        item.data.sort((a, b) => {
          return a - b
        })
        // itemIndex = itemIndex === 0?1:0;
        item.data.filter(v => {
          let nIndex = vm.betsArr.data[itemIndex].data.indexOf(v);
          if (nIndex > -1) {
            vm.betsArr.data[itemIndex].data.splice(nIndex, 1);
          }
        })
        this.setBets(this.betsArr.data);
      },
      handleGutsClick(item, i) {
        let index = item.data.indexOf(i);
        if (index > -1) {
          item.data.splice(index, 1);
        } else {
          item.data = [];
          item.data.push(i);
        }
        this.setBets(this.betsArr.data);
      },
      handlesendBallsArr(req) {
        const vm = this;
        const data = req
        let index = data.index;
        let arr = data.data;
        vm.betsArr.data[index].data = arr;
        if (vm.betsArr.type === 'dantuo') {
          vm.betsArr.data[index].data.filter(v => {
            let nIndex = vm.betsArr.data[0].data.indexOf(v);
            if (nIndex > -1) {
              vm.betsArr.data[0].data.splice(nIndex, 1)
            }
          })
        }
        vm.setBets(vm.betsArr.data);
      },
      handleVertAllClick(data, i, index_ver) {
        this.active = index_ver;
        let o = {};
        o[i] = true;
        this.$store.dispatch('setOprateIndexVer', o);
        let val = i.toString()
        data.filter(v => {
          let index = v.data.indexOf(val);
          if (index < 0) {
            v.data.push(val);
          }
          v.data.sort((a, b) => {
            return a - b
          })
        })
        this.setBets(this.betsArr.data);
      },
      handleVertCleanClick(data, i, index_ver) {
        this.active = index_ver;
        let o = {};
        o[i] = true;
        this.$store.dispatch('setOprateIndexVer', o);
        let val = i.toString()
        data.filter(v => {
          let index = v.data.indexOf(val);
          if (index > -1) {
            v.data.splice(index, 1);
          }
          v.data.sort((a, b) => {
            return a - b
          })
        })
        this.setBets(this.betsArr.data);
      },
      setIsChecked(k) {
        var val = false;
        if (this.isCheckOptional.indexOf(k) > -1) {
          val = true
        } else {
          val = false;
        }
        return val
      },
      handleClickLabel(k) {
        const vm = this;
        var index = this.isCheckOptional.indexOf(k);
        var valueLen = this.betsArr.item.valueLen;
        if (index > -1) {
          if (this.isCheckOptional.length < (valueLen + 1)) {
            this.isCheckOptional.splice(index, 1)
            this.isCheckOptional.push(k);
          } else {
            this.isCheckOptional.splice(index, 1)
          }
        } else {
          this.isCheckOptional.push(k);
        }
        let arr1 = [];
        this.isCheckOptional.filter(v => {
          if (v === '万') arr1.push({ val: 5, text: v });
          if (v === '千') arr1.push({ val: 4, text: v });
          if (v === '百') arr1.push({ val: 3, text: v });
          if (v === '十') arr1.push({ val: 2, text: v });
          if (v === '个') arr1.push({ val: 1, text: v });
        })
        let arr2 = [];
        arr1.sort((a, b) => { return b.val - a.val }).filter(v => { arr2.push(v.text) })
        // console.log(arr2)
        this.$emit('sendWei', arr2);
        this.setBets(this.betsArr.data);
      },
      setBets(data) {
        // console.log(data)
        const vm = this;
        const unit = this.betsArr.item.unit;
        const type = this.betsArr.item.type;
        var isDouble;
        var betsMode = this.betsArr.item.betsMode;
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        var arr4 = [];
        var arr5 = [];
        var bets = 0;
        if (type === 'compound') {
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          bets = lottery.compound(arr1, unit);
        } else if (type.indexOf('single') > -1) {
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          bets = lottery.groupSelectOne(arr1[0], betsMode, unit);
        } else if (type.indexOf('double') > -1) {
          var n1 = Number(this.betsArr.item.doubleArr[0]);
          var n2 = Number(this.betsArr.item.doubleArr[1]);
          arr1 = data[0].data;
          arr2 = data[1].data;
          if (n1 === 1) {
            bets = lottery.groupSelectTwoNum(arr1, arr2, n2);
          } else {
            bets = lottery.groupSelectTwoNum(arr2, arr1, n1);
          }
        } else if (type === 'three') {
          arr1 = data[0].data;
          arr2 = data[1].data;
          arr3 = data[2].data;
          bets = lottery.groupSelectThreeNum(arr1, arr2, arr3);
        } else if (type === 'four') {
          arr1 = data[0].data;
          arr2 = data[1].data;
          arr3 = data[2].data;
          arr4 = data[3].data;
          bets = lottery.groupSelectFourNum(arr1, arr2, arr3, arr4);
        } else if (type === 'five') {
          arr1 = data[0].data;
          arr2 = data[1].data;
          arr3 = data[2].data;
          arr4 = data[3].data;
          arr5 = data[4].data;
          bets = lottery.groupSelectFiveNum(arr1, arr2, arr3, arr4, arr5);
        } else if (type === 'dantuo') {
          arr1 = data[0].data;
          arr2 = data[1].data;
          bets = lottery.countDanTuo(arr1, arr2, vm.danNum);
        } else if (type === 'diff') {
          var valueLen = this.betsArr.item.valueLen;
          arr1 = data[0].data;
          // console.log(valueLen,arr1)
          bets = lottery.dValue(arr1, valueLen);
        } else if (type === 'end') {
          arr1 = data[0].data;
          bets = lottery.valueEnd(arr1);
        } else if (type === 'special') {
          arr1 = data[0].data;
          bets = lottery.valueEnd(arr1);
        } else if (type === 'guts') {
          var valueLen = this.betsArr.item.valueLen;
          arr1 = [];
          data[0].data.filter(v => {
            arr1.push(Number(v))
          })
          bets = lottery.guts(arr1, valueLen);
        } else if (type === 'and') {
          var valueLen = this.betsArr.item.valueLen;
          isDouble = this.betsArr.item.isDouble;
          arr1 = data[0].data;
          if (isDouble) {
            bets = lottery.sunOfValue(arr1, valueLen)
          } else {
            bets = lottery.groupSunOfValue(arr1, valueLen)
          }
        } else if (type === 'position') {
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          bets = lottery.pos(arr1);
        } else if (type === 'sizeDouble') {
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          bets = lottery.compound(arr1, unit);
        } else if (type === 'interest') {
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          bets = lottery.compound(arr1, unit);
        } else if (type === 'optional') {
          var betsMode = this.betsArr.item.betsMode;
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          if (betsMode === 2) {
            bets = lottery.optionalOne(arr1);
          } else if (betsMode === 3) {
            bets = lottery.optionalTwo(arr1);
          } else if (betsMode === 4) {
            bets = lottery.optionalThree(arr1);
          }
        } else if (type.split('-')[1] === 'and') {
          var valueLen = this.betsArr.item.valueLen;
          isDouble = this.betsArr.item.isDouble;
          arr1 = data[0].data;
          var num1, num2;
          if (isDouble) {
            num1 = lottery.sunOfValue(arr1, valueLen)
          } else {
            num1 = lottery.groupSunOfValue(arr1, valueLen)
          }
          num2 = lottery.groupSelectOne(this.isCheckOptional.length, valueLen, unit);
          bets = num1 * num2;
        } else if (type === 'optional-compound') {
          var valueLen = this.betsArr.item.valueLen;
          var betsMode = this.betsArr.item.betsMode;
          var num1, num2;
          for (let i in data) {
            arr1.push(data[i].data.length)
          }
          num1 = lottery.groupSelectOne(arr1[0], betsMode, unit);
          num2 = lottery.groupSelectOne(this.isCheckOptional.length, valueLen, unit);
          bets = num1 * num2;
        } else if (type === 'optional-group') {
          var n1 = Number(this.betsArr.item.doubleArr[0]);
          var n2 = Number(this.betsArr.item.doubleArr[1]);
          var valueLen = this.betsArr.item.valueLen;
          arr1 = data[0].data;
          arr2 = data[1].data;

          var num1, num2;
          num1 = lottery.groupSelectOne(this.isCheckOptional.length, valueLen, unit);
          if (n1 === 1) {
            num2 = lottery.groupSelectTwoNum(arr1, arr2, n2);
          } else {
            num2 = lottery.groupSelectTwoNum(arr2, arr1, n1);
          }
          bets = num1 * num2;
        } else if (type.split('-')[1] === 'end') {
          if (type.split('-')[0] === 'pks') {
            arr1 = data;
            let b = 0;
            arr1.filter(v => {
              b += v.data.length
            })
            bets = b;
          } else {
            arr1 = data[0].data;
            bets = lottery.valueEnd(arr1);
          }
        } else if (type.split('-')[1] === 'value') {
          arr1 = data[0].data;
          bets = lottery.valueEnd(arr1);
        } else if (type === 'pks-tiger-end') {
          arr1 = data;
          let b = 0;
          arr1.filter(v => {
            b += v.data.length
          })
          bets = b;
        } else if (type === 'ranking') {
          arr1 = data;
          let b = 0;
          arr1.filter(v => {
            b += v.data.length
          })
          bets = b;
        }

        this.$store.dispatch('setBets', bets);
      },
      initData() {
        this.betsArr.data.filter(v => {
          v.data = [];
        })
        this.setBets(this.betsArr.data);
      }
    },
    mounted() {
      // this.initData();
    }
  }
</script>

<style scoped lang="scss">
  .bets-area-wrap {
    width: 100%;
    padding-top: 8px;
    border-top: 1px solid #DDDDDD;
  }

  .bets-area-wrap .bets-wrap {
    width: 100%;
    color: #333;
    margin-top: 8px;
    width: 100%;
    color: #333;
    position: relative;
    display: table;
  }

  .bets-wrap .bets-title {
    display: block;
    width: 55px;
    margin-right: 5px;
    font-size: 16px;
    font-weight: 800;
    text-align: left;
    float: left;
    margin-top: 6px;
    color: #000;
  }

  .bets-wrap .bets-number-wrap {
    float: left; // max-width:420px;
  }

  .tiger-and-value-par {
    min-width: 80%;
  }

  .bets-wrap .optional-single-title {
    margin-top: 35px;
  }

  .syxw .bets-num {
    margin-left: 4px;
    font-size: 20px;
  }

  .syxw .bets-num:first-child {
    margin: 0;
  }

  .tiger-and-value {
    display: block;
    width: 58px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    text-indent: 0px;
    text-indent: -4px\9;
    text-align: center;
    color: #4F4F4F;
    font-size: 12px;
    outline: none;
    background-image: linear-gradient(-180deg, #FFFFFF 0%, #BCBCBC 100%);
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    font-weight: bold;
    margin-left: 6px;
    cursor: pointer;
    float: left;
    margin-bottom: 8px;
  }

  .bets-num {
    display: block;
    width: 36px;
    height: 36px;
    line-height: 34px;
    text-indent: 0px;
    text-indent: -4px\9;
    text-align: center;
    font-size: 24px;
    color: #4F4F4F;
    outline: none;
    background-image: linear-gradient(-180deg, #FFFFFF 5%, #BCBCBC 97%);
    border: 1px solid #DDDDDD;
    /* border:1px solid #E1C79B;
  box-shadow:1px 2px 6px rgba(0,0,0,0.19); */
    border-radius: 50%;
    font-weight: 500;
    margin-left: 8px;
    cursor: pointer;
    float: left;
    margin-bottom: 8px; // background:url('../img/balls.png') no-repeat left;
    // background-size:100% 100%;
  }

  .ranking-wrap {
    width: 100%;
  }

  .ranking-wrap>div {
    width: 50%;
    float: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .ranking-wrap>div>div {
    width: 100%
  }

  .float-right {
    float: right;
  }

  .float-bottom {
    width: 100%;
    padding-left: 70px;
    padding-top: 10px;
  }

  .vertical-oprate {
    width: 100%;
    padding-left: 60px;
    padding-top: 7px;
    display: -webkit-box;
  }

  .vertical-oprate-wrap {
    width: 36px;
    margin-left: 8px;
    text-align: center;
    span.active {
      color: #fff;
      background-image: -webkit-gradient(linear, left top, left bottom, color-stop(5%, #DBB894), color-stop(97%, #7C5D3C));
      background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
      border: 1px solid #DBB894;
    }
  }

  .vertical-oprate-wrap span {
    margin-top: 5px;
    float: inherit;
    &:hover {
      color: #fff;
      background-image: -webkit-gradient(linear, left top, left bottom, color-stop(5%, #DBB894), color-stop(97%, #7C5D3C));
      background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
      border: 1px solid #DBB894;
    }
  }

  .oprate-btn {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 29px;
    text-indent: 0px;
    text-indent: -4px\9;
    text-align: center;
    color: #4F4F4F;
    font-size: 14px;
    outline: none;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    /* box-shadow:1px 2px 6px rgba(0,0,0,0.19); */
    border-radius: 50%;
    font-weight: 500;
    margin-top: 4px;
    cursor: pointer;
  }

  .optional-oprate {
    display: -webkit-box;
    -webkit-box-pack: end;
    width: 100%;
    text-align: right;
    padding: 15px 0;
    color: #333;
  }

  .optional-oprate>span {
    cursor: pointer;
    border: 1px solid #ccc;
    background: #eee;
    padding: 5px 10px;
    margin-right: 7px;
    border-radius: 15px;
    font-size: 12px;
  }

  .optional-oprate>span.checked {
    background: #D4914D;
    color: #fff;
    border: none;
  }

  .optional-oprate>span>input {
    margin-right: 3px;
    vertical-align: middle;
  }

  .bets-wrap b.balls-number-active {
    color: #fff;
    /* background:rgba(220,133,44,1);
  box-shadow:1px 2px 6px rgba(102,66,1,0.19); */
    /* background: url('../img/ballsed.png') no-repeat left;
    background-size: 100% 100%; */
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    border: 1px solid #DBB894;
  }

  .bets-wrap b.bets-num:hover {
    color: #fff;
    /* border: 1px solid #D4914D; */
    /* box-shadow:1px 2px 6px rgba(0,0,0,0.19); */
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    border: 1px solid #DBB894;
  }

  /* .bets-wrap b.balls-number-active:hover {
    color: #fff;
    border: none;
  } */

  .special-wrap {
    padding-left: 90px;
  }

  .special-wrap .bets-num {
    width: 72px;
    height: 36px;
    font-size: 18px;
    font-weight: bold;
    background-image: linear-gradient(-180deg, #FFFFFF 0%, #BCBCBC 99%);
    border: 1px solid #DDDDDD;
    border-radius: 100px;
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.19);
  }

  .bets-wrap .special-wrap b.balls-number-active {
    color: #fff;
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    border: 1px solid #DBB894;
    box-shadow: 1px 2px 6px rgba(102, 66, 1, 0.19);
  }

  .bets-wrap .special-bets-num {
    // border-radius:25px;
    width: 108px;
    background-image: linear-gradient(-180deg, #FFFFFF 0%, #BCBCBC 99%);
    border: 1px solid #DDDDDD;
    border-radius: 100px;
    font-size: 18px;
    box-shadow: 1px 2px 6px rgba(102, 66, 1, 0.19);
  }

  .bets-wrap .special-num-wrap .shuzi b.balls-number-active {
    color: #fff;
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    border: 1px solid #DBB894;
    box-shadow: 1px 2px 6px rgba(102, 66, 1, 0.19);
  }

  .bets-wrap .special-num-wrap b.balls-number-active {
    color: #fff;
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    border: 1px solid #DBB894;
    box-shadow: 1px 2px 6px rgba(102, 66, 1, 0.19);
  }

  .and-wrap {
    padding-right: 35%;
    padding-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
  }

  .and-wrap .bets-num {
    margin-bottom: 5px;
  }

  .optional-and-wrap {
    padding-top: 40px;
  }

  .optional-single-wrap {
    padding-bottom: 0;
    padding-top: 40px;
  }
</style>