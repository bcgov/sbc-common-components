import Keycloak, { KeycloakInitOptions, KeycloakInstance, KeycloakLoginOptions, KeycloakTokenParsed } from 'keycloak-js'
import { KCUserProfile } from '../models/KCUserProfile'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'

interface UserToken extends KeycloakTokenParsed {
  lastname: string;
  firstname: string;
  email: string;
  // eslint-disable-next-line camelcase
  realm_access_roles: string[];
  jti: string;
  username: string;
}

class KeyCloakService {
  private kc: KeycloakInstance | undefined
  private parsedToken: any
  private static instance: KeyCloakService

  public static getInstance (): KeyCloakService {
    return (this.instance) ? this.instance : new KeyCloakService()
  }

  init (idpHint: string) {
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
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, this.kc?.token)
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, this.kc?.idToken)
    ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, this.kc?.refreshToken)
    ConfigHelper.addToSession(SessionStorageKeys.UserFullName, this.getUserInfo().fullName)
    ConfigHelper.addToSession(SessionStorageKeys.UserFullName, this.getUserInfo().fullName)
    ConfigHelper.addToSession(SessionStorageKeys.UserKcId, this.getUserInfo().keycloakGuid)

    this.parsedToken = this.kc?.tokenParsed as UserToken

    // Set flag in session storage so that common components will know account type
    ConfigHelper.addToSession(SessionStorageKeys.UserAccountType, this.getUserInfo().loginSource)
  }

  getUserInfo () : KCUserProfile {
    if (!this.parsedToken) {
      this.parsedToken = this.decodeToken()
    }
    return {
      lastName: this.parsedToken.lastname,
      firstName: this.parsedToken.firstname,
      email: this.parsedToken.email,
      roles: this.parsedToken.realm_access.roles,
      keycloakGuid: this.parsedToken.sub,
      userName: this.parsedToken.username,
      fullName: `${this.parsedToken.firstname} ${this.parsedToken.lastname}`,
      loginSource: this.parsedToken.loginSource
    }
  }

  async logout (redirectUrl: string) {
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
    // Set the token expiry time as the minValidity to force refresh token
    if (!this.kc || !this.kc.tokenParsed || !this.kc.tokenParsed.exp || !this.kc.timeSkew) {
      return
    }
    let tokenExpiresIn = this.kc.tokenParsed.exp - Math.ceil(new Date().getTime() / 1000) + this.kc.timeSkew + 100
    this.kc && this.kc.updateToken(tokenExpiresIn)
      .success(refreshed => {
        if (refreshed) {
          this.initSession()
        }
      })
      .error(() => {
        this.cleanupSession()
      })
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

  decodeToken () {
    try {
      let token = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
      if (token) {
        const base64Url = token.split('.')[1]
        const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(base64)
      }
    } catch (error) {
      throw new Error('Error parsing JWT - ' + error)
    }
  }

  // Setting keycloak config url as a static configuration to access from other parts of the app if needed
  async setKeycloakConfigUrl (keyCloakConfigurl: string) {
    ConfigHelper.setKeycloakConfigUrl(keyCloakConfigurl)
  }
}

export default KeyCloakService.getInstance()
