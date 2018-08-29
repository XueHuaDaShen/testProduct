<template>
  <div class="lottery-wrap" v-loading="loaded">
    <div class="lottery-header">
      <div class="header-left">
        <div class="lottery-icon">
          <img :src="logoImgCode">
        </div>
        <div class="header-left-r">
          <div class="header-left-r-bj"></div>
          <div class="bets-issue">
            <span>第
              <em style="color:#c83a4c;">{{issue}} </em>期</span>
            <span>投注截止时间</span>
          </div>
          <div class="countDown-animate">
            <countDown :issueNo="Number(issue)" @sendTime="handlesendTime" @countdownisflase="handlecountdownisflase" :gameid="gameid"></countDown>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="header-right-l">
          <div class="history-issue" v-if="issueArr.toString()!==''">第
            <span style="color:#c83a4c;">{{issueArr[0].issue_no}}</span> 期</div>
          <div class="history-lottery-number" v-if="issueArr.toString()!==''">
            <span class="animated" :class="refreshIssue?'flip':''" v-for="(k, i) in issueArr[0].luck_no.split(',')" :key="i.toString()">{{k}}</span>
          </div>
        </div>
        <div class="explain">
          <span>
            <em class="explain-btn-bj"></em>
            <router-link :to="{name:'cpwf',query:{s_p:'tc'}}" target="_blank">玩法说明</router-link>
          </span>
          <span>
            <em class="explain-btn-bj"></em>
            <router-link :to="{name:'dataCharts',query:{gameid:gameid}}" target="_blank">走势图</router-link>
          </span>
        </div>
      </div>
    </div>
    <nav class="lottery-nav">
      <span :class="item.checked?'currentTabs':''" @click="handleChangeNav(item)" v-for="(item, index) in navData" :key="index">{{item.title}}</span>
    </nav>
    <div style="width:100%;background:#f4f4f4;">
      <div class="lottery-content">
        <div class="lottery-top" style="min-height:520px;">
          <div class="lottery-num">
            <lotteryNumberArr v-if="isShowLotteryNum" :gameid="gameid" :issueArr="issueArr" :title="betsArr.item.title" :parTitle="groupName" :prize="c_prize" :prizeArea="[c_prize.toFixed(2)]" :adjust="adjust" :userRefund="userRefund"></lotteryNumberArr>
          </div>
          <div class="bets-wrap-parent">
            <div class="bets-wrap">
              <betsMode :groupName="groupName" :userRefund="userRefund" :diff="diff" :maxRefund="maxRefund" :moneyType="moneyType" v-if="randernewBetsMode" :betsMode="betsMode" @sendBetsArr="handlesendBetsArr" @changeBetsMode="handlechangeBetsMode"></betsMode>
              <betsAreaTen lotteryType="ssc" v-if="randerbetsAreaTen&&betsArr.type!=='text'" :betsArr="betsArr" @sendWei="handlesendWei"></betsAreaTen>
              <betsText lotteryType="ssc" v-if="randerbetsAreaTen&&betsArr.type==='text'" :toBets="toBets" @eidtToBets="handleeidtToBets" @clearBetsNumber="handleclearBetsNumber" :betsArr="betsArr"></betsText>
            </div>
          </div>
          <div class="bets-result-wrap">
            <div class="bets-result-top">
              <!-- <div class="mode">
                <span class="tip-title">模式：</span>
                <select name="" id="mode" @change="handleChangeMoneyType" v-model="moneyType">
                  <option value="元">元</option>
                  <option value="角">角</option>
                  <option value="分">分</option>
                </select>
              </div> -->
              <div class="mode">
                <span @click="handleChangeMoneyType(item)" v-for="(item, index) in moneyTypeArr" :key="index" :class="moneyType===item?'current':''">{{item}}</span>
              </div>
              <div class="double">
                <!-- <span class="tip-title">倍数：</span> -->
                <span class="jianhao el-icon-minus" @click="handleJianMultiple"></span>
                <input class="double-content" @blur="handleSetMaxMultiple" @focus="inputMultiple" type="text" :max="maxMultiple" :min="minMultiple" v-model="multiple">
                <!-- <span class="double-content">{{multiple}}</span> -->
                <span class="jiahao el-icon-plus" @click="handleJiaMultiple"></span>
              </div>
              <div class="adjust">
                <span class="tip-title" style="margin-right:20px;">返点
                  <em style="font-style:normal;color:#CC3447;">{{((userRefund-adjust)/defaultAt * 100).toFixed(2)}}%</em>
                </span>
                <div class="slider">
                  <el-slider v-model="adjust" :min="minRefund" :max="userRefund" :step="1" :show-tooltip="false"></el-slider>
                </div>
                <span class="percent" style="margin-left:20px;">{{adjust}}奖金组</span>
              </div>
            </div>
            <div class="bets-result-bot">
              <div class="bets-detail">已选注数
                <span class="bets-style">{{setBetsFn()}}</span> 注 / 共金额数
                <span class="bets-money">￥{{toThousands(setMoneyFn().toFixed(2))}}</span> 元</div>
              <div class="bets-and-join">
                <button class="bets-btn" :class="setJoinBtnDis()?'disabled':''" :disabled="setJoinBtnDis()" @click="gotoBetsFn">直接投注</button>
                <button class="join-btn" :class="setJoinBtnDis()?'disabled':''" :disabled="setJoinBtnDis()" @click="handleJoin">添加购彩篮</button>
              </div>
            </div>
          </div>
        </div>
        <div class="lottery-bot">
          <div class="shopping-cart">
            <div class="left">
              <div class="left-title">
                <strong class="shop-tip">购彩篮</strong>
                <span class="clean-shop-cart" @click="clearShoppingCart">清空</span>
              </div>
              <div class="bets-num-table">
                <div class="table-title">
                  <span class="name">玩法</span>
                  <span class="number">号码</span>
                  <span class="bet">注</span>
                  <span class="multiple">倍</span>
                  <span class="price">金额</span>
                  <span class="oprate">操作</span>
                </div>
                <div class="bets-detail-wrap">
                  <ul class="detail-list">
                    <li v-for="(item, index) in shoppingCart" :key="index" @click="handleClickShop(item)">
                      <span class="name">{{item.name}}</span>
                      <span class="number">{{item.number}}</span>
                      <span class="bet">{{item.bets}}</span>
                      <span class="multiple">{{item.multiple}}</span>
                      <span class="price">{{item.price}}</span>
                      <span class="oprate">
                        <i :class="item.icon?'el-icon-error':'el-icon-close'" style="cursor:pointer" @click="handleDeleteBet(item, index, $event)" @mouseover="handleMouseOverIcon(item)" @mouseout="handleMouseOutIcon(item)"></i>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="right-title">
                <div v-for="(item, index) in rightTitle" :key="index">
                  <span @click="handleChangeRightTitle(item, index)" :class="item.checked?'checked':''">{{item.title}}</span>
                  <em class="line"></em>
                </div>
              </div>
              <div class="right-content" v-if="rightTitle[0].checked">
                <div class="right-content-title">
                  <span>最低收益率:</span>
                  <input type="text" v-model="yinglilv"> %
                  <span>追号期数:</span>
                  <input type="text" @input="handleInputChaseIssue('issueTimes1')" v-model="issueTimes1">
                  <button class="plan" @click="handleLotteryPlan(1)">生成追号计划</button>
                </div>
                <div class="right-content-table" v-if="chaseData1.length !== 0">
                  <table>
                    <tbody>
                      <tr>
                        <th>序号</th>
                        <th>
                          <input type="checkbox" ref="checkedall3" checked="checked" @click="handleCheckedAll('checkedall3', 'chaseData1')">追号期次</th>
                        <th>倍数</th>
                        <th>金额</th>
                        <th>奖金</th>
                        <th>盈利金额</th>
                        <th>盈利率</th>
                      </tr>
                      <tr v-for="(item, index) in chaseData1" :key="index">
                        <td>{{(index*1+1)}}</td>
                        <td>
                          <input type="checkbox" :checked="item.checked" @click="handleChecked(item)">{{item.issue}}</td>
                        <td>
                          <input type="text" :disabled="!item.checked" @input="handleInputMultipleChange(item, $event, 'chaseData1')" class="multiple-input" :value="item.checked?item.multiple:0">
                        </td>
                        <td>{{item.checked?toThousands(Number(item.money).toFixed(2)):0}}</td>
                        <td>{{item.checked?toThousands(Number(item.prize).toFixed(2)):0}}</td>
                        <td>{{item.checked?Number(item.winAmountAll).toFixed(2):0}}</td>
                        <td>{{item.checked?item.yinglilv:(0+'%')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="right-content" v-if="rightTitle[1].checked">
                <div class="right-content-title">
                  <span>起始倍数:</span>
                  <input type="text" v-model="stratMultiple2">
                  <span>追号期数:</span>
                  <input type="text" @input="handleInputChaseIssue('issueTimes2')" v-model="issueTimes2">
                  <button class="plan" @click="handleLotteryPlan(2)">生成追号计划</button>
                </div>
                <div class="right-content-table" v-if="chaseData2.length !== 0">
                  <table>
                    <tbody>
                      <tr>
                        <th>序号</th>
                        <th>
                          <input type="checkbox" ref="checkedall2" checked="checked" @click="handleCheckedAll('checkedall2', 'chaseData2')">追号期次</th>
                        <th>倍数</th>
                        <th>金额</th>
                        <th>预计开奖时间</th>
                      </tr>
                      <tr v-for="(item, index) in chaseData2" :key="index">
                        <td>{{(index*1+1)}}</td>
                        <td>
                          <input type="checkbox" :checked="item.checked" @click="handleChecked(item)">{{item.issue}}</td>
                        <td>
                          <input type="text" :disabled="!item.checked" @input="handleInputMultipleChange(item, $event, 'chaseData2')" class="multiple-input" :value="item.checked?item.multiple:0">
                        </td>
                        <td>{{item.checked?toThousands(Number(item.money).toFixed(2)):0}}</td>
                        <td>{{item.times}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="right-content" v-if="rightTitle[2].checked">
                <div class="right-content-title">
                  <span>起始倍数:</span>
                  <input type="text" v-model="stratMultiple3">
                  <span>隔</span>
                  <input type="text" v-model="intervalIssue3">
                  <span>期 倍x</span>
                  <input type="text" v-model="doubleMultiple3">
                  <span>追号期数:</span>
                  <input type="text" @input="handleInputChaseIssue('issueTimes3')" v-model="issueTimes3">
                  <button class="plan" @click="handleLotteryPlan(3)">生成追号计划</button>
                </div>
                <div class="right-content-table" v-if="chaseData3.length !== 0">
                  <table>
                    <tbody>
                      <tr>
                        <th>序号</th>
                        <th>
                          <input type="checkbox" ref="checkedall1" checked="checked" @click="handleCheckedAll('checkedall1', 'chaseData3')">追号期次</th>
                        <th>倍数</th>
                        <th>金额</th>
                        <th>预计开奖时间</th>
                      </tr>
                      <tr v-for="(item, index) in chaseData3" :key="index">
                        <td>{{(index*1+1)}}</td>
                        <td>
                          <input type="checkbox" :checked="item.checked" @click="handleChecked(item)">{{item.issue}}</td>
                        <td>
                          <input type="text" :disabled="!item.checked" @input="handleInputMultipleChange(item, $event, 'chaseData3')" class="multiple-input" :value="item.checked?item.multiple:0">
                        </td>
                        <td>{{item.checked?toThousands(Number(item.money).toFixed(2)):0}}</td>
                        <td>{{item.times}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="right-bot">
                <div>
                  <el-checkbox v-model="stopNum">中奖后停止追号</el-checkbox>
                  <button class="clear-number" @click="handleClearChase">清除追号</button>
                </div>
                <div style="font-weight:600;">共追
                  <span class="bets-style">{{issueTimesAll}}</span> 期 /
                  <span class="bets-money">{{chaseNumBets}}</span> 注，金额
                  <span class="bets-money">￥{{toThousands(Number(chaseNumMoney).toFixed(2))}}</span> 元</div>
              </div>
            </div>
          </div>
          <div class="count-num">
            总计：
            <span class="bets-style">{{chaseNumBets||setAllBetsFn()}}</span> 注， 共
            <span class="bets-money">{{chaseNumMoney?toThousands(Number(chaseNumMoney).toFixed(2)):toThousands(setAllMoneyFn().toFixed(2))}}</span> 元 可用余额
            <span class="bets-money">{{toThousands(getBlance.toFixed(2))}}</span> 元
          </div>
          <div class="bets-confirm">
            <div @click="confirmLotteryFn" :class="(shoppingCart.length===0 || isClick)?'disabled':''" :disabled="(shoppingCart.length===0 || isClick)">
              <button class="bets-confirm-btn">确认投注</button>
              <div class="bets-confirm-countDown">
                <span style="margin-bottom:4px;">截止时间</span>
                <span>{{countDownTime2[0]}} : {{countDownTime2[1]}} : {{countDownTime2[2]}}</span>
              </div>
            </div>
          </div>
          <hr class="my-split-line">
          <div class="my-bets-table">
            <div class="my-bets-table-tip">
              <span v-for="(item, index) in myBetsTableTip" :key="index" @click="handleChangemyTableTipTitle(item)" :class="item.checked?'checked':''">{{item.title}}</span>
            </div>
            <div class="my-bets-table-wrap" v-if="isShowData">
              <table style="width:100%">
                <thead>
                  <tr>
                    <th>
                      <span>游戏</span>
                    </th>
                    <th>
                      <span>玩法</span>
                    </th>
                    <th>
                      <span>期号</span>
                    </th>
                    <th>
                      <span>开奖号</span>
                    </th>
                    <th>
                      <span>投注内容</span>
                    </th>
                    <!-- <th>注数比例</th> -->
                    <th>
                      <span>投注金额</span>
                    </th>
                    <th>
                      <span>奖金</span>
                    </th>
                    <th>
                      <span>奖金-返点</span>
                    </th>
                    <th>
                      <span>状态</span>
                    </th>
                    <th>
                      <span>操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in betsDataList" :key="index">
                    <th>{{item.gamename}}</th>
                    <th>{{item.lotteryname}}</th>
                    <th>{{item.issue_no}}</th>
                    <th>{{item.luck_no}}</th>
                    <th style="width:10%;">
                      <div>{{item.vote_no}}</div>
                    </th>
                    <!-- <th>0.5%</th> -->
                    <th>{{Number(item.vote_cash||0).toFixed(2)}}</th>
                    <th :class="item.status==5?'zhongjiangMoney':''">{{Number(item.award_cash||0).toFixed(2)}}</th>
                    <th>{{item.refund}}</th>
                    <th :class="item.status==5?'zhongjiang':''">{{voteStatus(item.status)}}</th>
                    <th class="bets-detail-btn">
                      <router-link target="_blank" :to="{path:'/project/lotteryRecord',query:{id:item._id}}">
                        详情
                      </router-link>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="my-bets-table-wrap" v-if="!isShowData">
              <table style="width:100%">
                <thead>
                  <tr>
                    <th>
                      <span>游戏</span>
                    </th>
                    <th>
                      <span>玩法</span>
                    </th>
                    <th>
                      <span>起始奖期</span>
                    </th>
                    <th>
                      <span>追号进度</span>
                    </th>
                    <th>
                      <span>投注内容</span>
                    </th>
                    <!-- <th>注数比例</th> -->
                    <th>
                      <span>总追号金额</span>
                    </th>
                    <th>
                      <span>已完成金额</span>
                    </th>
                    <th>
                      <span>已中奖金额</span>
                    </th>
                    <th>
                      <span>已取消金额</span>
                    </th>
                    <th>
                      <span>追中即停</span>
                    </th>
                    <th>
                      <span>状态</span>
                    </th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in chaseDataList" :key="index">
                    <th>{{item.gamename}}</th>
                    <th>{{item.lotteryname}}</th>
                    <th>{{item.start_issue_no}}</th>
                    <th>{{item.issue_num_finished+'/'+item.issue_num}}</th>
                    <th style="width:10%;">
                      <div>{{item.vote_no}}</div>
                    </th>
                    <!-- <th>注数比例</th> -->
                    <th>{{Number(item.total_vote_cash||0).toFixed(2)}}</th>
                    <th>{{Number(item.vote_cash_finished||0).toFixed(2)}}</th>
                    <th>{{Number(item.award_cash||0).toFixed(2)}}</th>
                    <th>{{Number(item.vote_cash_canceled||0).toFixed(2)}}</th>
                    <th>{{item.is_hit_stop===1?'是':'否'}}</th>
                    <th>{{chaseStatus(item.status)}}</th>
                    <th class="bets-detail-btn">
                      <router-link target="_blank" :to="{path:'/project/trackRecord',query:{id:item._id}}">
                        详情
                      </router-link>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="33%" :center="true" :before-close="handleDialogClose">
          <span>您选择的号码在号码篮已存在，将直接进行倍数累加</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm(shoppingItem)">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="温馨提示" :visible.sync="betsSuccess" width="30%">
          <span>投注成功，您可以点击
            <span class="youxijilu">
              <router-link target="_blank" :to="{path:'/project/lotteryRecord'}">
                “投注记录”
              </router-link>
            </span>
            查看注单详情</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="betsSuccess = false">关闭</el-button>
            <el-button type="primary" @click="betsSuccess = false">
              <span class="zhudanxiangqi">
                <router-link target="_blank" :to="{path:'/project/lotteryRecord',query:{id:betsSuccessId}}">
                  注单详情
                </router-link>
              </span>
            </el-button>
          </span>
        </el-dialog>

        <el-dialog title="温馨提示" :visible.sync="chaseSuccess" width="30%">
          <span>投注成功，您可以点击
            <span class="youxijilu">
              <router-link target="_blank" :to="{path:'/project/trackRecord'}">
                “投注记录”
              </router-link>
            </span>
            查看注单详情</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="chaseSuccess = false">关闭</el-button>
            <el-button type="primary" @click="chaseSuccess = false">
              <span class="zhudanxiangqi">
                <router-link target="_blank" :to="{path:'/project/trackRecord',query:{id:chaseSuccessId}}">
                  注单详情
                </router-link>
              </span>
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  import betsMode from '../../bets/betsMode';
  import betsAreaTen from '../../bets/betsAreaTen';
  import betsText from '../../bets/betsText';
  import lotteryNumberArr from '../../bets/lotteryNumberArr';
  import countDown from '../../bets/countDown';
  import request from '../../axios/axios.js'
  import { getVoteStatus } from '../../common/filterStatus.js';
  import { getChaseStatus } from '../../common/filterStatus.js';
  import paramCryptFn from '../../lib/cryptData.js'
  const bit = ['百位', '十位', '个位'];
  export default {
    name: 'qt',
    components: {
      betsMode,
      betsAreaTen,
      betsText,
      lotteryNumberArr,
      countDown
    },
    data() {
      return {
        bets: this.$store.state.bets,
        money: this.$store.state.bets * this.$store.state.price,
        s_code: '',
        issueTimeData: {
          sd: 19,
        }, // 追号期数
        isShowLotteryNum: false,
        activityBegin: false,
        logoImgCode: '',
        isClick: false, // 双击
        toBets: false, // 是否加入到购物车 触发到子组件里
        maxRefund: 0,
        maxPrize: 0,
        minRefund: 0,
        diff: 0,
        wei: '', // 选中的位数
        myInterval: null, // 定时器
        issue: '',
        issueArr: [],
        refreshIssue: false,
        newIssue: '',
        getIssueTime: 10, // 获取最新一期 期号的定时 s
        betsDataList: [],
        chaseDataList: [],
        isShowData: true,
        gameName: '',
        gameid: '',
        lotteryid: '',
        lotteryType: 1, // 投注方式 : 1:利润率追号, 2: 同倍追号, 3:翻倍追号
        loginname: localStorage.getItem('loginname'),
        symCode: '', // 分割符
        chaseData1: [],
        chaseData2: [],
        chaseData3: [],
        userBlance: 0, // 用户余额
        moneyTypeArr: ['元', '角', '分'],
        moneyType: '元', // 1 元, 2 角, 3 分
        prize: 0, // 奖金
        c_prize: 0, // 复制 奖金

        yinglilv: 50, // 盈利率
        issueTimes1: 10, // 追期号
        stratMultiple2: 1, // 起始倍数
        issueTimes2: 10, // 追期号
        stratMultiple3: 1, // 起始倍数
        intervalIssue3: 2, // 间隔多少期
        doubleMultiple3: 2, // 翻多少倍
        issueTimes3: 10, // 追期号

        chaseNumBets: 0, // 追号 注数
        chaseNumMoney: 0, // 追号 钱
        issueTimesAll: 0, // 总期数
        loaded: true,
        countDownTime1: '00:09:15',
        countDownTime2: [],
        maxMultiple: 222, // 最大倍数
        minMultiple: 1,
        betsNumber: '', // 加入到采购蓝的 所有投注号码 字符串 ru: 0-1|0-1|0-1|0-1|0-1
        randernewBetsMode: false, // 为了同步模块中的数据
        randerbetsAreaTen: false, //同上
        dialogVisible: false, // 弹出框 倍数累加
        betsSuccess: false, // 弹出框 投注成功
        betsSuccessId: '', // 投注成功 注单id
        chaseSuccess: false, // 弹出框 追号成功
        chaseSuccessId: '', // 追号成功 注单id
        lottery3id: '', // 标题 id
        groupName: '', // 当前投注的标题，如：五星
        betsType: '', // 当前投注的类型，如：直选
        betsModeName: '', // 当前投注的方式，如：直选复式
        multiple: 1, // 投注倍数
        adjust: 0, // 奖金调节
        userRefund: 0,
        defaultAt: 2000,
        shoppingCart: [], // 采购蓝的数据
        shoppingItem: null, // 采购蓝中的每一项
        rightTitle: [
          { title: '利润率追号', checked: true },
          { title: '同倍追号', checked: false },
          { title: '翻倍追号', checked: false }
        ],
        myBetsTableTip: [
          { title: '我的投注', checked: true },
          { title: '我的追号', checked: false }
        ],
        stopNum: true, // 是否停止追号
        c_navData: [
          { title: '三星', checked: false },
          { title: '二星', checked: false },
          { title: '一星', checked: false },
          { title: '不定位', checked: false },
          { title: '大小单双', checked: false }
        ],
        navData: [],
        betsArr: {}, // 当前投注的数据， 里面有 投注号 数组(data)，当前方式的每一项(item)，投注方式(title)，投注类型(type)
        betsMode: [], // 当前投注的数组 如： fiveStar, 方便数据 渲染绑定 在initData 中使用, 绑定到 模块中
        botThreeStar: [
        {
          title: '直选',
          data: [
            { title: '复式', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['百位', '十位', '个位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '单式', type: 'text', checked: false, checkBit: false, numLen: 3, isDouble: 2, order: false, valueLen: 0 },
            { title: '直选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: true, oprateBtn: 'bottom', vertOprate: false, checkBit: false, valueLen: 3 }
          ]
        },
        {
          title: '组选',
          data: [
            { title: '组三', type: 'single', showOprateBtn: true, checked: false, unit: 2, betsTitle: ['组三'], betsMode: 2, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '组三单式', type: 'text', checked: false, checkBit: false, numLen: 3, isDouble: 3, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
            { title: '组六', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组六'], betsMode: 3, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '组六单式', type: 'text', checked: false, checkBit: false, numLen: 3, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
            { title: '混合组选', type: 'text', checked: false, checkBit: false, numLen: 3, isDouble: 1, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
            { title: '组选和值', type: 'and', showOprateBtn: false, checked: false, unit: 1, betsTitle: [''], betsMode: 1, isDouble: false, oprateBtn: 'bottom', vertOprate: false, checkBit: false, valueLen: 3 }
          ]
        }],
        twoStar: [
        {
          title: '直选',
          data: [
            { title: '前二直选', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['百位', '十位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
            { title: '后二直选', type: 'compound', showOprateBtn: true, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 2, order: false, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
          ]
        },
        {
          title: '组选',
          data: [
            { title: '后二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '后二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
            { title: '前二复式', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['组选'], betsMode: 2, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '前二单式', type: 'text', checked: false, checkBit: false, numLen: 2, isDouble: 0, order: true, valueLen: 0 }, // isDouble 0 三个值都不能一样, 1 可以有两个一样, 2 可以都一样, 3必须有两个值一样
          ]
        }],
        oneStar: [
        {
          title: '定位胆',
          data: [
            { title: '定位胆', type: 'position', showOprateBtn: true, checked: true, unit: 1, betsTitle: bit, betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false }
          ]
        }],
        nonPos: [
        {
          title: '不定位',
          data: [
            { title: '一码不定位', type: 'end', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '二码不定位', type: 'single', showOprateBtn: true, checked: false, unit: 1, betsTitle: ['不定位'], betsMode: 2, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
          ]
        }],
        sizeDouble: [
        {
          title: '大小单双',
          data: [
            { title: '前二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: false, unit: 1, betsTitle: ['百位', '十位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
            { title: '后二大小单双', type: 'sizeDouble', showOprateBtn: false, checked: true, unit: 1, betsTitle: ['十位', '个位'], betsMode: 1, isDouble: true, oprateBtn: 'right', vertOprate: false, checkBit: false },
          ]
        }],
      }
    },
    created() {
      const vm = this;
      this.gameid = this.$route.query.id;
      this.logoImgCode = '/static/logo/' + this.$route.query.s_code + '.png';
      this.getLotteryDetailList();


      this.$store.dispatch('setbodyBG', 'default');
      localStorage.setItem('bodyBG', 'default');
    },
    beforeDestroy() {
      // console.log('beforeDestroy')
    },
    destroyed() {
      const vm = this;
      clearInterval(vm.myInterval)
      // console.log('Destroy')
    },
    computed: {
      getBlance() {
        return this.$store.state.blance;
      }
    },
    methods: {
      toThousands(num) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n1 = (num || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) { return s1.replace(re, "$&,") + s2; });
        return n1
      },
      voteStatus(status) {
        return getVoteStatus(status)
        // switch(status){
        //   case 0: return '默认';
        //   case 1: return '待开奖';
        //   case 2: return '等待中';
        //   case 3: return '已撤销';
        //   case 4: return '未中奖';
        //   case 5: return '中奖';
        // }
      },
      chaseStatus(status) {
        return getChaseStatus(status)
        // switch(status){
        //   case 1: return '进行中';
        //   case 2: return '已结束';
        //   case 3: return '用户取消';
        //   case 4: return '系统取消';
        // }
      },
      setRefreshIssue() {
        const vm = this;
        vm.refreshIssue = true;
        setTimeout(() => {
          vm.refreshIssue = false;
        }, 600)
      },
      handlesendWei(val) {
        this.wei = val.join('|')
      },
      //
      handlecountdownisflase(val) {
        if (!val) {
          this.chaseData1 = [];
          this.chaseData2 = [];
          this.chaseData3 = [];
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
              vm.activityBegin = true
            } else {
              vm.activityBegin = false;
            }
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              vm.issue = latestIssue.issue_no;
              vm.issueArr = success.data.issues;
              vm.$store.dispatch('setBlance', success.data.cash);
              localStorage.setItem('blance', success.data.cash);
              if (vm.newIssue !== vm.issueArr[0].issue_no) {
                vm.newIssue = vm.issueArr[0].issue_no;
                vm.setRefreshIssue();
              }
            }
          },
          (error) => {
            console.log(error)
          }
        )

      },
      // 切换标题的时候，初始化数据
      initData(data, i1, i2) {
        // console.log(data)
        let index1 = i1 || 0;
        let index2 = i2 || 0;
        data.filter(function(v1) {
          v1.data.filter(function(v2) {
            v2.checked = false;
          })
        })
        data[index1].data[index2].checked = true;
        this.multiple = 1;
        this.betsMode = data;
      },
      // 切换 moneyType
      handleChangeMoneyType(item) {
        this.moneyType = item;
        if (this.moneyType === '元') {
          this.c_prize = this.prize
        } else if (this.moneyType === '角') {
          this.c_prize = this.prize * 0.1
        } else if (this.moneyType === '分') {
          this.c_prize = this.prize * 0.01
        }
      },
      // 切换投注类型
      handlechangeBetsMode(val) {
        this.multiple = val;
      },
      // 切换标题
      handleChangeNav(item) {
        const vm = this;
        this.betsNumber = '';
        this.groupName = item.title;
        this.randernewBetsMode = false;
        // 为了让 vue 检测到 数据变化， 渲染DOM
        setTimeout(function() {
          vm.randernewBetsMode = true;
        }, 10)
        this.navData.filter(v => {
          v.checked = false;
        })
        item.checked = true;
        this.lottery3id = item.lottery3id;
        if (item.title === '三星') {
          this.initData(this.botThreeStar);
        } else if (item.title === '二星') {
          this.initData(this.twoStar);
        } else if (item.title === '一星') {
          this.initData(this.oneStar);
        } else if (item.title === '不定位') {
          this.initData(this.nonPos);
        } else if (item.title === '大小单双') {
          this.initData(this.sizeDouble);
        }
      },
      // 获取从模块中返回的 投注的 数据
      handlesendBetsArr(data) {
        // console.log(data)
        const vm = this;
        this.betsNumber = '';
        this.randerbetsAreaTen = false;
        setTimeout(function() {
          vm.randerbetsAreaTen = true;
        }, 10)
        this.betsArr = data;
        this.isShowLotteryNum = false;
        setTimeout(() => {
          vm.isShowLotteryNum = true;
        }, 10)
        this.lotteryid = data.item.lotteryid;
        this.betsType = data.title;
        try {
          let prize, max_multiple;
          if (this.userRefund > this.maxRefund) {
            prize = (2 * data.item.probability * (this.userRefund - this.diff)) / this.maxRefund;
            max_multiple = Math.floor(this.maxPrize / prize);
          } else {
            prize = (2 * data.item.probability * this.userRefund) / this.maxRefund;
            max_multiple = Math.floor(this.maxPrize / prize);
          }
          this.maxMultiple = max_multiple;
          vm.prize = prize
          // console.log(this.userRefund, this.maxRefund, this.diff, data.item.probability)
          // console.log(max_multiple)
          if (this.moneyType === '元') {
            vm.c_prize = vm.prize
          } else if (vm.moneyType === '角') {
            vm.c_prize = vm.prize * 0.1
          } else if (vm.moneyType === '分') {
            vm.c_prize = vm.prize * 0.01
          }
        } catch (e) {}
      },
      // 清除投注号
      handleclearBetsNumber(val) {
        this.betsNumber = val;
      },
      //
      handleeidtToBets(val) {
        this.toBets = val;
      },
      // 获取 投注的号码
      getBetsNumber(val) {
        const vm = this;
        let ok = true;
        if (val === false) {
          ok = false;
        }
        if (this.betsArr.type.indexOf('and') > -1) {
          this.symCode = '-'
        } else {
          this.symCode = '';
        }
        if (this.betsArr.type === 'text') {
          let children = this.$children;
          children.filter(v => {
            if (v.$vnode.tag.indexOf('betsText') > -1) {
              v.ssc_checkBetsText(ok); //子组件里的检测方法
            }
          })
          var data = this.betsArr.data;
          this.betsNumber = data.join("|")
        } else {
          var data = this.betsArr.data;
          var arr = [];
          for (let i in data) {
            arr.push(data[i].data)
          }
          var str1 = '',
            str2 = '';
          var arr1 = [];
          arr.filter(v => {
            arr1.push(v.join(vm.symCode))
          })
          this.betsNumber = arr1.join("|")
        }
      },
      // 加入到购彩篮时
      handleJoin() {
        const vm = this;
        this.betsModeName = this.betsArr.item.title;
        this.$store.dispatch('setclearBetsNum', true);
        this.getBetsNumber();
        // this.toBets = true;
        this.joinToshoppingCart();
      },
      // 加入到购彩篮
      joinToshoppingCart() {
        const vm = this;
        let play = this.groupName + ',' + this.betsType + ',' + this.betsModeName;
        // console.log(this.shoppingCart)
        // console.log(this.betsNumber,this.$store.state.bets, this.multiple, play)
        // 是否有重复的 注码
        for (let i in this.shoppingCart) {
          if (this.shoppingCart[i].number === this.betsNumber && this.shoppingCart[i].bets === this.$store.state.bets && this.shoppingCart[i].name === play) {
            vm.dialogVisible = true;
            vm.shoppingItem = this.shoppingCart[i];
            return false
          }
        }
        let o = new Object();
        o.name = play;
        o.number = this.betsNumber;
        o.bets = this.$store.state.bets;
        o.multiple = this.multiple;
        o.price = this.toThousands(this.setMoneyFn().toFixed(2));
        o.c_price = this.setMoneyFn();
        o.icon = false;
        o.gameid = this.gameid;
        o.lotteryid = this.lotteryid;
        o.lottery3id = this.lottery3id;
        o.moneyType = this.moneyType;
        o.checkLen = this.wei.split('|');
        o.refund = vm.adjust + '-' + ((vm.userRefund - vm.adjust) / vm.defaultAt * 100) + '%'; // 返点
        this.shoppingCart.push(o);
        this.resetData();
      },
      // 加入完成 初始化数据
      resetData() {
        if (this.betsArr.type !== 'text') {
          this.betsArr.data.filter(v => {
            v.data = [];
          })
        }
        this.$store.dispatch('setBets', 0);
        this.multiple = 1;
      },
      // 判断按钮是否可点击
      setJoinBtnDis() {
        return !this.$store.state.bets > 0
      },
      // 设置 注 数
      setBetsFn() {
        return this.$store.state.bets
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
      // 设置 购彩篮总注 数
      setAllBetsFn() {
        let bets = 0;
        this.shoppingCart.filter(v => {
          bets += v.bets;
        })
        return bets
      },
      // 设置 购彩篮总钱
      setAllMoneyFn() {
        let price = 0;
        this.shoppingCart.filter(v => {
          price += Number(v.c_price)
        })
        return price
      },
      // 删除的 图标变化
      handleMouseOverIcon(item) {
        item.icon = true;
      },
      handleMouseOutIcon(item) {
        item.icon = false;
      },

      // 从购彩篮中删除
      handleDeleteBet(item, index, e) {
        e.stopPropagation();
        let t = this.groupName + ',' + this.betsArr.title + ',' + this.betsArr.item.title;
        if (t === item.name) {
          this.betsArr.data.filter(v => {
            v.data = [];
          })
          this.$store.dispatch('setBets', 0);
        }
        this.shoppingCart.splice(index, 1)
        if (this.shoppingCart.length === 0) {
          return false;
        } else if (index > this.shoppingCart.length - 1) {
          index = this.shoppingCart.length - 1
        }
        this.handleMouseOverIcon(this.shoppingCart[index])

      },
      // 点击 购彩篮中的某一项
      handleClickShop(item) {
        const vm = this;
        this.groupName = item.name.split(",")[0];
        if (item.name.indexOf('单式') > -1) {
          return false;
        } else {
          let arr = item.name.split(",");
          if (arr[0] === '三星') {
            vm.filterShoppingCart(item, vm.botThreeStar);
          } else if (arr[0] === '二星') {
            vm.filterShoppingCart(item, vm.twoStar)
          } else if (arr[0] === '一星') {
            vm.filterShoppingCart(item, vm.oneStar)
          } else if (arr[0] === '不定位') {
            vm.filterShoppingCart(item, vm.nonPos)
          } else if (arr[0] === '大小单双') {
            vm.filterShoppingCart(item, vm.sizeDouble)
          }
        }
      },
      filterShoppingCart(item, data) {
        const vm = this;
        // console.log(item)
        // console.log('data---',data)
        let arr = item.name.split(",");
        let num = item.number;
        let t0 = arr[0];
        let t1 = arr[1];
        let t2 = arr[2];
        let i1, i2;
        let o = new Object();
        if (this.betsArr.type.indexOf('and') > -1) {
          this.symCode = '-'
        } else {
          this.symCode = '';
        }
        data.filter((v, vi) => {
          if (v.title === t1) {
            i1 = vi
          }
          v.data.filter((k, ki) => {
            if (k.title === t2) {
              o = k;
              o.checkLen = item.checkLen
              i2 = ki
            }
          })
        })
        let numArr = [];
        // console.log('购彩篮选中项--------',num)
        num.split('|').filter((v, vi) => {
          let t = o.betsTitle[vi];
          let o1 = new Object();
          o1.data = [];
          o1.title = t;
          // console.log('购彩篮中每一项---------',v)
          if (v.indexOf('-') > -1) {
            v.split('-').filter(k => {
              o1.data.push(k)
            })
          } else {
            v.split('').filter(k => {
              o1.data.push(k)
            })
          }
          numArr.push(o1);
        })
        let result = new Object();
        result.data = numArr;
        result.item = o;
        result.title = t1;
        result.type = o.type;
        let navI;
        this.navData.filter((v, vi) => {
          v.checked = false;
          if (v.title === t0) {
            navI = vi
          }
        })
        // console.log('购彩篮选中项--------',result)
        this.navData[navI].checked = true;
        this.$store.dispatch('setBets', item.bets);
        vm.initData(data, i1, i2);
        vm.betsArr = result;
        vm.randerbetsAreaTen = false;
        setTimeout(() => {
          vm.randerbetsAreaTen = true;
        }, 20)
        vm.multiple = item.multiple;
      },
      // 加减倍数
      handleJianMultiple() {
        this.multiple--;
        if (this.multiple <= 0) {
          this.multiple = this.minMultiple
        }
      },
      handleJiaMultiple() {
        this.multiple++;
        if (this.multiple >= this.maxMultiple) {
          this.multiple = this.maxMultiple
        }
      },
      handleSetMaxMultiple() {
        document.onkeyup = null;
        if (this.multiple >= this.maxMultiple) {
          this.multiple = this.maxMultiple
        }
      },
      inputMultiple() {
        const vm = this;
        document.onkeyup = function() {
          vm.multiple = vm.multiple.replace(/\D/g, function() { return '' })
          if (Number(vm.multiple) === 0) {
            vm.multiple = 1;
          }
          // console.log(vm.multiple)
        }
      },

      // 清空购彩篮
      clearShoppingCart() {
        if (this.betsArr.type !== 'text') {
          this.betsArr.data.filter(v => {
            v.data = [];
          })
        } else {
          let children = this.$children;
          children.filter(v => {
            if (v.$vnode.tag.indexOf('betsText') > -1) {
              v.clearTextFn(); //子组件里的清空方法
            }
          })
        }
        this.$store.dispatch('setBets', 0);
        this.shoppingCart = [];
      },
      // 如果注码重复，取消
      handleDialogClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 如果注码重复， 只增加注码的倍数，不再添加
      handleConfirm(item) {
        item.multiple += this.multiple;
        item.price = (Number(item.price) + this.setMoneyFn()).toFixed(2);
        this.dialogVisible = false;
        this.resetData();
      },
      // 标题切换
      handleChangeRightTitle(item, index) {
        this.rightTitle.filter(v => {
          v.checked = false;
        })
        item.checked = true;
        let name;
        let bets = this.setAllBetsFn();
        if (index === 0) {
          name = 'chaseData1';
        } else if (index === 1) {
          name = 'chaseData2';
        } else if (index === 2) {
          name = 'chaseData3';
        }
        this.chaseNumMoney = 0;
        this.chaseNumMoney = 0;
        this.issueTimesAll = this[name].length
        this[name].filter(v => {
          this.chaseNumMoney += Number(v.money)
        })
        this.chaseNumBets = bets * this.issueTimesAll;
      },
      // 切换 我的投注
      handleChangemyTableTipTitle(item) {
        this.myBetsTableTip.filter(v => {
          v.checked = false;
        })
        item.checked = true;
        if (item.title === '我的投注') {
          this.getBetsDataList()
          this.isShowData = true;
        } else {
          this.getChaseDataList();
          this.isShowData = false;
        }
      },
      // 获取倒计时
      handlesendTime(val) {
        this.countDownTime2 = val.split(':');
      },
      // 获取玩法列表
      getLotteryDetailList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/game/detail', { gameid: vm.gameid },
          (success) => {
            // console.log('game-detail-----', success);
            let code = success.returncode;
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              vm.maxRefund = success.data.max_refund;
              vm.minRefund = success.data.min_refund;
              vm.maxPrize = success.data.max_prize;
              vm.diff = success.data.diff;


              vm.userRefund = Number(localStorage.getItem('refund')) - vm.diff;
              vm.adjust = vm.userRefund;
              vm.userBlance = Number(localStorage.getItem('blance'));
              vm.$store.dispatch('setBlance', vm.userBlance);

              vm.gameName = success.data.name;
              vm.setInitData(success.data.children)
              vm.$nextTick(() => {
                vm.getNewIssue()
              })
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      setInitData(data) {
        const vm = this;
        vm.navData = [];
        // let arr = [vm.fiveStar, vm.fourStar, vm.topThreeStar, vm.cenThreeStar, vm.botThreeStar, vm.twoStar, vm.oneStar, vm.nonPos, vm.sizeDouble, vm.interest, vm.optional, vm.tiger, vm.andValue];
        // data.filter((v, vi) => {
        //   let o = {title: v.name, checked: false};
        //   vm.navData.push(o);
        //   v.children.filter((k, ki) => {
        //     k.children.filter((m, mi) => {
        //       arr[vi][ki].data[mi].play = m.note1;
        //       arr[vi][ki].data[mi].plan = m.note2;
        //     })
        //   })
        // })
        data.filter((v, vi) => {
          let o = { title: v.name, checked: false, lottery3id: v._id };
          vm.navData.push(o);
          if (v.name === '三星') {
            vm.filterLotteryList(v.children, vm.botThreeStar, v);
          } else if (v.name === '二星') {
            vm.filterLotteryList(v.children, vm.twoStar, v);
          } else if (v.name === '一星') {
            vm.filterLotteryList(v.children, vm.oneStar, v);
          } else if (v.name === '不定位') {
            vm.filterLotteryList(v.children, vm.nonPos, v);
          } else if (v.name === '大小单双') {
            vm.filterLotteryList(v.children, vm.sizeDouble, v);
          }
        })
        this.loaded = false;
        this.newIssueInterval();
        this.betsMode = this.fiveStar;
        this.handleChangeNav(this.navData[0]);
        this.$nextTick(() => {
          this.getBetsDataList();
        })
      },
      filterLotteryList(data, arr, item) {
        arr.filter((k, ki) => {
          k.show = false;
          if (item.children[ki]) {
            k.show = true;
          }
          k.data.filter((m, mi) => {
            m.show = false;
            if (item.children[ki].children[mi]) {
              m.show = true;
              m.play = item.children[ki].children[mi].note1; // 玩法
              m.plan = item.children[ki].children[mi].note2; // 方案
              m.prize = item.children[ki].children[mi].prize || 0; // 奖金
              m.extra = item.children[ki].children[mi].extra || ''; // 赔率数组
              m.probability = item.children[ki].children[mi].probability; // 赔率
              m.lotteryid = item.children[ki].children[mi]._id; // lotteryid
            }
          })
          // k.children.filter((m, mi) => {
          //   data[ki].data[mi].play = m.note1; // 玩法
          //   data[ki].data[mi].plan = m.note2; // 方案
          //   data[ki].data[mi].prize = m.prize || 0; // 奖金
          //   data[ki].data[mi].probability = m.probability; // 赔率
          //   data[ki].data[mi].lotteryid = m._id; // lotteryid
          // })
        })
      },

      // 追号计划
      handleLotteryPlan(val) {
        const vm = this;
        this.lotteryType = val;
        if (this.shoppingCart.length === 0) {
          this.$alert('请至少选择一注投注号码！', '温馨提示', {
            confirmButtonText: '关闭',
            center: true
          });
        } else if (val === 1) {
          let onePrice = this.setAllMoneyFn();
          vm.profitChase(vm.yinglilv / 100, vm.c_prize, onePrice, vm.issueTimes1, 1, vm.maxMultiple)
        } else if (val === 2) {
          vm.sameChase()
        } else if (val === 3) {
          vm.doubleChase()
        }
      },

      // 设置追号的期数
      handleInputChaseIssue(name) {
        let times = this.issueTimeData[this.s_code]
        if (isNaN(this[name])) {
          this[name] = 1;
        } else if (this[name] > times) {
          this[name] = times
        } else if (this[name] < 1) {
          this[name] = 1
        }
      },

      // 利润率追号
      profitChase(yinglilv, prize, onePrice, times, multipleBase, maxnum) {
        // //yinglilv 盈利率
        //prize 所有注单的单倍价格  奖金
        //onePrice 注单 总价
        //times 需要运行的期数
        //multipleBase 起始倍数
        //maxnum 最大可设的倍数

        //总金额
        var amountAll = multipleBase * onePrice,
          //标记原始计算出的倍数
          oldMultiple = 0,
          //每次运算结果倍数变量
          multiple,
          i = 0,
          result = [];

        //当期倍数＝ceil((总花销*(1+盈利率)/(单倍奖金-单倍成本*(1+盈利率)))
        for (; i < times; i++) {
          multiple = Math.ceil(amountAll * (1 + yinglilv) / (prize - onePrice * (1 + yinglilv)));
          if (multiple < 1) {
            break;
          }
          oldMultiple = multiple;
          multiple = multiple > maxnum ? maxnum : multiple;
          if (i == 0) {
            amountAll = multiple * onePrice;
          } else {
            amountAll = amountAll + (multiple * onePrice);
          }
          result.push({ 'multiple': multiple, 'amountAll': amountAll, 'winAmountAll': prize * multiple - amountAll, 'oldMultiple': oldMultiple });
        }
        // return result;
        let arr = [];
        let money = onePrice;
        let bets = this.setAllBetsFn();
        if (result.length === 0) {
          alert('您设置的参数无法达到盈利，请重新设置');
          return false
        }
        result.filter((v, i) => {
          let issue = this.issue + i * 1;
          let multiple = v.multiple
          let o = {
            issue: issue,
            multiple: multiple,
            money: multiple * money,
            prize: multiple * bets * this.c_prize,
            winAmountAll: v.winAmountAll.toFixed(2),
            yinglilv: ((v.winAmountAll / v.amountAll) * 100).toFixed(2) + "%",
            checked: true
          }
          arr.push(o)
        })
        this.issueTimesAll = arr.length;
        this.chaseData1 = arr;
        this.chaseNumMoney = 0;
        this.chaseData1.filter(v => {
          this.chaseNumMoney += Number(v.money)
        })
        this.chaseNumBets = bets * this.issueTimesAll;
      },
      // 同倍 追号
      sameChase() {
        this.multipleChaseFn(false, 'chaseData2')
      },
      // 翻倍追号
      doubleChase() {
        this.multipleChaseFn(true, 'chaseData3')
      },
      multipleChaseFn(val, name) {
        const vm = this;
        let time = new Date();
        let currH = this.countDownTime2[0] * 1;
        let currM = this.countDownTime2[1] * 1;
        let currS = this.countDownTime2[2] * 1;
        let y = time.getFullYear(); // 年
        let M = time.getMonth() + 1; //月份
        let d = time.getDate(); //日
        let h = time.getHours() + currH; //小时
        let m = time.getMinutes() + currM; //分
        let s = time.getSeconds() + currS; //秒
        let money = this.setAllMoneyFn();
        let bets = this.setAllBetsFn();

        let count = this.intervalIssue3; // 间隔期数
        let doubleMultiple = this.doubleMultiple3; // 翻倍数
        let multiple, issueTimes;
        if (val) {
          multiple = this.stratMultiple3; // 起始倍数
          issueTimes = this.issueTimes3; // 追号期数
        } else {
          multiple = this.stratMultiple2; // 起始倍数
          issueTimes = this.issueTimes2; // 追号期数
        }

        let arr = [];
        for (let i = 0; i < issueTimes; i++) {
          let issue = this.issue * 1 + i;
          let times = new Date(y, M, d, h, (m + i * 10), s).Format("yyyy-MM-dd hh:mm:ss");
          if (val) {
            if (i !== 0) {
              if (i % count === 0) {
                multiple *= doubleMultiple
              }
            }
          }
          let o = {
            issue: issue,
            multiple: multiple,
            money: (multiple * money).toFixed(2),
            times: times,
            checked: true
          }
          arr.push(o)
        }
        this.issueTimesAll = arr.length;
        this[name] = arr;
        this.chaseNumMoney = 0;
        this[name].filter(v => {
          this.chaseNumMoney += Number(v.money)
        })
        this.chaseNumBets = bets * this.issueTimesAll;
      },
      // 清除追号
      handleClearChase() {
        this.issueTimesAll = 0;
        this.chaseNumBets = 0;
        this.chaseNumMoney = 0;
        this.chaseData1 = [];
        this.chaseData2 = [];
        this.chaseData3 = [];
      },
      // 修改某一条 追号的倍数
      handleInputMultipleChange(item, e, data) {
        const vm = this;
        let unit = vm.setAllMoneyFn();
        if (this.moneyType === '元') {
          unit = unit
        } else if (this.moneyType === '角') {
          unit = unit * 0.1
        } else if (this.moneyType === '分') {
          unit = unit * 0.01
        }
        item.multiple = Number(e.target.value.replace(/\D/g, function() { return '' }) || 0);
        item.money = item.multiple * unit;
        if (data === 'chaseData1') {
          let betsMoney = 0;
          vm.chaseData1.filter((v, vi) => {
            betsMoney += v.money;
            if (v.multiple === 0) {
              v.prize = '0.00',
                v.winAmountAll = '0.00';
              v.yinglilv = "0%";
            } else {
              v.prize = v.multiple * vm.c_prize;
              v.winAmountAll = (v.prize - betsMoney).toFixed(2);
              v.yinglilv = ((v.winAmountAll / betsMoney) * 100).toFixed(2) + "%";
            }
          })
        }
        this.chaseNumMoney = 0;
        this[data].filter(v => {
          this.chaseNumMoney += Number(v.money)
        })
      },
      // 选中全部追号期次
      handleCheckedAll(ref, data) {
        let c = this.$refs[ref].checked;
        this.$refs[ref].checked = c;
        this[data].filter(v => {
          v.checked = c
        })
      },
      // 选择某一个追号期次
      handleChecked(item) {
        item.checked = !item.checked
      },

      // 确认投注
      confirmLotteryFn() {
        const vm = this;
        if (this.activityBegin) {
          alert('活动尚未开始，请等待.');
          return false;
        }
        let allBets = vm.chaseNumBets; // 追号 总注数
        let allMoney = vm.chaseNumMoney; // 追号 总钱数
        let wei = vm.wei
        if (allBets != 0) {
          let gameid; // 玩法id (重庆时时彩 id)
          let lottery3id; // 标题id (五星id)
          let lotteryid; // 投注id (直选复式 id)

          let type = vm.lotteryType; // 投注方式 : 1:利润率追号, 2: 同倍追号, 3:翻倍追号
          let profit_percent = vm.yinglilv / 100; // 利润率
          let vote_no; // 投注号码
          // let vote_cash = this.$store.state.price; // 单价
          let vote_cash; // 单注 价格
          // let total_vote_cash = Number(vm.chaseNumMoney?Number(vm.chaseNumMoney):vm.setAllMoneyFn()); // 投注总钱数
          let total_vote_cash; // 单注 追期 价格
          let start_issue_no = vm.issue; // 开始期号
          let is_hit_stop = vm.stopNum ? 1 : 0; // 是否中奖即停
          let unit; // 钱的 类型 元角分
          let prize = vm.c_prize; // 奖金

          let refund = vm.adjust + '-' + ((vm.userRefund - vm.adjust) / vm.defaultAt * 100) + '%'; // 返点

          let issue_num; // 追号总期数
          let start_times; // 起始倍数
          let multiply; // 翻倍数
          let duration; // 间隔期数

          let vote_num; // 每一注的 注数

          let chaseList = [];

          if (type === 1) {
            issue_num = vm.issueTimes1;
          } else if (type === 2) {
            issue_num = vm.issueTimes2;
            start_times = vm.stratMultiple2;
          } else if (type === 3) {
            issue_num = vm.issueTimes3;
            start_times = vm.stratMultiple3;
            multiply = vm.doubleMultiple3;
            duration = vm.intervalIssue3;
          }
          vm.shoppingCart.filter(v => {
            vote_no = v.number;
            gameid = v.gameid;
            lottery3id = v.lottery3id;
            lotteryid = v.lotteryid;
            unit = v.moneyType;
            vote_cash = v.c_price.toFixed(2);
            total_vote_cash = Number(vm.chaseNumMoney ? vm.chaseNumMoney : vm.setAllMoneyFn()).toFixed(2)
            vote_num = v.bets;
            let o = {
              gameid,
              lottery3id,
              lotteryid,
              type,
              profit_percent,
              vote_no,
              vote_cash,
              total_vote_cash,
              start_issue_no,
              is_hit_stop,
              unit,
              prize,
              refund,
              issue_num,
              start_times,
              multiply,
              duration,
              vote_num,
              wei
            }
            chaseList.push(o)
          })
          let totalMoney = vm.chaseNumMoney ? Number(vm.chaseNumMoney).toFixed(2) : vm.setAllMoneyFn().toFixed(2);
          if (vm.userBlance < totalMoney) {
            vm.$alert('投注失败-余额不足', '温馨提示', {
              confirmButtonText: '关闭',
              center: true,
            })
          } else {
            vm.isClick = true;
            let arrIndex;
            for (let i in vm.rightTitle) {
              if (vm.rightTitle[i].checked === true) {
                if (i == 0) arrIndex = 'chaseData1';
                if (i == 1) arrIndex = 'chaseData2';
                if (i == 2) arrIndex = 'chaseData3';
              }
            }
            let chaseDetail = [];
            vm[arrIndex].filter(v => { chaseDetail.push(v.multiple) })
            let sum = vm.setAllMoneyFn();
            // console.log('chaseList-----',chaseList)
            // console.log('chaseList-----',{chaseList, chaseDetail, sum})
            request.http(
              'post',
              '/lottery/chase/luckno',
              paramCryptFn({ chaseList, chaseDetail, sum }),
              (success) => {
                vm.isClick = false;
                // console.log(success);
                let code = success.returncode;
                if (code === 103) {
                  request.loginAgain(vm)
                } else if (code === 101) {
                  request.loginAgain(vm)
                } else if (code === 106) {
                  request.loginAgain(vm)
                } else if (code === 304) {
                  vm.$alert('投注失败-余额不足', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                } else if (code === 200) {
                  // console.log()
                  vm.chaseSuccess = true;
                  vm.shoppingCart = [];
                  vm.chaseData1 = [];
                  vm.chaseData2 = [];
                  vm.chaseData3 = [];
                  vm.getChaseDataList();
                  vm.chaseSuccessId = success.data.result[0]._id;
                  vm.$store.dispatch('setBlance', success.data.cash);
                  localStorage.setItem('blance', success.data.cash);
                  // console.log(vm.$store)
                } else {
                  alert(success.data.msg)
                }
              },
              (error) => {
                vm.isClick = false;
                console.log(error)
              }
            )
          }


        } else {
          let lottery3id; // 标题id (五星id)
          let lotteryid;
          let gameid;
          let vote_no;
          let vote_cash;
          let unit;
          let times;
          let issue_no;
          let refund = vm.adjust + '-' + ((vm.userRefund - vm.adjust) / vm.defaultAt * 100) + '%'; // 返点
          let voteList = [];
          let vote_num; // 每一注的 注数

          vm.shoppingCart.filter(v => {
            lottery3id = v.lottery3id;
            lotteryid = v.lotteryid;
            gameid = v.gameid;
            vote_no = v.number;
            vote_cash = v.c_price.toFixed(2);
            unit = v.moneyType;
            times = v.multiple;
            issue_no = vm.issue;
            refund = v.refund;
            vote_num = v.bets;
            let o = {
              lottery3id,
              lotteryid,
              gameid,
              vote_no,
              vote_cash,
              unit,
              times,
              issue_no,
              refund,
              vote_num,
              wei
            }
            voteList.push(o)
          })
          let totalMoney = vm.chaseNumMoney ? Number(vm.chaseNumMoney).toFixed(2) : vm.setAllMoneyFn().toFixed(2);
          if (vm.userBlance < totalMoney) {
            vm.$alert('投注失败-余额不足', '温馨提示', {
              confirmButtonText: '关闭',
              center: true,
            })
          } else {
            vm.isClick = true;
            request.http(
              'post',
              '/lottery/issue/vote',
              paramCryptFn({ voteList }),
              (success) => {
                vm.isClick = false;
                // console.log(success);
                let code = success.returncode;
                if (code === 103) {
                  request.loginAgain(vm)
                } else if (code === 101) {
                  request.loginAgain(vm)
                } else if (code === 106) {
                  request.loginAgain(vm)
                } else if (code === 304) {
                  vm.$alert('投注失败-余额不足', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                } else if (code === 200) {
                  // console.log()
                  vm.betsDataList = success.data.data;
                  vm.betsSuccess = true;
                  vm.shoppingCart = [];
                  vm.resetData();
                  vm.getBetsDataList();
                  vm.betsSuccessId = success.data.result[0]._id;
                  vm.$store.dispatch('setBlance', success.data.cash);
                  localStorage.setItem('blance', success.data.cash);
                  // console.log(vm.$store)
                } else if (code === 301 || code == 303) {
                  vm.$alert('投注失败-参数错误', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                } else if (code === 305) {
                  vm.$alert('期号过期', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                }
              },
              (error) => {
                vm.isClick = false;
                console.log(error)
              }
            )
          }
        }

      },

      // 直接投注
      gotoBetsFn() {
        if (this.activityBegin) {
          alert('活动尚未开始，请等待.');
          return false;
        }
        const vm = this;
        this.getBetsNumber(false);
        let lottery3id = vm.lottery3id; // 标题id (五星id)
        let lotteryid = vm.lotteryid;
        let gameid = vm.gameid;
        let regNum = vm.betsNumber.replace(/\(\d\W\d\)/g, function() { return '' });
        let vote_no = regNum;
        let vote_cash = vm.setMoneyFn().toFixed(2);
        let unit = vm.moneyType;
        let times = vm.multiple;
        let issue_no = vm.issue;
        let vote_num = vm.setBetsFn();
        let refund = vm.adjust + '-' + ((vm.userRefund - vm.adjust) / vm.defaultAt * 100) + '%'; // 返点
        let wei = vm.wei;

        let title = '<div class="lottery-title">' + vm.gameName + ' 第<strong>' + issue_no + '</strong>期</div>';
        let content = '<div>总计' + vote_num + '注，总共' + vote_cash + '元</div>';
        let html = title + content;
        vm.$alert(html, '确认信息', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          center: true,
        }).then(() => {
          if (vm.userBlance < vote_cash) {
            vm.$alert('投注失败-余额不足', '温馨提示', {
              confirmButtonText: '关闭',
              center: true,
            })
          } else {
            var data = { voteList: [{ lottery3id, lotteryid, gameid, vote_no, vote_cash, unit, times, issue_no, vote_num, refund, wei }] }
            request.http(
              'post',
              '/lottery/issue/vote',
              paramCryptFn(data),
              (success) => {
                // console.log(success);
                let code = success.returncode;
                if (code === 103) {
                  request.loginAgain(vm)
                } else if (code === 101) {
                  request.loginAgain(vm)
                } else if (code === 106) {
                  request.loginAgain(vm)
                } else if (code === 304) {
                  vm.$alert('投注失败-余额不足', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                } else if (code === 200) {
                  // console.log()
                  if (vm.betsArr.type === 'text') {
                    let children = this.$children;
                    children.filter(v => {
                      if (v.$vnode.tag.indexOf('betsText') > -1) {
                        v.clearTextFn(); //子组件里的清空方法
                      }
                    })
                  }
                  vm.betsDataList = success.data.data;
                  vm.betsSuccess = true;
                  vm.resetData();
                  vm.getBetsDataList();
                  vm.betsSuccessId = success.data.result[0]._id;
                  vm.$store.dispatch('setBlance', success.data.cash);
                  localStorage.setItem('blance', success.data.cash);
                  vm.toBets = true;
                  // console.log(vm.$store)
                } else if (code === 301 || code == 303) {
                  vm.$alert('投注失败-参数错误', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                } else if (code === 305) {
                  vm.$alert('期号过期', '温馨提示', {
                    confirmButtonText: '关闭',
                    center: true,
                  })
                }
              },
              (error) => {
                console.log(error)
              }
            )
          }
        }).catch(() => {
          // console.log('取消')
        })
      },

      // 我的投注
      getBetsDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/issue/vote/list', {},
          (success) => {
            // console.log(success);
            let code = success.returncode;
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              // console.log()
              vm.betsDataList = success.data.data
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },

      // 我的追号
      getChaseDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/chase/list', {},
          (success) => {
            // console.log(success);
            let code = success.returncode;
            if (code === 103 || code === 101 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              // console.log()
              vm.chaseDataList = success.data.data
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    },
    mounted() {
      // console.log(this.$store.state.bets)
      const vm = this;
    }
  }
</script>
<style>
  .bets-result-wrap .el-slider__bar {
    background: #d4914d;
  }

  .bets-result-wrap .el-slider__button {
    border-color: #d4914d;
  }

  .bets-result-wrap .el-slider__runway {
    margin: 0 0;
  }

  .bets-result-wrap .el-slider__bar {
    background: #CFA072;
  }

  .bets-result-wrap .el-slider__button {
    width: 20px;
    height: 20px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
  }

  .right-bot .el-checkbox__input.is-checked+.el-checkbox__label {
    font-size: 12px;
    color: #191919;
  }

  .right-bot .el-checkbox__label {
    font-size: 12px;
    color: #191919;
    font-weight: bold;
  }
</style>

<style scoped lang="scss">
  .lottery-wrap {
    width: 1024px;
    margin: 0 auto;
    height: auto;
    color: #333;
    font-size: 12px; // padding-top:20px;
  }

  .lottery-header {
    width: 100%;
    height: 104px; // padding: 0 20px;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
    margin-bottom: 20px; // background: #fff;
    .header-left,
    .header-right {
      display: -webkit-box;
    }
    .header-left {
      // margin-left:20px;
      .header-left-r {
        display: -webkit-box;
        -webkit-box-orient: vertical; // -webkit-box-align:center;
        -webkit-box-pack: justify;
        padding: 8px 10px;
        position: relative;
        margin-left: 12px;
        height: 96px;
        .header-left-r-bj {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0.5;
          background: #000000;
          box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.50);
          border-radius: 4px;
        }
      }
    }
  }

  .lottery-icon {
    width: 140px;
    height: 104px; // margin-left: 25px;
  }

  .lottery-icon img {
    width: 100%;
  }

  .bets-issue {
    display: -webkit-box; // -webkit-box-orient: vertical;
    font-size: 14px; // color: #191919;
    color: #e2e2e2;
    font-weight: 600; // margin-left: 30px;
    position: relative;
    z-index: 2;
  }

  .bets-issue span {
    // display: block;
    text-align: left;
  }

  .bets-issue em {
    font-style: normal;
  }

  .countDown-animate {
    height: auto; // margin-left: 4px;
  }

  .history-issue {
    font-size: 14px;
    font-weight: 600;
    color: #e2e2e2;
    text-align: left;
    margin-left: 4px; // margin-top: -13px;
  }

  .history-lottery-number {
    // margin-left: 33px;
    display: -webkit-box;
    margin-top: 10px;
  }

  .history-lottery-number span {
    display: block;
    width: 58px;
    height: 61px;
    line-height: 60px;
    font-size: 34px;
    color: #191919;
    font-weight: 500; // background: #F0F0F0;
    // border: 1px solid #DFE2E3;
    // border-radius: 2px;
    margin-right: 2px;
    background: url('../../assets/img/bets-num.png') no-repeat;
    background-size: 100% 100%; // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    &:last-child {
      margin-right: 0;
    }
  }

  .explain {
    margin-left: 20px;
    height: 78px;
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify;
  }

  .explain span {
    display: block;
    width: 86px;
    height: 34px;
    line-height: 34px;
    color: #fff; // background: #1a1a1a;
    border-radius: 2px;
    font-size: 14px;
    position: relative;
    a {
      color: #fff;
      text-decoration: none;
      position: relative;
      z-index: 2;
      font-weight:600;
    }
    em.explain-btn-bj {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: #000;
      opacity: .5;
    }
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .lottery-nav {
    width: 100%;
    height: 43px;
    display: -webkit-box;
    color: #333;
    font-size: 14px;
    background: #DBDBDB;
  }

  .lottery-nav span {
    display: block;
    -webkit-box-flex: 1;
    line-height: 43px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #000;
  }

  .lottery-nav .currentTabs {
    border-top: 2px solid #BD8454;
    background: #F4F4F4;
    color: #BD8454;
    font-weight: 600;
  }

  .lottery-content {
    width: 984px;
    margin: 0 auto;
    padding-bottom: 84px;
    position: relative;
  }

  .bets-wrap-parent {
    display: table; // min-height: 308px;
  }

  .bets-wrap {
    width: 710px;
    float: left;
    padding-top: 15px;
  }

  .lottery-num {
    position: absolute;
    right: 0;
    top: 0;
    width: 254px;
    height: 520px;
  }

  .bets-result-wrap {
    width: 710px;
    height: 115px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    margin-top: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify; // padding: 19px 0 16px 0;
    color: #333;
    font-size: 12px;
    position: relative;
  }

  .bets-result-top {
    width: 100%;
    display: -webkit-box; // padding-left: 10px;
    .mode {
      border: 1px solid #DDDDDD;
      border-radius: 2px;
      border-right: none;
      overflow: hidden;
      span {
        display: block;
        width: 30px;
        height: 30px;
        background: #FFFFFF;
        border-right: 1px solid #DDDDDD;
        font-size: 12px;
        color: #777777;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
      span.current {
        color: #191919;
        background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
      }
    }
  }

  .bets-result-top>div {
    display: -webkit-box;
    -webkit-box-align: center;
    margin-right: 20px;
  }

  .jianhao,
  .jiahao {
    display: block;
    width: 30px;
    height: 30px;
    line-height: 29px;
    text-align: center;
    color: #777;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
  }

  /* .jianhao {
    line-height: 25px;
    font-size: 36px;
  } */

  .double-content {
    display: block;
    height: 30px;
    line-height: 30px;
    width: 54px;
    text-align: center;
    padding: 0 3px;
    border: none;
    background: #DBDBDB;
    color: #191919;
    font-size: 18px;
    cursor: default;
  }

  .adjust {
    // width: 25%;
    width: 468px;
    height: 30px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    padding: 0 20px;
  }

  .slider {
    -webkit-box-flex: 1;
    margin-left: 10px;
  }

  .percent {
    display: block;
    margin-left: 10px;
    color: #111;
  }

  .bets-result-bot {
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: end;
  }

  .bets-detail {
    // width: 70%;
    // text-align: center;
    color: #333;
    font-weight: 600; // margin-bottom:10px;
    margin-right: 8px;
  } // .bets-and-join {
  //   position: absolute;
  //   bottom: 0;
  //   right: 0;
  // }
  .bets-and-join button {
    width: 115px;
    height: 40px;
    border-radius: 2px;
    border: none;
    outline: none;
    margin-left: 12px;
    font-size: 14px;
    font-weight: 600;
    background-image: linear-gradient(-180deg, #DBB894 5%, #7C5D3C 97%);
    cursor: pointer;
    color: #fff;
  }

  .bets-and-join button.disabled {
    color: #fff;
    cursor: not-allowed;
    background: #BBBBBB;
    border-radius: 2px;
    font-size: 14px;
    color: #191919;
    font-weight: bold;
  }

  .shopping-cart {
    width: 100%;
    margin-top: 20px;
  }

  .shopping-cart:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  .shopping-cart>div {
    width: 482px;
    min-height: 146px;
    border: 1px solid #ddd; // background:#F4F4F4;
  }

  .shopping-cart>div.left {
    // padding: 5px 0;
    float: left;
    background: #fff;
  }

  .shopping-cart>div.right {
    float: right;
    background: #fff;
  }

  .left-title {
    height: 40px;
    line-height: 40px;
    text-align: left;
    margin-bottom: 5px;
    padding: 0 12px 0 14px;
    /* padding:10px 12px 14px 14px; */
  }

  .left-title .shop-tip {
    color: #333;
    font-weight: 600;
    font-size: 14px;
  }

  .left-title .clean-shop-cart {
    float: right;
    width: 50px;
    height: 20px;
    margin-top: 10px;
    text-align: center;
    line-height: 20px;
    color: #191919;
    border-radius: 2px;
    font-size: 12px;
    cursor: pointer;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
  }

  .right-title {
    width: 100%;
    height: 30px;
    display: -webkit-box;
    background: #DBDBDB;
  }

  .right-title>div {
    position: relative; // width: 102px;
    -webkit-box-flex: 1;
  }

  .right-title>div span {
    display: block;
    text-align: center;
    line-height: 31px;
    font-size: 14px;
    cursor: pointer;
  }

  .right-title span.checked {
    background: #fff;
    color: #A65B06;
  }

  .right-title span.checked+em.line {
    display: block;
    position: absolute;
    left: 0;
    top: -1px;
    width: 100%;
    height: 4px;
    background: #A65B06;
  }

  .right-content {
    width: 100%;
    padding: 10px 17px;
  }

  .right-content-title {
    width: 100%;
    padding: 5px 0 10px 0;
    display: -webkit-box;
    -webkit-box-align: center;
  }

  .right-content-title input {
    border: none;
    outline: none;
    width: 38px;
    height: 20px;
    display: block;
    border: 1px solid #BDBDBD;
    border-radius: 4px;
    padding: 0 8px;
    text-align: center;
    margin: 0 3px;
  }

  .right-content-title button {
    border: none;
    outline: none;
    border-radius: 2px;
    color: #fff;
    width: 90px;
    height: 30px;
    cursor: pointer;
    margin-left: 20px;
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    font-size: 12px;
    color: #191919;
  }

  .right-content-table {
    width: 100%;
    overflow-y: auto;
    max-height: 144px;
  }

  .right-content-table table {
    width: 100%;
    border-collapse: separate;
  }

  .right-content-table table th {
    font-weight: normal;
    border-top: none;
    font-size: 12px;
    color: #666;
    background-color: #F0EEE2;
    padding: 6px;
    background: #F0EEE2;
    text-align: center;
    border-right: 1px solid #DBDBDB;
  }

  .right-content-table table td {
    border-top: 1px solid #DBDBDB;
    font-weight: normal;
    font-size: 12px;
    color: #666;
    background-color: #F0EEE2;
    padding: 6px;
    background: #F7F7F7;
    text-align: center;
    border-right: 1px solid #DBDBDB;
  }

  .right-content-table table tr:hover td {
    background: #fff;
  }

  .multiple-input {
    width: 30px;
    text-align: center;
  }

  .right-bot {
    width: 100%;
    padding: 10px;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
    border-top: 1px solid #e2e2e2;
    padding-left: 20px;
  }

  .right-bot button {
    border: none;
    outline: none;
    background: #BD8454;
    border-radius: 2px;
    width: 74px;
    height: 26px;
    font-size: 12px;
    /* margin-left:47px; */
    cursor: pointer;
    margin-left: 20px;
    /* margin-right:31px; */
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    color: #191919;
  }

  .bets-num-table {
    width: 100%;
  }

  .bets-num-table .table-title {
    width: 100%;
    display: -webkit-box;
    background: #dbdbdb;
    height: 24px;
    line-height: 24px;
  }

  .bets-num-table span {
    display: block;
    border-right: 1px solid #C9C9C9;
    text-align: center;
    color: #191919;
    height: 100%;
    font-size: 12px;
    font-weight: bold;
  }

  .bets-num-table span:last-child {
    border: none;
  }

  .bets-num-table span.name {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bets-num-table span.number {
    width: 112px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bets-num-table span.price {
    width: 56px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bets-num-table span.bet {
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bets-num-table span.multiple {
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bets-num-table span.oprate {
    width: 58px;
  }

  .bets-detail-wrap {
    width: 100%;
  }

  .bets-detail-wrap ul li {
    display: -webkit-box;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ECE8DD;
    cursor: pointer;
  }

  .bets-detail-wrap ul li>span {
    border: none;
  }

  .bets-detail-wrap ul li:last-child {
    border-bottom: none;
  }

  .bets-style,
  .bets-money {
    color: #E10C0C;
  }

  .count-num {
    width: 100%;
    text-align: center;
    font-weight: 600;
    margin-top: 32px;
    font-size: 14px;
  }

  .bets-confirm {
    width: 100%;
    display: -webkit-box;
    -webkit-box-pack: center;
    margin-top: 38px;
  }

  .bets-confirm>div {
    background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
    border-radius: 4px;
    display: -webkit-box;
    -webkit-box-pack: center;
    overflow: hidden;
    cursor: pointer;
  }

  .bets-confirm>div.disabled {
    background: #BBBBBB;
    cursor: not-allowed;
  }

  .bets-confirm>div.disabled .bets-confirm-btn {
    color: #191919;
  }

  .bets-confirm>div.disabled .bets-confirm-countDown {
    color: #191919;
  }

  .bets-confirm-btn {
    border: none;
    outline: none;
    width: 121px;
    height: 60px;
    background: none;
    border: none; // background: rgba(166, 91, 6, 1);
    // box-shadow: 4px 6px 9px rgba(103, 66, 2, 0.25);
    color: #fff;
    font-size: 20px;
    font-weight: bold; // cursor: pointer;
    cursor: inherit;
  } // .bets-confirm button.disabled {
  //   background: #BBBBBB;
  //   color: #333;
  //   cursor: not-allowed;
  // }
  .bets-confirm-countDown {
    width: 96px;
    height: 60px; // background: rgba(166, 91, 6, 1);
    // background:#BBBBBB;
    // background: rgba(255, 247, 240, 1);
    // box-shadow: 4px 6px 9px rgba(103, 66, 2, 0.25);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    border-left: 1px solid #ddd;
    color: #fff;
    font-size: 14px;
  }

  .bets-confirm-countDown span {
    display: block;
  }

  .my-split-line {
    width: 100%;
    height: 1px;
    background: #DDDDDD;
    margin-top: 30px;
    border: none;
  }

  .my-bets-table {
    width: 100%; // margin-top:20px;
    position: relative;
    margin-top: 55px;
    /* min-height:146px; */
    border: 1px solid #DDDDDD;
  }

  .my-bets-table-tip {
    width: 984px;
    height: 36px;
    position: absolute;
    left: -1px;
    top: -36px;
    display: -webkit-box;
    background: #dbdbdb;
    border: 1px solid #DDDDDD;
    border-bottom: none; // border-top: 1px solid #ACACAC;
    // border-left: 1px solid #ACACAC;
  }

  .my-bets-table-tip span {
    display: block;
    width: 160px;
    height: 36px;
    line-height: 36px;
    text-align: center; // border-right: 1px solid #ACACAC;
    // border-bottom: 1px solid #ACACAC;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }

  .my-bets-table-tip span.checked {
    border-top: 4px solid #BD8454;
    background: #fff;
    border-bottom: none;
    color: #BD8454;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
  }

  .my-bets-table thead th {
    padding: 20px 0 10px 0;
    font-weight: normal;
    span {
      display: inline-block;
      width: 100%;
      height: 20px;
      line-height: 20px;
      border-right: 1px solid #C9C9C9;
      font-weight: bold;
      font-size: 12px;
      color: #191919;
    }
    &:last-child {
      span {
        border-right: none;
      }
    }
  }

  .my-bets-table tbody th {
    padding: 10px 0;
    font-weight: normal;
  }

  .my-bets-table table th div {
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .my-bets-table-wrap {
    max-height: 306px;
    overflow-y: auto;
    background: #fff;
  }

  .my-bets-table tbody tr {
    border-top: 1px solid #DDDDDD;
    &:first-child {
      border-top: none;
    }
  }

  .my-bets-table tbody tr th.zhongjiang {
    color: red;
  }

  .my-bets-table tbody tr th.zhongjiangMoney {
    font-size: 18px;
    color: #D4914D;
  }

  .my-bets-table .bets-detail-btn a {
    color: #D4914D;
    text-decoration: underline;
    cursor: pointer;
  }

  .youxijilu a {
    color: #dda771;
    cursor: pointer;
    text-decoration: none;
  }

  .zhudanxiangqi a {
    color: #fff;
    cursor: pointer;
    text-decoration: none;
  }
</style>