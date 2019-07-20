import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'

import {VueMasonryPlugin} from 'vue-masonry';
Vue.use(VueMasonryPlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
 iconfont: 'fa'
}).$mount('#app')