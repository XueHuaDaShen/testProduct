<template>
  <div class="betsView-wrap" style="overflow-y:inherit;padding-bottom:0">
    <div class="top">
      <p class="lastIssue">第 <span class="issue-num">{{lastIssue}}</span> 期</p>
      <div class="lottery-wrap">
        <div v-for="(k, i) in lastLotteryNumber.split(',')" :key="i.toString()">
          <span :class="setLotteryNumClass(k, i)">{{k}}</span>
          {{i==6?'=':'+'}}
          <em class="animalText">{{setAnimalTextFn(k)}}</em>
        </div>
        <strong>{{lastLotteryNumber.split(',').reduce((p, c)=>{return Number(p)+Number(c)})}}</strong>
      </div>
      <div class="last">
        <p class="nowIssue">第 <span class="issue-num">{{setIssueNum(nowIssue)}}</span> 期投注截止</p>
        <p class="countDown">
          <span>{{formatTimeFn(countDownTime.hour)}}</span>
          <em><i></i><i></i></em>
          <span>{{formatTimeFn(countDownTime.min)}}</span>
          <em><i></i><i></i></em>
          <span>{{formatTimeFn(countDownTime.sec)}}</span>
        </p>
      </div>
    </div>
    <div class="cen">
      <div class="tema" v-if="showModel && (getBetsData.title === '特码' || getBetsData.title.indexOf('正码')>-1)">
        <div class="split-bar"></div>
        <div class="tema-animate-oprate">
          <span v-for="(item, i) in animalsArr" :key="i" :class="item.checked?'active':''" @click="handleSelectOprate($event, item)">{{item.name}}</span>
        </div>
        <div class="split-bar"></div>
        <div class="bets-number-wrap">
          <span v-for="(item, i) in allBalls" :key="i" :class="betsNumber.indexOf(item.num)>-1?'active':''" @click="handleCheckedBetsNum($event, item, item.num)">{{Number(item.num)}}</span>
        </div>
      </div>
      <div class="banbo" v-if="showModel && getBetsData.title === '半波'">
        <div class="banbo-bets-wrap" v-for="(banbo, bi) in bbArr" :key="bi">
          <div class="split-bar"></div>
          <div class="bets-number-wrap" :class="betsNumber.indexOf(banbo.title)>-1?'active':''" @click="handleCheckedBetsNum($event, banbo, banbo.title)">
            <h2 class="bets-title">
              <strong>{{banbo.title}}</strong>
              <em>赔率{{banbo.multiple}}</em>
              <span class="under-line"></span>
            </h2>
            <div class="bets-content">
              <span v-for="(num, ni) in banbo.data" :key="ni.toString()" :class="setLotteryNumClass(num.num, 6)">{{num.num}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="shengxiao" v-if="showModel && getBetsData.title.indexOf('肖') > -1 && getBetsData.title !== '六肖'">
        <div class="shengxiao-bets-wrap">
          <div class="split-bar"></div>
          <div class="bets-number-wrap" v-for="(banbo, bi) in use_animal" :key="bi" :class="betsNumber.indexOf(banbo.name)>-1?'active':''" @click="handleCheckedBetsNum($event, banbo, banbo.name)">
            <h2 class="bets-title">
              <strong>{{banbo.name}}</strong>
              <em>赔率{{banbo.multiple||0}}</em>
              <span class="under-line"></span>
            </h2>
            <div class="bets-content">
              <span v-for="(num, ni) in banbo.number" :key="ni.toString()" :class="setLotteryNumClass(num.num, 6)">{{num.num}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="shengxiao" v-if="showModel && getBetsData.title === '六肖'">
        <div class="shengxiao-bets-wrap">
          <div class="split-bar"></div>
          <div class="bets-number-wrap" v-for="(banbo, bi) in use_animal" :key="bi" :class="betsNumber.indexOf(banbo.name)>-1?'active':''" @click="handleCheckedBetsNum($event, banbo, banbo.name, 6)">
            <h2 class="bets-title">
              <strong>{{banbo.name}}</strong>
              <!-- <em>赔率{{banbo.multiple||0}}</em> -->
              <span class="under-line"></span>
            </h2>
            <div class="bets-content">
              <span v-for="(num, ni) in banbo.number" :key="ni.toString()" :class="setLotteryNumClass(num.num, 6)">{{num.num}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="shengxiao" v-if="showModel && getBetsData.title === '尾数'">
        <div class="shengxiao-bets-wrap">
          <div class="split-bar"></div>
          <div class="bets-number-wrap" v-for="(weishu, bi) in wsArr" :key="bi" :class="betsNumber.indexOf(weishu.title)>-1?'active':''" @click="handleCheckedBetsNum($event, weishu, weishu.title)">
            <h2 class="bets-title">
              <strong>{{weishu.title}}</strong>
              <em>赔率{{weishu.multiple||0}}</em>
              <span class="under-line"></span>
            </h2>
            <div class="bets-content">
              <span v-for="(num, ni) in weishu.data" :key="ni.toString()" :class="setLotteryNumClass(num.num, 6)">{{num.num}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="shengxiao" v-if="showModel && getBetsData.title === '总分'">
        <div class="shengxiao-bets-wrap">
          <div class="split-bar"></div>
          <div class="bets-number-wrap" v-for="(zongfen, bi) in zfArr" :key="bi" :class="betsNumber.indexOf(zongfen.title)>-1?'active':''" @click="handleCheckedBetsNum($event, zongfen, zongfen.title)">
            <h2 class="bets-title">
              <strong>{{zongfen.title}}</strong>
              <em>赔率{{zongfen.multiple||0}}</em>
              <span class="under-line"></span>
            </h2>
            <div class="bets-content">
              <p class="ruler-p">{{zongfen.ruler}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="tema" v-if="showModel && getBetsData.title.indexOf('不中') > -1">
        <div class="split-bar"></div>
        <div class="bets-number-wrap">
          <span v-for="(item, i) in allBalls" :key="i" :class="betsNumber.indexOf(item.num)>-1?'active':''" @click="handleCheckedBetsNum($event, item, item.num, buzhonglength)">{{Number(item.num)}}</span>
        </div>
      </div>
    </div>
    <div class="bot">
      <div class="bot-t">
        <div class="multiple">
          <em>{{moneyType}}：</em>
          <p>
            <span class="reduce" @click="handleReduceMultiple"><i class="hor"></i></span>
            <input type="text" v-model.trim="multiple" @blur="handleBlurMultiple" @focus="handleFocusMultiple">
            <span class="plus" @click="handlePlusMultiple"><i class="hor"></i><i class="ver"></i></span>
          </p>
        </div>
        <span class="clean-btn" @click="resetBetsNumber">清空</span>
      </div>
      <div class="bot-b">
        <p>
          <span>共 {{getBetsFn()}} 注</span>
          &nbsp;
          <span class="money">￥ {{setMoneyFn().toFixed(2)}}</span>
        </p>
        <span class="confirm-btn" @click="confirmBets">确认投注</span>
      </div>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <div class="confirm-bets-dialog" v-if="showConfirmDialog1">
      <div class="dialog-content">
        <h2 class="dialog-title">确认投注信息<em class="close-em" @click="handleCloseBetsDialog('showConfirmDialog1')">×</em></h2>
        <div class="dialog-bets-content">
          <span v-for="(bets, bi) in confirmBetsData" :key="bi">{{lotteryname}} ({{bets.betsName}}) {{bets.multiple}} x{{multiple}}</span>
        </div>
        <div class="split-line"></div>
        <strong>共计：<em>￥{{setMoneyFn()}} / {{getBetsFn()}}注</em>，您确定下注吗？</strong>
        <button class="confirm-to-bets" @click="toBetsFn('showConfirmDialog1')">确定</button>
      </div>
    </div>
    <div class="dialog-bj" v-if="showConfirmDialog1"></div>
    <div class="confirm-bets-dialog" v-if="showConfirmDialog2">
      <div class="dialog-content">
        <h2 class="dialog-title">确认投注信息<em class="close-em" @click="handleCloseBetsDialog('showConfirmDialog2')">×</em></h2>
        <div class="dialog-bets-content" style="padding-left:.3rem;padding-right:.3rem;">
          <span v-for="(bets, bi) in confirmBetsData" :key="bi" style="margin-left:0;">{{bets.betsName}}、</span>
        </div>
        <div class="split-line"></div>
        <strong><p>组合共<span></span></p>：<em>{{getBetsFn()}}组</em></strong>
        <strong><p>单注金额<span></span></p>：<em>{{multiple}}元</em></strong>
        <strong><p>总下注金额<span></span></p>：<em>{{setMoneyFn()}}元</em></strong>
        <button class="confirm-to-bets" @click="toBetsFn('showConfirmDialog2')">确定</button>
      </div>
    </div>
    <div class="dialog-bj" v-if="showConfirmDialog2"></div>
    <div class="confirm-bets-dialog" v-if="betsOk">
      <div class="dialog-content">
        <h2 class="dialog-title">投注结果<em class="close-em" @click="handleCloseBetsDialog('betsOk')">×</em></h2>
        <p>
          恭喜您，投注成功！您可以点击
          <router-link :to="{name:'cpjl'}">
            “游戏记录”
          </router-link>
        </p>
        <router-link :to="{name:'betsDetail',query:{id:betsId}}">
          <button class="confirm-to-bets">注单详情</button>
        </router-link>
      </div>
    </div>
    <div class="dialog-bj" v-if="betsOk"></div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import lottery from '@/assets/js/lottery.js';
import paramCryptFn from '@/assets/js/cryptData.js'
export default {
  name: 'betsView',
  components: {},
  data() {
    return {
      betsId: '',
      showModel: false,
      betsOk: false,
      showConfirmDialog1: false,
      showConfirmDialog2: false,
      nowIssue: '', //当前期号
      lastIssue: '', // 上一期期号
      lastLotteryNumber: '', // 上一期中奖号码
      getIssueTime: 10, // 获取最新一期 期号的定时 s
      myInterval: null, // 定时器
      isActivityBegin: false, // 活动是否开始
      countDownTime: {}, // 倒计时
      showLotteryComponents: false, // 是否显示投注组件
      showMoneyType: false, // 是否显示金钱类型
      moneyType: '元', // 金钱类型
      multiple: 1, // 倍数
      maxMultiple: 20, // 最大倍数
      minMultiple: 1, // 最小倍数
      userRefund: '1950', // 用户返点
      maxRefund: 2000,
      minRefund: 1800,
      defaultRefund: 0,
      money: 0, // 金额
      maxPrize: 0, //
      refundArr: [],
      prize: 0, // 奖金
      prizeArea: '', // 奖金组
      diff: 0,
      gameid: '', // 彩票id (重庆时时彩, 天津时时彩 ...)
      gamename: '', // 彩票名称
      lottery3id: '', // 玩法id, 五星, 四星, 三星 ...
      lottery3name: '', // 玩法名称
      c_lottery3name: '',
      lotteryid: '', // 投注方式id, 直选复式, 直选组合, 组选, ...
      lotteryname: '', // 投注方式名称
      c_lotteryname: '',
      lotterytitle: '', // 投注方式 标题, 直选, 组选, ...
      tipText: '', // 提示的文本内容
      alertDur: 1.5, // 文本提示显示的时间 3s
      
      betsNumber: [], // 投注号码
      betsArr: [], // 投注号码数组

      animal: [],
      
      allBalls: [], // 所有 数字集合
      redBalls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'], // 红数字
      greenBalls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'], // 绿数字
      blueBalls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'], // 蓝数字

      animalsArr: [
        {name: "大", checked: false},
        {name: "小", checked: false},
        {name: "单", checked: false},
        {name: "双", checked: false},
        {name: "鼠", checked: false},
        {name: "牛", checked: false},
        {name: "虎", checked: false},
        {name: "兔", checked: false},
        {name: "龙", checked: false},
        {name: "蛇", checked: false},
        {name: "马", checked: false},
        {name: "羊", checked: false},
        {name: "猴", checked: false},
        {name: "鸡", checked: false},
        {name: "狗", checked: false},
        {name: "猪", checked: false}
      ],

      bbArr: [],
      wsArr: [],
      zfArr: [
        {title: '大', ruler: '总分大于等于175的，即视为中奖。', multiple: '', money: ''},
        {title: '小', ruler: '总分小于等于175的，即视为中奖。', multiple: '', money: ''},
        {title: '单', ruler: '总分是单数的，即视为中奖。', multiple: '', money: ''},
        {title: '双', ruler: '总分是双数的，即视为中奖。', multiple: '', money: ''},
        {title: '大单', ruler: '总分大于等于175且为单数的，即视为中奖。', multiple: '', money: ''},
        {title: '大双', ruler: '总分大于等于175且为双数的，即视为中奖。', multiple: '', money: ''},
        {title: '小单', ruler: '总分小于等于175且为单数的，即视为中奖。', multiple: '', money: ''},
        {title: '小双', ruler: '总分小于等于175且为双数的，即视为中奖。', multiple: '', money: ''}
      ],
      buzhonglength: 5,
      c_animal: ["鼠", "马", "牛", "羊", "虎", "猴", "兔", "鸡", "龙", "狗", "蛇", "猪"],
      use_animal: [],

      confirmBetsData: [],

      sxRatio: 0,
      sxIndex: 0,

      voteList: [],

      showModle: false,
      gameCode: '', // 彩票代码 ssc, 11x5, ks ...
      lhc: [
        {
          title: '特码',
          checked: false,
          value: [
            {
              title: '特码',
              data: [
                { title: '特码', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true}
              ]
            }
          ]
        },
        {
          title: '正码',
          checked: false,
          value: [
            {
              title: '正码',
              data: [
                { title: '正码1', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '正码2', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '正码3', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '正码4', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '正码5', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '正码6', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
              ]
            }
          ]
        },
        {
          title: '半波',
          checked: false,
          value: [
            {
              title: '半波',
              data: [
                { title: '半波', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '生肖',
          checked: false,
          value: [
            {
              title: '生肖',
              data: [
                { title: '特肖', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '一肖', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '六肖', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: [], betsMode: 6, isDouble: true}
              ]
            }
          ]
        },
        {
          title: '尾数',
          checked: false,
          value: [
            {
              title: '尾数',
              data: [
                { title: '尾数', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
                { title: '尾数', type: 'compound', showOprateBtn: false, checked: true, unit: 1, betsTitle: [], betsMode: 1, isDouble: true}
              ]
            }
          ]
        },
        {
          title: '总分',
          checked: false,
          value: [
            {
              title: '总分',
              data: [
                { title: '总分', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 1, isDouble: true},
              ]
            }
          ]
        },
        {
          title: '不中',
          checked: false,
          value: [
            {
              title: '不中',
              data: [
                { title: '五不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 5, isDouble: true},
                { title: '六不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 6, isDouble: true},
                { title: '七不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 7, isDouble: true},
                { title: '八不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 8, isDouble: true},
                { title: '九不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 9, isDouble: true},
                { title: '十不中', type: 'compound', showOprateBtn: false, checked: false, unit: 1, betsTitle: [], betsMode: 10, isDouble: true},
              ]
            }
          ]
        },
      ],
    }
  },
  created() {
    let query = this.$route.query;
    // console.log(query)
    this.gameCode = query.code;
    this.gameid = query.id;
    let name = query.name;
    
    this.refund = Number(localStorage.getItem('refund'));
    this.defaultRefund = this.refund/this.maxRefund;

    this.$store.dispatch('setTitle', name);
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setPlayModeStatus', true);
    this.$store.dispatch('setBets', 0);
    this.$store.dispatch('setShowLotteryComponents', false)
    this.userRefund = localStorage.getItem('refund');
    this.getLotteryDetailList();
    this.newIssueInterval();
    this.getAnimalList();
  },
  mounted() {},
  beforeDestroy() {
    // console.log('beforeDestroy')
  },
  destroyed() {
    // console.log('destroyed')
  },
  watch: {
    getBetsData (n, o) {
      // console.log(n, o)
      // console.log(this.getBetsData)
      this.betsNumber = [];
      this.confirmBetsData = [];
      this.multiple = 1;
      this.animalsArr.filter(v => {v.checked = false;})
      if(n.title.indexOf('不中') > -1){
        if(n.title === '五不中'){this.buzhonglength = 5};
        if(n.title === '六不中'){this.buzhonglength = 6};
        if(n.title === '七不中'){this.buzhonglength = 7};
        if(n.title === '八不中'){this.buzhonglength = 8};
        if(n.title === '九不中'){this.buzhonglength = 9};
        if(n.title === '十不中'){this.buzhonglength = 10};
      }
      if(n.title === '半波'){
        this.bbNumbersArr();
      }
      if(n.title.indexOf('肖') > -1){
        this.animalNumberArr();
      }
      if(n.title === '尾数'){
        this.wsNumbersArr();
      }
      if(n.title === '总分'){
        this.zfNumberArr();
      }
    }
  },
  computed: {
    getBetsData() {
      return this.$store.state.betsData;
    },
    getMultiple() {
      return this.$store.state.multiple;
    },
    getShowLotteryComponents() {
      return this.$store.state.showLotteryComponents;
    },
    getPlayName() {
      return this.$store.state.playName;
    },
    getShoppingLength() {
      return this.$store.state.shoppingCartData.length
    }
  },
  methods: {
    //千分函数，暂时不用，站位
    toThousands(val) {
      return val;
    },
    // 设置期数显示样式
    setIssueNum(issue) {
      let s = ''
      if(!issue){return s;}
      if(this.gameCode === 'ssc'){
        s = issue.toString().substr(2);
      }else {
        s = issue.toString();
      }
      return s;
    },
    // 设置中奖号码的样式
    setLotteryNumClass(k, i) {
      let c = '';
      let c1 = '';
      let ri = this.redBalls.indexOf(k);
      let gi = this.greenBalls.indexOf(k);
      let bi = this.blueBalls.indexOf(k);
      if(i<6){
        if(ri > -1){
          c = 'red';
        }else if(gi > -1){
          c = 'green';
        }else if(bi > -1){
          c = 'blue'
        }
      }else if(i == 6){
        if(ri > -1){
          c = 'red-fullColor';
        }else if(gi > -1){
          c = 'green-fullColor';
        }else if(bi > -1){
          c = 'blue-fullColor'
        }
      }
      if(this.refreshIssue){
        c1 = 'flip'
      }else{
        c1 = '';
      }
      return c+' '+c1;
    },
    // 设置中奖号码的 动物文字
    setAnimalTextFn(k) {
      let text = '';
      this.allBalls.filter(v => {
        if(Number(k) === Number(v.num)){
          text = v.name;
        }
      })
      return text;
    },
    // 获取生肖
    getAnimalList() {
      const vm = this;
      request.http(
        'get',
        '/lottery/lhc/animal/list',
        {},
        (success) => {
          // console.log(success);
          let code = success.returncode;
          if(code === 103){
            request.loginAgain(vm)
          }else if(code === 101){
            request.loginAgain(vm)
          }else if(code === 106){
            request.loginAgain(vm)
          }else if(code === 200){
            vm.animal = success.data
            vm.setAllnumbersDataFn();
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    setAllnumbersDataFn() {
      const vm = this;
      // console.log(this.getBetsData)
      let probability = this.getBetsData.probability;
      let arr = [];
      for(let i=1; i<50; i++){
        let o = new Object();
        if(i<10){
          o.num = '0'+i;
        }else{
          o.num = i.toString();
        }
        // o.num = i.toString();
        let name;
        vm.animal.filter(v => {
          let n = v.number.split(',').indexOf(o.num);
          if(n > -1){
            name = v.name
          }
        })
        let t1;
        vm.redBalls.filter(v => {
          let n = v.indexOf(o.num);
          if(n > -1){
            t1 = '红'
          }
        })
        let t2;
        vm.greenBalls.filter(v => {
          let n = v.indexOf(o.num);
          if(n > -1){
            t2 = '绿'
          }
        })
        let t3;
        vm.blueBalls.filter(v => {
          let n = v.indexOf(o.num);
          if(n > -1){
            t3 = '蓝'
          }
        })
        o.checked = false;
        o.animated = false;
        o.name = name;
        o.color = t1||t2||t3;
        o.money = '';
        o.multiple = (probability*vm.defaultRefund).toFixed(2);;
        arr.push(o)
      }
      this.allBalls = arr;
      this.showModel = true;
      // console.log(this.allBalls)
      // 设置投注的 数字 对象
      // for(var i=1; i<11; i++){
      //   vm.filterBallsArr(arr, i)
      // }
    },
    // 设置投注的 数字 对象
    filterBallsArr(balls, i) {
      const vm = this;
      balls.filter(v => {
        let n = Number(v.num.split('')[1]);
        if(i < 10){
          if(n === i){
            vm.allBalls.push(v)
          }
        }else{
          if(n === 0){
            vm.allBalls.push(v)
          }
        }
      })
      // console.log(vm.allBalls)
    },
    // 选择操作按钮
    handleSelectOprate(e, item) {
      const vm = this;
      this.betsNumber = [];
      this.confirmBetsData = [];
      e.stopPropagation();
      let text = item.name;
      vm.animalsArr.filter(v => {
        v.checked = false;
      })
      vm.allBalls.filter(v => {
        let o = new Object();
        for(let i in v){
          o[i] = v[i];
        }
        if(text === '大'){
          if(Number(v.num) > Math.floor((vm.allBalls.length-1)/2)){
            vm.betsNumber.push(v.num);
            o.betsName = v.num;
            vm.confirmBetsData.push(o);
          }
        }else if(text === '小'){
          if(Number(v.num) <= Math.floor((vm.allBalls.length-1)/2)){
            vm.betsNumber.push(v.num)
            o.betsName = v.num;
            vm.confirmBetsData.push(o);
          }
        }else if(text === '单'){
          if(Number(v.num)%2 === 1){
            vm.betsNumber.push(v.num)
            o.betsName = v.num;
            vm.confirmBetsData.push(o);
          }
        }else if(text === '双'){
          if(Number(v.num)%2 === 0){
            vm.betsNumber.push(v.num)
            o.betsName = v.num;
            vm.confirmBetsData.push(o);
          }
        }else if(v.name === text){
          vm.betsNumber.push(v.num)
          o.betsName = v.num;
          vm.confirmBetsData.push(o);
        }
      })
      item.checked = true;
      this.$store.dispatch('setBets', this.betsNumber.length);
    },
    // 选中投注号码
    handleCheckedBetsNum(e, item, num, len) {
      e.stopPropagation();
      // console.log(item)
      item.betsName = num;
      let index = this.betsNumber.indexOf(num);
      if(index > -1){
        this.betsNumber.splice(index, 1)
        this.confirmBetsData.slice(index, 1);
      }else{
        this.betsNumber.push(num);
        this.confirmBetsData.push(item);
      }
      
      if(!len) {
        this.$store.dispatch('setBets', this.betsNumber.length);
      }else{
        let bets = lottery.groupSelectOne(this.betsNumber.length, len, 1);
        this.$store.dispatch('setBets', bets);
      }
    },
    // 定时获取最新的期数
    getNewIssue() {
      const vm = this;
      var time = vm.getIssueTime;
      vm.myInterval = setInterval(vm.newIssueInterval, (time * 1000))
    },
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
          if (latestIssue === -1) {
            vm.isActivityBegin = true
          } else {
            vm.isActivityBegin = false;
          }
          if (code === 103 || code === 101 || code === 106) {
            request.loginAgain(vm)
          } else if (code === 200) {
            if(vm.nowIssue !== latestIssue.issue_no){
              vm.$store.dispatch('setIssue', latestIssue.issue_no)
            }
            vm.getCountDownTime(latestIssue.countdown);
            vm.nowIssue = latestIssue.issue_no;
            vm.lastIssue = success.data.issues[0].issue_no;
            vm.lastLotteryNumber = success.data.issues[0].luck_no;
            vm.$store.dispatch('setBlance', success.data.cash);
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
    //格式化 时分秒
    formatTimeFn(time) {
      let t;
      if (time < 10) {
        t = '0' + time;
      } else {
        t = time;
      }
      return t;
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
          vm.newIssueInterval();
        }
        this.countDownTime = {hour, min, sec};
      }, 1000)
    },
    // 获取玩法列表
    getLotteryDetailList() {
      const vm = this;
      let defaultAt = 2000;
      request.http(
        'get',
        '/lottery/game/detail',
        { gameid: vm.gameid },
        (success) => {
          // console.log('game-detail-----', success);
          let code = success.returncode;
          if (code === 103) {
            request.loginAgain(vm)
          } else if (code === 101) {
            request.loginAgain(vm)
          } else if (code === 106) {
            request.loginAgain(vm)
          } else if (code === 200) {
            vm.maxRefund = success.data.max_refund;
            vm.minRefund = success.data.min_refund;
            vm.maxPrize = success.data.max_prize;
            vm.diff = success.data.diff;
            vm.gamename = success.data.name;
            vm.setInitData(success.data.children)
            let r1 = vm.minRefund + '-' + ((vm.userRefund-vm.minRefund)/defaultAt * 100).toFixed(2)+'%';
            let r2 = vm.userRefund + '-0%';
            vm.refundArr = [ r1, r2 ];
            vm.$store.dispatch('setRefurnArr', vm.refundArr)
            // vm.$nextTick(() => {
            //   vm.getNewIssue()
            // })
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    // 格式化玩法数据
    setInitData(data) {
      const vm = this;
      this.showModle = true;
      // console.log(data)
      // console.log(this.gameCode)
      // value数组，对应v.children
      vm[vm.gameCode].filter((v, vi) => {
        v.lottery3id = data[vi]._id;
        v.value.filter((k, ki) => {
          k.show = false;
          if(data[vi].children[ki]){
            k.show = true;
          }
          k.data.filter((m, mi) => {
            m.show = false;
            if(data[vi].children[ki].children[mi]){
              m.show = true;
              m.play = data[vi].children[ki].children[mi].note1; // 玩法
              m.plan = data[vi].children[ki].children[mi].note2; // 方案
              m.prize = data[vi].children[ki].children[mi].prize || 0; // 奖金
              m.extra = data[vi].children[ki].children[mi].extra||''; // 赔率数组
              m.probability = data[vi].children[ki].children[mi].probability; // 赔率
              m.lotteryid = data[vi].children[ki].children[mi]._id; // lotteryid
            }
          })
        })
      })
      // console.log(vm[vm.gameCode])
      let item1 = vm[vm.gameCode][0], item2 = vm[vm.gameCode][0].value[0].data[0];
      // console.log([ [item1.title, item2.title], [item1.lottery3id, item2.lotteryid] ])
      this.$store.dispatch('setPlayData', vm[vm.gameCode])
      // this.$store.dispatch('setPlayName', [ [item1.title, item2.title], [item1.lottery3id, item2.lotteryid] ])
      if(!this.$store.state.playName.length){
        this.$store.dispatch('setPlayName', [ [item1.title, item2.title], [item1.lottery3id, item2.lotteryid] ])
      // 默认加载进来时 显示的 玩法，投注 默认第一个的第一个
        this.$store.dispatch('setBetsData', vm[vm.gameCode][0].value[0].data[0]);
      }
      this.betsNumber = [];
      this.confirmBetsData = [];
      this.multiple = 1;
      this.animalsArr.filter(v => {v.checked = false;})
      if(this.getBetsData.title.indexOf('不中') > -1){
        if(this.getBetsData.title === '五不中'){this.buzhonglength = 5};
        if(this.getBetsData.title === '六不中'){this.buzhonglength = 6};
        if(this.getBetsData.title === '七不中'){this.buzhonglength = 7};
        if(this.getBetsData.title === '八不中'){this.buzhonglength = 8};
        if(this.getBetsData.title === '九不中'){this.buzhonglength = 9};
        if(this.getBetsData.title === '十不中'){this.buzhonglength = 10};
      }
      // this.$store.dispatch('setShowLotteryComponents', true)
      // this.showLotteryComponents = true;
    },
    isShowModel() {
      const vm = this;
      if(!this.getShowLotteryComponents){
        setTimeout(()=>{
          vm.$store.dispatch('setShowLotteryComponents', true)
        },10)
        this.multiple = 1;
      }
      return this.getShowLotteryComponents;
    },
    
    // 倍数聚焦
    handleFocusMultiple() {
      // const vm = this;
      // document.onkeyup = function() {
      //   vm.multiple = vm.multiple.toString().replace(/\D/g,function(){return ''})
      //   if(Number(vm.multiple) === 0){
      //     vm.multiple = 1;
      //   }else if (vm.multiple >= vm.maxMultiple) {
      //     vm.multiple = vm.maxMultiple
      //   }
      //   // console.log(vm.multiple)
      // }
    },
    // 倍数失焦
    handleBlurMultiple() {
      // document.onkeyup = null;
      const vm = this;
      vm.multiple = vm.multiple.toString().replace(/\D/g,function(){return ''})
      if(Number(vm.multiple) === 0){
        vm.multiple = 1;
      }
      // if (this.multiple >= this.maxMultiple) {
      //   this.multiple = this.maxMultiple
      // }
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

    // 获取 注 数
    getBetsFn() {
      return this.$store.state.bets
    },
    // 设置 钱
    setMoneyFn() {
      let point = 1;
      // if (this.moneyType === '元') {
      //   point = 1
      // } else if (this.moneyType === '角') {
      //   point = 0.1
      // } else if (this.moneyType === '分') {
      //   point = 0.01
      // }
      return Number(this.$store.state.bets * this.multiple) * point
    },
    // 清空
    resetBetsNumber() {
      this.animalsArr.filter(v => {v.checked = false;})
      this.betsNumber = [];
    },
    // 关闭弹框
    handleCloseBetsDialog(val) {
      this[val] = false;
      this.$store.dispatch('setHeader', true);
    },
    // 投注
    confirmBets() {
      const vm = this;
      let userBlance = localStorage.getItem('blance');
      if ( Number(userBlance) < this.setMoneyFn() ) {
        vm.tipText = '对不起，您的余额不足！请充值.'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.alertDur*1000);
        return false;
      } else if ( this.getBetsFn() === 0 ) {
        vm.tipText = '你还没有选择注码!'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.alertDur*1000);
        return false;
      } else {
        let gameid = this.gameid;
        let issue_no = this.nowIssue;
        let playName = this.$store.state.playName;
        let title = playName[0][0];
        this.lotteryname = playName[0][1];
        let lottery3id = playName[1][0];
        let lotteryid = playName[1][1];
        let refund = this.userRefund + '-0%';
        let unit = '元';
        let vote_num = 1;
        let voteList = [];
        if(title === '生肖'){
          if (this.getBetsData.title === '六肖') {
            this.showConfirmDialog2 = true;
            this.$store.dispatch('setHeader', false);
            let arr = [];
            this.confirmBetsData.filter(v => {
              let newNum = [];
              v.number.filter(k => {
                newNum.push(k.num)
              })
              arr.push(newNum.join('-'))
            })
            let vote_no = arr.join('|');
            let vote_cash = this.setMoneyFn().toFixed(2);
            let o = {gameid, issue_no, lottery3id, lotteryid, refund, unit, vote_num, vote_no, vote_cash};
            voteList.push(o)
          } else {
            this.showConfirmDialog1 = true;
            this.$store.dispatch('setHeader', false);
            this.confirmBetsData.filter(v => {
              let newNum = [];
              let vote_cash = vm.multiple;
              v.number.filter(k => {
                newNum.push(k.num)
              })
              let vote_no = newNum.join('-');
              let o = {gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund}
              voteList.push(o)
            })
          }
        } else if(this.getBetsData.title.indexOf('不中') > -1) {
          this.showConfirmDialog2 = true;
          this.$store.dispatch('setHeader', false);
          let arr = [];
          this.confirmBetsData.filter(v => {
            arr.push(v.betsName)
          })
          let vote_no = arr.join('-');
          let vote_cash = this.setMoneyFn().toFixed(2);
          let o = {gameid, issue_no, lottery3id, lotteryid, refund, unit, vote_num, vote_no, vote_cash};
          voteList.push(o)
        } else {
          this.showConfirmDialog1 = true;
          this.$store.dispatch('setHeader', false);
          this.confirmBetsData.filter(v => {
            let vote_cash = vm.multiple;
            let vote_no = v.betsName;
            let o = {gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund}
            voteList.push(o)
          })
        }
        this.voteList = voteList;
      }
    },
    toBetsFn(val) {
      const vm = this;
      let voteList = this.voteList;
      // console.log(voteList)
      // return false;
      request.http(
        'post',
        '/lottery/issue/vote',
        paramCryptFn({voteList}),
        (success) => {
          // console.log(success);
          let code = success.returncode;
          if(code === 103 || code === 101 || code === 106){
            request.loginAgain(vm)
          }else if(code === 304){
            vm.tipText = '对不起，您的余额不足！请充值.'
            setTimeout(() => {
              vm.tipText = '';
            }, vm.alertDur*1000);
          }else if(code === 200){
            vm.betsNumber = [];
            vm.confirmBetsData = [];
            vm.multiple = 1;
            vm.betsId = success.data.result[0]._id;
            vm.betsOk = true;
            vm[val] = false;
            vm.$store.dispatch('setBlance', success.data.cash);
            localStorage.setItem('blance', success.data.cash);
          }else{
            alert(success.data.msg)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },

    
    // 获取数字集合
    bbNumbersArr() {
      let extra = this.getBetsData.extra;
      // console.log(this.getBetsData)
      const vm = this;
      let numsArr = [];
      let color = ['红', '绿', '蓝'];
      let type = ['大', '小', '单', '双', '合单', '合双'];
      let n = Math.floor(vm.allBalls.length/2);
      color.filter(v => {
        type.filter(m => {
          let o = {
            title: v+m,
            money: '',
            data: []
          };
          
          vm.allBalls.filter(k => {
            if(v === k.color){
              if(m === '大'){
                if(k.num > n)o.data.push({num: k.num})
              }else if(m === '小'){
                if(!(k.num > n))o.data.push({num: k.num})
              }else if(m === '单'){
                if(Number(k.num)%2 === 1)o.data.push({num: k.num})
              }else if(m === '双'){
                if(Number(k.num)%2 === 0)o.data.push({num: k.num})
              }else if(m === '合单'){
                let numArr = k.num.split('');
                let num = Number(numArr[0]) + Number(numArr[1]);
                if(num%2 === 1)o.data.push({num: k.num})
              }else if(m === '合双'){
                let numArr = k.num.split('');
                let num = Number(numArr[0]) + Number(numArr[1]);
                if(num%2 === 0)o.data.push({num: k.num})
              }
            }
          })
          o.data.sort((a, b)=>{
            return a.num-b.num
          })
          o.multiple = (extra[v+m]*vm.defaultRefund).toFixed(2);
          o.money = '';
          o.checked = false;
          o.animated = false;
          numsArr.push(o)
        })
      })
      let halfLen = Math.floor(numsArr.length/2);
      let newArr = [];
      for(let i=0; i<halfLen; i++){
        let j = halfLen + i;
        newArr.push(numsArr[i])
        newArr.push(numsArr[j])
      }
      this.bbArr = newArr
      // console.log(this.bbArr)
    },
    animalNumberArr() {
      this.use_animal = [];
      let extra = this.getBetsData.extra;
      const vm = this;
      let _style = '';
      vm.c_animal.filter(k => {
        vm.animal.filter(v => {
          let arr1 = v.number.split(',');
          let arr2 = []
          arr1.filter(m => {
            arr2.push({
              num: m
            })
          })
          if(k === v.name) {
            vm.use_animal.push({
              name: v.name,
              neiwai: v.neiwai,
              number: arr2,
              sex: v.sex,
              size: v.size,
              wuhang: v.wuhang,
              xiangmao: v.xiangmao,
              yinyang: v.yinyang,
              multiple: (extra[v.name]*vm.defaultRefund).toFixed(2),
              money: '',
              style: _style,
              checked: false,
              animated: false
            })
          }
        })
      })
    },
    // 尾数 投注 操作 函数   开始--------------
    wsNumbersArr() {
      const vm = this;
      let extra = this.getBetsData.extra;
      let arr = [];
      for(let i=0; i<10; i++){
        let o = {
          data: [],
          checked: false,
          animated: false,
          money: ''
        };
        vm.allBalls.filter(v => {
          let n = Number(v.num.split('')[1]);
          if(n === i){
            o.data.push({num: v.num})
          }
        })
        o.title = i+'尾'
        o.multiple = (extra[i]*vm.defaultRefund).toFixed(2);
        arr.push(o)
      }
      // let halfLen = Math.floor(arr.length/2);
      // let newArr = [];
      // for(let i=0; i<halfLen; i++){
      //   let j = halfLen + i;
      //   newArr.push(arr[i])
      //   newArr.push(arr[j])
      // }
      this.wsArr = arr;
    },
    zfNumberArr() {
      const vm = this;
      let extra = this.getBetsData.extra;
      this.zfArr.filter(v => {
        v.multiple = (extra[v.title]*vm.defaultRefund).toFixed(2);
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.betsView-wrap{
  position: relative;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  span.green{
    border:.02rem solid #0F9075;
  }
  span.blue{
    border:.02rem solid #3357D7;
  }
  span.red{
    border:.02rem solid #BD3840;
  }
  span.green-fullColor{
    background:#0F9075;
    color:#fff;
  }
  span.blue-fullColor{
    background:#3357D7;
    color:#fff;
  }
  span.red-fullColor{
    background:#BD3840;
    color:#fff;
  }
  .top{
    width:100%;
    // height:2.92rem;
    padding:.3rem;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-pack:start;
    span.issue-num{
      color:#CC3447;
    }
    .lastIssue{
      font-size:.26rem;
      margin-bottom:.1rem;
    }
    .lottery-wrap{
      display:-webkit-box;
      -webkit-box-align:center;
      div{
        height:auto;
        color:#939DB8;
        display:-webkit-box;
        -webkit-box-align:center;
        position: relative;
        margin-right:.1rem;
        span{
          display:block;
          width:.5rem;
          height:.5rem;
          text-align:center;
          line-height:.47rem;
          font-size:.28rem;
          color:#939DB8;
          border-radius:50%;
          margin-right:.1rem;
        }
        em.animalText{
          position: absolute;
          font-style: normal;
          left: .12rem;
          bottom: -.4rem;
          font-size: .24rem;
        }
      }
      strong{
        color:#CC3447;
        font-size:.32rem;
      }
    }
    .last{
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.73rem;
      .nowIssue{
        font-size:.26rem;
        margin-right:.12rem;
      }
      p.countDown{
        // width:3.13rem;
        height:.62rem;
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:end;
        font-size: .44rem;
        margin-bottom:0;
        span{
          display:block;
          width:.68rem;
          height:.62rem;
          background: #303040;
          border-radius: .08rem;
          text-align:center;
          line-height: .62rem;
        }
        em{
          display:-webkit-box;
          -webkit-box-orient:vertical;
          margin:0 .1rem;
          i{
            display:block;
            width:.08rem;
            height:.08rem;
            background:#939DB8;
            border-radius:50%;
            &:first-child{
              margin-bottom:.1rem;
            }
          }
        }
      }
    }
  }
  .cen{
    // height:8.78rem;
    -webkit-box-flex:1;
    overflow-y:auto;
    .tema{
      .tema-animate-oprate{
        width:6.92rem;
        // height:3.68rem;
        margin:.3rem;
        padding:.3rem 0 0 .3rem;
        display:flex;
        flex-wrap:wrap;
        border: .01rem solid #333333;
        border-radius: .08rem;
        span{
          display:block;
          width:1.35rem;
          height:.54rem;
          text-align:center;
          line-height:.54rem;
          background: #292932;
          border: .02rem solid #303040;
          border-radius: .08rem;
          margin:0 .3rem .3rem 0;
        }
        span.active{
          background:yellow;
          color:#191919;
        }
      }
      .bets-number-wrap{
        width:6.92rem;
        // height:5.5rem;
        margin:.3rem;
        padding:.3rem 0 .1rem .24rem;
        display:flex;
        flex-wrap:wrap;
        border: .01rem solid #333333;
        border-radius: .08rem;
        span{
          display:block;
          width:.82rem;
          height:.82rem;
          text-align:center;
          line-height:.82rem;
          background: #292932;
          border: .02rem solid #303040;
          border-radius: 50%;
          margin:0 .28rem .2rem 0;
          font-size:.48rem;
          &:nth-child(6n){
            // margin-right:.24rem;
          }
        }
        span.active{
          background:yellow;
          color:#191919;
        }
      }
    }
    .banbo{
      div.active{
        background:yellow;
      }
      .bets-number-wrap{
        width:6.92rem;
        margin:.3rem;
        padding-bottom:.3rem;
        border: .01rem solid #333333;
        border-radius: .08rem;
        h2.bets-title{
          padding:.3rem;
          position: relative;
          font-weight:normal;
          display:-webkit-box;
          -webkit-box-align:end;
          strong{
            font-size:.32rem;
            margin-right:.2rem;
            display:block;
          }
          em{
            font-size:.24rem;
            font-style:normal;
            color:#C83C4A;
            display:block;
          }
          span{
            width:1.8rem;
            height:.01rem;
            background:#333;
            position: absolute;
            left:.3rem;
            bottom:0;
          }
        }
        .bets-content{
          padding-left:.83rem;
          display:flex;
          flex-wrap:wrap;
          span{
            display:block;
            width:.82rem;
            height:.82rem;
            text-align:center;
            line-height:.82rem;
            border-radius: 50%;
            margin:.3rem .3rem 0 0;
            font-size:.48rem;
          }
          span.active{
            background:yellow;
            color:#191919;
          }
        }
      }
    }
    .shengxiao{
      .split-bar{
        margin-bottom:.3rem;
      }
      div.active{
        background:yellow;
      }
      .shengxiao-bets-wrap{
        display:flex;
        flex-wrap:wrap;
      }
      .bets-number-wrap{
        width:3.32rem;
        margin:0 0 .3rem .3rem;
        padding-bottom:.3rem;
        border: .01rem solid #333333;
        border-radius: .08rem;
        h2.bets-title{
          padding:.3rem;
          position: relative;
          font-weight:normal;
          display:-webkit-box;
          -webkit-box-align:end;
          strong{
            font-size:.32rem;
            margin-right:.2rem;
            display:block;
          }
          em{
            font-size:.24rem;
            font-style:normal;
            color:#C83C4A;
            display:block;
          }
          span{
            width:1.8rem;
            height:.01rem;
            background:#333;
            position: absolute;
            left:.3rem;
            bottom:0;
          }
        }
        .bets-content{
          padding-left:.27rem;
          display:flex;
          flex-wrap:wrap;
          span{
            display:block;
            width:.5rem;
            height:.5rem;
            text-align:center;
            line-height:.5rem;
            border-radius: 50%;
            margin:.3rem .2rem 0 0;
            font-size:.28rem;
          }
          span.active{
            background:yellow;
            color:#191919;
          }
          p.ruler-p{
            padding-right:.18rem;
            margin-top:.06rem;
            font-size:.2rem;
          }
        }
      }
    }
  }
  .bot{
    .bot-t, .bot-b{
      width:100%;
      height:.98rem;
      padding:0 .3rem;
      display:-webkit-box;
      -webkit-box-pack:justify;
      -webkit-box-align:center;
    }
    .bot-t{
      background:#292932;
      .multiple{
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:justify;
        height:.68rem;
        margin-right:.4rem;
        em{
          display: block;
          font-style:normal;
          line-height: .68rem;
        }
        p{
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
      }
      .clean-btn{
        display:block;
        width:1.52rem;
        height:.64rem;
        line-height: .64rem;
        text-align: center;
        border: .02rem solid #939DB8;
        border-radius: .08rem;
        color: #939DB8;
      }
    }
    .bot-b{
      p{
        font-size: .32rem;
        color: #939DB8;
        height:.45rem;
        .money{
          // color:#e1c798;
          color:#C83C4A;
        }
      }
      .confirm-btn{
        display:block;
        width:1.52rem;
        height:.64rem;
        line-height: .64rem;
        text-align: center;
        border-radius: .08rem;
        background: #C83C4A;
        color:#c7c7c7;
        position: relative;
        em{
          width:.3rem;
          height:.3rem;
          line-height:.3rem;
          text-align:center;
          border-radius:50%;
          position: absolute;
          background:#fff;
          color:#000;
          right:-.05rem;
          top:-.05rem;
          font-style:normal;
        }
      }
    }
  }


  .split-line{
    width:100%;
    height:1px;
    background: #D8D8D8;
    margin-top:20px;
    border:none;
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
    strong{
      margin-top:.3rem;
      text-align:left;
      display:block;
      width:100%;
      height:.45rem;
      padding-left:.3rem;
      font-size:.32rem;
      color:#191919;
      display:-webkit-box;
      -webkit-box-align:center;
      p{
        width:1.92rem;
        height:100%;
        text-align:justify;
        span{
          display:inline-block;
          padding-left:100%;
        }
      }
      em{
        font-style:normal;
        color:#C83C4A;
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
    .dialog-bets-content{
      display:flex;
      flex-wrap:wrap;
      color:#191919;
      span{
        display:block;
        margin-left:.3rem;
        margin-top:.3rem;
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

