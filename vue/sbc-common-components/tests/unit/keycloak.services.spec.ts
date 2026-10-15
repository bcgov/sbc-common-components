import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
import KeycloakService from '../../src/services/keycloak.services'
import ConfigHelper from '../../src/util/config-helper'
import { SessionStorageKeys } from '@/util/constants'

vitest.mock('axios', async () => {
  const actual = await vitest.importActual('axios')
  return {
    ...actual,
    get: vitest.fn(),
    all: vitest.fn(),
    post: vitest.fn(),
    put: vitest.fn(),
    patch: vitest.fn()
  }
})
var mockKcJosn = {
  'realm': 'test',
  'auth-server-url': 'https://sso-dev.pathfinder.gov.bc.ca/auth',
  'ssl-required': 'external',
  'resource': 'sbc-auth-web',
  'verify-token-audience': true,
  'credentials': {
    'secret': 'aeb2b9bc-672b-4574-8bc8-e76e853c37cb'
  },
  'use-resource-role-mappings': true,
  'confidential-port': 0
}

const KEYCLOAK_URL = `${process.env.VUE_APP_PATH}config/kc/keycloak.json`

describe('initialize keycloak', () => {
  const results = []
  beforeAll(() => {
    // @ts-ignore
    vitest.clearAllMocks()
  })

  it('should clear session storage ', () => {
    expect(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken)).toEqual(null)
    expect(ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken)).toEqual(null)
  })
})

describe('configuring keycloak', () => {
  const results = []
  beforeAll(() => {
    // @ts-ignore
    vitest.clearAllMocks()
    // @ts-ignore
    KeycloakService.setKeycloakConfigUrl(KEYCLOAK_URL)
  })
  it('should set keycloak config url ', () => {
    expect(ConfigHelper.getKeycloakConfigUrl()).toEqual(KEYCLOAK_URL)
  })
})
