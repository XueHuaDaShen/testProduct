<template>
  <!-- <div style="height:810px;"> -->
  <div>
    <div class="lhc-top">
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
              <countDown :issueNo="Number(issue)" @sendTime="handlesendTime" :gameid="gameid"></countDown>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="header-right-l">
            <div class="history-issue" v-if="issueArr.toString()!==''">第
              <span style="color:#c83a4c;">{{issueArr[0].issue_no}}</span> 期</div>
            <div class="history-lottery-number" v-if="issueArr.toString()!==''">
              <div v-for="(k, i) in issueArr[0].luck_no.split(',')" :key="i.toString()">
                <span class="animated" :class="setLotteryNumClass(k, i)">{{k}}</span>
                {{i==6?'=':'+'}}
                <em class="animalText">{{setAnimalTextFn(k)}}</em>
              </div>
              <strong>{{issueArr[0].luck_no.split(',').reduce((p, c)=>{return Number(p)+Number(c)})}}</strong>
            </div>
          </div>
          <div class="explain">
            <span>
              <em class="explain-btn-bj"></em>
              <router-link :to="{name:'cpwf',query:{s_p:'lhc'}}" target="_blank">玩法说明</router-link>
            </span>
            <span>
              <em class="explain-btn-bj"></em>
              <router-link :to="{name:'dataCharts',query:{gameid:gameid}}" target="_blank">走势图</router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="lhc-wrap">
      <div class="lhc-nav">
        <span :class="item.checked?'curr':''" @click="initNav(item)" v-for="(item, index) in lhcNav" :key="index">{{item.title}}</span>
      </div>
      <div class="game-area">
        <div class="left" :class="betsTitle.indexOf('不中')>-1?'buzhong':''">
          <div class="left-content">
            <ul class="panel" v-if="betsTitle.indexOf('正码')>-1">
              <li :class="item.checked?'curr':''" @click="initzmtitle(item, index)" v-for="(item, index) in zmTitle" :key="index">{{item.title}}</li>
            </ul>
            <ul class="panel" v-if="betsTitle.indexOf('不中')>-1">
              <li :class="item.checked?'curr':''" @click="initbztitle(item, index)" v-for="(item, index) in bzTitle" :key="index">{{item.title}}</li>
            </ul>
            <ul class="panel" v-if="betsTitle.indexOf('肖')>-1">
              <li :class="item.checked?'curr':''" @click="initsxtitle(item, index)" v-for="(item, index) in sxTitle" :key="index">{{item.title}}</li>
            </ul>
            <div class="tz-ruler">
              {{betsRuler}}
              <div class="refund-btn">
                <span @click="handleChangeTeMa('A')" @mouseover="handleShowRefund('A')" @mouseout="handleHideRefund('A')" :class="isTeA?'curr':''">{{reT1}}</span>
                <span @click="handleChangeTeMa('B')" @mouseover="handleShowRefund('B')" @mouseout="handleHideRefund('B')" :class="isTeB?'curr':''">{{reT2}}</span>
                <div class="refund-tag" style="animation-duration: .5s;" v-show="showRefundTag" :class="refundTagAnimated?'animated zoomIn':''">{{refundTag}}</div>
              </div>
            </div>
            <div class="tz-area">
              <div class="tz-area-wrap" v-if="betsTitle==='特码'||betsTitle.indexOf('正码')>-1">
                <div class="tz-title">
                  <ul class="tmzm">
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content">
                  <ul class="tmzm">
                    <li class="animated" :class="item.checked?(item.animated?'curr pulse':'curr'):''" v-for="(item, index) in allBalls" :key="index">
                      <b class="balls-num" :class="setBallsClass(item)">{{item.num}}</b>
                      <em class="bs">x
                        <span class="animated" :class="animatedMoney?'jello':''">{{item.multiple = betsMultiple}}</span>
                      </em>
                      <input type="text" @blur="handleLeaveSingleInput(item)" @input="handleInputSingleMoney(item, $event)" :value="item.money" class="money">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tz-area-wrap" v-if="betsTitle==='半波'">
                <div class="tz-title">
                  <ul class="bbws">
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content">
                  <ul class="bbws">
                    <li class="animated" :class="item.checked?(item.animated?'curr pulse':'curr'):''" v-for="(item, index) in bbArr" :key="index">
                      <h5>{{item.title}}</h5>
                      <em class="bs">x
                        <span class="animated" :class="animatedMoney?'jello':''">{{item.multiple}}</span>
                      </em>
                      <div>
                        <b class="balls-num" v-for="(k, i) in item.data" :key="i.toString()" :class="setBallsClass(k)">{{k.num}}</b>
                      </div>
                      <input type="text" @blur="handleLeaveSingleInput(item)" @input="handleInputSingleMoney(item, $event)" :value="item.money" class="money">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tz-area-wrap" v-if="betsTitle.indexOf('肖') > -1">
                <div class="tz-title">
                  <ul class="bbws">
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content" v-if="betsTitle==='六肖'">
                  <ul class="sx-list">
                    <li class="animated" v-for="(item, index) in use_animal" :key="index" :class="item.checked?(item.animated?'curr pulse':'curr'):''">
                      <h5 class="animal-icon-par">
                        <i class="animal-icon" :class="item.style"></i>
                        <em>{{item.name}}</em>
                      </h5>
                      <div>
                        <b class="balls-num" v-for="(k, i) in item.number" :key="i.toString()" :class="setBallsClass(k)">{{k.num}}</b>
                      </div>
                      <span class="animated" style="animation-duration: .3s" :class="item.checked?(item.animated?'checked zoomIn':'checked'):''" @click="handleCheckBZNumber(item)"></span>
                    </li>
                  </ul>
                  <div style="width:100%;display:-webkit-box;-webkit-box-pack:end;padding:20px;color:#777;font-size:14px;">
                    <h5>赔率</h5>
                    <span class="animated" :class="animatedMoney?'jello':''" style="margin-left:5px;display:inline-block">x{{defaultMoney4=sxRatio}}</span>
                  </div>
                  <div v-if="betsTitle.indexOf('不中')>-1||betsTitle.indexOf('六肖')>-1" class="buzhong-money-input">
                    <span class="tex">金额/注（元）：</span>
                    <input type="text" v-model.trim="money" @blur="handleLeaveAllInput" @input="handleInputAllMoney" class="money">
                  </div>
                </div>
                <div class="tz-content" v-if="betsTitle!=='六肖'">
                  <ul class="bbws">
                    <li class="animated bbws-ws" :class="item.checked?(item.animated?'curr pulse':'curr'):''" v-for="(item, index) in use_animal" :key="index">
                      <h5 class="animal-icon-par">
                        <i class="animal-icon" :class="item.style"></i>
                        <em>{{item.name}}</em>
                      </h5>
                      <em class="bs" style="min-width:50px">x
                        <span class="animated" :class="animatedMoney?'jello':''">{{item.multiple}}</span>
                      </em>
                      <div>
                        <b class="balls-num" v-for="(k, i) in item.number" :key="i.toString()" :class="setBallsClass(k)">{{k.num}}</b>
                      </div>
                      <input type="text" @blur="handleLeaveSingleInput(item)" @input="handleInputSingleMoney(item, $event)" :value="item.money" class="money">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tz-area-wrap" v-if="betsTitle==='尾数'">
                <div class="tz-title">
                  <ul class="bbws">
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content">
                  <ul class="bbws">
                    <li class="animated bbws-ws" :class="item.checked?(item.animated?'curr pulse':'curr'):''" v-for="(item, index) in wsArr" :key="index">
                      <h5>{{item.title}}</h5>
                      <em class="bs">x
                        <span class="animated" :class="animatedMoney?'jello':''">{{item.multiple = betsMultiple}}</span>
                      </em>
                      <div>
                        <b class="balls-num" v-for="(k, i) in item.data" :key="i.toString()" :class="setBallsClass(k)">{{k.num}}</b>
                      </div>
                      <input type="text" @blur="handleLeaveSingleInput(item)" @input="handleInputSingleMoney(item, $event)" :value="item.money" class="money">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tz-area-wrap" v-if="betsTitle==='总分'">
                <div class="tz-title">
                  <ul class="bbws">
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span class="num">号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content">
                  <ul class="zf">
                    <li class="animated" :class="item.checked?(item.animated?'curr pulse':'curr'):''" v-for="(item, index) in zfArr" :key="index">
                      <h5>{{item.title}}</h5>
                      <em class="bs">x
                        <span class="animated" :class="animatedMoney?'jello':''">{{item.multiple = betsMultiple}}</span>
                      </em>
                      <div>{{item.ruler}}</div>
                      <input type="text" @blur="handleLeaveSingleInput(item)" @input="handleInputSingleMoney(item, $event)" :value="item.money" class="money">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tz-area-wrap" v-if="betsTitle.indexOf('不中')>-1">
                <div class="tz-title">
                  <ul class="bz-list">
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                    <li>
                      <span>号码</span>
                      <span>金额</span>
                    </li>
                  </ul>
                </div>
                <div class="tz-content">
                  <ul class="bz-list">
                    <li v-for="(item, index) in bzArr" :key="index">
                      <b class="balls-num" :class="setBallsClass(item)">{{item.num}}</b>
                      <span class="animated" style="animation-duration: .5s;" :class="item.checked?(item.animated?'checked zoomIn':'checked'):''" @click="handleCheckBZNumber(item)"></span>
                    </li>
                  </ul>
                  <div style="width:100%;display:-webkit-box;-webkit-box-pack:end;padding:20px;color:#777;font-size:14px;">
                    <h5>赔率</h5>
                    <span style="margin-left:5px;">x{{defaultMoney4=betsMultiple}}</span>
                  </div>
                  <div v-if="betsTitle.indexOf('不中')>-1||betsTitle.indexOf('六肖')>-1" class="buzhong-money-input">
                    <span class="tex">金额/注（元）：</span>
                    <input type="text" v-model.trim="money" @blur="handleLeaveAllInput" @input="handleInputAllMoney" class="money">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right" v-if="betsTitle.indexOf('不中')<0">
          <div class="r-top" v-if="betsTitle!=='总分'&&betsTitle!=='六肖'">
            <div class="srje">
              金额（元）：
              <input type="text" v-model.trim="money" @blur="handleLeaveAllInput" @input="handleInputAllMoney" class="money">
            </div>
            <div class="czan">
              <button class="ljxz" @click="gotoBets">立即下注</button>
              <button class="reset" @click="handleResetAllBalls">重置</button>
            </div>
          </div>
          <div class="r-bot" v-if="betsTitle!=='总分'">
            <div v-if="betsTitle==='特码'||betsTitle.indexOf('正码')>-1">
              <div class="radio-area" @click="handleChangeRadio($event)">
                <el-radio-group v-model="radioBtn">
                  <div class="radio-red">
                    <el-radio style="color: #ED361E;" :label="'红大'">红大</el-radio>
                    <el-radio style="color: #ED361E;" :label="'红小'">红小</el-radio>
                  </div>
                  <div class="radio-red">
                    <el-radio style="color: #ED361E;" :label="'红单'">红单</el-radio>
                    <el-radio style="color: #ED361E;" :label="'红双'">红双</el-radio>
                  </div>
                  <div class="radio-red">
                    <el-radio style="color: #ED361E;" :label="'红合单'">红合单</el-radio>
                    <el-radio style="color: #ED361E;" :label="'红合双'">红合双</el-radio>
                  </div>
                  <div class="radio-green">
                    <el-radio style="color: #039A8E;" :label="'绿大'">绿大</el-radio>
                    <el-radio style="color: #039A8E;" :label="'绿小'">绿小</el-radio>
                  </div>
                  <div class="radio-green">
                    <el-radio style="color: #039A8E;" :label="'绿单'">绿单</el-radio>
                    <el-radio style="color: #039A8E;" :label="'绿双'">绿双</el-radio>
                  </div>
                  <div class="radio-green">
                    <el-radio style="color: #039A8E;" :label="'绿合单'">绿合单</el-radio>
                    <el-radio style="color: #039A8E;" :label="'绿合双'">绿合双</el-radio>
                  </div>
                  <div class="radio-blue">
                    <el-radio style="color: #3357D7;" :label="'蓝大'">蓝大</el-radio>
                    <el-radio style="color: #3357D7;" :label="'蓝小'">蓝小</el-radio>
                  </div>
                  <div class="radio-blue">
                    <el-radio style="color: #3357D7;" v-model="radioBtn" label="蓝单">蓝单</el-radio>
                    <el-radio style="color: #3357D7;" v-model="radioBtn" label="蓝双">蓝双</el-radio>
                  </div>
                  <div class="radio-blue">
                    <el-radio style="color: #3357D7;" v-model="radioBtn" label="蓝合单">蓝合单</el-radio>
                    <el-radio style="color: #3357D7;" v-model="radioBtn" label="蓝合双">蓝合双</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </div>
            <div v-if="betsTitle==='特码'||betsTitle.indexOf('正码')>-1" class="animal-area" @click="handleChangeAnimal">
              <span :class="item.checked?'curr':''" v-for="(item, index) in animalsArr" :key="index">{{item.name}}</span>
            </div>
            <div v-if="betsTitle==='半波'">
              <div class="radio-area" @click="handleChangeBBRadio($event)">
                <el-radio-group v-model="radioBtn2">
                  <div class="bbws">
                    <div class="radio-red">
                      <el-radio style="color: #ED361E;" :label="'红波'">红波</el-radio>
                    </div>
                    <div class="radio-green">
                      <el-radio style="color: #039A8E;" :label="'绿波'">绿波</el-radio>
                    </div>
                  </div>
                  <div class="radio-blue">
                    <div class="radio-blue">
                      <el-radio style="color: #3357D7;" :label="'蓝波'">蓝波</el-radio>
                    </div>
                  </div>
                </el-radio-group>
              </div>
            </div>
            <div v-if="betsTitle==='半波'" class="animal-area" @click="handleChangeType">
              <span v-if="index<6" :class="index>3?(item.checked?'curr width50':'width50'):(item.checked?'curr':'')" v-for="(item, index) in typeArr" :key="index">{{item.name}}</span>
            </div>
            <div v-if="betsTitle==='尾数'">
              <div class="radio-area" @click="handleChangeWSRadio($event)">
                <el-radio-group v-model="radioBtn2">
                  <div class="bbws">
                    <div>
                      <el-radio style="color:#939DB8" :label="'大'">大</el-radio>
                    </div>
                    <div>
                      <el-radio :label="'小'">小</el-radio>
                    </div>
                  </div>
                  <div class="bbws">
                    <div>
                      <el-radio style="color:#939DB8" :label="'单'">单</el-radio>
                    </div>
                    <div>
                      <el-radio style="color:#939DB8" :label="'双'">双</el-radio>
                    </div>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="r-bot" v-if="betsTitle.indexOf('肖')>-1">
            <div>
              <div class="radio-area" @click="handleChangeAnimalArr($event)">
                <el-radio-group v-model="radioBtn2">
                  <div class="radio-red">
                    <el-radio style="color:#ED361E" :label="'大肖'">大肖</el-radio>
                    <el-radio style="color:#ED361E" :label="'小肖'">小肖</el-radio>
                  </div>
                  <div class="radio-red" v-if="betsTitle.indexOf('肖')>-1 && betsTitle!=='六肖'">
                    <el-radio style="color:#ED361E" :label="'男肖'">男肖</el-radio>
                    <el-radio style="color:#ED361E" :label="'女肖'">女肖</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </div>
            <div v-if="betsTitle.indexOf('肖')>-1" class="animal-area animalType" @click="handleCheckedAnimalType">
              <span v-for="(item, index) in animalType" :key="index" :class="item.checked?'curr':''">{{item.title}}</span>
            </div>
            <div v-if="betsTitle.indexOf('肖')>-1 && betsTitle!=='六肖'" class="animal-area wuxing" @click="handleCheckedWuxing">
              <span :data-name="item.title" v-for="(item, index) in wuxing" :key="index" :class="item.checked?'curr':''">{{item.title+item.animal}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="czan">
        <button class="ljxz" @click="gotoBets">立即投注</button>
        <i class="el-icon-refresh" @click="handleResetAllBalls" style="margin-left:20px;margin-right:5px;display:block;font-size:24px;color:#777;cursor:pointer"></i>
        <span class="reset" @click="handleResetAllBalls">重置</span>
      </div>
      <hr class="my-split-line">
      <!-- <div class="table-area">
        <ul class="table-nav">
          <li class="yx">游戏</li>
          <li class="wf">玩法</li>
          <li class="qh">期号</li>
          <li class="kj">开奖号</li>
          <li class="nr">投注内容</li>
          <li class="je">投注金额</li>
          <li class="jj">奖金</li>
          <li class="fd">返点</li>
          <li class="zt">状态</li>
          <li class="cz">操作</li>
        </ul>
      </div> -->
      <div class="table-area">
        <!-- <div class="table-title"><span>我的投注</span></div> -->
        <div class="my-bets-table-wrap">
          <table style="width:100%">
            <thead>
              <tr>
                <th>
                  <div class="youxi">游戏</div>
                </th>
                <th>
                  <div class="wanfa">玩法</div>
                </th>
                <th>
                  <div class="qihao">期号</div>
                </th>
                <th>
                  <div class="kaijiang">开奖号</div>
                </th>
                <th>
                  <div class="neirong">投注内容</div>
                </th>
                <th>
                  <div class="jine">投注金额</div>
                </th>
                <th>
                  <div class="jiangjin">奖金</div>
                </th>
                <th>
                  <div class="fandian">奖金-返点</div>
                </th>
                <th>
                  <div class="zhuangtai">状态</div>
                </th>
                <th>
                  <div class="caozuo">操作</div>
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
                <th>{{Number(item.vote_cash||0).toFixed(2)}}</th>
                <th>{{Number(item.award_cash||0).toFixed(2)}}</th>
                <th>{{item.refund}}</th>
                <th>{{voteStatus(item.status)}}</th>
                <th class="bets-detail-btn">
                  <router-link target="_blank" :to="{path:'/project/lotteryRecord',query:{id:item._id}}">
                    详情
                  </router-link>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
  import request from '../../axios/axios.js'
  import lottery from '../../../static/lottery';
  import countDown from '../../bets/countDown';
  import { getVoteStatus } from '../../common/filterStatus.js';
  import { getChaseStatus } from '../../common/filterStatus.js';
  import paramCryptFn from '../../lib/cryptData.js'
  const localReg = /(^[0\.\W]+)|([\.\W]+)/g;
  export default {
    name: 'liuhecai',
    props: {
      showRight: {
        type: Boolean,
        default: true
      }
    },
    components: {
      countDown
    },
    data() {
      return {
        bg: 'lhc', // 设置body 背景色
        colorRed: '#BD3840',
        colorBlue: '#3357D7',
        colorGreen: '#0F9075',
        activityBegin: false,
        logoImgCode: '',
        getIssueTime: 10,
        myInterval: null,
        gameid: '', // 玩法id
        lottery3id: '', // 标题id
        lotteryid: '', // 投注id
        issue: '',
        issueArr: [],
        refreshIssue: false,
        newIssue: '',
        maxRefund: 2000,
        minRefund: 1800,
        defaultRefund: 0,
        probability: 0, //倍率
        refund: '',
        refundText: '',
        refundTag: '', // 返点数
        reT1: '特A', // 返点数的 文本
        reT2: '特B',
        isTeA: true, // 文本样式
        isTeB: false,
        showRefundTag: false, // 是否显示 返回点数
        refundTagAnimated: false, // 返回点数动画
        betsRuler: '', // 投注规则
        betsMultiple: '',
        defaultMoney1: 47.77, // 每一注的钱
        defaultMoney2: 43.1,
        defaultMoney3: 8.24,
        defaultMoney4: 2.18,
        animatedMoney: false, // 钱的动画
        betsTitle: '特码', // 投注标题
        money: '', // 总输入框的 money
        radioBtn: '', // 单选按钮的值
        radioBtn2: '', // 单选按钮的值
        betsDataList: [],
        betsSuccessId: '',
        betsSuccess: false,
        allBalls: [], // 所有 数字集合
        bbArr: [],
        wsArr: [],
        zfArr: [
          { title: '大', ruler: '总分大于等于175的，即视为中奖。', multiple: '1.95', money: '' },
          { title: '小', ruler: '总分小于等于175的，即视为中奖。', multiple: '1.95', money: '' },
          { title: '单', ruler: '总分是单数的，即视为中奖。', multiple: '1.95', money: '' },
          { title: '双', ruler: '总分是双数的，即视为中奖。', multiple: '1.95', money: '' },
          { title: '大单', ruler: '总分大于等于175且为单数的，即视为中奖。', multiple: '3.90', money: '' },
          { title: '大双', ruler: '总分大于等于175且为双数的，即视为中奖。', multiple: '3.90', money: '' },
          { title: '小单', ruler: '总分小于等于175且为单数的，即视为中奖。', multiple: '3.90', money: '' },
          { title: '小双', ruler: '总分小于等于175且为双数的，即视为中奖。', multiple: '3.90', money: '' }
        ],
        bzArr: [],
        checkLen: 5, // 不中 状态下，需要选择几个号码
        redBalls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'], // 红数字
        greenBalls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'], // 绿数字
        blueBalls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'], // 蓝数字
        lhcNav: [],
        currItem: null, // 当前标题的 对象
        c_lhcNav: [
          { title: '特码', checked: false, ruler: '当期开出的最后一位号码为特码。当开出特码与投注号码一致、即视为中奖（其余情况则视为不中奖）。' },
          { title: '正码', checked: false, ruler: '当期开出之前6个号码叫正码。第一号为正码1，依次叫正码2、正码3……正码6，不以大小排序。当开出正码1与投注号码一致、即视为中奖（其余情况则视为不中奖）。' },
          { title: '半波', checked: false, ruler: '以特码色波和特码单双大小为一个投注组合。当开出的特码出现在其投注组合中，即视为中奖（其余情况则视为不中奖）。若开出特码为49号时，所有投注半波任意一个组合接会被视为和局，并返回全部本金（不派发返点）。' },
          { title: '生肖', checked: false, ruler: '以特码和生肖为一个投注组合。当开出的特码出现在其投注组合中，即视为中奖（其余情况视为不中奖）。' },
          { title: '尾数', checked: false, ruler: '指7个开奖号码中含有所属尾数的一个或多个号码，不论同尾数的号码出现一个或多个，派彩只派一次。' },
          { title: '总分', checked: false, ruler: '所有7个开奖号码的数值总和叫做总分。' },
          { title: '不中', checked: false, ruler: '所投注的每五个号码为一注，每注的五个号码中如果没有当期开奖的所有7个号码中的任意一个，则视为中奖；否则视为不中奖。例如开奖号码是：6,7,8,9,10,11,12，若你投的是1,2,3,4,5则中奖，而投1,2,3,4,6则不中奖。' }
        ],
        zmTitle: [
          { title: '正码1', checked: false },
          { title: '正码2', checked: false },
          { title: '正码3', checked: false },
          { title: '正码4', checked: false },
          { title: '正码5', checked: false },
          { title: '正码6', checked: false }
        ],
        bzTitle: [
          { title: '五不中', checked: false, len: 5 },
          { title: '六不中', checked: false, len: 6 },
          { title: '七不中', checked: false, len: 7 },
          { title: '八不中', checked: false, len: 8 },
          { title: '九不中', checked: false, len: 9 },
          { title: '十不中', checked: false, len: 10 }
        ],
        sxTitle: [
          { title: '特肖', checked: false },
          { title: '一肖', checked: false },
          { title: '六肖', checked: false }
        ],
        sxIndex: 0,
        sxRatio: 0,
        animal: [],
        c_animal: ["鼠", "马", "牛", "羊", "虎", "猴", "兔", "鸡", "龙", "狗", "蛇", "猪"],
        use_animal: [],
        animalsArr: [
          { name: "大", checked: false },
          { name: "小", checked: false },
          { name: "单", checked: false },
          { name: "双", checked: false },
          { name: "鼠", checked: false },
          { name: "牛", checked: false },
          { name: "虎", checked: false },
          { name: "兔", checked: false },
          { name: "龙", checked: false },
          { name: "蛇", checked: false },
          { name: "马", checked: false },
          { name: "羊", checked: false },
          { name: "猴", checked: false },
          { name: "鸡", checked: false },
          { name: "狗", checked: false },
          { name: "猪", checked: false }
        ],
        typeArr: [
          { name: "大", checked: false },
          { name: "小", checked: false },
          { name: "单", checked: false },
          { name: "双", checked: false },
          { name: "合单", checked: false },
          { name: "合双", checked: false }
        ],
        animalType: [
          { title: '吉美生肖', checked: false },
          { title: '凶丑生肖', checked: false },
          { title: '野外六兽', checked: false },
          { title: '家内六禽', checked: false },
          { title: '阴性生肖', checked: false },
          { title: '阳性生肖', checked: false },
        ],
        wuxing: [
          { title: '五行属金', animal: '：猴 鸡', checked: false },
          { title: '五行属木', animal: '：虎 兔', checked: false },
          { title: '五行属水', animal: '：鼠 猪', checked: false },
          { title: '五行属火', animal: '：蛇 马', checked: false },
          { title: '五行属土', animal: '：牛龙羊狗', checked: false },
        ]
      }
    },
    beforeDestroy() {
      // console.log('beforeDestroy')
    },
    destroyed() {
      const vm = this;
      clearInterval(vm.myInterval)
      // console.log('Destroy')
    },
    created() {
      const vm = this;
      this.gameid = this.$route.query.id;
      this.logoImgCode = '/static/logo/' + this.$route.query.s_code + '.png';
      this.refund = Number(localStorage.getItem('refund'));
      // this.refund = 1950;
      this.refundText = this.refund + '-0%';
      this.defaultRefund = this.refund / this.maxRefund;
      this.newIssueInterval();
      this.getLotteryDetailList();
      localStorage.setItem('bodyBG', vm.bg);
      vm.$store.dispatch('setbodyBG', vm.bg);
      vm.getAnimalList();
      vm.getBetsDataList();
      //设置 所有的 数字 集合
      // vm.setAllnumbersDataFn()
    },
    methods: {
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
      setLotteryNumClass(k, i) {
        let c = '';
        let c1 = '';
        let ri = this.redBalls.indexOf(k);
        let gi = this.greenBalls.indexOf(k);
        let bi = this.blueBalls.indexOf(k);
        if (i < 6) {
          if (ri > -1) {
            c = 'red';
          } else if (gi > -1) {
            c = 'green';
          } else if (bi > -1) {
            c = 'blue'
          }
        } else if (i == 6) {
          if (ri > -1) {
            c = 'red-fullColor';
          } else if (gi > -1) {
            c = 'green-fullColor';
          } else if (bi > -1) {
            c = 'blue-fullColor'
          }
        }
        if (this.refreshIssue) {
          c1 = 'flip'
        } else {
          c1 = '';
        }
        return c + ' ' + c1;
      },
      setAnimalTextFn(k) {
        let text = '';
        this.allBalls.filter(v => {
          if (Number(k) === Number(v.num)) {
            text = v.name;
          }
        })
        return text;
      },
      // 获取玩法列表
      getLotteryDetailList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/game/detail', { gameid: vm.gameid },
          (success) => {
            // console.log('gameList-----',success);
            let code = success.returncode;
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
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
        vm.lhcNav = [];
        data.filter((v, vi) => {
          vm.filterLotteryList(v, v.children, vi);
        })
        // this.loaded = false;
        // this.betsMode = this.fiveStar;
        // this.handleChangeNav(this.navData[0])
        vm.initNav(vm.lhcNav[0]);
      },
      filterLotteryList(v, arr, index) {
        const vm = this;
        // lottery3id 标题id
        // lotteryid 投注id
        let o = { title: v.name, checked: false, ruler: vm.c_lhcNav[index].ruler, lottery3id: v._id, lotteryMode: [] };
        // vm.lhcNav.push(o);
        arr.filter((k, ki) => {
          o.lotteryMode = k; // lotteryid
          vm.lhcNav.push(o);
          // k.children.filter((m, mi) => {
          //   data[ki].data[mi].play = m.note1; // 玩法
          //   data[ki].data[mi].plan = m.note2; // 方案
          //   data[ki].data[mi].prize = m.prize||0; // 奖金
          //   data[ki].data[mi].probability = m.probability; // 赔率
          //   o.lotteryid = m._id; // lotteryid
          // })
        })
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
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
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
      // 获取倒计时
      handlesendTime(val) {
        this.countDownTime2 = val.split(':');
      },
      setAllnumbersDataFn() {
        const vm = this;
        let arr = [];
        for (let i = 1; i < 50; i++) {
          let o = new Object();
          if (i < 10) {
            o.num = '0' + i;
          } else {
            o.num = i.toString();
          }
          let name;
          vm.animal.filter(v => {
            let n = v.number.split(',').indexOf(o.num);
            if (n > -1) {
              name = v.name
            }
          })
          let t1;
          vm.redBalls.filter(v => {
            let n = v.indexOf(o.num);
            if (n > -1) {
              t1 = '红'
            }
          })
          let t2;
          vm.greenBalls.filter(v => {
            let n = v.indexOf(o.num);
            if (n > -1) {
              t2 = '绿'
            }
          })
          let t3;
          vm.blueBalls.filter(v => {
            let n = v.indexOf(o.num);
            if (n > -1) {
              t3 = '蓝'
            }
          })
          o.checked = false;
          o.animated = false;
          o.name = name;
          o.color = t1 || t2 || t3;
          o.money = '';
          o.multiple = vm.betsMultiple;
          arr.push(o)
        }
        // 设置投注的 数字 对象
        for (var i = 1; i < 11; i++) {
          vm.filterBallsArr(arr, i)
        }
        // vm.bbNumbersArr();
        vm.wsNumbersArr();
        vm.bzNumbersArr();
        // vm.animalNumberArr();
      },
      // 初始化 标题导航
      initNav(item) {
        this.lhcNav.filter(v => {
          v.checked = false;
        })
        // console.log(item)
        this.lottery3id = item.lottery3id;
        this.lotteryid = item.lotteryMode.children[0]._id;
        this.probability = item.lotteryMode.children[0].probability;
        this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
        // console.log(this.probability)
        // console.log(this.betsMultiple)
        item.checked = true;
        this.betsTitle = item.title;
        this.betsRuler = item.ruler;
        this.currItem = item;
        if (item.title === '特码') {
          this.reT1 = '特A'
          this.reT2 = '特B'
        } else {
          this.reT1 = 'A面'
          this.reT2 = 'B面'
        }
        if (item.title === '正码') {
          this.initzmtitle(this.zmTitle[0], 0)
        }
        if (item.title === '不中') {
          this.initbztitle(this.bzTitle[0], 0)
        }
        if (item.title === '生肖') {
          this.initsxtitle(this.sxTitle[0], 0);
        }
        if (item.title === '半波') {
          this.bbNumbersArr();
        }
        // 重置 数据
        this.handleResetAllBalls()
      },
      // 初始化 正码导航
      initzmtitle(item, index) {
        const vm = this;
        this.zmTitle.filter(v => {
          v.checked = false;
        })
        this.lotteryid = vm.lhcNav[1].lotteryMode.children[index]._id;
        this.probability = vm.lhcNav[1].lotteryMode.children[index].probability;
        this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
        item.checked = true;
        this.betsTitle = item.title;
        // 重置 数据
        this.handleResetAllBalls()
      },
      // 初始化 生肖导航
      initsxtitle(item, index) {
        const vm = this;
        this.sxTitle.filter(v => {
          v.checked = false;
        })
        this.lotteryid = vm.lhcNav[3].lotteryMode.children[index]._id;
        this.probability = vm.lhcNav[3].lotteryMode.children[index].probability;
        this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
        item.checked = true;
        this.checkLen = 6;
        this.betsTitle = item.title;
        this.sxIndex = index;
        this.animalNumberArr();
        // 重置 数据
        this.handleResetAllBalls()
      },
      // 初始化 不中导航
      initbztitle(item, index) {
        const vm = this;
        this.bzTitle.filter(v => {
          v.checked = false;
        })
        this.lotteryid = vm.lhcNav[6].lotteryMode.children[index]._id;
        this.probability = vm.lhcNav[6].lotteryMode.children[index].probability;
        this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
        item.checked = true;
        this.betsTitle = item.title;
        this.checkLen = item.len;
        // 重置 数据
        this.handleResetAllBalls()
      },
      // 切换 返回点数
      handleChangeTeMa(word) {
        const vm = this;
        if (word === 'A') {
          this.defaultRefund = this.refund / this.maxRefund;
          this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
          this.isTeA = true
          this.isTeB = false
          this.refundText = this.refund + '-0%';
        } else if (word === 'B') {
          this.defaultRefund = this.minRefund / this.maxRefund;
          this.betsMultiple = (this.defaultRefund * this.probability).toFixed(2);
          this.isTeA = false
          this.isTeB = true
          this.refundText = this.minRefund + '-' + (this.refund - this.minRefund) / this.maxRefund * 100 + '%'
          // this.refundText = this.minRefund + '-'+this.defaultRefund*100+'%';
        }
        this.animatedMoney = true;
        setTimeout(() => {
          vm.animatedMoney = false;
        }, 600);
        if (this.betsTitle.indexOf('肖') > -1) {
          vm.animalNumberArr();
        } else if (this.betsTitle === '半波') {
          vm.bbNumbersArr();
        }

      },
      // 返回点数的 移入移出
      handleShowRefund(word) {
        const vm = this;
        let r = vm.refund;
        if (word === 'A') {
          this.refundTag = r + '---0%'
        } else if (word === 'B') {
          this.refundTag = this.minRefund + '---' + (this.refund - this.minRefund) / this.maxRefund * 100 + '%'
        }
        setTimeout(() => {
          vm.refundTagAnimated = true;
          vm.showRefundTag = true;
        }, 1);
      },
      handleHideRefund(word) {
        this.refundTagAnimated = false;
        this.showRefundTag = false;
      },

      // 设置投注的 数字 对象
      filterBallsArr(balls, i) {
        const vm = this;
        balls.filter(v => {
          let n = Number(v.num.split('')[1]);
          if (i < 10) {
            if (n === i) {
              vm.allBalls.push(v)
            }
          } else {
            if (n === 0) {
              vm.allBalls.push(v)
            }
          }
        })
        // console.log(vm.allBalls)
      },
      // 设置数字的 样式
      setBallsClass(item) {
        let c
        if (this.redBalls.indexOf(item.num) > -1) {
          c = 'red'
        } else if (this.greenBalls.indexOf(item.num) > -1) {
          c = 'green'
        } else if (this.blueBalls.indexOf(item.num) > -1) {
          c = 'blue'
        } else {
          c = ''
        }
        return c;
      },
      // 获取生肖
      getAnimalList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/lhc/animal/list', {},
          (success) => {
            // console.log(success);
            let code = success.returncode;
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
              request.loginAgain(vm)
            } else if (code === 200) {
              vm.animal = success.data
              vm.setAllnumbersDataFn();
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      // 选择投注的 单选类型
      handleChangeRadio(e) {
        const vm = this;
        let val = e.target.defaultValue;
        if (val) {
          vm.animalsArr.filter(v => {
            v.checked = false;
          })
          vm.filterChecked(val, val.split('')[0])
        }
      },
      handleChangeAnimal(e) {
        const vm = this;
        let text = e.target.innerText;
        vm.radioBtn = '';
        vm.animalsArr.filter(v => {
          v.checked = false;
          v.name === text ? v.checked = true : '';
        })
        let n = Math.floor(vm.allBalls.length / 2);
        vm.allBalls.filter(v => {
          v.checked = false;
          v.money = '';
          if (text === '大') {
            if (Number(v.num) > n) {
              v.checked = true
              vm.setItemChecked(v);
            }
          } else if (text === '小') {
            if (Number(v.num) <= n) {
              v.checked = true
              vm.setItemChecked(v);
            }
          } else if (text === '单') {
            if (Number(v.num) % 2 === 1) {
              v.checked = true
              vm.setItemChecked(v);
            }
          } else if (text === '双') {
            if (Number(v.num) % 2 === 0) {
              v.checked = true
              vm.setItemChecked(v);
            }
          } else if (v.name === text) {
            v.checked = true
            vm.setItemChecked(v);
          }
        })
      },
      // 过滤
      filterChecked(val, t) {
        const vm = this;
        let n = Math.floor(vm.allBalls.length / 2);
        vm.allBalls.filter(v => {
          v.checked = false;
          v.money = '';
          if (val === t + '大') {
            if (v.color === t + '' && v.num > n) {
              vm.setItemChecked(v);
            }
          } else if (val === t + '小') {
            if (v.color === t + '' && !(v.num > n)) {
              vm.setItemChecked(v);
            }
          } else if (val === t + '单') {
            if (v.color === t + '' && Number(v.num) % 2 === 1) {
              vm.setItemChecked(v);
            }
          } else if (val === t + '双') {
            if (v.color === t + '' && Number(v.num) % 2 === 0) {
              vm.setItemChecked(v);
            }
          } else if (val === t + '合单') {
            if (v.color === t + '') {
              let numArr = v.num.split('');
              let num = Number(numArr[0]) + Number(numArr[1]);
              if (num % 2 === 1) {
                vm.setItemChecked(v);
              }
            }
          } else if (val === t + '合双') {
            if (v.color === t + '') {
              let numArr = v.num.split('');
              let num = Number(numArr[0]) + Number(numArr[1]);
              if (num % 2 === 0) {
                vm.setItemChecked(v);
              }
            }
          }
        })
      },
      // 设置
      setItemChecked(v) {
        v.checked = true;
        v.money = this.money;
        v.animated = true;
        setTimeout(() => {
          v.animated = false;
        }, 600)
      },

      // 投注钱数  总输入input
      handleInputAllMoney(e) {
        let money = this.money.replace(localReg, '');
        let arr = this.getCheckedArr1();
        if (!isNaN(money)) {
          arr.filter(v => {
            v.money = money;
          })
        } else {
          arr.filter(v => {
            v.money = '';
          })
        }
      },
      // 失焦 判断
      handleLeaveAllInput() {
        let money = this.money.replace(localReg, '');
        isNaN(money) ? this.money = '' : this.money = money;
      },
      // 投注钱数  单个input
      handleInputSingleMoney(item, e) {
        // console.log(item)
        item.money = e.target.value
      },
      // 失焦 判断
      handleLeaveSingleInput(item) {
        let money = item.money.replace(localReg, '');
        isNaN(money) ? item.money = '' : item.money = money;
      },


      // 半波 投注 操作 函数   开始--------------

      // 获取数字集合
      bbNumbersArr() {
        let extra = this.currItem.lotteryMode.children[0].extra;
        // let probability = {};
        // let c = '', t = '';
        // for(let i in extra){
        //   if(i.indexOf('hong') > -1){
        //     c = '红'
        //   }else if(i.indexOf('lv') > -1){
        //     c = '绿'
        //   }else if(i.indexOf('lan') > -1){
        //     c = '蓝'
        //   }
        //   if(i.indexOf('da') > -1 && i.indexOf('dan') < 0){
        //     t = '大'
        //   }else if(i.indexOf('dan') > -1 && i.indexOf('hedan') < 0){
        //     t = '单'
        //   }else if(i.indexOf('hedan') > -1){
        //     t = '合单'
        //   }else if(i.indexOf('xiao') > -1){
        //     t = '小'
        //   }else if(i.indexOf('shuang') > -1 && i.indexOf('heshuang') < 0){
        //     t = '双'
        //   }else if(i.indexOf('heshuang') > -1){
        //     t = '合双'
        //   }
        //   probability[c+t] = extra[i];
        // }
        // console.log(probability)
        const vm = this;
        let numsArr = [];
        let color = ['红', '绿', '蓝'];
        let type = ['大', '小', '单', '双', '合单', '合双'];
        let n = Math.floor(vm.allBalls.length / 2);
        color.filter(v => {
          type.filter(m => {
            let o = {
              title: v + m,
              money: '',
              data: []
            };

            vm.allBalls.filter(k => {
              if (v === k.color) {
                if (m === '大') {
                  if (k.num > n) o.data.push({ num: k.num })
                } else if (m === '小') {
                  if (!(k.num > n)) o.data.push({ num: k.num })
                } else if (m === '单') {
                  if (Number(k.num) % 2 === 1) o.data.push({ num: k.num })
                } else if (m === '双') {
                  if (Number(k.num) % 2 === 0) o.data.push({ num: k.num })
                } else if (m === '合单') {
                  let numArr = k.num.split('');
                  let num = Number(numArr[0]) + Number(numArr[1]);
                  if (num % 2 === 1) o.data.push({ num: k.num })
                } else if (m === '合双') {
                  let numArr = k.num.split('');
                  let num = Number(numArr[0]) + Number(numArr[1]);
                  if (num % 2 === 0) o.data.push({ num: k.num })
                }
              }
            })
            o.data.sort((a, b) => {
              return a.num - b.num
            })
            o.multiple = (extra[v + m] * vm.defaultRefund).toFixed(2);
            o.money = '';
            o.checked = false;
            o.animated = false;
            numsArr.push(o)
          })
        })
        let halfLen = Math.floor(numsArr.length / 2);
        let newArr = [];
        for (let i = 0; i < halfLen; i++) {
          let j = halfLen + i;
          newArr.push(numsArr[i])
          newArr.push(numsArr[j])
        }
        this.bbArr = newArr
        // console.log(this.bbArr)
      },

      handleChangeType(e) {
        const vm = this;
        let text = e.target.innerText;
        this.radioBtn2 = '';
        vm.typeArr.filter(v => {
          v.checked = false;
          v.name === text ? v.checked = true : '';
        })
        vm.bbArr.filter(v => {
          v.checked = false;
          let t = v.title.slice(1)
          if (t === text) vm.setItemChecked(v)
        })
      },

      handleChangeBBRadio(e) {
        const vm = this;
        let val = e.target.defaultValue;
        if (val) {
          vm.typeArr.filter(v => {
            v.checked = false;
          })
          let text = val.split('')[0]
          vm.bbArr.filter(v => {
            v.checked = false;
            v.money = '';
            let c = v.title.split('')[0];
            let t = v.title.split('')[1];
            if (c === text) {
              if (t === '大' || t === '小') vm.setItemChecked(v)
            }
          })
        }
      },

      // 半波 投注 操作 函数   结束--------------


      // 生肖 投注 操作 函数   开始--------------

      animalNumberArr() {
        this.use_animal = [];
        let r1 = this.currItem.lotteryMode.children[2].extra[1];
        let r2 = this.currItem.lotteryMode.children[2].extra[2];
        this.sxRatio = (r1 * this.defaultRefund).toFixed(2);
        let extra = this.currItem.lotteryMode.children[this.sxIndex].extra;
        // let probability = {};
        // let name = '';
        // for(let i in extra){
        //   if(i === 'shu')name='鼠';
        //   if(i === 'niu')name='牛';
        //   if(i === 'hu')name='虎';
        //   if(i === 'tu')name='兔';
        //   if(i === 'long')name='龙';
        //   if(i === 'she')name='蛇';
        //   if(i === 'ma')name='马';
        //   if(i === 'yang')name='羊';
        //   if(i === 'hou')name='猴';
        //   if(i === 'ji')name='鸡';
        //   if(i === 'gou')name='狗';
        //   if(i === 'zhu')name='猪';
        //   probability[name] = extra[i];
        // }
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
            if (v.name === k) {
              if (k === '鼠') _style = "mouse";
              if (k === '牛') _style = "bulls";
              if (k === '虎') _style = "tiger";
              if (k === '兔') _style = "rabbit";
              if (k === '龙') _style = "dragon";
              if (k === '蛇') _style = "snake";
              if (k === '马') _style = "horse";
              if (k === '羊') _style = "sheep";
              if (k === '猴') _style = "monkey";
              if (k === '鸡') _style = "chicken";
              if (k === '狗') _style = "dog";
              if (k === '猪') _style = "pig";
              vm.use_animal.push({
                name: v.name,
                neiwai: v.neiwai,
                number: arr2,
                sex: v.sex,
                size: v.size,
                wuhang: v.wuhang,
                xiangmao: v.xiangmao,
                yinyang: v.yinyang,
                ratio1: r1,
                ratio2: r2,
                multiple: (extra[k] * vm.defaultRefund).toFixed(2),
                money: '',
                style: _style,
                checked: false,
                animated: false
              })
            }
          })
        })
        // console.log(this.use_animal)
      },

      handleChangeAnimalArr(e) {
        const vm = this;
        let val = e.target.innerText;
        if (val) {
          let text = val.split('')[0];
          vm.use_animal.filter(v => {
            v.checked = false;
            v.money = '';
            if (v.name === '狗' && v.checked) {
              vm.sxRatio = (v.ratio2 * vm.defaultRefund).toFixed(2);
            } else {
              vm.sxRatio = (v.ratio1 * vm.defaultRefund).toFixed(2);
            }
            if (v.size === text) {
              v.checked = true;
              v.animated = true;
              setTimeout(() => {
                v.animated = false;
              }, 600);
            } else if (v.sex === text) {
              v.checked = true;
              v.animated = true;
              setTimeout(() => {
                v.animated = false;
              }, 600);
            }
          })
        }

      },

      handleCheckedAnimalType(e) {
        const vm = this;
        let text = e.target.innerText;
        vm.animalType.filter(v => {
          v.checked = false;
          if (v.title === text) v.checked = true;
        })
        vm.use_animal.filter(v => {
          v.checked = false;
          if (v.name === '狗' && v.checked) {
            vm.sxRatio = (v.ratio2 * vm.defaultRefund).toFixed(2);
          } else {
            vm.sxRatio = (v.ratio1 * vm.defaultRefund).toFixed(2);
          }
          if (v.xiangmao === text) {
            v.checked = true;
            v.animated = true;
            setTimeout(() => {
              v.animated = false;
            }, 600);
          } else if (v.neiwai === text) {
            v.checked = true;
            v.animated = true;
            setTimeout(() => {
              v.animated = false;
            }, 600);
          } else if (v.yinyang === text) {
            v.checked = true;
            v.animated = true;
            setTimeout(() => {
              v.animated = false;
            }, 600);
          }
        })
      },

      handleCheckedWuxing(e) {
        const vm = this;
        let text = e.target.dataset.name;
        vm.wuxing.filter(v => {
          v.checked = false;
          if (v.title === text) v.checked = true;
        })
        vm.use_animal.filter(v => {
          v.checked = false;
          if (v.wuhang === text) {
            v.checked = true;
            v.animated = true;
            setTimeout(() => {
              v.animated = false;
            }, 600);
          }
        })
      },



      // 生肖 投注 操作 函数   结束--------------


      // 尾数 投注 操作 函数   开始--------------
      wsNumbersArr() {
        const vm = this;
        let arr = [];
        for (let i = 0; i < 10; i++) {
          let o = {
            data: [],
            checked: false,
            animated: false,
            money: ''
          };
          vm.allBalls.filter(v => {
            let n = Number(v.num.split('')[1]);
            if (n === i) {
              o.data.push({ num: v.num })
            }
          })
          o.title = i + '尾'
          o.multiple = '';
          arr.push(o)
        }
        let halfLen = Math.floor(arr.length / 2);
        let newArr = [];
        for (let i = 0; i < halfLen; i++) {
          let j = halfLen + i;
          newArr.push(arr[i])
          newArr.push(arr[j])
        }
        this.wsArr = newArr;
      },
      handleChangeWSRadio(e) {
        const vm = this;
        let val = e.target.defaultValue;
        if (val) {
          vm.typeArr.filter(v => {
            v.checked = false;
          })
          let text = val.split('')[0]
          vm.wsArr.filter(v => {
            v.checked = false;
            v.money = '';
            let n = v.title.split('')[0];
            if (text === '大') {
              if (Number(n) > 4) {
                v.checked = true;
                v.animated = true;
                setTimeout(() => {
                  v.animated = false;
                }, 600)
              }
            } else if (text === '小') {
              if (Number(n) < 5) {
                v.checked = true;
                v.animated = true;
                setTimeout(() => {
                  v.animated = false;
                }, 600)
              }
            } else if (text === '单') {
              if (Number(n) % 2 === 1) {
                v.checked = true;
                v.animated = true;
                setTimeout(() => {
                  v.animated = false;
                }, 600)
              }
            } else if (text === '双') {
              if (Number(n) % 2 === 0) {
                v.checked = true;
                v.animated = true;
                setTimeout(() => {
                  v.animated = false;
                }, 600)
              }
            }
          })
        }
      },

      // 尾数 投注 操作 函数   结束--------------





      // 总分 投注 操作 函数   开始--------------

      // 总分 投注 操作 函数   结束--------------




      // 不中 投注 操作 函数   开始--------------

      bzNumbersArr() {
        const vm = this;
        let arr1 = [];
        for (let i = 1; i < 50; i++) {
          let n;
          if (i < 10) {
            n = '0' + i;
          } else {
            n = i.toString();
          }
          arr1.push(n)
        }
        let arr2 = [];
        for (let i = 0; i < 5; i++) {
          arr2.push({
            num: arr1[i],
            checked: false,
            animated: false,
            money: vm.defaultMoney4,
            multiple: vm.defaultMoney4
          })
          let n = i
          for (let j = 0; j < 10; j++) {
            n += 5
            if (n < arr1.length) {
              arr2.push({
                num: arr1[n],
                checked: false,
                animated: false,
                money: vm.defaultMoney4,
                multiple: vm.defaultMoney4
              })
            }
          }
        }
        this.bzArr = arr2;
      },

      handleCheckBZNumber(item) {
        // console.log(item)
        const vm = this;
        let t = item.checked;
        if (t) {
          item.checked = false;
          if (item.name && item.name === '狗') {
            this.sxRatio = (item.ratio1 * this.defaultRefund).toFixed(2);
            this.animatedMoney = true;
            setTimeout(() => {
              vm.animatedMoney = false;
            }, 600);
          }
        } else {
          if (item.name && item.name === '狗') {
            this.sxRatio = (item.ratio2 * this.defaultRefund).toFixed(2);
            this.animatedMoney = true;
            setTimeout(() => {
              vm.animatedMoney = false;
            }, 600);
          }
          item.checked = true;
          item.animated = true;
          setTimeout(() => {
            item.animated = false;
          }, 600);
        }
      },

      // 不中 投注 操作 函数   结束--------------




      // 获取 选中类型的 数字集合
      // 1 绑定money
      getCheckedArr1() {
        const vm = this;
        let arr = [];
        if (this.betsTitle === '特码' || this.betsTitle.indexOf('正码') > -1) {
          arr = vm.allBalls.filter(v => {
            return v.checked === true
          })
        } else if (this.betsTitle === '半波') {
          arr = vm.bbArr.filter(v => {
            return v.checked === true
          })
        } else if (this.betsTitle === '尾数') {
          arr = vm.wsArr.filter(v => {
            return v.checked === true
          })
        } else if (this.betsTitle.indexOf('肖') > -1) {
          arr = vm.use_animal.filter(v => {
            return v.checked === true
          })
        }
        return arr;
      },
      // 2 投注
      getCheckedArr2() {
        const vm = this;
        let arr = [];
        if (this.betsTitle === '特码' || this.betsTitle.indexOf('正码') > -1) {
          arr = vm.allBalls.filter(v => {
            return v.money !== '' || (v.checked === true && v.money !== '')
          })
        } else if (this.betsTitle === '半波') {
          arr = vm.bbArr.filter(v => {
            return v.money !== '' || (v.checked === true && v.money !== '')
          })
        } else if (this.betsTitle === '尾数') {
          arr = vm.wsArr.filter(v => {
            return v.money !== '' || (v.checked === true && v.money !== '')
          })
        } else if (this.betsTitle === '总分') {
          arr = vm.zfArr.filter(v => {
            return v.money !== ''
          })
        } else if (this.betsTitle.indexOf('不中') > -1) {
          arr = vm.bzArr.filter(v => {
            return v.checked === true
          })
        } else if (this.betsTitle.indexOf('肖') > -1 && this.betsTitle !== '六肖') {
          arr = vm.use_animal.filter(v => {
            return v.money !== '' || (v.checked === true && v.money !== '')
          })
        } else if (this.betsTitle === '六肖') {
          arr = vm.use_animal.filter(v => {
            return v.checked === true
          })
        }
        return arr;
      },
      // 重置按钮
      handleResetAllBalls() {
        if (this.betsTitle === '特码' || this.betsTitle.indexOf('正码') > -1) {
          this.allBalls.filter(v => {
            v.checked = false;
            v.money = '';
          })
        } else if (this.betsTitle === '半波') {
          this.radioBtn2 = '';
          this.typeArr.filter(v => {
            v.checked = false;
          })
          this.bbArr.filter(v => {
            v.checked = false;
            v.money = '';
          })
        }

        this.radioBtn = '';
        this.money = '';
        this.animalsArr.filter(v => {
          v.checked = false;
        })

        this.wsArr.filter(v => {
          v.checked = false;
          v.money = '';
        })
        this.zfArr.filter(v => {
          v.money = '';
        })
        this.bzArr.filter(v => {
          v.checked = false;
        })
        this.use_animal.filter(v => {
          v.checked = false;
          v.money = '';
        })
      },
      // 投注
      gotoBets() {
        if (this.activityBegin) {
          alert('活动尚未开始，请等待.');
          return false;
        }
        let arr = this.getCheckedArr2();
        // console.log(arr)
        // console.log('gameid--------',this.gameid);
        // console.log('lottery3id--------',this.lottery3id);
        // console.log('lotteryid--------',this.lotteryid);
        // console.log('vote_no---投注内容-----',this.vote_no);
        // console.log('vote_cash---单注 价格-----',this.vote_cash);
        // console.log('unit---钱的 类型 元角分-----','元');
        // // console.log('times---倍数-----',this.times);
        // console.log('issue_no---当前期号-----',this.issue);
        // console.log('vote_num---每一注的 注数-----',1);
        // console.log('refund---返点-----',this.refund);
        const vm = this;
        if (arr.length === 0 && (this.money === '' || this.money != '')) {
          this.$alert('您还未投注，或者投注有误', '温馨提示', {
            showConfirmButton: false,
            callback: action => {
              // 
            }
          });
        } else {
          let gameid = this.gameid;
          let lottery3id = this.lottery3id;
          let lotteryid = this.lotteryid;
          let vote_no;
          let vote_cash;
          let unit = '元';
          let issue_no = this.issue;
          let vote_num = 1;
          let refund = this.refundText;
          if (vm.betsTitle.indexOf('不中') > -1 || vm.betsTitle.indexOf('六肖') > -1) {
            if (arr.length >= vm.checkLen && this.money !== '') {
              // let voteList = [];
              if (vm.betsTitle.indexOf('不中') > -1) {
                let numArr = [];
                arr.filter(v => {
                  numArr.push(v.num)
                })
                vote_no = numArr.join('-')
              } else {
                let numArr = [];
                arr.filter(v => {
                  let a = [];
                  v.number.filter(k => {
                    a.push(k.num)
                  })
                  numArr.push(a.join('-'))
                })
                vote_no = numArr.join('|')
              }
              // console.log(num.join('-'))
              let betsNum = '';
              let bets = lottery.groupSelectOne(arr.length, vm.checkLen, 1);
              arr.filter(v => {
                betsNum += (v.num || v.name) + '、'
              })
              vote_cash = Number(bets * vm.money).toFixed(2);
              let voteList = [{ gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }]
              // console.log(voteList)
              let title = '<div class="nums-alert-title">' + betsNum + '</div>';
              let wrap = '<div class="nums-alert-content">' +
                '<span>组合共：<em>' + bets + '</em> 组</span>' +
                '<span>单注金额：<em>' + vm.money + '</em> 元</span>' +
                '<span>总下注金额：<em>' + Number(bets * vm.money).toFixed(2) + '</em> 元</span>' +
                '</div>';
              let html = title + wrap
              this.$alert(html, '确认信息', {
                showCancelButton: true,
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                // console.log('确定')
                vm.betsFn(voteList)
              }).catch(() => {
                // console.log('取消')
              })
            } else {
              this.$alert('您还未投注，或者投注有误', '温馨提示', {
                showConfirmButton: false,
                callback: action => {
                  // 
                }
              });
            }
          } else {
            let voteList = [];
            let money = 0;
            let content = '';
            if (vm.betsTitle === '特码' || vm.betsTitle.indexOf('正码') > -1) {
              arr.filter(v => {
                vote_no = v.num;
                vote_cash = Number(v.money).toFixed(2);
                let o = { gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }
                voteList.push(o)
              })
            } else if (vm.betsTitle === '半波') {
              arr.filter(v => {
                vote_no = v.title;
                vote_cash = Number(v.money).toFixed(2);
                let o = { gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }
                voteList.push(o)
              })
            } else if (vm.betsTitle.indexOf('肖') > -1 && vm.betsTitle !== '六肖') {
              arr.filter(v => {
                let newNum = [];
                vote_cash = Number(v.money).toFixed(2);
                v.number.filter(k => {
                  newNum.push(k.num)
                })
                vote_no = newNum.join('-');
                let o = { gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }
                voteList.push(o)
              })
            } else if (vm.betsTitle === '尾数') {
              arr.filter(v => {
                vote_cash = Number(v.money).toFixed(2);
                vote_no = v.title.charAt(0);
                let o = { gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }
                voteList.push(o)
              })
            } else if (vm.betsTitle === '总分') {
              arr.filter(v => {
                vote_cash = Number(v.money).toFixed(2);
                vote_no = v.title;
                let o = { gameid, lottery3id, lotteryid, vote_no, vote_cash, unit, issue_no, vote_num, refund }
                voteList.push(o)
              })
            }
            // console.log(voteList)
            arr.filter(v => {
              money += Number(v.money)
              content += '<span>' + vm.betsTitle + ' (' + (v.num || v.title || v.name) + ') ' + v.multiple + ' x' + Number(v.money).toFixed(2) + '</span>'
            })
            let title = '<div class="bets-alert-title">共计：￥' + money.toFixed(2) + ' / ' + arr.length + ' 注，您确定要下注吗？</div>';
            let wrap = '<div class="bets-alert-content">' + content + '</div>';
            let html = title + wrap
            this.$alert(html, '确认信息', {
              showCancelButton: true,
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              // console.log('确定')
              vm.betsFn(voteList)
            }).catch(() => {
              // console.log('取消')
            })
          }
        }
      },
      betsFn(voteList) {
        const vm = this;
        // console.log(voteList)
        // return false;
        request.http(
          'post',
          '/lottery/issue/vote',
          paramCryptFn({ voteList }),
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
              vm.handleResetAllBalls();
              vm.betsDataList = success.data.data;
              vm.betsSuccess = true;
              vm.getBetsDataList();
              vm.betsSuccessId = success.data.result[0]._id;
              vm.$store.dispatch('setBlance', success.data.cash);
              localStorage.setItem('blance', success.data.cash);
              // console.log(vm.$store)
            } else {
              alert(success.data.msg)
            }
          },
          (error) => {
            console.log(error)
          }
        )
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
            if (code === 103) {
              request.loginAgain(vm)
            } else if (code === 101) {
              request.loginAgain(vm)
            } else if (code === 106) {
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
      }
    }
  }
