<template>
  <div class="mail-wrap">
    <div v-if="noResult" class="no-result" v-cloak>
      <p>暂无数据</p>
    </div>
    <div class="main" v-else v-cloak>
      <table class="mail-group">
        <thead>
          <tr class="group-title">
            <th>主题</th>
            <th>发件人</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in msg" class="group-item" v-cloak :key="index">
            <td>
              <router-link :to="{name:'mailDetail',query:{id:item._id}}">{{item.topic}}
                <span class="status-tip" v-if="item.status && item.status === '2'">已读</span>
              </router-link>
            </td>
            <td>系统</td>
            <td>{{formatTime(item.create_at)}}</td>
            <td>
              <a @click='updateMsg(item._id,"3")' class="action">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="record-pagination clearfix pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios';
  import moment from 'moment';

  export default {
    name: "mail",
    data() {
      return {
        loading: false,
        msg: [],
        noResult: false,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 10, //单页条数
      }
    },
    methods: {
      // status:  { type: String ,default:1 },                
      // 状态： 1未读  2 已读   3已删除
      updateMsg(id, status) {
        let self = this;
        this.$confirm('确定删除该条消息么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/user/message/update';
          self.loading = true;
          request.http('post', url, {
              id: id,
              status: status
            },
            (success) => {
              self.loading = false;
              if (success.returncode) {
                if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                  request.loginAgain(self);
                } else if (success.returncode == 200) {
                  self.getMails();
                } else {
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
              console.log('数据异常', error)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getMails();
      },
      formatTime(value) {
        if (value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      //获取消息列表
      getMails() {
        let self = this;
        let url = '/user/message/list';
        this.loading = true;
        request.http('get', url, {
            page_num: self.pageIndex,
            page_size: self.pageSize
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
    },
    mounted() {
      // if (this.$store.state.notices.length == 0) {
      // }
      this.getMails();
    }
  }
</script>
<style scoped>
  .status-tip {
    background: #D8D8D8;
    border-radius: 4px;
    width: 38px;
    height: 22px;
    line-height: 22px;
    display: inline-block;
    margin-left: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 12px;
    color: #777777;
  }

  .main {
    width: 100%;
    min-height: 600px;
    background: #fff;
    position: relative;
  }

  .pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .no-result p {
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }

  a {
    text-decoration: none;
    color: #333333;
    cursor: pointer;
  }

  .mail-wrap {
    color: #333333;
    width: 100%;
    position: relative;
    padding: 20px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .mail-group {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .mail-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .mail-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    padding: 15px 0;
  }

  .mail-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .mail-group .group-item a.action {
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

  /* .mail-group .group-item:nth-child(2n) {
    background: #FFF7EF;
  }

  .mail-group .group-item:nth-child(2n+1) {
    background: #fff;
  } */

  .success {
    color: #099F4C;
  }

  .record-pagination {
    padding: 30px 0;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  .record-pagination>a {
    float: right;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #E9E9E9;
    margin-left: 11px;
    font-size: 12px;
  }

  .record-pagination>span {
    float: right;
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
  }
</style>