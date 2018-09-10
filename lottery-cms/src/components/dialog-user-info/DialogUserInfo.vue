<template>
  <el-dialog class="el-custom relative-dialog userDialog" title="会员资料" :before-close="handleCloseClick" :visible.sync="dialogVisible_">
    <div class="content-header">
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="active === 1?'current':''" @click="activeToggle(1)">基本资料</span>
          <span :class="active === 2?'current':''" @click="activeToggle(2)">银行资料</span>
          <span :class="active === 3?'current':''" @click="activeToggle(3)">备注信息</span>
        </div>
        <div class="search-content">
          <div style="width:100%;height:100%" v-loading="loading" v-if="active === 1">
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
                    <span>{{isSet(hasSetPsd?1:0)}}</span>
                    <el-button class="small yes" @click="handleResetLogin" style="margin-left:10px">重置</el-button>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <label>支付密码：</label>
                    <span>{{isSet(hasSetCashPsd?1:0)}}</span>
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
                    <span>{{formatcash(cash)}}</span>
                    <img src="@/assets/refresh.png" @click="refreshCash" style="width:14px;height:12px;margin:0 10px;margin-bottom:-1px;cursor:pointer;">
                    <button
                      :disabled="isClick"
                      style="cursor:pointer;font-size:12px;width:48px;color:#191919;text-decoration: underline;border:none;outline:none;background:none;font-weight:bold;"
                      @click="rebackMoney">
                      一键回收
                    </button>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <label>KY钱包：</label>
                    <span>{{formatcash(cash_ky)}}</span>
                  </td>
                  <td>
                    <label>AG钱包：</label>
                    <span>{{formatcash(cash_ag)}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <dialogEditUp v-if="dialogEditUpModel" @closeDialog="handleCloseDialog"></dialogEditUp>
          </div>
          <statusyinhangka :loginname="loginname" v-if="active === 2"></statusyinhangka>
          <statusxinxi v-if="active === 3" :userid="userid"></statusxinxi>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import statusziliao from '../dialog-user-info/ziliao';
  import statusxinxi from '../dialog-user-info/xinxi';
  import statusjilu from '../dialog-user-info/jilu';
  import statuszijin from '../dialog-user-info/zijin';
  import statuszhanghu from '../dialog-user-info/zhanghu';
  import statusrizhi from '../dialog-user-info/rizhi';
  import statusyinhangka from '../dialog-user-info/yinhangka';
  import statuszhanneixin from '../dialog-user-info/zhanneixin';
  import statusbaobiao from '../dialog-user-info/baobiao';
  import statustiaozheng from '../dialog-user-info/tiaozheng';
  import statusshebei from '../dialog-user-info/shebei';

  import request from '../../axios/axios.js';
  import tableInput from '../littleStyle/tableInput.vue';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import switchbar from '../littleStyle/switchbar.vue';
  import dialogEditUp from './dialogEditUp.vue';
  import moment from 'moment'

  export default {
    components: {
      statusziliao,
      statusxinxi,
      statusjilu,
      statuszijin,
      statuszhanghu,
      statusrizhi,
      statusyinhangka,
      statuszhanneixin,
      statusbaobiao,
      statustiaozheng,
      statusshebei,
    },
    props: {
      userid: {
        type: String,
      },
      loginname: {
        type: String,
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        isClick: false,
        cash: 0,
        cash_ky: 0,
        cash_ag: 0,
        data: null,
        ziliao: false,
        xinxi: false,
        jilu: false,
        zijin: false,
        zhanghu: false,
        rizhi: false,
        yinhangka: false,
        zhanneixin: false,
        baobiao: false,
        tiaozheng: false,
        shebei: false,
        dialogVisible_: this.dialogVisible,
        active: -1,

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
        hasSetPsd: false,
        hasSetCashPsd: false
      }
    },
    methods: {
      // 一键回收
      rebackMoney() {
        let self = this;
        self.isClick = true;
        self.loading = true;
        request.http('post', '/user/oneKey/exchange', {userid: self.userid},
          (success) => {
            let code = success.returncode;
            self.isClick = false;
            self.loading = false;
            if (code == 200) {
              self.getziiao();
            } else if(code == 101 || code == 103 || code == 106) {
              request.loginAgain(self)
            }
          },
          (error) => {
            self.loading = false;
            self.isClick = false;
            console.log('获取用户资金失败', error)
          }
        )
      },
      // 刷新钱包
      refreshCash() {
        let self = this;
        self.loading = true;
        request.http('get', '/user/refreshThirdCoin', {id: self.userid},
          (success) => {
            let code = success.returncode;
            self.loading = false;
            // console.log(success)
            if (code == 200) {
              self.cash_ky = success.data.cash_ky;
              self.cash_ag = success.data.cash_ag;
              self.cash = success.data.cash;
            } else if(code == 101 || code == 103 || code == 106) {
              request.loginAgain(self)
            } else if(code == 303){
              self.$message({
                message: '查询失败',
                type: "error",
                duration: 1500,
                center: true
              });
            }
          },
          (error) => {
            self.loading = false;
            console.log('获取用户资金失败', error)
          }
        )
      },
      activeToggle(key) {
        this.active = key;
      },
      handleClickUserStatus(ref) {
        this.setUserInfoStatus(ref);
      },
      handleCloseClick() {
        this.active = -1;
        this.dialogVisible_ = false;
        this.$emit('closeDialog', this.dialogVisible_);
      },
      handleDialogShow(val) {
        this.$emit('sendDiglogShow', val);
      },
      setUserInfoStatus(ref) {
        this.ziliao = false;
        this.xinxi = false;
        this.jilu = false;
        this.zijin = false;
        this.zhanghu = false;
        this.rizhi = false;
        this.yinhangka = false;
        this.zhanneixin = false;
        this.baobiao = false;
        this.tiaozheng = false;
        this.shebei = false;
        this[ref] = true;
      },
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
              vm.hasSetPsd = true;
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
              vm.hasSetCashPsd = true;
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
              vm.data = success.data;
              vm.cash_ky = vm.data.cash_ky;
              vm.cash_ag = vm.data.cash_ag;
              vm.cash = vm.data.cash;
              vm.hasSetCashPsd = vm.data.cash_password ? true : false;
              vm.hasSetPsd = vm.data.password ? true : false;
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
    watch: {
      dialogVisible(newValue, oldValue) {
        if (newValue) {
          this.dialogVisible_ = newValue;
          this.active = 1;
        }
      },
      active() {
        if (this.active) {
          if (this.active === 1) {
            this.getziiao();
          }
        }
      }
    },
  }

</script>

<style scoped>
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

  .el-aside .el-menu .el-submenu .el-submenu__title {
    display: -webkit-box !important;
  }

  .el-header,
  .el-footer {
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  * {
    box-sizing: border-box;
  }

  .dialog-user-info {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .dialog-user-info>.dialog-bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    background: #000;
    opacity: .3;
  }

  .dialog-user-info>.dialog-content {
    width: 900px;
    height: 600px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 102;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #000;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .dialog-user-info .dialog-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    /* z-index:101; */
    color: #fff;
  }

  .dialog-user-info .dialog-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    text-align: left;
    padding-left: 20px;
    background: #409EFF;
  }

  .dialog-user-info .user-info-title {
    width: 100%;
    height: 64px;
    color: #fff;
    background: #409EFF;
    display: -webkit-box;
    -webkit-box-pack: end;
  }

  .user-info-title .user-status {
    padding: .5rem 0;
    margin: 0 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    cursor: pointer;
  }

  .user-status>i {
    font-size: 26px;
  }

  .user-info-title .user-status:hover {
    color: lightsalmon;
  }

  .user-info-title .user-status-active {
    color: lightsalmon;
  }

  .user-status>span {
    font-weight: normal;
    font-size: 12px;
    display: block;
    line-height: normal;
  }

  .dialog-user-info .user-info-content {
    -webkit-box-flex: 1;
    background: #fff;
    overflow-y: auto;
  }

</style>

<style lang="scss">
  .userDialog {
    .content-header {
      width: 100%;
      padding: 10px;
      .search-wrap {
        width: 100%;
        min-width: 100%;

        .search-content {
          padding: 0;
          min-height: 450px;
        }
      }
    }
  }

</style>
