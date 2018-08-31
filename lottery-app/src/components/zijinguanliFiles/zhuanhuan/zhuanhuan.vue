<template>
  <div class="tixian-wrap">
    <h2 class="tixian-title-wrap"><em></em>账户余额</h2>
    <div class="blance-table">
      <table v-if="showProfile">
        <thead>
          <tr>
            <td colspan="2">
              账户总余额：<em class="color-red">{{ (Number(profile.cash) + Number(profile.cash_ky)).toFixed(2) || 0 }}元</em>
              <img src="@/assets/img/refresh.png" class="refresh-icon" @click="refreshUser">
              <button class="reback-btn" :disabled="isClick" @click="rebackMoney">一键回收</button>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-title">主账户</td>
            <td>{{Number(profile.cash).toFixed(2) || 0}}元</td>
          </tr>
          <tr>
            <td class="td-title">KY 游戏</td>
            <td>{{Number(profile.cash_ky).toFixed(2) || 0}}元</td>
          </tr>
          <!-- <tr>
            <td class="td-title">AG 游戏</td>
            <td>0元</td>
          </tr>
          <tr>
            <td class="td-title">PT 游戏</td>
            <td>0元</td>
          </tr>
          <tr>
            <td class="td-title">沙巴体育</td>
            <td>0元</td>
          </tr> -->
        </tbody>
      </table>
    </div>
    <div class="split-bar"></div>
    <h2 class="tixian-title-wrap"><em></em>转账</h2>
    <ul>
      <li>
        <span>转入：</span>
        <publicSelect
          v-if="showSelect1"
          class="select-wrap"
          :selectList="zhuanruArr"
          :defaultSelected="zhuanhuanType"
          placeholder="请选择转入账户"
          label="title"
          value="val"
          :callback="getSelectedZhuanhuanType">
        </publicSelect>
      </li>
      <li>
        <span>转出：</span>
        <publicSelect
          v-if="showSelect2"
          class="select-wrap"
          :selectList="zhuanchuArr"
          :defaultSelected="toUser"
          placeholder="请选择转出账户"
          label="title"
          value="val"
          :callback="getSelectedZhuanchu">
        </publicSelect>
      </li>
      <li>
        <span>结账金额：</span>
        <input type="number" placeholder="" v-model="jiezhang">
        <i class="unit">元</i>
      </li>
      <li>
        <span>资金密码：</span>
        <input type="password" v-model="zijinPwd" placeholder="密码为6-16位字母或数字">
      </li>
    </ul>
    <button class="submit-btn" :class="isClick2?'disabled-btn':''" :disabled="isClick2" @click="confirmWithDraw">确认转账</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import publicSelect from '@/components/publicModel/select';
