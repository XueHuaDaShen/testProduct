<template>
  <div v-loading="loading" class="activity-wrap">
    <div class="header">
      <div class="title">
        <div>
          <span class="v-line"></span>
          <span class="text">精彩活动</span>
        </div>
        <router-link :to="{name:'activityList'}" class="more">更多活动</router-link>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col class="grid-content" v-for="(item,index) in result" :key="index" v-if="!noResult">
        <router-link :to="{name:'activityDetail',query:{id:item._id}}" :title="item.title">
          <img :src="item.activity_photo" class="a1">
          <div class="label-tag">{{item.open | filterStatus}}</div>
        </router-link>
      </el-col>
      <p class="no-result" v-if="noResult">暂无活动</p>
    </el-row>
  </div>
</template>
<script>
  import request from '../axios/axios';

  export default {
    data() {
      return {
        loading: false,
        result: [],
        noResult: false,
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
      getActivities() {
        let self = this;
        let url = "/activity/list";
        self.loading = true;
        request.http(
          "get",
          url, { page_num: 1, page_size: 3 },
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              if (success.data.total != 0) {
                let data = success.data.data;
                data.sort(self.compare("order"));
                let part = [];
                for (let i = 0; i < data.length; i++) {
                  if (i < 3) {
                    part.push(data[i]);;
                  }
                }
                self.result = part;
                self.noResult = false;
              } else {
                self.$message({
                  showClose: true,
                  message: "系统出错，请联系管理员",
                  type: "error"
                });
                self.result = [];
                self.noResult = true;
              }
            } else if (success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$message({
                showClose: true,
                message: success.data.msg,
                type: "error"
              });
            }
          },
          error => {
            self.loading = false;
            self.result = [];
            self.noResult = true;
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
          }
        );
      }
    },
    filters: {
      filterStatus(val) {
        switch (val) {
          case 1:
            return "进行中";
          case 2:
            return "未开始";
          case 3:
            return "已结束";
        }
      }
    },
    mounted() {
      this.getActivities();
    }
  }
</script>
<style scoped>
  .no-result {
    margin-top: 30px;
    text-align: center;
    width: 100%;
    color: #191919;
  }

  .v-line {
    display: inline-block;
    width: 4px;
    height: 25px;
    border-right: 4px solid #BD8454;
    vertical-align: middle;
    margin-right: 10px;
  }

  .grid-content {
    width: 314px;
    height: 215px;
    cursor: pointer;
  }

  .grid-content>a {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    /* border-radius: 4px; */
  }

  .a1 {
    display: block;
    height: 100%;
    width: 100%;
    /* opacity: 0.6; */
    transition: all 0.3s ease-in;
  }

  .a1:hover {
    transform: scale(1.1);
  }

  .a2:hover {
    transform: scale(1.1);
  }

  .a3:hover {
    transform: scale(1.1);
  }

  .a2 {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    transition: all 0.3s ease-in;
  }

  .a3 {
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    transition: all 0.3s ease-in;
  }

  .a1:hover {
    /*background: #18A4F3;*/
    opacity: 1;
  }

  .a2:hover {
    /*background: #D54C4C;*/
    opacity: 1;
  }

  .a3:hover {
    /*background: #AB189F;*/
    opacity: 1;
  }

  .label-tag {
    position: absolute;
    left: 0;
    top: 10px;
    font-family: PingFangSC-Semibold;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0.75px;
    background: rgba(0, 0, 0, 0.80);
    border-bottom-right-radius: 40px;
    border-top-right-radius: 40px;
    height: 26px;
    width: 80px;
    line-height: 26px;
  }

  .activity-wrap {
    width: 100%;
    height: 300px;
    background: #F4F4F4;
    padding: 20px;
    padding-top: 0;
    margin-top: 20px;
  }

  .activity-wrap:hover {
    box-shadow: 0 2px 4px #000;
  }

  .activity-wrap .header {
    height: 65px;
    padding: 20px 0;
    background-size: 100% 100%Z;
    background: #F4F4F4;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .title {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #BD8454;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .title .more {
    font-size: 16px;
    color: #BD8454;
    text-decoration: underline;
    font-weight: bold;
  }

  .activity-wrap .main {
    width: 100%;
    height: 465px;
    padding: 20px;
  }

  .activity-wrap .main span {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.75px;
  }

  .activity-wrap .main li {
    list-style: none;
    text-align: left;
  }

  .activity-wrap .main li:first-child {
    padding-top: 0;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>