<template>
  <div class="content">
    <div class="order-detail-wrap">
      <user-menu></user-menu>
      <div class="main">
        <div class="top-bar">
          <span>当前位置：</span>
          <span>投注记录</span>
          <i class="iconfont icon-Right"></i>
          <a @click="previous">追号记录</a>
          <i class="iconfont icon-Right"></i>
          <span>追号详情</span>
        </div>
        <div class="project-content">
          <ul class="tabs">
            <li class="tab-title active">
              <router-link :to="{ name:'trackDetail'}">追号详情</router-link>
            </li>
          </ul>
          <div class="wrap-inner">
            <table class="groups" v-cloak>
              <tbody>
                <tr class="group-row">
                  <td>游戏：{{result.gamename}}</td>
                  <td>追号编号：{{result.order_no}}</td>
                </tr>
                <tr class="group-row">
                  <td>玩法：{{result.lotteryname}}</td>
                  <td>追号时间：{{getVoteTime}}</td>
                </tr>
                <tr class="group-row">
                  <td>开始期号：{{result.start_issue_no}}</td>
                  <td>追号期数：{{result.issue_num}}</td>
                </tr>
                <tr class="group-row">
                  <td>完成期数：{{result.issue_num_finished}}</td>
                  <td>取消期数：{{result.issue_num_canceled}}</td>
                </tr>
                <tr class="group-row">
                  <td>追号金额：{{result.vote_cash}}</td>
                  <td>完成金额：{{result.vote_cash_finished}}</td>
                </tr>
                <tr class="group-row">
                  <td>取消金额：{{result.vote_cash_canceled}}</td>
                  <td>中奖金额：{{result.award_cash}}</td>
                </tr>
                <tr class="group-row">
                  <td>追号状态：{{getDetailZHStatus}}</td>
                  <td>模式：{{result.unit}}</td>
                </tr>
                <tr class="group-row">
                  <td>追号奖金组：{{result.refund}}</td>
                  <td>中奖后终止任务：{{getHitStop}}</td>
                </tr>
              </tbody>
            </table>
            <div class="area">
              <p class="title">投注内容</p>
              <div class="content">
                {{result.vote_no}}
              </div>
              <div class="step" v-if='result.status == 1 && self == 1'>
                <a class="step-link" @click="cancelChase()">
                  终止追号
                </a>
              </div>
            </div>
            <table class="record-group">
              <thead>
                <tr class="group-title">
                  <th>奖期</th>
                  <th>追号内容</th>
                  <th>追号倍数</th>
                  <th>投注金额</th>
                  <th>追号状态</th>
                  <th>中奖</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" class="group-item" v-if="!noResult" :key="index">
                  <td>{{item.issue_no}}</td>
                  <td>{{item.vote_no}}</td>
                  <td>
                    {{item.times}}
                  </td>
                  <td>{{item.vote_cash}}</td>
                  <td>{{getItemZHStatus(item.status)}}</td>
                  <td>{{getStatusText(item.status)}}</td>
                  <td>
                    <a @click="cancelVote(item._id)" v-if="(item.status === 1 || item.status === 2) && self == 1">取消投注</a>
                    <router-link :to="{name:'lotteryDetail',query:{id:item._id}}" v-else>详情</router-link>
                  </td>
                </tr>
                <tr v-if="noResult" class="no-result">
                  <td colspan="10">
                    <p>没有符合条件的记录，请更改查询条件</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from '../axios/axios';
  import moment from 'moment';
  import { getStatusDesc } from '../common/trackStatus';
  import * as status from '../common/lotteryStatus';

  export default {
    name: "orderDetail",
    components: {
      UserMenu,
    },
    data() {
      return {
        loading: false,
        //详情
        result: {},
        //列表
        list: {},
        noResult: true,
        pageIndex: 1, //当前页
        pageSize: 1000, //单页条数
        self: '' // 自己或者下级 1 自己 0 下级 number类型
      }
    },
    methods: {
      previous() {
        this.$router.push({ name: 'trackRecord' });
      },
      //获取追号记录表
      getList(id) {
        let self = this;
        let url = '/lottery/chase/luckno/detail';
        self.loading = true;
        request.http('get', url, { chaseid: id }, (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              self.noResult = false;
              self.list = success.data;
            }
          }
        }, (error) => {
          self.loading = false;
          self.noResult = true;
          console.log('error', error);
        })
      },
      //获取追号记录详情
      getDetail(id, own) {
        let self = this;
        this.loading = true;
        let url = '/lottery/chase/list';
        request.http('get', url, {
          page_size: 10,
          pageIndex: 1,
          begintime: '',
          endtime: '',
          _id: id,
          lotteryid: '',
          self: own
        }, (success) => {
          self.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              if (success.data && success.data.data[0]) {
                self.result = success.data.data[0];
              }
            }
          }
        }, (error) => {
          self.loading = false;
          console.log('error', error);
        })
      },
      getStatusText(status) {
        switch (status) {
          case 1:
            status = '待开奖';
            break;
          case 2:
            status = '-';
            break;
          case 3:
            status = '已撤销';
            break;
          case 4:
            status = '未中奖';
            break;
          case 5:
            status = '中奖';
            break;
        }
        return status;
      },
      getItemZHStatus(status) {
        switch (status) {
          case 1:
            status = '已投注';
            break;
          case 2:
            status = '等待中';
            break;
          case 3:
            status = '已撤销';
            break;
          case 4:
            status = '已投注';
            break;
          case 5:
            status = '已投注';
            break;
        }
        return status;
      },
      // 取消投注
      cancelVote(voteid) {
        let self = this;
        let url = "/lottery/issue/vote/cancel";
        this.loading = true;
        request.http(
          "get",
          url, { voteid: voteid },
          success => {
            this.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$alert('<div class="lottery-title">撤单成功</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.previous();
                  }
                })
              } else if (success.returncode == 301) {
                self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {}
                })
              } else if (success.returncode == 302) {
                self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {}
                })
              }
            }
          },
          error => {
            this.loading = false;
            console.log("error", error);
            self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
              confirmButtonText: '确定',
              center: true,
              dangerouslyUseHTMLString: true,
              customClass: "syxw-wrap-inner",
              callback: action => {}
            })
          }
        );
      },
      // 取消追号
      cancelChase() {
        let chaseid = this.$route.query.id;
        let self = this;
        let url = "/lottery/chase/cancel";
        this.loading = true;
        request.http(
          "get",
          url, { chaseid: chaseid },
          success => {
            this.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$alert('<div class="lottery-title">撤单成功</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {
                    self.previous();
                  }
                })
              } else if (success.returncode == 301) {
                self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {}
                })
              } else if (success.returncode == 302) {
                self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  dangerouslyUseHTMLString: true,
                  customClass: "syxw-wrap-inner",
                  callback: action => {}
                })
              }
            }
          },
          error => {
            this.loading = false;
            console.log("error", error);
            self.$alert('<div class="lottery-title">撤单失败，请联系管理员</div>', '系统提示', {
              confirmButtonText: '确定',
              center: true,
              dangerouslyUseHTMLString: true,
              customClass: "syxw-wrap-inner",
              callback: action => {}
            })
          }
        );
      }
    },
    mounted() {
      if (this.$route.query.id) {
        if (this.$route.query.hasOwnProperty('self')) {
          this.self = this.$route.query.self;
          this.getDetail(this.$route.query.id, this.$route.query.self);
        } else {
          this.self = 1;
          this.getDetail(this.$route.query.id, 1);
        }
        this.getList(this.$route.query.id);
      } else {
        this.$alert('<div class="lottery-title">当前编号不存在</div>', '系统提示', {
          confirmButtonText: '确定',
          center: true,
          dangerouslyUseHTMLString: true,
          customClass: "syxw-wrap-inner",
          callback: action => {}
        })
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    },
    computed: {
      getVoteTime() {
        return moment(this.result.create_at).format('YYYY-MM-DD HH:mm:ss');
      },
      getHitStop() {
        let hitStop = '';
        switch (this.result.is_hit_stop) {
          case 1:
            hitStop = '是';
            break;
          case 0:
            hitStop = '否';
            break;
        }
        return hitStop;
      },
      getDetailZHStatus() {
        return getStatusDesc(this.result.status);
      }
    }
  }
