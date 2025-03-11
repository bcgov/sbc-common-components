import { reactive, toRefs } from '@vue/composition-api'
import { StatusStateIF } from '../interfaces'
import { ServiceStatus } from '../models/ServiceStatus'
import StatusService from '../services/status.services'
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const state = reactive<StatusStateIF>({
    currentStatus: true,
    nextUpTime: new Date(),
    message: null,
    customMessage: null
  })

  const fetchPaySystemStatus = async (): Promise<ServiceStatus | null> => {
    const response = await StatusService.getServiceStatus('PAYBC')
    const result = response?.data || null
    state.currentStatus = result.currentStatus
    state.nextUpTime = result.nextUpTime
    state.message = result.message
    state.customMessage = result.customMessage
    return result
  }

  return {
    ...toRefs(state),
    fetchPaySystemStatus
  }
})