import paramCryptFn from '@/assets/js/cryptData'
export default {
  name: 'tixian',
  components: {
    publicSelect
  },
  data() {
    return {

      isClick: false,
      isClick2: false,

      zhuanhuanArr1: [
        {title: '主账户', val: 'main'}
      ],
      zhuanhuanArr2: [
        {title: 'KY 游戏', val: 'ky'},
        // {title: 'AG 游戏', val: 'ag'},
        // {title: 'PT 游戏', val: 'pt'},
      ],

      zhuanchuArr: [],
      zhuanruArr: [
        {title: '主账户', val: 'main'},
        {title: 'KY 游戏', val: 'ky'},
        // {title: 'AG 游戏', val: 'ag'},
        // {title: 'PT 游戏', val: 'pt'},
      ],

      zhuanhuanType: '',
      toUser: '',

      showSelect1: true,
      showSelect2: false,

      zhuanru: '', // 转入
      zhuanchu: '', // 转出
      jiezhang: '', // 结账
      zijinPwd: '', // 资金密码

      showProfile: false,

      profile: null,

      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '额度转换');
    this.refreshCash();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取用户资金
    refreshCash() {
      let vm = this;
      vm.$store.dispatch('setLoading', true);
      request.http('get', '/user/profile', {},
        (success) => {
          vm.$store.dispatch('setLoading', false);
          if (success.returncode == 200) {
            let profile = success.data;
            vm.profile = profile;
            vm.showProfile = true;
          }
        },
        (error) => {
          vm.$store.dispatch('setLoading', false);
          console.log('获取用户资金失败', error)
        }
      )
    },
    // 刷新
    refreshUser() {
      let vm = this;
      vm.$store.dispatch('setLoading', true);
      request.http('get', '/user/refreshThirdCoin', {},
        (success) => {
          vm.$store.dispatch('setLoading', false);
          if (success.returncode == 200) {
            let profile = success.data;
            vm.profile = profile;
            vm.showProfile = true;
          }
        },
        (error) => {
          vm.$store.dispatch('setLoading', false);
          console.log('获取用户资金失败', error)
        }
      )
    },
    // 一键回收
    rebackMoney() {
      const vm = this;
      vm.isClick = true;
      vm.$store.dispatch('setLoading', true);
      request.http('post', '/user/oneKey/exchange', {},
        (success) => {
          vm.$store.dispatch('setLoading', false);
          let code = success.returncode;
          vm.isClick = false;
          if (code == 200) {
            vm.refreshCash();
            vm.tipText = '转账成功'
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*1000);
          } else if(code == 101 || code == 103 || code == 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          vm.isClick = false;
          vm.$store.dispatch('setLoading', false);
          console.log('获取用户资金失败', error)
        }
      )
    },
    getSelectedZhuanhuanType(item) {
      const vm = this;
      this.zhuanhuanType = item.val;
      this.zhuanchuArr = [];
      if(this.zhuanhuanType!==''){
        this.showSelect2 = true;
      }else{
        this.showSelect2 = false;
        this.zhuanchuArr = [];
      }
      if(this.zhuanhuanType === 'main') {
        this.showSelect2 = false;
        setTimeout(() => {
          vm.showSelect2 = true;
        }, 10);
        this.zhuanchuArr = this.zhuanhuanArr2;
      }else{
        this.showSelect2 = false;
        setTimeout(() => {
          vm.showSelect2 = true;
        }, 10);
        this.zhuanchuArr = this.zhuanhuanArr1;
      }
    },
    getSelectedZhuanchu(item) {
      // console.log(item)
      this.toUser = item.val;
    },
    // 确认提现
    confirmWithDraw() {
      this.checkInZijinPwd();
    },
    // 验证资金密码
    checkInZijinPwd() {
      const vm = this;
      if(this.zijinPwd === ''){
        vm.tipText = '资金密码不能为空'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      }
      request.login(
        'post',
        '/user/random',
        {
          loginname: localStorage.getItem('loginname')
        },
        (success) => {
          let code = success.returncode;
          if(code == 200){
            let random = success.data.random;
            let new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.zijinPwd).toString(), random).toString();
            request.http(
              'post',
              '/verifyCashPW',
              {
                cash_password: new_password
              },
              (success) => {
                // console.log(success)
                let code = success.returncode;
                if (code == 103 || code == 106 || code == 101) {
                  request.loginAgain(vm);
                } else if (code == 200) {
                  // vm.tipText = '用户不存在'
                  // setTimeout(() => {
                  //   vm.tipText = '';
                  // }, vm.tipTimeOut*1000);
                  // vm.$router.push({
                  //   name: 'yhkbd2'
                  // })
                  vm.withdrawFn();
                } else if(code == 305) {
                  vm.tipText = '密码错误'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 306) {
                  vm.tipText = '用户被禁'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                } else if(code == 304) {
                  vm.tipText = '用户不存在'
                  setTimeout(() => {
                    vm.tipText = '';
                  }, vm.tipTimeOut*1000);
                }
              },
              (error) => {
                console.log('数据异常', error)
              }
            )
          }
        },
        (error) => {}
      )
    },
    // 验证通过，转账
    withdrawFn() {
      const vm = this;
      let param = {
        channelOut: vm.toUser,
        channelIn: vm.zhuanhuanType,
        money: vm.jiezhang
      };
      this.isClick2 = true;
      request.http(
        'post',
        '/user/exchange',
        paramCryptFn(param),
        (success) => {
          // console.log(success)
          let code = success.returncode;
          if (success.returncode == 200){
            vm.showSelect1 = false;
            vm.showSelect2 = false;
            setTimeout(() => {
              vm.showSelect1 = true;
              vm.showSelect2 = true;
            }, 10);
            vm.toUser = '';
            vm.zhuanhuanType = '';
            vm.jiezhang = '';
            vm.zijinPwd = '';
            vm.$store.dispatch('setBlance', success.data.cash);
            localStorage.setItem('blance', success.data.cash)
            vm.refreshCash();
            vm.tipText = '转账成功'
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*1000);
          } else if (code == 301 || code == 305) {
            vm.tipText = '资金密码不正确';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else if (code == 304) {
            vm.tipText = '账户无法进行额度转换';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else if (code == 302) {
            vm.tipText = '账户余额不足';
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          } else {
            vm.tipText = success.data.msg;
            setTimeout(() => {
              vm.tipText = '';
            }, vm.tipTimeOut*2000);
          }
        },
        (error) => {}
      )
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.tixian-wrap{
  em{
    font-style:normal;
  }
  .color-red{
    color:#C83C4A;
  }
  h2.tixian-title-wrap{
    height:1.05rem;
    display:-webkit-box;
    -webkit-box-pack:start;
    -webkit-box-align:center;
    text-align:left;
    font-size:.32rem;
    em{
      display:block;
      width:.08rem;
      height:.36rem;
      background:#c7c7c7;
      margin-left:.3rem;
      margin-right:.16rem;
      margin-top:.03rem;
    }
  }
  .blance-table{
    width:6.9rem;
    // height:6.1rem;
    background: #292932;
    border-radius: .08rem;
    border: .02rem solid #303040;
    margin-left:.3rem;
    margin-bottom:.3rem;
    overflow: hidden;
    table{
      width:100%;
      border-collapse: collapse;
      .refresh-icon{
        width:.38rem;
        height:.32rem;
        margin-left:.2rem;
        margin-bottom:-.05rem;
        display:inline-block;
      }
      .reback-btn{
        display:inline-block;
        margin-left:.2rem;
        text-decoration: underline;
        border:none;
        outline:none;
        background:none;
        font-weight:bold;
      }
      thead{
        border-bottom: .02rem solid #303040;
        td{
          text-align:center;
        }
      }
      tr{
        height:1.02rem;
        border-bottom: .02rem solid #303040;
        &:last-child{
          border-bottom:none;
        }
        td{
          padding:.3rem 0;
          padding-left:.3rem;
        }
        td.td-title{
          width:1.72rem;
          border-right: .02rem solid #303040;
        }
      }
    }
  }
  ul>li.input-text-red>i.unit{
    color:#C83C4A;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
      position: relative;
      &:first-child{
        margin-top:0;
      }
      i{
        position: absolute;
        right:.3rem;
        bottom:.24rem;
        font-style:normal;
      }
      span{
        display:block;
        margin-left:.3rem;
      }
      .select-wrap{
        -webkit-box-flex:1;
        height:100%;
        position: relative;
      }
      input{
        display:block;
        -webkit-box-flex:1;
        height:100%;
        padding-right:.3rem;
        padding-left:.1rem;
        outline: none;
        border: none;
        background: #292932;
        color:#c7c7c7;
      }
      input::-webkit-input-placeholder { /* WebKit browsers */
        color: #646464;
      }
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #646464;
      }
      input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #646464;
      }
      input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #646464;
      }
    }
  }
  button.submit-btn{
    display:block;
    width:4.4rem;
    height:.8rem;
    background: #C83C4A;
    border-radius: .08rem;
    margin-top:1.2rem;
    margin-left:1.55rem;
    font-size:.32rem;
    line-height:.8rem;
  }
}
</style>