</script>

<style scoped lang="scss">
  .no-result p {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .project-content {
    padding: 30px 20px;

    .wrap-inner {
      min-height: 731px;
      color: #333333;
      width: 100%;
      padding: 30px 20px;
      border: 1px solid #ddd;
    }
  }

  .record-group {
    width: 100%;
    /* margin: 0 auto; */
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
    margin-top: 60px;
  }

  .record-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
  }

  /* .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  } */

  .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #C83A4C;
    color: #fff;
    display: block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    overflow-x: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
    margin: 0 auto;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #f6f6f6;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 50px;
    line-height: 50px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
  }

  table,
  td {
    border-collapse: collapse;
  }

  .order-detail-wrap {
    font-family: MicrosoftYaHei;
    color: #191919;
    margin: 0 auto;
    width: 1090px;
    position: relative;
  }

  .main {
    width: 1024px;
    margin: 0 auto;
    min-height: 600px;
    background: #fff;
    padding-bottom: 20px;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    padding: 30px 20px 0;
    text-align: left;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .main .number-list {
    text-align: center;
    margin-top: 30px;
  }

  .main .number-list .list-item {
    background: #CC3447;
    border: 1px solid #DFE2E3;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 40px;
    color: #FFFFFF;
    line-height: 46px;
    font-weight: 700;
    width: 48px;
    height: 48px;
    margin-right: 10px;
    display: inline-block;
  }

  .groups {
    width: 500px;
    margin: 60px auto 0;
  }

  .groups .group-row {
    border-bottom: 1px solid #dfdfdf;
    font-size: 14px;
  }

  .groups .group-row:last-child {}

  .groups .group-row td {
    padding: 10px 0;
    text-align: left;
    width: 50%;
    font-size: 12px;
    color: #191919;
    font-family: PingFangSC-Regular;
  }

  .area {
    width: 500px;
    margin: 60px auto 0;
  }

  .area .title {
    font-size: 16px;
    text-align: left;
  }

  .area .content {
    width: 100%;
    height: 200px;
    text-align: left;
    padding: 10px;
    margin-top: 20px;
    background: #FFFFE1;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;
    word-break: normal;
    width: auto;
    word-wrap: break-word;
    overflow-y: scroll;
  }

  .area .step {
    margin: 60px 0 0;
    text-align: center;
    width: 100%;
  }

  .area .step .step-link {
    width: 115px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 auto;

    &.back {
      background: #777777;
    }
  }

  .tabs {
    height: 40px;
    line-height: 40px;
    display: flex;

    .tab-title {
      width: 100px;
      background: #d8d8d8;
      color: #191919;
      margin-right: 20px;
      border-radius: 4px 4px 0 0;
      text-align: center;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      cursor: pointer;
      position: relative;

      >a {
        font-size: 14px;
        color: #191919;
        outline: none;
        text-decoration: none;
      }

      a {
        display: block;
      }

      &:hover>a {
        color: #847b5f;
      }

      &.active {
        color: #bd8454;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #ddd;
        border-bottom: none;
        border-radius: 4px 4px 0 0;

        >a {
          color: #bd8454;
        }
      }
    }
  }
</style>