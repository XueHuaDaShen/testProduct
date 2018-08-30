<template>
  <div class="lottery-wrap" v-loading="loading">
    <!-- <div class="record-tabs">
      <router-link :to="{name:'lotteryRecord'}" class="tab-item active">游戏记录
      </router-link>
      <router-link :to="{name:'trackRecord'}" class="tab-item">追号记录</router-link>
    </div> -->
    <div class="record-options search-form">
      <div class="option-row mb-20">
        <span class="exp w-60">游戏名称：</span>
        <el-select style="width:114px;" v-model="form.gametypes.value" placeholder="请选择" @change="changeGameItem" clearable :loading="form.gametypes.loading" :loading-text="form.gametypes.loadingtext">
          <el-option v-for="item in form.gametypes.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <span class="exp ml-20">玩法群：</span>
        <el-select style="width:114px;" v-model="form.playgroups.value" placeholder="请选择" @change="changePlayItem" clearable :loading="form.playgroups.loading" :loading-text="form.playgroups.loadingtext">
          <el-option v-for="item in form.playgroups.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <span class="exp ml-20">玩法：</span>
        <el-select style="width:114px;" v-model="form.playtypes.value" placeholder="请选择" clearable>
          <el-option v-for="item in form.playtypes.options" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <span class="exp ml-20">注单编号：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="form.zdbh.value" clearable>
        </el-input>
      </div>
      <div class="option-row mb-20">
        <span class="exp">用户名：</span>
        <el-input style="width:114px;" placeholder="请输入内容" v-model="form.username.value" clearable>
        </el-input>
        <span class="exp w-60 ml-20">用户属性：</span>
        <el-select v-model="form.userTypes.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in form.userTypes.options" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="option-row mb-20">
        <span class="exp w-60">状态：</span>
        <el-checkbox-group class="inline" v-model="form.checkList.value">
          <el-checkbox :label="option.value" v-for="option in form.checkList.options" :key="option.value">
            {{option.text}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="option-row">
        <span class="exp w-60">游戏时间：</span>
        <el-date-picker v-model="form.dateFrom.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="form.dateTo.value" type="datetime" prefix-icon="void-icon" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <a class="time ml-20" @click="setTimeToday">今日</a>
        <a class="time ml-20" @click="setTimeNowWeek">本周</a>
        <a class="time ml-20" @click="setTimeNowMonth">本月</a>
        <a class="time ml-20" @click="setTimeRecent3Days(-30)">近一月</a>
        <a class="submit ml-20" @click="handleSearch()">查询</a>
      </div>
    </div>
    <hr class="user-split-line">
    <table class="record-group mb-20">
      <tbody>
        <tr class="group-title">
          <th>用户名</th>
          <th>投注总额</th>
          <th>有效投注</th>
          <th>派奖总额</th>
          <th>投注返点</th>
          <th>彩票盈亏</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in agg" :key="index">
          <td>{{item.username}}</td>
          <td>{{item.totalVote | formatMoney}}</td>
          <td>{{item.totalTrueVote | formatMoney}}</td>
          <td>{{item.totalAward | formatMoney}}</td>
          <td>{{item.totalRefund | formatMoney}}</td>
          <td class="success">{{item.profit | formatMoney}}</td>
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
          <th>投注额</th>
          <th>奖金</th>
          <th>奖金组-返点</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" class="group-item" v-if="!noResult" :key="item._id">
          <td>{{item.loginname}}</td>
          <td>{{item.gamename}}</td>
          <td>
            <router-link :to="{name:'lotteryDetail',query:{id:item._id}}" :title="item.order_no">{{item.order_no}}
            </router-link>
          </td>
          <td>{{item.issue_no}}</td>
          <td>{{item.lottery3name + item.lotteryname}}</td>
          <td>
            <el-popover placement="right" title="投注内容" trigger="click">
              <div>
                <div class="row">
                  <label>投注号码：</label>
                  <span>{{item.vote_no}}</span>
                </div>
                <div class="row">
                  <label>中奖号码：</label>
                  <span>{{item.luck_no}}</span>
                </div>
              </div>
              <a slot="reference" @click="getDetail()">详细内容</a>
            </el-popover>
            <!-- <router-link :to="{name:'lotteryDetail',query:{id:item._id}}"></router-link> -->
          </td>
          <td>{{item.vote_cash | formatMoney}}</td>
          <td>{{item.award_cash | formatMoney}}</td>
          <td>{{item.refund}}</td>
          <td>{{getStatus(item.status)}}</td>
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
          <td>{{getCurrentPageVote}}</td>
          <td>{{getCurrentPageAward}}</td>
          <td></td>
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
  import { getStatusDesc } from '../common/lotteryStatus';

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
            key: 'gameid',
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
            key: 'lotteryid',
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
            key: 'lottery3id',
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
          //用户名
          username: {
            key: 'loginname',
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
          //用户属性
          userTypes: {
            key: 'self',
            value: 1,
            options: [{ text: '全部', value: 2 }, { text: '自己', value: 1 }, { text: '下级', value: 0 }],
            getValue() {
              if (this.value || this.value == 0) {
                return this.value;
              }
              return 2;
            },
            reset() {
              this.value = 2;
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
          //form End
        },
        username2: '',
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        agg: [] //投注统计
      }
    },
    methods: {
      getDetail() {},
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
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
      onSubmit() {
        let validate = true,
          data = {},
          self = this;
        if (this.form.userTypes.value == 1) {
          this.form.username.value = localStorage.getItem('loginname');
        }
        // let username = this.form.username.value;
        // this.username2 = username;
        // if (username) {
        //   this.username2 = username;
        // } else {
        //   this.form.username.value = localStorage.getItem('loginname');
        //   this.username2 = localStorage.getItem('loginname');
        // }
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
          self.$alert(errorMessage, '系统提醒', {
            confirmButtonText: '确定',
            center: true
          });
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
                  self.getAgg(data);
                } else {
                  self.noResult = true;
                  self.list = [];
                  self.agg = [];
                }
              } else if (success.returncode == 303) {
                self.noResult = true;
                self.list = [];
                self.agg = [];
                self.$message({
                  showClose: true,
                  message: '查询错误',
                  type: "error"
                });
              } else {
                self.noResult = true;
                self.list = [];
                self.agg = [];
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          }, (error) => {
            self.loading = false;
            self.list = [];
            self.agg = [];
            self.noResult = true;
            console.log('error', error);
          })
          return true;
        }
      },
      //获取下注统计
      getAgg(data) {
        let self = this;
        let url = '/lottery/issue/vote/agg';
        this.loading = true;
        request.http('get', url, data, (success) => {
          this.loading = false;
          if (success.returncode) {
            if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
              request.loginAgain(self);
            } else if (success.returncode == 200) {
              if (success.agg.length != 0) {
                this.agg = success.agg;
              }
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
            }
          }
        }, (error) => {
          this.loading = false;
          console.log('error', error);
        })
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
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
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
            } else {
              self.$message({
                showClose: true,
                message: success.returncode,
                type: "error"
              });
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
      },
      getStatus(value) {
        return getStatusDesc(value);
      }
    },
    computed: {
      getCurrentPageVote() {
        let vote = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            vote += this.list[i].vote_cash;
          }
        }
        return vote.toFixed(2);
      },
      getCurrentPageAward() {
        let award = 0.00;
        if (this.list.length != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].award_cash) {
              award += this.list[i].award_cash;
            }
          }
        }
        return award.toFixed(2);
      }
    },
    filters: {
      formatMoney(value) {
        if (value) {
          return parseFloat(value).toFixed(2);
        }
        return 0;
      },
    },
    mounted() {
      this.setTimeToday();
      this.form.username.value = localStorage.getItem('loginname');
      this.checkId();
    }
  }
