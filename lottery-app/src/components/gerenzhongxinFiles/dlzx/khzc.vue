<template>
  <div class="khzc-wrap">
    <textarea class="display-none-input" name="" id="copy-url-input" cols="30" rows="10"></textarea>
    <div class="public-search-copy-header">
      <span class="back" @click="goBack"></span>
      <span class="title-text">开户注册</span>
      <span class="search" @click="handleSearch">搜索</span>
    </div>
    <div class="kaihu-nav-btn-wrap">
      <span class="artificial-kaihu" :class="kaihu==='人工'?'active':''" @click="changeModel('人工')">人工开户</span>
      <span class="link-kaihu" :class="kaihu==='链接'?'active':''" @click="changeModel('链接')">链接开户</span>
    </div>
    <div v-if="kaihu==='人工'" style="position:relative">
      <ul>
        <li style="display:none">
          <span>用户类型：</span>
          <publicSelect
            class="select-wrap"
            v-if="showselect"
            placeholder="请选择用户类型"
            :selectList="userTypeList"
            :defaultSelected="userType"
            label="name"
            value="val"
            :callback="selectUserType">
          </publicSelect>
        </li>
        <li>
          <span>用户名：</span>
          <input type="text" v-model="username">
        </li>
        <li>
          <span>登录密码：</span>
          <input type="password" v-model="loginPwd">
        </li>
      </ul>
      <div class="my-slider-wrap">
        <el-slider v-model="adjust" :min="minRefund" :max="userRefund" :step="2" :show-tooltip="false"></el-slider>
        <div class="refund-wrap">
          <span>奖金组：{{adjust}}</span>
          <span>返点：{{((userRefund-adjust)/userRefund * 100).toFixed(2)}}%</span>
        </div>
      </div>
      <div class="reg-tip" v-if="tipText3">{{tipText3}}</div>
      <button class="submit-btn" :disabled="isClick" @click="confirmKaihu">立即开户</button>
    </div>
    <div v-if="kaihu==='链接'" style="position:relative">
      <ul>
        <!-- <li>
          <span>用户类型：</span>
          <publicSelect
            class="select-wrap"
            v-if="showselect"
            placeholder="请选择用户类型"
            :selectList="userTypeList"
            :defaultSelected="userType"
            label="name"
            value="val"
            :callback="selectUserType">
          </publicSelect>
        </li> -->
        <li>
          <span>链接有效期：</span>
          <publicSelect
            class="select-wrap"
            v-if="showselect"
            placeholder="请选择有效时间"
            :selectList="validTimeList"
            :defaultSelected="linkValidTime"
            label="name"
            value="val"
            :callback="selectValidTime">
          </publicSelect>
        </li>
      </ul>
      <div class="my-slider-wrap">
        <el-slider v-model="adjust" :min="minRefund" :max="userRefund" :step="2" :show-tooltip="false"></el-slider>
        <div class="refund-wrap">
          <span>奖金组：{{adjust}}</span>
          <span>返点：{{((userRefund-adjust)/userRefund * 100).toFixed(2)}}%</span>
        </div>
      </div>
      <button class="submit-btn" :disabled="isClick" @click="productLink">生成链接</button>
    </div>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <div class="alert-tip-text copy-url-alert-wrap" v-if="tipText2">
      <span>{{isCopyUrl}} <em style="color:#C83C4A" @click="copyUrlFn(tipText2)">点击复制链接</em>，{{closeDialogTime}}秒后关闭弹框!</span>
      <span>{{tipText2}}</span>
    </div>
  </div>
