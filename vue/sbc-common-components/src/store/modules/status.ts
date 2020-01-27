import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { AxiosResponse } from 'axios'
import { ServiceStatus } from '../../models/ServiceStatus'
import StatusService from '../../services/status.services'

@Module({
  name: 'status',
  namespaced: true
})
export default class StatusModule extends VuexModule {
  paySystemStatus: ServiceStatus = {
    currentStatus: true,
    nextUpTime: new Date()
  }

  @Mutation
  public setPaySystemStatus (serviceStatus: ServiceStatus) {
    this.paySystemStatus = serviceStatus
  }

  @Action({ commit: 'setPaySystemStatus' })
  public async fetchPaySystemStatus (): Promise<ServiceStatus> {
    const response: AxiosResponse<ServiceStatus> = await StatusService.getServiceStatus('PAYBC')
    return response ? response.data : this.paySystemStatus
  }
}
