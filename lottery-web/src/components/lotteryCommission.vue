<!--彩票佣金-->
<template>
  <div class="commission-wrap">
    <form class="record-options search-form" action="">
      <div class="option-row mb-20">
        <span class="exp w-60">时间：</span>
        <el-date-picker v-model="date.from" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <span class="exp">至</span>
        <el-date-picker v-model="date.to" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        <a class="time ml-20">今日</a>
        <a class="time ml-20">本周</a>
        <a class="time ml-20">本月</a>
        <a class="time ml-20">近一月</a>
        <a class="search ml-20">查询</a>
      </div>
      <div class="option-row mb-30">
        <span class="exp w-60">用户名：</span>
        <el-input placeholder="请输入内容" v-model="username" clearable style="width:114px">
        </el-input>
        <span class="exp ml-20">佣金类型：</span>
        <el-select v-model="commission.value" clearable placeholder="请选择" style="width:114px">
          <el-option v-for="item in commission.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </form>
    <hr class="user-split-line">
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th colspan="2">编号</th>
          <th>时间</th>
          <th>帐变类型</th>
          <th>变动金额</th>
          <th>余额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in 2" class="group-item" :key="index">
          <td colspan="2">E678936787</td>
          <td>2018-04-30 16:30:20</td>
          <td>游戏工资</td>
          <td>￥2000.89元</td>
          <td>￥2000.89元</td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本页小结</td>
          <td>本月资金变动</td>
          <td></td>
          <td></td>
          <td>0.0000</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="record-pagination clearfix">
      <span>第一页，共2条</span>
      <a>>></a>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //form Start
        //开始结束时间
        date: {
          from: '',
          to: '',
        },
        username: '',
        //佣金类型
        commission: {
          options: [],
          value: ''
        }
        //form End
      }
    }
  }
</script>
<style scoped>
  .mb-30 {
    margin-bottom: 30px;
  }

  .w-60 {
    width: 60px;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
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

  .commission-wrap {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .commission-wrap .record-options {
    background: #FFFFFF;
  }

  .commission-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
    color: #191919;
  }

  .commission-wrap .record-options .option-row {
    text-align: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .commission-wrap .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
  }

  .commission-wrap .record-options .option-row>a.time:hover {
    background: #D4914D;
    color: #fff;
  }

  .search {
    width: 80px;
    height: 30px;
    background: #C83A4C;
    color: #fff;
    display: inline-block;
    line-height: 30px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    text-align: center;
    border-radius: 2px;
  }

  .commission-wrap .record-group {
    width: 944px;
    margin: 0 auto;
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
  }

  .commission-wrap .record-group .group-title {
    background: #f6f6f6;
    color: #777;
  }

  .commission-wrap .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    /* height: 34px; */
    padding: 15px 0;
  }

  /* .commission-wrap .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  } */

  .commission-wrap .record-group .group-item {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #DDDDDD;
    font-size: 12px;
  }

  .commission-wrap .record-group .group-item a {
    width: 69px;
    height: 32px;
    background: #C38755;
    color: #fff;
    display: inline-block;
    line-height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .commission-wrap .record-group .group-item a.success {
    background: #E1701D;
    font-size: 12px;
    width: 75px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
  }

  .commission-wrap .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .commission-wrap .record-group .group-item:nth-child(2n+1) {
    /* background: #F7F7F7; */
  }

  .commission-wrap .record-group .record-bottom {
    width: 100%;
    background: #f6f6f6;
    margin-top: 74px;
  }

  .commission-wrap .record-group .record-bottom .group-item {
    height: 50px;
    line-height: 50px;
    background: inherit;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .record-pagination {
    padding: 30px 0;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  .record-pagination>a {
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
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
  }
</style>
<link/>