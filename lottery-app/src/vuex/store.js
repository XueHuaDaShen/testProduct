import Vuex from 'vuex'
import Vue from 'vue'

const state = {
  showLoading: false, // 加载动画
  showHeader: true, // 设置header的z-index值
  bets: 0, // 注数
  price: 2, // 单价
  blance: 0, // 余额
  multiple: 1, // 倍数
  refundArr: [], // 返点数组
  issue: '', // 当前期数
  title: '首页', // 头部标题
  showBack: false, // 是否显示后退箭头
  showPlayMode: false, // 是否显示右侧玩法选择按钮
  showCleanBtn: '', // 是否显示头部右侧清空按钮
  playName: [], // 玩法标题
  showFooter: true, // 是否显示底部导航
  playData: [], // 玩法数据 玩法选择弹框的 渲染数据
  betsData: {}, // 投注数据 投注按钮的 渲染数据
  showLotteryComponents: false, // 选中的注数数据
  shoppingCartData: [] // 购彩篮中的数据
}
// console.log(state)
const mutations = {
  changeLoading (state, showLoading) {
    state.showLoading = showLoading
  },
  changeHeader (state, showHeader) {
    state.showHeader = showHeader
  },
  changeBets (state, bets) {
    state.bets = bets
  },
  userBlance (state, blance) {
    state.blance = blance
  },
  changeMultiple (state, multiple) {
    state.multiple = multiple
  },
  changeRefundArr (state, refundArr) {
    state.refundArr = refundArr
  },
  changeIssue (state, issue) {
    state.issue = issue
  },
  changeTitle (state, title) {
    state.title = title
  },
  changeFooterStatus (state, showFooter) {
    state.showFooter = showFooter
  },
  changeBackStatus (state, showBack) {
    state.showBack = showBack
  },
  changePlayModeStatus (state, showPlayMode) {
    state.showPlayMode = showPlayMode
  },
  changeCleanBtn (state, showCleanBtn) {
    state.showCleanBtn = showCleanBtn
  },
  changePlayName (state, playName) {
    state.playName = playName
  },
  changePlayData (state, playData) {
    state.playData = playData
  },
  changeBetsData (state, betsData) {
    state.betsData = betsData
  },
  changeShowLotteryComponents (state, showLotteryComponents) {
    state.showLotteryComponents = showLotteryComponents
  },
  changeShoppingCartData (state, shoppingCartData) {
    state.shoppingCartData = shoppingCartData
  }
}

const getters = {
  //
}

const actions = {
  // header的z-index值
  setLoading ({ commit }, showLoading) {
    commit('changeLoading', showLoading)
  },
  // header的z-index值
  setHeader ({ commit }, showHeader) {
    commit('changeHeader', showHeader)
  },
  // 投注数
  setBets ({ commit }, bets) {
    commit('changeBets', bets)
  },
  // 用户余额
  setBlance ({commit}, blance) {
    commit('userBlance', blance)
  },
  // 倍数
  setMultiple ({ commit }, multiple) {
    commit('changeMultiple', multiple)
  },
  // 返点数组
  setRefurnArr ({ commit }, refundArr) {
    commit('changeRefundArr', refundArr)
  },
  // 期数
  setIssue ({ commit }, issue) {
    commit('changeIssue', issue)
  },
  // 头部标题
  setTitle ({ commit }, title) {
    commit('changeTitle', title)
  },
  // 页脚 显示、隐藏
  setFooterStatus ({ commit }, showFooter) {
    commit('changeFooterStatus', showFooter)
  },
  // 后退按钮 显示、隐藏
  setBackStatus ({ commit }, showBack) {
    commit('changeBackStatus', showBack)
  },
  // 玩法按钮 显示、隐藏
  setPlayModeStatus ({ commit }, showPlayMode) {
    commit('changePlayModeStatus', showPlayMode)
  },
  // 头部右侧清空按钮 显示、隐藏
  setCleanBtn ({ commit }, showCleanBtn) {
    commit('changeCleanBtn', showCleanBtn)
  },
  // 玩法标题
  setPlayName ({ commit }, playName) {
    commit('changePlayName', playName)
  },
  // 玩法数据 玩法选择弹框的 渲染数据
  setPlayData ({ commit }, playData) {
    commit('changePlayData', playData)
  },
  // 投注数据 投注按钮的 渲染数据
  setBetsData ({ commit }, betsData) {
    commit('changeBetsData', betsData)
  },
  // 投注模块状态
  setShowLotteryComponents ({ commit }, showLotteryComponents) {
    commit('changeShowLotteryComponents', showLotteryComponents)
  },
  // 购彩篮中的数据
  setShoppingCartData ({ commit }, shoppingCartData) {
    commit('changeShoppingCartData', shoppingCartData)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
