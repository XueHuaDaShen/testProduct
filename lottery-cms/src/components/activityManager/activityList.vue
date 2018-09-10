<template>
  <div class="el-custom activityList">
    <div class="content-header">
      <div class="title" style="position:relative;">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>展现状态：</label>
            <el-select clearable v-model="enabled.value" placeholder="展现状态" class="small">
              <el-option v-for="item in enabled.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>活动状态：</label>
            <el-select clearable v-model="activityStatus.value" placeholder="活动状态" class="small">
              <el-option v-for="item in activityStatus.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" class="small yes">搜索</el-button>
            <el-button @click="handleReset" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="openDialog()" size="medium" class="edit">添加活动</el-button>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="activityLogListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        @cell-mouse-enter="mouseOver" max-height="450">
        <el-table-column align="center" prop="order" label="排序值">
        </el-table-column>
        <el-table-column align="center" prop="title" label="活动名称">
        </el-table-column>
        <el-table-column align="center" label="活动图">
          <template slot-scope="scope">
            <img style="width:50px;" :src="scope.row.activity_photo" :formatter="formatImg">
          </template>
        </el-table-column>
        <el-table-column align="center" label="展现状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="enableChange(scope.row.enabled)" :active-value="1"
              :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动状态" prop="open" :formatter="formatOpen">
        </el-table-column>
        <el-table-column align="center" label="活动时间">
          <template slot-scope="scope">
            <span>{{formatTime2(scope.row.start_at,scope.row.stop_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="添加时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="editForm(scope.row)" class="small edit">修改</el-button>
            <!-- <el-button @click="deleteActivity(scope.row)" class="small yes">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <editor v-if="showEditor" @closeEditor="handlecloseEditor" :activityParam="activityParam"></editor>
    </div>
    <!-- dialog start-->
    <el-dialog :title="formTitle" :before-close="closeForm" :visible.sync="formVisible" class="relative-dialog">
      <div class="body-top clearfix">
        <div class="top-row">
          <el-checkbox :indeterminate="form.group.isIndeterminate" v-model="form.group.checkAll" @change="handleFormCheckAllChange">
            <span class="f16">
              会员等级
            </span>
          </el-checkbox>
        </div>
        <div class="top-row">
          <el-checkbox-group v-model="form.group.checked" @change="handleFormCheckedChange">
            <el-checkbox v-for="(option,index) in form.group.options" :label="option._id" :key="index">{{option.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="body-middle">
        <div class="form">
          <div class="form-row">
            <span class="exp">活动名称</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="form.title"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">排序值</span>
            <span class="exp-after">:</span>
            <el-input type="text" v-model="form.order"></el-input>
          </div>
          <div class="form-row">
            <span class="exp">活动时间</span>
            <span class="exp-after">:</span>
            <el-date-picker v-model="form.time" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions" :disabled="timeDisabled"
              style="margin-right:10px;">
            </el-date-picker>
            <el-checkbox v-model="forever">永久</el-checkbox>
          </div>
          <div class="form-row file-inner">
            <span class="exp">活动图片</span>
            <span class="exp-after">:</span>
            <el-upload class="upload-demo" :action="form.activity_photo.action" :on-change="handleAcPhotoChange"
              :file-list="form.activity_photo.filterList" :list-type="form.activity_photo.listStyle" :limit="form.activity_photo.limit"
              :auto-upload="false" :on-remove="handleRemoveAc">
              <el-button size="small" class="small edit" style="text-align:left">上传</el-button>
            </el-upload>
            <span class="tip-after">请上传100x100的图片尺寸，格式为png/jpeg/jpg</span>
          </div>
          <div class="form-row file-inner">
            <span class="exp">内容图片</span>
            <span class="exp-after">:</span>
            <el-upload class="upload-demo" :action="form.content_photo.action" :on-change="handleCoPhotoChange"
              :file-list="form.content_photo.filterList" :list-type="form.content_photo.listStyle" :limit="form.content_photo.limit"
              :auto-upload="false" :on-remove="handleRemoveCo">
              <el-button size="small" class="small edit">上传</el-button>
            </el-upload>
            <span class="tip-after">请上传100x100的图片尺寸，格式为png/jpeg/jpg</span>
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
        <div v-show="formCreate">
          <el-button type="primary" @click="createActivity()" class="yes" :loading="dialogLoading">确 定</el-button>
          <el-button @click="closeForm()" class="no">取 消</el-button>
        </div>
        <div v-show="!formCreate">
          <el-button type="primary" @click="editActivity()" class="yes" :loading="dialogLoading">确 定</el-button>
          <el-button @click="closeForm()" class="no">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- dialog end -->
  </div>
</template>
<script>
  import request from "../../axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn";
  import moment from "moment";
  import E from "wangeditor";
  export default {
    name: "activityList",
    components: {
      tableBtn,
      DialogUserInfo,
      E
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        formTitle: "新增活动",
        formCreate: true,
        titleName: "活动列表",
        routerArr: [{
          title: "活动列表",
          name: "activityList",
          checked: false
        }],
        dialogLoading: false,
        loading: false,
        showEditor: false,
        activityParam: {
          title: "", // 活动标题
          content: "", // 互动内容
          type: "1", // 活动类型
          func: null // 活动函数
        },
        pageNum: 1,
        pageSize: 40,
        enabled: {
          value: "",
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "已上架",
              value: 1
            },
            {
              label: "未上架",
              value: 0
            }
          ]
        },
        activityStatus: {
          value: "",
          options: [{
              label: "全部",
              value: ""
            },
            {
              label: "未开始",
              value: 2
            },
            {
              label: "进行中",
              value: 1
            },
            {
              label: "已结束",
              value: 3
            }
          ]
        },
        total: 0,
        activityLogListData: [],
        pickerOptions: {
          shortcuts: [{
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        ip: "",
        keywords: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        // 用于 新增和编辑的form
        form: {
          title: "",
          order: "",
          time: "",
          content: "测试",
          // func: null, // 活动函数
          group: {
            checkAll: false,
            checked: [],
            options: [],
            isIndeterminate: true
          },
          activity_photo: {
            action: "",
            filterList: [],
            limit: 1,
            listStyle: "picture",
            file: {},
            url: "",
            isFile: false,
          },
          content_photo: {
            action: "",
            filterList: [],
            limit: 1,
            listStyle: "picture",
            file: {},
            url: "",
            isFile: false,
          }
        },
        forever: false,
        timeDisabled: false,
        start_at: "",
        stop_at: "",
        editor: null,
        formVisible: false,
        rowKey: ""
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
        if (v.url === 'activityList') {
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
      this.getActivityLogList();
    },
    mounted() {
      this.getGroupList();
    },
    watch: {
      forever() {
        if (this.forever) {
          this.timeDisabled = true;
          // this.rules.time = [{
          //   required: false,
          //   message: '请选择活动时间',
          //   trigger: 'blur',
          // }]
          let end = new Date();
          end.setFullYear(end.getFullYear() + 100);
          this.stop_at = end.toString();
          this.start_at = new Date().toString();
        } else {
          this.timeDisabled = false;
          // this.rules.time = [{
          //   required: true,
          //   message: '请选择活动时间',
          //   trigger: 'blur',
          // }]
        }
      }
    },
    methods: {
      formatOpen(row, column, cellValue) {
        if (cellValue) {
          switch (cellValue) {
            case 1:
              return "进行中";
            case 2:
              return "未开始";
            case 3:
              return "已结束";
          }
        }
        return "--";
      },
      createEditor() {
        if (this.editor) {
          return;
        }
        this.editor = new E(this.$refs.editor);
        this.editor.customConfig.onchange = html => {
          this.form.content = html;
        };
        this.editor.create();
      },
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        this.modifiedEnabled("enabled", value.toString(), this.rowKey);
      },
      //是否开启
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/activity/update";
        data["id"] = id;
        data[key] = value;
        request.http(
          "post",
          url,
          data,
          success => {
            self.loading = false;
            let code = success.returncode;
            if (code === 200) {
              self.message("修改成功", "success");
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(self);
            }
          },
          error => {
            self.loading = false;
            self.message("修改失败", "error");
          }
        );
      },
      formatImg(row, column, cellValue) {
        let buffer = new ArrayBuffer();
        buffer = cellValue;
        let blob = new Blob([buffer]);
        var reader = new FileReader();
        reader.readAsText(blob, "utf-8");
        reader.onload = function (e) {
          console.info(reader.result);
          return reader.result;
        };
      },
      openDialog() {
        this.formTitle = "新增活动";
        this.formCreate = true;
        this.formVisible = true;
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.createEditor();
          this.resetForm();
        });
      },
      resetForm() {
        this.form.group.checked = [];
        this.form.group.checkAll = false;
        this.form.title = "";
        this.form.order = "";
        this.form.time = "";
        this.form.content = "";
        this.editor.txt.clear();
        this.form.activity_photo.file = {};
        this.form.activity_photo.filterList = [];
        this.form.activity_photo.url = "";
        this.form.content_photo.file = {};
        this.form.content_photo.filterList = [];
        this.form.content_photo.url = "";
        this.form.activity_photo.isFile = false;
        this.form.content_photo.isFile = false;
        this.forever = false;
      },
      handleAcPhotoChange(file, fileList) {
        const vm = this;
        this.form.activity_photo.file = fileList[0];
        // var r = new FileReader(); //本地预览
        // r.onload = function() {
        //   vm.form.activity_photo.url = r.result;
        // };
        // r.readAsDataURL(file.raw);
        // if (fileList.length > 1) {
        // }
      },
      handleRemoveAc(file, fileList) {
        if (fileList.length == 0) {
          this.form.activity_photo.file = {};
          this.form.activity_photo.url = "";
          this.form.activity_photo.isFile = true;
        }
      },
      handleRemoveCo(file, fileList) {
        if (fileList.length == 0) {
          this.form.content_photo.file = {};
          this.form.content_photo.url = "";
          this.form.content_photo.isFile = true;
        }
      },
      handleCoPhotoChange(file, fileList) {
        const vm = this;
        this.form.content_photo.file = fileList[0];
        // var r = new FileReader(); //本地预览
        // r.onload = function() {
        //   vm.form.content_photo.url = r.result;
        // };
        // r.readAsDataURL(file.raw);
        // if (fileList.length > 1) {
        // }
      },
      // 获取层级
      getGroupList() {
        let vm = this;
        vm.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
          success => {
            vm.loading = false;
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
                  let optionsNew = [];
                  for (let i = 0; i < options.length; i++) {
                    let newOption = {};
                    newOption["name"] = options[i].name;
                    newOption["_id"] = options[i]._id;
                    optionsNew.push(newOption);
                  }
                  vm.form.group.options = optionsNew;
                }
              } else {
                vm.loading = false;
              }
            }
          },
          error => {
            vm.loading = false;
          }
        );
      },
      handleFormCheckAllChange(val) {
        let options = [];
        for (let i = 0; i < this.form.group.options.length; i++) {
          options.push(this.form.group.options[i]._id);
        }
        this.form.group.checked = val ? options : [];
        this.form.group.isIndeterminate = false;
      },
      handleFormCheckedChange(value) {
        let options = [];
        if (value.length != 0) {
          for (let i = 0; i < value.length; i++) {
            options.push(value[i]);
          }
        }
        this.form.group.checked = options;
        let checkedCount = value.length ? value.length : 0;
        this.form.group.checkAll =
          checkedCount === this.form.group.options.length;
        this.form.group.isIndeterminate =
          checkedCount > 0 && checkedCount < this.form.group.options.length;
      },
      closeForm() {
        this.formVisible = false;
        this.resetForm();
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
      succee() {
        const vm = this;
        this.$message({
          message: "加载成功",
          type: "success",
          duration: vm.duration,
          center: true
        });
      },
      message(value, type) {
        const vm = this;
        this.$message({
          message: value,
          type: type,
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
      handleSizeChange(val) {
        this.pageSize = val;
        this.getActivityLogList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getActivityLogList();
      },
      handlecloseEditor(val) {
        this.showEditor = val;
      },
      convertImgDataToBlob(base64Data) {
        var format = "image/jpeg";
        var base64 = base64Data;
        var code = window.atob(base64.split(",")[1]);
        var aBuffer = new window.ArrayBuffer(code.length);
        var uBuffer = new window.Uint8Array(aBuffer);
        for (var i = 0; i < code.length; i++) {
          uBuffer[i] = code.charCodeAt(i) & 0xff;
        }
        console.info([aBuffer]);
        console.info(uBuffer);
        console.info(uBuffer.buffer);
        console.info(uBuffer.buffer == aBuffer); //true
        var blob = null;
        try {
          blob = new Blob([uBuffer], {
            type: format
          });
        } catch (e) {
          window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
          if (e.name == "TypeError" && window.BlobBuilder) {
            var bb = new window.BlobBuilder();
            bb.append(uBuffer.buffer);
            blob = bb.getBlob("image/jpeg");
          } else if (e.name == "InvalidStateError") {
            blob = new Blob([aBuffer], {
              type: format
            });
          } else {}
        }
        alert(blob.size);
        return blob;
      },
      editForm(row) {
        this.formCreate = false;
        this.formVisible = true;
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.createEditor();
          this.resetForm();
          this.formTitle = "编辑活动";
          for (let i in this.form) {
            if (i == "time") {
              this.form.time = [
                new Date(row["start_at"]),
                new Date(row["stop_at"])
              ];
              this.forever =
                100 ===
                new Date(row["stop_at"]).getFullYear() -
                new Date(row["start_at"]).getFullYear();
              continue;
            }
            if (i == "group") {
              let options = [];
              for (let i = 0; i < row["groupid"].length; i++) {
                if (row.groupid[i].is_deleted === 1) {
                  continue;
                }
                options.push(row.groupid[i]._id);
              }
              this.form.group.checked = options;
              this.form.group.checkAll =
                this.form.group.checked.length === this.form.group.options.length;
              continue;
            }
            if (i == "activity_photo" || i == "content_photo") {
              if (row[i]) {
                this.form[i].isFile = false;
                this.form[i].filterList = [{
                  name: "",
                  url: row[i]
                }];
                this.form[i].url = row[i];
              } else {
                this.form[i].isFile = true;
                this.form[i].filterList = [];
                this.form[i].url = "";
              }
              continue;
            }
            if (i == "content" && row[i]) {
              this.editor.txt.html(row[i]);
            }
            this.form[i] = row[i];
          }
          this.rowKey = row._id;
        });
      },
      editActivity(item) {
        const vm = this;
        if (this.form.group.checked.length == 0) {
          this.$message({
            message: "至少选择一个层级",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.form.title) {
          this.$message({
            message: "请输入活动名称",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.form.order) {
          this.$message({
            message: "请输入排序值",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.forever) {
          if (!this.form.time.toString()) {
            this.$message({
              message: "请输入活动时间",
              type: "error",
              duration: vm.duration,
              center: true
            });
            return;
          }
        }
        if (JSON.stringify(this.form.activity_photo.file) == "{}" && !this.form.activity_photo.url) {
          this.$message({
            message: "请上传活动图片",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        // if (JSON.stringify(this.form.content_photo.file) == "{}" && !this.form.content_photo.url) {
        //   this.$message({
        //     message: "请上传内容图片",
        //     type: "error",
        //     duration: vm.duration,
        //     center: true
        //   });
        //   return;
        // }
        if (!this.form.content) {
          this.$message({
            message: "请输入内容文字",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        vm.dialogLoading = true;
        let start_at, stop_at;
        if (this.forever) {
          start_at = this.start_at;
          stop_at = this.stop_at;
        } else {
          start_at = this.form.time[0];
          stop_at = this.form.time[1];
        }
        let activity_photo = this.form.activity_photo.file.raw;
        let content_photo = this.form.content_photo.file.raw;
        let content_true = JSON.stringify(this.form.content_photo.file) == "{}" && !this.form.content_photo.url;
        let formdata = new FormData();
        formdata.append("picture", activity_photo);
        let formdata2 = new FormData();
        formdata2.append("picture", content_photo);
        let isFile1 = this.form.activity_photo.isFile;
        let isFile2 = this.form.content_photo.isFile;
        if (isFile1 && isFile2) {
          if (!content_true) {
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.activity_photo.url = success.toString();
                request.upload(
                  "post",
                  "/uploadFile",
                  formdata2,
                  success => {
                    vm.form.content_photo.url = success.toString();
                    request.http(
                      "post",
                      "/activity/update", {
                        groupid: vm.form.group.checked,
                        title: vm.form.title,
                        order: vm.form.order,
                        start_at: start_at,
                        stop_at: stop_at,
                        activity_photo: vm.form.activity_photo.url,
                        content_photo: vm.form.content_photo.url || '',
                        content: vm.form.content,
                        enabled: 1,
                        id: vm.rowKey
                      },
                      success => {
                        vm.dialogLoading = false;
                        let code = success.returncode;
                        if (code === 200) {
                          vm.formVisible = false;
                          vm.form.activity_photo.isFile = false;
                          vm.form.activity_photo.isFile = false;
                          vm.getActivityLogList();
                        } else if (code === 101 || code === 103 || code === 106) {
                          request.loginAgain(vm);
                        } else {
                          alert(success.returncode);
                        }
                      },
                      error => {
                        vm.dialogLoading = false;
                        vm.error();
                      }
                    );
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          } else {
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.activity_photo.url = success.toString();
                request.http(
                  "post",
                  "/activity/update", {
                    groupid: vm.form.group.checked,
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    activity_photo: vm.form.activity_photo.url,
                    content_photo: "",
                    content: vm.form.content,
                    enabled: 1,
                    id: vm.rowKey
                  },
                  success => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.form.activity_photo.isFile = false;
                      vm.form.content_photo.isFile = false;
                      vm.getActivityLogList();
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm);
                    } else {
                      alert(success.returncode);
                    }
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          }
        } else if (isFile1 && !isFile2) {
          if (!content_true) {
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.activity_photo.url = success.toString();
                request.http(
                  "post",
                  "/activity/update", {
                    groupid: vm.form.group.checked,
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    activity_photo: vm.form.activity_photo.url,
                    content_photo: vm.form.content_photo.url || '',
                    content: vm.form.content,
                    enabled: 1,
                    id: vm.rowKey
                  },
                  success => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.form.activity_photo.isFile = false;
                      vm.form.activity_photo.isFile = false;
                      vm.getActivityLogList();
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm);
                    } else {
                      alert(success.returncode);
                    }
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.activity_photo.url = success.toString();
                request.http(
                  "post",
                  "/activity/update", {
                    groupid: vm.form.group.checked,
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    activity_photo: vm.form.activity_photo.url,
                    content_photo: vm.form.content_photo.url,
                    content: vm.form.content,
                    enabled: 1,
                    id: vm.rowKey
                  },
                  success => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.form.activity_photo.isFile = false;
                      vm.form.activity_photo.isFile = false;
                      vm.getActivityLogList();
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm);
                    } else {
                      alert(success.returncode);
                    }
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          } else {
            request.upload(
              "post",
              "/uploadFile",
              formdata,
              success => {
                vm.form.activity_photo.url = success.toString();
                request.http(
                  "post",
                  "/activity/update", {
                    groupid: vm.form.group.checked,
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    activity_photo: vm.form.activity_photo.url,
                    content_photo: "",
                    content: vm.form.content,
                    enabled: 1,
                    id: vm.rowKey
                  },
                  success => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.form.activity_photo.isFile = false;
                      vm.form.activity_photo.isFile = false;
                      vm.getActivityLogList();
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm);
                    } else {
                      alert(success.returncode);
                    }
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          }
        } else if (!isFile1 && isFile2) {
          if (!content_true) {
            request.upload(
              "post",
              "/uploadFile",
              formdata2,
              success => {
                vm.form.content_photo.url = success.toString();
                request.http(
                  "post",
                  "/activity/update", {
                    groupid: vm.form.group.checked,
                    title: vm.form.title,
                    order: vm.form.order,
                    start_at: start_at,
                    stop_at: stop_at,
                    activity_photo: vm.form.activity_photo.url,
                    content_photo: vm.form.content_photo.url || '',
                    content: vm.form.content,
                    enabled: 1,
                    id: vm.rowKey
                  },
                  success => {
                    vm.dialogLoading = false;
                    let code = success.returncode;
                    if (code === 200) {
                      vm.formVisible = false;
                      vm.getActivityLogList();
                      vm.form.activity_photo.isFile = false;
                      vm.form.activity_photo.isFile = false;
                    } else if (code === 101 || code === 103 || code === 106) {
                      request.loginAgain(vm);
                    } else {
                      alert(success.returncode);
                    }
                  },
                  error => {
                    vm.dialogLoading = false;
                    vm.error();
                  }
                );
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          } else {
            request.http(
              "post",
              "/activity/update", {
                groupid: vm.form.group.checked,
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                activity_photo: vm.form.activity_photo.url,
                content_photo: "",
                content: vm.form.content,
                enabled: 1,
                id: vm.rowKey
              },
              success => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.getActivityLogList();
                  vm.form.activity_photo.isFile = false;
                  vm.form.activity_photo.isFile = false;
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          }
        } else if (!isFile1 && !isFile2) {
          if (!content_true) {
            request.http(
              "post",
              "/activity/update", {
                groupid: vm.form.group.checked,
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                activity_photo: vm.form.activity_photo.url,
                content_photo: vm.form.content_photo.url || '',
                content: vm.form.content,
                enabled: 1,
                id: vm.rowKey
              },
              success => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.form.activity_photo.isFile = false;
                  vm.form.activity_photo.isFile = false;
                  vm.getActivityLogList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          } else {
            request.http(
              "post",
              "/activity/update", {
                groupid: vm.form.group.checked,
                title: vm.form.title,
                order: vm.form.order,
                start_at: start_at,
                stop_at: stop_at,
                activity_photo: vm.form.activity_photo.url,
                content: vm.form.content,
                enabled: 1,
                id: vm.rowKey
              },
              success => {
                vm.dialogLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.formVisible = false;
                  vm.form.activity_photo.isFile = false;
                  vm.form.activity_photo.isFile = false;
                  vm.getActivityLogList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm);
                } else {
                  alert(success.returncode);
                }
              },
              error => {
                vm.dialogLoading = false;
                vm.error();
              }
            );
          }
        }
      },
      createActivity() {
        // this.formVisible = true;
        const vm = this;
        if (this.form.group.checked.length == 0) {
          this.$message({
            message: "至少选择一个层级",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.form.title) {
          this.$message({
            message: "请输入活动名称",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.form.order) {
          this.$message({
            message: "请输入排序值",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        if (!this.forever) {
          if (!this.form.time.toString()) {
            this.$message({
              message: "请输入活动时间",
              type: "error",
              duration: vm.duration,
              center: true
            });
            return;
          }
        }
        if (JSON.stringify(this.form.activity_photo.file) == "{}" && !this.form.activity_photo.url) {
          this.$message({
            message: "请上传活动图片",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        // if (JSON.stringify(this.form.content_photo.file) == "{}" && !this.form.content_photo.url) {
        //   this.$message({
        //     message: "请上传内容图片",
        //     type: "error",
        //     duration: vm.duration,
        //     center: true
        //   });
        //   return;
        // }
        if (!this.form.content) {
          this.$message({
            message: "请输入内容文字",
            type: "error",
            duration: vm.duration,
            center: true
          });
          return;
        }
        vm.dialogLoading = true;
        let start_at, stop_at;
        if (this.forever) {
          start_at = this.start_at;
          stop_at = this.stop_at;
        } else {
          start_at = this.form.time[0];
          stop_at = this.form.time[1];
        }
        let activity_photo = this.form.activity_photo.file.raw;
        let content_photo = this.form.content_photo.file.raw;
        let formdata = new FormData();
        formdata.append("picture", activity_photo);
        let formdata2 = new FormData();
        if (content_photo) {
          formdata2.append("picture", content_photo);
          request.upload(
            "post",
            "/uploadFile",
            formdata,
            success => {
              vm.form.activity_photo.url = success.toString();
              request.upload(
                "post",
                "/uploadFile",
                formdata2,
                success => {
                  vm.form.content_photo.url = success.toString();
                  request.http(
                    "post",
                    "/activity/create", {
                      groupid: vm.form.group.checked,
                      title: vm.form.title,
                      order: vm.form.order,
                      start_at: start_at,
                      stop_at: stop_at,
                      activity_photo: vm.form.activity_photo.url,
                      content_photo: vm.form.content_photo.url,
                      content: vm.form.content,
                      enabled: 1
                    },
                    success => {
                      vm.dialogLoading = false;
                      let code = success.returncode;
                      if (code === 200) {
                        vm.formVisible = false;
                        vm.getActivityLogList();
                      } else if (code === 101 || code === 103 || code === 106) {
                        request.loginAgain(vm);
                      } else {
                        alert(success.returncode);
                      }
                    },
                    error => {
                      vm.dialogLoading = false;
                      vm.error();
                    }
                  );
                },
                error => {
                  vm.dialogLoading = false;
                  vm.error();
                }
              );
            },
            error => {
              vm.dialogLoading = false;
              vm.error();
            }
          );
        } else {
          request.upload(
            "post",
            "/uploadFile",
            formdata,
            success => {
              vm.form.activity_photo.url = success.toString();
              request.http(
                "post",
                "/activity/create", {
                  groupid: vm.form.group.checked,
                  title: vm.form.title,
                  order: vm.form.order,
                  start_at: start_at,
                  stop_at: stop_at,
                  activity_photo: vm.form.activity_photo.url,
                  content: vm.form.content,
                  enabled: 1
                },
                success => {
                  vm.dialogLoading = false;
                  let code = success.returncode;
                  if (code === 200) {
                    vm.formVisible = false;
                    vm.getActivityLogList();
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm);
                  } else {
                    alert(success.returncode);
                  }
                },
                error => {
                  vm.dialogLoading = false;
                  vm.error();
                }
              );
            },
            error => {
              vm.dialogLoading = false;
              vm.error();
            }
          );
        }
      },
      deleteActivity(item) {
        const vm = this;
        this.$alert("确定继续该操作吗", "温馨提示", {
          showCancelButton: true,
          center: true,
          confirmButtonText: "确定",
          callback: action => {
            if (action === "confirm") {
              request.chess(
                "post",
                "/activity/delete", {
                  id: item._id
                },
                success => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getActivityLogList();
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
      formatTime(row, column, cellValue) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
      formatTime2(start, end) {
        if (start && end) {
          if (
            100 ===
            new Date(end).getFullYear() - new Date(start).getFullYear()
          ) {
            return "永久";
          } else {
            return (
              moment(start).format("YYYY-MM-DD HH:mm:ss") +
              " 至 " +
              moment(end).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        }
      },
      getActivityLogList() {
        const vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/activity/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            enabled: vm.enabled.value,
            open: vm.activityStatus.value
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.activityLogListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
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
      handleReset() {
        this.username = "";
        this.searchTime = "";
        this.ip = "";
        this.keywords = "";
      },
      handleSearch() {
        this.getActivityLogList();
      }
    }
  };

</script>
<style lang="scss">
  /* @import '../../publicCss/header.css'; */

  .activityList {
    .el-custom .el-form-item {
      justify-content: flex-start;
    }

    .el-custom .el-form-item .el-form-item__content {
      display: flex;
      /* justify-content: space-around; */
      align-items: center;
    }

    .el-form-item {
      justify-content: flex-start;
    }

    .el-form-item__content {
      flex: 1;
      width: auto;
    }

    .el-form-item__label {
      width: 60px;
      font-size: 12px;
      color: #191919;
      /* letter-spacing: 6px; */
      text-align: justify;
      text-align-last: justify;
    }
  }

</style>
