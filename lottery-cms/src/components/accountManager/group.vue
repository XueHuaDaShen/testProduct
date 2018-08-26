<template>
  <div class="el-custom group-wrap">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model="username" placeholder="姓名" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div> -->
      </div>
    </div>
    <div class="content-middle content-header">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createSet" size="medium" class="edit">新增层级</el-button>
          <el-button type="success" @click="createMoveForm" size="medium" class="edit">层级迁移</el-button>
          <el-button type="success" @click="createLockForm" size="medium" class="edit">锁定用户</el-button>
        </div>
      </div>
    </div>
    <!-- table S -->
    <div class="data-table" v-loading="loading">
      <el-table :data="groupListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="no" label="层级编号">
        </el-table-column>
        <el-table-column align="center" prop="name" label="层级名称">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="创建时间" width="150px">
        </el-table-column>
        <el-table-column align="center" prop="recharge_times" width="110" label="存款次数">
        </el-table-column>
        <el-table-column align="center" prop="recharge_amount" label="存款总额">
        </el-table-column>
        <el-table-column align="center" prop="max_recharge_every_times" label="最大存款额度">
        </el-table-column>
        <el-table-column align="center" prop="withdraw_times" label="提款次数">
        </el-table-column>
        <el-table-column align="center" prop="withdraw_amount" label="提款总额">
        </el-table-column>
        <el-table-column align="center" label="会员人数">
          <template slot-scope="scope">
            <el-button class="small" type='text'>{{scope.row.num}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="message" label="备注">
        </el-table-column>
        <el-table-column align="center" label="出入款项" width="158px">
          <template slot-scope="scope">
            <el-select clearable placeholder="选择" v-model="scope.row.pay_setting_id._id" :loading="setting.loading" :loading-text="setting.loadingtext"
              class="small" @change="getSettingChange(scope.row)">
              <el-option v-for="(item,index) in setting.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="208px">
          <template slot-scope="scope">
            <el-button @click="editSet(scope.row)" class="small edit" v-if="scope.row.default !=1">修改</el-button>
            <el-button @click="deleteSet(scope.row)" class="small no" v-if="scope.row.default !=1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
          :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- dialog 新增 S -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">层级编号</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="ruleForm.no" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">层级名称</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="ruleForm.name" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">存款次数</span>
            <span class="exp-after">:</span>
            <el-input type="number" v-model="ruleForm.recharge_times" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">存款总额</span>
            <span class="exp-after">:</span>
            <el-input type="number" v-model="ruleForm.recharge_amount" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">最大存款额度</span>
            <span class="exp-after">:</span>
            <el-input type="number" v-model="ruleForm.max_recharge_every_times" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">提款次数</span>
            <span class="exp-after">:</span>
            <el-input type="number" v-model="ruleForm.withdraw_times" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">提款总额</span>
            <span class="exp-after">:</span>
            <el-input type="number" v-model="ruleForm.withdraw_amount" clearable></el-input>
          </div>
          <div class="form-row">
            <span class="exp">出入款项</span>
            <span class="exp-after">:</span>
            <el-select clearable placeholder="选择" v-model="ruleForm.pay_setting_id" class="small">
              <el-option v-for="(item,index) in setting.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="form-row">
            <span class="exp">备注</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="ruleForm.message" clearable></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isCreate" type="primary" @click="createSetFn('ruleForm')" class="yes" :loading="createLoading">确 定</el-button>
        <el-button v-if="!isCreate" type="primary" @click="editSetFn('ruleForm')" class="yes" :loading="editLoading">修 改</el-button>
        <el-button @click="resetForm('ruleForm')" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- dialog 层级迁移 S -->
    <el-dialog title="层级迁移" :visible.sync="moveFormVisible" @close="resetForm('moveForm')">
      <div class="body-middle">
        <el-form :model="moveForm" :rules="rules" ref="moveForm">
          <el-form-item>
            <p style="font-size: 12px;color: #777777;text-align:left;">将"来源层级"中，符合条件的会员收纳至"目的层级"</p>
          </el-form-item>
          <el-form-item label="来源层级：" prop="origin_group.value">
            <el-select clearable v-model="moveForm.origin_group.value" placeholder="选择" style="width:300px;" @focus="moveFormFromFocus"
              :loading="moveForm.origin_group.loading" :loading-text="moveForm.origin_group.loadingtext">
              <el-option v-for="(item,index) in moveForm.origin_group.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的层级：" prop="target_group.value">
            <el-select clearable v-model="moveForm.target_group.value" placeholder="选择" style="width:300px;" @focus="moveFormToFocus"
              :loading="moveForm.target_group.loading" :loading-text="moveForm.target_group.loadingtext">
              <el-option v-for="(item,index) in moveForm.target_group.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moveSetFn('moveForm')" class="yes" :loading="moveLoading">确 定</el-button>
        <el-button @click="resetForm('moveForm')" class="no">取 消</el-button>
      </div>
    </el-dialog>
    <!-- dialog 锁定用户 S -->
    <el-dialog title="锁定用户" :visible.sync="lockFormVisible" @close="resetForm('lockForm')">
      <div class="body-top clearfix">
        <div class="top-row">
          <span>用户名：</span>
          <el-input clearable v-model="lockForm.username" style="width:114px;"></el-input>
          <el-button @click="searchLockForm" class="small edit">查询</el-button>
        </div>
      </div>
      <div class="body-middle" v-show="lockForm.hasLoginname">
        <el-form :model="lockForm" :rules="rules" ref="lockForm">
          <el-form-item label="当前层级：">
            <span style="float:left">{{currentGroupName}}</span>
          </el-form-item>
          <el-form-item label="已锁定：">
            <span style="float:left">{{groupLockedName}}</span>
          </el-form-item>
          <el-form-item label="锁定至：" prop="group.value">
            <el-select clearable v-model="lockForm.group.value" placeholder="选择" style="width:300px;" @focus="lockFormGroupFocus" :loading="lockForm.group.loading"
              :loading-text="lockForm.group.loadingtext">
              <el-option v-for="(item,index) in lockForm.group.options" :key="index" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:10px;" v-show="lockForm.hasLoginname">
        <el-button type="primary" @click="lockSetFn('lockForm')" class="yes" :loading="lockLoading">确 定</el-button>
        <el-button @click="resetForm('lockForm')" class="no">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import {
    trim
  } from "../../lib/utils/validator";
  import moment from "moment";
  export default {
    name: "withdrawSet",
    mounted() {
      // this.getConfig();
      this.getDataList();
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        createLoading: false,
        editLoading: false,
        moveLoading: false,
        lockLoading: false,
        titleName: "层级设置",
        routerArr: [{
            title: "用户列表",
            name: "userList",
            checked: false
          },
          {
            title: "层级设置",
            name: "group",
            checked: true
          }
        ],
        currentGroupName: "", // 当前层级
        groupLockedName: "", // 锁定与否
        username: "",
        loading: false,
        groupListData: [],
        paySetList: [],
        pageNum: 1,
        pageSize: 10,
        total: 10,
        dialogFormVisible: false,
        dialogFormTitle: "新增层级",
        isCreate: false,
        editId: "",
        // 出入款项
        setting: {
          options: [],
          value: "",
          loading: false,
          loadingText: "正在加载...",
          nothing: ""
        },
        ruleForm: {
          id: "",
          no: "",
          // max_cash_daily: '',
          name: "",
          recharge_times: "",
          recharge_amount: "",
          max_recharge_every_times: "",
          withdraw_times: "",
          withdraw_amount: "",
          pay_setting_id: ""
          // create_at: ''
        },
        moveFormVisible: false,
        moveForm: {
          origin_group: {
            value: "",
            options: [],
            loading: false,
            loadingText: "正在加载..."
          },
          target_group: {
            value: "",
            options: [],
            loading: false,
            loadingText: "正在加载..."
          }
        },
        lockFormVisible: false,
        lockForm: {
          username: "",
          group: {
            options: [],
            value: "",
            loading: false,
            loadingText: "正在加载..."
          },
          hasLoginname: false
        },
        rules: {
          // max_cash_daily: [{
          //   required: true,
          //   message: '每天最多提款金额',
          //   trigger: 'blur'
          // }],
          name: [{
            required: true,
            message: "等级名称",
            trigger: "blur"
          }],
          recharge_times: [{
            required: true,
            message: "存款次数",
            trigger: "blur"
          }],
          recharge_amount: [{
            required: true,
            message: "存款总额",
            trigger: "blur"
          }],
          max_recharge_every_times: [{
            required: true,
            message: "最大存款额度",
            trigger: "blur"
          }],
          withdraw_times: [{
            required: true,
            message: "提款次数",
            trigger: "blur"
          }],
          withdraw_amount: [{
            required: true,
            message: "提款总额",
            trigger: "blur"
          }],
          "origin_group.value": [{
            required: true,
            message: "请选择来源层级",
            trigger: "blur"
          }],
          "target_group.value": [{
            required: true,
            message: "请选择目的层级",
            trigger: "blur"
          }],
          "group.value": [{
            required: true,
            message: "请选择锁定层级",
            trigger: "blur"
          }],
          no: [{
            required: true,
            message: "请输入层级编号",
            trigger: "blur"
          }]
          // pay_setting_id: [{
          //   required: true,
          //   message: '请选择支付方式',
          //   trigger: 'change'
          // }]
          // create_at: [{
          //   required: true,
          //   message: '创建时间',
          //   trigger: 'blur'
          // }]
        },
        duration: 1000
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
        if (v.url === 'withdrawSet') {
          this.titleName = v.menu_name;
        }
        o.title = v.menu_name;
        o.name = v.url;
        o.checked = false;
        this.routerArr.push(o);
      })
      this.routerArr.filter(v => {
        if (this.titleName === v.title) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      });
      this.getCreateFormSettingFocus();
    },
    methods: {
      getSettingChange(row) {
        const vm = this;
        let o = new Object();
        for (let i in row) {
          if (i === "pay_setting_id") {
            if (row.pay_setting_id._id) {
              o.pay_setting_id = row.pay_setting_id._id;
            } else {
              return;
            }
          } else if (i === "_id") {
            o.id = row._id;
          } else {
            continue;
          }
        }
        request.http(
          "post",
          "/group/update",
          o,
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        );
      },
      // 查询锁定层级的用户存在否
      searchLockForm() {
        if (!this.lockForm.username) {
          this.$message({
            message: "请输入用户名",
            type: "error",
            center: true
          });
          return;
        }
        this.getUserList(this.lockForm.username);
      },
      getCreateFormSettingFocus() {
        let vm = this;
        if (vm.setting.options.length > 0) {
          return;
        }
        vm.setting.loading = true;
        let url = "/pay/setting/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.setting.loading = false;
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
                  let options2 = vm.setting.options;
                  vm.setting.options = options2.concat(options);
                }
              } else {
                vm.setting.loading = false;
              }
            }
          },
          error => {
            vm.setting.loading = false;
          }
        );
      },
      moveFormFromFocus(event) {
        let vm = this;
        if (vm.moveForm.origin_group.options.length != 0) {
          return;
        }
        vm.moveForm.origin_group.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.moveForm.origin_group.loading = false;
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
                  vm.moveForm.origin_group.options = options;
                }
              } else {
                vm.moveForm.origin_group.loading = false;
              }
            }
          },
          error => {
            vm.moveForm.origin_group.loading = false;
          }
        );
      },
      moveFormToFocus(event) {
        let vm = this;
        if (vm.moveForm.target_group.options.length != 0) {
          return;
        }
        vm.moveForm.target_group.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.moveForm.target_group.loading = false;
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
                  vm.moveForm.target_group.options = options;
                }
              } else {
                vm.moveForm.target_group.loading = false;
              }
            }
          },
          error => {
            vm.moveForm.target_group.loading = false;
          }
        );
      },
      lockFormGroupFocus(event) {
        let vm = this;
        if (vm.lockForm.group.options.length != 0) {
          return;
        }
        vm.lockForm.group.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.lockForm.group.loading = false;
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
                  vm.lockForm.group.options = options;
                }
              } else {
                vm.lockForm.group.loading = false;
              }
            }
          },
          error => {
            vm.lockForm.group.loading = false;
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
        });
        // console.log(name)
      },
      handleReset() {
        this.username = "";
      },
      handleSearch() {
        this.pageNum = 1;
        this.getDataList();
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
      error() {
        const vm = this;
        this.$message({
          message: "加载失败",
          type: "error",
          duration: vm.duration,
          center: true
        });
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      editSet(item) {
        const vm = this;
        // this.getPaySetList();
        this.dialogFormVisible = true;
        this.dialogFormTitle = "编辑层级";
        this.isCreate = false;
        for (let i in vm.ruleForm) {
          if (i == "pay_setting_id") {
            vm.ruleForm[i] = item[i]._id;
            continue;
          }
          vm.ruleForm[i] = item[i];
        }
        vm.editId = item._id;
      },
      editSetFn(formName) {
        const vm = this;
        let data = {
          id: vm.editId
        };
        if (vm[formName].no === "") {
          vm.message("请输入层级编号", "error");
          return;
        }
        if (vm[formName].name === "") {
          vm.message("请输入层级名称", "error");
          return;
        }
        if (vm[formName].recharge_times === "") {
          vm.message("请输入存款次数", "error");
          return;
        }
        if (vm[formName].recharge_amount === "") {
          vm.message("请输入存款总额", "error");
          return;
        }
        if (vm[formName].max_recharge_every_times === "") {
          vm.message("请输入最大存款额度", "error");
          return;
        }
        if (vm[formName].withdraw_times === "") {
          vm.message("请输入提款次数", "error");
          return;
        }
        if (vm[formName].withdraw_amount === "") {
          vm.message("请输入提款总额", "error");
          return;
        }
        if (vm[formName].pay_setting_id === "") {
          vm.message("请选择出入款项", "error");
          return;
        }
        if (vm[formName].message === "") {
          vm.message("请输入备注", "error");
          return;
        }
        for (let i in vm.ruleForm) {
          if (i !== "id") {
            data[i] = vm.ruleForm[i];
          }
        }
        vm.editLoading = true;
        request.http(
          "post",
          "/group/update",
          data,
          success => {
            vm.editLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.dialogFormVisible = false;
              vm.resetForm("ruleForm");
              vm.getDataList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.editLoading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        });
      },
      createSet() {
        this.resetForm("ruleForm");
        this.dialogFormVisible = true;
        this.dialogFormTitle = "新增层级";
        this.getPaySetList();
        this.isCreate = true;
      },
      createMoveForm() {
        this.moveForm.origin_group.value = "";
        this.moveForm.target_group.value = "";
        this.moveFormVisible = true;
      },
      createLockForm() {
        this.lockForm.hasLoginname = false;
        this.lockForm.group.value = "";
        this.lockFormVisible = true;
      },
      createSetFn(formName) {
        const vm = this;
        let data = {};
        if (vm[formName].no === "") {
          vm.message("请输入层级编号", "error");
          return;
        }
        if (vm[formName].name === "") {
          vm.message("请输入层级名称", "error");
          return;
        }
        if (vm[formName].recharge_times === "") {
          vm.message("请输入存款次数", "error");
          return;
        }
        if (vm[formName].recharge_amount === "") {
          vm.message("请输入存款总额", "error");
          return;
        }
        if (vm[formName].max_recharge_every_times === "") {
          vm.message("请输入最大存款额度", "error");
          return;
        }
        if (vm[formName].withdraw_times === "") {
          vm.message("请输入提款次数", "error");
          return;
        }
        if (vm[formName].withdraw_amount === "") {
          vm.message("请输入提款总额", "error");
          return;
        }
        if (vm[formName].pay_setting_id === "") {
          vm.message("请选择出入款项", "error");
          return;
        }
        if (vm[formName].message === "") {
          vm.message("请输入备注", "error");
          return;
        }
        for (let i in vm.ruleForm) {
          if (i !== "id") {
            data[i] = vm.ruleForm[i];
          }
        }
        vm.createLoading = true;
        request.http(
          "post",
          "/group/create",
          data,
          success => {
            vm.createLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.dialogFormVisible = false;
              vm.resetForm("ruleForm");
              vm.getDataList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.createLoading = false;
            vm.error();
            console.log(error);
          }
        );
      },
      moveSetFn(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          let data = {};
          for (let i in vm.moveForm) {
            data[i] = vm.moveForm[i].value;
          }
          if (valid) {
            vm.moveLoading = true;
            request.http(
              "post",
              "/group/change",
              data,
              success => {
                vm.moveLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.getDataList();
                  vm.resetForm("moveForm");
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.moveLoading = false;
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
      lockSetFn(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          let data = {};
          for (let i in vm.lockForm) {
            if (i === "group") {
              data[i] = vm.lockForm[i].value;
              continue;
            }
            if (i === "hasLoginname") {
              continue;
            }
            data[i] = vm.lockForm[i];
          }
          if (valid) {
            vm.lockLoading = true;
            request.http(
              "post",
              "/group/lock",
              data,
              success => {
                vm.lockLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.getDataList();
                  vm.resetForm("lockForm");
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.lockLoading = false;
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
      deleteSet(row) {
        const vm = this;
        this.$alert("确定继续该操作吗", "温馨提示", {
          showCancelButton: true,
          center: true,
          confirmButtonText: "确定",
          callback: action => {
            if (action === "confirm") {
              request.http(
                "post",
                "/group/delete", {
                  id: row._id
                },
                success => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getDataList();
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm);
                  } else {
                    alert(success.returncode);
                  }
                },
                error => {
                  vm.error();
                  console.log(error);
                }
              );
            }
          }
        });
      },
      resetForm(formName) {
        if (formName == "ruleForm") {
          this[formName].no = "";
          this[formName].name = "";
          this[formName].recharge_times = "";
          this[formName].recharge_amount = "";
          this[formName].max_recharge_every_times = "";
          this[formName].withdraw_times = "";
          this[formName].withdraw_amount = "";
          this[formName].pay_setting_id = "";
        } else if (formName == "moveForm") {} else if (formName == "lockForm") {}
        // this.dialogFormVisible = false;
        // this.moveFormVisible = false;
        // this.lockFormVisible = false;
        // this.lockForm.hasLoginname = false;
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getDataList();
        // console.log(`当前页: ${val}`);
      },
      getUserList(username) {
        const vm = this;
        request.http(
          "get",
          "/user/list", {
            loginname: username
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              if (success.count != 0) {
                vm.lockForm.hasLoginname = true;
                let currentGroupName = success.data[0].groupid && success.data[0].groupid.name;
                if (currentGroupName) {
                  vm.currentGroupName = currentGroupName;
                } else {
                  vm.currentGroupName = "未分层";
                }
                let group_locked = success.data[0].group_locked;
                if (group_locked) {
                  vm.groupLockedName = "锁定";
                } else {
                  vm.groupLockedName = "未锁定";
                }
              }
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
              vm.lockForm.hasLoginname = false;
            }
          },
          error => {
            vm.lockForm.hasLoginname = false;
            vm.error();
          }
        );
      },
      getDataList() {
        const vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/group/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            name: trim(vm.username)
          },
          success => {
            vm.loading = false;
            // console.log("withdrawLotList--------", success);
            let code = success.returncode;
            if (code === 200) {
              vm.groupListData = [];
              let data = success.data;
              for (let i in data) {
                let obj = data[i];
                if (!obj.hasOwnProperty("pay_setting_id")) {
                  obj["pay_setting_id"] = {
                    _id: "",
                    name: "未配置"
                  };
                }
                vm.groupListData.push(obj);
              }
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.success();
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
      getPaySetList() {
        const vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/pay/setting/list", {
            PageNum: vm.pageNum,
            PageSize: 999
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.paySetList = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(code);
            }
          },
          error => {
            vm.loading = false;
            vm.error();
            console.log(error);
          }
        );
      }
    },
    watch: {
      "lockForm.username" () {
        if (!this.lockForm.username) {
          this.lockForm.hasLoginname = false;
        }
      }
    }
  };

</script>
<style lang="scss">
  /* @import '../../publicCss/header.css'; */

  .group-wrap {
    .plr-30 {
      padding: 0 30px;
    }
  }

</style>
