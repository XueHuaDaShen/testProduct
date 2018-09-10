<template>
  <div style="width:100%;height:100%">
    <div class="lottery-number-arr-wrap default" v-if="type!=='pks'&&type!=='ks'">
      <div class="lottery-money" v-if="showPrize">单注奖金:
        <span>{{setPrizeText(prizeArea)}}</span> 元</div>
      <div class="lottery-number-arr-content">
        <table class="lottery-number-table" style="width:100%;">
          <thead>
            <tr>
              <th>
                <span class="issue">奖期</span>
              </th>
              <th>
                <span class="lotterying">开奖</span>
              </th>
              <th v-if="showTitle">
                <span class="titleType">{{titleType}}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="index<9" v-for="(item, index) in issueArr" :key="index">
              <td>
                <span>{{item.issue_no.substr(2)}}期</span>
              </td>
              <td>
                <span class="lottery-number" :class="index===0?'current':''">
                  <em :class="setCurrentLottery(i, item.luck_no)" v-for="(k, i) in item.luck_no.split(',')" :key="i.toString()">{{k}}</em>
                </span>
              </td>
              <td v-if="showTitle">
                <span :class="setTitleText(item.luck_no)==='-'?'':(setTitleText(item.luck_no)==='组六'?'':(setTitleText(item.luck_no)==='龙'?'text-red':(setTitleText(item.luck_no)==='虎'?'text-blue':(setTitleText(item.luck_no)==='和'?'text-green':'lotteryed'))))">{{setTitleText(item.luck_no)}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="chart">
        <router-link :to="{name:'dataCharts',query:{gameid:gameid}}" target="_blank">查看完整走势</router-link>
      </div>
    </div>
    <div class="lottery-number-arr-wrap ks" v-if="type==='ks'">
      <div class="lottery-money" v-if="showPrize">单注奖金:
        <span>{{toThousands(prize.toFixed(2))}}</span> 元</div>
      <div class="lottery-number-arr-content">
        <table class="lottery-number-table" style="width:100%;">
          <thead>
            <tr>
              <th>
                <span class="issue">奖期</span>
              </th>
              <th>
                <span class="lotterying">开奖</span>
              </th>
              <th v-if="showTitle">
                <span class="titleType">{{titleType}}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="index<9" v-for="(item, index) in issueArr" :key="index">
              <td>
                <span>{{item.issue_no.substr(2)}}期</span>
              </td>
              <td>
                <span class="lottery-number">
                  <em class="dice" :class="'dice'+k" v-for="(k, i) in item.luck_no.split(',')" :key="i.toString()"></em>
                </span>
              </td>
              <td v-if="showTitle">
                <span :class="setTitleText(item.luck_no)==='-'?'':(setTitleText(item.luck_no)==='组六'?'':(setTitleText(item.luck_no)==='龙'?'text-red':(setTitleText(item.luck_no)==='虎'?'text-blue':(setTitleText(item.luck_no)==='和'?'text-green':'lotteryed'))))">{{setTitleText(item.luck_no)}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="chart">
        <router-link :to="{name:'dataCharts',query:{gameid:gameid}}" target="_blank">查看完整走势</router-link>
      </div>
    </div>
    <div class="lottery-number-arr-wrap pks" v-if="type === 'pks'">
      <!-- <div class="pks-car">
        <div class="lottery-money" v-if="showPrize">单注奖金:
          <br>
          <span>{{pksPrize}}</span>
        </div>
      </div> -->
      <div class="lottery-money" v-if="showPrize">单注奖金:
        <span>{{setPrizeText(pksPrize)}}</span> 元
      </div>
      <div class="lottery-number-arr-content">
        <table class="lottery-number-table" style="width:100%;">
          <thead>
            <tr>
              <th>
                <span class="issue">奖期</span>
              </th>
              <th>
                <span class="lotterying">开奖</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="index<6" v-for="(item, index) in issueArr" :key="index">
              <td class="one">
                <span>{{item.issue_no.substr(-4)}} 期</span>
              </td>
              <td class="two">
                <span class="lottery-number" :class="index===0?'current':''">
                  <em v-for="(k, i) in item.luck_no.split(',')" :key="i.toString()">{{Number(k)}}</em>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="chart">
        <router-link :to="{name:'dataCharts',query:{gameid:gameid}}" target="_blank">查看完整走势</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios.js'
  export default {
    name: 'lotteryNumberArr',
    props: {
      issueArr: {
        type: Array,
        default: () => [
          { issue_no: '0421030', luck_no: '3,7,0,2,9' },
          { issue_no: '0421030', luck_no: '3,7,0,2,9' },
          { issue_no: '0421030', luck_no: '3,7,0,2,9' },
          { issue_no: '0421030', luck_no: '3,7,0,2,9' },
          { issue_no: '0421030', luck_no: '3,7,0,2,9' }
        ]
      },
      prize: {
        type: Number
      },
      prizeArea: {
        type: Array,
      },
      showPrize: {
        type: Boolean,
        default: true
      },
      gameid: {
        type: String,
        required: true
      },
      numType: {
        type: Array,
      },
      type: {
        type: String,
        default: ''
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
      betsArr: {
        type: Object,
      },
      pksPrize: {
        type: Array,
      },
      title: {
        type: String,
        default: ''
      },
      parTitle: {
        type: String,
        default: ''
      },
      adjust: {},
      userRefund: {},
    },
    data() {
      return {
        c_prize: 0,
        showTitle: false,
        titleType: '',
        titleText: '',
      }
    },
    mounted() {
      // console.log(this.betsArr.item.extra)
      // if(this.type === 'pks'){
      //   this.setPrize();
      // }
      // console.log(this.prizeArea)
      this.setLotteryType(this.title)
      // console.log(this.parTitle)
      // console.log(this.title)
      // console.log(this.type)
    },
    methods: {
      toThousands(num) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n1 = (num || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) { return s1.replace(re, "$&,") + s2; });
        return n1
      },
      setPrizeText(prizeArea) {
        let n;
        let fix = 2;
        // if(this.type === 'pks'){
        //   fix = 4
        // }
        if (prizeArea.length === 1) {
          n = ((prizeArea[0] / this.userRefund) * this.adjust).toFixed(fix);
        } else {
          n = ((prizeArea[0] / this.userRefund) * this.adjust).toFixed(fix) + ' - ' + ((prizeArea[1] / this.userRefund) * this.adjust).toFixed(fix);
        }
        return n
      },
      setCurrentLottery(i, num) {
        // console.log(i)
        let c = '';
        if (this.parTitle === '五星' || this.parTitle === '一星' || this.parTitle === '三星' || this.parTitle.indexOf('趣味') > -1 || this.parTitle.indexOf('任选') > -1 || this.parTitle === '和值' || this.parTitle === '定位胆') {
          c = 'curr'
        } else if (this.parTitle === '四星') {
          if (i > 0) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.title.indexOf('前三') > -1) {
          if (i < 3) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.title.indexOf('中三') > -1) {
          if (i > 0 && i < 4) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.title.indexOf('后三') > -1) {
          if (i > 1) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.title.indexOf('四星') > -1) {
          if (i > 0) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '排三') {
          if (i < 3) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '前三') {
          if (i < 3) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '中三') {
          if (i > 0 && i < 4) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '三码') {
          if (i < 3) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '二码') {
          if (i < 2) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '后三') {
          if (i > 1) {
            c = 'curr';
          } else {
            c = '';
          }
        } else if (this.parTitle === '二星') {
          if (this.title.indexOf("后二") > -1) {
            if (i > 2) {
              c = 'curr'
            } else {
              c = '';
            }
          } else if (this.title.indexOf('前二') > -1) {
            if (i < 2) {
              c = 'curr'
            } else {
              c = '';
            }
          }
        } else if (this.parTitle === '大小单双') {
          if (this.title.indexOf("后二") > -1) {
            if (num.split(',').length === 5) {
              if (i > 2) {
                c = 'curr'
              } else {
                c = '';
              }
            } else {
              if (i > 0) {
                c = 'curr'
              } else {
                c = '';
              }
            }
          } else if (this.title.indexOf('前二') > -1) {
            if (i < 2) {
              c = 'curr'
            } else {
              c = '';
            }
          } else if (this.title.indexOf('前三') > -1) {
            if (i < 3) {
              c = 'curr'
            } else {
              c = '';
            }
          } else if (this.title.indexOf('中三') > -1) {
            if (i > 0 && i < 4) {
              c = 'curr'
            } else {
              c = '';
            }
          } else if (this.title.indexOf('后三') > -1) {
            if (i > 1) {
              c = 'curr'
            } else {
              c = '';
            }
          }
        } else if (this.parTitle === '龙虎') {
          if (this.title === '万千') {
            if (i === 0 || i === 1) { c = 'curr' } else { c = ''; }
          } else if (this.title === '万百') {
            if (i === 0 || i === 2) { c = 'curr' } else { c = ''; }
          } else if (this.title === '万十') {
            if (i === 0 || i === 3) { c = 'curr' } else { c = ''; }
          } else if (this.title === '万个') {
            if (i === 0 || i === 4) { c = 'curr' } else { c = ''; }
          } else if (this.title === '千百') {
            if (i === 1 || i === 2) { c = 'curr' } else { c = ''; }
          } else if (this.title === '千十') {
            if (i === 1 || i === 3) { c = 'curr' } else { c = ''; }
          } else if (this.title === '千个') {
            if (i === 1 || i === 4) { c = 'curr' } else { c = ''; }
          } else if (this.title === '百十') {
            if (i === 2 || i === 3) { c = 'curr' } else { c = ''; }
          } else if (this.title === '百个') {
            if (i === 2 || i === 4) { c = 'curr' } else { c = ''; }
          } else if (this.title === '十个') {
            if (i === 3 || i === 4) { c = 'curr' } else { c = ''; }
          }
        }
        return c
      },
      setClassFn() {
        this.text
      },
      getLotteryNumberList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/issue/list', { gameid: vm.gameid },
          (success) => {
            // console.log('往期中奖----', success);
            let code = success.returncode;
            if (code === 103 || code === 106 || code === 101) {
              request.loginAgain(vm)
            } else if (code === 200) {
              // vm.setInitData(success.data.children)
            }
          },
          (error) => {
            console.log('往期中奖----', error)
          }
        )
      },
      setPrize() {
        let extra = this.betsArr.item.extra;
        let arr = this.betsArr.data[0].data;
        // console.log(this.betsArr)
        if (extra === '') {
          this.c_prize = this.toThousands(this.prize.toFixed(4))
        } else {
          let probArr = [];
          // console.log(this.betsArr)
          // console.log('arr--------',arr)
          // console.log('extra------',extra)
          if (arr.length === 0) {
            for (let i in extra) {
              probArr.push(extra[i])
            }
          } else {
            arr.filter(v => {
              probArr.push(extra[v])
            })
          }
          // console.log(probArr)

          let min_probability = Math.min.apply(Math, probArr);
          let max_probability = Math.max.apply(Math, probArr);
          // console.log('rule----',this.userRefund, this.maxRefund, this.diff, min_probability, max_probability)

          let min_prize = 0,
            max_prize = 0;
          if (this.userRefund > this.maxRefund) {
            min_prize = (2 * min_probability * (this.userRefund - this.diff)) / this.maxRefund;
            max_prize = (2 * max_probability * (this.userRefund - this.diff)) / this.maxRefund;
          } else {
            min_prize = (2 * min_probability * this.userRefund) / this.maxRefund;
            max_prize = (2 * max_probability * this.userRefund) / this.maxRefund;
          }
          if (this.moneyType === '角') {
            min_prize = min_prize * 0.1
            max_prize = max_prize * 0.1
          } else if (this.moneyType === '分') {
            min_prize = min_prize * 0.01
            max_prize = max_prize * 0.01
          }

          if (probArr.length === 1) {
            this.c_prize = this.toThousands(min_prize.toFixed(4));
          } else {
            this.c_prize = this.toThousands(min_prize.toFixed(4)) + ' - ' + this.toThousands(max_prize.toFixed(4));
          }
        }
      },
      setLotteryType(title) {
        const vm = this;
        if (title === '组选120') {
          vm.showTitle = true;
          vm.titleType = '120';
        } else if (title === '组选60') {
          vm.showTitle = true;
          vm.titleType = '60';
        } else if (title === '组选30') {
          vm.showTitle = true;
          vm.titleType = '30';
        } else if (title === '组选20') {
          vm.showTitle = true;
          vm.titleType = '20';
        } else if (title === '组选10') {
          vm.showTitle = true;
          vm.titleType = '10';
        } else if (title === '组选5') {
          vm.showTitle = true;
          vm.titleType = '5';
        } else if (title === '组选24') {
          vm.showTitle = true;
          vm.titleType = '24';
        } else if (title === '组选12') {
          vm.showTitle = true;
          vm.titleType = '12';
        } else if (title === '组选6') {
          vm.showTitle = true;
          vm.titleType = '6';
        } else if (title === '组选4') {
          vm.showTitle = true;
          vm.titleType = '4';
        } else if ((title === '直选和值' || title === '组选和值') && this.parTitle === '前三') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if ((title === '直选和值' || title === '组选和值') && this.parTitle === '中三') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if ((title === '直选和值' || title === '组选和值') && this.parTitle === '后三') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if ((title === '直选和值' || title === '组选和值') && this.parTitle === '三星') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if ((title === '直选和值' || title === '组选和值') && this.parTitle === '排三') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if (title === '直选跨度' && this.parTitle === '前三') {
          vm.showTitle = true;
          vm.titleType = '跨度';
        } else if (title === '直选跨度' && this.parTitle === '中三') {
          vm.showTitle = true;
          vm.titleType = '跨度';
        } else if (title === '直选跨度' && this.parTitle === '后三') {
          vm.showTitle = true;
          vm.titleType = '跨度';
        } else if (title === '混合组选' && this.parTitle === '前三') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title === '混合组选' && this.parTitle === '中三') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title === '混合组选' && this.parTitle === '后三') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title === '混合组选' && this.parTitle === '三星') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title === '混合组选' && this.parTitle === '排三') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title.indexOf('组三') > -1 || title.indexOf('组六') > -1 || title === '特殊号码' || this.parTitle === '龙虎') {
          vm.showTitle = true;
          vm.titleType = '形态';
        } else if (title === '和值尾数') {
          vm.showTitle = true;
          vm.titleType = '和尾';
        } else if (title === '前二和值' || title === '后二和值') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if (title === '前二跨度' || title === '后二跨度') {
          vm.showTitle = true;
          vm.titleType = '跨度';
        } else if (title === '后二大小单双' || title === '前二大小单双') {
          vm.showTitle = true;
          vm.titleType = '大小 单双';
        } else if (title === '五星和值') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if (title === '大小单双' && this.parTitle !== '快3') {
          vm.showTitle = true;
          vm.titleType = '和值 单双';
        } else if (title === '和值' && this.parTitle === '快3') {
          vm.showTitle = true;
          vm.titleType = '和值';
        } else if (title === '大小单双' && this.parTitle === '快3') {
          vm.showTitle = true;
          vm.titleType = '和值大小单双';
        } else if (title === '三同号') {
          vm.showTitle = true;
          vm.titleType = '三同号';
        } else if (title === '二同号') {
          vm.showTitle = true;
          vm.titleType = '二同号';
        } else if (title === '三不同号') {
          vm.showTitle = true;
          vm.titleType = '三不同';
        } else if (title === '三连号') {
          vm.showTitle = true;
          vm.titleType = '三连号';
        }
      },
      setTitleText(num) {
        // console.log(this.titleType)
        if (this.titleType === '120') return this.setText120(num)
        if (this.titleType === '60') return this.setText60(num)
        if (this.titleType === '30') return this.setText30(num)
        if (this.titleType === '20') return this.setText20(num)
        if (this.titleType === '10') return this.setText10(num)
        if (this.titleType === '5') return this.setText5(num)
        if (this.titleType === '24') return this.setText24(num)
        if (this.titleType === '12') return this.setText12(num)
        if (this.titleType === '6') return this.setText6(num)
        if (this.titleType === '4') return this.setText4(num)
        if (this.titleType === '和值') {
          if (this.parTitle === '快3') {
            return this.setTextAnd(num, 0, 3)
          }
        }
        if (this.titleType === '和值') {
          if (this.parTitle === '前三') {
            return this.setTextAnd(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextAnd(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextAnd(num, 2, 5)
          }
        }
        if (this.titleType.indexOf('跨度') > -1) {
          if (this.parTitle === '前三') {
            return this.setTextDiff(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextDiff(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextDiff(num, 2, 5)
          }
        }
        if (this.titleType === '和值') {
          if (this.title.indexOf('前二') > -1) {
            return this.setTextAnd(num, 0, 2)
          } else if (this.title.indexOf('后二') > -1) {
            return this.setTextAnd(num, 3, 5)
          }
        }
        if (this.titleType === '跨度') {
          if (this.title.indexOf('前二') > -1) {
            return this.setTextDiff(num, 0, 2)
          } else if (this.title.indexOf('后二') > -1) {
            return this.setTextDiff(num, 3, 5)
          }
        }
        if (this.titleType === '和值' && this.parTitle === '三星') {
          return this.setTextAnd(num, 0, 3)
        }
        if (this.titleType === '和值' && this.parTitle === '排三') {
          return this.setTextAnd(num, 0, 3)
        }
        if (this.titleType === '和值' && this.parTitle === '和值') {
          return this.setTextAnd(num, 0, 5)
        }
        if (this.titleType === '和值 单双' && this.parTitle === '和值') {
          return this.setTextAndDouble(num)
        }
        if (this.titleType === '形态' && (this.title.indexOf('组三') > -1 || this.title.indexOf('组六') > -1)) {
          if (this.parTitle === '前三') {
            return this.setTextType_group(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextType_group(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextType_group(num, 2, 5)
          } else if (this.parTitle === '三星') {
            return this.setTextType_group(num, 0, 3)
          } else if (this.parTitle === '排三') {
            return this.setTextType_group(num, 0, 3)
          }
        }
        if (this.titleType === '形态' && this.title === '混合组选') {
          if (this.parTitle === '前三') {
            return this.setTextType_group(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextType_group(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextType_group(num, 2, 5)
          } else if (this.parTitle === '三星') {
            return this.setTextType_group(num, 0, 3)
          } else if (this.parTitle === '排三') {
            return this.setTextType_group(num, 0, 3)
          }
        }
        if (this.titleType === '形态' && this.title === '特殊号码') {
          if (this.parTitle === '前三') {
            return this.setTextType_double(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextType_double(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextType_double(num, 2, 5)
          }
        }
        if (this.titleType === '形态' && this.parTitle === '龙虎') {
          if (this.title === '万千') { return this.setTextType_tiger(num, 0, 1) }
          if (this.title === '万百') { return this.setTextType_tiger(num, 0, 2) }
          if (this.title === '万十') { return this.setTextType_tiger(num, 0, 3) }
          if (this.title === '万个') { return this.setTextType_tiger(num, 0, 4) }
          if (this.title === '千百') { return this.setTextType_tiger(num, 1, 2) }
          if (this.title === '千十') { return this.setTextType_tiger(num, 1, 3) }
          if (this.title === '千个') { return this.setTextType_tiger(num, 1, 4) }
          if (this.title === '百十') { return this.setTextType_tiger(num, 2, 3) }
          if (this.title === '百个') { return this.setTextType_tiger(num, 2, 4) }
          if (this.title === '十个') { return this.setTextType_tiger(num, 3, 4) }
        }
        if (this.titleType === '和尾') {
          if (this.parTitle === '前三') {
            return this.setTextAndEndNum(num, 0, 3)
          } else if (this.parTitle === '中三') {
            return this.setTextAndEndNum(num, 1, 4)
          } else if (this.parTitle === '后三') {
            return this.setTextAndEndNum(num, 2, 5)
          }
        }
        if (this.titleType === '大小 单双') {
          if (this.title.indexOf('后二') > -1) {
            return this.setTextSizeDouble(num, 3, 5)
          } else if (this.title.indexOf('前二') > -1) {
            return this.setTextSizeDouble(num, 0, 2)
          }
        }
        if (this.titleType === '和值大小单双') {
          return this.setTextAndSizeDouble(num)
        }
        if (this.titleType === '三同号') {
          return this.setTextThreeSame(num)
        }
        if (this.titleType === '二同号') {
          return this.setTextTwoSame(num)
        }
        if (this.titleType === '三不同') {
          return this.setTextThreeNoSame(num)
        }
        if (this.titleType === '三连号') {
          return this.setTextThreeLink(num)
        }
      },
      setText120(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        for (let i in arr2) {
          if (arr1.indexOf(arr2[i]) < 0) {
            arr1.push(arr2[i])
          }
        }
        if (arr1.length === arr2.length) {
          text = '120';
        } else {
          text = '-';
        }
        // console.log(arr1)
        return text;
      },
      setText60(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(2) > -1 && arr1.indexOf(3) < 0) {
          text = '60';
        } else {
          text = '-';
        }
        return text;
      },
      setText30(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        for (let i in arr2) {
          let n = 1;
          for (let j in arr2) {
            if (j !== i) {
              if (arr2[j] === arr2[i]) {
                if (arr1.indexOf(arr2[i]) < 0) {
                  arr1.push(arr2[i])
                }
              }
            }
          }
        }
        // console.log(arr1)
        if (arr1.length === 2) {
          text = '30';
        } else {
          text = '-';
        }
        return text;
      },
      setText20(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(3) > -1 && arr1.indexOf(2) < 0) {
          text = '20';
        } else {
          text = '-';
        }
        return text;
      },
      setText10(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(3) > -1 && arr1.indexOf(2) > -1) {
          text = '10';
        } else {
          text = '-';
        }
        return text;
      },
      setText5(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.split(',');
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(4) > -1) {
          text = '5';
        } else {
          text = '-';
        }
        return text;
      },
      setText24(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.substr(2).split(',');
        let text = '';
        for (let i in arr2) {
          if (arr1.indexOf(arr2[i]) < 0) {
            arr1.push(arr2[i])
          }
        }
        if (arr1.length === arr2.length) {
          text = '24';
        } else {
          text = '-';
        }
        return text;
      },
      setText12(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.substr(2).split(',').sort((a, b) => { return a - b });
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(2) > -1 && arr1.indexOf(3) < 0) {
          text = '12';
        } else {
          text = '-';
        }
        return text;
      },
      setText6(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.substr(2).split(',').sort((a, b) => { return a - b });
        let text = '';
        for (let i in arr2) {
          let n = 1;
          for (let j in arr2) {
            if (j !== i) {
              if (arr2[j] === arr2[i]) {
                if (arr1.indexOf(arr2[i]) < 0) {
                  arr1.push(arr2[i])
                }
              }
            }
          }
        }
        // console.log(arr1)
        if (arr1.length === 2) {
          text = '6';
        } else {
          text = '-';
        }
        return text;
      },
      setText4(num) {
        // console.log(num)
        let arr1 = [];
        let arr2 = num.substr(2).split(',').sort((a, b) => { return a - b });
        let text = '';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(3) > -1) {
          text = '4';
        } else {
          text = '-';
        }
        return text;
      },
      setTextAnd(num, s, e) {
        let arr = num.split(',').slice(s, e);
        let n = arr.reduce((p, c) => {
          return Number(p) + Number(c)
        })
        return n;
      },
      setTextAndEndNum(num, s, e) {
        let arr = num.split(',').slice(s, e);
        let n = arr.reduce((p, c) => {
          return Number(p) + Number(c)
        })
        let m;
        if (n.toString().length === 1) {
          m = n
        } else {
          m = n.toString().charAt(1)
        }
        return Number(m);
      },
      setTextAndDouble(num) {
        let arr = num.split(',');
        let text = '';
        let n = arr.reduce((p, c) => {
          return Number(p) + Number(c)
        })
        let t1, t2;
        if (n > 22) {
          t1 = '大'
        } else {
          t1 = '小'
        }
        if (n % 2 === 0) {
          t2 = '双'
        } else {
          t2 = '单'
        }
        text = n + ' ' + t1 + t2;
        return text;
      },
      setTextDiff(num, s, e) {
        let arr = num.split(',').slice(s, e);
        let min = Math.min.apply(Math, arr);
        let max = Math.max.apply(Math, arr);
        return (max - min);
      },
      setTextType_group(num, s, e) {
        let arr1 = [];
        let arr2 = num.split(',').slice(s, e);
        let text = '组三';
        let n = 1;
        for (let i in arr2) {
          let n = 0;
          arr2.filter(v => {
            if (v === arr2[i]) {
              n++
            }
          })
          arr1.push(n)
        }
        // console.log(arr1)
        if (arr1.indexOf(2) > -1 && arr1.indexOf(3) < 0) {
          text = '组三';
        } else {
          text = '组六';
        }
        return text;
      },
      setTextType_double(num, s, e) {
        let arr = num.split(',').slice(s, e).sort((a, b) => { return a - b });
        let n1 = arr[0],
          n2 = arr[1],
          n3 = arr[2];
        let text = '';
        if (n1 === n2 && n1 === n3) {
          text = '豹子'
        } else if ((n1 === n2 && n1 !== n3) || (n1 === n3 && n1 !== n2) || (n2 === n3 && n2 !== n1)) {
          text = '对子'
        } else if (n1 + 1 === n2 && n1 + 2 === n3) {
          text = '顺子'
        } else {
          text = '-'
        }
        return text;
      },
      setTextType_tiger(num, s, e) {
        let arr = num.split(',');
        let n1 = arr[s],
          n2 = arr[e];
        let text = '';
        if (n1 > n2) { text = '龙' }
        if (n1 < n2) { text = '虎' }
        if (n1 === n2) { text = '和' }
        return text;
      },
      setTextSizeDouble(num, s, e) {
        let a = num.split(',');
        let arr;
        if (a.length === 5) {
          arr = a.slice(s, e).sort((a, b) => { return a - b });
        } else {
          arr = a.slice(0, 3).sort((a, b) => { return a - b });
        }
        let n1 = arr[0],
          n2 = arr[1];
        let s1, s2, d1, d2;
        let text = '';
        if (n1 > 4) {
          s1 = '大'
        } else {
          s1 = '小'
        }
        if (n2 > 4) {
          s2 = '大'
        } else {
          s2 = '小'
        }
        if (n1 % 2 === 0) {
          d1 = '双'
        } else {
          d1 = '单'
        }
        if (n2 % 2 === 0) {
          d2 = '双'
        } else {
          d2 = '单'
        }
        text = s1 + s2 + ' ' + d1 + d2;
        return text;
      },
      setTextAndSizeDouble(num) {
        let arr = num.split(',');
        let text = '';
        let n = arr.reduce((p, c) => {
          return Number(p) + Number(c)
        })
        let t1, t2;
        if (n > 10) {
          t1 = '大'
        } else {
          t1 = '小'
        }
        if (n % 2 === 0) {
          t2 = '双'
        } else {
          t2 = '单'
        }
        text = t1 + t2;
        return text;
      },
      setTextThreeSame(num) {
        let arr = num.split(',').sort((a, b) => { return a - b });
        let n1 = arr[0],
          n2 = arr[1],
          n3 = arr[2];
        let text = '';
        if (n1 === n2 && n1 === n3) {
          text = '三同号';
        } else {
          text = '-';
        }
        return text;
      },
      setTextTwoSame(num) {
        let arr = num.split(',').sort((a, b) => { return a - b });
        let n1 = arr[0],
          n2 = arr[1],
          n3 = arr[2];
        let text = '';
        if (n1 === n2 && n1 === n3) {
          text = '豹子'
        } else if ((n1 === n2 && n1 !== n3) || (n1 === n3 && n1 !== n2) || (n2 === n3 && n2 !== n1)) {
          text = '二同号'
        } else {
          text = '-'
        }
        return text;
      },
      setTextThreeNoSame(num) {
        let arr = num.split(',').sort((a, b) => { return a - b });
        let n1 = arr[0],
          n2 = arr[1],
          n3 = arr[2];
        let text = '';
        if (n1 !== n2 && n1 !== n3 && n2 !== n3) {
          text = '三不同';
        } else {
          text = '-';
        }
        return text;
      },
      setTextThreeLink(num) {
        let arr = num.split(',').sort((a, b) => { return a - b });
        let n1 = arr[0],
          n2 = arr[1],
          n3 = arr[2];
        let text = '';
        if (n1 + 1 === n2 && n1 + 2 === n3) {
          text = '三连号';
        } else {
          text = '-';
        }
        return text;
      },
    },
  }
</script>
<style scoped lang="scss">
  .lottery-number-arr-wrap {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    color: #333;
    font-size: 12px;
  }

  .lottery-money {
    padding: 20px 0;
    font-size: 14px;
    text-align: left;
    font-weight: bold;
  }

  .lottery-money span {
    color: #CC3447;
    font-size: 16px;
  }

  .pks-car {
    width: 100%;
    height: 120px;
    background: url("../assets/img/bets-img/pks-car.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: 7px;
    position: relative;
    .lottery-money {
      padding: 10px 0;
      padding-left: 31px;
      font-size: 15px;
      margin-bottom: 5px;
      text-align: left;
      color: #fff;
    }
    .lottery-money span {
      color: #fff995;
      font-size: 17px;
      margin-top: 10px;
      display: inline-block;
    }
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .ks {
    padding-top: 30px;
    .lottery-number-arr-content {
      width: 100%;
      -webkit-box-flex: 1;
      border-top: none;
      background: #64646C;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      .lottery-number-table {
        .dice {
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
          margin-left: 5px;
          border-radius: 4px;
          &:first-child {
            margin-left: 0;
          }
        }
        .dice1 {
          background: url('../assets/img/bets-img/dice1.png') no-repeat;
          background-size: 100% 100%;
        }
        .dice2 {
          background: url('../assets/img/bets-img/dice2.png') no-repeat;
          background-size: 100% 100%;
        }
        .dice3 {
          background: url('../assets/img/bets-img/dice3.png') no-repeat;
          background-size: 100% 100%;
        }
        .dice4 {
          background: url('../assets/img/bets-img/dice4.png') no-repeat;
          background-size: 100% 100%;
        }
        .dice5 {
          background: url('../assets/img/bets-img/dice5.png') no-repeat;
          background-size: 100% 100%;
        }
        .dice6 {
          background: url('../assets/img/bets-img/dice6.png') no-repeat;
          background-size: 100% 100%;
        }
        tbody td {
          text-align: center;
          padding: 9px 0;
          vertical-align: middle;
          border-bottom: 1px dotted #ddd;
          background: #fff;
          .lottery-number {
            display: -webkit-box;
            -webkit-box-align: center;
            -webkit-box-pack: center;
          }
          em {
            width: 23px;
            height: 23px;
            display: block;
            font-size: 12px;
            margin-left: 2px;
            font-style: normal;
          }
          .lotteryed {
            color: #f60;
          }
        }
      }
    }
  }

  .lottery-number-table {
    thead th {
      text-align: center;
      background: #64646C;
      padding: 15px 0;
      span {
        color: #fff;
      }
    }
    tbody td {
      text-align: center;
      font-weight: bold;
      padding: 11px 0;
      vertical-align: middle;
      border-bottom: 1px solid #ddd;
      background: #FFFFFF;
      .lottery-number {
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: center;
      }
      em {
        width: 20px;
        height: 20px;
        display: block;
        font-size: 12px;
        margin-left: 2px;
        font-style: normal;
        line-height: 20px;
        color: #b2a789;
        border-radius: 2px;
      }
      em.curr {
        color: #333;
      }
      .current em {
        background: #ccc;
        font-weight: bold;
        color: #fff;
      }
      .current em.curr {
        background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
      }
      .lotteryed {
        color: #f60;
      }
      .text-red {
        width: 20px;
        height: 20px;
        display: inline-block;
        font-size: 12px;
        font-style: normal;
        line-height: 20px;
        color: #fff;
        background: #BD3840;
        border-radius: 50%;
      }
      .text-blue {
        width: 20px;
        height: 20px;
        display: inline-block;
        font-size: 12px;
        font-style: normal;
        line-height: 20px;
        color: #fff;
        background: #3357D7;
        border-radius: 50%;
      }
      .text-green {
        width: 20px;
        height: 20px;
        display: inline-block;
        font-size: 12px;
        font-style: normal;
        line-height: 20px;
        color: #fff;
        background: #0F9075;
        border-radius: 50%;
      }
    }
  }

  .pks {
    .lottery-number-table {
      font-weight: 600;
      thead th {
        text-align: center;
        background: #64646C;
        padding: 15px 0px;
        span {
          color: #fff;
        }
      }
      tbody td {
        text-align: center;
        padding: 10px 0 5px 0;
        vertical-align: middle;
        border-bottom: 1px solid #ddd;
        span {
          color: #191919;
        } // background: #FFF7F0;
        .lottery-number {
          display: -webkit-box;
          -webkit-box-align: center;
          -webkit-box-pack: center;
          padding: 0 20px;
        }
        em {
          width: 18px;
          height: 18px;
          display: block;
          font-size: 14px;
          margin-left: 2px;
          font-style: normal;
          line-height: 18px;
          color: #191919;
          background: #F0F0F0;
          border-radius: 2px;
          color: #333;
          text-indent: 2px;
        }
        em.curr {
          color: #fff;
        }
        .current em {
          background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
          font-weight: 600;
          color: #fff;
        }
        .current em.curr {
          background: #CC3447;
        }
      }
      tbody {
        td.one {
          width: 55px;
          background: #fff;
        }
        td.two {
          background: #fff;
          .lottery-number {
            display: flex;
            flex-wrap: wrap; // padding: 0 40px;
            em {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }

  .lottery-number-arr-title {
    display: -webkit-box;
    -webkit-box-align: center;
    background: #d4914d;
    font-size: 12px;
    width: 100%;
    height: 44px;
    font-weight: bold;
    color: #fff;
  }

  .lottery-number-arr-title .issue {
    width: 40%;
    display: block;
    text-align: center;
  }

  .lottery-number-arr-title .lotterying {
    width: 60%;
    display: block;
    text-align: center;
  }

  .lottery-number-arr-content {
    width: 100%;
    -webkit-box-flex: 1; // border:1px solid #D0D0D0;
    border-top: none;
    background: #64646C;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .lottery-number-arr-content ul {
    height: 170px;
    overflow-y: auto;
  }

  .lottery-number-arr-content ul li {
    display: -webkit-box;
    height: 34px;
    -webkit-box-align: center;
    -webkit-box-pack: center;
    border-bottom: 1px solid #cfcfcf;
  }

  .lottery-number-arr-content ul li span {
    display: block;
  }

  .lottery-number-arr-content ul li .lottery-number {
    margin-left: 31px;
    display: -webkit-box;
  }

  .lottery-number-arr-content ul li .lottery-number em {
    width: 20px;
    height: 20px;
    display: block;
    font-size: 12px;
    margin-left: 2px;
    font-style: normal;
    line-height: 20px;
  }

  .lottery-number-arr-content ul li .current em {
    background: #d8593b;
    font-weight: bold;
    color: #fff;
  }

  .chart {
    background: #64646C;
    height: 34px;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: center;
  }

  .chart a {
    color: #fff;
  }
</style>