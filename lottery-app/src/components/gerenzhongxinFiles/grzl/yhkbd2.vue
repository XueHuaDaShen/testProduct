<template>
  <div class="yhkbd1-wrap">
    <div class="bind-yhk-step">
      <p class="active"></p>
      <p></p>
      <span class="step-one active">1</span>
      <span class="step-two active">2</span>
      <span class="step-three">3</span>
    </div>
    <div class="step-one-title">2、输入新银行卡信息</div>
    <ul>
      <li>
        <span>开户银行：</span>
          <publicSelect
            v-if="showBank"
            class="select-wrap"
            placeholder="请选择开户行"
            :selectList="bankList"
            label="bank_name"
            value="_id"
            :callback="getSelectedBank">
          </publicSelect>
      </li>
      <li>
        <span>开户银行区域：</span>
        <publicSelect
          v-if="showProvince"
          class="select-wrap"
          placeholder="省"
          :selectList="provinceList"
          label="name"
          value="_id"
          :callback="getSelectedProvince">
        </publicSelect>
        <publicSelect
          v-if="showCity"
          class="select-wrap"
          placeholder="市"
          :selectList="cityList"
          label="name"
          value="_id"
          :callback="getSelectedCity">
        </publicSelect>
      </li>
      <li>
        <span>支行名称：</span>
          <publicSelect
            v-if="showSubbranch"
            class="select-wrap"
            placeholder="请选择银行卡"
            :selectList="subbranchList"
            label="bank_name"
            value="_id"
            :callback="getSelectedSubbranch">
          </publicSelect>
      </li>
      <li>
        <span>开户人名字：</span>
        <input type="text" placeholder="请输入银行卡开户人姓名" v-model="realname">
      </li>
      <li>
        <span>银行卡号：</span>
        <input type="number" placeholder="请输入银行卡号" v-model="bankNum">
      </li>
      <!-- <li>
        <span>确认银行卡号：</span>
        <input type="number" placeholder="请输入旧的银行卡号" v-model="confirmBankNum">
      </li> -->
    </ul>
    <button class="submit-btn" @click="toNextBindBankStep">下一步</button>
    <div class="alert-tip-text" v-if="tipText">{{tipText}}</div>
  </div>
