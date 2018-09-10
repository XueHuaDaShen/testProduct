<template>
  <div class="dataCharts-wrap" :class="ligature?'showCanvas':''">
    <div class="charts-oprate-header">
      <el-select v-model="form.gameName.selected" placeholder="请选择游戏玩法" class="header-select">
        <el-option v-for="option in form.gameName.options" :key="option._id" :label="option.name" :value="option._id">
        </el-option>
      </el-select>
      <ul class="header-types">
        <li v-for="(item,index) in form.playGroup.options" :key="item._id" @click="playGroupItemToggle(index)" :class="{active:form.playGroup.active == index}">
          <a :data-value="item._id">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="charts-oprate-title">
      <div class="title-check-box">
        <el-checkbox v-model="auxiliary_line">辅助线</el-checkbox>
      </div>
      <div class="title-check-box">
        <el-checkbox v-model="missing">遗漏</el-checkbox>
      </div>
      <div class="title-check-box">
        <el-checkbox v-model="missing_article">遗漏条</el-checkbox>
      </div>
      <div class="title-check-box">
        <el-checkbox v-model="ligature">连线</el-checkbox>
      </div>
      <!-- <div class="title-check-box">
        <el-checkbox v-model="no_temperature">号温</el-checkbox>
      </div> -->
      <ul class="time-options">
        <li @click="timeOptionsToggle(index, item)" v-for="(item,index) in form.timeOptions.options" :key="index" :class="{active:form.timeOptions.active == index}">
          {{item.text}}
        </li>
      </ul>
      <div class="time-picker">
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        &nbsp;&nbsp; 至 &nbsp;&nbsp;
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker> &nbsp;&nbsp;
      </div>
      <a class="search-link" @click="onSubmit">搜索</a>
    </div>
    <div class="data-charts-table-wrap" id="table-canvas-warp" :class="missing_article?'table-lost-post':''">
      <table :class="missing?'':'table-lost'">
        <thead>
          <tr>
            <th rowspan="2" colspan="3" class="table-title-issue border-right">期号</th>
            <th colspan="3" class="table-title-lottery border-right">开奖号码</th>
            <th colspan="12" class="border-bottom border-right">万位</th>
            <th colspan="12" class="border-bottom border-right">千位</th>
            <th colspan="12" class="border-bottom border-right">百位</th>
            <th colspan="12" class="border-bottom border-right">十位</th>
            <th colspan="12" class="border-bottom border-right">个位</th>
            <th colspan="12" class="border-bottom border-right">号码分布</th>
          </tr>
          <tr>
            <th class="ball-none border-bottom-header"></th>
            <th>
              <label for="">
                <input type="checkbox">全部</label>
            </th>
            <th class="ball-none border-bottom-header border-right"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
          </tr>
        </thead>
        <tbody :class="auxiliary_line?'table-guides':''">
          <tr v-for="(item, index) in tableList" :key="index">
            <td class="ball-none"></td>
            <td class="issue-number">{{item.issue_no}}</td>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <td><span class="lot-nums">{{item.luck_no}}</span></td>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th :class="wan.lost" v-for="(wan, wanindex) in item.data[0].num" :key="'w'+wanindex"><i :class="wan.class" :id="wan.id">{{wan.num}}</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th :class="qian.lost" v-for="(qian, qianindex) in item.data[1].num" :key="'q'+qianindex"><i :class="qian.class" :id="qian.id">{{qian.num}}</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th :class="bai.lost" v-for="(bai, baiindex) in item.data[2].num" :key="'b'+baiindex"><i :class="bai.class" :id="bai.id">{{bai.num}}</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th :class="shi.lost" v-for="(shi, shiindex) in item.data[3].num" :key="'s'+shiindex"><i :class="shi.class" :id="shi.id">{{shi.num}}</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th :class="ge.lost" v-for="(ge, geindex) in item.data[4].num" :key="'g'+geindex"><i :class="ge.class" :id="ge.id">{{ge.num}}</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th v-for="(statusNum, statusNumindex) in item.data[5].num" :key="'status'+statusNumindex"><i :class="statusNum.class">{{statusNum.num}}</i></th>
            <td class="ball-none"></td>
          </tr>
          <!-- <tr>
            <td class="ball-none"></td>
            <td class="issue-number">1805100805</td>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <td><span class="lot-nums">87826</span></td>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i class="lotNumI">1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i>1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i>1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i>1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i>1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <th class="ball-none border-right"></th>
            <td class="ball-none"></td>
            <th><i>0</i></th>
            <th><i>1</i></th>
            <th><i>2</i></th>
            <th><i>3</i></th>
            <th><i>4</i></th>
            <th><i>5</i></th>
            <th><i>6</i></th>
            <th><i>7</i></th>
            <th><i>8</i></th>
            <th><i>9</i></th>
            <td class="ball-none"></td>
          </tr> -->
        </tbody>
        <tbody class="tbody">
          <tr v-for="(item, index) in countArr" :key="index">
            <td class="border-bottom ball-none"></td>
            <td class="border-bottom issue-number">{{item.title}}</td>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <td class="border-bottom"><span class="lot-nums"></span></td>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(wan, wanindex) in item.data[0]" :key="'w'+wanindex"><i :class="wan.class" :id="wan.id">{{wan}}</i></th>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(qian, qianindex) in item.data[1]" :key="'q'+qianindex"><i :class="qian.class" :id="qian.id">{{qian}}</i></th>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(bai, baiindex) in item.data[2]" :key="'b'+baiindex"><i :class="bai.class" :id="bai.id">{{bai}}</i></th>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(shi, shiindex) in item.data[3]" :key="'s'+shiindex"><i :class="shi.class" :id="shi.id">{{shi}}</i></th>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(ge, geindex) in item.data[4]" :key="'g'+geindex"><i :class="ge.class" :id="ge.id">{{ge}}</i></th>
            <th class="border-bottom ball-none border-right"></th>
            <td class="border-bottom ball-none"></td>
            <th class="border-bottom" v-for="(statusNum, statusNumindex) in item.data[5]" :key="'status'+statusNumindex"><i :class="statusNum.class">{{statusNum}}</i></th>
            <td class="border-bottom ball-none"></td>
          </tr>
        </tbody>
        <tbody class="tbody">
          <tr>
            <th rowspan="2" colspan="3" class="table-title-issue border-right">期号</th>
            <th style="height:73px;" rowspan="2" colspan="3" class="table-title-lottery border-right">开奖号码</th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
            <th class="ball-none border-bottom-header td-bg"></th>
            <th class="border-bottom-header td-bg">
              <i>0</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>1</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>2</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>3</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>4</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>5</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>6</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>7</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>8</i>
            </th>
            <th class="border-bottom-header td-bg">
              <i>9</i>
            </th>
            <th class="ball-none border-right td-bg"></th>
          </tr>
          <tr>
            <th colspan="12" class="border-right">万位</th>
            <th colspan="12" class="border-right">千位</th>
            <th colspan="12" class="border-right">百位</th>
            <th colspan="12" class="border-right">十位</th>
            <th colspan="12" class="border-right">个位</th>
            <th colspan="12" class="border-right">号码分布</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import request from "../axios/axios";
  import moment, { months } from 'moment';
  export default {
    name: 'dataCharts',
    data() {
      return {
        loading: false,
        auxiliary_line: true, // 辅助线
        missing: true, // 遗漏
        missing_article: false, // 遗漏条
        ligature: true, // 连线
        no_temperature: false, // 号温
        checked: false,
        memoryNumArr: [],
        countArr: [],
        countArrText: ['出现总次数', '平均遗漏值', '最大遗漏值', '最大连出值'],
        html: '<th><i>0</i></th>',
        // lotteryData: [
        //   { issue: 1805100805, lottery: 66328 },
        //   { issue: 1805100805, lottery: 12869 },
        //   { issue: 1805100805, lottery: 83486 }
        // ],
        form: {
          // 游戏名称
          gameName: {
            options: [],
            selected: ""
          },
          // 玩法群
          playGroup: {
            options: [],
            active: 0
          },
          // 期数选择
          timeOptions: {
            options: [
              { text: '近30期', value: 30 },
              { text: '近50期', value: 50 },
              { text: '今日数据', value: 'day' },
            ],
            selected: '',
            active: 0
          },
          // time picker From
          dateFrom: {
            key: 'begintime',
            value: '',
          },
          // To
          dateTo: {
            key: 'endtime',
            value: '',
          },
        },
        gameid: '',
        page_num: 1,
        page_size: 30,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        tableList: [],
        tableStyle: {
          ssc: {
            header_number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            header_text: ["万位", "千位", "百位", "十位", "个位"],
          }
        },

        param: {}
      }
    },
    created() {
      this.$store.dispatch('setbodyBG', 'dataCharts');
    },
    methods: {
      randerHtml() {
        var str = '';
        const vm = this;
        var refArr1 = [];
        var numIndex = 0;
        var c_numIndex = 0;
        this.tableList.filter((val, index) => {
          var refArr2 = [];
          // numIndex += 1;
          // c_numIndex += 1;
          if (index > 0) {
            var prevArr = this.tableList[index - 1].luck_no.toString().split(',');
          }
          str += '<tr>';
          let arr = [];
          let o = new Object();
          var l = '';
          if (typeof val.luck_no === 'string') {
            l = val.luck_no
          } else {
            l = val.luck_no.toString();
          }
          arr = l.split(',');
          let luck_no = "";
          arr.forEach(el => {
            luck_no += el;
          });
          let lotteryStr =
            str += '<td class="ball-none"></td>' +
            '<td class="issue-number">' + val.issue_no + '</td>' +
            '<td class="ball-none border-right"></td>' +
            '<td class="ball-none"></td>' +
            '<td><span class="lot-nums">' + luck_no + '</span></td>';
          for (let i in arr) {
            str += '<th class="ball-none border-right"></th>' +
              '<td class="ball-none"></td>'
            for (let j = 0; j < 10; j++) {
              let n = j == arr[i] ? j : index + 1;
              // let n;
              let cl = j == arr[i] ? 'lotNumI' : '';
              let ref;
              if (cl) {
                ref = 'ref' + index + i + j;
                refArr2.push(ref)
              } else {
                ref = '';
              }
              str += '<th><i id="' + ref + '" class="ball-noraml ' + cl + '">' + n + '</i></th>'
              // str += '<th><i class="' + cl + ' ' + ref + '">' + n + '</i></th>'
            }
          }
          refArr1.push(refArr2);
          str += '<th class="ball-none border-right"></th>' +
            '<td class="ball-none"></td>'
          for (let i = 0; i < arr.length; i++) {
            let n = 1;
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i] == arr[j]) {
                n++
              }
            }
            if (!o[arr[i]]) {
              o[arr[i]] = n;
            }
          }
          for (let j = 0; j < 10; j++) {
            let n, cl;
            for (let i in o) {
              if (j == i) {
                n = j;
                if (o[i] == 1) {
                  cl = 'lot-less';
                  break
                } else if (o[i] > 1) {
                  cl = 'lot-more';
                  break
                } else {
                  cl = '';
                  break
                }
              } else {
                n = index + 1;
                cl = '';
              }
            }
            str += '<th><i class="ball-noraml ' + cl + '">' + n + '</i></th>'
          }
          str += '<td class="ball-none"></td></tr>';
        })
        this.html = str;
        this.$nextTick(() => {
          this.randerCanvas(refArr1);
        })
      },
      randerCanvas(arr) {
        const vm = this;
        let dw = 16 / 2,
          dh = 16 / 2; // 数字宽高
        const canvasWrap = document.getElementById('table-canvas-warp');
        let data = [];
        for (let i = 0; i < 5; i++) {
          let a = [];
          arr.filter(v => {
            a.push(v[i])
          })
          data.push(a);
        }
        // console.log(data)
        var strokeLine = function(ctx, x1, y1, x2, y2) {
          ctx.strokeStyle = "#FD4E5A";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2)
          ctx.closePath();
          ctx.stroke();
        }
        // console.log(document.getElementsByClassName(data[0][0]))
        data.filter(v => {
          for (let i = 0; i < v.length; i++) {
            if (i > 0) {
              let p = v[i - 1],
                c = v[i];
              // console.log(p)
              // console.log(c)
              let prevEl = document.getElementById(p); // 上一个元素
              let currEl = document.getElementById(c); // 当前元素
              let pl = prevEl.offsetLeft,
                pt = prevEl.offsetTop; // 元素距离 左、上的距离
              let cl = currEl.offsetLeft,
                ct = currEl.offsetTop;
              // console.log(prevEl)
              // console.log(currEl)
              // console.log(pl,pt)
              // console.log(cl,ct)
              let w = Math.abs(cl - pl),
                h = Math.abs(ct - pt); // 计算 canvas 的宽高
              let canvas = document.createElement('canvas');
              canvas.setAttribute('class', 'chart-canvas')
              canvas.width = w;
              canvas.height = h;
              canvas.style.position = 'absolute';
              var ctx = canvas.getContext('2d');
              if (cl < pl) {
                canvas.style.left = (cl + dw) + 'px';
                canvas.style.top = (pt + dh) + 'px';
                strokeLine(ctx, w, 0, 0, h)
              } else if (cl == pl) {
                canvas.width = dw;
                canvas.height = h;
                canvas.style.left = (cl + dw / 3) + 'px';
                canvas.style.top = (pt + dh) + 'px';
                strokeLine(ctx, dw / 2, 0, dw / 2, h)
              } else {
                canvas.style.left = (pl + dw) + 'px';
                canvas.style.top = (ct - dh * 3) + 'px';
                strokeLine(ctx, 0, 0, w, h)
              }
              canvasWrap.appendChild(canvas);
            }
          }
        })
        this.memoryNumArr = [];
      },
      timeOptionsToggle(index, item) {
        /* var ele = document.getElementsByClassName('lotNumI')
        console.log(ele) */
        let time = new Date();
        let y = time.getFullYear(),
          m = time.getMonth(),
          d = time.getDate();
        let begintime, endtime;
        this.form.timeOptions.active = index;
        // console.log(index, item)
        if (index == 2) {
          begintime = moment(time).format('YYYY-MM-DD 00:00:00');
          endtime = moment(new Date(y, m, d + 1)).format('YYYY-MM-DD 00:00:00');
          this.param = {
            page_num: this.page_num,
            page_size: 999,
            begintime: begintime,
            endtime: endtime,
            gameid: this.gameid
          }
          this.getChartDatalist(this.param);
        } else {
          this.page_size = item.value;
          this.param = {
            page_num: this.page_num,
            page_size: this.page_size,
            gameid: this.gameid
          }
          this.getChartDatalist(this.param);
        }
      },
      // 单种玩法游戏详情
      getGameDetail(id) {
        let vm = this;
        let url = "/lottery/game/detail";
        let data = { gameid: id };
        request.http('get', url, data, (success) => {
          vm.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(vm);
            } else if (success.returncode == 200) {
              let result = success.data.children;
              if (result.length != 0) {
                vm.form.playGroup.options = result;
                vm.form.playGroup.active = 0;
              }
            }
          }
        }, (error) => {
          vm.loading = false;
          console.log('error', error);
        })
      },
      // 彩票名称 （彩种）列表 
      getGameList() {
        let vm = this;
        let url = "/lottery/game/list";
        request.http('get', url, {}, (success) => {
          vm.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(vm);
            } else if (success.returncode == 200) {
              let result = success.data;
              if (result.length != 0) {
                for (let i = 0; i < result.length; i++) {
                  let child = result[i].children;
                  let parentid = result[i].code;
                  for (let j = 0; j < child.length; j++) {
                    let child_ = child[j];
                    let obj = new Object;
                    obj._id = child_._id;
                    obj.name = child_.name;
                    obj.parent = parentid;
                    vm.form.gameName.options.push(obj);
                  }
                }
                // 初始化单种玩法详情
                if (vm.gameid) {
                  vm.form.gameName.selected = vm.gameid;
                }
              }
            }
          }
        }, (error) => {
          vm.loading = false;
          console.log('error', error);
        })
      },
      // 玩法种类 切换
      playGroupItemToggle(index) {
        this.form.playGroup.active = index;
      },
      // 搜索
      onSubmit() {
        const vm = this;
        let param = {};
        let begintime = vm.form.dateFrom.value;
        let endtime = vm.form.dateTo.value;
        if (begintime !== '' && endtime !== '') {
          param = {
            page_num: vm.page_num,
            page_size: 999,
            begintime: begintime,
            endtime: endtime,
            gameid: vm.gameid
          }
        } else {
          param = vm.param;
        }
        vm.getChartDatalist(param);
      },

      getChartDatalist(param) {
        const vm = this;
        let canvasArr = document.getElementsByClassName('chart-canvas');
        if (canvasArr.length !== 0) {
          for (let i = canvasArr.length - 1; i >= 0; i--) {
            canvasArr[i].parentNode.removeChild(canvasArr[i])
          }
        }
        vm.loading = true;
        let url = "/lottery/issue/list";
        request.http('get', url,
          param,
          (success) => {
            vm.loading = false;
            let code = success.returncode
            if (code) {
              if (code == 103 || code == 106 || code == 101) {
                request.loginAgain(vm);
              } else if (code == 200) {
                vm.total = success.data.total;
                if (vm.total) {
                  vm.totalPageNum = success.data.total_page_num;
                  vm.page_size = success.data.page_size;
                  // vm.tableList = success.data.data;
                  vm.setMemoryData();
                  vm.setData(success.data.data);
                  // console.log(vm.tableList)
                  // vm.randerHtml();
                } else {
                  vm.$alert('没有符合条件的记录', '系统提醒', {
                    confirmButtonText: '确定',
                    center: true,
                  });
                }
              }
            }
          },
          (error) => {
            vm.loading = false;
            console.log('error', error);
          }
        )
      },

      setMemoryData() {
        this.memoryNumArr = [];
        for (let i = 0; i < 6; i++) {
          let arr = [];
          for (let j = 0; j < 10; j++) {
            arr.push({
              num: 0,
              allcount: 0,
              evlost: 0,
              lostArr: [],
              continueVal: 0,
              continueArr: []
            })
          }
          this.memoryNumArr.push(arr)
        }
      },

      setData(list) {
        const vm = this;
        let data = [];
        let refArr1 = [];
        list.filter((val, index) => {
          var prevArr = [];
          let refArr2 = [];
          if (index > 0) {
            prevArr = list[index - 1].luck_no.toString().split(','); // 上一个中奖号码 数组形式
          }
          let obj1 = new Object(); // 第一层级对象
          let luckArr = val.luck_no.split(','); // 中奖号码 数组形式
          obj1.issue_no = val.issue_no; // 期号
          obj1.luck_no = luckArr.join(''); // 中奖号码
          obj1.data = []; // 万-个位 以及 号码分布
          for (let i = 0; i < 5; i++) {
            let wei = {}; // 万-个
            wei.num = [];
            wei.class = 'ball-noraml';
            for (let j = 0; j < 10; j++) {
              if (j == Number(luckArr[i])) {
                let allcount = Number(vm.memoryNumArr[i][j].allcount) + 1
                vm.memoryNumArr[i][j].allcount = allcount;
                let continueVal = Number(vm.memoryNumArr[i][j].continueVal) + 1
                vm.memoryNumArr[i][j].continueVal = continueVal;
                vm.memoryNumArr[i][j].continueArr.push(vm.memoryNumArr[i][j].continueVal)
                vm.memoryNumArr[i][j].lostArr.push(vm.memoryNumArr[i][j].num)
                vm.memoryNumArr[i][j].num = j;
                let ref = 'ref' + index + i + j;
                wei.num.push(
                {
                  num: j,
                  lottery: j,
                  id: ref,
                  class: 'ball-noraml lotNumI',
                  lost: ''
                });
                refArr2.push(ref)
              } else {
                if (j == prevArr[i]) {
                  vm.memoryNumArr[i][j].num = 1;
                } else {
                  let c_num = Number(vm.memoryNumArr[i][j].num) + 1;
                  vm.memoryNumArr[i][j].num = c_num;
                  vm.memoryNumArr[i][j].continueVal = 0;
                }
                wei.num.push({
                  num: vm.memoryNumArr[i][j].num,
                  lottery: '',
                  id: '',
                  class: 'ball-noraml',
                  lost: ''
                });
              }
            }
            obj1.data.push(wei);
          }
          let statusNumObj = new Object(); // 号码分布 对象
          statusNumObj.num = [];
          let o = [];
          for (let i = 0; i < luckArr.length; i++) {
            let n = 1; // 数字出现的次数
            for (let j = i + 1; j < luckArr.length; j++) {
              if (luckArr[i] == luckArr[j]) {
                n++
              }
            }
            if (!o[luckArr[i]]) {
              o[luckArr[i]] = n;
            }
          }
          for (let j = 0; j < 10; j++) {
            let n;
            if (o[j]) {
              let allcount = Number(vm.memoryNumArr[5][j].allcount) + o[j]
              vm.memoryNumArr[5][j].allcount = allcount;
              let continueVal = Number(vm.memoryNumArr[5][j].continueVal) + 1
              vm.memoryNumArr[5][j].continueVal = continueVal;
              vm.memoryNumArr[5][j].continueArr.push(vm.memoryNumArr[5][j].continueVal);
              vm.memoryNumArr[5][j].lostArr.push(vm.memoryNumArr[5][j].num);
              vm.memoryNumArr[5][j].num = j;
              let cl = '';
              if (o[j] == 1) {
                cl = 'ball-noraml lot-less'
              } else if (o[j] > 1) {
                cl = 'ball-noraml lot-more'
              } else {
                cl = 'ball-noraml'
              }
              statusNumObj.num.push({
                num: j,
                class: cl
              });
            } else {
              vm.memoryNumArr[5][j].continueVal = 0;
              vm.memoryNumArr[5][j].continueArr.push(vm.memoryNumArr[5][j].continueVal);
              if (prevArr.indexOf(j.toString()) > -1) {
                vm.memoryNumArr[5][j].num = 1;
              } else {
                let c_num = Number(vm.memoryNumArr[5][j].num) + 1;
                vm.memoryNumArr[5][j].num = c_num;
                // Number(vm.memoryNumArr[5][j].num) += 1
              }
              statusNumObj.num.push({
                num: vm.memoryNumArr[5][j].num,
                class: 'ball-noraml'
              });
            }

          }
          refArr1.push(refArr2)
          obj1.data.push(statusNumObj);
          data.push(obj1);
        })
        vm.countArr = [];
        for (let i = 0; i < 4; i++) {
          let countObj = new Object();
          countObj.title = vm.countArrText[i];
          countObj.data = [];
          vm.memoryNumArr.filter((v, vi) => {
            // if(vi>4) return false;
            let arr = [];
            v.filter(k => {
              if (i === 0) {
                arr.push(k.allcount);
              } else if (i === 1) {
                if (k.allcount == 0) {
                  arr.push(list.length);
                } else {
                  arr.push(Math.floor(list.length / k.allcount));
                }
              } else if (i === 2) {
                if (k.lostArr.length === 0) {
                  arr.push(30);
                } else {
                  let maxVal = Math.max.apply(null, k.lostArr)
                  arr.push(maxVal);
                }
              } else if (i === 3) {
                if (k.continueArr.length === 0) {
                  arr.push(0);
                } else {
                  let maxVal = Math.max.apply(null, k.continueArr)
                  arr.push(maxVal);
                }
              }
            })
            countObj.data.push(arr)
          })
          vm.countArr.push(countObj)
        }
        // vm.tableList = data;
        // console.log(vm.countArr)
        // 
        // debugger;
        this.setMemoryData();
        data.reverse().filter(val1 => {
          val1.data.filter((val2, val2Index) => {
            if (val2Index > 4) return false;
            for (let i in val2.num) {
              let n = val2.num[i];
              if (vm.memoryNumArr[val2Index][i].num) continue;
              if (n.num != n.lottery) {
                n.lost = 'lost-post'
              } else {
                vm.memoryNumArr[val2Index][i].num = 1
              }
            }
          })
        })
        vm.tableList = data.reverse();
        // console.log(data);
        this.$nextTick(() => {
          this.randerCanvas(refArr1);
        })
      },
    },
    watch: {
      "form.gameName.selected"(newVal, oldVal) {
        if (newVal != oldVal) {
          if (newVal) {
            this.getGameDetail(newVal);
          }
        }
      }
    },
    mounted() {
      if (this.$route.query.gameid) {
        this.gameid = this.$route.query.gameid;
        // 渲染 select 并尝试赋值selected项
      } else {
        this.$alert("参数错误", "系统提示", {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      }
      this.getGameList();
      this.param = {
        page_num: this.page_num,
        page_size: this.page_size,
        gameid: this.gameid
      }
      this.getChartDatalist(this.param);
    }
  }
</script>

<style lang="scss">
  .content {
    // width: 1200px;
    // margin: 0 auto;
  }

  .showCanvas .data-charts-table-wrap canvas {
    display: block
  }

  .dataCharts-wrap {
    // width: 100%;
    width: 1204px;
    margin: 0 auto;
    padding: 20px 0;
    color: #333;
    font-size: 12px;

    canvas {
      z-index: 98;
      display: none;
    }

    .charts-oprate-title {
      width: 100%;
      display: -webkit-box;
      -webkit-box-align: center;
      height: 52px;
      line-height: 52px;
      margin: 10px 0;

      // padding-left: 22px;
      .title-check-box {
        margin-right: 20px;
        width: 82px;
        text-align: center;
        border: 1px solid #B5B5B5;
        background: #fff;
        height: 35px;
        line-height: 35px;
      }

      .time-options {
        line-height: 28px;
        margin: 0 32px 0 12px;

        >li {
          padding: 0 10px;
          cursor: pointer;
          text-align: center;
          font-size: 14px;
          color: #333333;
          list-style: none;
          float: left;
          line-height: 28px;
        }

        >li.active {
          color: #847B5F;
          background-color: #FFF;
        }
      }

      .time-picker {

        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 143px;
        }

        .el-input--prefix .el-input__inner {
          padding: 0 13px;
        }

        .el-input__inner {
          padding: 0;
          font-size: 12px;
          border: 1px solid #999799;
          border-radius: 0;
        }
      }

      .search-link {
        width: 68px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        text-decoration: none;
        font-size: 14px;
        background: #A65B06;
        color: #fff;
        display: inline-block;
        text-align: center;
      }
    }

    .table-lost-post .lost-post {
      background-color: #DADAE5;
      border: none;
    }

    .table-lost-post .lost-post .ball-noraml {
      color: #B7B7B7;
    }

    .data-charts-table-wrap {
      width: 100%;
      position: relative;
      margin-top: 20px;
      border: 1px solid #CCC;

      .ball-noraml {
        color: #666;
      }

      .table-lost .ball-noraml {
        color: #fff;
      }

      table {
        width: 100%;
        color: #fff;
        border-collapse: collapse;
        border-spacing: 0;
        background: #fff;

        thead {
          padding: 5px 0;
        }

        .tbody {
          color: #fff;
        }

        thead,
        .tbody {
          background: #515368;
        }

        tbody {
          color: #333;
        }

        tbody.table-guides {
          tr {
            &:nth-child(5n) {
              border-bottom: 1px solid #ccc;
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .lot-nums {
          color: #F26432;
          white-space: nowrap;
        }

        .table-title-issue {
          width: 86px;
        }

        .table-title-lottery {
          width: 69px;
        }

        .border-bottom {
          border-bottom: 1px solid #757575;
        }

        th,
        td {
          padding: 10px 0;

          i {
            font-style: normal;
            display: inline-block;
            // width: 14px;
            // height: 14px;
            // line-height: 14px;
            width: 16px;
            height: 16px;
            line-height: 16px;
            font-weight: normal;
          }

          .lotNumI {
            border-radius: 50%;
            background: #FD4E5A;
            color: #fff;
            position: relative;
            z-index: 99;
          }

          .lot-less {
            border-radius: 50%;
            background: #34BC0F;
            color: #fff;
          }

          .lot-more {
            border-radius: 50%;
            background: #BD3ED4;
            color: #fff;
          }
        }

        .ball-none {
          width: 4px;
        }

        .border-right {
          border-right: 1px solid rgba(155, 155, 155, 0.28);
        }

        .td-bg {
          background: #3A3B50;
        }
      }
    }

    .charts-oprate-header {
      height: 46px;
      width: 100%;
      line-height: 46px;
      background: #DBDBDB;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #191919;
      text-align: left;
      padding-left: 22px;

      .header-select {
        width: 132px;
        float: left;

        .el-input__inner {
          -webkit-appearance: none;
          background: #DBDBDB;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          display: inline-block;
          font-size: inherit;
          height: 29px;
          line-height: 29px;
          outline: none;
          padding: 0 15px;
          width: 100%;
          border: none;
          border-radius: 0;
          color: #191919;

          .el-select .el-input .el-select__caret {
            color: #191919 !important;
          }
        }
      }

      .header-types {
        display: flex;
        justify-content: flex-start;
        padding-left: 65px;

        >li {
          width: 104px;
          height: 46px;
          line-height: 46px;
          list-style: none;
          text-align: center;

          >a {
            display: inline-block;
            cursor: pointer;
            text-decoration: none;
            color: #191919;
            font-size: 14px;
            vertical-align: middle;
            width: 100%;
          }
        }

        >li.active {
          // background: rgba(166, 91, 6, 1);
          border-top: 2px solid #BD8454;
          background: #F4F4F4;
          color: #BD8454;
        }
      }
    }
  }
</style>