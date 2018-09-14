<!--团队盈亏 - 彩票-->
<template>
  <div class="lottery-wrap" v-loading="loading">
    <div class="record-tabs">
      <router-link :to="{name:'teamProfitLottery'}" class="tab-item ">彩票
      </router-link>
      <router-link :to="{name:'teamProfitLive'}" class="tab-item">真人娱乐</router-link>
      <router-link :to="{name:'teamProfitRecreation'}" class="tab-item">电子游艺
      </router-link>
      <router-link :to="{name:'teamProfitSports'}" class="tab-item">体育竞技</router-link>
      <router-link :to="{name:'teamProfitChess'}" class="tab-item active">棋牌竞技
      </router-link>
    </div>
    <div class="record-options search-form">
      <div class="option-row">
        游戏时间： &nbsp;&nbsp;
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        &nbsp;&nbsp; 至 &nbsp;&nbsp;
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker> &nbsp;&nbsp;
        <a class="time" @click="setTimeToday">今日</a>&nbsp;
        <a class="time" @click="setTimeNowWeek">本周</a>&nbsp;
        <a class="time" @click="setTimeNowMonth">本月</a>&nbsp;
        <a class="time" @click="setTimeRecent3Days(-3)">近三日</a>&nbsp;
        <a class="time" @click="setTimeRecent3Days(-15)">近半月</a>&nbsp;
        <a class="time" @click="setTimeRecent3Days(-30)">近一月</a>
      </div>
      <div class="option-row">
        注单编号： &nbsp;&nbsp;
        <el-input placeholder="请输入内容" v-model="form.zdbh.value" clearable>
        </el-input>
        &nbsp;&nbsp;奖励编号：&nbsp;&nbsp;
        <el-input placeholder="请输入内容" v-model="form.jlbh.value" clearable>
        </el-input>
        &nbsp;&nbsp;用户名：&nbsp;&nbsp;
        <el-input placeholder="请输入内容" v-model="form.username.value" clearable>
        </el-input>
      </div>
      <div class="option-row">
        游戏名称：&nbsp;&nbsp;
        <el-select v-model="form.gametypes.value" placeholder="请选择" @change="changeGameItem" clearable :loading="form.gametypes.loading" :loading-text="form.gametypes.loadingtext">
          <el-option v-for="item in form.gametypes.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        &nbsp;&nbsp;玩法群：&nbsp;&nbsp;
        <el-select v-model="form.playgroups.value" placeholder="请选择" @change="changePlayItem" clearable :loading="form.playgroups.loading" :loading-text="form.playgroups.loadingtext">
          <el-option v-for="item in form.playgroups.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        &nbsp; &nbsp;&nbsp;玩法：&nbsp;&nbsp;
        <el-select v-model="form.playtypes.value" placeholder="请选择" clearable>
          <el-option v-for="item in form.playtypes.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </div>
      <div class="option-row">
        状态：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-checkbox-group class="inline" v-model="form.checkList.value">
          <el-checkbox :label="option.value" v-for="option in form.checkList.options" :key="option.value">
            {{option.text}}
          </el-checkbox>
        </el-checkbox-group>
        <a class="submit" @click="onSubmit()">搜索</a>
      </div>
    </div>
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
        <tr class="group-item">
          <td>19919940944</td>
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
        <tr v-for="(item,index) in list" class="group-item" v-if="!noResult" :key="index">
          <td>{{item.loginname}}</td>
          <td>{{item.gamename}}</td>
          <td>
            <router-link :to="{name:'lotteryDetail',query:{id:item._id}}" :title="item.order_no">{{item.order_no}}
            </router-link>
          </td>
          <td>{{item.issue_no}}</td>
          <td>{{item.lotteryname}}</td>
          <td>
            <router-link :to="{name:'lotteryDetail',query:{id:item._id}}">详细内容</router-link>
          </td>
          <td></td>
          <td>{{item.vote_cash}}{{item.unit}}</td>
          <td v-if="!item.award_cash">0</td>
          <td v-else>{{item.award_cash}}{{item.unit}}</td>
          <td>{{item.refund}}</td>
          <td>{{getStatusText(item.status)}}</td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import request from '../axios/axios'

  export default {
    data() {
      return {
        loading: false,
        form: {
          //form Start
          //开始结束时间
          dateFrom: {
            key: 'begintime',
            value: '',
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          dateTo: {
            key: 'endtime',
            value: '',
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //游戏名称
          gametypes: {
            value: '',
            loading: false,
            loadingtext: '正在搜索...',
            options: [],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //玩法
          playtypes: {
            key: 'gameid',
            value: '',
            options: [],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //玩法群
          playgroups: {
            value: '',
            loading: false,
            loadingtext: '正在搜索...',
            options: [],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //状态
          checkList: {
            key: 'status',
            value: [],
            options: [
              { text: '默认', value: 0 },
              { text: '待开奖', value: 1 },
              { text: '等待中', value: 2 },
              { text: '已撤销', value: 3 },
              { text: '未中奖', value: 4 },
              { text: '中奖', value: 5 },
            ],
            getValue() {
              if (this.value) {
                return this.value;
              }
              return [];
            },
            reset() {
              this.value = [];
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //注单编号
          zdbh: {
            value: '',
            key: 'order_no',
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              /*if (!value) {
                this.error.message = '该信息必填';
                this.error.visible = true;
                return false;
              }*/
              this.error.visible = false;
              return true;
            }
          },
          //奖励编号
          jlbh: {
            value: '',
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          //用户名
          username: {
            key: 'loginname',
            value: localStorage.getItem('loginname'),
            getValue() {
              if (this.value) {
                return this.value;
              }
              return '';
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ''
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          }
          //form End
        },
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 5, //单页条数
      }
    },
    watch: {
      // 'form.username.value'(newValue, oldValue) {
      //   if (oldValue != newValue) {
      //     if (!newValue) {
      //
      //     }
      //   }
      // }
    },
    methods: {
      //今天
      setTimeToday() {
        let date = new Date();
        let ymd = this.formatDate(date);
        this.form.dateTo.value = ymd + ' 23:59:59';
        this.form.dateFrom.value = ymd + ' 00:00:00';
      },
      //本周
      setTimeNowWeek() {
        let now = new Date();
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //当前日
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        //获得本周的开始日期
        let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        getWeekStartDate = this.formatDate(getWeekStartDate);
        this.form.dateFrom.value = getWeekStartDate + ' 00:00:00';
        //获得本周的结束日期
        let getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        getWeekEndDate = this.formatDate(getWeekEndDate);
        this.form.dateTo.value = getWeekEndDate + ' 23:59:59';
      },
      //本月
      setTimeNowMonth() {
        let now = new Date();
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        //获得本月的开始日期
        let getMonthStartDate = new Date(nowYear, nowMonth, 1);
        getMonthStartDate = this.formatDate(getMonthStartDate);
        this.form.dateFrom.value = getMonthStartDate + ' 00:00:00';

        //获得本月的结束日期
        let getMonthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowYear, nowMonth));
        getMonthEndDate = this.formatDate(getMonthEndDate);
        this.form.dateTo.value = getMonthEndDate + ' 23:59:59';
      },
      //设置近几日
      setTimeRecent3Days(day) {
        let now = new Date();
        let previous = this.getDay(day);
        this.form.dateFrom.value = previous + ' 00:00:00';
        let ymd = this.formatDate(now);
        this.form.dateTo.value = ymd + ' 23:59:59';
      },
      getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
      },
      doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      },
      //获得某月的天数
      getMonthDays(myYear, myMonth) {
        var monthStartDate = new Date(myYear, myMonth, 1);
        var monthEndDate = new Date(myYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
      },
      //格式化年月日
      //格式化日期：yyyy-MM-dd
      formatDate(date) {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();
        if (mymonth < 10) {
          mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
          myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      getStatusText(status) {
        let text = '';
        switch (status) {
          case 0:
            text = '默认';
            break;
          case 1:
            text = '待开奖';
            break;
          case 2:
            text = '等待中';
            break;
          case 3:
            text = '已撤销';
            break;
          case 4:
            text = '中奖';
            break;
          case 5:
            text = '未中奖';
            break;
        }
        return text;
      },
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        this.form.username.value = localStorage.getItem('loginname');
        data['page_size'] = this.pageSize;
        data['page_num'] = this.pageIndex;
        let errorMessage = '查询错误';
        for (let v in this.form) {
          if (this.form.hasOwnProperty(v)) {
            let obj = this.form[v];
            if (obj.visible === undefined || obj.visible) {
              if (obj.key) {
                if (obj.getValue) {
                  data[obj.key] = obj.getValue();
                } else if (obj.value) {
                  data[obj.key] = obj.value;
                }
              }
              if (obj.verify !== undefined && !obj.verify()) {
                validate = false;
                errorMessage = obj.error.message;
              }
            }
          }
        }
        if (!validate) {
          self.$alert(`<div class="lottery-title">${errorMessage}</div>`, '系统提醒', {
            confirmButtonText: '确定',
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {}
          })
          return false;
        } else {
          this.loading = true;
          let url = '/lottery/issue/vote/list';
          request.http('get', url, data, (success) => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.total = success.data.total;
                if (self.total) {
                  self.noResult = false;
                  self.totalPageNum = success.data.total_page_num;
                  self.list = success.data.data;
                } else {
                  self.noResult = true;
                  self.$alert('<div class="lottery-title">没有符合条件的记录</div>', '系统提醒', {
                    confirmButtonText: '确定',
                    center: true,
                    dangerouslyUseHTMLString: true,
                    customClass: "syxw-wrap-inner",
                    callback: action => {}
                  })
                }
              }
            }
          }, (error) => {
            self.loading = false;
            self.noResult = true;
            console.log('error', error);
          })
          return true;
        }
      },
      //游戏名称列表
      getGameList() {
        let self = this;
        let url = '/lottery/game/list';
        let gamelist = [];
        this.form.gametypes.loading = true;
        request.http('get', url, {}, (success) => {
          self.form.gametypes.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              for (let i = 0; i < success.data.length; i++) {
                let item = success.data[i].children;
                gamelist = gamelist.concat(item);
              }
              self.form.gametypes.options = gamelist;
            }
          }
        }, (error) => {
          self.form.gametypes.loading = false;
          console.log('error', error);
        })
      },
      //游戏名称选中值更改
      changeGameItem(value) {
        if (value) {
          let obj = {};
          obj = this.form.gametypes.options.find((item) => {
            return item._id === value;
          });
          this.form.playgroups.options = [];
          this.form.playgroups.value = '';
          this.form.playtypes.options = [];
          this.form.playtypes.value = '';
          this.getPlayGroups(obj._id);
        } else {
          this.form.playgroups.options = [];
          this.form.playgroups.value = '';
          this.form.playtypes.options = [];
          this.form.playtypes.value = '';
        }
      },
      //玩法群
      getPlayGroups(gameid) {
        let self = this;
        let url = '/lottery/game/detail';
        let groups = [];
        this.form.playgroups.loading = true;
        request.http('get', url, { gameid: gameid }, (success) => {
          self.form.playgroups.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              let children = success.data.children;
              for (let i = 0; i < children.length; i++) {
                groups = groups.concat(children[i]);
              }
              self.form.playgroups.options = groups;
            }
          }
        }, (error) => {
          self.form.playgroups.loading = false;
          console.log('error', error);
        })
      },
      //玩法群选中值更改
      changePlayItem(value) {
        if (value) {
          let obj = {};
          obj = this.form.playgroups.options.find((item) => {
            return item._id === value;
          });
          this.form.playtypes.options = [];
          this.form.playtypes.value = '';
          this.getPlayTypeList(obj._id);
        } else {
          this.form.playtypes.options = [];
          this.form.playtypes.value = '';
        }
      },
      getPlayTypeList(groupid) {
        let groups = this.form.playgroups.options;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i]._id === groupid) {
            let group = groups[i].children;
            let playTypes = [];
            for (let j = 0; j < group.length; j++) {
              let jitem = group[j].children;
              playTypes = playTypes.concat(jitem);
            }
            this.form.playtypes.options = playTypes;
            break;
          }
        }
      },
      //是否直接跳转到详情
      //通过上级id是否有值判断
      checkId() {
        let id = this.$route.query.id;
        if (id) {
          this.$router.push({ name: 'lotteryDetail', query: { id: id } });
        } else {
          this.onSubmit();
          this.getGameList();
        }
      }
    },
    mounted() {
      this.checkId();
    }
  }
