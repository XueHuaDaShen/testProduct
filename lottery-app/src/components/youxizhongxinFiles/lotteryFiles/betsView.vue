<template>
  <div class="betsView-wrap" style="overflow-y:inherit;padding-bottom:0" @click="showMoneyType=false">
    <div class="top">
      <div class="now">
        <p>第{{setIssueNum(lastIssue)}}期</p>
        <p class="lottery-num" v-if="gameCode!=='ks'">
          <span v-for="(num, ni) in lastLotteryNumber.split(',')" :key="ni">{{num}}</span>
        </p>
        <p class="lottery-num" id="ks-lottery-num" v-if="gameCode==='ks'">
          <span :class="'dice'+num" v-for="(num, ni) in lastLotteryNumber.split(',')" :key="ni"></span>
        </p>
      </div>
      <div class="last">
        <p style="text-align:right;">第{{setIssueNum(nowIssue)}}期投注截止</p>
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
      <ssc :betsData="getBetsData" v-if="gameCode==='ssc'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber" @sendWei="handlesendWei"></ssc>
      <syxw :betsData="getBetsData" v-if="gameCode==='syxw'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber"></syxw>
      <ks :betsData="getBetsData" v-if="gameCode==='ks'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber"></ks>
      <pks :betsData="getBetsData" v-if="gameCode==='pks'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber"></pks>
      <sd :betsData="getBetsData" v-if="gameCode==='sd'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber"></sd>
      <plw :betsData="getBetsData" v-if="gameCode==='plw'&&isShowModel()&&showModle" @sendBetsNumber="handlesendBetsNumber"></plw>
    </div>
    <div class="bot">
      <div class="bot-t">
        <div class="money-type" @click="handleShowMoneyType($event)" :class="showMoneyType?'showType':''">
          <span>{{moneyType}}</span>
          <em></em>
          <ul class="money-type-list">
            <li :class="moneyType==='分'?'active':''" @click="changeMoneyType('分', $event)">分</li>
            <li :class="moneyType==='角'?'active':''" @click="changeMoneyType('角', $event)">角</li>
            <li :class="moneyType==='元'?'active':''" @click="changeMoneyType('元', $event)">元</li>
          </ul>
        </div>
        <div class="multiple">
          <em>倍数：</em>
          <p>
            <span class="reduce" @click="handleReduceMultiple"><i class="hor"></i></span>
            <input type="text" v-model.trim="multiple" @blur="handleBlurMultiple" @focus="handleFocusMultiple">
            <span class="plus" @click="handlePlusMultiple"><i class="hor"></i><i class="ver"></i></span>
          </p>
        </div>
        <span class="append-btn" @click="toShoppingCart('append')">添加注单</span>
      </div>
      <div class="bot-b">
        <p>
          <span>共 {{getBetsFn()}} 注</span>
          &nbsp;
          <span class="money">￥ {{setMoneyFn().toFixed(2)}}</span>
        </p>
        <span class="confirm-btn" @click="toShoppingCart('confirm')">确认投注<em v-if="getShoppingLength>0">{{getShoppingLength}}</em></span>
      </div>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import lottery from '@/assets/js/lottery.js';
