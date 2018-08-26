<template>
  <div class="notice-wrap">
    <div class="main">
      <div v-if="noResult" class="no-result" v-cloak>
        <p>暂无数据</p>
      </div>
      <div v-else v-cloak>
        <ul>
          <li v-for="(item,index) in msg" class="row" :key="index">
            <router-link :to="{name:'noticeDetail',query:{id:item._id}}" target="_blank" class="row-link">
              <span class="left">{{item.title}}</span>
              <span class="right">{{formatTime(item.create_at)}}</span>
            </router-link>
          </li>
        </ul>
        <div class="record-pagination clearfix pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '../axios/axios';
  import moment from "moment";

  export default {
    name: "notice",
    data() {
      return {
        loading: false,
        msg: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 10, //单页条数
      }
    },
    methods: {
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getNotices();
      },
      //获取公告列表
      getNotices() {
        let self = this;
        let url = '/notice/list';
        this.loading = true;
        request.http('get', url, {
            pagenum: self.pageIndex,
            pagesize: self.pageSize
          },
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.total = success.data.total;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.data.total_page_num;
                  self.msg = success.data.data;
                } else {
                  self.noResult = true;
                }
              } else {
                self.noResult = true;
                self.msg = [];
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          (error) => {
            self.loading = false;
            self.noResult = true;
            self.msg = [];
            console.log('数据异常', error)
          })
      },
      formatTime(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },
    mounted() {
      // if (this.$store.state.notices.length == 0) {
      // }
      this.getNotices();
    }
  }
</script>

<style scoped>
  .no-result p {
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
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

  .notice-wrap {
    position: relative;
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
  }

  .main {
    width: 100%;
    min-height: 600px;
    background: #fff;
    position: relative;
  }

  .row {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    width: 100%;
    padding: 0 2px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  /* .row:nth-child(2n+1) {
    background: #FFF7EF;
  } */

  .row .row-link {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #191919;
    width: 100%;
    display: inline-block;
  }

  .pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>