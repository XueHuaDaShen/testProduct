<template>
  <div class="grzl-wrap">
    <ul>
      <li>
        <span>用户名：</span>
        <input type="text" placeholder="请填写用户名" v-model="loginname">
      </li>
      <li>
        <span>昵称：</span>
        <input type="text" placeholder="请填写昵称" v-model="nickname">
      </li>
      <li>
        <span>真实姓名：</span>
        <input type="text" placeholder="请填写真实姓名" v-model="realname">
      </li>
      <li>
        <span>性别：</span>
        <publicSelect
          class="select-wrap"
          v-if="showSex"
          placeholder="请选择性别"
          :selectList="sexOptions"
          :defaultSelected="sex"
          label="title"
          value="val"
          :callback="selectOptions">
        </publicSelect>
      </li>
      <li>
        <span>生日：</span>
        <em class="slide-down-em-white"></em>
        <input type="text" placeholder="请选择生日" v-model="birthday" @click="showdatetime=true">
      </li>
      <li>
        <span>手机号：</span>
        <input type="text" placeholder="请填写手机号" v-model="phone">
      </li>
      <li>
        <span>邮箱：</span>
        <input type="text" placeholder="请填写邮箱" v-model="email">
      </li>
    </ul>
    <button class="submit-btn" @click="editUser">提交修改</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
    <datetime :class="showdatetime?'showdatetime':''" datetimeWrapId='grzx-datetime-wrap' :callback="getBirthday" :datetime="birthday" v-if="showSex"></datetime>
  </div>
</template>
<script>
import request from '@/axios/axios.js'
import publicSelect from '@/components/publicModel/select';
import datetime from '@/components/publicModel/date';
import moment from 'moment';
export default {
  name: 'grzl',
  components: {
    publicSelect,
    datetime
  },
  data() {
    return {
      moment: moment,
      showdatetime: false,
      loginname: '', // 用户名
      nickname: '', // 昵称
      realname: '', // 真实姓名
      sex: '', // 性别 1 男, 2 女
      birthday: '', // 生日
      phone: '', // 电话
      email: '', // 邮箱
      sexOptions: [
        {title: '男', val: '1'},
        {title: '女', val: '2'},
      ],
      showSex: false,
      alertTipTime: 2, // s
      tipText: '',
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '个人资料');
    this.getUserprofile();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取返回的时间
    getBirthday(parma) {
      this.birthday = parma.year + '-'+ parma.month + '-'+ parma.date;
      this.showdatetime = parma.showdatetime;
    },
    // 选择性别
    selectOptions(item) {
      // console.log(item)
      this.sex = item.val;
    },
    // 获取用户资料
    getUserprofile() {
      const vm = this;
      request.http(
        'get',
        '/user/profile',
        {},
        (success) => {
          // console.log(success)
          if(success.returncode === 200){
            vm.loginname = success.data.loginname;
            vm.nickname = success.data.nickname;
            vm.realname = success.data.realname;
            vm.sex = success.data.sex;
            vm.birthday = moment(success.data.birthday).format('YYYY-MM-DD')
            vm.phone = success.data.phone;
            vm.email = success.data.email;
            vm.showSex = true;
          }
        },
        (error) => {}
      )
    },
    // 修改用户资料
    editUser() {
      const vm = this;
      request.http(
        'post',
        '/user/profile/update',
        {
          loginname: vm.loginname,
          nickname: vm.nickname,
          realname: vm.realname,
          sex: vm.sex,
          birthday: vm.birthday,
          phone: vm.phone,
          email: vm.email,
        },
        (success) => {
          let code = success.returncode
          if (code) {
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              vm.tipText = '修改成功'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.alertTipTime*1000);
            } else {
              vm.tipText = '修改失败'
              setTimeout(() => {
                vm.tipText = '';
              }, vm.alertTipTime*1000);
              // console.log('error', code);
            }
          }
        },
        (error) => {}
      )
    }
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.grzl-wrap{
  .showdatetime{
    height:100%;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
      position: relative;
      display:-webkit-box;
      -webkit-box-align:center;
      margin-top:.3rem;
      span{
        display:block;
        margin-left:.3rem;
      }
      .select-wrap{
        -webkit-box-flex:1;
        height:100%;
        position: relative;
      }
      em{
        position: absolute;
        width:.243rem;
        height:.163rem;
        background:#c7c7c7;
        right:.309rem;
        top:.357rem;
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


