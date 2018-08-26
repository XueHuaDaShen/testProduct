<!-- 契约设置 -->
<template>
  <div class="el-custom">
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
            <label>日工资最高比例：</label>
            <el-input placeholder="日工资最高比例" v-model.number="form.max_daily_profit" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>月分红最高比例：</label>
            <el-input placeholder="月分红最高比例" v-model.number="form.max_month_profit" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="submitForm('form')" size="medium" class="small yes">提交</el-button>
          </div>
          <!--  <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="日工资最高比例" prop="max_daily_profit">
              <el-input placeholder="日工资最高比例" v-model.number="form.max_daily_profit"></el-input>
            </el-form-item>
            <el-form-item label="月分红最高比例" prop="max_month_profit">
              <el-input placeholder="月分红最高比例" v-model.number="form.max_month_profit"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">提交</el-button>
            </el-form-item>
          </el-form> -->
        </div>
      </div>
    </div>
    <div class="content-container" v-loading="loading">
      <!-- <el-card class="box-card">

      </el-card> -->
    </div>
  </div>
</template>
<script>
  import request from '../../axios/axios.js'
  import moment from 'moment';

  export default {
    name: 'contractSet',
    data() {
      var validateProfit = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('比例不能小于0'));
        } else if (value > 1) {
          callback(new Error('比例不能大于1'));
        } else {
          callback();
        }
      };
      return {
        index1: 0,
        index2: 0,
        titleName: '契约设置',
        routerArr: [{
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
        duration: 1000,
        form: {
          max_daily_profit: "", // 日工资最高比例
          max_month_profit: "" // 月分红最高比例
        },
        id: '',
        rules: {
          max_daily_profit: [{
              required: true,
              message: '请输入日工资最高比例',
              trigger: 'blur',
            },
            {
              trigger: 'blur',
              validator: validateProfit
            }
          ],
          max_month_profit: [{
            required: true,
            message: '请输入月分红最高比例',
            trigger: 'change'
          }, {
            trigger: 'blur',
            validator: validateProfit
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
        if(v.url === 'contractSet'){
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
        let data = {},
          valid = true;
        let url = "/contract/config/update";
        if (valid) {
          for (let v in vm.form) {
            let obj = vm.form[v];
            data[v] = obj;
          }
          data['id'] = vm.id;
          vm.loading = true;
          request.http(
            'post', url, data,
            (success) => {
              vm.loading = false;
              let code = success.returncode;
              if (code === 200) {
                // vm.success();
                vm.$alert('提交成功', '系统提示', {
                  confirmButtonText: '确定',

                  callback: action => {

                  }
                })
              } else if (code === 101 || code === 103 || code === 106) {
                request.loginAgain(vm)
              }
            },
            (error) => {
              vm.loading = false;
              vm.$refs[formName].resetFields();
              vm.error();
            }
          )
        }
      },
      getList() {
        let vm = this;
        let url = "/contract/config/get";
        vm.loading = true;
        request.http(
          'get', url, {},
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              let data = success.data;
              vm.id = data._id;
              vm.form.max_daily_profit = data.max_daily_profit;
              vm.form.max_month_profit = data.max_month_profit;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
          }
        )
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
    },
    mounted() {
      this.getList();
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