</script>
<style>
  /* .lottery-wrap .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #3997fa;
    border-color: #3997fa;
  } */

  .lottery-wrap .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #191919;
  }

  /* .lottery-wrap .el-checkbox__inner:hover {
    border-color: #3997fa;
  }

  .lottery-wrap .el-checkbox__inner:visited {
    border-color: #3997fa;
  }

  .lottery-wrap .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #3997fa;
  } */
</style>
<style scoped>
  .w-60 {
    width: 60px
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
    /* margin-left: 20px; */
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
    font-size: 12px;
    color: #191919;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .lottery-wrap {
    color: #333333;
    width: 100%;
    margin: 0 auto;
    min-height: 731px;
    padding: 30px 20px;
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

  .mb-20 {
    margin-bottom: 20px;
  }

  .record-options {
    padding-bottom: 30px;
    background: #FFFFFF;
  }

  .record-options .option-row {
    text-align: left;
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
    width: 100%;
    /* margin: 0 auto; */
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
    background: #fff;
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
    padding: 15px 0;
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

  .record-options .option-row>a.time {
    display: inline-block;
    font-size: 12px;
    width: 64px;
    height: 30px;
    line-height: 28px;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-align: center;
  }

  .ml-20 {
    margin-left: 20px;
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
    width: 80px;
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
    /* border: 1px solid #CCC; */
    box-shadow: none;
    border: none;
    /* margin-left: 20px; */
  }
</style>