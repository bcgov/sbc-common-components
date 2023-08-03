/* eslint-disable */
import ConfigHelper from '@/util/config-helper'
import { SessionStorageKeys } from '@/util/constants'
import KeycloakServices from '@/services/keycloak.services'
import { defineStore } from 'pinia'
import { AuthStateIF } from '@/interfaces'
import { computed, reactive } from 'vue'

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

  function clearSession (): void {
    state.token = ''
    state.idToken = ''
    state.refreshToken = ''
    state.kcGuid = ''
    state.loginSource = ''
  }

  function setKCToken (token: string): void {
    state.token = token
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token)
  }

  function setIDToken (idToken: string): void {
    state.idToken = idToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken)
  }

  function setRefreshToken (refreshToken: string): void {
    state.refreshToken = refreshToken
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken)
  }

  function setKCGuid (kcGuid: string): void {
    state.kcGuid = kcGuid
  }
  function setLoginSource (loginSource: string): void {
      state.loginSource = loginSource
  }

  function syncWithSessionStorage  (): void {
    setKCToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
    setIDToken(state.idToken = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
    setRefreshToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
  }

  return {
    state,
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
