/* eslint-disable */
import ConfigHelper from '@/util/config-helper'
import { SessionStorageKeys } from '@/util/constants'
import KeycloakServices from '@/services/keycloak.services'
import { defineStore } from 'pinia'
import { AuthStateIF } from '@/interfaces'

export const useAuthStore = defineStore('auth', {
  state: (): AuthStateIF => {
    return {
      token: '',
      idToken: '',
      refreshToken: '',
      kcGuid: '',
      loginSource: ''
    }
  },
  getters: {
    isAuthenticated (): boolean {
      return !!this.token
    },
    keycloakGuid (): string {
      return this.kcGuid || KeycloakServices.getUserInfo().keycloakGuid
    },
    currentLoginSource (): string {
      return this.loginSource || KeycloakServices.getUserInfo().loginSource
    }
  },
  actions: {
    clearSession (): void {
      this.token = ''
      this.idToken = ''
      this.refreshToken = ''
      this.kcGuid = ''
      this.loginSource = ''
    },
    setKCToken (token: string): void {
      this.token = token
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, this.token)
    },
    setIDToken (idToken: string): void {
      this.idToken = idToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, this.idToken)
    },
    setRefreshToken (refreshToken: string): void {
      this.refreshToken = refreshToken
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, this.refreshToken)
    },
    setKCGuid (kcGuid: string): void {
      this.kcGuid = kcGuid
    },
    setLoginSource (loginSource: string): void {
      this.loginSource = loginSource
    },
    syncWithSessionStorage (): void {
      this.setKCToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '')
      this.setIDToken(this.idToken = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '')
      this.setRefreshToken(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '')
    }
  },
})
