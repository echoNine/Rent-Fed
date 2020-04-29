import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    mustGetUser (state, getters) {
      if (!getters.userInfo) {
        router.push('/UserLogin')
        return
      }
      return getters.userInfo
    },
    // 参数列表state指的是state数据
    userInfo (state) {
      if (!state.user) {
        state.user = JSON.parse(localStorage.getItem('store_user'))
      }
      return state.user
    }
  },
  mutations: {
    setUserInfo (state, user) {
      localStorage.setItem('store_user', JSON.stringify(user))
      state.user = user
    },
    clearUserInfo (state) {
      state.user = null
      localStorage.removeItem('store_user')
    }
  },
  actions: {
    setUser ({ commit, state }, user) {
      commit('setUserInfo', user)
    },
    clearUser ({ commit, state }) {
      commit('clearUserInfo')
    }
  },
  modules: {
  }
})
