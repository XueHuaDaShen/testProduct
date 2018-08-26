<template>
  <div v-loading="loading" class="activity-wrap">
    <div class="ac-bg">
      <div class="row" v-if="!noResult">
        <div class="grid-content" v-for="(item,index) in result" :key="index">
          <router-link :to="{name:'activityDetail',query:{id:item._id}}" :title="item.title">
            <img :src="item.activity_photo" class="a1">
            <!-- <div class="label-tag">{{item.open | filterStatus}}</div> -->
            <div class="down-row">
              <div class="desc">
                <p class="top">{{item.title}}</p>
                <p class="bottom">{{item.create_at | filterTime}}</p>
              </div>
              <div class="status" :class="{'finished':item.open  == 3}">{{item.open | filterStatus}}</div>
            </div>
          </router-link>
        </div>
      </div>
      <p class="no-result" v-if="noResult">暂无活动</p>
    </div>
    <div class="record-pagination clearfix pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import moment from 'moment';

  export default {
    data() {
      return {
        loading: false,
        result: [],
        noResult: false,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 12, //单页条数
      }
    },
    methods: {
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getActivities();
      },
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
          url, { page_num: self.pageIndex, page_size: self.pageSize },
          success => {
            self.loading = false;
            if (success.returncode == 200) {
              self.total = success.data.total;
              if (self.total != 0) {
                let data = success.data.data;
                data.sort(self.compare("order"));
                self.result = data;
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
            } else if(success.returncode == 101 || success.returncode == 103 || success.returncode == 106) {
              request.loginAgain(self)
            } else {
              self.$alert(success.data.msg, "系统提示", {
                confirmButtonText: "确定",
                callback: action => {}
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
            return "即将开始";
          case 3:
            return "已结束";
        }
      },
      filterTime(time) {
        if (time) {
          return moment(time).format("YYYY-MM-DD , HH:mm:ss");
        }
        return "--"
      },
    },
    mounted() {
      this.getActivities();
    }
  }
</script>
<style scoped lang="scss">
  .no-result {
    margin-top: 30px;
    text-align: center;
    width: 100%;
    color: #191919;
  }

  .pagination {
    position: absolute;
    bottom: 20px;
    right: 0;
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
    width: 502px;
    height: 424px;
    cursor: pointer;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
  }

  .grid-content>a {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    text-decoration: none;
    .down-row {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .status {
        width: 115px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        text-align: center;
        background: #CC3447;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: 700;
        color: #FFFFFF;
        align-self: flex-start;
        &.finished {
          background: #777777;
        }
      }
      .desc {
        text-align: left;
        flex: 1;
        .top {
          font-family: PingFangSC-Regular;
          font-weight: 700;
          font-size: 18px;
          color: #191919;
          max-width: 342px;
          overflow: hidden;
        }
        .bottom {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #777777;
          margin-top: 5px;
          max-width: 342px;
          overflow: hidden;
        }
      }
    }
  }

  .a1 {
    display: block;
    height: 316px;
    width: 100%;
    opacity: 0.6;
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
    width: 1024px;
    margin: 0 auto;
    min-height: 600px;
    position: relative;
    .ac-bg {
      padding-bottom: 60px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  .activity-wrap .header {
    height: 65px;
    padding: 10px 0 20px;
    background-size: 100%;
    background: #fff;
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