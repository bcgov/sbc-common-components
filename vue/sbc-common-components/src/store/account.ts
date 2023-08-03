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
import { computed, reactive } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const state = reactive<AccountStateIF>({
    userSettings: [],
    currentAccount: null,
    currentAccountMembership: null,
    pendingApprovalCount: 0,
    currentUser: null
  })

  const accountName = computed(() => state.currentAccount && state.currentAccount.label)
  const switchableAccounts = computed(() => state.userSettings?.filter(setting => setting.type === 'ACCOUNT'))
  const username = computed(() => `${state.currentUser?.firstName || '-'} ${state.currentUser?.lastName || ''}`)

  function loadUserInfo () : KCUserProfile {
    state.currentUser = KeyCloakService.getUserInfo()
    return state.currentUser
  }

  async function syncUserSettings (currentAccountId: string): Promise<UserSettings[]> {
    const response = await AccountService.getUserSettings(state.currentUser?.keycloakGuid)
    if (response?.data) {
      const userSettings = response.data.filter(userSettings => (userSettings.type === 'ACCOUNT'))
      const currentAccount = userSettings.find(org => String(org.id) === currentAccountId)
      ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(currentAccount || userSettings[0]))
      state.currentAccount = currentAccount || userSettings[0]
      if (state.currentUser?.loginSource === LoginSource.BCSC ||
        state.currentUser.roles.includes(Role.GOVMAccountUser)) {
        await fetchPendingApprovalCount()
      }
      state.userSettings = userSettings
    } else {
      state.userSettings = []
    }
    return state.userSettings
  }

  async function fetchPendingApprovalCount (): Promise<number> {
    if (state.currentAccount?.id) {
      const response = await AccountService.getPendingMemberCount(
        parseInt(state.currentAccount.id), state.currentUser?.keycloakGuid)
      state.pendingApprovalCount = (response && response.data && response.data.count) || 0
    } else {
      state.pendingApprovalCount = 0
    }
    return state.pendingApprovalCount
  }

  async function syncCurrentAccount (userSetting: UserSettings): Promise<UserSettings> {
    state.currentAccount = userSetting
    ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(state.currentAccount))
    return state.currentAccount
  }

  async function syncUserProfile () : Promise<KCUserProfile> {
    // TODO improve the logic of not fetching the first name last name every time of header mounted
    const response = await UserService.getUserProfile('@me')
    if (response && response.data) {
      const userProfile = response.data
      // update the first name and last name for the users
      const updateProfile:KCUserProfile = {
        ...state.currentUser,
        lastName: response.data.lastname,
        firstName: userProfile.firstname
      }
      state.currentUser = updateProfile
      return state.currentUser
    }
  }

  async function getCurrentUserProfile (isAuth = false): Promise<UserProfile> {
    try {
      const response = await UserService.getUserProfile('@me')
      const userProfile = response?.data || {} as UserProfile
      // This used to call the userStore setUserProfile if isAuth, we'll have to figure out a better way
      // When we wire this up to auth later.
      return userProfile
    } catch (error) {
      // for handling the 404 while first time user login in dir search
      // redirect to auth-web for first time logins from other apps, even if user is 404
      console.error('Error: ', error?.response)
    }
  }

  async function syncAccount () {
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
    if (state.currentUser?.keycloakGuid) {
      await syncUserSettings(lastUsedAccount)
      ConfigHelper.addToSession(SessionStorageKeys.CurrentAccount, JSON.stringify(state.currentAccount || ''))
    }
  }

  async function updateUserProfile () : Promise<void> {
    await UserService.updateUserProfile()
  }

  return {
    state,
    accountName,
    switchableAccounts,
    username,
    loadUserInfo,
    syncUserSettings,
    syncCurrentAccount,
    syncUserProfile,
    getCurrentUserProfile,
    syncAccount,
    updateUserProfile,
    fetchPendingApprovalCount
  }
})
