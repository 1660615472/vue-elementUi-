import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
