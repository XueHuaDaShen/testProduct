/* 充值 */
<template>
  <div class="order-detail-wrap search-form content top-up-wrap">
    <user-menu></user-menu>
    <div class="main" v-loading="loading">
      <div class="top-bar">
        <span>当前位置：</span>
        <span>资金管理</span>
        <i class="iconfont icon-Right"></i>
        <span>充值</span>
      </div>
      <div class="project-content">
        <ul class="tabs">
          <li class="tab-title active">
            <router-link :to="{ name:'topUp'}">充值</router-link>
          </li>
          <li class="tab-title ">
            <router-link :to="{ name:'withdraw'}">提现</router-link>
          </li>
          <!-- <li class="tab-title ">
            <router-link :to="{ name:'transfer'}">转账</router-link>
          </li> -->
          <li class="tab-title ">
            <router-link :to="{ name:'transform'}">额度转换</router-link>
          </li>
        </ul>
        <div class="wrap-inner">
          <div class="inner-pay-title mb-20">
            请选择支付方式
          </div>
          <ul class="mb-30 pay-list clearfix flex">
            <li :class="[{'active':topUpType.active === index+1}]" @click="topUpItemToggle(index+1)" v-for="(item,index) in topUpType.data" :key="index">
              <i :class="[{'kj':item.name ==='快捷支付'},{'sm':item.name ==='扫码支付'}]"></i>{{item.name}}
            </li>
          </ul>
          <div class="inner-pay-title mb-20">
            请选择支付渠道
          </div>
          <ul class="inner-pay-ways mb-30">
            <li :class="[{'active':entrance.active === index}]" @click="entranceToggle(index,item.code,item.account)" v-for="(item,index) in entrance.data" :key="index">
              {{item.name}}
            </li>
          </ul>
          <hr class="user-split-line">
          <!-- 银行卡转账 START-->
          <div v-show="entrance.activeName === 'card'">
            <div class="recharge-wrap">
              <span class="title">公司银行信息</span>
              <el-radio-group class="flex flex-wrap" v-model="entrance.thirdLvList.value" v-if="entrance.thirdLvList.allowed">
                <el-radio v-for="option in entrance.thirdLvList.options" :key="option.value" class="recharge-bank lh-22" :label='option'>
                  <div class="radio-row">
                    <span class="exp">
                      银行
                    </span>
                    :
                    <span class="content">{{option.bank}}</span>
                  </div>
                  <div class="radio-row">
                    <span class="exp">
                      收款人
                    </span>
                    :
                    <span class="content">{{option.realname}}</span>
                  </div>
                  <div class="radio-row">
                    <span class="exp">
                      开户行网点
                    </span>
                    :
                    <span class="content">{{option.subbranch}}</span>
                  </div>
                  <div class="radio-row">
                    <span class="exp">
                      账号
                    </span>
                    :
                    <span class="content">{{option.account_no}}</span>
                  </div>
                </el-radio>
              </el-radio-group>
              <el-radio-group class="flex flex-wrap" v-if="!entrance.thirdLvList.allowed">
                <el-radio class="recharge-bank lh-22" disabled>
                  <div class="radio-row">
                    <span class="exp">
                      银行
                    </span>
                    :
                    <span class="content">暂无数据</span>
                  </div>
                  <div class="radio-row">
                    <span class="exp">
                      收款人
                    </span>
                    :
                    <span class="content">暂无数据</span>
                  </div>
                  <div class="radio-row">
                    <span class="exp">
                      账号
                    </span>
                    :
                    <span class="content">暂无数据</span>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>
            <div class="top-up-bottom-tip">
              <div class="tip-title">注意事项：</div>
              <p class="tip-content">
                1. 本页显示的银行账号将不定期更换，请核对正确后再转账，转账备注/留言填写入款会员账号。
                <br /> 2. 建议您选择与公司相同的银行，同银行间转账可以立即到账，若是跨行转账，则取决于银行的处理时间，会较晚到账。
                <br /> 3. 充值不成功，请联系在线客服。
                <br /> 4. 请避免存入个位数为0金额以便于区别您的入款，建议使用诸如51.05、204.10、3001.50、10008.88等的随机金额，微信支付宝转账请备注姓名说明。
                <br /> 5. 谢谢大家的支持与配合！
              </p>
            </div>
            <hr class="user-split-line">
            <p class="large-tip">如已存入款项，请填写您的转账资料</p>
            <div class="top-up-container item">
              <div class="container-row">
                <span class="exp">存入金额：</span>
                <el-input placeholder="请输入存入金额" type="number" v-model.trim="form.cash_apply.value" class="content" clearable :disabled="!entrance.thirdLvList.allowed" @keyup.enter.native="cashApplyChange"></el-input>
                <span class="unit">元</span>
              </div>
              <div class="container-row">
                <span class="exp">存款银行：</span>
                <el-select class="content" v-model="form.banks.value" clearable placeholder="请选择开户银行" :loading="form.banks.loading" :loading-text="form.banks.loadingtext" @focus="focusBank" :disabled="!entrance.thirdLvList.allowed">
                  <el-option v-for="item in form.banks.options" :key="item.bank_id" :label="item.bank_name" :value="item.bank_id">
                  </el-option>
                </el-select>
              </div>
              <div class="container-row">
                <span class="exp">存款人姓名：</span>
                <el-input placeholder="请输入存款人姓名" type="text" v-model.trim="form.realname.value" class="content" clearable :disabled="!entrance.thirdLvList.allowed"></el-input>
              </div>
              <div class="container-row">
                <span class="exp">存款人卡号：</span>
                <div class="card-input" :data-balloon="formatNo(form.card_no.value)" data-balloon-pos="up">
                  <el-input placeholder="请输入存款人卡号" type="text" v-model.trim="form.card_no.value" class="content" clearable></el-input>
                </div>
                <!-- <button data-balloon="Whats up!" data-balloon-pos="up">Hover me!</button> -->
              </div>
              <div class="container-row mt-20">
                <span class="exp"></span>
                <span class="top-up-limit">充值额度限定：最低 {{bankcards.min_recharge_every_time}} 元,最高 {{bankcards.max_recharge_every_time}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <el-button class="top-up-submit" @click="onSubmit(1)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.card == true}" :disabled="submitDisable.card">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- 网银转账 Start-->
          <div v-show='entrance.activeName === "ebank"'>
            <div class="top-up-container item">
              <div class="container-row flex">
                <span class="exp">充值银行</span>
                <ul class="banklist clearfix">
                  <li @click="jeepayToggle(index+1,item.code)" :class="[{'active':entrance.thirdLvList.active === (index+1)},getBankBg(item.uid)]" v-for="(item,index) in entrance.thirdLvList.options" :key="index">
                    <div class="li-inner-border"></div>
                  </li>
                </ul>
              </div>
              <div class="container-row mt-40">
                <span class="exp">充值金额</span>
                <el-input placeholder="请输入充值金额" type="number" v-model.trim="form.cash_apply.value" class="content ml4" clearable :disabled="!entrance.thirdLvList.allowed"></el-input>
                <span class="unit">元</span>
              </div>
              <div class="container-row mt-20">
                <span class="exp"></span>
                <span class="top-up-limit ml4">充值额度限定：最低 {{bankcards.third_min_recharge_every_time}} 元,最高 {{bankcards.third_max_recharge_every_time}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <el-button class="top-up-submit" @click="onSubmit(2)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.ebank == true}" :disabled="submitDisable.ebank">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- 网银转账 END-->
          <!-- 银联快捷 Start-->
          <div v-show='entrance.activeName === "unionpay"'>
            <div class="top-up-container item">
              <div class="container-row flex">
                <span class="exp">充值银行</span>
                <ul class="pay-way clearfix flex">
                  <!-- <li @click="jeepayToggle((index+1),item.code)" :class="[{'active':entrance.thirdLvList.active === (index+1)},getBankBg(item.uid)]" v-for="(item,index) in entrance.thirdLvList.options" :key="index"></li> -->
                  <li class="wxActive active">
                    <i class="yl"></i>银联充值
                  </li>
                </ul>
              </div>
              <div class="container-row mt-40">
                <span class="exp">充值金额</span>
                <el-input placeholder="请输入充值金额" type="number" v-model.trim="form.cash_apply.value" class="content ml4" clearable :disabled="!entrance.thirdLvList.allowed"></el-input>
                <span class="unit">元</span>
              </div>
              <div class="container-row mt-20">
                <span class="exp"></span>
                <span class="top-up-limit ml4">充值额度限定：最低 {{bankcards.third_min_recharge_every_time}} 元,最高 {{bankcards.third_max_recharge_every_time}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <!-- <a class="top-up-submit" @click="onSubmit(3)" style="margin-top:60px;">立即充值</a> -->
            <el-button class="top-up-submit" @click="onSubmit(3)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.unionpay == true}" :disabled="submitDisable.unionpay">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- 银联快捷 END-->
          <!-- alipay_qr Start-->
          <div v-show='entrance.activeName === "alipay_qr"'>
            <div class="top-up-container item">
              <div class="container-row flex">
                <span class="exp">充值方式</span>
                <ul class="pay-way clearfix flex">
                  <li @click="qrToggle(index+1,item)" v-for="(item,index) in entrance.thirdLvList.options" :key="index" class="wxActive" :class="[{'active':entrance.thirdLvList.active === (index+1)}]" v-if="entrance.thirdLvList.allowed">
                    <i class="ali"></i>{{item.name}}
                  </li>
                  <li class="wxActive no-allowed" v-if="!entrance.thirdLvList.allowed">
                    <i class="ali"></i>支付宝充值
                  </li>
                  <!-- <li class="wxActive active">
                  <i class="ali"></i>支付宝充值
                </li> -->
                </ul>
              </div>
              <div class="container-row  mt-40">
                <span class="exp">充值金额</span>
                <el-input placeholder="请输入充值金额" type="number" class="content ml4" v-model.trim="form.cash_apply.value" clearable :disabled="!entrance.thirdLvList.allowed" />
                <span class="unit">元</span>
              </div>
              <div class="container-row  mt-20">
                <span class="exp"></span>
                <span class="top-up-limit ml4">充值额度限定：最低 {{bankcards.min_recharge_scan}} 元,最高 {{bankcards.max_recharge_scan}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <el-button class="top-up-submit" @click="onSubmit(5)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.alipay_qr == true}" :disabled="submitDisable.alipay_qr">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- alipay_qr End-->
          <!-- wechat_qr Start-->
          <div v-show='entrance.activeName === "wechat_qr"'>
            <div class="top-up-container item">
              <div class="container-row flex">
                <span class="exp">充值方式</span>
                <ul class="pay-way clearfix flex">
                  <li @click="qrToggle(index+1,item)" v-for="(item,index) in entrance.thirdLvList.options" :key="index" class="wxActive" :class="[{'active':entrance.thirdLvList.active === (index+1)}]" v-if="entrance.thirdLvList.allowed">
                    <i class="wx"></i>{{item.name}}
                  </li>
                  <li class="wxActive no-allowed" v-if="!entrance.thirdLvList.allowed">
                    <i class="wx"></i>微信充值
                  </li>
                  <!-- <li class="wxActive active">
                  <i class="wx"></i>微信充值
                </li> -->
                </ul>
              </div>
              <div class="container-row mt-40">
                <span class="exp">充值金额</span>
                <el-input placeholder="请输入充值金额" type="number" class="content ml4" v-model.trim="form.cash_apply.value" clearable :disabled="!entrance.thirdLvList.allowed"></el-input>
                <span class="unit">元</span>
              </div>
              <div class="container-row mt-20">
                <span class="exp"></span>
                <span class="top-up-limit ml4">充值额度限定：最低 {{bankcards.min_recharge_scan}} 元,最高 {{bankcards.max_recharge_scan}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <el-button class="top-up-submit" @click="onSubmit(4)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.wechat_qr == true}" :disabled="submitDisable.wechat_qr">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- wechat_qr End-->
          <!-- unionpay_qr Start-->
          <div v-show='entrance.activeName === "unionpay_qr"'>
            <div class="top-up-container item">
              <div class="container-row flex">
                <span class="exp">充值方式</span>
                <ul class="pay-way clearfix flex">
                  <!-- <li @click="qrToggle(index+1,item)" v-for="(item,index) in entrance.thirdLvList.options" :key="index" class="wxActive" :class="[{'active':entrance.thirdLvList.active === (index+1)}]">
                  <i class="ali"></i>{{item.bank}}
                </li> -->
                  <li class="wxActive active">
                    <i class="yl"></i>银联充值
                  </li>
                </ul>
              </div>
              <div class="container-row  mt-40">
                <span class="exp">充值金额</span>
                <el-input placeholder="请输入充值金额" type="number" class="content ml4" v-model.trim="form.cash_apply.value" clearable></el-input>
                <span class="unit">元</span>
              </div>
              <div class="container-row  mt-20">
                <span class="exp"></span>
                <span class="top-up-limit ml4">充值额度限定：最低 {{bankcards.third_min_recharge_every_time}} 元,最高 {{bankcards.third_max_recharge_every_time}} 元，单日充值总额无上限，充值无手续费</span>
              </div>
            </div>
            <!-- <a class="top-up-submit" @click="onSubmit(6)" style="margin-top:60px;">立即充值</a> -->
            <el-button class="top-up-submit" @click="onSubmit(6)" style="margin-top:60px;" v-if="entrance.thirdLvList.allowed" :class="{'no-allowed':submitDisable.unionpay_qr == true}" :disabled="submitDisable.unionpay_qr">立即充值</el-button>
            <a class="top-up-submit no-allowed" style="margin-top:60px;" v-if="!entrance.thirdLvList.allowed">立即充值</a>
          </div>
          <!-- unionpay_qr End-->
          <!-- dialog Start-->
          <el-dialog :visible.sync="dialogVisible" :before-close="dialogClose" class="qr-dialog dialog-class" width='500px'>
            <div slot='title' class="dialog-header">
              <span class="title">扫码充值</span>
              <i class="close" @click="dialogClose"></i>
            </div>
            <div class="qr-inner" v-if="!qrFinished">
              <p class="inner-title" v-if="entrance.activeName == 'alipay_qr'">请使用支付宝扫描二维码进行充值</p>
              <p class="inner-title" v-if="entrance.activeName == 'wechat_qr'">请使用微信扫描二维码进行充值</p>
              <div class="inner-image">
                <img :src="qr.base64" />
              </div>
              <div class="inner-row mb-10">
                <span class="important">交易账户：{{qr.account_no}}</span>
              </div>
              <div class="inner-row">
                <span class="important">交易单号：{{result.order_no}}</span>
              </div>
              <div class="tip">
                温馨提示:请您在扫码完成后，填写支付订单号
                <span style="color:#CC3447">后六</span>位，再关闭页面， 以免掉单! 扫码支付后，请点击提交按钮，提交充值申请!
              </div>
              <!-- <div class="dialog-footer">
                <a class="qr-submit" @click="makesureQR()">确认已充值</a>
              </div> -->
            </div>
            <div class="qr-inner" v-if="qrFinished">
              <div class="finished-icon"></div>
              <p class="finished-text">您的充值申请已提交，请等待系统审核。如果遇到问题 无法到账，请联系客服。</p>
              <!-- <div class="dialog-footer">
                <a class="qr-submit" @click="dialogClose()">返回</a>
              </div> -->
            </div>
            <div slot='footer' class="qr-inner">
              <a class="qr-submit" @click="makesureQR()" v-if="!qrFinished">确认已付款</a>
              <a class="qr-submit" @click="dialogClose()" v-if="qrFinished">返回</a>
            </div>
          </el-dialog>
          <!-- dialog End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserMenu from "./userMenu";
  import request from "../axios/axios";
  import * as validator from "../lib/utils/validator";
  import * as objectType from "../lib/utils/objectType";
  import paramCryptFn from "../lib/cryptData";
  import contractDialog from "./contractDialog/contractDialog.vue";

  export default {
    name: "topUp",
    components: {
      UserMenu,
      contractDialog
    },
    data() {
      return {
        submitDisable: {
          card: false,
          ebank: false,
          unionpay: false,
          wechat_qr: false,
          alipay_qr: false,
          unionpay_qr: false
        },
        bankcards: {
          max_recharge_every_time: 0, // 银行卡单笔最大充值
          min_recharge_every_time: 0, // 银行卡单笔最小
          max_recharge_scan: 0, // 扫码单笔最大
          min_recharge_scan: 0, // 扫码单笔最小
          third_max_recharge_every_time: 0, // 第三方单笔最大
          third_min_recharge_every_time: 0 // 第三方单笔最小
        },
        result: {},
        jeepayList: [], // jeepay list
        loading: false,
        // 保存 wechat_qr,alipay_qr的弹出框展示信息
        qr: {
          account_no: "",
          name: "",
          base64: ""
        },
        dialogVisible: false,
        qrFinished: false,
        payWays: {},
        //充值方式
        topUpType: {
          data: [
            { name: "快捷支付", type: "1", platform: "web" }, // 快捷支付
            { name: "扫码支付", type: "2", platform: "web" } // 扫码支付
          ],
          active: 1
        },
        //充值渠道
        entrance: {
          data: [],
          active: 0,
          activeName: "", // 比如 银行卡转账的 activeName 是 card
          // 三级列表获取
          thirdLvList: {
            visible: false,
            options: [],
            value: "",
            active: 0,
            allowed: true // 用于是否允许三级列表可被选中
          }
        },
        // 充值银行卡
        form: {
          // 存入金额
          cash_apply: {
            key: "cash_apply",
            iscard: true, // 银行卡转账
            iswechat_qr: true, // 微信扫码
            isalipay_qr: true, // 支付宝扫码
            isunionpay: true, // 银联快捷
            isebank: true, // 网银转账
            isunionpay_qr: true, //银联扫码
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "存入金额必填";
                this.error.visible = true;
                return false;
              }
              if (!validator.posPattern(value)) {
                this.error.message = "存入金额必须大于0";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          // 存入银行
          banks: {
            key: "bank",
            options: [],
            iscard: true,
            loading: false,
            loadingtext: "正在搜索...",
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "存款银行必填";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          type: {
            key: "type",
            iscard: true,
            isebank: true,
            isunionpay: true,
            isunionpay_qr: true,
            iswechat_qr: true,
            isalipay_qr: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          account: {
            key: "account",
            iscard: true,
            iswechat_qr: true,
            isalipay_qr: true,
            isebank: true,
            isunionpay: true,
            isunionpay_qr: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              this.error.visible = false;
              return true;
            }
          },
          bank_code: {
            key: "bank_code",
            isebank: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "充值银行必选";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          //存款人姓名
          realname: {
            key: "realname",
            iscard: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "存款人姓名必填";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          //存款卡号
          card_no: {
            key: "card_no",
            iscard: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "请填写存款卡号";
                this.error.visible = true;
                return false;
              }
              if (!validator.bankCard(value)) {
                this.error.message = "请填写正确的存款卡号";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          receiver: {
            key: "receiver",
            iscard: true,
            isalipay_qr: true,
            iswechat_qr: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "请选择公司入款银行";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          },
          receiver_no: {
            key: "receiver_no",
            iscard: true,
            isalipay_qr: true,
            iswechat_qr: true,
            value: "",
            getValue() {
              if (this.value) {
                return this.value;
              }
              return "";
            },
            reset() {
              this.value = null;
            },
            error: {
              visible: false,
              message: ""
            },
            verify: function(value) {
              if (!value) {
                value = this.value;
              }
              if (!value) {
                this.error.message = "请选择公司入款银行";
                this.error.visible = true;
                return false;
              }
              this.error.visible = false;
              return true;
            }
          }
        }
      };
    },
    methods: {
      cardFocus(event) {
        // this.$refs.cardInput.setAttribute("data-balloon-visible", "");
      },
      cashApplyChange(e) {
        // let value = this.form.cash_apply.value;
        // console.log('e', e);
        if (e) {
          // if ((/[\d]/.test(String.fromCharCode(value)))) {
          //   this.form.cash_apply.value = "";
          // }
          return /[\d]/.test(String.fromCharCode(e.keyCode));
        }
      },
      //获取充值的限额
      getWithdrawLimit() {
        let self = this;
        let url = "/user/trade/withdraw/config";
        self.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.loading = false;
            if (success.returncode) {
              if (success.returncode == 200) {
                if (success.data) {
                  self.bankcards.max_recharge_every_time =
                    success.data.max_recharge_every_time;
                  self.bankcards.min_recharge_every_time =
                    success.data.min_recharge_every_time;
                  self.bankcards.max_recharge_scan =
                    success.data.max_recharge_scan;
                  self.bankcards.min_recharge_scan =
                    success.data.min_recharge_scan;
                  self.bankcards.third_max_recharge_every_time =
                    success.data.third_max_recharge_every_time;
                  self.bankcards.third_min_recharge_every_time =
                    success.data.third_min_recharge_every_time;
                }
              } else if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.loading = false;
            self.$message({
              showClose: true,
              message: "系统出错，请联系管理员",
              type: "error"
            });
          }
        );
      },
      makesureQR() {
        this.qrFinished = true;
      },
      // close dialog
      dialogClose() {
        this.dialogVisible = false;
        this.qrFinished = false;
      },
      // 排序
      compare(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        };
      },
      //银行select获取焦点
      focusBank(event) {
        if (this.form.banks.options.length === 0) {
          this.getBankList();
        }
      },
      newWin(url, id) {
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", id);
        // 防止反复添加
        if (!document.getElementById(id)) {
          document.body.appendChild(a);
        }
        // console.log('a', 'hasSet');
        a.click();
      },
      // type:充值渠道
      // 1:card 2.ebank 3.unionpay 4.wechat_qr 5.alipay_qr 6.unionpay_qr
      onSubmit(type) {
        console.log("this");
        let validate = true;
        let data = {};
        let cash_apply = this.form.cash_apply.value;
        let self = this;
        switch (type) {
          case 1:
            self.submitDisable.card = true;
            setTimeout(() => {
              self.submitDisable.card = false;
            }, 1000);
            break;
          case 2:
            self.submitDisable.ebank = true;
            setTimeout(() => {
              self.submitDisable.ebank = false;
            }, 1000);
            break;
          case 3:
            self.submitDisable.unionpay = true;
            setTimeout(() => {
              self.submitDisable.unionpay = false;
            }, 1000);
            break;
          case 4:
            self.submitDisable.wechat_qr = true;
            setTimeout(() => {
              self.submitDisable.wechat_qr = false;
            }, 1000);
            break;
          case 5:
            self.submitDisable.alipay_qr = true;
            setTimeout(() => {
              self.submitDisable.alipay_qr = false;
            }, 1000);
            break;
          case 6:
            self.submitDisable.unionpay_qr = true;
            setTimeout(() => {
              self.submitDisable.unionpay_qr = false;
            }, 1000);
            break;
        }
        let errorMessage = "";
        for (let v in this.form) {
          if (this.form.hasOwnProperty(v)) {
            let obj = this.form[v];
            if (obj.visible === undefined || obj.visible) {
              if (type == 1) {
                if (!obj.iscard) {
                  continue;
                }
              } else if (type == 2) {
                if (!obj.isebank) {
                  continue;
                }
              } else if (type == 3) {
                if (!obj.isunionpay) {
                  continue;
                }
              } else if (type == 4) {
                if (!obj.iswechat_qr) {
                  continue;
                }
              } else if (type == 5) {
                if (!obj.isalipay_qr) {
                  continue;
                }
              } else if (type == 6) {
                if (!obj.isunionpay_qr) {
                  continue;
                }
              }
              if (v === "cash_apply") {
                let min = 0;
                let max = 0;
                if (type == 1) {
                  min = self.bankcards.min_recharge_every_time;
                  max = self.bankcards.max_recharge_every_time;
                } else if (type == 2 || type == 3 || type == 6) {
                  min = self.bankcards.third_min_recharge_every_time;
                  max = self.bankcards.third_max_recharge_every_time;
                } else if (type == 4 || type == 5) {
                  min = self.bankcards.min_recharge_scan;
                  max = self.bankcards.max_recharge_scan;
                }
                if (obj.value < min || obj.value > max) {
                  validate = false;
                  errorMessage =
                    "存入金额应在[" + min + "元]至[" + max + "元]之间";
                }
              }
              if (obj.verify !== undefined && !obj.verify()) {
                validate = false;
                errorMessage = obj.error.message;
              }
              if (obj.key) {
                if (obj.getValue) {
                  data[obj.key] = obj.getValue();
                } else if (obj.value) {
                  data[obj.key] = obj.value;
                }
              }
            }
          }
        }
        if (!validate) {
          self.$alert(
            "<div class='lottery-title'>" + errorMessage + "</div>",
            "系统提示",
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
              center: true,
              customClass: "syxw-wrap-inner",
              callback: action => {}
            }
          );
          return false;
        } else {
          self
            .$confirm("确定提交存款", "系统提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              console.log(data);
              let url = "/user/trade/recharge";
              var sendData = paramCryptFn(data);
              let newWindow;
              if (type == 2 || type == 3 || type == 6) {
                url = "/jeepay/recharge";
                newWindow = window.open();
                newWindow.document.write(
                  '<p id="win-p">正在跳转支付中，请勿关闭当前页面...</p>'
                );
              }
              self.loading = true;
              request.http(
                "post",
                url,
                sendData,
                success => {
                  self.loading = false;
                  if (success.returncode) {
                    if (
                      success.returncode == 103 ||
                      success.returncode == 106 ||
                      success.returncode == 101
                    ) {
                      request.loginAgain(self);
                    } else if (success.returncode == 200) {
                      self.result = success.data;
                      if (type == 1) {
                        self.$alert(
                          "<div class='lottery-title'>您的存款申请提交成功，我们会尽快审核！</div>",
                          "系统提示",
                          {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: "确定",
                            center: true,
                            customClass: "syxw-wrap-inner",
                            callback: action => {
                              self.form.cash_apply.value = "";
                              self.form.banks.value = "";
                              self.form.realname.value = "";
                              self.form.card_no.value = "";
                            }
                          }
                        );
                      } else if (type == 2 || type == 3 || type == 6) {
                        self.form.cash_apply.value = "";
                        // window.open(self.result.url, "_blank");
                        // console.log('newUrl', self.result.url);
                        // self.newWin(self.result.url, 'topup_id');
                        newWindow.location.href = self.result.url;
                      } else if (type == 4 || type == 5) {
                        self.form.cash_apply.value = "";
                        self.dialogVisible = true;
                        // console.log("data", success.data);
                      }
                    } else {
                      if (type == 2 || type == 3 || type == 6) {
                        // newWindow.document.write("<p id=\"win-p\">充值失败，请联系管理员</p>");
                        newWindow.document.getElementById("win-p").innerHTML =
                          "充值失败，请联系管理员";
                      } else {
                        self.$alert(
                          "<div class='lottery-title'>" +
                          success.data.msg +
                          "</div>",
                          "系统提示",
                          {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: "确定",
                            center: true,
                            customClass: "syxw-wrap-inner",
                            callback: action => {
                              self.form.cash_apply.value = "";
                            }
                          }
                        );
                      }
                    }
                  }
                },
                error => {
                  self.loading = false;
                  self.$alert(
                    "<div class='lottery-title'>您的存款申请提交失败，请联系客服！</div>",
                    "系统提示",
                    {
                      dangerouslyUseHTMLString: true,
                      confirmButtonText: "确定",
                      center: true,
                      customClass: "syxw-wrap-inner",
                      callback: action => {
                        if (type == 1) {
                          self.form.cash_apply.value = "";
                          self.form.banks.value = "";
                          self.form.realname.value = "";
                          self.form.card_no.value = "";
                        } else {
                          self.form.cash_apply.value = "";
                        }
                      }
                    }
                  );
                }
              );
            })
            .catch(() => {
              self.form.cash_apply.value = "";
            });
        }
      },
      // 充值方式切换
      topUpItemToggle(index) {
        this.topUpType.active = index;
        this.entrance.active = 0;
        this.entrance.thirdLvList.active = 1;
        this.form.type.value = "2";
        this.form.cash_apply.value = "";
      },
      // 重置dialog
      resetdialog() {
        this.form.cash_apply = "";
        this.qr = null;
      },
      // 充值渠道切换
      entranceToggle(index, entranceName, account) {
        this.resetForm();
        this.entrance.active = index;
        this.entrance.activeName = entranceName;
        this.form.type.value = "";
        this.form.cash_apply.value = "";
        if (entranceName === "card") {
          this.entrance.thirdLvList.options = account;
          this.entrance.thirdLvList.active = 1;
          this.form.type.value = "3";
        } else if (entranceName === "ebank") {
          this.entrance.thirdLvList.options = this.jeepayList;
          this.entrance.thirdLvList.active = 0;
          this.form.type.value = "1";
          if (account.length != 0) {
            this.form.account.value = account[0]._id;
          } else {
            this.entrance.thirdLvList.options = [];
          }
        } else if (entranceName === "unionpay") {
          this.form.type.value = "13";
          if (account.length != 0) {
            this.form.account.value = account[0]._id;
          } else {
            this.entrance.thirdLvList.options = [];
          }
        } else if (entranceName === "alipay_qr") {
          this.form.type.value = "2";
          if (account.length != 0) {
            this.entrance.thirdLvList.options = account;
            this.qr = {
              account_no: account[0].account_no,
              name: account[0].name,
              base64: account[0].qr_code
            };
            this.form.receiver_no.value = account[0].account_no;
            this.form.receiver.value = account[0].name;
            this.form.account.value = account[0]._id;
          } else {
            this.entrance.thirdLvList.options = [];
          }
          this.entrance.thirdLvList.active = 1;
        } else if (entranceName === "wechat_qr") {
          this.entrance.thirdLvList.active = 1;
          this.form.type.value = "1";
          if (account.length != 0) {
            this.entrance.thirdLvList.options = account;
            this.qr = {
              account_no: account[0].account_no,
              name: account[0].name,
              base64: account[0].qr_code
            };
            this.form.receiver_no.value = account[0].account_no;
            this.form.receiver.value = account[0].name;
            this.form.account.value = account[0]._id;
          } else {
            this.entrance.thirdLvList.options = [];
          }
        } else if (entranceName === "unionpay_qr") {
          this.form.type.value = "11";
          if (account.length != 0) {
            this.form.account.value = account[0]._id;
          } else {
            this.entrance.thirdLvList.options = [];
          }
        }
      },
      resetForm() {
        if (this.entrance.activeName === "card") {
          this.entrance.thirdLvList.value = "";
        }
        this.entrance.thirdLvList.active = 1;
        const vm = this;
        for (let i in vm.form) {
          // console.log("i", i);
          if (i === "type") {
            continue;
          }
          vm.form[i].reset();
        }
      },
      // 三级列表 切换
      thirdLvToggle(index, realname, account_no) {
        this.entrance.thirdLvList.active = index;
      },
      // 三级列表 切换 （ebank,unionpay,unionpay_qr）
      jeepayToggle(index, code) {
        this.entrance.thirdLvList.active = index;
        this.form.bank_code.value = code;
      },
      // 三级列表 切换 （wechat_qr,alipay_qr）
      qrToggle(index, item) {
        this.entrance.thirdLvList.active = index;
        this.qr = {
          account_no: item.account_no,
          name: item.name,
          base64: item.qr_code
        };
      },
      // 获取第三级列表 （银行卡列表）
      getthirdLvList(platform, type) {
        let self = this;
        self.entrances = [];
        let url = "/user/trade/recharge/account";
        self.loading = true;
        request.http(
          "get",
          url,
          {
            platform: platform,
            type: type
          },
          success => {
            self.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                let data = success.data;
                // console.log("data", data);
                if (data.length != 0) {
                  data.sort(self.compare("order"));
                  // console.log("sort", data);
                  for (let i = 0; i < data.length; i++) {
                    let randomData = data[i].account;
                    let final = [];
                    if (randomData.length != 0) {
                      let index =
                        Math.floor(Math.random() * randomData.length + 1) - 1;
                      // console.log('index', index);
                      final.push(randomData[index]);
                      data[i].account = final;
                    }
                  }
                  self.entrance.data = data;
                  self.entrance.activeName = data[0].code;
                  if (data[0].account.length != 0) {
                    self.entrance.thirdLvList.options = data[0].account;
                  } else {
                    self.entrance.thirdLvList.options = [];
                  }
                  let name = self.entrance.activeName;
                  if (name === "card") {
                    self.form.type.value = "3";
                  } else if (name === "ebank") {
                    self.form.type.value = "1";
                    self.form.account.value = data[0].account[0]._id;
                  } else if (name === "unionpay") {
                    self.form.type.value = "13";
                    self.form.account.value = data[0].account[0]._id;
                  } else if (name === "alipay_qr") {
                    self.form.type.value = "2";
                    if (data[0].account.length != 0) {
                      self.qr = {
                        account_no: data[0].account[0].account_no,
                        name: data[0].account[0].name,
                        base64: data[0].account[0].qr_code
                      };
                      self.form.receiver_no.value = data[0].account[0].account_no;
                      self.form.receiver.value = data[0].account[0].name;
                      self.form.account.value = data[0].account[0]._id;
                    }
                  } else if (name === "wechat_qr") {
                    self.form.type.value = "1";
                    if (data[0].account.length != 0) {
                      self.qr = {
                        account_no: data[0].account[0].account_no,
                        name: data[0].account[0].name,
                        base64: data[0].account[0].qr_code
                      };
                      self.form.receiver_no.value = data[0].account[0].account_no;
                      self.form.receiver.value = data[0].account[0].name;
                      self.form.account.value = data[0].account[0]._id;
                    }
                  } else if (name === "unionpay_qr") {
                    self.form.type.value = "11";
                    self.form.account.value = data[0].account[0]._id;
                  }
                }
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.$alert(
              "<div class='lottery-title'>获取充值通道失败,请联系管理员</div>",
              "系统提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                center: true,
                customClass: "syxw-wrap-inner",
                callback: action => {
                  self.loading = false;
                }
              }
            );
          }
        );
      },
      //获取银行卡列表
      getBankList() {
        let self = this;
        let url = "/user/bank/list";
        this.form.banks.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.form.banks.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                self.form.banks.options = success.data.banks;
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.form.banks.loading = false;
            console.log("数据异常", error);
          }
        );
      },
      //获取银联快捷列表
      getJeepayList() {
        let self = this;
        let url = "/jeepay/bank/list";
        this.loading = true;
        request.http(
          "get",
          url, {},
          success => {
            self.loading = false;
            if (success.returncode) {
              if (
                success.returncode == 103 ||
                success.returncode == 106 ||
                success.returncode == 101
              ) {
                request.loginAgain(self);
              } else if (success.returncode == 200) {
                let data = success.data;
                let final = [];
                if (data.length != 0) {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].disabled == 1) {
                      continue;
                    }
                    final.push(data[i]);
                  }
                  self.jeepayList = final;
                } else {
                  self.jeepayList = [];
                }
              } else {
                self.$message({
                  showClose: true,
                  message: success.returncode,
                  type: "error"
                });
              }
            }
          },
          error => {
            self.loading = false;
            self.jeepayList = [];
            console.log("数据异常", error);
          }
        );
      },
      formatNo(val) {
        if (val) {
          return validator.trim(val).replace(/(.{4})/g, "$1-");
        }
        return "";
      },
      formatCash(val) {
        if (val) {
          return validator.trim(val);
        }
        return "";
      },
      getBankBg(uid) {
        let classText = "";
        switch (uid) {
          case "ICBC":
            classText = "zggs";
            break;
          case "CCB":
            classText = "zgjs";
            break;
          case "SPDB":
            classText = "pf";
            break;
          case "ABC":
            classText = "zgny";
            break;
          case "CIB":
            classText = "xy";
            break;
          case "CGB":
            classText = "gf";
            break;
          case "CEB":
            classText = "zggd";
            break;
          case "HXB":
            classText = "hx";
            break;
          case "BOC":
            classText = "zg";
            break;
          case "CMS":
            classText = "zs";
            break;
          case "CMBC":
            classText = "zgms";
            break;
          case "COMM":
            classText = "jt";
            break;
          case "BOB":
            classText = "bj";
            break;
          case "PSBC":
            classText = "zgyzcx";
            break;
        }
        return classText;
      }
    },
    watch: {
      "form.cash_apply.value"(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue) {
            if (!validator.posPattern(newValue)) {
              this.form.cash_apply.value = "";
            }
          }
        }
      },
      "topUpType.active"(newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue) {
            this.getthirdLvList("web", newValue);
          }
        }
      },
      "entrance.thirdLvList.value"(newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue) {
            this.form.receiver.value = newValue.realname;
            this.form.receiver_no.value = newValue.account_no;
            this.form.account.value = newValue._id;
          }
        }
      },
      "entrance.thirdLvList.options"() {
        let options = this.entrance.thirdLvList.options;
        if (options.length != 0) {
          this.entrance.thirdLvList.allowed = true;
        } else {
          this.entrance.thirdLvList.allowed = false;
        }
      }
    },
    mounted() {
      this.getWithdrawLimit();
      this.getJeepayList();
      this.getthirdLvList("web", 1);
    },
    created() {
      this.$store.dispatch("setbodyBG", "no-bg");
      localStorage.setItem("bodyBG", "no-bg");
    }
  };
