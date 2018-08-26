<template>
  <div class="reward-wrap reward-list" v-loading="loading">
    <table>
      <tbody>
        <tr>
          <th class="title-top"></th>
          <th class="title-top">类型</th>
          <th class="title-top">奖金组</th>
          <th class="title-top">玩法</th>
        </tr>
        <tr>
          <td :rowspan="tables.size+1">彩票</td>
        </tr>
        <tr v-for="item in tables.items" class="group-item">
          <td>{{item.name}}</td>
          <td>{{item.refund}}</td>
          <td>
            <router-link :to="{name:'rewardDetail',query:{id:item._id,refund:item.refund}}" target="_blank">查看详情
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import request from '../axios/axios';

  export default {
    data() {
      return {
        loading: false,
        tables: {
          size: 0,
          items: []
        }
      }
    },
    methods: {
      //获取奖金组列表
      getTables() {
        let self = this;
        let url = '/lottery/user/refund/list';
        this.loading = true;
        request.http('get', url, {},
          (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.tables.items = success.data;
                self.tables.size = success.data.length;
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
      },
    },
    mounted() {
      this.getTables();
    }
  }
</script>
<style scoped>
  .reward-wrap {
    padding: 30px 20px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 500px;
  }

  .reward-list table {
    width: 100%;
  }

  table,
  th,
  td {
    border: 1px solid #DADADA;
    border-collapse: collapse;
    font-size: 14px;
    color: #333;
  }

  .reward-list .title-top {
    height: 34px;
    background: #D4914D;
    color: #fff;
    font-size: 14px;
  }

  .reward-list tr {
    background: #fff;
  }

  .reward-list td>a {
    display: inline-block;
    height: 25px;
    border-radius: 6px;
    font-family: MicrosoftYaHei;
    line-height: 25px;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    color: #333;
  }

  .reward-list td {
    height: 42px;
    line-height: 42px;
  }

  .reward-list .col1 {
    width: 180px;
  }

  .reward-list .col2 {
    width: 242px;
  }

  .reward-list .col3 {
    width: 312px;
  }

  .reward-list col4 {
    width: 252px;
  }
</style>