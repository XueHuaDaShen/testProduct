<template>
  <div class="lottery-wrap">
    <div class="record-tabs">
      <a class="tab-item active">游戏记录</a>
      <a class="tab-item">追号记录</a>
    </div>
    <form class="record-options search-form" action="">
      <div class="option-row">
        <span class="exp">游戏时间：</span>
        <el-date-picker v-model="date.from" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker>
        &nbsp;&nbsp; 至 &nbsp;&nbsp;
        <el-date-picker v-model="date.to" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间">
        </el-date-picker> &nbsp;&nbsp;
        <a class="time">今日</a>&nbsp;
        <a class="time">本周</a>&nbsp;
        <a class="time">本月</a>&nbsp;
        <!-- <a class="time">近三日</a>&nbsp; -->
        <!-- <a class="time">近半月</a>&nbsp; -->
        <a class="time">近一月</a>
      </div>
      <div class="option-row">
        <span class="exp">注单编号：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="zdbh" clearable>
        </el-input>
        <span class="exp">奖励编号：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="jlbh" clearable>
        </el-input>
        <span class="exp">用户名：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="username" clearable>
        </el-input>
        <span class="exp">用户属性：</span>
        <el-select style="width:114px;" v-model="usertypes.value" clearable placeholder="请选择">
          <el-option v-for="item in usertypes.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        &nbsp;
      </div>
      <div class="option-row">
        <span class="exp">游戏名称：</span>
        <el-select style="width:114px;" v-model="gametypes.value" clearable placeholder="请选择">
          <el-option v-for="item in gametypes.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="exp">玩法：</span>
        <el-select style="width:114px;" v-model="playtypes.value" clearable placeholder="请选择">
          <el-option v-for="item in playtypes.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="option-row">
        <span class="exp">状态：</span>
        <el-checkbox-group v-model="checkList" class="inline">
          <el-checkbox label="有效投注（未开奖）"></el-checkbox>
          <el-checkbox label="已撤单"></el-checkbox>
          <el-checkbox label="未中奖"></el-checkbox>
          <el-checkbox label="系统撤销"></el-checkbox>
          <el-checkbox label="超额撤单"></el-checkbox>
          <el-checkbox label="管理撤单"></el-checkbox>
        </el-checkbox-group>
      </div>
    </form>
    <hr class="user-split-line">
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>投注总额</th>
          <th>有效投注</th>
          <th>派奖总额</th>
          <th>投注返点</th>
          <th>游戏盈亏</th>
        </tr>
        <tr v-for="(item,index) in 1" class="group-item" :key="index">
          <td>yuuuume</td>
          <td>0.3100</td>
          <td>0.3100</td>
          <td>0.0000</td>
          <td>0.0000</td>
          <td class="success">-0.3100</td>
        </tr>
      </tbody>
    </table>
    <table class="record-group">
      <thead>
        <tr class="group-title">
          <th>用户名</th>
          <th>游戏</th>
          <th>编号</th>
          <th>奖期</th>
          <th>玩法</th>
          <th>投注内容</th>
          <th>注数比例</th>
          <th>投注额</th>
          <th>奖金</th>
          <th>奖金组-返点</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in 2" class="group-item" :key="index">
          <td>yuuuume</td>
          <td>重庆时时彩</td>
          <td>
            <a>dceb6...</a>
          </td>
          <td>180421059</td>
          <td>五星组选30</td>
          <td>
            <a>详细号码</a>
          </td>
          <td>4.16%</td>
          <td>0.3100</td>
          <td>0.0000</td>
          <td>1800 - 0.00%</td>
          <td>未中奖</td>
        </tr>
      </tbody>
      <tfoot class="record-bottom">
        <tr class="group-item">
          <td>本页小结</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>0.3100</td>
          <td>0.0000</td>
          <td></td>
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
        //游戏名称
        gametypes: {
          value: '',
          options: [{
            value: '选项1',
            label: '所有游戏'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
        },
        //玩法
        playtypes: {
          value: '',
          options: [{
            value: '选项1',
            label: '所有类型'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
        },
        //用户属性
        usertypes: {
          value: '',
          options: [{
            value: '选项1',
            label: '属性1'
          }, {
            value: '选项2',
            label: '属性2'
          }, {
            value: '选项3',
            label: '属性3'
          }, {
            value: '选项4',
            label: '属性4'
          }],
        },
        //状态
        checkList: ['已撤单'],
        //注单编号
        zdbh: '',
        //奖励编号
        jlbh: '',
        //用户名
        username: ''
        //form End
      }
    }
  }
</script>
<style scoped>

  .user-split-line{
    background: #ddd;
    width:944px;
    height:1px;
    border:none;
    margin-bottom:30px;
    margin-left:20px;
  }
  .no-result p {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }

  .inline {
    display: inline-block;
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

  .lottery-wrap .record-options .option-row .exp {
    display: inline-block;
    margin: 0 5px;
    margin-left:15px;
    font-size: 12px;
  }

  .lottery-wrap {
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  .record-tabs {
    width: 192px;
    height: 44px;
    background: rgba(212, 145, 77, 1);
    border-radius: 4px;
    padding: 5px;
    display: table;
  }

  .record-tabs .tab-item {
    width: 88px;
    height: 34px;
    display: table-cell;
    vertical-align: middle;
    line-height: 34px;
    color: #fff;
  }

  .record-tabs .tab-item.active {
    background: #F9EFEF;
    border-radius: 4px;
    color: #333;
  }

  table,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }

  .record-options {
    padding: 30px 0 10px 0;
    background: #FFFFFF;
  }

  .record-options .option-row {
    text-align: left;
    margin-bottom: 20px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .record-options .option-row>input[type="text"] {
    display: inline-block;
    width: 158px;
    height: 30px;
    line-height: 30px;
    padding: 4px 5px;
    border: 1px solid #8D8D8D;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #FFFFFF;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all .2s;
    margin: 0 14px;
  }

  .record-options .option-row>a {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: auto;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    border: 1px solid #D4914D;
    margin-right: 3px;
  }

  .record-options .option-row>a:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group {
    width: 944px;
    margin: 0 auto;
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
    padding:15px 0;
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
    background: #C38755;
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

  .record-options .option-row>a.time {
    display: inline-block;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #8D8D8D;
    text-align: center;
    margin-right: 20px;
  }

  .record-options .option-row>a.time:hover {
    background: #C83A4C;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    /* background: #fff; */
  }

  .record-group .group-item:nth-child(2n+1) {
    /* background: #F7F7F7; */
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

  .success {
    color: #099F4C;
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

  .record-options .option-row>a.submit {
    position: relative;
    display: inline-block;
    width:80px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    /* vertical-align: middle; */
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    font-family: microsoft yahei;
    background-color: #C83A4C;
    border: 1px solid #CCC;
    box-shadow: none;
    /* margin-left: 20px; */
  }
</style>