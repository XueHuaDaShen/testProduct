<template>
  <div class="lotteryDetail-wrap" v-if="loaded">
    <div>
      <p class="zh-status">{{getChaseStatus(detailData.status)}}</p>
      <div class="split-bar"></div>
      <div class="detail-content">
        <ul>
          <li>
            <p class="title">游戏模式<span></span></p>
            <p class="desc">{{detailData.gamename}}</p>
          </li>
          <li>
            <p class="title">玩法<span></span></p>
            <p class="desc">{{detailData.lotteryname}}</p>
          </li>
          <li>
            <p class="title">开始期号<span></span></p>
            <p class="desc">{{detailData.start_issue_no.substr(2)}}</p>
          </li>
          <li>
            <p class="title">完成期数<span></span></p>
            <p class="desc">{{detailData.issue_num_finished}}</p>
          </li>
          <li>
            <p class="title">追号金额<span></span></p>
            <p class="desc">{{detailData.vote_cash}}</p>
          </li>
          <li>
            <p class="title">取消金额<span></span></p>
            <p class="desc">{{detailData.vote_cash_canceled}}</p>
          </li>
          <li>
            <p class="title">追号状态<span></span></p>
            <p class="desc">{{getChaseStatus(detailData.status)}}</p>
          </li>
          <li>
            <p class="title">追号编号<span></span></p>
            <p class="desc">{{detailData.order_no}}</p>
          </li>
          <li>
            <p class="title">追号时间<span></span></p>
            <p class="desc">{{moment(detailData.create_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
          </li>
          <li>
            <p class="title">追号期数<span></span></p>
            <p class="desc">{{detailData.issue_num}}</p>
          </li>
          <li>
            <p class="title">取消期数<span></span></p>
            <p class="desc">{{detailData.issue_num_canceled}}</p>
          </li>
          <li>
            <p class="title">完成金额<span></span></p>
            <p class="desc">{{detailData.vote_cash_finished}}</p>
          </li>
          <li>
            <p class="title">中奖金额<span></span></p>
            <p class="desc">{{detailData.award_cash}}</p>
          </li>
          <li>
            <p class="title">模式<span></span></p>
            <p class="desc">{{detailData.unit}}</p>
          </li>
          <li>
            <p class="title">追号返点<span></span></p>
            <p class="desc">{{detailData.refund}}</p>
          </li>
          <li>
            <p class="title">中奖及停<span></span></p>
            <p class="desc">{{detailData.is_hit_stop === 1 ? '是' : '否'}}</p>
          </li>
        </ul>
      </div>
      <div class="split-bar"></div>
      <div class="detail-footer">
        <p>投注号码</p>
        <p class="bets-number">
          <span v-for="(n, ni) in setBetsNumber(detailData.vote_no)" :key="ni">{{renderNumber(n)}}<em v-if="ni<setBetsNumber(detailData.vote_no).length-1"></em></span>
        </p>
      </div>
      <button class="cancel-order" v-if="detailData.status == 1" :disabled="isClick" @click="cancelChaseOrderFn">终止追号</button>
      <h2 class="chase-title-wrap"><em></em>追号奖期（{{detailList.length}}条）</h2>
      <ol class="chase-list" v-if="detailList.length>0">
        <li v-for="(item, i) in detailList" :key="i">
          <table>
            <thead>
              <tr class="thead">
                <td>奖期</td>
                <td>追号内容</td>
                <td>追号倍数</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{item.issue_no}}</td>
                <td>{{item.vote_no}}</td>
                <td>{{item.times}}</td>
              </tr>
              <tr class="thead">
                <td>投注金额</td>
                <td>追号状态</td>
                <td>中奖</td>
              </tr>
              <tr>
                <td>{{item.vote_cash}}</td>
                <td>{{getVoteStatus(item.status)}}</td>
                <td>{{getVoteStatus(item.status)}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <span class="detail-span" @click="toLotteryDetail(item._id)">详情</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </li>
      </ol>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import moment from 'moment';
import { getVoteStatus, getChaseStatus } from '@/assets/js/filterStatus'
export default {
  name: 'chaseDetail',
  data() {
    return {
      isClick: false,
      detailID: '5b597e89c887c2bd7ab35f7f', // 注单id
      code: '',
      detailData: null, // 注单详情
      detailList: [],
      loaded: false, // 数据是否请求完毕
      moment: moment, // 时间格式化
      getVoteStatus: getVoteStatus, // 状态判断函数
      getChaseStatus: getChaseStatus, // 状态判断函数
      lotteryNumberArr: [],

      tipText: '',
      tipTimeOut: 1.5, // s
      
    }
  },
  created() {
    this.$store.dispatch('setTitle', '注单详情');
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setCleanBtn', false)
    this.$store.dispatch('setPlayModeStatus', false);
    this.$store.dispatch('setHeader', true)
    this.$store.dispatch('setBets', 0);
    let id = this.$route.query.id;
    this.detailID = id || this.detailID;
    this.getDetail()
  },
  mounted() {
  },
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  methods: {
    // 获取详情数据
    getDetail() {
      this.loaded = false;
      const vm = this;
      request.http(
        'get',
        '/lottery/chase/list',
        {
          chaseid: vm.detailID,
          self: 1
        },
        (success) => {
          let code = success.returncode;
          if (code == 103 || code == 101 || code == 106) {
            request.loginAgain(vm)
          } else if (code == 200) {
            vm.detailData = success.data.data[0];
            vm.loaded = true;
          } else {
            alert(success.data.msg)
          }
          // console.log(success)
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
      request.http(
        'get',
        '/lottery/chase/luckno/detail',
        {
          chaseid: vm.detailID,
          self: 1
        },
        (success) => {
          let code = success.returncode;
          if (code == 103 || code == 101 || code == 106) {
            request.loginAgain(vm)
          } else if (code == 200) {
            vm.detailList = success.data;
          } else {
            alert(success.data.msg)
          }
          // console.log(success)
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },

    // 设置中奖号码
    setLotteryNumber(val) {
      let arr = [];
      if(val){
        arr = val.split(',');
      }else{
        arr.length = 5;
      }
      return arr
    },

    // 设置投注号码
    setBetsNumber(val) {
      let arr = [];
      if (val.indexOf('|') > -1) {
        arr = val.split('|');
      }else{
        arr = val.split('')
      }
      return arr
    },

    // 投注号码显示样式
    renderNumber(num) {
      let s = '';
      if(num.indexOf('-') > -1){
        s = num.split('-').join(' ')
      }else{
        s = num
      }
      return s;
    },
    //取消追号
    cancelChaseOrderFn() {
      const vm = this;
      vm.isClick = true;
      request.http(
        'get',
        '/lottery/chase/cancel',
        {
          chaseid: vm.detailID
        },
        (success) => {
          vm.isClick = false;
          let code = success.returncode;
          if (code == 103 || code == 101 || code == 106) {
            request.loginAgain(vm)
          } else if (code == 200) {
            vm.$store.dispatch('setBlance', success.data.cash);
            localStorage.setItem('blance', success.data.cash);
            vm.getDetail();
            vm.tipText = '撤单成功';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*1000);
            // vm.detailData = success.data;
          } else if (code == 301 || code == 302) {
            vm.tipText = '撤单失败，请联系管理员';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*1000);
            // vm.detailData = success.data;
          } else {
            alert(success.data.msg)
          }
          // console.log(success)
        },
        (error) => {
          vm.isClick = false;
          console.log('数据异常', error)
        }
      )
    },
    
    // 去往投注详情
    toLotteryDetail(id) {
      this.$router.push({
        name: 'betsDetail',
        query: {
          id: id,
          code: 'cpjl'
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.lotteryDetail-wrap{
  h2.chase-title-wrap{
    height:1.05rem;
    display:-webkit-box;
    -webkit-box-pack:start;
    -webkit-box-align:center;
    text-align:left;
    font-size:.32rem;
    em{
      display:block;
      width:.08rem;
      height:.36rem;
      background:#c7c7c7;
      margin-left:.3rem;
      margin-right:.16rem;
      margin-top:.03rem;
    }
  }
  p.zh-status{
    display:block;
    color:#C83C4A;
    font-size:.32rem;
    width:6.9rem;
    height:.88rem;
    border: .02rem solid #646464;
    border-radius: .08rem;
    text-align:center;
    line-height:.88rem;
    margin:.3rem;
  }
  .detail-title{
    padding:.3rem 1.1rem 0 1.1rem;
    display:table;
    span{
      float:left;
      width:.82rem;
      height:.82rem;
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
      margin-right:.3rem;
      margin-bottom:.3rem;
      color:#565656;
      font-size:.48rem;
      font-weight:400;
      &:nth-child(5n){
        margin-right:0;
      }
    }
    em{
      display:inline-block;
      position: absolute;
      left:.041rem;
      top:.041rem;
      width:.711rem;
      height:.711rem;
      text-align:center;
      line-height: .711rem;
      border-radius:50%;
      opacity: 0.4;
      border: .01rem solid rgba(0,0,0,0.50);
      box-shadow: 0 2px 1px 0 rgba(255,255,255,0.40), inset 0 4px 1px 0 rgba(255,255,255,0.20);
    }
  }
  .detail-content{
    // height:8.2rem;
    padding-bottom:.3rem;
    ul{
      padding:.3rem 0;
      li{
        margin-bottom:.2rem;
        display:table;
        &:last-child{
          margin-bottom:0;
        }
        p{
          float:left;
        }
        p.title{
          width:1.12rem;
          height:.4rem;
          line-height:.4rem;
          text-align:justify;
          display:block;
          margin:0 .3rem;
          span{
            display: inline-block;
            padding-left: 100%;
          }
        }
        p.desc{
          display:block;
          width:auto;
          margin-right:.3rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
          color:#646464;
        }
      }
    }
  }
  .detail-footer{
    padding:.3rem;
    p{
      color: #939DB8;
    }
    .bets-number{
      margin-top:.2rem;
      font-size:.38rem;
      min-height:.53rem;
      line-height:.53rem;
      color:#939DB8;
      span{
        display:inline-block;
      }
      em{
        display:inline-block;
        width:1px;
        height:.3rem;
        background:#646464;
        margin:0 .1rem;
      }
    }
  }
  .cancel-order{
    display:block;
    width:4.4rem;
    height:.88rem;
    line-height: .88rem;
    text-align: center;
    border-radius: .08rem;
    background: #C83C4A;
    color:#c7c7c7;
    position: relative;
    font-size:.32rem;
    margin:.3rem auto;
  }
  
  .chase-list{
    width:6.9rem;
    margin:0 .3rem;
    li{
      width: 100%;
      background: #292932;
      border: .02rem solid #303040;
      border-radius: .08rem;
      overflow: hidden;
      margin-bottom:.3rem;
    }
    table{
      width:100%;
      border-collapse: collapse;
      color:#646464;
      .thead{
        td{
          text-align:center;
          color:#c7c7c7;
        }
      }
      tr{
        height:1rem;
        border-bottom: .02rem solid #303040;
        td{
          text-align:center;
          width:2.3rem;
          padding:.3rem 0;
          // padding-left:.3rem;
          border-right: .02rem solid #303040;
        }
        // td.td-title{
        //   width:1.72rem;
        //   border-right: .02rem solid #303040;
        // }
      }
      tfoot{
        tr{
          height:1.24rem;
          border-bottom:none;
        }
        td{
          span{
            width:1.52rem;
            height:.64rem;
            float:right;
            margin-right:.3rem;
            text-align:center;
            line-height:.64rem;
            border-radius: .08rem;
          }
          .detail-span{
            color:#C83C4A;
            border: .01rem solid #C83C4A;
          }
        }
      }
    }
  }
}
</style>


