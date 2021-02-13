import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 样式
import 'style/index.css'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  loading: require('images/lazyload.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
