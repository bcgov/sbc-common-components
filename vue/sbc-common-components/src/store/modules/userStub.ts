import { Module, VuexModule } from 'vuex-module-decorators'

export interface UserTerms {

}

@Module({
  name: 'user',
  namespaced: true
})
export default class UserModule extends VuexModule {

}
