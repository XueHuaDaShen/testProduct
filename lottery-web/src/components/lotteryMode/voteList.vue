<template>
  <div>
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
          <tr v-for="(item, index) in voteDataList" :key="index">
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
            <th :class="item.status==5?'zhongjiang':''">{{getVoteStatus(item.status)}}</th>
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
            <th>{{getChaseStatus(item.status)}}</th>
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
</template>
<script>
import { getVoteStatus, getChaseStatus } from '@/common/filterStatus.js';
export default {
  name: 'voteList',
  props: {
    isShowData: {
      type: Boolean,
      required: true
    },
    voteDataList: {
      type: Array,
      required: true
    },
    chaseDataList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      getVoteStatus: getVoteStatus,
      getChaseStatus: getChaseStatus,
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang="scss" scoped>

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
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    color: #191919;
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
</style>