import ssc from './ssc'
import syxw from './syxw'
import ks from './ks'
import pks from './pks'
import sd from './sd'
import plw from './plw'
const bit = ['万位', '千位', '百位', '十位', '个位'];
export default {
  name: 'betsView',
  components: {
    ssc,
    syxw,
    ks,
    pks,
    sd,
    plw
  },
  data() {
    return {
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
      multiple: this.$store.state.multiple, // 倍数
      maxMultiple: 20, // 最大倍数
      minMultiple: 1, // 最小倍数
      money: 0, // 金额
      userRefund: '1950', // 用户返点
      maxRefund: 0, // 最大返点
      minRefund: 0, // 最小返点
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
      wei: '', // 选中的位数
      
      betsNumber: [], // 投注号码
      betsArr: [], // 投注号码数组

      showModle: false,
      gameCode: '', // 彩票代码 ssc, 11x5, ks ...
      // 彩票类型, 时时彩，11选5，快三，...，每一种彩票里面包含了多玩法，五星，四星，三星...
      ssc: [
        {
          title: '五星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                // 投注方式(标题), 投注类型, 是否显示操作按钮, 标题是否选中, 投注单位, 投注标题(十位, 百位...), 从数字中选出几个进行组合, 是否包含对字号或豹子号, 是否有选中的单位,
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true},
                // 每一注的号码长度, 是否排序(如果排序，说明注码不限顺序)，选中单位的内容
                { title: '直选单式', type: 'text', checked: false, numLen: 5, isDouble: 2, order: false, checkLen: [] }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '直选组合', type: 'compound', showOprateBtn: true, checked: false, unit: 5, betsTitle: bit, betsMode: 1, isDouble: true}
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组选120', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 5, isDouble: true},
                // doubleArr 如果存在,就替代 betsMode, 与 betsTitle 对应
                { title: '组选60', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号', '单号'], doubleArr: [1, 3], isDouble: true},
                { title: '组选30', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号', '单号'], doubleArr: [2, 1], isDouble: true},
                { title: '组选20', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['三重号', '单号'], doubleArr: [1, 2], isDouble: true},
                { title: '组选10', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['三重号', '二重号'], doubleArr: [1, 1], isDouble: true},
                { title: '组选5', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['四重号', '单号'], doubleArr: [1, 1], isDouble: true},
              ]
            }
          ],
        },
        {
          title: '四星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 5), betsMode: 1, isDouble: true},
                { title: '直选单式', type: 'text', checked: false, numLen: 4, isDouble: 2, order: false},
                { title: '直选组合', type: 'compound', showOprateBtn: true, checked: false, unit: 4, betsTitle: bit.slice(1, 5), betsMode: 1, isDouble: true}
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组选24', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 4, isDouble: true},
                { title: '组选12', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号', '单号'], doubleArr: [1, 2], betsMode: 1, isDouble: true},
                { title: '组选6', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号'], betsMode: 2, isDouble: true},
                { title: '组选4', type: 'double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['三重号', '单号'], doubleArr: [1, 1], betsMode: 1, isDouble: true},
              ]
            }
          ],
        },
        {
          title: '前三',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(0, 3), betsMode: 1, isDouble: true},
                { title: '直选单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false},
                { title: '直选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }, // valueLen 和值，跨度的 数字长度
                { title: '直选跨度', type: 'diff', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 },
                { title: '直选组合', type: 'compound', showOprateBtn: true, checked: false, unit: 3, betsTitle: bit.slice(0, 3), betsMode: 1, isDouble: true}
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组三', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true},
                { title: '组六', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true},
                { title: '组三单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true},
                { title: '组六单式', type: 'text', checked: false, numLen: 3, isDouble: 0, order: true},
                { title: '混合组选', type: 'text', checked: false, numLen: 3, isDouble: 1, order: true},
                { title: '组选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 3 },
                { title: '包胆', type: 'guts', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }
              ]
            },
            {
              title: '其他',
              data: [
                { title: '和值尾数', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '特殊号码', type: 'special', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '中三',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 4), betsMode: 1, isDouble: true},
                { title: '直选单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false},
                { title: '直选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }, // valueLen 和值，跨度的 数字长度
                { title: '直选跨度', type: 'diff', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 },
                { title: '直选组合', type: 'compound', showOprateBtn: true, checked: false, unit: 3, betsTitle: bit.slice(1, 4), betsMode: 1, isDouble: true}
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组三', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true},
                { title: '组六', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true},
                { title: '组三单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true},
                { title: '组六单式', type: 'text', checked: false, numLen: 3, isDouble: 0, order: true},
                { title: '混合组选', type: 'text', checked: false, numLen: 3, isDouble: 1, order: true},
                { title: '组选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 3 },
                { title: '包胆', type: 'guts', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }
              ]
            },
            {
              title: '其他',
              data: [
                { title: '和值尾数', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '特殊号码', type: 'special', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '后三',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(2, 5), betsMode: 1, isDouble: true},
                { title: '直选单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false},
                { title: '直选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }, // valueLen 和值，跨度的 数字长度
                { title: '直选跨度', type: 'diff', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 },
                { title: '直选组合', type: 'compound', showOprateBtn: true, checked: false, unit: 3, betsTitle: bit.slice(2, 5), betsMode: 1, isDouble: true}
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组三', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true},
                { title: '组六', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true},
                { title: '组三单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true},
                { title: '组六单式', type: 'text', checked: false, numLen: 3, isDouble: 0, order: true},
                { title: '混合组选', type: 'text', checked: false, numLen: 3, isDouble: 1, order: true},
                { title: '组选和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 3 },
                { title: '包胆', type: 'guts', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }
              ]
            },
            {
              title: '其他',
              data: [
                { title: '和值尾数', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '特殊号码', type: 'special', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '二星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '后二复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(3, 5), betsMode: 1, isDouble: true},
                { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false},
                { title: '后二和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
                { title: '后二跨度', type: 'diff', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
                { title: '前二复式', type: 'compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(0, 2), betsMode: 1, isDouble: true},
                { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false},
                { title: '前二和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
                { title: '前二跨度', type: 'diff', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
              ]
            },
            {
              title: '组选',
              data: [
                { title: '后二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true},
                { title: '后二和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 2 },
                { title: '后二包胆', type: 'guts', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
                { title: '前二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true},
                { title: '前二和值', type: 'and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 2 },
                { title: '前二包胆', type: 'guts', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 2 },
              ]
            }
          ],
        },
        {
          title: '一星',
          checked: false,
          value: [
            {
              title: '定位胆',
              data: [
                { title: '定位胆', type: 'position', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true,}
              ]
            }
          ],
        },
        {
          title: '不定位',
          checked: false,
          value: [
            {
              title: '三星不定位',
              data: [
                { title: '后三一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '后三二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true},
                { title: '前三一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '前三二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true},
                { title: '中三一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '中三二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true}
              ]
            },
            {
              title: '四星不定位',
              data: [
                { title: '四星一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '四星二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true}
              ]
            },
            {
              title: '五星不定位',
              data: [
                { title: '五星二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true},
                { title: '五星三码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 3, isDouble: true},
              ]
            }
          ],
        },
        {
          title: '大小单双',
          checked: false,
          value: [
            {
              title: '大小单双',
              data: [
                { title: '后二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: bit.slice(3, 5), betsMode: 1, isDouble: true},
                { title: '后三大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: bit.slice(2, 5), betsMode: 1, isDouble: true},
                { title: '前二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: bit.slice(0, 2), betsMode: 1, isDouble: true},
                { title: '前三大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: bit.slice(0, 3), betsMode: 1, isDouble: true},
                { title: '中三大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: bit.slice(1, 4), betsMode: 1, isDouble: true},
              ]
            }
          ],
        },
        {
          title: '趣味',
          checked: false,
          value: [
            {
              title: '趣味',
              data: [
                { title: '五码趣味三星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true, area: 'interest' },
                { title: '四码趣味三星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 5), betsMode: 1, isDouble: true, area: 'interest' },
                { title: '后三趣味二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(2, 5), betsMode: 1, isDouble: true, area: 'interest' },
                { title: '前三趣味二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(0, 3), betsMode: 1, isDouble: true, area: 'interest' },
                { title: '中三趣味二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 4), betsMode: 1, isDouble: true, area: 'interest' },
              ]
            },
            {
              title: '区间',
              data: [
                { title: '五码区间三星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true, area: 'interestArea' },
                { title: '四码区间三星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 5), betsMode: 1, isDouble: true, area: 'interestArea' },
                { title: '后三区间二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(2, 5), betsMode: 1, isDouble: true, area: 'interestArea' },
                { title: '前三区间二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(0, 3), betsMode: 1, isDouble: true, area: 'interestArea' },
                { title: '中三区间二星', type: 'interest', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit.slice(1, 4), betsMode: 1, isDouble: true, area: 'interestArea' }
              ]
            },
            {
              title: '特殊',
              data: [
                { title: '一帆风顺', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '好事成双', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '三星报喜', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                { title: '四季发财', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
              ]
            }
          ],
        },
        {
          title: '任选',
          checked: false,
          value: [
            {
              title: '任选二',
              data: [
                { title: '直选复式', type: 'optional', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 2, isDouble: true, valueLen: 2 },
                { title: '直选单式', type: 'text', checked: false, checkBit: true, numLen: 2, isDouble: 2, order: false, valueLen: 2, checkLen: ['十', '个'] },
                { title: '直选和值', type: 'optional-and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 2, isDouble: true, checkBit: true, valueLen: 2, checkLen: ['十', '个'] },
                { title: '组选复式', type: 'optional-compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true, checkBit: true, valueLen: 2, checkLen: ['十', '个'] },
                { title: '组选单式', type: 'text', checked: false, checkBit: true, numLen: 2, isDouble: 0, order: true, valueLen: 2, checkLen: ['十', '个'] },
                { title: '组选和值', type: 'optional-and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 2, isDouble: false, checkBit: true, valueLen: 2, checkLen: ['十', '个'] },
              ]
            },
            {
              title: '任选三',
              data: [
                { title: '直选复式', type: 'optional', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 3, isDouble: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '直选单式', type: 'text', checked: false, checkBit: true, numLen: 3, isDouble: 2, order: false, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '直选和值', type: 'optional-and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 3, isDouble: true, checkBit: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '组三复式', type: 'optional-compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true, checkBit: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '组三单式', type: 'text', checked: false, checkBit: true, numLen: 3, isDouble: 3, order: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '组六复式', type: 'optional-compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 3, isDouble: true, checkBit: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '组六单式', type: 'text', checked: false, checkBit: true, numLen: 3, isDouble: 0, order: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '混合组选', type: 'text', checked: false, checkBit: true, numLen: 3, isDouble: 1, order: true, valueLen: 3, checkLen: ['百', '十', '个'] },
                { title: '组选和值', type: 'optional-and', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 3, isDouble: false, checkBit: true, valueLen: 3, checkLen: ['百', '十', '个'] },
              ]
            },
            {
              title: '任选四',
              data: [
                { title: '直选复式', type: 'optional', showOprateBtn: true, checked: false, unit: 1, betsTitle: bit, betsMode: 4, isDouble: true, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
                { title: '直选单式', type: 'text', checked: false, checkBit: true, numLen: 4, isDouble: 2, order: false, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
                { title: '组选24', type: 'optional-compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 4, isDouble: true, checkBit: true, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
                { title: '组选12', type: 'optional-group', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号', '单号'], doubleArr: [1, 2], betsMode: 4, isDouble: true, checkBit: true, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
                { title: '组选6', type: 'optional-compound', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号'], betsMode: 2, isDouble: true, checkBit: true, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
                { title: '组选4', type: 'optional-group', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['二重号', '单号'], doubleArr: [1, 1], betsMode: 4, isDouble: true, checkBit: true, valueLen: 4, checkLen: ['千', '百', '十', '个'] },
              ]
            }
          ],
        },
        {
          title: '龙虎',
          checked: false,
          value: [
            {
              title: '龙虎和',
              data: [
                { title: '万千', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['万千'], betsMode: 1, isDouble: true},
                { title: '万百', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['万百'], betsMode: 1, isDouble: true},
                { title: '万十', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['万十'], betsMode: 1, isDouble: true},
                { title: '万个', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['万个'], betsMode: 1, isDouble: true},
                { title: '千百', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['千百'], betsMode: 1, isDouble: true},
                { title: '千十', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['千十'], betsMode: 1, isDouble: true},
                { title: '千个', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['千个'], betsMode: 1, isDouble: true},
                { title: '百十', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['百十'], betsMode: 1, isDouble: true},
                { title: '百个', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['百个'], betsMode: 1, isDouble: true},
                { title: '十个', type: 'tiger-end', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['十个'], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '和值',
          checked: false,
          value: [
            {
              title: '五星玩法',
              data: [
                { title: '五星和值', type: 'and-value', showOprateBtn: true, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 5 },
                { title: '大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true}
              ]
            }
          ]
        }
      ],
      syxw: [
        {
          title: '三码',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                {title: '前三直选复式', type: 'three', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['一位', '二位', '三位'], betsMode: 1, isDouble: true},
                {title: '前三直选单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            },
            {
              title: '组选',
              data: [
                {title: '前三组选复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['前三'], betsMode: 3, isDouble: true},
                {title: '前三组选单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                {title: '前三组选胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 2, betsMode: 1, isDouble: true, valueLen: 3}
              ]
            }
          ],
        },
        {
          title: '二码',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                {title: '前二直选复式', type: 'double', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['一位', '二位'], doubleArr:[1,1], betsMode: 1, isDouble: true},
                {title: '前二直选单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            },
            {
              title: '组选',
              data: [
                {title: '前二组选复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['前二'], betsMode: 2, isDouble: true},
                {title: '前二组选单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 3, order: true, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                {title: '前二组选胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 1, betsMode: 1, isDouble: true, valueLen: 3}
              ]
            }
          ],
        },
        {
          title: '不定位',
          checked: false,
          value: [
            {
              title: '不定位',
              data: [
                {title: '前三不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['前三'], betsMode: 1, isDouble: true}
              ]
            },
          ],
        },
        {
          title: '趣味型',
          checked: false,
          value: [
            {
              title: '趣味型',
              data: [
                {title: '定单双', type: 'interest-end', showOprateBtn: true, checked: true, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true},
                {title: '猜中位', type: 'cai-end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['猜中位'], betsMode: 1, isDouble: true},
              ]
            }
          ],
        },
        {
          title: '定位胆',
          checked: false,
          value: [
            {
              title: '定位胆',
              data: [
                {title: '定位胆', type: 'position', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['一位', '二位', '三位'], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '任选复式',
          checked: false,
          value: [
            {
              title: '任选复式',
              data: [
                {title: '任选一中一复式', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选1中1'], betsMode: 2, isDouble: true},
                {title: '任选二中二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选2中2'], betsMode: 2, isDouble: true},
                {title: '任选三中三复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选3中3'], betsMode: 3, isDouble: true},
                {title: '任选四中四复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选4中4'], betsMode: 4, isDouble: true},
                {title: '任选五中五复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选5中5'], betsMode: 5, isDouble: true},
                {title: '任选六中五复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选6中5'], betsMode: 6, isDouble: true},
                {title: '任选七中五复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选7中5'], betsMode: 7, isDouble: true},
                {title: '任选八中五复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['选8中5'], betsMode: 8, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '任选单式',
          checked: false,
          value: [
            {
              title: '任选单式',
              data: [
                {title: '任选一中一单式', type: 'text', betsTitle: ['选1中1'], numLen: 1, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选二中二单式', type: 'text', betsTitle: ['选2中2'], numLen: 2, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选三中三单式', type: 'text', betsTitle: ['选3中3'], numLen: 3, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选四中四单式', type: 'text', betsTitle: ['选4中4'], numLen: 4, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选五中五单式', type: 'text', betsTitle: ['选5中5'], numLen: 5, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选六中五单式', type: 'text', betsTitle: ['选6中5'], numLen: 6, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选七中五单式', type: 'text', betsTitle: ['选7中5'], numLen: 7, checked: false, isDouble: 0, order: true, valueLen: 0},
                {title: '任选八中五单式', type: 'text', betsTitle: ['选8中5'], numLen: 8, checked: false, isDouble: 0, order: true, valueLen: 0}
              ]
            }
          ],
        },
        {
          title: '任选胆拖',
          checked: false,
          value: [
            {
              title: '任选胆拖',
              data: [
                {title: '任选二中二胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 1, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选三中三胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 2, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选四中四胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 3, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选五中五胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 4, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选六中五胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 5, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选七中五胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 6, betsMode: 1, isDouble: true, valueLen: 3},
                {title: '任选八中五胆拖', type: 'dantuo', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['胆码', '拖码'], danNum: 7, betsMode: 1, isDouble: true, valueLen: 3},
              ]
            }
          ],
        }
      ],
      ks: [
        {
          title: '快三',
          checked: false,
          value: [
            {
              title: '快三',
              data: [
                { title: '和值', type: 'andValue', checked: false, data: []},
                { title: '大小单双', type: 'sizeDouble', checked: false, data: []},
                { title: '三同号', type: 'threeSame', checked: false, data: []},
                { title: '二同号', type: 'twoSame', checked: false, data: []},
                { title: '三不同号', type: 'threeNoSame', checked: false, data: []},
                { title: '二不同号', type: 'twoNoSame', checked: false, data: []},
                { title: '三连号', type: 'threeLink', checked: false, data: []},
                { title: '单挑一骰', type: 'singleDice', checked: false, data: []}
              ]
            }
          ],
        }
      ],
      pks: [
        {
          title: '两面盘',
          checked: false,
          value: [
            {
              title: '两面',
              data: [
                {title: '冠亚和', type: 'sizeDouble', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['冠亚和'], betsMode: 1, isDouble: true},
                {title: '按名次', type: 'ranking', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], betsMode: 1, isDouble: true},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                {title: '龙虎', type: 'pks-tiger-end', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], betsMode: 1, isDouble: true},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            }
          ],
        },
        {
          title: '和值',
          checked: false,
          value: [
            {
              title: '和值',
              data: [
                {title: '冠亚和', type: 'guanyahe-end', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['冠亚和'], betsMode: 1, isDouble: false, valueLen: 2}
              ]
            }
          ],
        },
        {
          title: '猜车号',
          checked: false,
          value: [
            {
              title: '定位胆',
              data: [
                {title: '定位胆', type: 'pks-end', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '猜排位',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                {title: '冠亚军', type: 'pks-double', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['冠军', '亚军'], doubleArr: [1, 1], betsMode: 1, isDouble: false},
                // doubleArr 如果存在,就替代 betsMode, 与 betsTitle 对应
                {title: '前三', type: 'three', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['冠军', '亚军', '第三名'], betsMode: 1, isDouble: false},
                {title: '前四', type: 'four', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['冠军', '亚军', '第三名', '第四名'], betsMode: 1, isDouble: true},
                {title: '前五', type: 'five', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['冠军', '亚军', '第三名', '第四名', '第五名'], betsMode: 1, isDouble: true},
                {title: '前三单式', type: 'text', checked: false, checkBit: false, numLen: 3, isDouble: 0, order: false, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                {title: '前四单式', type: 'text', checked: false, checkBit: false, numLen: 4, isDouble: 0, order: false, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样 
                {title: '前五单式', type: 'text', checked: false, checkBit: false, numLen: 5, isDouble: 0, order: false, valueLen: 0},// isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样            
              ]
            }
          ],
        },
        {
          title: '不定位',
          checked: false,
          value: [
            {
              title: '位置',
              data: [
                {title: '前三', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['前三'], betsMode: 1, isDouble: true},
                {title: '后三', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['后三'], betsMode: 1, isDouble: true},
              ]
            }
          ],
        }
      ],
      lhc: [],
      sd: [
        {
          title: '三星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '复式', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['百位', '十位', '个位'], betsMode: 1, isDouble: true},
                { title: '单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false, valueLen: 0 },
                { title: '直选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组三', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true},
                { title: '组三单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true, valueLen: 0 },
                { title: '组六', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true},
                { title: '组六单式', type: 'text', checked: false, numLen: 3, isDouble: 0, order: true, valueLen: 0 },
                { title: '混合组选', type: 'text', checked: false, numLen: 3, isDouble: 1, order: true, valueLen: 0 },
                { title: '组选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 3 }
              ]
            }
          ]
        },
        {
          title: '二星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '前二直选', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['百位', '十位'], betsMode: 1, isDouble: true},
                { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '后二直选', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true},
                { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            },
            {
              title: '组选',
              data: [
                { title: '后二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '前二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            }
          ]
        },
        {
          title: '一星',
          checked: false,
          value: [
            {
              title: '定位胆',
              data: [
                { title: '定位胆', type: 'position', showOprateBtn: true, checked: true, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true}
              ]
            }
          ],
        },
        {
          title: '不定位',
          checked: false,
          value: [
            {
              title: '不定位',
              data: [
                { title: '一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true},
              ]
            }
          ]
        },
        {
          title: '大小单双',
          checked: false,
          value: [
            {
              title: '大小单双',
              data: [
                { title: '前二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['百位', '十位'], betsMode: 1, isDouble: true},
                { title: '后二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true},
              ]
            }
          ]
        },
      ],
      plw: [
        {
          title: '排三',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '直选复式', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['万位', '千位', '百位'], betsMode: 1, isDouble: true},
                { title: '直选单式', type: 'text', checked: false, numLen: 3, isDouble: 2, order: false, valueLen: 0 },
                { title: '直选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, valueLen: 3 }
              ]
            },
            {
              title: '组选',
              data: [
                { title: '组三复式', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true},
                { title: '组三单式', type: 'text', checked: false, numLen: 3, isDouble: 3, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '组六复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true},
                { title: '组六单式', type: 'text', checked: false, numLen: 3, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '混合组选', type: 'text', checked: false, numLen: 3, isDouble: 1, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '组选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, valueLen: 3 }
              ]
            }
          ]
        },
        {
          title: '二星',
          checked: false,
          value: [
            {
              title: '直选',
              data: [
                { title: '(前二)排五直选复式', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['万位', '千位'], betsMode: 1, isDouble: true},
                { title: '(前二)排五直选单式', type: 'text', checked: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '(后二)排五直选复式', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true},
                { title: '(后二)排五直选单式', type: 'text', checked: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            },
            {
              title: '组选',
              data: [
                { title: '(后二)排五直选复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '(后二)排五直选单式', type: 'text', checked: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
                { title: '(前二)排五直选复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true},
                { title: '(前二)排五直选单式', type: 'text', checked: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
              ]
            }
          ]
        },
        {
          title: '一星',
          checked: false,
          value: [
            {
              title: '定位胆',
              data: [
                { title: '定位胆', type: 'position', showOprateBtn: true, checked: true, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true }
              ]
            }
          ]
        },
        {
          title: '不定位',
          checked: false,
          value: [
            {
              title: '不定位',
              data: [
                { title: '前三一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true},
                { title: '前三二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true},
              ]
            }
          ]
        },
        {
          title: '大小单双',
          checked: false,
          value: [
            {
              title: '大小单双',
              data: [
                { title: '前二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['百位', '十位'], betsMode: 1, isDouble: true},
                { title: '后二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true},
              ]
            }
          ]
        },
      ],
    }
  },
  created() {
    let query = this.$route.query;
    let txt = '时时彩';
    // console.log(query)
    this.gameCode = query.code;
    this.gameid = query.id;
    this.showModle = false;
    let name = query.name;

    // if (this.gameCode === 'ssc') {
    //   txt = '时时彩'
    // } else if (this.gameCode === 'syxw') {
    //   txt = '十一选五'
    // } else if (this.gameCode === 'pks') {
    //   txt = 'PK10'
    // } else if (this.gameCode === 'ks') {
    //   txt = '快三'
    // } else if (this.gameCode === 'sd' || this.gameCode === 'plw') {
    //   txt = '其他'
    // }

    this.$store.dispatch('setTitle', name);
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setPlayModeStatus', true);
    this.$store.dispatch('setBets', 0);
    this.$store.dispatch('setShowLotteryComponents', false)
    this.userRefund = localStorage.getItem('refund');
    this.getLotteryDetailList();
    this.newIssueInterval();
    // console.log(this.getBetsData)
  },
  mounted() {},
  beforeDestroy() {
    // console.log('beforeDestroy')
  },
  destroyed() {
    // console.log('destroyed')
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
      if(this.gameCode === 'ssc'){
        s = issue.toString().substr(2);
      }else {
        s = issue.toString();
      }
      return s;
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
      // data.filter((v, vi) => {
      //   vm[vm.gameCode][vi].lottery3id = v._id;
      //   v.children.filter((k, ki) => {
      //     if(k.name === vm[vm.gameCode][vi].value[ki].title){
      //       vm[vm.gameCode][vi].value[ki].show = true;
      //     }else{
      //       vm[vm.gameCode][vi].value[ki].show = false;
      //     }
      //     k.children.filter((m, mi) => {
      //       vm[vm.gameCode][vi].value[ki].data[mi].play = m.note1; // 玩法
      //       vm[vm.gameCode][vi].value[ki].data[mi].plan = m.note2; // 方案
      //       vm[vm.gameCode][vi].value[ki].data[mi].prize = m.prize || 0; // 奖金
      //       vm[vm.gameCode][vi].value[ki].data[mi].extra = m.extra||''; // 赔率数组
      //       vm[vm.gameCode][vi].value[ki].data[mi].probability = m.probability; // 赔率
      //       vm[vm.gameCode][vi].value[ki].data[mi].lotteryid = m._id; // lotteryid
      //     })
      //   })
      // })
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

    // 计算最大倍数
    countMultiple() {
      // console.log(data)
      const vm = this;
      try {
        let prize, max_multiple;
        if (vm.userRefund > this.maxRefund) {
          prize = (this.getBetsData.probability * (this.userRefund - this.diff)) / this.maxRefund;
          max_multiple = Math.floor(this.maxPrize / prize);
        } else {
          prize = (this.getBetsData.probability * this.userRefund) / this.maxRefund;
          max_multiple = Math.floor(this.maxPrize / prize);
        }
        this.maxMultiple = max_multiple;
        vm.prize = prize
      } catch (e) {}
      this.countPrize();
    },
    //计算奖金
    countPrize() {
      this.betsModeName = this.getBetsData.title;
      let extra = this.getBetsData.extra;
      var arr = [];
      try{
        arr = this.betsArr[0]||this.betsArr;
      }catch(e){}
      if(this.betsModeName.indexOf('直选组合') > -1 || this.betsModeName.indexOf('混合组选') > -1 || this.betsModeName.indexOf('组选和值') > -1 || this.betsModeName.indexOf('包胆') > -1){
        extra = ''
      }
      // console.log(this.betsArr)
      if(extra === ''){
        let p = this.prize;
        if(this.moneyType === '角'){
          p = this.prize*0.1
        }else if(this.moneyType === '分'){
          p = this.prize*0.01
        }
        this.prizeArea = this.toThousands(p.toFixed(2))
      }else{
        let probArr = [];
        let probArr2 = [];
        for(let i in extra){
          probArr2.push(extra[i])
        }
        if(probArr2.length === 2){
          probArr = probArr2
        }else{
          if(arr.length === 0){
            for(let i in extra){
              probArr.push(extra[i])
            }
          }else{
            arr.filter(v => {
              probArr.push(extra[v])
            })
          }
        }
        
        let min_probability =  Math.min.apply(Math, probArr);
        let max_probability =  Math.max.apply(Math, probArr);

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
          this.prizeArea = this.toThousands(min_prize.toFixed(2));
        }else{
          this.prizeArea = this.toThousands(min_prize.toFixed(2)) +' - '+ this.toThousands(max_prize.toFixed(2));
        }
      }
    },
    // 显示金钱类型
    handleShowMoneyType(e) {
      e.stopPropagation();
      this.showMoneyType = !this.showMoneyType;
    },
    // 隐藏金钱类型
    changeMoneyType(val, e) {
      // e.stopPropagation();
      this.moneyType = val;
      this.countPrize();
    },
    // 倍数聚焦
    handleFocusMultiple() {
      const vm = this;
      document.onkeyup = function() {
        vm.multiple = vm.multiple.toString().replace(/\D/g,function(){return ''})
        if(Number(vm.multiple) === 0){
          vm.multiple = 1;
        }else if (vm.multiple >= vm.maxMultiple) {
          vm.multiple = vm.maxMultiple
        }
        // console.log(vm.multiple)
      }
    },
    // 倍数失焦
    handleBlurMultiple() {
      document.onkeyup = null;
      if (this.multiple >= this.maxMultiple) {
        this.multiple = this.maxMultiple
      }
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

    // 获取投注号码
    handlesendBetsNumber(val) {
      // console.log(val)
      this.betsNumber = val.betsNumber;
      this.betsArr = val.data;
      if(this.gameCode !== 'ks') {
        this.setBets(this.betsArr)
      }
      this.countMultiple()
    },
    // 获取选中的位
    handlesendWei(val) {
      this.wei = val;
    },
    // 获取 注 数
    getBetsFn() {
      return this.$store.state.bets
    },
    //  设置投注数
    setBets(data) {
      // console.log(data)
      var danNum, checkBit, isCheckOptional
      try{
        danNum = this.getBetsData.danNum;
        checkBit = this.getBetsData.checkBit;
        isCheckOptional = this.getBetsData.checkLen
      }catch(e){}
      const vm = this;
      const unit = this.getBetsData.unit;
      const type = this.getBetsData.type;
      var isDouble;
      var betsMode = this.getBetsData.betsMode;
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      var arr4 = [];
      var arr5 = [];
      var bets = 0;
      if(type === 'compound'){
        for(let i in data){
          arr1.push(data[i].length)
        }
        bets = lottery.compound(arr1, unit);
      }else if(type.indexOf('single') > -1){
        for(let i in data){
          arr1.push(data[i].length)
        }
        bets = lottery.groupSelectOne(arr1[0], betsMode, unit);
      }else if(type.indexOf('double') > -1){
        var n1 = Number(this.getBetsData.doubleArr[0]);
        var n2 = Number(this.getBetsData.doubleArr[1]);
        arr1 = data[0];
        arr2 = data[1];
        if(n1 === 1){
          bets = lottery.groupSelectTwoNum(arr1, arr2, n2);
        }else{
          bets = lottery.groupSelectTwoNum(arr2, arr1, n1);
        }
      }else if(type === 'three'){
        arr1 = data[0];
        arr2 = data[1];
        arr3 = data[2];
        bets = lottery.groupSelectThreeNum(arr1, arr2, arr3);
      }else if(type === 'four'){
        arr1 = data[0];
        arr2 = data[1];
        arr3 = data[2];
        arr4 = data[3];
        bets = lottery.groupSelectFourNum(arr1, arr2, arr3, arr4);
      }else if(type === 'five'){
        arr1 = data[0];
        arr2 = data[1];
        arr3 = data[2];
        arr4 = data[3];
        arr5 = data[4];
        bets = lottery.groupSelectFiveNum(arr1, arr2, arr3, arr4, arr5);
      }else if(type === 'dantuo'){
        arr1 = data[0];
        arr2 = data[1];
        bets = lottery.countDanTuo(arr1, arr2, danNum);
      }else if(type === 'diff'){
        var valueLen = this.getBetsData.valueLen;
        arr1 = data[0];
        // console.log(valueLen,arr1)
        bets = lottery.dValue(arr1, valueLen);
      }else if(type === 'end'){
        arr1 = data[0];
        bets = lottery.valueEnd(arr1);
      }else if(type === 'special'){
        arr1 = data[0];
        bets = lottery.valueEnd(arr1);
      }else if(type === 'guts'){
        var valueLen = this.getBetsData.valueLen;
        arr1 = [];
        data[0].filter(v => {
          arr1.push(Number(v))
        })
        bets = lottery.guts(arr1, valueLen);
      }else if(type === 'and'){
        var valueLen = this.getBetsData.valueLen;
        isDouble = this.getBetsData.isDouble;
        arr1 = data[0];
        if(isDouble){
          bets = lottery.sunOfValue(arr1, valueLen)
        }else{
          bets = lottery.groupSunOfValue(arr1, valueLen)
        }
      }else if(type === 'position'){
        for(let i in data){
          arr1.push(data[i].length)
        }
        bets = lottery.pos(arr1);
      }else if(type === 'sizeDouble'){
        for(let i in data){
          arr1.push(data[i].length)
        }
        bets = lottery.compound(arr1, unit);
      }else if(type === 'interest'){
        for(let i in data){
          arr1.push(data[i].length)
        }
        bets = lottery.compound(arr1, unit);
      }else if(type === 'optional'){
        var betsMode = this.getBetsData.betsMode;
        for(let i in data){
          arr1.push(data[i].length)
        }
        if(betsMode === 2){
          bets = lottery.optionalOne(arr1);
        }else if(betsMode === 3){
          bets = lottery.optionalTwo(arr1);
        }else if(betsMode === 4){
          bets = lottery.optionalThree(arr1);
        }
      }else if(type.split('-')[1] === 'and'){
        var valueLen = this.getBetsData.valueLen;
        isDouble = this.getBetsData.isDouble;
        arr1 = data[0];
        var num1, num2;
        if(isDouble){
          num1 = lottery.sunOfValue(arr1, valueLen)
        }else{
          num1 = lottery.groupSunOfValue(arr1, valueLen)
        }
        num2 = lottery.groupSelectOne(isCheckOptional.length, valueLen, unit);
        bets = num1 * num2;
      }else if(type === 'optional-compound'){
        var valueLen = this.getBetsData.valueLen;
        var betsMode = this.getBetsData.betsMode;
        var num1, num2;
        for(let i in data){
          arr1.push(data[i].length)
        }
        num1 = lottery.groupSelectOne(arr1[0], betsMode, unit);
        num2 = lottery.groupSelectOne(isCheckOptional.length, valueLen, unit);
        bets = num1 * num2;
      }else if(type === 'optional-group'){
        var n1 = Number(this.getBetsData.doubleArr[0]);
        var n2 = Number(this.getBetsData.doubleArr[1]);
        var valueLen = this.getBetsData.valueLen;
        arr1 = data[0];
        arr2 = data[1];
        
        var num1, num2;
        num1 = lottery.groupSelectOne(isCheckOptional.length, valueLen, unit);
        if(n1 === 1){
          num2 = lottery.groupSelectTwoNum(arr1, arr2, n2);
        }else{
          num2 = lottery.groupSelectTwoNum(arr2, arr1, n1);
        }
        bets = num1 * num2;
      }else if(type.split('-')[1] === 'end'){
        arr1 = data[0];
        bets = lottery.valueEnd(arr1);
      }else if(type.split('-')[1] === 'value'){
        arr1 = data[0];
        bets = lottery.valueEnd(arr1);
      }else if(type === 'pks-tiger-end'){
        arr1 = data;
        let b = 0;
        arr1.filter(v => {
          b += v.length
        })
        bets = b;
      }else if(type === 'ranking'){
        arr1 = data;
        let b = 0;
        arr1.filter(v => {
          b += v.length
        })
        bets = b;
      }
      this.$store.dispatch('setBets', bets);
    },
    // 设置 钱
    setMoneyFn() {
      let point = 1;
      if (this.moneyType === '元') {
        point = 1
      } else if (this.moneyType === '角') {
        point = 0.1
      } else if (this.moneyType === '分') {
        point = 0.01
      }
      return Number(this.$store.state.bets * this.$store.state.price) * point * this.multiple
    },
    // 加入到购物车
    toShoppingCart(type) {
      const vm = this;
      this.tipText = '';
      // console.log('betsNumber------',this.betsNumber)
      // return false;
      // console.log('bets-----',this.$store.state.bets)
      // console.log('multiple-----',this.multiple)
      // console.log('money-----',this.setMoneyFn())
      // console.log('title----------',this.getPlayName[0][0]+this.getPlayName[0][1])
      // return false;
      let shopping = this.$store.state.shoppingCartData;
      let playName = this.getPlayName[0];
      let id = this.getPlayName[1];
      let vote_num = this.$store.state.bets;
      this.$store.dispatch('setIssue', this.nowIssue);
      // console.log(shopping)
      // console.log(this.nowIssue)
      // let vote_num; // 每注的注数
      if(vote_num===0){
        if(shopping.length === 0){
          this.tipText = '请添加注单';
          setTimeout(()=>{
            vm.tipText = '';
          },vm.alertDur*1000)
          return false
        }else{
          this.$router.push({
            name: 'shoppingCart',
            code: this.gameCode
          })
        }
      }else{
        let gameid = this.gameid; // gameid
        let lottery3id = id[0]; // 玩法id
        let lotteryid = id[1]; // 投注id
        let vote_no = this.betsNumber; // 投注号码
        let multiple = this.multiple; // 倍数
        let vote_cash = this.setMoneyFn().toFixed(2); // 金额
        let unit = this.moneyType; // 单位
        let prize = this.prizeArea; // 奖金
        let wei = this.wei; // 选中的位


        let title = playName[1]; // 标题

        let o = {gameid, lottery3id, lotteryid, vote_num, vote_no, multiple, vote_cash, unit, prize, wei, title};
        if(shopping.length === 0){
          shopping.push(o)
          this.$store.dispatch('setShoppingCartData', shopping)
          this.$router.push({
            name: 'shoppingCart',
            code: this.gameCode
          })
        }else{
          let isSame = false;
          for(let i in shopping){
            let s_item = shopping[i]
            if(s_item.vote_no.toString() === o.vote_no.toString() && s_item.title === o.title){
              isSame = true;
              break
            }
          }
          if(isSame){
            if(type === 'append'){
              this.tipText = '注单已存在';
              setTimeout(()=>{
                vm.tipText = '';
              },vm.alertDur*1000)
              return false
            }else{
              this.$router.push({
                name: 'shoppingCart',
                code: this.gameCode
              })
            }
          }else{
            shopping.push(o)
            this.$store.dispatch('setShoppingCartData', shopping)
            this.$router.push({
              name: 'shoppingCart',
              code: this.gameCode
            })
          }
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.betsView-wrap{
  position: relative;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  .top{
    width:100%;
    // height:1.72rem;
    padding:.3rem;
    display:table;
    .now{
      width:3.5rem;
    }
    .now, .last{
      // height:100%;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-pack:center;
      color:#939DB8;
      p{
        height:.4rem;
        line-height:.4rem;
        margin-bottom:.1rem;
      }
      #ks-lottery-num{
        span{
          float:left;
          width:.62rem;
          height:.62rem;
          display:-webkit-box;
          -webkit-box-align:center;
          -webkit-box-pack:center;
          border-radius:.08rem;;
          &:nth-child(5){
            margin-bottom:.1rem;
          }
          &:last-child{
            margin-right:0;
            margin-bottom:0;
          }
          &:nth-child(5n){
            margin-right:0;
          }
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
      }
      p.lottery-num{
        margin-bottom:0;
        height:auto;
        line-height: 0;
        span{
          float:left;
          width:.62rem;
          height:.62rem;
          display:-webkit-box;
          -webkit-box-align:center;
          -webkit-box-pack:center;
          border-radius:50%;
          position: relative;
          background:url('/static/img/number.png') no-repeat;
          background-size:100% 100%;
          // background: #C5C5C5;
          // // background-image: radial-gradient(50% -58%, #808080 84%, #000000 100%);
          // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50), inset 0 0 10px 0 rgba(0,0,0,0.36), inset 0 2px 2px 0 rgba(255,255,255,0.40);
          margin-right:.1rem;
          color:#565656;
          font-size:.36rem;
          &:nth-child(5){
            margin-bottom:.1rem;
          }
          &:last-child{
            margin-right:0;
            margin-bottom:0;
          }
          &:nth-child(5n){
            margin-right:0;
          }
        }
        em{
          display:inline-block;
          position: absolute;
          left:.041rem;
          top:.041rem;
          width:.538rem;
          height:.538rem;
          text-align:center;
          line-height: .538rem;
          border-radius:50%;
          opacity: 0.4;
          border: .01rem solid rgba(0,0,0,0.50);
          box-shadow: 0 2px 1px 0 rgba(255,255,255,0.40), inset 0 4px 1px 0 rgba(255,255,255,0.20);
        }
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
    .now{
      float:left;
    }
    .last{
      float:right;
    }
  }
  .cen{
    height:8.78rem;
    -webkit-box-flex:1;
    overflow-y:auto;
  }
  .bot{
    height:1.96rem;
    .bot-t, .bot-b{
      height:.98rem;
      padding:0 .3rem;
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:justify;
    }
    .bot-t{
      background: #292932;
      color:#c7c7c7;
      .money-type{
        width:1.2rem;
        height:.68rem;
        background: #1E1E28;
        border-radius: .08rem;
        line-height:.68rem;
        text-align:center;
        position: relative;
        em{
          display:inline-block;
          width:.2rem;
          height: .12rem;
          background:#c7c7c7;
          margin-left:.2rem;
          margin-bottom:.04rem;
        }
        .money-type-list{
          position: absolute;
          bottom:0;
          left:0;
          width:100%;
          height:0;
          transition: all .3s;
          background:#fff;
          color:#191919;
          border-radius:.08rem;
          overflow:hidden;
          li.active{
            background: #ccc;
          }
        }
      }
      .showType{
        .money-type-list{
          height:2.04rem;
          transition: all .3s;
        }
      }
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
      .append-btn{
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
}
</style>

