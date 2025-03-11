import KeycloakServices from './keycloak.services'

class TokenServices {
  async init (isScheduleRefresh: boolean = true) {
    return KeycloakServices.initializeToken(isScheduleRefresh)
  }

  scheduleRefreshTimer (refreshEarlyTime = 0) {
    KeycloakServices.scheduleRefreshTimer(refreshEarlyTime)
  }
}

export default TokenServices