</template>
<script>
import request from '@/axios/axios';
import paramCryptFn from '@/assets/js/cryptData.js'
import bankJson from '@/assets/json/bank.json'
import publicSelect from '@/components/publicModel/select';
export default {
  name: 'yhkbd1',
  components: {
    publicSelect
  },
  data() {
    return {
      selectTxt: 'bank_name', // 选项值的 字段
      selectVal: '_id', // 选项文本 字段

      bank_id: '',
      city_id: '',

      code: '',

      bank: '', // 开户行
      province: '', // 省
      city: '', // 市
      subbranch: '', // 支行
      realname: '', // 开户人姓名
      bankNum: '', // 银行卡号
      // confirmBankNum: '', // 确认银行卡号

      bankList: [],
      provinceList: [],
      cityList: [],
      subbranchList: [],

      showBank: false,
      showSubbranch: false,
      showProvince: false,
      showCity: false,
      
      tipText: '',
      tipTimeOut: 1.5, // s
    }
  },
  created() {
    this.$store.dispatch('setFooterStatus', false);
    this.$store.dispatch('setBackStatus', true);
    this.$store.dispatch('setTitle', '银行卡绑定');
    this.getBankList();
    this.getProvince();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    toNextBindBankStep() {
      const vm = this;
      // console.log(this.bank, this.province, this.city, this.subbranch, this.realname, this.bankNum, this.confirmBankNum)
      if (!this.bank && !this.province && !this.city && !this.subbranch && !this.realname && !this.bankNum) {

        vm.tipText = '请填写完整的信息'
        setTimeout(() => {
          vm.tipText = '';
        }, vm.tipTimeOut*1000);
        return false;
      } else {
        // console.log({
        //     bank: vm.bank,
        //     province: vm.province,
        //     city: vm.city,
        //     subbranch: vm.subbranch,
        //     realname: vm.realname,
        //     card_no: vm.bankNum,
        //   })
        request.http(
          'post',
          '/user/bankcard/bind',
          paramCryptFn({
            bank: vm.bank,
            province: vm.province,
            city: vm.city,
            subbranch: vm.subbranch,
            realname: vm.realname,
            card_no: vm.bankNum,
          }),
          (success) => {
            // console.log(success)
            let code = success.returncode;
            if (code == 103 || code == 106 || code == 101) {
              request.loginAgain(vm);
            } else if (code == 200) {
              vm.$router.replace({
                name: 'yhkbd3',
                query: {
                  bank: success.data.bank,
                  type: '储蓄卡',
                  num: success.data.card_no.slice(-4),
                  code: vm.code
                }
              })
            }
            // } else if(code == 305) {
            //   vm.tipText = '密码错误'
            //   setTimeout(() => {
            //     vm.tipText = '';
            //   }, vm.tipTimeOut*1000);
            // } else if(code == 306) {
            //   vm.tipText = '用户被禁'
            //   setTimeout(() => {
            //     vm.tipText = '';
            //   }, vm.tipTimeOut*1000);
            // } else if(code == 304) {
            //   vm.tipText = '用户不存在'
            //   setTimeout(() => {
            //     vm.tipText = '';
            //   }, vm.tipTimeOut*1000);
            // }
          },
          (error) => {
            console.log('数据异常', error)
          }
        )
      }
    },

    // 获取选中的银行
    getSelectedBank(item) {
      // console.log('选中的银行-----',item)
      this.bank = item.bank_name;
      this.bank_id = item.bank_id;
      this.code = '';
      bankJson.bank.filter(v => {
        if(item.bank_name === v.name){
          this.code = v.code;
        }
      })
      this.getSubbranch();
    },
    // 获取选中的省份
    getSelectedProvince(item) {
      // console.log('选中的省份------',item)
      this.province = item.name;
      this.getCity(item)
    },
    // 获取选中的市
    getSelectedCity(item) {
      // console.log('选中的市------',item)
      this.city = item.name;
      this.city_id = item.code;
      this.getSubbranch();
    },
    // 获取选中的支行
    getSelectedSubbranch(item) {
      // console.log('选中的支行--------',item)
      this.subbranch = item.bank_name
    },
    
    // 获取所有银行
    getBankList() {
      const vm = this;
      request.http(
        'get',
        '/user/bank/list',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.bankList = success.data.banks;
            vm.showBank = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取支行
    getSubbranch() {
      const vm = this;
      vm.showSubbranch = false;
      request.http(
        'get',
        '/user/subbranch/list',
        {
          city_id: vm.city_id,
          pid: vm.bank_id
        },
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.subbranchList = success.data.subbranchs;
            vm.showSubbranch = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取省份
    getProvince() {
      const vm = this;
      request.http(
        'get',
        '/user/province/list',
        {},
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.provinceList = success.data.provinces;
            vm.showProvince = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
    // 获取省份
    getCity(item) {
      const vm = this;
      vm.showCity = false;
      // console.log(item)
      this.cityList = [];
      request.http(
        'get',
        '/user/city/list',
        {
          provinceid: item.code
        },
        (success) => {
          // console.log(success)
          if (success.returncode && success.returncode == 200) {
            vm.cityList = success.data.cities;
            vm.showCity = true;
          }
        },
        (error) => {
          console.log('数据异常', error)
        }
      )
    },
  },
  beforeDestroy() {},
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.yhkbd1-wrap{
  .bind-yhk-step{
    width:6.9rem;
    height: .5rem;
    margin:.3rem;
    display:-webkit-box;
    -webkit-box-align:center;
    position: relative;
    p{
      display:block;
      width:50%;
      height:.1rem;
      background:#DBDBDB;
    }
    p.active{
      background:#C83C4A;
    }
    span{
      position: absolute;
      width:.5rem;
      height:.5rem;
      background:#777;
      border-radius:50%;
      top:0;
      text-align:center;
      line-height:.5rem;
    }
    span.active{
      background:#C83C4A;
    }
    span.step-one{
      left:0;
    }
    span.step-two{
      left:50%;
      margin-left:-.25rem;
    }
    span.step-three{
      right:0;
    }
  }
  .step-one-title{
    width:100%;
    height:.45rem;
    text-align:center;
    line-height:.45rem;
    margin-bottom:.6rem;
    font-size:.32rem;
  }
  ul{
    li{
      height:.88rem;
      background: #292932;
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
      input{
        display:block;
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


