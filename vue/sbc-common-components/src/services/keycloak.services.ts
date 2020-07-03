import Keycloak, { KeycloakInitOptions, KeycloakInstance, KeycloakLoginOptions, KeycloakTokenParsed } from 'keycloak-js'
import { KCUserProfile } from '../models/KCUserProfile'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '../store/modules/auth'
import { decodeKCToken } from '../util/common-util'

class KeyCloakService {
  private kc: KeycloakInstance | undefined
  private parsedToken: any
  private static instance: KeyCloakService
  private store: Store<any> | null = null

  public static getInstance (): KeyCloakService {
    return (this.instance) ? this.instance : new KeyCloakService()
  }

  public get isInitialized (): boolean {
    return !!this.kc
  }

  init (idpHint: string, store: Store<any>) {
    this.store = store
    this.cleanupSession()
    const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || undefined
    const keycloakConfig = ConfigHelper.getKeycloakConfigUrl()
    this.kc = Keycloak(keycloakConfig)
    const kcLogin = this.kc.login
    this.kc.login = (options?: KeycloakLoginOptions) => {
      if (options) {
        options.idpHint = idpHint
      }
      return kcLogin(options)
    }
    return this.kc.init({ token: token, onLoad: 'login-required' })
  }

  initSession () {
    if (!this.store) {
      return
    }

    const authModule = getModule(AuthModule, this.store)
    authModule.setKCToken(this.kc?.token || '')
    authModule.setIDToken(this.kc?.idToken || '')
    authModule.setRefreshToken(this.kc?.refreshToken || '')

    const userInfo = this.getUserInfo()
    authModule.setKCGuid(userInfo?.keycloakGuid || '')
    authModule.setLoginSource(userInfo?.loginSource || '')
  }

  getUserInfo () : KCUserProfile {
    if (!this.parsedToken) {
      this.parsedToken = decodeKCToken()
    }
    return {
      lastName: this.parsedToken?.lastname,
      firstName: this.parsedToken?.firstname,
      email: this.parsedToken?.email,
      // eslint-disable-next-line camelcase
      roles: this.parsedToken?.realm_access?.roles,
      keycloakGuid: this.parsedToken?.sub,
      userName: this.parsedToken?.username,
      fullName: this.parsedToken?.name,
      loginSource: this.parsedToken?.loginSource
    }
  }

  async logout (redirectUrl?: string) {
    let token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || undefined
    if (token) {
      this.kc = Keycloak(ConfigHelper.getKeycloakConfigUrl())
      let kcOptions :KeycloakInitOptions = {
        onLoad: 'login-required',
        checkLoginIframe: false,
        timeSkew: 0,
        token,
        refreshToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || undefined,
        idToken: ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || undefined
      }
      // Here we clear session storage, and add a flag in to prevent the app from
      // putting tokens back in from returning async calls  (see #2341)
      ConfigHelper.clearSession()
      ConfigHelper.addToSession(SessionStorageKeys.PreventStorageSync, true)
      return new Promise((resolve, reject) => {
        this.kc && this.kc.init(kcOptions)
          .success(authenticated => {
            if (!authenticated) {
              resolve()
            }
            redirectUrl = redirectUrl || `${window.location.origin}${process.env.VUE_APP_PATH}`
            this.kc && this.kc.logout({ redirectUri: redirectUrl })
              .success(() => {
                resolve()
              })
              .error(error => {
                reject(error)
              })
          })
          .error(error => {
            reject(error)
          })
      })
    }
  }

  getKCInstance () : KeycloakInstance | undefined {
    return this.kc
  }

  cleanupSession () {
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakToken)
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakRefreshToken)
    ConfigHelper.removeFromSession(SessionStorageKeys.KeyCloakIdToken)
  }

  async refreshToken () {
    this.initSession()
    // Set the token expiry time as the minValidity to force refresh token
    if (!this.kc?.tokenParsed?.exp || !this.kc.timeSkew) {
      return
    }
    let tokenExpiresIn = this.kc.tokenParsed.exp - Math.ceil(new Date().getTime() / 1000) + this.kc.timeSkew + 100
    if (this.kc) {
      this.kc.updateToken(tokenExpiresIn)
        .success(refreshed => {
          if (refreshed) {
            this.initSession()
          }
        })
        .error(() => {
          this.cleanupSession()
          return new Error('Could not refresh Token')
        })
    } else {
      return new Error('Could not refresh Token:No Kc Instance')
    }
  }

  verifyRoles (allowedRoles:[], disabledRoles:[]) {
    let isAuthorized = false
    if (allowedRoles || disabledRoles) {
      let userInfo = this.getUserInfo()
      isAuthorized = allowedRoles ? allowedRoles.some(role => userInfo.roles.includes(role)) : !disabledRoles.some(role => userInfo.roles.includes(role))
    } else {
      isAuthorized = true
    }
    return isAuthorized
  }

  // Setting keycloak config url as a static configuration to access from other parts of the app if needed
  async setKeycloakConfigUrl (keyCloakConfigurl: string) {
    ConfigHelper.setKeycloakConfigUrl(keyCloakConfigurl)
  }
}

export default KeyCloakService.getInstance()