</script>
<style lang="scss">
  .search-form .qr-dialog {
    .dialog-header {
      width: 500px;
    }

    .dialog-class {
      width: 500px;
      padding: 20px 0 0;
      overflow: hidden;
    }
  }

  .win-p {
    text-align: left;
    margin: 20px 0 0 20px;
  }

  .top-up-wrap {
    .el-radio__label {
      padding: 0;

      .radio-row {
        margin-bottom: 20px;
        line-height: 17px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .el-radio__input {
      position: absolute;
      right: 20px;
      bottom: 20px;
      display: block;
      width: 20px;
      height: 20px;

      &.is-checked {
        .el-radio__inner {
          background: url("../assets/img/topUp/CheckBox@3x.png") no-repeat;
          background-size: cover;
          border: none;
        }
      }

      .el-radio__inner {
        width: 100%;
        height: 100%;
        background: url("../assets/img/topUp/Rectangle9@3x_2.png") no-repeat;
        background-size: cover;
        border: none;

        &:after {
          content: none;
        }
      }
    }

    .el-input__inner {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #191919;
      font-weight: bold;
    }

    .el-input__inner::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #bcbcbc;
      font-weight: bold;
      font-size: 14px;
    }

    .el-input__inner:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #bcbcbc;
      font-weight: bold;
      font-size: 14px;
    }

    .el-input__inner::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #bcbcbc;
      font-weight: bold;
      font-size: 14px;
    }

    .el-input__inner:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #bcbcbc;
      font-weight: bold;
      font-size: 14px;
    }

    .el-input.ml4 {
      margin-left: -4px;
    }

    .container-row .el-select {
      height: 40px;
      line-height: 40px;
    }
  }
