import AccountService from '@/services/account.services'
import ConfigHelper from '@/util/config-helper'
import { SessionStorageKeys, LoginSource, Role } from '@/util/constants'
import UserService from '@/services/user.services'
import { getAccountIdFromCurrentUrl } from '@/util/common-util'
import KeyCloakService from '@/services/keycloak.services'
import { defineStore } from 'pinia'
import { AccountStateIF } from '@/interfaces'
import { KCUserProfile } from '@/models/KCUserProfile'
import { UserSettings } from '@/models/userSettings'
import { UserProfile } from '@/models/UserProfile'

export const useAccountStore = defineStore('account', {
  state: (): AccountStateIF => {
    return {
      userSettings: [],
      currentAccount: null,
      currentAccountMembership: null,
      pendingApprovalCount: 0,
      currentUser: null
    }
  },
  getters: {
    accountName (): string {
      return this.currentAccount && this.currentAccount.label
    },
    switchableAccounts (): UserSettings[] {
      return this.userSettings?.filter(setting => setting.type === 'ACCOUNT')
    },
    username (): string {
      return `${this.currentUser?.firstName || '-'} ${this.currentUser?.lastName || ''}`
    }
  },
  actions: {
    loadUserInfo () : KCUserProfile {
      this.currentUser = KeyCloakService.getUserInfo()
      return this.currentUser
    },
    async syncUserSettings (currentAccountId: string): Promise<UserSettings[]> {
      const response = await AccountService.getUserSettings(this.currentUser?.keycloakGuid)
      if (response?.data) {
        const userSettings = response.data.filter(userSettings => (userSettings.type === 'ACCOUNT'))
        const currentAccount = userSettings.find(org => String(org.id) === currentAccountId)
        // if passed account is not user account list setting first one as current account
        this.context.commit('setCurrentAccount', currentAccount || userSettings[0])
        if (this.currentUser?.loginSource === LoginSource.BCSC ||
          this.currentUser.roles.includes(Role.GOVMAccountUser)) {
          await this.context.dispatch('fetchPendingApprovalCount')
        }
        this.userSettings = userSettings
      } else {
        this.userSettings = []
      }
      return this.userSettings
    },
    async fetchPendingApprovalAccount (): Promise<number> {
      if (this.context.rootState.account?.currentAccount?.id) {
        const response = await AccountService.getPendingMemberCount(
          this.context.rootState.account.currentAccount.id, this.currentUser?.keycloakGuid)
        this.pendingApprovalCount = (response && response.data && response.data.count) || 0
      } else {
        this.pendingApprovalCount = 0
      }
      return this.pendingApprovalCount
    },
    async syncCurrentAccount (userSetting: UserSettings): Promise<UserSettings> {
      this.currentAccount = userSetting
      ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(userSetting))
      return this.currentAccount
    },
    async syncUserProfile () : Promise<KCUserProfile> {
      // TODO improve the logic of not fetching the first name last name every time of header mounted
      const response = await UserService.getUserProfile('@me')
      if (response && response.data) {
        const userProfile = response.data
        // update the first name and last name for the users
        const updateProfile:KCUserProfile = {
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
        if (isAuth) {
          // const userStore = useStore('user') TODO: Figure this out!!!
          // this.context.commit('user/setUserProfile', userProfile, { root: true })
        }
        return userProfile
      } catch (error) {
        // for handling the 404 while first time user login in dir search
        // redirect to auth-web for first time logins from other apps, even if user is 404
        console.error('Error: ', error?.response)
      }
    },
    async syncAccount () {
      function getLastAccountId (): string {
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
    async updateUserProfile () : Promise<void> {
      await UserService.updateUserProfile()
    }
  }
})
