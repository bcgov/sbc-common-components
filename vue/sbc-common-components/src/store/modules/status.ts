import StatusService from '../../services/status.services'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const statusModule = {
  namespaced: true,
  state: {
    paySystemStatus: {
      currentStatus: true,
      nextUpTime: new Date(),
      message: null,
      customMessage: null
    }
  },
  mutations: {
    setPaySystemStatus(state, serviceStatus){
      state.paySystemStatus = serviceStatus
    }
  },
  actions: {
    async fetchPaySystemStatus({ commit }) {
      try {
        const response = await StatusService.getServiceStatus('PAYBC')
        commit('setPaySystemStatus', (response && response.data) || null)
      } catch (error) {
        console.error('Error fetching service status:', error)
      }
    }
  }
}

export default statusModule
