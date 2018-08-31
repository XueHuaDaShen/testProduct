<template>
  <div class="rechargeLot-wrap el-custom">
    <DialogUserInfo :loginname="loginname" :userid="userid" @closeDialog="handleCloseDialog" :dialogVisible="dialog"></DialogUserInfo>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model="username" placeholder="用户名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>流水号：</label>
            <el-input clearable v-model="order_no" placeholder="流水号" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>申请金额：</label>
            <el-input clearable v-model="outcomeRange.min" placeholder="最小金额" style="width:114px"></el-input>
            <span>--</span>
            <el-input clearable v-model="outcomeRange.max" placeholder="最大金额" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>提交时间：</label>
            <el-date-picker v-model="searchTime" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试账号：" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="yes small">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="no small">重置</el-button>
          </div>
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="order_no" label="流水号">
        </el-table-column>
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cash_apply" width="110" label="申请金额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="提交时间">
        </el-table-column>
        <el-table-column align="center" prop="update_at" :formatter="formatTime" label="更新时间">
        </el-table-column>
        <el-table-column align="center" prop="card_no" label="出款至">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <!-- <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试账号">
        </el-table-column>
        <el-table-column align="center" prop="cash_recharged" label="到账金额">
        </el-table-column> -->
        <el-table-column align="center" prop="status" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div class="flex-row">
              <el-button v-if="scope.row.status==1||scope.row.status==2||scope.row.status==3||scope.row.status==4"
                @click="toWithdrawFn(scope.row)" class="small yes">出款审核</el-button>
              <el-button @click="toWithdrawDetail(scope.row)" class="small edit" v-if="!(scope.row.status==1||scope.row.status==2||scope.row.status==3||scope.row.status==4)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 出款审核 dialog start -->
    <el-dialog :before-close="handleClose" title="出款审核" :center="false" :visible.sync="dialogFormVisible">
      <div class="detail">
        <span>出款信息</span>
        <p>
          <span class="exp">用户名：</span>
          <span>{{form.loginname}}</span>
        </p>
        <p>
          <span class="exp">账户名：</span>
          <span>{{form.realname}}</span>
        </p>
        <p>
          <span class="exp">银行名：</span>
          <span>{{form.bank}}</span>
        </p>
        <p>
          <span class="exp">银行卡号：</span>
          <span>{{form.card_no}}</span>
        </p>
        <p>
          <span class="exp">出款金额：</span>
          <span>{{form.cash_apply}}</span>
        </p>
        <p>
          <span class="exp">出款备注：</span>
          <span>{{form.message}}</span>
        </p>
      </div>
      <div class="entrance">
        <span>快捷通道</span>
        <ul class="clearfix">
          <li>
            <!-- <router-link :to="{name: 'userList', query: { param: form.loginname,index1:0,index2:3}}" target="_blank">
              <el-button class="small edit">会员管理</el-button>
            </router-link> -->
            <a @click="handleSkip('userList')">
              <el-button class="small edit">会员管理</el-button>
            </a>
          </li>
          <li>
            <!-- <router-link :to="{name: 'betsLog', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">投注记录</el-button>
            </router-link> -->
            <a @click="handleSkip('betsLog')">
              <el-button class="small edit">投注记录</el-button>
            </a>
          </li>
          <li>
            <a @click="handleSkip('accountChange')">
              <el-button class="small edit">帐变记录</el-button>
            </a>
            <!-- <router-link :to="{name: 'accountChange', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">帐变记录</el-button>
            </router-link> -->
          </li>
          <li>
            <a @click="handleSkip('userLog')">
              <el-button class="small edit">登录记录</el-button>
            </a>
            <!-- <router-link :to="{name: 'userLog', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">登录记录</el-button>
            </router-link> -->
          </li>
          <li>
            <a @click="handleSkip('stakecountList')">
              <el-button class="small edit">打码量记录</el-button>
            </a>
            <!-- <router-link :to="{name: 'stakecountList', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">打码量记录</el-button>
            </router-link> -->
          </li>
        </ul>
      </div>
      <div class="body-middle" style="border: 1px solid #eee;margin: 0 20px;margin-bottom:20px;">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="当前状态：" style="justify-content:flex-start">
            <span>{{getStatus(form.status)}}</span>
          </el-form-item>
          <el-form-item label="审核结果：" prop="statusSelected" style="justify-content:flex-start">
            <el-select v-model="form.statusSelected" placeholder="请选择状态">
              <el-option v-for="option in form.statusOptions" :key="option.value" :label="option.text" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="textarea" style="justify-content:flex-start">
            <el-input placeholder="请输入备注" v-model="form.textarea.value">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="yes" :loading="checkLoading">确 定</el-button>
        <el-button @click="resetForm('form')" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 出款审核 dialog end -->
    <!-- 出款详情 dialog start -->
    <el-dialog :before-close="handledetailClose" title="出款审核详情" :center="false" :visible.sync="detailDialogVisible">
      <div class="body-middle">
        <div class="detail-title">
          <p>出账审核：{{getStatus(detailForm.status)}}</p>
        </div>
        <table class="dialog-table" style="margin-top:30px;">
          <tr>
            <td class="title">状态</td>
            <td class="title">审核人</td>
            <td class="title">备注</td>
            <td class="title">审核时间</td>
          </tr>
          <tr v-if="detailForm.auditor1">
            <td align="left" class="td-right">
              一审通过
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor1}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message1?detailForm.message1:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit1_at)}}
            </td>
          </tr>
          <tr v-if="detailForm.auditor2">
            <td align="left" class="td-right">
              二审通过
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor2}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message2?detailForm.message2:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit2_at)}}
            </td>
          </tr>
          <tr v-if="detailForm.auditor3">
            <td align="left" class="td-right">
              终审通过
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor3}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message3?detailForm.message3:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit3_at)}}
            </td>
          </tr>
          <tr v-if="detailForm.auditor4">
            <td align="left" class="td-right">
              已出账
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor4}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message4?detailForm.message4:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit4_at)}}
            </td>
          </tr>
          <tr v-if="detailForm.auditor5">
            <td align="left" class="td-right">
              退单
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor5}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message5?detailForm.message5:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit5_at)}}
            </td>
          </tr>
          <tr v-if="detailForm.auditor6">
            <td align="left" class="td-right">
              审核失败
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor6}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message6?detailForm.message6:"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.audit6_at)}}
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tuidan()" class="no" v-if="detailForm.status === 5" :loading="tuidanLoading">银行退单</el-button>
        <el-button type="primary" @click="detailDialogVisible = false" class="yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 出款详情 dialog end -->
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from "../../lib/utils/validator";
  export default {
    name: 'outcomeLog',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        tuidanLoading: false,
        checkLoading: false,
        titleName: '出款记录',
        routerArr: [{
          title: '出款记录',
          name: 'outcomeLog',
          checked: false
        }],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        withdrawListData: [],
        userid: '',
        loginname: '',
        username: '',
        searchTime: '',
        outcomeRange: {
          min: "",
          max: ""
        },
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime()) - 3600 * 1000 * 24 * 1);
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) -
                  3600 * 1000 * 24 * 1);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "本周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            }, {
              text: "上周",
              onClick(picker) {
                let now = new Date();
                let nowDayOfWeek = now.getDay(); //今天本周的第几天
                let nowDay = now.getDate(); //当前日
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let getWeekStartDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString())
                  .getTime() -
                  3600 * 1000 * 24 * 7);
                let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1 - 3600 * 1000 * 24 * 7);
                // console.log("start", getWeekStartDate.toLocaleString());
                // console.log("end", getWeekEndDate.toLocaleString());
                picker
                  .$emit("pick", [getWeekStartDate, getWeekEndDate]);
              }
            },
            {
              text: "本月",
              onClick(picker) {
                let now = new Date();
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                //获得本月的开始日期
                let getMonthStartDate = new Date(nowYear, nowMonth, 1);
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                //获得本月的结束日期
                let getMonthEndDate = new Date(new Date(new Date(nowYear, nowMonth, days).toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 - 1);
                // console.log("start", getMonthStartDate.toLocaleString());
                // console.log("end", getMonthEndDate.toLocaleString());
                picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
              }
            },
            {
              text: "上月",
              onClick(picker) {
                var firstdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                var date = new Date();
                var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                var enddate = new Date(new Date(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day).toLocaleDateString())
                  .getTime() + 24 * 60 * 60 * 1000 - 1);
                // console.log("start", firstdate.toLocaleString());
                // console.log("end", enddate.toLocaleString());
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 7);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90);
                // console.log("start", start.toLocaleString());
                // console.log("end", end.toLocaleString());
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        typeArr: [{
          value: '1',
          label: '微信'
        }, {
          value: '2',
          label: '支付宝'
        }, {
          value: '3',
          label: '银行卡转账'
        }],
        statusArr: [{
            value: '1',
            label: '申请'
          }, {
            value: '2',
            label: '一审'
          }, {
            value: '3',
            label: '二审'
          }, {
            value: '4',
            label: '三审'
          }, {
            value: '5',
            label: '出账'
          },
          {
            value: '6',
            label: '银行退单'
          },
          {
            value: '7',
            label: '审核失败'
          },
          // {
          //   value: '8',
          //   label: '到账'
          // }
        ],
        status: '',
        order_no: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        // 出款审核form
        form: {
          // 出款状态 span
          status: '',
          // 出款状态select options
          statusOptions: [],
          // 出款状态select selected
          statusSelected: '',
          // 备注
          textarea: {
            key: '',
            value: ''
          },
          // 用户名
          loginname: '',
          account: '',
          bank: "",
          card_no: "",
          cash_apply: "",
          message: '',
          realname: ''
        },
        rules: {
          statusSelected: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          textarea: [{
            required: true,
            message: '请填写备注',
            trigger: 'change'
          }]
        },
        currId: '',
        detailDialogVisible: false,
        // 出款详情form
        detailForm: {},
        testUser: [{
            value: "",
            label: "全显示"
          }, {
            value: "0",
            label: "不显示"
          },
          {
            value: "1",
            label: "仅显示"
          }
        ],
        is_test: '0',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'outcomeLog') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
      this.getWithdrawLotList();
    },
    methods: {
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "--"
      },
      handleSkip(name) {
        let menus = localStorage.getItem('menus');
        let menusjson = JSON.parse(menus);
        const vm = this;
        console.log('menusjson', menusjson);
        let index1, index2;
        let selected = false;
        for (let i = 0; i < menusjson.length; i++) {
          index1 = i;
          let f_obj = menusjson[i];
          for (let j = 0; j < f_obj.child.length; j++) {
            index2 = j;
            let san_ = f_obj.child[j].child;
            for (let h = 0; h < san_.length; h++) {
              let url = san_[h].url;
              if (name === url) {
                selected = true;
                break;
              }
            }
            if (selected) {
              break;
            }
          }
          if (selected) {
            break;
          }
        }
        const {
          href
        } = this.$router.resolve({
          name: name,
          query: {
            param: vm.form.loginname,
            index1: index1,
            index2: index2
          }
        })
        console.log('href', href);
        window.open(href, '_blank')
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
        // console.log(name)
      },
      success() {
        const vm = this;
        this.$message({
          message: '加载成功',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: '加载失败',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
            // case 8:
            //   return '到账';
        }
      },
      getStatus(status) {
        // console.log(typeof cellValue)
        switch (status) {
          case 1:
            return '申请';
          case 2:
            return '一审通过';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return '审核失败';
            // case 8:
            //   return '到账';
        }
      },
      getTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      formatTestUser(row, column, cellValue) {
        let t = '';
        if (cellValue === 1) {
          t = '是'
        } else {
          t = '否'
        }
        return t;
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getWithdrawLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      formatTime2(cellValue) {
        if (cellValue) {
          return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        }
        return "--"
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              id: vm.currId,
              status: vm.form.statusSelected,
            }
            data[vm.form.textarea.key] = vm.form.textarea.value
            let url = '/trade/withdraw/update'
            vm.checkLoading = true;
            request.http(
              'post', url, data,
              (success) => {
                vm.checkLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.resetForm('form');
                  vm.getWithdrawLotList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.checkLoading = false;
                vm.resetForm('form');
                vm.error();
                console.log(error)
              }
            )
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      tuidan() {
        const vm = this;
        let data = {
          id: vm.currId,
          status: 6,
          message: "银行退单"
        }
        let url = '/trade/withdraw/update'
        vm.tuidanLoading = true;
        request.http(
          'post', url, data,
          (success) => {
            vm.tuidanLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.dialogFormVisible = false;
              vm.getWithdrawLotList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.tuidanLoading = false;
            vm.resetForm('form');
            vm.error();
            console.log(error)
          }
        )
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.form.textarea = {
          key: "",
          value: ""
        }
      },
      // open 出款审核dialog
      toWithdrawFn(row) {
        const vm = this;
        this.dialogFormVisible = true;
        this.form.status = row.status;
        this.currId = row._id;
        this.form.loginname = row.loginname;
        this.form.realname = row.realname;
        this.form.account = row.loginname;
        this.form.bank = row.bank;
        this.form.card_no = row.card_no;
        this.form.cash_apply = row.cash_apply;
        this.form.message = row.message;
      },
      // open 出款详情 dialog
      toWithdrawDetail(row) {
        this.detailDialogVisible = true;
        this.detailForm = row;
        this.currId = row._id;
      },
      getWithdrawLotList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/trade/withdraw/apply/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            // type: vm.type,
            status: vm.status,
            order_no: trim(vm.order_no),
            is_test: vm.is_test,
            begin_cash_apply: vm.outcomeRange.min,
            end_cash_apply: vm.outcomeRange.max
          },
          (success) => {
            vm.loading = false;
            // console.log('withdrawLotList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.username = '';
        this.searchTime = '';
        this.status = '';
        this.order_no = '';
        this.is_test = '0';
        this.outcomeRange.min = null;
        this.outcomeRange.max = null;
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
      },
      handleClose() {
        this.resetForm('form')
      },
      handledetailClose() {
        this.detailDialogVisible = false;
      }
    },
    watch: {
      "form.status"(newVal, oldVal) {
        if (newVal) {
          if (newVal != oldVal) {
            switch (newVal) {
              case 1:
                this.form.statusOptions = [{
                    text: '一审通过',
                    value: 2
                  },
                  {
                    text: '审核失败',
                    value: 7
                  },
                ];
                this.form.textarea.key = 'message1';
                break;
              case 2:
                this.form.statusOptions = [{
                    text: '二审通过',
                    value: 3
                  },
                  {
                    text: '审核失败',
                    value: 7
                  },
                ];
                this.form.textarea.key = 'message2';
                break;
              case 3:
                this.form.statusOptions = [{
                    text: '终审通过',
                    value: 4
                  },
                  {
                    text: '审核失败',
                    value: 7
                  }
                ];
                this.form.textarea.key = 'message3';
                break;
              case 4:
                this.form.statusOptions = [{
                  text: '出账',
                  value: 5
                }];
                this.form.textarea.key = 'message4';
                break;
              case 5:
                this.form.statusOptions = [{
                  text: '已到账',
                  value: 8
                }, {
                  text: '银行退单',
                  value: 6
                }];
                this.form.textarea.key = 'message5';
                break;
            }
          }
        }
      }
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

  .rechargeLot-wrap .flex-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .rechargeLot-wrap .flex-row>button {
    flex: 1;
    padding: 0;
  }

</style>

<style scoped lang="scss">
  li {
    list-style: none;
  }

  .cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .detail-title {
    text-align: left;

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      margin-left: 30px;
      font-weight: 700;
    }
  }

  .dialog-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-table td {
    font-size: 12px;
    line-height: 38px;
    height: 40px;
    text-align: center;
    color: #191919;
    border-left: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .dialog-table tfoot td {
    border: none;
  }

  .dialog-table td.title {
    border: none;
    line-height: 38px;
    height: 40px;
    background: #f0f0f0;
    text-align: center;
    font-size: 12px;
    color: #191919;
  }

  .dialog-table .td-left {
    background: #f2f2f2;
  }

  .dialog-table .td-right {
    text-align: center;
  }

</style>