</script>
<style lang="scss">
  .bets-alert-title {
    border-bottom: 1px solid #C6C6C6;
    font-size: 16px;
  }

  .bets-alert-content {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    span {
      display: block;
      margin: 2px 7px 0 0;
      line-height: 24px;
    }
  }

  .nums-alert-title {
    border-bottom: 1px solid #C6C6C6;
    font-size: 16px;
  }

  .nums-alert-content {
    width: 100%;
    margin-top: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    span {
      display: block;
      em {
        font-style: normal;
        color: red;
      }
    }
  }

  .radio-area {
    div {
      .el-radio__label {
        font-size: 12px;
      }
      .el-radio__inner {
        width: 10px;
        height: 10px;
      }
    }
    .radio-red {
      .el-radio__input.is-checked+.el-radio__label {
        color: #ED361E;
      }
      .el-radio__label {
        color: #ED361E;
      }
      .el-radio__input.is-checked .el-radio__inner {
        background: #ED361E;
        border-color: #ED361E;
      }
    }
    .radio-green {
      .el-radio__input.is-checked+.el-radio__label {
        color: #039A8E;
      }
      .el-radio__label {
        color: #039A8E;
      }
      .el-radio__input.is-checked .el-radio__inner {
        background: #039A8E;
        border-color: #039A8E;
      }
    }
    .radio-blue {
      .el-radio__input.is-checked+.el-radio__label {
        color: #1E4FED;
      }
      .el-radio__label {
        color: #1E4FED;
      }
      .el-radio__input.is-checked .el-radio__inner {
        background: #1E4FED;
        border-color: #1E4FED;
      }
    }
  }
