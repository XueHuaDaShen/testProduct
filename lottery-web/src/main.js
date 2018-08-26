// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import store from './vuex/store'
import router from './router'
import './lib/icon-font/iconfont.css'
import './scss/search.scss'
import animate from 'animate.css'
import './scss/element-variables.scss'

Vue.use(ElementUI)
Vue.use(animate)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})