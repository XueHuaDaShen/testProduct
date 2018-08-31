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
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>入款渠道：</label>
            <el-select clearable v-model="type.value" placeholder="入款渠道：" @focus="incomeWayFocus" class="small"
              :loading="type.loading" :loading-text="type.loadingtext">
              <el-option v-for="item in type.options" :key="item._id" :label="item.ditch" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>入款账户：</label>
            <el-input clearable v-model="card_no" placeholder="入款账户" style="width:114px"></el-input>
          </div> -->
          <div class="search-inner-wrap">
            <label>流水号：</label>
            <el-input clearable v-model="order_no" placeholder="流水号" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>提交时间：</label>
            <el-date-picker v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>申请金额：</label>
            <el-input clearable v-model="incomeRange.min" placeholder="最小金额" style="width:114px" type="number"></el-input>
            <span>--</span>
            <el-input clearable v-model="incomeRange.max" placeholder="最大金额" style="width:114px" type="number"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="选择" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="order_no" label="流水号" width="145">
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
        <el-table-column align="center" label="到账金额" prop="cash_recharged" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="recharge_at" :formatter="formatTime" label="操作时间">
        </el-table-column>
        <!-- <el-table-column align="center" prop="card_no" label="银行卡号">
        </el-table-column> -->
        <el-table-column align="center" prop="account.method" label="充值类型">
        </el-table-column>
        <el-table-column align="center" prop="account.name" width="150" label="存入账户">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="message" width="80" label="备注">
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1" @click="toRechargeFn(scope.row)" class="yes small">充值审核</el-button>
            <el-button v-if="scope.row.status==2" @click="getDetail(scope.row)" class="edit small">详情</el-button>
            <el-button v-if="scope.row.status==3" @click="resetCheck(scope.row)" class="small edit">恢复申请</el-button>
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
    <el-dialog title="充值审核" :center="false" :visible.sync="dialogFormVisible">
      <div class="body-middle">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="真实姓名：" v-if="form.realName">
            <el-input v-model="form.realName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="银行卡卡号" v-if="form.bank_no">
            <el-input v-model="form.bank_no" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="审核结果：" prop="rechargeStatus">
            <el-select v-model="form.rechargeStatus" placeholder="请选择状态">
              <el-option label="充值成功" value="2"></el-option>
              <el-option label="充值失败" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到账金额：" prop="realRecharge">
            <el-input v-model="form.realRecharge" placeholder="请输入实际充值金额" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="message">
            <el-input v-model="form.message" placeholder="请输入备注">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="yes" :loading="rechargeLoading">确 定</el-button>
        <el-button @click="resetForm('form')" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="充值详情" :center="false" :visible.sync="detailVisible">
      <div class="body-middle">
        <el-form>
          <el-form-item label="真实姓名：" v-if="detail.realName">
            <el-input v-model="detail.realName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="银行卡卡号" v-if="detail.bank_no">
            <el-input v-model="detail.bank_no" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="审核结果：" v-if="detail.rechargeStatus">
            <el-select v-model="detail.rechargeStatus" disabled>
              <el-option label="充值成功" :value="2"></el-option>
              <el-option label="充值失败" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到账金额：" v-if="detail.realRecharge">
            <el-input v-model="detail.realRecharge" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="备注：" v-if="detail.message">
            <el-input v-model="detail.message" disabled>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDetail()" class="yes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    price,
    trim
  } from "../../lib/utils/validator";
  export default {
    name: "rechargeLog",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      var validateRecharge = (rule, value, callback) => {
        if (!price(value)) {
          callback(new Error("金额必须大于0"));
        } else {
          callback();
        }
      };
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        rechargeLoading: false,
        titleName: '第三方入款记录',
        routerArr: [{
            title: '第三方渠道',
            name: 'thirdpartyManager',
            checked: false
          }, {
            title: '扫码管理',
            name: 'paymentWx',
            checked: false
          },
          {
            title: '银行卡管理',
            name: 'paymentBank',
            checked: false
          },
          {
            title: 'BWIN入款记录',
            name: 'rechargeLog',
            checked: false
          },
          {
            title: '第三方入款记录',
            name: 'thirdRechargeLog',
            checked: false
          },
          {
            title: '前端展示',
            name: 'tradeAccountLog',
            checked: false
          },
        ],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        rechargeListData: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
        card_no: '',
        incomeRange: {
          min: "",
          max: ""
        },
        recharge: "",
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
        statusArr: [{
            value: "1",
            label: "申请充值"
          },
          {
            value: "2",
            label: "充值成功"
          },
          {
            value: "3",
            label: "充值失败"
          }
        ],
        type: {
          value: "",
          options: [],
          loading: false,
          loadingtext: "正在搜索...",
        },
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        form: {
          rechargeStatus: "",
          realRecharge: "",
          message: '',
          bank_no: "",
          realName: "",
        },
        detail: {
          rechargeStatus: "",
          realRecharge: "",
          message: '',
          bank_no: "",
          realName: "",
        },
        rules: {
          rechargeStatus: [{
            required: true,
            message: "请选择状态",
            trigger: "change"
          }],
          realRecharge: [{
              required: true,
              message: "请输入金额",
              trigger: "change"
            },
            {
              trigger: "blur",
              validator: validateRecharge
            }
          ],
          message: [{
            required: true,
            message: "请输入备注",
            trigger: "change"
          }]
        },
        // formLabelWidth: "120px",
        currId: "",
        // currentCash: "",
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
        detailVisible: false,
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      const menus = JSON.parse(localStorage.getItem('menus'));
      menus[this.index1].child[this.index2].child.filter((v, vi) => {
        let o = new Object();
        if (v.url === 'thirdRechargeLog') {
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
      this.getRechargeLotList();
    },
    methods: {
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2);
        }
        return "--"
      },
      incomeWayFocus(event) {
        if (this.type.options.length != 0) {
          return;
        }
        this.getIncomeWays();
      },
      handleChangeRouter(name) {
        console.log(name)
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
      },
      // 获取入款渠道
      getIncomeWays() {
        let vm = this;
        vm.type.loading = true;
        let url = "/trade/account/list";
        request.http(
          "get",
          url, {
            PageSize: 1000,
            bwin: 2, // 1,bwin 2,第三方
          },
          success => {
            vm.type.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                vm.type.options = success.data;
              } else {
                vm.type.loading = false;
              }
            }
          },
          error => {
            vm.type.loading = false;
          }
        );
      },
      success() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration,
          center: true
        });
      },
      message(message, type) {
        const vm = this;
        vm.$message({
          message: message,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: "加载失败",
          type: "error",
          duration: vm.duration,
          center: true
        });
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "申请充值";
          case 2:
            return "充值成功";
          case 3:
            return "充值失败";
        }
      },
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "微信";
          case 2:
            return "支付宝";
          case 3:
            return "银行卡转账";
          default:
            return "--"
        }
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
        this.getRechargeLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getRechargeLotList();
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
        // console.log("row", row)
        // console.log("column", column)
        if (cellValue) {
          if (row.status === 3 || row.status === 1) {
            if (column.property === "create_at") {
              return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
            }
          } else if (row.status === 2) {
            return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
          }
        }
        return "--"
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            vm.rechargeLoading = true;
            request.http(
              "post",
              "/trade/recharge/update", {
                id: vm.currId,
                status: vm.form.rechargeStatus,
                cash_recharged: vm.form.realRecharge,
                message: vm.form.message
              },
              success => {
                vm.rechargeLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.resetForm("form");
                  vm.getRechargeLotList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.rechargeLoading = false;
                vm.error();
                console.log(error);
              }
            );
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetCheck(row) {
        const vm = this;
        vm.loading = true;
        request.http(
          "post",
          "/trade/recharge/update", {
            id: row._id,
            cash_recharged: row.cash_recharged,
            status: "1",
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.getRechargeLotList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.recharge = "";
        this.$refs[formName].resetFields();
      },
      toRechargeFn(row) {
        this.dialogFormVisible = true;
        this.currId = row._id;
        // this.currentCash = row.cash_apply;
        this.recharge = row.cash_apply;
        this.form.realName = row.realname ? row.realname : "";
        this.form.bank_no = row.card_no ? row.card_no : "";
      },
      getDetail(row) {
        this.detailVisible = true;
        this.detail.rechargeStatus = row.status;
        this.detail.realRecharge = row.cash_recharged ? row.cash_recharged : "";
        this.detail.message = row.message && row.message;
        this.detail.realName = row.realname ? row.realname : "";
        this.detail.bank_no = row.card_no ? row.card_no : "";
      },
      closeDetail() {
        this.detailVisible = false;
        this.detail.rechargeStatus = "";
        this.detail.realRecharge = "";
        this.detail.message = "";
        this.detail.realName = "";
        this.detail.bank_no = "";
      },
      getRechargeLotList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          "get",
          "/trade/recharge/apply/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            account: vm.type.value,
            status: vm.status,
            order_no: trim(vm.order_no),
            is_test: vm.is_test,
            begin_cash_apply: vm.incomeRange.min,
            end_cash_apply: vm.incomeRange.max
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.rechargeListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.message("请求成功", "success");
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      handleReset() {
        this.username = "";
        this.searchTime = "";
        this.type = "";
        this.status = "";
        this.order_no = "";
        this.is_test = '0';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getRechargeLotList();
      }
    },
    watch: {
      'form.rechargeStatus'() {
        this.form.realRecharge = (this.form.rechargeStatus === "2" ? this.recharge : 0);
      }
    }
  };

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>
