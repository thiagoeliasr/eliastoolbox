import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
 iconfont: 'fa'
}).$mount('#app')