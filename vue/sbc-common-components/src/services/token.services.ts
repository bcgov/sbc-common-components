import KeycloakServices from './keycloak.services'
import { Pinia } from 'pinia'

// TODO: Remove the whole file once the other teams changed from token-service to keycloak-service

class TokenServices {
  async init (isScheduleRefresh: boolean = true) {
    return KeycloakServices.initializeToken(isScheduleRefresh)
  }

  scheduleRefreshTimer (refreshEarlyTime = 0) {
    KeycloakServices.scheduleRefreshTimer(refreshEarlyTime)
  }
}

export default TokenServices
