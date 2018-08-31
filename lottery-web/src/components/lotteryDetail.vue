<template>
  <div class="content">
    <div class="order-detail-wrap">
      <user-menu></user-menu>
      <div class="main" v-loading="loading">
        <div class="top-bar">
          <span>当前位置：</span>
          <span>投注记录</span>
          <i class="iconfont icon-Right"></i>
          <a @click="previous">彩票记录</a>
          <i class="iconfont icon-Right"></i>
          <span>游戏详情</span>
        </div>
        <div class="project-content">
          <ul class="tabs">
            <li class="tab-title active">
              <router-link :to="{ name:'lotteryDetail'}">游戏详情</router-link>
            </li>
          </ul>
          <div class="wrap-inner">
            <div class="number-list" v-cloak v-if="result.luck_no">
              <span class="list-item" v-for="(i,index) in getVoteNo(result.luck_no)" :key="index">{{i}}</span>
            </div>
            <table class="groups" v-cloak>
              <tbody>
                <tr class="group-row">
                  <td>游戏：{{result.gamename}}</td>
                  <td>注单编号：{{result.order_no}}</td>
                </tr>
                <tr class="group-row">
                  <td>玩法：{{result.lotteryname}}</td>
                  <td>投注时间：{{getTime(result.create_at)}}</td>
                </tr>
                <tr class="group-row">
                  <td> 期号：{{result.issue_no}}</td>
                  <td>倍数：{{result.times}}倍</td>
                </tr>
                <tr class="group-row">
                  <td> 注数：{{result.times}}</td>
                  <td> 投注返点：{{result.refund}}</td>
                </tr>
                <tr class="group-row">
                  <td> 模式：{{result.unit}}</td>
                  <td>投注金额：{{result.vote_cash}}元</td>
                </tr>
                <tr class="group-row">
                  <td> 状态：{{getStatus(result.status)}}</td>
                  <td>奖金：{{result.award_cash?result.award_cash+'元':'无'}}</td>
                </tr>
              </tbody>
            </table>
            <div class="area">
              <p class="title">投注内容</p>
              <div class="content">
                {{result.vote_no}}
              </div>
              <div class="step">
                <a class="step-link" @click="previous">
                  返回
                </a>
                <a class="step-link back" @click="cancelVote()" v-if='result.status == 1 || result.status == 2'>
                  撤单
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from "../axios/axios";
  import { getStatusDesc } from "../common/lotteryStatus";
  import moment from "moment";

  export default {
    name: "orderDetail",
    components: {
      UserMenu
    },
    data() {
      return {
        loading: false,
        result: {}
      };
    },
    methods: {
      getTime(time) {
        return moment(time).format("YYYY-MM-DD , HH:mm:ss");
      },
      previous() {
        this.$router.push({
          name: "lotteryRecord"
        });
      },
      getDetail(id) {
        let self = this;
        let url = "/lottery/issue/vote/detail";
        this.loading = true;
        request.http(
          "get",
          url, { voteid: id },
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
                this.result = success.data;
              }
            }
          },
          error => {
            this.loading = false;
            console.log("error", error);
          }
        );
      },
      getStatus(value) {
        return getStatusDesc(value);
      },
      getVoteNo(no) {
        if (no) {
          let arr = no.split(",");
          return arr;
        }
      },
      // 取消投注
      cancelVote() {
        let voteid = this.$route.query.id;
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
                self.$alert("撤单成功", "系统提示", {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {
                    self.previous();
                  }
                });
              } else if (success.returncode == 301) {
                self.$alert("撤单失败，请联系管理员", "系统提示", {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {}
                });
              } else if (success.returncode == 302) {
                self.$alert("撤单失败，请联系管理员", "系统提示", {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {}
                });
              }
            }
          },
          error => {
            this.loading = false;
            console.log("error", error);
            self.$alert("撤单失败，请联系管理员", "系统提示", {
              confirmButtonText: "确定",
              center: true,
              callback: action => {}
            });
          }
        );
      },
    },
    mounted() {
      if (this.$route.query.id) {
        this.getDetail(this.$route.query.id);
      } else {
        this.$alert("当前编号不存在", "系统提示", {
          confirmButtonText: "确定",
          center: true,
          callback: action => {}
        });
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>

<style scoped lang="scss">
  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
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
    min-height: 600px;
    background: #fff;
    margin: 0 auto;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    /* border-bottom: 1px solid #DADADA; */
    /* padding-left: 20px; */
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

  .groups .group-row:last-child {
    // border-bottom: none;
  }

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
    padding-bottom: 20px;
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