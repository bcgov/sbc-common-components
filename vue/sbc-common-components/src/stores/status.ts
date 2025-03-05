import { StatusStateIF } from '../interfaces'
import { ServiceStatus } from '../models/ServiceStatus'
import StatusService from '../services/status.services'
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: (): StatusStateIF => ({
    currentStatus: true,
    nextUpTime: new Date(),
    message: null,
    customMessage: null
  }),

  actions: {
    async fetchPaySystemStatus (): Promise<ServiceStatus | null> {
      const response = await StatusService.getServiceStatus('PAYBC')
      const result = (response && response.data) || null
      this.currentStatus = result.currentStatus
      this.nextUpTime = result.nextUpTime
      this.message = result.message
      this.customMessage = result.customMessage
      return result
    }
  }
})
