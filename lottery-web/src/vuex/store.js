import Vuex from 'vuex'
import Vue from 'vue'

const state = {
  bets: 0,
  price: 2,
  refund: 0,
  blance: 0,
  bodyBG: '',
  clearBetsNum: false,
  lotteryArr: [], // 彩票列表数据源,
  isSetBankPassword: 0, // 是否设置资金密码
  userProfile: {}, // 用户信息
  oprate_index_hor: {}, // 操作按钮 水平 index
  oprate_index_ver: {} // 操作按钮 垂直 index
}
// console.log(state)
const mutations = {
  changeBets(state, bets) {
    state.bets = bets
  },
  userRefund(state, refund) {
    state.refund = refund
  },
  userBlance(state, blance) {
    state.blance = blance
  },
  bodyBG(state, bodyBG) {
    state.bodyBG = bodyBG
  },
  clearBetsNum(state, clearBetsNum) {
    state.clearBetsNum = clearBetsNum
  },
  // 同步提交lotteryArr
  changeLotteryArr(state, lotteryArr) {
    state.lotteryArr = lotteryArr
  },
  changeBankPassword(state, isSetBankPassword) {
    state.isSetBankPassword = isSetBankPassword
  },
  changeUserProfile(state, userProfile) {
    state.userProfile = userProfile
  },
  changeOprateIndexHor(state, oprate_index_hor) {
    state.oprate_index_hor = oprate_index_hor
  },
  changeOprateIndexVer(state, oprate_index_ver) {
    state.oprate_index_ver = oprate_index_ver
  }
}

const getters = {
  lotteryArr: state => {
    return state.lotteryArr.filter(lotteryArr => lotteryArr)
  }
}

const actions = {
  setBets({ commit }, bets) {
    commit('changeBets', bets)
  },
  setRefund({commit}, refund) {
    commit('userRefund', refund)
  },
  setBlance({commit}, blance) {
    commit('userBlance', blance)
  },
  setbodyBG({commit}, bodyBG) {
    commit('bodyBG', bodyBG)
  },
  setclearBetsNum({commit}, clearBetsNum) {
    commit('clearBetsNum', clearBetsNum)
  },
  // 异步提交lotteryArr
  setLotteryArr({ commit }, lotteryArr) {
    commit('changeLotteryArr', lotteryArr)
  },
  setBankPassword({ commit }, isSetBankPassword) {
    commit('changeBankPassword', isSetBankPassword)
  },
  setUserProfile({ commit }, userProfile) {
    commit('changeUserProfile', userProfile)
  },
  setOprateIndexHor({ commit }, oprate_index_hor) {
    commit('changeOprateIndexHor', oprate_index_hor)
  },
  setOprateIndexVer({ commit }, oprate_index_ver) {
    commit('changeOprateIndexVer', oprate_index_ver)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
