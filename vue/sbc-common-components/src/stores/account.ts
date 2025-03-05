import AccountService from '../services/account.services'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys, LoginSource, Role } from '../util/constants'
import UserService from '../services/user.services'
import { getAccountIdFromCurrentUrl } from '../util/common-util'
import KeyCloakService from '../services/keycloak.services'
import { defineStore } from 'pinia'
import { AccountStateIF } from '../interfaces'
import { KCUserProfile } from '../models/KCUserProfile'
import { UserSettings } from '../models/userSettings'
import { UserProfile } from '../models/UserProfile'

export const useAccountStore = defineStore('account', {
  state: (): AccountStateIF => ({
    userSettings: [],
    currentAccount: null,
    currentAccountMembership: null,
    pendingApprovalCount: 0,
    currentUser: null
  }),

  getters: {
    accountName: state => state.currentAccount && state.currentAccount.label,
    switchableAccounts: state => state.userSettings?.filter(setting => setting.type === 'ACCOUNT'),
    username: state => `${state.currentUser?.firstName || '-'} ${state.currentUser?.lastName || ''}`
  },

  actions: {
    loadUserInfo (): KCUserProfile {
      this.currentUser = KeyCloakService.getUserInfo()
      return this.currentUser
    },

    async syncUserSettings (currentAccountId: string): Promise<UserSettings[]> {
      const response = await AccountService.getUserSettings(this.currentUser?.keycloakGuid)
      if (response?.data) {
        const userSettings = response.data.filter(userSettings => (userSettings.type === 'ACCOUNT'))
        const currentAccount = userSettings.find(org => String(org.id) === currentAccountId)
        ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(currentAccount || userSettings[0]))
        this.currentAccount = currentAccount || userSettings[0]
        if (this.currentUser?.loginSource === LoginSource.BCSC ||
          this.currentUser.roles.includes(Role.GOVMAccountUser)) {
          await this.fetchPendingApprovalCount()
        }
        this.userSettings = userSettings
      } else {
        this.userSettings = []
      }
      return this.userSettings
    },

    async fetchPendingApprovalCount (): Promise<number> {
      if (this.currentAccount?.id) {
        const response = await AccountService.getPendingMemberCount(
          parseInt(this.currentAccount.id), this.currentUser?.keycloakGuid)
        this.pendingApprovalCount = (response && response.data && response.data.count) || 0
      } else {
        this.pendingApprovalCount = 0
      }
      return this.pendingApprovalCount
    },

    async syncCurrentAccount (userSetting: UserSettings): Promise<UserSettings> {
      this.currentAccount = userSetting
      ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(this.currentAccount))
      return this.currentAccount
    },

    async syncUserProfile (): Promise<KCUserProfile> {
      const response = await UserService.getUserProfile('@me')
      if (response && response.data) {
        const userProfile = response.data
        // update the first name and last name for the users
        const updateProfile: KCUserProfile = {
          ...this.currentUser,
          lastName: response.data.lastname,
          firstName: userProfile.firstname
        }
        this.currentUser = updateProfile
        return this.currentUser
      }
    },

    async getCurrentUserProfile (isAuth = false): Promise<UserProfile> {
      try {
        const response = await UserService.getUserProfile('@me')
        const userProfile = response?.data || {} as UserProfile
        return userProfile
      } catch (error) {
        // for handling the 404 while first time user login in dir search
        console.error('Error: ', error?.response)
      }
    },

    async syncAccount () {
      const getLastAccountId = (): string => {
        const currentAccount = getAccountIdFromCurrentUrl()
        const pathList = window.location.pathname.split('/')
        const indexOfAccount = pathList.indexOf('account')
        const nextValAfterAccount = indexOfAccount > 0 ? pathList[indexOfAccount + 1] : ''
        const orgIdFromUrl = isNaN(+nextValAfterAccount) ? '' : nextValAfterAccount
        const storageAccountId = currentAccount ||
          JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.CurrentAccount) || '{}').id
        return orgIdFromUrl || String(storageAccountId || '') || ''
      }

      const lastUsedAccount = getLastAccountId()
      if (this.currentUser?.keycloakGuid) {
        await this.syncUserSettings(lastUsedAccount)
        ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(this.currentAccount || ''))
      }
    },

    async updateUserProfile (): Promise<void> {
      await UserService.updateUserProfile()
    }
  }
})
