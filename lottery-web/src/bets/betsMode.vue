<template>
  <div>
    <div class="bets-mode-components">
      <div class="bets-mode-wrap" v-for="(item, index) in betsMode" :key="index">
        <span class="title" v-if="item.show">{{item.title}}</span>
        <div>
          <div class="bets-mode" v-if="k.show" ref='refmode' @click="handleChangeBetsMode(k, item.title)" :class="k.checked?'currentMode':''" v-for="(k, i) in item.data" :key="i">
            <span class="bets-mode-title">{{k.title}}</span>
            <div class="bets-rule" ref="refrule">
              <span class="sanjiao"></span>
              <h1 class="bets-rule-title">{{groupName+"-"+item.title+"-"+k.title}}（单注奖金：{{setPrize(k.probability)}}）</h1>
              <p v-html="k.play" class="rule-content"></p>
              <p v-html="k.plan"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'betsMode',
    props: {
      type: {
        type: String,
      },
      betsMode: {
        type: Array,
        required: true
      },
      groupName: {
        type: String,
        required: true
      },
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
    },
    data() {
      return {
        data: [
          { title: '万', data: [] },
          { title: '千', data: [] },
          { title: '百', data: [] },
          { title: '十', data: [] },
          { title: '个', data: [] }
        ],
        prize: 0,
        c_prize: 0,
      }
    },
    methods: {
      toThousands(num) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n1 = (num || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) { return s1.replace(re, "$&,") + s2; });
        return n1
      },
      handleChangeBetsMode(k, title) {
        var newData = [];
        for (var i in this.data) {
          newData.push(this.data[i])
        }
        var betsArr = [];
        this.data.filter(v => {
          v.data = [];
        })
        this.betsMode.filter(function(v1) {
          v1.data.filter(function(v2) {
            v2.checked = false;
          })
        })
        k.checked = true;
        for (let i in k.betsTitle) {
          let o = new Object();
          o.title = k.betsTitle[i];
          o.data = [];
          betsArr.push(o);
        }
        let par = this.$refs['refmode'];
        let rule = this.$refs['refrule'];
        for (let i in par) {
          let w = par[i].clientWidth;
          rule[i].style.marginLeft = -(330 - w * 2) / 2 + 'px';
        }
        this.$store.dispatch('setBets', 0);
        this.$emit('sendBetsArr', { data: betsArr, item: k, title: title, type: k.type });
        this.$emit("changeBetsMode", 1)
        if (k.type === 'pks-tiger-end') {
          this.$emit('sendTitleType', true)
        } else {
          this.$emit('sendTitleType', false)
        }
      },
      setPrize(probability) {
        // console.log('rule----',this.userRefund, this.maxRefund, this.diff, probability)
        let prize = 0;
        if (this.userRefund > this.maxRefund) {
          prize = (2 * probability * (this.userRefund - this.diff)) / this.maxRefund;
        } else {
          prize = (2 * probability * this.userRefund) / this.maxRefund;
        }
        if (this.moneyType === '角') {
          prize = prize * 0.1
        } else if (this.moneyType === '分') {
          prize = prize * 0.01
        }
        return this.toThousands(prize.toFixed(2));
      }
    },
    mounted() {
      this.handleChangeBetsMode(this.betsMode[0].data[0], this.betsMode[0].title);
      // console.log(this.betsMode)
    }
  }
</script>

<style scoped lang="scss">
  .bets-mode-components {
    width: 100%;
    height: auto;
  }

  .bets-mode-wrap {
    width: 100%;
    /* height:28px; */
    display: -webkit-box;
    padding-bottom: 7px; // border-bottom:1px dotted #BABABA;
  }

  .pks {
    padding-top: 7px;
    background: #f4f4f4;
    border-bottom: none;

    span.title {
      width: 94px;
      display: block;
      text-align: center;
      color: #191919;
    }
  }

  /* .bets-mode-wrap span{
  font-size:12px;
  cursor: pointer;
} */

  .bets-mode-wrap>div {
    -webkit-box-flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .bets-mode-wrap .title {
    display: block;
    font-size: 14px;
    color: #191919;
    margin-right: 20px;
    padding-top: 7px;
  }

  .bets-mode-wrap .bets-mode {
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    padding: 7px 14px;
  }

  .bets-mode-title {
    display: block; // padding:7px 5px;
    color: #191919;
    font-weight: bold;
  }

  .bets-mode-title:hover+.bets-rule {
    display: block;
  }

  .bets-mode-wrap .currentMode {
    color: #191919;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    font-weight: bold;
  }

  .bets-rule {
    position: absolute;
    width: 330px;
    padding: 10px;
    border: 1px solid #ccc;
    bottom: 40px;
    left: -50%;
    background: #fff;
    text-align: left;
    font-size: 12px;
    z-index: 88;
    display: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .bets-rule p {
    color: #666;
    padding: 5px 0;
  }

  .bets-mode-wrap .bets-rule span.sanjiao {
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    transform: rotate(-45deg);
    left: 50%;
    margin-left: -5px;
    bottom: -6px;
    background: #fff;
  }

  .bets-rule-title {
    padding: 5px 0;
    border-bottom: 1px dotted #ccc;
    color: #CFA072;
    font-size: 12px;
  }

  .rule-content {
    border-bottom: 1px dotted #ccc;
  }
</style>