</style>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .lhc-top {
    width: 100%;
    height: 104px;
    margin-bottom: 10px;
    .lottery-header {
      width: 100%;
      height: 104px; // padding:0 20px;
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
      height: 104px; // margin-left:25px;
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
      display: block;
      text-align: left; // color: #939DB8;
    }
    .bets-issue em {
      font-style: normal;
    }
    .countDown-animate {
      // margin-left:4px;
    }
    .history-issue {
      font-size: 14px;
      font-weight: 600;
      color: #e2e2e2;
      text-align: left;
    }
    .history-lottery-number {
      // margin-left:33px;
      // margin-left:20px;
      display: -webkit-box;
      margin-top: 7px;
      div {
        height: auto;
        color: #939DB8;
        display: -webkit-box;
        -webkit-box-align: center;
        padding-right: 4px;
        position: relative;
        em.animalText {
          position: absolute;
          font-style: normal;
          left: 9px;
          bottom: -20px;
          font-size: 12px;
        }
      }
      strong {
        color: #CC3447;
        font-size: 24px;
      }
    }
    .history-lottery-number span {
      display: block;
      width: 30px;
      height: 30px;
      line-height: 27px;
      font-size: 14px;
      color: #939DB8;
      border-radius: 50%;
      margin-right: 4px;
    }
    .history-lottery-number span.green {
      border: 2px solid #0F9075;
    }
    .history-lottery-number span.blue {
      border: 2px solid #3357D7;
    }
    .history-lottery-number span.red {
      border: 2px solid #BD3840;
    }
    .history-lottery-number span.green-fullColor {
      background: #0F9075;
      line-height: 26px;
      color: #fff;
    }
    .history-lottery-number span.blue-fullColor {
      background: #3357D7;
      line-height: 26px;
      color: #fff;
    }
    .history-lottery-number span.red-fullColor {
      background: #BD3840;
      line-height: 26px;
      color: #fff;
    }
    .explain {
      margin-left: 20px;
      height: 78px;
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
        z-index:2;
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
  }

  .lhc-wrap {
    width: 100%;
    height: 100%; // padding-top:20px;
    position: relative;
    background: #242445;
    .lhc-nav {
      width: 100%;
      height: 38px;
      color: #E9EDFD;
      background: #434382; // border-top-left-radius: 5px;
      // border-top-right-radius: 5px;
      // margin-bottom:17px;
      span {
        width: 79px;
        float: left;
        cursor: pointer; // border-right: 1px solid #35356d;
        text-align: center;
        line-height: 38px;
        overflow: hidden;
        font-size: 14px;
        font-weight: 800;
      }
      span.curr {
        background: #242445;
        border-top: 4px solid #BD8454;
        line-height: 36px;
        color: #BD8454;
        font-weight: 800;
      }
    }
    .game-area {
      width: 100%;
      display: -webkit-box;
      -webkit-box-pack: justify; // padding:5px;
      // padding-right:0;
      // height:634px;
      background: #242445; // margin-bottom:6px;
      .buzhong {
        // margin-right:5px;
      }
      .left {
        -webkit-box-flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        .left-content {
          -webkit-box-flex: 1;
          background: #191930;
          .panel {
            padding: 20px;
            background: #242445;
            overflow: hidden;
            position: relative;
            list-style-type: none;
            li {
              cursor: pointer;
              font-size: 12px;
              float: left;
              width: 72px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              background: #2B2B4E;
              border: 1px solid #444444;
              border-radius: 2px;
              margin-right: 10px;
              color: #939DB8;
              :first-child {
                box-shadow: none;
              }
            }
            li.curr {
              background: #2C8A84;
              color: #fff;
            }
          }
          .tz-ruler {
            padding: 20px;
            font-size: 14px;
            color: #777;
            text-align: left;
            line-height: 20px;
            width: 100%;
            min-height: 52px;
            position: relative;
            padding-right: 200px;
            .refund-btn {
              width: 110px;
              height: 30px;
              display: -webkit-box;
              -webkit-box-pack: justify;
              position: absolute;
              right: 20px;
              top: 20px;
              .refund-tag {
                width: 100px;
                height: 20px;
                background: rgba(0, 0, 0, .9);
                position: absolute;
                border-radius: 5px; // display: none;
                top: 33px;
                right: 4px;
                text-align: center;
                line-height: 20px;
              }
              span {
                display: block;
                width: 50px;
                line-height: 30px;
                text-align: center;
                border: 1px solid #777;
                border-radius: 2px;
                font-size: 12px;
                color: #777;
                cursor: pointer;
              }
              span.curr {
                background: #242445;
                border: 1px solid #BD8454;
                color: #BD8454;
              }
            }
          }
          .tz-area {
            width: 100%;
            .tz-area-wrap {
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
            .tz-title {
              width: 100%; // padding-right:12px;
              margin-bottom: 8px;
              ul {
                width: 100%;
                display: -webkit-box;
                -webkit-box-pack: justify;
                list-style: none
              }
              .tmzm {
                li {
                  width: 172px;
                  margin-left: 0;
                  height: 29px;
                  display: -webkit-box;
                  -webkit-box-pack: center;
                  -webkit-box-align: center;
                  background-image: linear-gradient(-180deg, #292955 0%, #212144 100%);
                  font-size: 12px;
                  border-right: 1px solid #191930;
                  &:last-child {
                    border-right: none;
                  }
                  span {
                    display: block;
                    -webkit-box-flex: 1;
                  }
                }
              }
              .bbws {
                li {
                  width: 50%;
                  height: 43px;
                  background-image: linear-gradient(-180deg, #292955 0%, #212144 100%);
                  font-size: 12px;
                  border-right: 1px solid #191930;
                  display: -webkit-box;
                  -webkit-box-pack: justify;
                  -webkit-box-align: center;
                  font-size: 12px;
                  span {
                    display: block;
                    width: 24%;
                  }
                  span.num {
                    width: 50%;
                  }
                }
              }
              .bz-list {
                li {
                  width: 102px;
                  margin-left: 0;
                  height: 43px;
                  display: -webkit-box;
                  -webkit-box-pack: center;
                  -webkit-box-align: center;
                  background-image: linear-gradient(-180deg, #292955 0%, #212144 100%);
                  font-size: 12px;
                  border-right: 1px solid #191930;
                  span {
                    display: block;
                    -webkit-box-flex: 1;
                  }
                }
              }
            }
            .tz-content {
              width: 100%; // padding-right:12px;
              .buzhong-money-input {
                margin: 20px;
                margin-top: 0px;
                color: #F7CD88;
                display: -webkit-box;
                -webkit-box-pack: end; // -webkit-box-pack:center;
                span {
                  // display:block;
                  color: #939DB8;
                  font-size: 12px;
                }
                input {
                  // display:block;
                  background: #191919;
                  border: 1px solid #294060;
                  box-shadow: inset 0 2px 4px 0 #000000;
                  border-radius: 2px;
                  text-align: center;
                  text-indent: 10px;
                  color: #F7D297;
                  height: 30px;
                  width: 122px;
                  outline: none;
                  margin-left: 11px;
                }
              }
              ul {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                li {
                  height: 43px;
                  display: -webkit-box;
                  -webkit-box-pack: justify;
                  -webkit-box-align: center;
                  font-size: 12px;
                  border-radius: 4px;
                  padding-right: 5px;
                  padding-left: 4px;
                  margin-bottom: 5px;
                  .balls-num {
                    display: block;
                    border-radius: 50%;
                    text-align: center;
                    font-size: 14px;
                  }
                  .bs {
                    font-style: normal;
                    font-size: 14px;
                    color: #939DB8;
                    display: block;
                    line-height: 34px;
                    span {
                      display: inline-block;
                      height: 100%;
                    }
                  }
                  input {
                    width: 68px;
                    height: 26px;
                    outline: none;
                    background: #191919;
                    border: 1px solid #294060;
                    box-shadow: inset 0 2px 4px 0 #000000;
                    border-radius: 2px;
                    text-align: center;
                    color: #F7CD88;
                  }
                }
                .red {
                  background: #BD3840;
                }
                .blue {
                  background: #3357D7;
                }
                .green {
                  background: #0F9075;
                }
              }
              .tmzm {
                li {
                  width: 170px;
                  padding: 0 10px;
                  margin-left: 2px;
                  .balls-num {
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                  }
                  .bs {
                    padding-left: 0px;
                  }
                }
              }
              .bbws {
                li {
                  width: 50%;
                  padding: 0 5px; // margin-left:2px;
                  .balls-num {
                    width: 22px;
                    height: 22px;
                    line-height: 22px;
                    margin-left: 5px;
                    font-size: 12px;
                  }
                  div {
                    display: -webkit-box;
                    -webkit-box-pack: start;
                    -webkit-box-flex: 1;
                  }
                  h5 {
                    width: 43px;
                    text-align: left;
                    font-size: 12px;
                  }
                  h5.animal-icon-par {
                    width: 53px;
                  }
                  em.bs {
                    font-size: 12px;
                  }
                }
                li.bbws-ws {
                  .balls-num {
                    width: 28px;
                    height: 28px;
                    line-height: 28px;
                    margin-left: 5px;
                    font-size: 14px;
                  }
                  em.bs {
                    font-size: 14px;
                  }
                  h5 {
                    font-size: 14px;
                  }
                }
              }
              .zf {
                li {
                  min-width: 48%;
                  margin-left: 12px;
                  div {
                    display: -webkit-box;
                    -webkit-box-pack: start;
                    -webkit-box-flex: 1;
                    margin-left: 3px;
                  }
                  h5 {
                    width: 38px;
                    text-align: left;
                  }
                }
              }
              .bz-list {
                li {
                  min-width: 88px;
                  padding: 0 10px;
                  margin-left: 13px;
                  .balls-num {
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                  }
                  span {
                    display: block;
                    width: 26px;
                    height: 26px; // border-radius:50%;
                    background: url('../../img/check.png') no-repeat left;
                    background-size: 100% 100%;
                    cursor: pointer;
                  }
                  span.checked {
                    background: url('../../img/checked.png') no-repeat left;
                    background-size: 100% 100%;
                  }
                }
              }
              .sx-list {
                li {
                  min-width: 48%;
                  padding: 0 10px;
                  margin-left: 13px;
                  .balls-num {
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    margin-left: 5px;
                  }
                  div {
                    display: -webkit-box;
                    -webkit-box-pack: start;
                    -webkit-box-flex: 1;
                    margin-left: 40px;
                  }
                  h5 {
                    width: 43px;
                    text-align: left;
                  }
                  span {
                    display: block;
                    width: 26px;
                    height: 26px; // border-radius:50%;
                    background: url('../../img/check.png') no-repeat left;
                    background-size: 100% 100%;
                    cursor: pointer;
                  }
                  span.checked {
                    background: url('../../img/checked.png') no-repeat left;
                    background-size: 100% 100%;
                  }
                }
              }
              li.curr {
                background: #60637a;
              }
              .animal-icon-par {
                height: 100%;
                width: auto;
                display: -webkit-box;
                -webkit-box-align: center;
                -webkit-box-pack: center;
                margin-right: 5px;
                margin-left: 10px;
                em {
                  font-style: normal;
                  display: block;
                  margin-left: 10px;
                }
              }
              .animal-icon {
                width: 30px;
                display: inline-block;
                height: 100%; // background: url('../../img/dog.png') no-repeat left;
                // background-size:100% 100%;
                // float: left;
                // margin-left: 29px;
              }
              .mouse {
                background: url('../../img/animal-sprite.png') -73px -124px no-repeat;
              }
              .bulls {
                background: url('../../img/animal-sprite.png') -17px -6px no-repeat;
              }
              .tiger {
                background: url('../../img/animal-sprite.png') -138px -176px no-repeat;
              }
              .rabbit {
                background: url('../../img/animal-sprite.png') -189px -8px no-repeat;
              }
              .dragon {
                background: url('../../img/animal-sprite.png') -10px -60px no-repeat;
              }
              .snake {
                background: url('../../img/animal-sprite.png') -198px -124px no-repeat;
              }
              .horse {
                background: url('../../img/animal-sprite.png') -131px -64px no-repeat;
              }
              .sheep {
                background: url('../../img/animal-sprite.png') -198px -68px no-repeat;
              }
              .monkey {
                background: url('../../img/animal-sprite.png') -15px -126px no-repeat;
              }
              .chicken {
                background: url('../../img/animal-sprite.png') -71px -9px no-repeat;
              }
              .dog {
                background: url('../../img/animal-sprite.png') -133px -6px no-repeat;
              }
              .pig {
                background: url('../../img/animal-sprite.png') -135px -123px no-repeat;
              }
            }
          }
        }
      }
      .right {
        width: 162px;
        padding: 0 20px;
        .r-top {
          width: 100%; // height:116px;
          // padding:0 22px;
          border-bottom: 1px solid #444;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          .srje {
            color: #F7CD88;
            font-size: 12px;
            margin-top: 12px;
            text-align: left;
            input {
              width: 122px;
              height: 30px;
              background: #191919;
              border: 1px solid #294060;
              box-shadow: inset 0 2px 4px 0 #000000;
              border-radius: 2px;
              color: #F7CD88;
              text-align: center;
              outline: none;
              margin-top: 10px; // margin-left:14px;
            }
          }
          .czan {
            margin: 20px 0;
            display: -webkit-box;
            -webkit-box-pack: justify;
            button {
              outline: none;
              color: #fff;
              border: none;
              cursor: pointer;
              display: block;
            }
            .ljxz {
              width: 72px;
              height: 30px;
              font-size: 12px;
              background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
              border-radius: 2px; // box-shadow: 0 0 1px 1px #111;
            }
            .reset {
              width: 40px;
              height: 30px;
              background: #777777;
              border-radius: 2px;
              margin-left: 0px;
              font-size: 12px;
            }
          }
        }
        .r-bot {
          width: 100%; // padding:0 44px;
          .radio-area {
            margin-top: 20px;
            border-bottom: 1px solid #444444;
            .el-radio-group {
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
            .bbws {
              div {
                width: auto;
              }
            }
            div {
              width: 100%;
              display: -webkit-box;
              -webkit-box-pack: justify;
              margin-bottom: 6px;
              label {
                display: block;
                width: 66px;
                margin-left: 0;
                display: -webkit-box;
                -webkit-box-pack: justify;
              }
            }
          }
          .animal-area {
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            border-top: 1px solid;
            border-left: 1px solid;
            border-color: #6060A2;
            span {
              display: block;
              width: 30.25px;
              height: 30px;
              line-height: 30px;
              border-right: 1px solid;
              border-bottom: 1px solid;
              border-color: #6060A2;
              font-size: 12px;
              cursor: pointer;
              color: #939DB8;
            }
            span.width50 {
              width: 50%;
            }
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4) {
              color: #939DB8;
            }
            .curr {
              background: #60637a;
            }
          }
          .animalType {
            margin-top: 12px;
            span {
              width: 50%;
              display: block;
              height: 35px;
              line-height: 35px;
              border-right: 1px solid;
              border-bottom: 1px solid;
              border-color: #B5BCF7;
              font-size: 12px;
              cursor: pointer;
              color: #939DB8;
            }
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4) {
              color: #939DB8;
            }
          }
          .wuxing {
            margin-top: 12px;
            span {
              width: 100%;
              display: block;
              height: 35px;
              line-height: 35px;
              border-right: 1px solid;
              border-bottom: 1px solid;
              border-color: #B5BCF7;
              font-size: 12px;
              cursor: pointer;
              color: #939DB8;
            }
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4) {
              color: #939DB8;
            }
          }
        }
      }
    }
    .czan {
      width: 100%;
      display: -webkit-box;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      margin: 30px 0;
      button {
        outline: none;
        color: #fff;
        border: none;
        cursor: pointer;
      }
      .ljxz {
        width: 218px;
        height: 60px;
        font-size: 20px;
        font-weight: bold;
        background-image: linear-gradient(-180deg, #CFA072 0%, #B68E66 100%);
        border-radius: 4px;
      }
      .reset {
        color: #777;
        background: none;
        font-size: 14px;
        cursor: pointer; // margin-left:31px;
      }
    }
    .my-split-line {
      width: 984px;
      height: 1px;
      background: #444;
      margin: 0 auto;
      border: none;
    } // .table-area{
    //   margin-top: 5px;
    //   width: 100%;
    //   background: #191930;
    //   color: #B9C0E0;
    //   .table-nav{
    //     height:33px;
    //     padding:0 34px;
    //     background: -webkit-linear-gradient(#292955,#212144);
    //     background: linear-gradient(#292955,#212144);
    //     li{
    //       line-height: 33px;
    //       float: left;
    //       text-align: center;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //     }
    //     .yx{
    //       width:10%;
    //     }
    //     .wf{
    //       width:13%;
    //     }
    //     .qh{
    //       width:10%;
    //     }
    //     .kj{
    //       width:15%;
    //     }
    //     .nr{
    //       width:15%;
    //     }
    //     .je{
    //       width:10%;
    //     }
    //     .jj{
    //       width:10%;
    //     }
    //     .fd{
    //       width:7%;
    //     }
    //     .zt{
    //       width:5%;
    //     }
    //     .cz{
    //       width:5%;
    //     }
    //   }
    // }
    .table-area {
      width: 984px;
      margin: 0 auto;
      background: #242445;
      color: #fff;
      min-height: 153px;
      margin-top: 31px;
      margin-bottom: 30px;
      .table-title {
        width: 100%;
        height: 40px;
        span {
          display: block;
          float: left;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-size: 14px;
          color: #F7A923;
          padding: 0 17px;
          border-top: 2px solid #F7A923;
        }
      }
    }
    .my-bets-table-wrap thead th {
      padding: 8px 0;
      font-weight: normal;
      font-size: 12px;
      background-image: linear-gradient(-180deg, #292955 0%, #212144 100%);
      color: #777;
      &:last-child {
        div {
          border-right: none;
        }
      }
      div {
        padding: 2px 0; // width:100%;
        border-right: 1px solid #777;
      }
      .youxi {
        width: 106px;
      }
      .wanfa {
        width: 118px;
      }
      .qihao {
        width: 118px;
      }
      .kaijiang {
        width: 118px;
      }
      .neirong {
        width: 120px;
      }
      .jine {
        width: 77px;
      }
      .jiangjin {
        width: 68px;
      }
      .fandian {
        width: 88px;
      }
      .zhuangtai {
        width: 70px;
      }
      .caozuo {
        width: 50px;
      }
    }
    .my-bets-table-wrap tbody th {
      padding: 10px 0;
      font-weight: normal;
      font-size: 12px;
    }
    .my-bets-table-wrap table th div {
      width: 120px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .my-bets-table-wrap {
      max-height: 306px;
      overflow-y: auto;
    }
    .my-bets-table-wrap tbody tr {
      color: #939DB8;
      border-bottom: 1px solid #444;
      &:last-child {
        border-bottom: none;
      }
      &:first-child {
        th {
          padding-top: 20px;
        }
      }
    }
    .my-bets-table-wrap tbody tr th.zhongjiang {
      color: red;
    }
    .my-bets-table-wrap tbody tr th.zhongjiangMoney {
      font-size: 12px;
      color: #D4914D;
    }
    .my-bets-table-wrap .bets-detail-btn a {
      color: #BD8454;
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
  }
</style>