</script>
<style scoped>
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

  .lottery-wrap {
    padding-top: 34px;
    color: #333333;
    width: 978px;
    margin: 0 auto;
    min-height: 731px;
  }

  .record-tabs {
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
    padding: 39px 0;
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
    width: 978px;
    margin: 0 auto;
  }

  .record-group .group-title {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-title>th {
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    height: 34px;
  }

  .record-group .group-title>th:after {
    content: '';
    height: 16px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 9px;
    width: 1px;
  }

  .record-group .group-item {
    height: 57px;
    line-height: 57px;
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
    padding: 0 2px;
    font-size: 12px;
    width: 56px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    border: 1px solid #8D8D8D;
    text-align: center;
    margin-right: 3px;
  }

  .record-options .option-row>a.time:hover {
    background: #D4914D;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .record-group .group-item:nth-child(2n+1) {
    background: #F7F7F7;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #F0BD88;
    margin-top: 74px;
  }

  .record-group .record-bottom .group-item {
    height: 34px;
    line-height: 34px;
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

  .record-options .option-row>a.submit {
    position: relative;
    display: inline-block;
    height: 28px;
    padding: 0 29px;
    line-height: 25px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    font-family: microsoft yahei;
    background-color: #D4914D;
    border: 1px solid #CCC;
    box-shadow: none;
    margin-left: 20px;
  }
</style>