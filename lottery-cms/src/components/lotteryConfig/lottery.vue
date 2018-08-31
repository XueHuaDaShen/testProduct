<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>类别：</label>
            <el-select v-model="type.value" clearable placeholder="类别" class="small" @focus="typeFocus()" @change="typeChange">
              <el-option v-for="(item,index) in type.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>彩种：</label>
            <el-select v-model="lotteryType.value" clearable placeholder="彩种" class="small">
              <el-option v-for="(item,index) in lotteryType.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>查找时间：</label>
            <el-date-picker v-model="searchTime" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button class="edit" @click="openManual()">手动开奖</el-button>
          <el-button class="edit" @click="openSpecial()">异常开奖</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="logListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="l2" label="彩种">
        </el-table-column>
        <el-table-column align="center" prop="issue_no" label="彩期">
        </el-table-column>
        <el-table-column align="center" prop="open_at" :formatter="formatTime" label="开奖时间">
        </el-table-column>
        <el-table-column align="center" prop="luck_no" label="开奖号码">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="手动开奖" :before-close="closeManual" :visible.sync="dialogVisible">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">彩种</span>
            <span class="exp-after">：</span>
            <el-select clearable v-model="form.lotteryKind.value" placeholder="请选择彩种" class="small" :loading="form.lotteryKind.loading"
              :loading-text="form.lotteryKind.loadingText" @focus="formgameTypeFocus()" @change="formLotteryTypeChange">
              <el-option-group v-for="(group,index) in form.lotteryKind.options" :key="index" :label="group.name">
                <el-option v-for="(item,index) in group.childLotterys" :key="index" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">彩期</span>
            <span class="exp-after">：</span>
            <el-date-picker v-model="dialogTime" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="dateChange()">
            </el-date-picker>
          </div>
          <div class="form-row">
            <span class="exp"></span>
            <span class="exp-after" style="width:12px;"></span>
            <el-select clearable v-model="form.lotteryNo.value" :placeholder="form.lotteryNo.placeholder" class="small"
              @focus="formLotteryNoFocus()" :loading-text="form.lotteryNo.loadingText" :loading="form.lotteryNo.loading">
              <el-option v-for="(item,index) in form.lotteryNo.options" :key="index" :label="item.issue_no +'--' + formatTime2(item.open_at)"
                :value="item.issue_no">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">开奖号码</span>
            <span class="exp-after">：</span>
            <el-input type="text" v-model="form.awardNo" placeholder="开奖号码需以 , 号隔开"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm()" class="yes">确 定</el-button>
        <el-button @click="closeManual()" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="异常开奖" :before-close="closeSpecial" :visible.sync="dialogVisibleS">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">彩种</span>
            <span class="exp-after">：</span>
            <el-select clearable v-model="formS.lotteryKind.value" placeholder="请选择彩种" class="small" :loading="formS.lotteryKind.loading"
              :loading-text="formS.lotteryKind.loadingText" @focus="formgameTypeFocusS()" @change="formLotteryTypeChangeS">
              <el-option-group v-for="(group,index) in formS.lotteryKind.options" :key="index" :label="group.name">
                <el-option v-for="(item,index) in group.childLotterys" :key="index" :label="item.name" :value="item._id">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">彩期</span>
            <span class="exp-after">：</span>
            <el-date-picker v-model="dialogTimeS" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="dateChangeS()">
            </el-date-picker>
          </div>
          <div class="form-row">
            <span class="exp"></span>
            <span class="exp-after" style="width:12px;"></span>
            <el-select clearable v-model="formS.lotteryNo.value" :placeholder="formS.lotteryNo.placeholder" class="small"
              @focus="formLotteryNoFocusS()" :loading-text="formS.lotteryNo.loadingText" :loading="formS.lotteryNo.loading">
              <el-option v-for="(item,index) in formS.lotteryNo.options" :key="index" :label="item.issue_no +'--' + formatTime2(item.open_at)"
                :value="item.issue_no">
              </el-option>
            </el-select>
            <el-input v-model="formS.lotteryNo.value"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormS()" class="yes" :loading="specialLoading">确 定</el-button>
        <el-button @click="closeSpecial()" class="no">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  export default {
    name: 'lottery',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        specialLoading: false,
        titleName: '开奖管理',
        routerArr: [{
            title: '开奖管理',
            name: 'lottery',
            checked: false
          },
          {
            title: '彩种管理',
            name: 'lotteryType',
            checked: false
          },
          {
            title: '玩法管理',
            name: 'playType',
            checked: false
          },
        ],
        dialogTime: "",
        dialogTimeS: "",
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        logListData: [],
        username: '',
        searchTime: '',
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [{
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime()) - 3600 * 1000 * 24 * 1);
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) -
                  3600 * 1000 * 24 * 1);
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
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
                picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
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
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        type: {
          value: "",
          options: [],
          loading: false,
          loadingText: "正在加载...",
        },
        lotteryType: {
          value: "",
          options: [],
        },
        dialogVisible: false,
        form: {
          lotteryKind: {
            options: [],
            value: "",
            loading: false,
            loadingText: "正在加载...",
          },
          lotteryNo: {
            options: [],
            value: "",
            loading: false,
            loadingText: "正在加载...",
            placeholder: "请选择彩期"
          }, // 彩期
          awardNo: "" //彩票号码
        },
        dialogVisibleS: false,
        formS: {
          lotteryKind: {
            options: [],
            value: "",
            loading: false,
            loadingText: "正在加载...",
          },
          lotteryNo: {
            options: [],
            value: "",
            loading: false,
            loadingText: "正在加载...",
            placeholder: "请选择彩期"
          }, // 彩期
        },
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
        if (v.url === 'lottery') {
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
      this.getLotteryList();
    },
    methods: {
      dateChange() {
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
      },
      dateChangeS() {
        this.formS.lotteryNo.options = [];
        this.formS.lotteryNo.value = "";
      },
      submitForm() {
        const vm = this;
        if (!vm.form.lotteryKind.value) {
          vm.message('请选择彩种', "error");
          return;
        }
        if (!vm.form.lotteryNo.value) {
          vm.message('请选择彩期', "error");
          return;
        }
        if (!vm.form.awardNo) {
          vm.message('请设置开奖号码,开奖号码需以 , 号隔开', "error");
          return;
        }
        request.http(
          "post",
          "/lottery/game/open", {
            gameid: vm.form.lotteryKind.value,
            issue_no: vm.form.lotteryNo.value,
            luck_no: vm.form.awardNo
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.closeManual();
              vm.getLotteryList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 302) {
              vm.message(vm.form.lotteryNo.value + "奖期已经开过奖了", "error")
            } else if (code === 301) {
              vm.message("开奖号码格式不正确，必须用英文逗号隔开", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        )
      },
      submitFormS() {
        const vm = this;
        if (!vm.formS.lotteryKind.value) {
          vm.message('请选择彩种', "error");
          return;
        }
        if (!vm.formS.lotteryNo.value) {
          vm.message('请选择彩期', "error");
          return;
        }
        vm.specialLoading = true;
        request.http(
          "post",
          "/lottery/game/abnormal", {
            gameid: vm.formS.lotteryKind.value,
            issue_no: vm.formS.lotteryNo.value,
          },
          success => {
            vm.specialLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.closeSpecial();
              vm.getLotteryList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 302) {
              vm.message(vm.formS.lotteryNo.value + "奖期已经开过奖了", "error")
            } else if (code === 301) {
              vm.message("开奖号码格式不正确，必须用英文逗号隔开", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.specialLoading = false;
            vm.error();
            console.log(error);
          }
        )
      },
      message(text, type) {
        const vm = this
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      openManual() {
        this.dialogVisible = true;
        this.resetForm();
      },
      openSpecial() {
        this.dialogVisibleS = true;
        this.resetFormS();
      },
      closeManual() {
        this.dialogVisible = false;
        this.resetForm();
      },
      closeSpecial() {
        this.dialogVisibleS = false;
        this.resetFormS();
      },
      resetForm() {
        this.form.lotteryKind.value = "";
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
        this.form.awardNo = "";
      },
      resetFormS() {
        this.form.lotteryKind.value = "";
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
      },
      typeFocus() {
        if (this.type.options.length === 0) {
          this.getType();
        }
      },
      //彩票种类
      getType() {
        const vm = this;
        vm.type.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.type.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.type.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.type.loading = false;
          }
        )
      },
      typeChange(value) {
        if (value) {
          let obj = {};
          obj = this.type.options.find((item) => {
            return item._id === value;
          });
          this.lotteryType.options = obj.childLotterys;
          this.lotteryType.value = '';
        } else {
          this.lotteryType.options = [];
          this.lotteryType.value = '';
        }
      },
      formgameTypeFocus() {
        if (this.form.lotteryKind.options.length === 0) {
          this.formgetGameType();
        }
      },
      formgameTypeFocusS() {
        if (this.formS.lotteryKind.options.length === 0) {
          this.formgetGameTypeS();
        }
      },
      //彩票种类
      formgetGameType() {
        const vm = this;
        vm.form.lotteryKind.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.form.lotteryKind.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.form.lotteryKind.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.form.lotteryKind.loading = false;
          }
        )
      },
      //彩票种类
      formgetGameTypeS() {
        const vm = this;
        vm.formS.lotteryKind.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.formS.lotteryKind.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.formS.lotteryKind.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.formS.lotteryKind.loading = false;
          }
        )
      },
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getLotteryList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getLotteryList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
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
        return '--'
      },
      formatTime2(value) {
        if (value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return '--'
      },
      formLotteryTypeChange(value) {
        this.form.lotteryNo.options = [];
        this.form.lotteryNo.value = "";
      },
      formLotteryTypeChangeS(value) {
        this.formS.lotteryNo.options = [];
        this.formS.lotteryNo.value = "";
      },
      formLotteryNoFocus() {
        if (!this.form.lotteryKind.value || !this.dialogTime) {
          return;
        }
        const vm = this;
        vm.form.lotteryNo.loading = true;
        let beginTime = new Date(vm.dialogTime[0]);
        let endTime = new Date(vm.dialogTime[1]);
        request.http(
          'get',
          '/lottery/issue/list', {
            PageNum: 1,
            PageSize: 1000000,
            gameid: vm.form.lotteryKind.value,
            beginOpen: beginTime,
            endOpen: endTime,
          },
          (success) => {
            vm.form.lotteryNo.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.form.lotteryNo.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.form.lotteryNo.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      formLotteryNoFocusS() {
        if (!this.formS.lotteryKind.value || !this.dialogTimeS) {
          return;
        }
        const vm = this;
        vm.formS.lotteryNo.loading = true;
        let beginTime = new Date(vm.dialogTimeS[0]);
        let endTime = new Date(vm.dialogTimeS[1]);
        request.http(
          'get',
          '/lottery/issue/list', {
            PageNum: 1,
            PageSize: 1000000,
            gameid: vm.formS.lotteryKind.value,
            beginOpen: beginTime,
            endOpen: endTime,
          },
          (success) => {
            vm.formS.lotteryNo.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.formS.lotteryNo.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.formS.lotteryNo.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      getLotteryList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/lottery/issue/list', {
            beginOpen: beginTime,
            endOpen: endTime,
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            gameid: vm.lotteryType.value
          },
          (success) => {
            vm.loading = false;
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.logListData = success.data;
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
        this.searchTime = '';
        this.type.value = "";
        this.lotteryType.options = "";
        this.lotteryType.value = "";
      },
      handleSearch() {
        this.getLotteryList();
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
