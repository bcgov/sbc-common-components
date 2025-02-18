import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import AccountService from '../../services/account.services'
import { Member } from '../../models/member'
import { UserSettings } from '../../models/userSettings'
import { KCUserProfile } from '../../models/KCUserProfile'
import KeyCloakService from '../../services/keycloak.services'
import ConfigHelper from '../../util/config-helper'
import { SessionStorageKeys, LoginSource, Role } from '../../util/constants'
import UserService from '../../services/user.services'
import { getAccountIdFromCurrentUrl } from '../../util/common-util'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const accountModule = {
  namespaced: true,
  state: {
    userSettings: [],
    currentAccount: null,
    currentAccountMembership: null,
    pendingApprovalCount: 0,
    currentUser: null
  },
  getters: {
    accountName: state => state.currentAccount && state.currentAccount.label,
    switchableAccounts: state => state.userSettings.filter(setting => setting.type === 'ACCOUNT'),
    username: state => `${state.currentUser?.firstName || '-'} ${state.currentUser?.lastName || ''}`
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = currentUser
    },
    setUserSettings(state, userSettings) {
      state.userSettings = userSettings
    },
    setCurrentAccount(state, userSetting) {
      ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(userSetting))
      state.currentAccount = userSetting
    },
    setPendingApprovalCount(state, count) {
      state.pendingApprovalCount = count
    },
    setCurrentAccountMembership(state, membership) {
      state.currentAccountMembership = membership
    }
  },
  actions: {
    async loadUserInfo({ commit }) {
      const userInfo = await KeyCloakService.getUserInfo()
      commit('setCurrentUser', userInfo)
    },
    async syncUserSettings({ commit, dispatch, state }, currentAccountId) {
      const response = await AccountService.getUserSettings(state.currentUser?.keycloakGuid)
      if (response?.data) {
        const orgs = response.data.filter(userSettings => userSettings.type === 'ACCOUNT')
        const currentAccount = orgs.find(org => String(org.id) === currentAccountId) || orgs[0]
        commit('setCurrentAccount', currentAccount)
        if (state.currentUser?.loginSource === LoginSource.BCSC || state.currentUser.roles.includes(Role.GOVMAccountUser)) {
          await dispatch('fetchPendingApprovalCount')
        }
        commit('setUserSettings', orgs)
      }
    },
    async fetchPendingApprovalCount({ commit, rootState, state }) {
      if (rootState.account?.currentAccount?.id) {
        const response = await AccountService.getPendingMemberCount(rootState.account.currentAccount.id, state.currentUser?.keycloakGuid)
        commit('setPendingApprovalCount', response?.data?.count || 0)
      } else {
        commit('setPendingApprovalCount', 0)
      }
    },
    async syncUserProfile({ commit, state }) {
      const response = await UserService.getUserProfile('@me')
      if (response?.data) {
        commit('setCurrentUser', {
          ...state.currentUser,
          lastName: response.data.lastname,
          firstName: response.data.firstname
        })
      }
    },
    async syncAccount({ dispatch, state }) {
      const lastUsedAccount = getAccountIdFromCurrentUrl() || JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.CurrentAccount) || '{}').id || ''
      if (state.currentUser?.keycloakGuid) {
        await dispatch('syncUserSettings', lastUsedAccount)
        ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(state.currentAccount || ''))
      }
    },
    async updateUserProfile() {
      await UserService.updateUserProfile()
    }
  }
}

export default accountModule

