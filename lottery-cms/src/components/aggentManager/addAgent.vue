<!-- 新增总代 -->
<template>
  <div>
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="content-container" v-loading="loading">
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="150px" :rules="rules">
          <el-form-item label="用户名：" prop="loginname">
            <el-input placeholder="用户名" v-model="form.loginname"></el-input>
          </el-form-item>
          <el-form-item label="返点：" prop="refund">
            <el-input placeholder="返点值" v-model="form.refund"></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password">
            <el-input placeholder="登录密码" v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-switch v-model="is_test" active-value="1" inactive-value="0" active-text="测试用户">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import moment from 'moment';

  export default {
    name: 'addAgent',
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '新增总代',
        routerArr: [{
            title: '新增总代',
            name: 'addAgent',
            checked: false
          },
          {
            title: '契约管理',
            name: 'contractManage',
            checked: false
          },
          {
            title: '契约设置',
            name: 'contractSet',
            checked: false
          },
        ],
        loading: false,
        form: {
          loginname: "", // 用户名
          refund: "", // 返点值
          password: "" // 登录密码
        },
        rules: {
          loginname: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          refund: [{
            required: true,
            message: '请输入返点值',
            trigger: 'change'
          }],
          password: [{
            required: true,
            message: '请输入登录密码',
            trigger: 'change'
          }],
        },
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
        if(v.url === 'addAgent'){
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
    },
    methods: {
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
      submitForm(formName) {
        let vm = this;
        let data = {};
        let url = "/agency/user/create";
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for (let v in vm.form) {
              let obj = vm.form[v];
              if (v == "password") {
                data[v] = CryptoJS.MD5(obj).toString();
                continue;
              }
              data[v] = obj;
            }
            vm.loading = true;
            data.is_test = vm.is_test
            request.http(
              'post', url, data,
              (success) => {
                vm.loading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.$alert('新增总代成功,用户名:' + success.newuser.loginname, '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      vm.resetForm('form');
                    }
                  })
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else if (code == 305) {
                  vm.message("用户名已存在", "error")
                }
              },
              (error) => {
                vm.loading = false;
                vm.resetForm('form');
                vm.error();
              }
            )
          } else {
            // vm.error();
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .box-card {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .content-container {
    width: 860px;
    margin: 0px auto;
    padding-top: 20px;
  }

</style>
