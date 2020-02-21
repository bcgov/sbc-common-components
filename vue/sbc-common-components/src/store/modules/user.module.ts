import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import KeyCloakService from '../../services/keycloak.services'
import { UserInfo } from '../../models/userInfo'

export interface UserTerms {
  isTermsOfUseAccepted: boolean
  termsOfUseAcceptedVersion: string
}

@Module({
  name: 'user',
  namespaced: true
})
export default class UserModule extends VuexModule {
  currentUser: UserInfo = undefined

  @Mutation
  public setCurrentUser (currentUser: UserInfo) {
    this.currentUser = currentUser
  }

  @Action({ rawError: true })
  public async initKeycloak (idpHint:string) {
    return KeyCloakService.init(idpHint)
  }

  @Action({ commit: 'setCurrentUser' })
  public initializeSession () {
    // Set values to session storage
    KeyCloakService.initSession()
    // Load User Info
    return KeyCloakService.getUserInfo()
  }
}
