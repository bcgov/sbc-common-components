import ConfigHelper from '../../util/config-helper'
import KeycloakServices from '../../services/keycloak.services'
import { SessionStorageKeys } from '../../util/constants'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const authModule = {
  namespaced: true,
  state: {
    token: '',
    idToken: '',
    refreshToken: '',
    kcGuid: '',
    loginSource: ''
  },
  getters: {
    isAuthenticated: state => !!state.token,
    keycloakGuid: state => state.kcGuid || KeycloakServices.getUserInfo().keycloakGuid,
    currentLoginSource: state => state.loginSource || KeycloakServices.getUserInfo().loginSource
  },
  mutations: {
    setKCToken(state, token) {
      state.token = token
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token)
    },
    setIDToken(state, idToken) {
      state.idToken = idToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken)
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken)
    },
    setKCGuid(state, kcGuid) {
      state.kcGuid = kcGuid
    },
    setLoginSource(state, loginSource) {
      state.loginSource = loginSource
    }
  },
  actions: {
    clearSession({ commit }) {
      commit('setKCToken', '')
      commit('setIDToken', '')
      commit('setRefreshToken', '')
      commit('setKCGuid', '')
      commit('setLoginSource', '')
    },
    syncWithSessionStorage({ commit }) {
      commit('setKCToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
      commit('setIDToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
      commit('setRefreshToken', ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
    }
  }
}

export default authModule
