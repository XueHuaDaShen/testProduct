<template>
  <div class="userList el-custom">
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
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>层级：</label>
            <el-select clearable v-model="group.value" placeholder="请选择状态" class="small" @focus="groupFocus()" :loading="group.loading"
              :loading-text="group.loadingText">
              <el-option v-for="item in group.options" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>上层代理：</label>
            <el-input clearable v-model="superLoginname" placeholder="上层代理" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试账号" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
          <el-button @click="createUsercount" size="medium" class="edit">新增总代</el-button>
        </div>
      </div>
    </div>
    <!-- table START -->
    <div class="data-table" v-loading="loading">
      <el-table :data="userListData" align="center" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上级代理" prop="superiorid.loginname" width="94px">
        </el-table-column>
        <el-table-column align="center" label="级别" prop="level">
        </el-table-column>
        <el-table-column align="center" label="层级" prop="groupid.name">
        </el-table-column>
        <el-table-column align="center" label="主钱包">
          <template slot-scope="scope">
            {{scope.row.cash?Number(scope.row.cash).toFixed(2) : 0}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="锁定资金">
          <template slot-scope="scope">
            {{scope.row.cash_locked?Number(scope.row.cash_locked).toFixed(2) : 0}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="下级数量">
          <template slot-scope="scope">
            {{scope.row.inferior_num?scope.row.inferior_num : 0}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="奖金组">
          <template slot-scope="scope">
            {{scope.row.refund?scope.row.refund : 0}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="is_online" width="80" :formatter="isOnlineFn" label="是否在线">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="注册时间" width="130px">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="284px">
          <template slot-scope="scope">
            <el-row class="tr">
              <el-button size="mini" @click="openMsg(scope.row)" class="small edit">发信息</el-button>
              <el-button size="mini" @click="enableChange(scope.row,0)" class="small yes" v-if="scope.row.status == 1">启用</el-button>
              <el-button size="mini" @click="enableChange(scope.row,1)" class="small yes" v-if="scope.row.status == 0">禁用</el-button>
              <el-button size="mini" @click="tixiaxian(scope.row)" class="small no">登出</el-button>
            </el-row>
            <el-row class="tr">
              <a @click="handleSkip('accountChange',scope.row.loginname)">
                <el-button size="mini" class="small edit mt-10">
                  帐变
                </el-button>
              </a>
              <a @click="handleSkip('userLog',scope.row.loginname)" class="ml-15">
                <el-button size="mini" class="small edit mt-10">
                  日志
                </el-button>
              </a>
              <a @click="handleSkip('userColligate',scope.row.loginname)" class="ml-15">
                <el-button size="mini" class="small edit mt-10">
                  盈亏
                </el-button>
              </a>
            </el-row>
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
    <!-- 新增总代 START -->
    <el-dialog title="新增总代" :before-close="closeCreate" :visible.sync="createDialog">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">账号</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="createForm.loginname"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="createForm.password"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">确认密码</span>
            <span class="exp-after">:</span>
            <el-input type="password" v-model="createForm.psd_sure"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">测试账号</span>
            <span class="exp-after">:</span>
            <el-select v-model="createForm.is_test" placeholder="请选择" class="small" style="float:left">
              <el-option label="是" value="1">
              </el-option>
              <el-option label="否" value="0">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">奖金组</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="createForm.refund"></el-input>
          </div>
          <div class="form-row">
            <span class="exp"></span>
            <span class="exp-after"></span>
            <p style="font-size: 12px;color: #777777;text-align:left;">奖金组介于1800-2000之间</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('createForm')" class="yes" :loading="addzdLoading">确 定</el-button>
        <el-button @click="closeCreate" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增总代 END -->
    <!-- 站内信 START -->
    <el-dialog title="站内信" :before-close="closeMsg" :visible.sync="msgVisible" class="relative-dialog">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">标题</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="msgForm.topic"></el-input>
          </div>
          <div class="form-row file-inner">
            <span class="exp">内容文字</span>
            <span class="exp-after">:</span>
            <div ref="editor" style="text-align:left" class="flex-all">
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="send" class="yes" :loading="msgLoading">确 定</el-button>
        <el-button @click="closeMsg" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 站内信 END -->
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment';
  import * as validator from '../../lib/utils/validator';
  import E from 'wangeditor';

  export default {
    name: 'userList',
    title: '用户列表',
    components: {
      tableBtn,
      DialogUserInfo,
      E
    },
    data() {
      var validatorPsd = (rule, value, callback) => {
        if (!validator.regexpPsd(value)) {
          return callback(new Error('请输入6-16位数字和字母组合'));
        } else {
          callback();
        }
      };
      return {
        index1: 0,
        index2: 0,
        addzdLoading: false,
        msgLoading: false,
        msgVisible: false,
        msgForm: {
          loginid: "",
          topic: "",
          content: "测试"
        },
        editor: null,
        createDialog: false,
        titleName: '用户列表',
        routerArr: [{
            title: '用户列表',
            name: 'userList',
            checked: true
          },
          {
            title: '层级设置',
            name: 'group',
            checked: false
          },
        ],
        superLoginname: "",
        loading: false,
        userid: '',
        loginname: '',
        username: '',
        isForbid: 0,
        onLine: 0,
        minBlance: '',
        maxBlance: '',
        userListData: [],
        pageNum: 1,
        pageSize: 10,
        total: 10,
        group: {
          value: "",
          options: [],
          loading: false,
          loadingText: "正在加载..."
        },
        statusArr: [{
          value: "",
          label: '全部'
        }, {
          value: 0,
          label: '启用'
        }, {
          value: 1,
          label: '停用'
        }],
        status: '',
        testUser: [{
            value: "",
            label: "全部"
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
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        createForm: {
          loginname: "",
          password: "",
          psd_sure: "",
          is_test: "",
          refund: "",
        },
        rules: {
          loginname: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatorPsd
          }],
          psd_sure: [{
            required: true,
            trigger: 'blur',
            validator: validatorPsd
          }],
          refund: [{
            required: true,
            message: "请输入奖金组",
            trigger: "blur"
          }],
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
        if (v.url === 'userList') {
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
      if (query.param) {
        this.username = query.param;
      }
      this.getUserList();
    },
    methods: {
      send() {
        const vm = this;
        if (!this.msgForm.topic) {
          this.$message({
            message: '请输入消息标题',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        if (!this.msgForm.content) {
          this.$message({
            message: '请输入内容文字',
            type: 'error',
            duration: vm.duration,
            center: true
          })
          return;
        }
        vm.msgLoading = true;
        request.http(
          'post',
          '/user/sendmessage', {
            loginid: vm.msgForm.loginid,
            topic: vm.msgForm.topic,
            content: vm.msgForm.content,
          },
          (success) => {
            vm.msgLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.msgVisible = false;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.msgLoading = false;
            vm.error();
          }
        )
      },
      closeMsg() {
        this.msgVisible = false;
      },
      openMsg(row) {
        this.msgVisible = true;
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.createEditor();
          this.resetMsg();
          this.msgForm.loginid = row._id;
        })
      },
      // 重置msg form
      resetMsg() {
        this.msgForm.topic = "";
        this.msgForm.loginid = "";
        this.msgForm.content = "";
        this.editor.txt.clear();
      },
      createEditor() {
        if (this.editor) {
          return;
        }
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
          this.msgForm.content = html
        }
        this.editor.create()
        // console.log(this.msgForm.content)
      },
      enableChange(row, status) {
        const vm = this;
        request.http(
          'post',
          '/user/forbid', {
            id: row._id,
            status: status
          },
          (success) => {
            // console.log('tixiaxian--------',success);
            let code = success.returncode;
            if (code === 200) {
              vm.success();
              vm.getUserList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        );
      },
      submitForm(formName) {
        const vm = this;
        if (!vm.createForm.loginname) {
          vm.message("请输入用户名", "error")
          return;
        }
        if (!validator.regexpInput(vm.createForm.loginname)) {
          vm.message("账号名要求3-20位字母或数字", "error")
          return;
        }
        if (!vm.createForm.password) {
          vm.message("请输入密码", "error")
          return;
        }
        if (!validator.regexpPsd(vm.createForm.password)) {
          vm.message("密码要求包含字母和数字的6-16位组合", "error")
          return;
        }
        if (!vm.createForm.psd_sure) {
          vm.message("请输入确认密码", "error")
          return;
        }
        if (!validator.regexpPsd(vm.createForm.psd_sure)) {
          vm.message("确认密码要求包含字母和数字的6-16位组合", "error")
          return;
        }
        if (vm.createForm.password != vm.createForm.psd_sure) {
          vm.message("两次密码必须保持一致", "error")
          return;
        }
        if (!vm.createForm.refund) {
          vm.message("请输入奖金组", "error")
          return;
        }
        if (!validator.positiveInt(vm.createForm.refund)) {
          vm.message("奖金组必须是整数", "error")
          return;
        }
        if (Number(vm.createForm.refund) < 1800 || Number(vm.createForm.refund) > 2000) {
          vm.message("奖金组超出范围", "error")
          return;
        }
        let data = {
          type: "1"
        };
        for (let v in vm.createForm) {
          let obj = vm.createForm[v];
          if (v == "password") {
            data[v] = CryptoJS.MD5(obj).toString();
            continue;
          }
          if (v == "psd_sure") {
            continue;
          }
          data[v] = obj;
        }
        vm.addzdLoading = true;
        request.http(
          "post",
          "/agency/user/create",
          data,
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.addzdLoading = false;
              let code = success.returncode;
              vm.$alert('新增总代成功,用户名:' + success.newuser.loginname, '温馨提示', {
                confirmButtonText: '确定',
                callback: action => {
                  vm.closeCreate();
                }
              })
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else if (code == 305) {
              vm.message("用户名已存在", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.addzdLoading = false;
            vm.resetForm('createForm');
            vm.error();
          }
        )
      },
      resetForm(formName) {
        this[formName].loginname = "";
        this[formName].password = "";
        this[formName].psd_sure = "";
        this[formName].is_test = "";
        this[formName].refund = "";
      },
      closeCreate() {
        this.createDialog = false
        this.resetForm("createForm")
      },
      // 跳转页面
      skip(param, routeName) {
        this.$router.push({
          name: routeName,
          query: {
            param: param
          }
        });
      },
      handleSkip(name, param) {
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
            param: param,
            index1: index1,
            index2: index2
          }
        })
        console.log('href', href);
        window.open(href, '_blank')
      },
      createUsercount() {
        this.createDialog = true;
        this.resetForm("createForm");
      },
      // 层级
      groupFocus(event) {
        let vm = this;
        if (vm.group.options.length != 0) {
          return;
        }
        vm.group.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.group.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(vm);
              } else if (success.returncode == 200) {
                let options = success.data;
                if (options.length != 0) {
                  /* for (let i = 0; i < options.length; i++) {
                    let typeArr = new Array();
                    let option = options[i];
                    typeArr.push(option.type);
                    option.type = typeArr;
                  } */
                  vm.group.options = options;
                }
              } else {
                vm.group.loading = false;
              }
            }
          },
          error => {
            vm.group.loading = false;
          }
        );
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
      //message
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '启用';
          case 1:
            return '停用';
        }
      },
      isOnlineFn(row, column, cellValue) {
        // console.log(row)
        switch (cellValue) {
          case 0:
            return '离线';
          case 1:
            return '在线';
        }
      },
      isForbidFn(row, column, cellValue) {
        // console.log(row)
        switch (cellValue) {
          case 0:
            return '启用';
          case 1:
            return '禁用';
        }
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
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
      handleCommand(command) {
        var row = command[0];
        var txt = command[1];
        if (txt == '关闭') {
          this.closeLivehouse(row);
        } else if (txt == '开始') {
          this.startLivehouse(row);
        } else if (txt == '禁用') {
          this.disabledLivehouse(row);
        } else if (txt == '启用') {
          this.enableLivehouse(row);
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getUserList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row._id;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      // 登出
      tixiaxian(row) {
        let id = row._id;
        const vm = this;
        request.http(
          'post',
          '/user/kickoff', {
            id: id,
          },
          (success) => {
            // console.log('tixiaxian--------',success);
            let code = success.returncode;
            if (code === 200) {
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      // 禁用
      limit(row) {
        let id = row._id;
        const vm = this;
        request.http(
          'post',
          '/user/kickoff', {
            id: id,
          },
          (success) => {
            // console.log('tixiaxian--------',success);
            let code = success.returncode;
            if (code === 200) {

            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      getUserList() {
        this.loading = true;
        const vm = this;
        request.http(
          'get',
          '/user/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            // miniCash: vm.minBlance,
            // maxCash: vm.maxBlance,
            groupid: vm.group.value,
            loginname: vm.username,
            superior_loginname: vm.superLoginname,
            // is_forbid: vm.isForbid,
            // is_online: vm.onLine,
            status: vm.status,
            is_test: vm.is_test
          },
          (success) => {
            vm.loading = false;
            // console.log('userList--------',success);
            let code = success.returncode;
            if (code === 200) {
              vm.userListData = success.data;
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
        this.status = '';
        this.group.value = "";
        this.superLoginname = "";
        this.is_test = '0';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getUserList();
      },
    }
  }

</script>
<style scoped>
  /* @import '../../publicCss/header.css'; */

  .mt-10 {
    margin-top: 10px;
  }

  .tr {
    text-align: right;
  }

  .ml-15 {
    margin-left: 15px;
  }

</style>
