/* eslint-disable */
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import KeycloakServices from '../services/keycloak.services'
import { defineStore } from 'pinia'
import { AuthStateIF } from '../interfaces'

export const useAuthStore = defineStore('auth', {
  state: (): AuthStateIF => ({
    token: '',
    idToken: '',
    refreshToken: '',
    kcGuid: '',
    loginSource: ''
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    keycloakGuid: state => state.kcGuid || KeycloakServices.getUserInfo().keycloakGuid,
    currentLoginSource: state => state.loginSource || KeycloakServices.getUserInfo().loginSource
  },

  actions: {
    clearSession(): void {
      this.token = ''
      this.idToken = ''
      this.refreshToken = ''
      this.kcGuid = ''
      this.loginSource = ''
    },

    setKCToken(token: string): void {
      this.token = token
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token)
    },

    setIDToken(idToken: string): void {
      this.idToken = idToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken)
    },

    setRefreshToken(refreshToken: string): void {
      this.refreshToken = refreshToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken)
    },

    setKCGuid(kcGuid: string): void {
      this.kcGuid = kcGuid
    },

    setLoginSource(loginSource: string): void {
      this.loginSource = loginSource
    },

    syncWithSessionStorage(): void {
      this.setKCToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
      this.setIDToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
      this.setRefreshToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
    }
  }
})
