<!--下级开户 - 链接开户-->
<template>
  <div class="lottery-wrap" v-loading="loading">
    <!-- <div class="record-tabs">
      <router-link :to="{name:'artificialCreate'}" class="tab-item">新增下级
      </router-link>
      <router-link :to="{name:'linkCreate'}" class="tab-item active">链接开户
      </router-link>
    </div> -->
    <div class="record-options search-form">
      <!-- <div class="option-row mb-20">
        <span class="exp">
          用户类型：
        </span>
        <el-select v-model="userType.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in userType.options" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </div> -->
      <div class="option-row">
        <span class="exp">
          链接有效期：
        </span>
        <el-select v-model="inDate.value" placeholder="请选择" clearable style="width:114px">
          <el-option v-for="item in inDate.options" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="percentage-row">
        <span class="title">奖金组设置</span>
        <span class="left1-title">设置奖金组</span>
        <input class="salary-input" @blur="handleInputGroup" v-model.number="salary.group" />
        <el-slider v-model.number="salary.group" class="slider" :max="salary.max" :min="salary.min" :step="salary.step"></el-slider>
        <span class="rebatesRateTitle">预计平均返点率</span>
        <span class="rebatesRate" v-text="rebatesRate"></span>
      </div>
      <a class="link-create mb-30" @click="onSubmit">生成链接</a>
    </div>
    <hr class="user-split-line">
    <table class="record-group">
      <tbody>
        <tr class="group-title">
          <th>编号</th>
          <th>奖金组</th>
          <th>有效期</th>
          <th>注册人数</th>
          <th>生成时间</th>
          <th>复制链接</th>
          <th>状态</th>
        </tr>
        <tr class="group-item" v-for="(item,index) in list" v-if="!noResult" :key="index">
          <td>{{item.code}}</td>
          <td>{{item.refund}}</td>
          <td>{{getInDate(item.effect_time)}}</td>
          <td>{{item.user_num ? item.user_num :0}}</td>
          <td>{{getTime(item.create_at)}}</td>
          <td>
            <input v-model="item.url" class="url" :id="'cli'+index" />
            <a class="delete ml-20" data-clipboard-action="copy" :data-clipboard-target="'#cli'+index" @click="copylink(item.url,index)">复制</a>
          </td>
          <td>
            <!--<router-link class="normal" :to="{name:'linkDetail',query:{id:item._id}}">详情</router-link>-->
            <a class="delete ml-8" @click="makeSureDelete(item._id)">删除</a>
          </td>
        </tr>
        <tr v-if="noResult" class="no-result">
          <td colspan="10">
            <p>没有符合条件的记录，请更改查询条件</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="record-pagination clearfix">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import request from "../axios/axios";
  // import ClipboardJS from 'clipboard';
  import moment from 'moment';

  export default {
    data() {
      return {
        loading: false,
        list: [],
        noResult: true,
        userType: {
          value: "0",
          options: [{ text: "代理", value: "0" }, { text: "会员", value: "1" }]
        },
        inDate: {
          value: "",
          options: [
            { text: "1天", value: 1 },
            { text: "7天", value: 7 },
            { text: "30天", value: 30 },
            {
              text: "90天",
              value: 90
            },
            { text: "永久有效", value: 365 }
          ]
        },
        salary: {
          group: 0,
          max: 0,
          min: 1800,
          step: 2
        },
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 10 //单页条数
      };
    },
    computed: {
      rebatesRate() {
        return (
          ((this.salary.max - this.salary.group) / 2000 * 100).toFixed(2) + " %"
        );
      },
      numberSlaryGroup() {
        return Number(this.salary.group);
      }
    },
    methods: {
      getTime(time) {
        if (time) {
          return moment(time).format("YYYY-MM-DD , HH:mm:ss");
        }
        return "--"
      },
      copylink(url, index) {
        let id = 'cli' + index.toString();
        const input = document.getElementById(id);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          // console.log('复制成功');
          this.$message({
            type: 'success',
            message: '复制成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '复制失败，请手动复制链接'
          });
        }
      },
      makeSureDelete(id) {
        this.$confirm("确定关闭该开户链接?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.linkDelete(id);
          })
          .catch(() => {
            /*this.$message({
              type: 'info',
              message: '已取消关闭'
            });*/
          });
      },
      linkDelete(id) {
        let url = "/user/team/link/delete";
        let self = this;
        request.http(
          "post",
          url,
          {
            id: id
          },
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.$alert("删除成功！", "系统提醒", {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {
                    self.getLinkList();
                  }
                });
              }
            }
          },
          error => {
            self.loading = false;
            self.$alert("删除失败", "系统提醒", {
              confirmButtonText: "确定",
              center: true
            });
          }
        );
      },
      getUserType(value) {
        let text = "";
        switch (value) {
          case "1":
            text = "代理";
            break;
          case "2":
            text = "会员";
            break;
        }
        return text;
      },
      getInDate(value) {
        let text = "";
        switch (value) {
          case 1:
            text = "1天";
            break;
          case 7:
            text = "7天";
            break;
          case 30:
            text = "30天";
            break;
          case 90:
            text = "90天";
            break;
          case 365:
            text = "365天";
            break;
        }
        return text;
      },
      salarySlideChange(value) {
        if (value) {
          // console.log("value", value);
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getLinkList();
      },
      // 输入奖金组
      handleInputGroup() {
        const vm = this;
        let max = vm.salary.max;
        let min = vm.salary.min;
        let group = vm.salary.group;
        if (group < min) {
          group = min;
        }
        if (group > max) {
          group = max;
        }
        vm.salary.group = Number(group);
      },
      onSubmit() {
        let data = {},
          self = this;
        // if (!this.userType.value) {
        //   self.$alert("请选择用户类型", "系统提醒", {
        //     confirmButtonText: "确定",
        //     center: true
        //   });
        //   return false;
        // }
        if (!this.inDate.value) {
          self.$alert("请选择链接有效期", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
          return false;
        }
        if (!this.salary.group) {
          self.$alert("请设置奖金组", "系统提醒", {
            confirmButtonText: "确定",
            center: true
          });
          return false;
        }
        this.loading = true;
        let url = "/user/team/link/create";
        data["type"] = this.userType.value;
        data["effect_time"] = this.inDate.value;
        data["refund"] = this.salary.group;
        request.http(
          "post",
          url,
          data,
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 103 || success.returncode == 106 || success.returncode == 101) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                if (success.data.length != 0) {
                  self.$alert("开户链接已创建！", "系统提醒", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: action => {
                      self.getLinkList();
                    }
                  });
                } else {
                  self.$alert("没有符合条件的记录", "系统提醒", {
                    confirmButtonText: "确定",
                    center: true
                  });
                }
              }
            }
          },
          error => {
            self.loading = false;
            console.log("error", error);
          }
        );
      },
      getLinkList() {
        let url = "/user/team/link/list",
          data = {};
        let self = this;
        this.loading = true;
        data["page_size"] = this.pageSize;
        data["page_num"] = this.pageIndex;
        request.http(
          "get",
          url,
          data,
          success => {
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
                  // let clipboard = new ClipboardJS('.normal');
                  // clipboard.on('success', function(e) {
                  //   // console.info('Action:', e.action);
                  //   // console.info('Text:', e.text);
                  //   // console.info('Trigger:', e.trigger);
                  //   self.$message({
                  //     type: 'success',
                  //     message: '复制成功！'
                  //   });
                  //   e.clearSelection();
                  // });

                  // clipboard.on('error', function(e) {
                  //   // console.error('Action:', e.action);
                  //   // console.error('Trigger:', e.trigger);
                  //   self.$message({
                  //     type: 'error',
                  //     message: '复制失败，请手动复制文本内容'
                  //   });
                  // });
                } else {
                  self.noResult = true;
                }
              }
            }
          },
          error => {
            self.loading = false;
            self.noResult = true;
            console.log("error", error);
          }
        );
      },
    },
    watch: {
      "salary.group"(newVal, oldVal) {
        // this.salary.group = parseFloat(this.salary.group);
        if (newVal != oldVal) {
          if (newVal) {
            if (newVal > this.salary.max || newVal < this.salary.min) {
              // this.salary.group == this.salary.min;
            }
          }
        }
      }
    },
    mounted() {
      this.salary.max = parseFloat(localStorage.getItem('refund').toString());
      this.salary.group = parseFloat(localStorage.getItem('refund').toString());
      this.getLinkList();
    },
    created() {
      this.$store.dispatch('setbodyBG', 'no-bg');
      localStorage.setItem('bodyBG', 'no-bg');
    }
  };