</template>
<script>
import request from '@/axios/axios.js';
import MD5 from 'MD5'
import paramCryptFn from '@/assets/js/cryptData'
import publicSelect from '@/components/publicModel/select';
import {regexpInput, regexpPsd} from '@/assets/js/validator.js'
export default {
  name: 'khzc',
  components: {
    publicSelect
  },
  data() {
    return {
      isClick: false,
      kaihu: '人工',
      adjust: 0,
      minRefund: 1800,
      userRefund: 0,
      userType: '0', // 用户类型
      username: '',
      loginPwd: '',
      linkValidTime: '',
      validTimeList: [
        { name: "1天", val: '1' },
        { name: "7天", val: '7' },
        { name: "30天", val: '30' },
        { name: "90天", val: '90' },
        { name: "一年", val: '365' }
      ],
      userTypeList: [
        { name: "代理", val: '0' },
        { name: "会员", val: '1' }
      ],

      showselect: true,

      isCopyUrl: '', // 复制链接

      tipText: '',
      tipText2: '',
      tipText3: '',
      tipTimeOut: 1.5, // s
      tipTimeOut2: 5, // s
      tipTimeOut3: 1.5, // s

      closeDialogTime: 5, // s

      sliderX: 0,
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', false);
    this.$store.dispatch('setHeader', false);
    this.userRefund = Number(localStorage.getItem('refund'));
    this.defaultAdjust();
  },
  mounted() {},
  watch: {},
  computed: {
    getTitleText() {
      return this.$store.state.title
    },
  },
  methods: {
    // 默认数据
    defaultAdjust() {
      const vm = this;
      this.showselect = false;
      setTimeout(() => {
        vm.showselect = true;
      }, 10);
      this.adjust = Math.floor((this.userRefund+this.minRefund)/2);
      this.userType = '0';
      this.username = '';
      this.loginPwd = '';
      this.linkValidTime = '';
    },
    // 切换开户类型
    changeModel(type) {
      this.kaihu = type;
      this.defaultAdjust();
    },
    // 选择用户类型
    selectUserType(item) {
      // console.log(item)
      this.userType = item.val;
    },
    // 选择有效时间
    selectValidTime(item) {
      // console.log(item)
      this.linkValidTime = item.val;
    },
    // 立即开户
    confirmKaihu() {
      const vm = this;
      if (vm.userType === '') {
        vm.tipText3 = '请选择用户类型';
        setTimeout(() => {
          vm.tipText3 = '';
        }, vm.tipTimeOut3*1000);
      } else if (vm.username === '') {
        vm.tipText3 = '请填写用户名'
        setTimeout(() => {
          vm.tipText3 = '';
        }, vm.tipTimeOut3*1000);
      } else if (!regexpInput(vm.username)) {
        vm.tipText3 = '用户名为3-16位字符，只能包含英文字母或数字'
        setTimeout(() => {
          vm.tipText3 = '';
        }, vm.tipTimeOut3*1000);
        return false;
      } else if (vm.loginPwd === '') {
        vm.tipText3 = '请填写登录密码'
        setTimeout(() => {
          vm.tipText3 = '';
        }, vm.tipTimeOut3*1000);
        return false;
      } else if (!regexpPsd(vm.loginPwd)) {
        vm.tipText3 = '密码为6-16位字符，只能且必须包含英文字母或数字（不允许连续三位相同）'
        setTimeout(() => {
          vm.tipText3 = '';
        }, vm.tipTimeOut3*1000);
        return false;
      } else {
        let param = {
          type: vm.userType,
          loginname: vm.username,
          password: MD5(vm.loginPwd),
          refund: vm.adjust
        }
        vm.isClick = true;
        request.http(
          'post',
          '/user/team/manual/create',
          paramCryptFn(param),
          (success) => {
            vm.isClick = false;
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              vm.defaultAdjust();
              vm.tipText = '开户成功'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            } else if(code == 305) {
              vm.tipText = '用户名重复'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            } else if(code == 301 || code == 303) {
              vm.tipText = '数据错误'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            }
          },
          (error) => {
            vm.isClick = false;
            console.log(error)
          }
        )
      }
    },
    // 生成链接
    productLink() {
      const vm = this;
      if (vm.userType === '') {
        vm.tipText = '请选择用户类型';
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
      } else if (vm.linkValidTime === '') {
        vm.tipText = '请选择有效时间'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
      } else {
        let param = {
          type: vm.userType,
          effect_time: vm.linkValidTime,
          refund: vm.adjust
        }
        vm.isClick = true;
        request.http(
          'post',
          '/user/team/link/create',
          param,
          (success) => {
            vm.isClick = false;
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              vm.defaultAdjust();

              vm.isCopyUrl = '链接已生成，'
              vm.closeDialogTime = 3;
              vm.tipText2 = success.data.url;
              let st = setInterval(() => {
                vm.closeDialogTime--;
                if(vm.closeDialogTime===0){
                  clearInterval(st);
                }
              }, 1000)
              setTimeout(() => {
                vm.tipText2 = '';
                vm.isCopyUrl = '';
              }, vm.tipTimeOut2*1000);

            } else if(code == 301 || code == 303) {
              vm.tipText = '数据错误'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.tipTimeOut*1000);
            }
          },
          (error) => {
            vm.isClick = false;
            console.log(error)
          }
        )
      }
    },

    copyUrlFn(url) {
      const vm = this;
      var input = document.getElementById("copy-url-input");
      input.value = url; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.isCopyUrl = '链接已复制'
    },
    
    // 后退
    goBack() {
      // console.log(this)
      // console.log('back')
      // return false;
      this.$router.back(-1);
      this.$store.dispatch('setHeader', true);
      this.$store.dispatch('setFooterStatus', true);
      this.$store.dispatch('setBackStatus', false);
      this.$store.dispatch('setPlayModeStatus', false);
      this.$store.dispatch('setCleanBtn', false);
    },
    // 搜索
    handleSearch() {
      // this.getTableData()
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.khzc-wrap{
  position: relative;
  .copy-url-alert-wrap{
    width:7rem;
    text-align: left;
    height:1.5rem;
    display:-webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack:center;
    span{
      display:block;
      -webkit-box-flex:1;
      padding-left:.3rem;
    }
  }
  .kaihu-nav-btn-wrap{
    width:3.24rem;
    height:.64rem;
    margin-top:.3rem;
    margin-left:2.13rem;
    background: #292932;
    border-radius: .08rem;
    // display:-webkit-box;
    // -webkit-box-align:center;
    overflow:hidden;
    color:#646464;
    span{
      // display:block;
      float: left;
      text-align:center;
      line-height:.64rem;
      width:50%;
    }
    span.active{
      color:#c7c7c7;
      background:#C83C4A;
    }
  }
  .reg-tip{
    width:100%;
    position: absolute;
    text-align:center;
    color:#C83C4A;
    left:0;
    bottom:1.1rem;
    padding:0 .75rem;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
      .select-wrap{
        -webkit-box-flex:1;
        height:100%;
        position: relative;
      }
      span{
        display:block;
        margin-left:.3rem;
      }
      input{
        display:block;
        height:100%;
        -webkit-box-flex:1;
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
  .my-slider-wrap{
    width:6.9rem;
    margin:.6rem .3rem;
    .refund-wrap{
      display:-webkit-box;
      -webkit-box-pack:justify;
      span{
        display:block;
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
  .display-none-input{
    position: absolute;
    left:0;
    top:0;
    z-index:-5;
    width:1px;
    height:1px;
    opacity: 0;
  }
}
</style>


