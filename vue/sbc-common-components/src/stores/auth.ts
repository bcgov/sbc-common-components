import { computed, reactive, toRefs } from '@vue/composition-api'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import KeycloakServices from '../services/keycloak.services'
import { defineStore } from 'pinia'
import { AuthStateIF } from '../interfaces'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthStateIF>({
    token: '',
    idToken: '',
    refreshToken: '',
    kcGuid: '',
    loginSource: ''
  })

  const isAuthenticated = computed(() => !!state.token)
  const keycloakGuid = computed(() => state.kcGuid || KeycloakServices.getUserInfo().keycloakGuid)
  const currentLoginSource = computed(() => state.loginSource || KeycloakServices.getUserInfo().loginSource)

  const clearSession = (): void => {
    state.token = ''
    state.idToken = ''
    state.refreshToken = ''
    state.kcGuid = ''
    state.loginSource = ''
  }

  const setKCToken = (token: string): void => {
    state.token = token
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token)
  }

  const setIDToken = (idToken: string): void => {
    state.idToken = idToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken)
  }

  const setRefreshToken = (refreshToken: string): void => {
    state.refreshToken = refreshToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken)
  }

  const setKCGuid = (kcGuid: string): void => {
    state.kcGuid = kcGuid
  }

  const setLoginSource = (loginSource: string): void => {
    state.loginSource = loginSource
  }

  const syncWithSessionStorage = (): void => {
    setKCToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
    setIDToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
    setRefreshToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
  }

  return {
    ...toRefs(state),
    isAuthenticated,
    keycloakGuid,
    currentLoginSource,
    clearSession,
    setKCToken,
    setIDToken,
    setRefreshToken,
    setKCGuid,
    setLoginSource,
    syncWithSessionStorage
  }
})
