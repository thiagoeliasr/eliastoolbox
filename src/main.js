import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import wb from "./registerServiceWorker";

import {VueMasonryPlugin} from 'vue-masonry';
import Clipboard from 'v-clipboard'

Vue.use(VueMasonryPlugin)
Vue.use(Clipboard)

Vue.config.productionTip = false
Vue.prototype.$workbox = wb;

export const EventBus = new Vue();

new Vue({
  render: h => h(App),
 iconfont: 'fa'
}).$mount('#app')
