<template>
  <div style="width:100%;height:100%" v-loading="loading">
    <table id="ziliao-table" v-if="showTable">
      <tbody>
        <tr>
          <td style="width:50%;">
            <label>用户名：</label>
            <el-input disabled v-model="data.loginname" style="width:150px"></el-input>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <td>
            <label>真实姓名：</label>
            <el-input disabled v-model="data.realname" style="width:150px"></el-input>
          </td>
          <td>
            <label>生日:</label>
            <el-date-picker v-model="data.birthday" align="right" type="date" style="width:150px;" disabled>
            </el-date-picker>
          </td>
        </tr>
        <tr>
          <td>
            <label>昵称：</label>
            <el-input disabled v-model="data.nickname" style="width:150px"></el-input>
          </td>
          <td>
            <label>性别:</label>
            <el-select clearable v-model="data.sex" style="width:150px" disabled>
              <el-option label="男" :value="1">
              </el-option>
              <el-option label="女" :value="2">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <label>手机号码：</label>
            <el-input disabled v-model="data.phone" style="width:150px"></el-input>
          </td>
          <td>
            <label>邮箱地址:</label>
            <el-input disabled v-model="data.email" style="width:150px"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
    <table id="ziliao-table" v-if="showTable" style="border-top:1px solid #ddd">
      <tbody>
        <tr>
          <td style="width:50%;">
            <label>登录密码：</label>
            <span>{{isSet(data.password?1:0)}}</span>
            <el-button class="small yes" @click="handleResetLogin" style="margin-left:10px">重置</el-button>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>支付密码：</label>
            <span>{{isSet(data.cash_password?1:0)}}</span>
            <el-button class="small yes" @click="handleResetPay" style="margin-left:10px">重置</el-button>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <table id="ziliao-table" v-if="showTable" style="border-top:1px solid #ddd">
      <tbody>
        <tr>
          <td style="width:50%;">
            <label>主钱包：</label>
            <span>{{formatcash(data.cash)}}</span>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>KY钱包：</label>
            <span>{{formatcash(data.cash_ky)}}</span>
          </td>
          <td>
            <label>AG钱包：</label>
            <span>{{formatcash(data.cash_ag)}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <dialogEditUp v-if="dialogEditUpModel" @closeDialog="handleCloseDialog"></dialogEditUp>
  </div>
</template>
<script>
  import tableInput from '../littleStyle/tableInput.vue';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import switchbar from '../littleStyle/switchbar.vue';
  import dialogEditUp from './dialogEditUp.vue';
  import request from '../../axios/axios.js';
  import moment from 'moment'
  export default {
    name: 'ziliao',
    props: {
      userid: {
        type: String,
        required: true
      },
    },
    components: {
      tableInput,
      tableBtn,
      switchbar,
      dialogEditUp,
    },
    created() {
      this.getziiao();
    },
    data() {
      return {
        data: null,
        loading: false,
        showTable: false,
        dialogEditUpModel: false,
        isCeshi: false,
        lockStatus: {
          title: '锁定状态(正常)：',
          data: [{
              text: '登录',
              val: false
            },
            {
              text: '充值',
              val: false
            },
            {
              text: '投注',
              val: false
            },
            {
              text: '提现',
              val: false
            },
            {
              text: '转账',
              val: false
            },
            {
              text: '契约',
              val: false
            }
          ],
          text: '选中即为锁定该操作类型'
        },
        abilityOpen: {
          title: '功能开放：',
          data: [{
              text: '上级转账',
              val: false
            },
            {
              text: '下级转账',
              val: false
            },
            {
              text: '总代分红',
              val: false
            }
          ],
          text: '选中即为开放该功能'
        },
        username: 'hang5324',
        userID: '35464',
        drawingUser: '',
        userType: '代理',
        returnNum: '1960',
        phone: '18518460112',
        email: '839033104@qq.com',
        nickname: '雪花',
        QQ: '839033104',
        rent: '测试分组',
        nexus: 'ceshi110',
        createAt: '2018/4/19 15:19:00',
        createIp: '113.109.233.211 (广东省广州市电信)',
        loginAt: '2018/4/19 15:19:00',
        loginIp: '113.109.233.211 (广东省广州市电信)',
        loginPwdStatus: 1,
        payPwdStatus: 0,
        bankCard: 0,
        chromeCode: 0,
        totalAssets: '￥0.00元',
        lockMoney: '￥0.00元',
        balance: '￥0.00元',
        cash: '0.000',
        wallet: '￥0.00元',
        duration: 1000,
      }
    },
    methods: {
      enableChange(value) {
        // console.log('value', value);
        this.forbid(value, this.data._id);
      },
      formatcash(cash) {
        if (cash) {
          return Number(cash).toFixed(2);
        }
        return "0.00"
      },
      forbid(value, id) {
        const vm = this;
        request.http(
          'post',
          '/user/forbid', {
            id: id,
            is_forbid: value
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('更改成功');
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      handleResetLogin() {
        const vm = this;
        request.http(
          'post',
          '/user/reset/Password', {
            id: vm.data._id,
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('重置成功');
              vm.data.cash_password = "psd";
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      handleResetPay() {
        const vm = this;
        request.http(
          'post',
          '/user/reset/cashPassword', {
            id: vm.data._id,
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.success('重置成功');
              vm.data.password = "psd";
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            console.log(error)
          }
        )
      },
      isSet(val) {
        switch (val) {
          case 0:
            return '未设置';
          case 1:
            return '已设置';
        }
      },
      success(message) {
        const vm = this;
        this.$message({
          message: message,
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      formatTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
        // return moment(cellValue).format('YYYY-MM-DD')
      },
      handleEditUp() {
        this.dialogEditUpModel = true;
      },
      handleCloseDialog() {
        this.dialogEditUpModel = false;
      },
      handleSwitchCheck(data) {
        // console.log(data)
      },
      getziiao() {
        var vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/user/profile', {
            id: vm.userid
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.data = success.data
              vm.showTable = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            console.log(error)
          }
        )
      },
    },
  }

</script>
<style>
  #ziliao-table {
    width: 100%;
    border: none;
    border-spacing: 0;
    border-collapse: separate;
    max-width: 100%;
    background-color: transparent;
    empty-cells: show;
    padding: 20px 10px;
  }


  #ziliao-table tr>td {
    padding: .5rem;
    text-align: left;
  }

  #ziliao-table tr:first-child {
    border-top: none;
  }

  #ziliao-table tr>td.table-text-center {
    text-align: center;
  }

  .table-text-primary {
    color: #409EFF;
  }

  .table-text-lg {
    font-size: 1.5rem;
  }

  .table-float {
    float: right;
  }

  #ziliao-table label {
    display: inline-block;
    font-weight: 600;
    width: 80px;
  }

  #ziliao-table strong {
    display: inline-block;
    font-weight: 600;
    color: #F56C6C;
  }

</style>