</script>
<style lang="scss">
  .percentage-row .slider {
    .el-slider__bar {
      height: 6px;
      background-color: #CC3447;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      position: absolute;
    }

    .el-slider__button {
      border-color: #CC3447;
    }
  }
</style>
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

  .percentage-row {
    height: 70px;
    line-height: 70px;
    width: 100%;
    margin: 30px 0;
    font-size: 12px;
    text-align: left;
    background: #F6F6F6;
    border: 1px solid #DDDDDD;
  }

  .percentage-row .title {
    margin-left: 86px;
    font-size: 12px;
    display: inline-block;
    color: #191919;
    font-weight: 700;
  }

  .percentage-row .left1-title {
    margin-left: 86px;
    display: inline-block;
    font-size: 12px;
    color: #191919;
  }

  .percentage-row .salary-input {
    width: 114px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    text-align: center;
    margin-left: 10px;
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .ml-8 {
    margin-left: 8px;
  }

  .percentage-row .slider {
    margin-left: 20px;
    width: 260px;
    display: inline-block;
    vertical-align: middle;
  }

  .percentage-row .rebatesRateTitle {
    margin-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #777777;
  }

  .percentage-row .rebatesRate {
    margin-left: 10px;
    height: 30px;
    display: inline-block;
    width: 82px;
    line-height: 30px;
    text-align: center;
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
    border-radius: 2px;
    font-size: 12px;
    color: #191919;
    font-family: PingFangSC-Regular;
  }

  .link-create {
    width: 115px;
    height: 40px;
    cursor: pointer;
    line-height: 40px;
    text-decoration: none;
    display: inline-block;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 700;
  }

  .no-result p {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
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
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
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
    background: #f9efef;
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
    background: #ffffff;
  }

  .lottery-wrap .record-options .option-row .exp {
    display: inline-block;
    font-size: 12px;
    color: #191919;
    min-width: 72px;
    text-align: left;
  }

  .record-options .option-row {
    text-align: center;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }

  .record-options .option-row>input[type="text"] {
    display: inline-block;
    width: 158px;
    height: 30px;
    line-height: 30px;
    padding: 4px 5px;
    border: 1px solid #8d8d8d;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #ffffff;
    border-radius: 2px;
    box-sizing: border-box;
    transition: all 0.2s;
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
    border: 1px solid #d4914d;
  }

  .record-options .option-row>a:hover {
    background: #d4914d;
    color: #fff;
  }

  .record-group {
    width: 100%;
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
    padding: 15px 0;
    color: #777;
  }

  .record-group .group-title>th:last-child:after {
    content: none;
  }

  .record-group .group-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dddddd;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }

  .record-group .group-item .url {
    height: 30px;
    line-height: 28px;
    border: 1px solid #999799;
    text-indent: 17px;
    display: inline-block;
    text-align: left;
    width: 200px;
    vertical-align: middle;
    font-size: 12px;
    color: #535471;
    background: #ffffff;
    border-radius: 2px;
    box-sizing: inherit;
    -moz-box-sizing: inherit;
    -webkit-box-sizing: inherit;
    transition: all 0.2s;
    -moz-transition: all 0.2s;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .record-group .group-item .url:focus {
    border-color: #d4914d;
    outline: none;
  }

  .record-group .group-item a.normal {
    color: #fff;
    display: inline-block;
    line-height: 25px;
    font-size: 12px;
    width: 49px;
    height: 25px;
    background: #CC3447;
    border-radius: 6px;
  }

  .record-group .group-item a.delete {
    display: inline-block;
    line-height: 28px;
    width: 60px;
    height: 30px;
    border-radius: 6px;
    background: #CC3447;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
  }

  .record-options .option-row>a.time {
    display: inline-block;
    padding: 0 2px;
    font-size: 12px;
    width: 56px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    border: 1px solid #8d8d8d;
    text-align: center;
  }

  .record-options .option-row>a.time:hover {
    background: #d4914d;
    color: #fff;
  }

  .record-group .group-item:nth-child(2n) {
    background: #fff;
  }

  .record-group .group-item:nth-child(2n + 1) {
    background: #f7f7f7;
  }

  .record-group .record-bottom {
    width: 100%;
    background: #f0bd88;
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
    color: #099f4c;
  }

  .failed {
    color: #e10c0c;
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
    background: #e9e9e9;
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
    height: 28px;
    padding: 0 29px;
    line-height: 25px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    font-family: microsoft yahei;
    background-color: #d4914d;
    border: none;
    box-shadow: none;
  }
</style>