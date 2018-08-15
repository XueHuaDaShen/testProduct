<template>
  <div class="public-date-view">
    <div class="date-bj"></div>
    <div class="date-slect-wrap">
      <div class="date-header">
        <span @click="cancelSelectTime">取消</span>
        <span class="confirm" @click="getSelectedTime">确定</span>
      </div>
      <div class="date-time-wrap" :id="datetimeWrapId">
        <div class="date-time-item">
          <div class="date-time-item-box" :style="{transform: 'translate3d(0px, '+(3*h-years.indexOf(currYear)*h)+'px, 0px)'}" @touchstart="handleMousedown($event, 0)" @touchmove="handleMousemove($event, 'years', 0)" @touchend="handleMouseend($event, 'years', 0)">
            <span v-for="(item, i) in years" :key="i.toString()">{{item}} 年</span>
          </div>
        </div>
        <div class="date-time-item">
          <div class="date-time-item-box" :style="{transform: 'translate3d(0px, '+(3*h-months.indexOf(currMonth)*h)+'px, 0px)'}" @touchstart="handleMousedown($event, 1)" @touchmove="handleMousemove($event, 'months', 1)" @touchend="handleMouseend($event, 'months', 1)">
            <span v-for="(item, i) in months" :key="i.toString()">{{item}} 月</span>
          </div>
        </div>
        <div class="date-time-item">
          <div class="date-time-item-box" :style="{transform: 'translate3d(0px, '+(3*h-dates.indexOf(currDate)*h)+'px, 0px)'}" @touchstart="handleMousedown($event, 2)" @touchmove="handleMousemove($event, 'dates', 2)" @touchend="handleMouseend($event, 'dates', 2)">
            <span v-for="(item, i) in dates" :key="i.toString()">{{item}} 日</span>
          </div>
        </div>
        <div class="date-time-item" v-if="timeType.split(' ').length>1">
          <div class="date-time-item-box" :style="{transform: 'translate3d(0px, '+(3*h-hours.indexOf(currHour)*h)+'px, 0px)'}" @touchstart="handleMousedown($event, 3)" @touchmove="handleMousemove($event, 'hours', 3)" @touchend="handleMouseend($event, 'hours', 3)">
            <span v-for="(item, i) in hours" :key="i.toString()">{{item}} 时</span>
          </div>
        </div>
        <div class="date-time-item" v-if="timeType.split(' ').length>1">
          <div class="date-time-item-box" :style="{transform: 'translate3d(0px, '+(3*h-minutes.indexOf(currMin)*h)+'px, 0px)'}" @touchstart="handleMousedown($event, 4)" @touchmove="handleMousemove($event, 'minutes', 4)" @touchend="handleMouseend($event, 'minutes', 4)">
            <span v-for="(item, i) in minutes" :key="i.toString()">{{item}} 分</span>
          </div>
        </div>
        <div class="yd-datetime-shade"></div>
        <div class="yd-datetime-indicator">
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'publicDateView',
  props: {
    datetime: {
      type: String,
      default: ''
    },
    timeType: {
      type: String,
      default: 'yyyy-mm-dd'
    },
    year: {
      type: String,
      default: '1900-2200'
    },
    callback: {
      type: Function,
      required: true
    },
    datetimeWrapId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      h: '38', // px

      sy: 0,

      currEl: null, // 当前元素
      elTrans: 0, // 元素的 transform 值
      setTrans: 0, // 要设置的 transform 值

      years: [], // 年 月 日 时 分 数组
      months: [],
      dates: [],
      hours: [],
      minutes: [],


      memoryYear: '', // 记录传进来的 年 月 日 时 分
      memoryMonth: '',
      memoryDate: '',
      memoryHour: '',
      memoryMin: '',

      currYear: '', // 当前 年 月 日 时 分
      currMonth: '',
      currDate: '',
      currHour: '',
      currMin: '',
    }
  },
  created() {
    this.getNowTime();
    this.initDatetime();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取现在的时间
    getNowTime() {
      // let timeArr = this.datetime.split(' ');
      let time;
      time = new Date()
      if(this.datetime){
        time = new Date(this.datetime)
      }
      let y = time.getFullYear().toString();
      let MM = this.formatHms(time.getMonth()+1);
      let d = this.formatHms(time.getDate());
      let h = this.formatHms(time.getHours());
      let m = this.formatHms(time.getMinutes());
      let s = this.formatHms(time.getSeconds());

      // console.log(this.datetime)
      // console.log(time)
      // console.log(y,MM,d,h,m,s)
      if(this.datetime){
        this.memoryYear = y;
        this.memoryMonth = MM
        this.memoryDate = d
        this.memoryHour = h
        this.memoryMin = m
      }

      this.currYear = y;
      this.currMonth = MM
      this.currDate = d
      this.currHour = h
      this.currMin = m
    },
    formatHms(t) {
      let val;
      if(t<10){
        val = '0'+t
      }else{
        val = t.toString()
      }
      return val
    },
    // 初始化 时间数组
    initDatetime() {
      // let datetime = this.datetime.split('-');
      this.initYear();
      this.initMonth();
      this.initDate();
      this.initHour();
      this.initMin();
    },
    initYear() {
      this.years = [];
      let year = this.year.split('-');
      let start_year = year[0];
      let end_year = year[1];

      for(let i=start_year; i<=end_year; i++){
        this.years.push(i.toString())
      }
    },
    initMonth() {
      this.months = [];
      for(let i=1; i<=12; i++){
        this.months.push(this.formatHms(i));
      }
    },
    initDate() {
      this.dates = [];
      let y = Number(this.currYear);
      let m = Number(this.currMonth);
      if(m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12){
        for(let i=1; i<=31; i++){
          this.dates.push(this.formatHms(i));
        }
      }else if(m === 4 || m === 6 || m === 9 || m === 11){
        for(let i=1; i<31; i++){
          this.dates.push(this.formatHms(i));
        }
      }else{
        if(y%4 === 0){
          for(let i=1; i<=29; i++){
            this.dates.push(this.formatHms(i));
          }
        }else{
          for(let i=1; i<29; i++){
            this.dates.push(this.formatHms(i));
          }
        }
      }
    },
    initHour() {
      this.hours = [];
      for(let i=1; i<24; i++){
        this.hours.push(this.formatHms(i))
      }
    },
    initMin() {
      this.minutes = [];
      for(let i=1; i<60; i++){
        this.minutes.push(this.formatHms(i))
      }
    },
    // 按下元素
    handleMousedown(e, index) {
      e.stopPropagation();
      e.preventDefault();
      // console.log(e.touches[0].clientY)
      this.sy = e.touches[0].clientY;
      this.currEl = document.getElementById(this.datetimeWrapId).getElementsByClassName('date-time-item-box')[index];
      this.currEl.setAttribute('class','date-time-item-box')
      if(this.currEl.style.transform){
        this.elTrans = this.currEl.style.transform.replace(/[\s\,]/g,()=>{return ''}).split('px')[1];
      }else{
        this.elTrans = 0;
      }
    },
    // 滑动
    handleMousemove(e, arr, index) {
      e.stopPropagation();
      e.preventDefault();
      let h = this.h;
      let maxTrans = 3*this.h;
      let minTrans = 4*this.h - (this[arr].length*this.h);
      let diff = e.touches[0].clientY - this.sy;
      let trans = Number(this.elTrans) + Number(diff)
      if(trans > maxTrans){
        trans = maxTrans + this.h/this.h
      }else if(trans < minTrans){
        trans = minTrans + this.h/(this.h+this.h)
      }
      this.currEl.style = 'transform: translate3d(0px, '+trans+'px, 0px);'
      this.setTrans = trans;
    },
    // 松开
    handleMouseend(e, item) {
      e.stopPropagation();
      e.preventDefault();
      const vm = this;
      let oldCurrYear = this.currYear;
      let oldCurrMonth = this.currMonth;

      let trans = Math.floor(vm.setTrans/vm.h)*vm.h;
      let index = (3*this.h-trans)/this.h;

      // console.log(this.setTrans)
      this.currEl.setAttribute('class','date-time-item-box tansform-end')
      setTimeout(() => {
        vm.currEl.style = 'transform: translate3d(0px, '+trans+'px, 0px);'
      }, 100);
      
      if(item === 'years'){
        this.currYear = this[item][index];
        if(oldCurrYear !== this.currYear){
          if(Number(this.currMonth) === 2){
            this.initDate();
          }
        }
      }else if(item === 'months'){
        this.currMonth = this[item][index]
        if(oldCurrMonth !== this.currMonth){
          this.currDate = '01';
          this.initDate();
        }
      }else if(item === 'dates'){
        this.currDate = this[item][index]
      }else if(item === 'hours'){
        this.currHour = this[item][index]
      }else if(item === 'minutes'){
        this.currMin = this[item][index]
      }
      
      // this.el.style = 'transition: all .3s';
    },
    getSelectedTime() {
      this.callback({
        year: this.currYear,
        month: this.currMonth,
        date: this.currDate,
        hour: this.currHour,
        minute: this.currMin,
        showdatetime: false
      })
      // console.log(this.currYear, this.currMonth, this.currDate, this.currHour, this.currMin)
    },
    cancelSelectTime() {
      this.callback({
        year: this.memoryYear,
        month: this.memoryMonth,
        date: this.memoryDate,
        hour: this.memoryHour,
        minute: this.memoryMin,
        showdatetime: false
      })
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.public-date-view{
  width:100%;
  height:0;
  transition: all .3s;
  position: absolute;
  left:0;
  bottom:0;
  overflow: hidden;
  .date-bj{
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    bottom:0;
    background:#000;
    opacity:.5;
  }
  .date-slect-wrap{
    position: absolute;
    left:0;
    bottom:0;
    width:100%;
    background:#fff;
    color:#191919;
    .date-header{
      width:100%;
      height:43px;
      display:-webkit-box;
      -webkit-box-align:center;
      border-bottom:.1px solid #c7c7c7;
      span{
        display:block;
        height:100%;
        -webkit-box-flex:1;
        line-height:43px;
        text-align:center;
      }
      span.confirm{
        color:#C83C4A;
      }
    }
    .date-time-wrap{
      width:100%;
      height:266px;
      padding:0 25px;
      display:-webkit-box;
      position: relative;
      .date-time-item{
        -webkit-box-flex:1;
        height:100%;
        overflow:hidden;
      }
      .tansform-end{
        transition: all .3s
      }
      .date-time-item-box{
        height:auto;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        span{
          display:block;
          height:38px;
          line-height:38px;
          text-align:center;
        }
      }
      .yd-datetime-shade{
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 3;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        background-image: -webkit-linear-gradient(top,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6)),-webkit-linear-gradient(bottom,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6));
        background-image: linear-gradient(180deg,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6)),linear-gradient(0deg,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6));
        background-position: top,bottom;
        background-size: 100% 114px;
        background-repeat: no-repeat;
      }
      .yd-datetime-indicator{
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 4;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        span{
          display: block;
          width: 100%;
          height: 38px;
          position: relative;
          &::before{
            content: "";
            position: absolute;
            z-index: 0;
            left: 0;
            width: 100%;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            box-sizing: border-box;
            outline: 0;
            bottom: 0;
            border-bottom: 1px solid #d9d9d9;
          }
          &::after{
            content: "";
            position: absolute;
            z-index: 0;
            left: 0;
            width: 100%;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            box-sizing: border-box;
            outline: 0;
            top: 0;
            border-top: 1px solid #d9d9d9;
          }
        }
      }
    }
  }
}
</style>