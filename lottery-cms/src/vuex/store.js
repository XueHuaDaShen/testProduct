import Vuex from 'vuex'
import Vue from 'vue'

const state = {
  menus: []
}
// console.log(state)
const mutations = {
  changeMenus (state, menus) {
    state.menus = menus
  }
}

const getters = {
  lotteryArr: state => {
    return state.lotteryArr.filter(lotteryArr => lotteryArr)
  }
}

const actions = {
  setMenus ({ commit }, menus) {
    commit('changeMenus', menus)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
