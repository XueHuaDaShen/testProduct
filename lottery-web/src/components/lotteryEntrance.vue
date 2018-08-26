<template>
  <div class="lottery-wrap">
    <div class="header">
      <div class="title" style="line-height:25px;">
        <span class="v-line"></span>
        <span class="text">彩票系列</span>
        <!-- <span class="en">LOTTERY</span> -->
      </div>
      <div class="title">
        <span class="text1">重庆时时彩:</span>
        <ul class="j-t-num">
          <li v-for="(item,index) in getIssue" :key="index">{{item}}</li>
        </ul>
        <router-link class="j-t-click" :to="{name:'lottery',query:{id:'5b03b1911279962a87186abc',p_code:'ssc',s_code:'cqssc'}}">来一注</router-link>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <div class="lottery-list clearfix">
        <div :span="12" v-for="lottery in getLotteryData" class="lottery-item" v-cloak :key="lottery.code">
          <dl>{{lottery.name}}</dl>
          <dt class="clearfix">
            <router-link :to="{name:item.code,query:{id:item._id,p_code:lottery.code,s_code:item.code}}" v-for="item in lottery.children" :key="item._id" :id="item.order">
              {{item.name}}
            </router-link>
          </dt>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';

  export default {
    data() {
      return {
        loading: false,
        issue: ''
      }
    },
    computed: {
      getLotteryData() {
        let self = this;
        let lotteryArr = this.$store.state.lotteryArr;
        let otherObj = {};
        let otherArr = [];
        let newArr = [];
        for (let i = 0; i < lotteryArr.length; i++) {
          let arrItem = lotteryArr[i];
          arrItem.children.sort(self.compare("order"));
          if (arrItem.code === 'pks' || arrItem.code === 'lhc' || arrItem.code === 'qt') {
            // console.log('arrItem.children', arrItem.children);
            otherArr = otherArr.concat(arrItem.children);
            continue;
          }
          newArr = newArr.concat(arrItem);
        }
        otherObj['name'] = 'PK10 ／ 六合彩 ／ 其他';
        otherObj['children'] = otherArr;
        newArr = newArr.concat(otherObj);
        // console.log(newArr);
        return newArr;
      },
      getIssue() {
        let luck_no = this.issue.split(',');
        return luck_no;
      }
    },
    methods: {
      // 排序
      compare(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        };
      },
      //彩票列表
      getLotteryList() {
        let self = this;
        self.loading = true;
        request.http('get', '/lottery/game/list', {},
          (success) => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              self.$store.dispatch('setLotteryArr', success.data)
            } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.loading = false;
            console.log('数据异常', error)
          })
      },
      //往期开奖结果
      getIssueList() {
        let self = this;
        let url = "/lottery/issue/list";
        self.loading = true;
        request.http(
          "get",
          url, { gameid: '5b03b1911279962a87186abc', page_num: 1, page_size: 100 },
          success => {
            self.loading = false;
            if (success.returncode && success.returncode == 200) {
              if (success.data) {
                if (success.data.data.length != 0) {
                  let data = success.data.data[0].luck_no;
                  self.issue = data;
                } else {
                  self.$message({
                    showClose: true,
                    message: "系统出错，请联系管理员",
                    type: "error"
                  });
                }
              }
            } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            }
          },
          error => {
            self.loading = false;
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
          }
        );
      },
    },
    mounted() {
      if (this.$store.state.lotteryArr.length == 0) {
        this.getLotteryList();
      }
      this.getIssueList();
    }
  }
</script>
<style scoped>
  a {
    text-decoration: none;
  }

  .mt2 {
    margin-top: 2px;
  }

  .lottery-wrap {
    width: 724px;
    height: 530px;
    float: left;
    margin-top: 20px;
    /* box-shadow: 0 2px 4px #000; */
    background: #F4F4F4;
  }

  .lottery-wrap:hover {
    box-shadow: 0 2px 4px #000;
  }

  .lottery-wrap .header {
    height: 65px;
    padding: 20px;
    background-size: 100% 100%Z;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #BD8454;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 25px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
  }

  .title .text {
    vertical-align: middle;
    display: inline-block;
    font-weight: 700;
  }

  .title .en {
    vertical-align: middle;
    display: inline-block;
    margin-left: 5px;
  }

  .title .text1 {
    font-size: 16px;
    color: #BD8454;
    vertical-align: middle;
    margin-right: 5px;
  }

  .j-t-num {
    display: inline-block;
    vertical-align: middle;
  }

  .j-t-num li {
    display: inline-block;
    font-size: 14px;
    width: 28px;
    line-height: 26px;
    height: 28px;
    list-style: none;
    border-radius: 50%;
    color: #BD8454;
    margin-right: 10px;
    border: 1px solid #BD8454;
    font-weight: 700;
  }

  .j-t-click {
    display: inline-block;
    vertical-align: middle;
    height: 34px;
    cursor: pointer;
    text-align: center;
    line-height: 34px;
    padding-left: 10px;
    padding-right: 9px;
    width: 72px;
    font-size: 14px;
    color: #FFFFFF;
    background: #BD8454;
    border-radius: 2px;
  }

  .lottery-wrap .main {
    /* height: 402px; */
    background: #F4F4F4;
  }

  .header-fl {
    float: left;
  }

  .header-fr {
    float: right;
  }

  .lottery-list dl {
    font-family: PingFangSC-Medium;
    letter-spacing: 0.88px;
    height: 20px;
    display: inline-block;
    text-align: left;
    margin: 20px 0;
    font-size: 16px;
    color: #000000;
  }

  .lottery-list .lottery-item {
    width: 50%;
    float: left;
    text-align: left;
    padding: 0 10px 10px 20px;
    border: 1px solid #ddd;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: -1px;
    margin-right: -1px;
    border-bottom: none;
  }

  .lottery-list dt a {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.75px;
    width: 100px;
    height: 34px;
    line-height: 32px;
    float: left;
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
  }

  .lottery-list dt a:hover {
    background: #C83A4C;
    color: #fff;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>