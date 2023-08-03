import { StatusStateIF } from '@/interfaces'
import { ServiceStatus } from '@/models/ServiceStatus'
import StatusService from '@/services/status.services'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const state = reactive<StatusStateIF>({
    currentStatus: true,
    nextUpTime: new Date(),
    message: null,
    customMessage: null
  })
  async function fetchPaySystemStatus (): Promise<ServiceStatus | null> {
    const response = await StatusService.getServiceStatus('PAYBC')
    const result = (response && response.data) || null
    state.currentStatus = result.currentStatus
    state.nextUpTime = result.nextUpTime
    state.message = result.message
    state.customMessage = result.customMessage
    return result
  }
  return {
    state,
    fetchPaySystemStatus
  }
})
