import Vue from 'vue'
import Vuex from 'vuex'
import {StoreEnums} from "../configs/store";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
  },
  mutations: {
    InitToken () {
      this.token = localStorage.getItem('token') || null
    },
    CleanToken () {
      this.token = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    UpdateToken ({commit},token) {
      if (!token) {
        return null;
      }
      localStorage.setItem('token',token);
      commit(StoreEnums.InitToken);
    }
  },
  modules: {
  }
})
