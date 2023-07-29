import Axios from 'axios'
import KeycloakService from '../../src/services/keycloak.services'
import ConfigHelper from '../../src/util/config-helper'
import { SessionStorageKeys } from '@/util/constants'
import { it, describe, expect, beforeAll } from 'vitest'

const KEYCLOAK_URL = `${process.env.VUE_APP_PATH}config/kc/keycloak.json`

describe('initialize keycloak', () => {
  it('should clear session storage ', () => {
    expect(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken)).toEqual(null)
    expect(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken)).toEqual(null)
  })
})

describe('configuring keycloak', () => {
  beforeAll(() => {
    KeycloakService.setKeycloakConfigUrl(KEYCLOAK_URL)
  })
  it('should set keycloak config url ', () => {
    expect(ConfigHelper.getKeycloakConfigUrl()).toEqual(KEYCLOAK_URL)
  })
})
