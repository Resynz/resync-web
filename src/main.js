import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from "element-ui"
import './theme/index.css'
Vue.use(Element);

// use network handler
import {NetworkHandler} from 'resynz-vue-network-handler';
import apiConfig from './configs/api';
Vue.use(NetworkHandler,apiConfig);

// use global function
import GlobalFunction from "./utils/GlobalFunction";
Vue.use(GlobalFunction);

// use listener
import Listener from 'resynz-vue-listener';
Vue.use(Listener);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