</style>
<style scoped lang="scss">
  .card-input {
    position: relative;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    font-family: MicrosoftYaHei;
    color: #191919;
    height: 40px;
    line-height: 40px;
    width: auto;
  }

  .no-allowed {
    cursor: not-allowed !important;
  }

  .qr-inner {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #191919;

    .dialog-footer {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
    }

    .finished-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      margin-top: 90px;
      margin-bottom: 30px;
      background: url("../assets/img/topUp/Shape@3x.png") no-repeat;
      background-size: cover;
    }

    .finished-text {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #191919;
      text-align: center;
      width: 384px;
      margin: 0 auto;
    }

    .inner-title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #191919;
      text-align: center;
    }

    .inner-image {
      width: 240px;
      height: 240px;
      margin: 30px auto;

      >img {
        width: 100%;
        height: 100%;
      }
    }

    .inner-row {
      width: 100%;
      text-align: center;

      .important {
        font-weight: 700;
        text-align: left;
        min-width: 200px;
        display: inline-block;
      }

      .mb-10 {
        margin-bottom: 10px;
      }
    }

    .tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #777777;
      line-height: 18px;
      width: 420px;
      margin: 20px auto 30px;
    }

    .qr-submit {
      width: 115px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      background: #cc3447;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 auto;
    }
  }

  .project-content {
    padding: 20px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mb-30 {
    margin-bottom: 30px;
  }

  .user-split-line {
    background: #ddd;
    width: 100%;
    height: 1px;
    border: none;
    margin-bottom: 30px;
  }

  .wrap-inner {
    min-height: 731px;
    color: #333333;
    width: 100%;
    padding: 30px 20px;
    border: 1px solid #ddd;

    .inner-pay-title {
      text-align: left;
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 16px;
      color: #191919;
    }

    .inner-pay-ways {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      >li {
        margin-right: 20px;
        list-style: none;
        width: 128px;
        height: 40px;
        font-family: PingFangSC-Regular;
        color: #191919;
        cursor: pointer;
        padding: 10px 20px;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 2px;
        position: relative;
        font-size: 14px;
        font-weight: bold;

        &:last-child {
          margin-right: 0;
        }

        &.active {
          color: #cc3447;
          background: #ffffff;
          border: 2px solid #cfa072;
          border-radius: 2px;
          font-size: 14px;
          color: #cfa072;
          font-weight: bold;
          line-height: 18px;
        }

        &.active:after {
          position: absolute;
          right: 0;
          bottom: 0;
          background-image: url("../assets/img/topUp/icon_CheckNumber@3x.png");
          background-repeat: no-repeat;
          background-size: cover;
          width: 22px;
          height: 22px;
          display: block;
          content: "";
        }
      }
    }
  }

  .tabs {
    /* height: 42px;
    line-height: 42px; */
    height: 40px;
    line-height: 40px;
    /* background: rgba(255, 247, 240, 1); */
    display: flex;
    /* border-bottom: 1px solid #DADADA; */
  }

  .tabs .tab-title {
    width: 100px;
    background: #d8d8d8;
    color: #191919;
    margin-right: 20px;
    text-align: center;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    cursor: pointer;
    position: relative;
    border-radius: 2px 2px 0 0;
    border: 1px solid #ddd;
  }

  .tabs .tab-title>a {
    font-size: 14px;
    color: #191919;
    outline: none;
    text-decoration: none;
  }

  .tabs .tab-title:hover>a {
    color: #847b5f;
  }

  .tabs .tab-title.active>a {
    color: #bd8454;
  }

  .tabs .tab-title.active {
    color: #bd8454;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px 2px 0 0;
    border-bottom: none;
  }

  /* .tabs .tab-title:after {
    content: '';
    height: 8px;
    background: rgba(222, 222, 222, 1);
    position: absolute;
    right: 0;
    top: 17px;
    width: 1px;
  } */

  .tabs .tab-title a {
    display: block;
  }

  .top-up-bottom-tip {
    text-align: left;
    font-size: 12px;
    margin-bottom: 30px;
  }

  .top-up-bottom-tip .tip-title {
    font-family: PingFangSC-Regular;
    font-weight: 700;
    font-size: 14px;
    color: #191919;
    margin-bottom: 20px;
    display: inline-block;
  }

  .top-up-bottom-tip .tip-content {
    line-height: 20px;
  }

  .large-tip {
    text-align: left;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .lh-22 {
    line-height: 22px;
  }

  .flex {
    display: flex;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .recharge-wrap {
    text-align: left;
    font-size: 12px;
    margin-bottom: 30px;

    .title {
      font-family: PingFangSC-Regular;
      font-weight: 700;
      font-size: 14px;
      color: #191919;
      margin-bottom: 20px;
      display: inline-block;
    }

    .recharge-bank {
      width: 424px;
      height: 168px;
      background: #ffffe1;
      border: 1px solid #dddddd;
      margin-right: 10px;
      padding: 20px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;

      .exp {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #191919;
        min-width: 76px;
        text-align: justify;
        text-align-last: justify;
        display: inline-block;
      }

      .content {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #191919;
      }
    }
  }

  .mt-40 {
    margin-top: 40px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  a {
    cursor: pointer;
  }

  ul,
  li {
    list-style: none;
  }

  table,
  td {
    border-collapse: collapse;
  }

  .order-detail-wrap {
    position: relative;
    font-family: MicrosoftYaHei;
    color: #333333;
    margin: 0 auto;
    width: 1090px;
  }

  .main {
    width: 1024px;
    min-height: 600px;
    background: #fff;
    margin: 0 auto;
  }

  .main .top-bar {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    /* border-bottom: 1px solid #DADADA; */
    /* padding-left: 20px; */
    padding: 30px 20px 0;
    text-align: left;
  }

  .main .top-bar>i {
    margin: 0 12px;
    font-size: 12px;
  }

  .main>ul.top-up-way {}

  .main>ul.top-up-way>li {
    width: 134px;
    height: 37px;
    border: 1px solid #d5d5d5;
    background-image: url("../assets/img/topUp/Selected.png");
    float: left;
    cursor: pointer;
    background-size: 600%;
  }

  .main>ul.top-up-way>li.active {
    background-image: url("../assets/img/topUp/Unselected.png");
  }

  .main>ul.top-up-way>li.wykj {
    background-position: 0 0;
  }

  .main>ul.top-up-way>li.ylkj {
    background-position: -134px 0;
  }

  .main>ul.top-up-way>li.smcz {
    background-position: -268px 0;
  }

  .main>ul.top-up-way>li.wxcz {
    background-position: -402px 0;
  }

  .main>ul.top-up-way>li.qqqb {
    background-position: -536px 0;
  }

  .main>ul.top-up-way>li.zfb {
    background-position: -670px 0;
  }

  .top-up-tip {
    background: rgba(255, 228, 200, 1);
    text-align: left;
    font-size: 12px;
    line-height: 42px;
    text-indent: 16px;
    margin-bottom: 26px;
  }

  .top-up-input {
    display: inline-block;
    width: 316px;
    height: 48px;
    line-height: 48px;
    padding: 16px;
    outline: none;
    border: 1px solid #999799;
  }

  .top-up-input:focus {
    background: rgba(255, 255, 255, 1);
  }

  .top-up-container {
    text-align: left;
  }

  .top-up-container .container-row .exp {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    line-height: 20px;
    margin-right: 20px;
    display: inline-block;
    text-align: left;
    min-width: 86px;
    font-weight: bold;
    color: #191919;
  }

  .top-up-submit {
    width: 140px;
    height: 48px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 auto;
    background-image: linear-gradient(-180deg, #cfa072 0%, #b68e66 100%);
    border: 1px solid #dddddd;
    border-radius: 2px;

    &.no-allowed {
      background-color: #f5f7fa;
      color: #c0c4cc;
      border: 1px solid #e4e7ed;
    }
  }

  a.top-up-submit {
    line-height: 48px;
  }

  .top-up-container .container-row .unit {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #191919;
    line-height: 20px;
    margin-left: 5px;
    display: inline-block;
    text-align: center;
    font-weight: bold;
  }

  .top-up-container .container-row .top-up-limit {
    color: #666666;
    font-size: 12px;
    text-align: left;
    display: inline-block;

    &.ml4 {
      margin-left: -4px;
    }
  }

  .top-up-container .container-row ul.banklist {
    box-sizing: border-box;
  }

  .top-up-container .container-row ul.banklist>li {
    float: left;
    margin-right: 10px;
    margin-bottom: 9px;
    width: 160px;
    height: 44px;
    cursor: pointer;
    background-size: 100% 100%;
    position: relative;
  }

  .top-up-container .container-row ul.banklist>li.active {
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

    .li-inner-border {
      border: 2px solid #cfa072;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 2px;
    }
  }

  .top-up-container .container-row ul.banklist>li.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-image: url("../assets/img/topUp/icon_CheckNumber@3x.png");
    background-size: cover;
    width: 24px;
    height: 24px;
    display: block;
    content: "";
  }

  .top-up-container .container-row ul.banklist>li.zggs {
    // background-position: 0 0;
    background-image: url("../assets/img/topUp/bank_zggs.png");
  }

  .top-up-container .container-row ul.banklist>li.zs {
    // background-position: -174px 0;
    background-image: url("../assets/img/topUp/bank_zs.png");
  }

  .top-up-container .container-row ul.banklist>li.zgms {
    // background-position: -348px 0;
    background-image: url("../assets/img/topUp/bank_zgms.png");
  }

  .top-up-container .container-row ul.banklist>li.zgjs {
    // background-position: -522px 0;
    background-image: url("../assets/img/topUp/bank_zgjs.png");
  }

  .top-up-container .container-row ul.banklist>li.zgny {
    // background-position: -696px 0;
    background-image: url("../assets/img/topUp/bank_zgny.png");
  }

  .top-up-container .container-row ul.banklist>li.zg {
    // background-position: 0 -206px;
    background-image: url("../assets/img/topUp/bank_zg.png");
  }

  .top-up-container .container-row ul.banklist>li.gf {
    // background-position: -174px -360px;
    background-image: url("../assets/img/topUp/bank_gf.png");
  }

  .top-up-container .container-row ul.banklist>li.zx {
    // background-position: -348px -360px;
    background-image: url("../assets/img/topUp/bank_zx.png");
  }

  .top-up-container .container-row ul.banklist>li.zggd {
    // background-position: -522px -360px;
    background-image: url("../assets/img/topUp/bank_zggd.png");
  }

  .top-up-container .container-row ul.banklist>li.jt {
    // background-position: -696px -360px;
    background-image: url("../assets/img/topUp/bank_jt.png");
  }

  .top-up-container .container-row ul.banklist>li.zgyzcx {
    // background-position: 0 -719px;
    background-image: url("../assets/img/topUp/bank_zgyzcx.png");
  }

  .top-up-container .container-row ul.banklist>li.pf {
    // background-position: -174px -719px;
    background-image: url("../assets/img/topUp/bank_pf.png");
  }

  .top-up-container .container-row ul.banklist>li.pa {
    // background-position: -348px -719px;
    background-image: url("../assets/img/topUp/bank_pa.png");
  }

  .top-up-container .container-row ul.banklist>li.xy {
    // background-position: -522px -719px;
    background-image: url("../assets/img/topUp/bank_xy.png");
  }

  .top-up-container .container-row ul.banklist>li.hx {
    // background-position: -696px -719px;
    background-image: url("../assets/img/topUp/bank_hx.png");
  }

  .top-up-container .container-row ul.banklist>li.bj {
    // background-position: -696px -719px;
    background-image: url("../assets/img/topUp/bank_bj.png");
  }

  .top-up-container .container-row .wxActive {
    width: 160px;
    height: 44px;
    margin-right: 20px;
    line-height: 44px;
    cursor: pointer;
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #191919;

    &.no-allowed {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .top-up-container .container-row .wxActive.active {
    border-color: #c83a4c;
    border: 2px solid #cfa072;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .top-up-container .container-row .wxActive>i {
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

  .top-up-container .container-row .wxActive .wx {
    background-image: url("../assets/img/topUp/wx.png");
    width: 25px;
    height: 22px;
  }

  .top-up-container .container-row .wxActive .ali {
    background-image: url("../assets/img/topUp/ali.png");
    width: 25px;
    height: 25px;
  }

  .top-up-container .container-row .wxActive .yl {
    background-image: url("../assets/img/topUp/yl.png");
    width: 38px;
    height: 24px;
  }

  .top-up-container .container-row .wxActive.active::after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/icon_CheckNumber@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 24px;
    display: block;
    content: "";
  }

  .pay-tip {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    text-align: left;
  }

  ul.pay-way {
    /* margin-top: 16px;
    margin-bottom: 60px; */
  }

  ul.pay-way>li {
    width: 160px;
    height: 44px;
    margin-right: 42px;
    float: left;
    border: 1px solid #dedede;
    line-height: 44px;
    cursor: pointer;
    position: relative;
    font-size: 14px;
  }

  ul.pay-way>li.active {
    border-color: #d4914d;
    box-shadow: 5px 3px 6px rgba(103, 66, 2, 0.25);
  }

  ul.pay-way>li.active:after {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../assets/img/topUp/Checkmark.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 24px;
    height: 21px;
    display: block;
    content: "";
  }

  ul.pay-list>li {
    width: 128px;
    height: 40px;
    margin-right: 20px;
    float: left;
    line-height: 40px;
    cursor: pointer;
    position: relative;
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    color: #191919;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    .kj {
      background-image: url("../assets/img/topUp/kj.png");
      height: 16px;
      width: 20px;
    }

    .sm {
      background-image: url("../assets/img/topUp/sm.png");
      height: 18px;
      width: 18px;
    }

    &.active {
      font-family: PingFangSC-Regular;
      color: #ffffff;
      background-image: linear-gradient(-180deg, #cfa072 0%, #b68e66 100%);
      border: 1px solid #dddddd;
      border-radius: 2px;
      font-weight: bold;
      font-size: 14px;

      .kj {
        background-image: url("../assets/img/topUp/kj_active.png");
        height: 16px;
        width: 20px;
      }

      .sm {
        background-image: url("../assets/img/topUp/sm_active.png");
        height: 18px;
        width: 18px;
      }
    }

    >i {
      display: inline-block;
      background-size: cover;
      background-repeat: no-repeat;
      margin-right: 10px;
    }
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
</style>