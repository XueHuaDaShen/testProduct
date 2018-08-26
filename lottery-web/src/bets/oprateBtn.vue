<template>
  <div class="oprate-wrap">
    <!-- -->
    <span v-if="type!=='pks-tiger'" class="oprate-btn" :class="{'active':(index === active && getIndexHor[betsIndex])}" v-for="(item, index) in oprateArr" @click="handleClickOprate(item.type, index)" :key="index">{{item.title}}</span>
    <span v-if="type==='pks-tiger'" class="oprate-btn" :class="{'active':(index === active && getIndexHor[betsIndex])}" style="margin-top:0;" v-for="(item, index) in pksArr" @click="handleClickOprate(item.type, index)" :key="index">{{item.title}}</span>
  </div>
</template>
<script>
  export default {
    name: 'oprateBtn',
    props: {
      betsIndex: {
        type: Number,
        required: true
      },
      betsType: {
        type: Object,
        required: true
      },
      betsArr: {
        type: Object,
        required: true
      },
      len: {
        default: 10,
        type: Number
      },
      ballsArr: {
        required: false
      },
      type: {
        type: String,
        default: ''
      }
    },
    computed: {
      getIndexHor() {
        return this.$store.state.oprate_index_hor;
      },
    },
    data() {
      return {
        oprateArr: [
          { title: '全', type: 'all' },
          { title: '大', type: 'large' },
          { title: '小', type: 'small' },
          { title: '奇', type: 'odd' },
          { title: '偶', type: 'even' },
          { title: '清', type: 'clean' }
        ],
        pksArr: [
          { title: '全', type: 'all' },
          { title: '清', type: 'clean' }
        ],
        active: -1
      }
    },
    methods: {
      handleClickOprate(type, index) {
        this.active = index;
        let o1 = {};
        o1[this.betsIndex] = true;
        this.$store.dispatch('setOprateIndexHor', o1);
        var len = this.len;
        var o = new Object();
        var arr = [];
        for (var i = 0; i < len; i++) {
          if (type === 'all') {
            if (this.ballsArr) {
              if (this.type === 'pks-tiger') {
                let pks_a = this.ballsArr[i].split('-');
                if (pks_a[0] !== pks_a[1]) {
                  arr.push(this.ballsArr[i].toString())
                }
              } else {
                arr.push(this.ballsArr[i].toString())
              }
            } else {
              arr.push(i.toString())
            }
          } else if (type === 'large') {
            if (this.ballsArr) {
              if (this.ballsArr[i] > Math.floor(this.ballsArr[len - 1] / 2)) {
                arr.push(this.ballsArr[i].toString())
              }
            } else {
              if (i > (Math.ceil(len / 2) - 1)) {
                arr.push(i.toString())
              }
            }
          } else if (type === 'small') {
            if (this.ballsArr) {
              if (this.ballsArr[i] <= Math.floor(this.ballsArr[len - 1] / 2)) {
                arr.push(this.ballsArr[i].toString())
              }
            } else {
              if (i < (Math.ceil(len / 2))) {
                arr.push(i.toString())
              }
            }
          } else if (type === 'odd') {
            if (this.ballsArr) {
              if (this.ballsArr[i] % 2 !== 0) {
                arr.push(this.ballsArr[i].toString())
              }
            } else {
              if (i % 2 !== 0) {
                arr.push(i.toString())
              }
            }
          } else if (type === 'even') {
            if (this.ballsArr) {
              if (this.ballsArr[i] % 2 === 0) {
                arr.push(this.ballsArr[i].toString())
              }
            } else {
              if (i % 2 === 0) {
                arr.push(i.toString())
              }
            }
          } else if (type === 'clean') {
            arr = [];
          }
        }
        o.data = arr;
        o.index = this.betsIndex;
        this.checkBetsArr(o);
      },
      checkBetsArr(o) {
        const data = this.betsArr.data;
        const vm = this;
        const str1 = '',
          str2 = '';
        this.$emit("sendBallsArr", o);
      },
    }
  }
</script>

<style scoped lang="scss">
  .oprate-wrap {
    display: -webkit-box;
  }

  .oprate-btn {
    display: block;
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
    margin-left: 5px;
    margin-top: 4px;
    cursor: pointer;
    &.active {
      color: #fff;
      background-image: -webkit-gradient(linear, left top, left bottom, color-stop(5%, #DBB894), color-stop(97%, #7C5D3C));
      background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
      border: 1px solid #DBB894;
    }
    &:hover {
      color: #fff;
      background-image: -webkit-gradient(linear, left top, left bottom, color-stop(5%, #DBB894), color-stop(97%, #7C5D3C));
      background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
      border: 1px solid #DBB894;
    }
  }
</style>