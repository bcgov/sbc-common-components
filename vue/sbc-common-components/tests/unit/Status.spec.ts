import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { createLocalVue, mount, shallowMount, Wrapper } from '@vue/test-utils'
import StatusService from '../../src/services/status.services'
import SbcSystemAlert from '@/components/SbcSystemAlert.vue'
import Vuex from 'vuex'

Vue.use(Vuetify)
Vue.use(Vuelidate)
// suppress "avoid mutating a prop directly" warnings
// https://vue-test-utils.vuejs.org/api/config.html#silent
Vue.config.silent = true

let vuetify = new Vuetify({})

vitest.mock('../../src/services/status.services')

describe('SbcSystemAlert.vue', () => {
  const $t = () => 'Payment service unavailable'
  const serviceData = [{
    serviceName: 'PAYBC',
    serviceNameDesc: 'Payment'
  }]

  it('Check service call with true', done => {
    let mockDetails = { data: { 'currentStatus': 'True', 'nextUpTime': 0 } }
    StatusService.getServiceStatus = vitest.fn().mockResolvedValue(mockDetails)

    const wrapper = shallowMount(SbcSystemAlert, {
      propsData: { serviceData, statusURL: 'https://status-api-dev.pathfinder.gov.bc.ca/api/v1/' },
      mocks: { $t }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()

    expect(StatusService.getServiceStatus).toBeCalled()

    expect(wrapper.props().serviceData).toBe(serviceData)
    expect(wrapper.props().statusURL).toBe('https://status-api-dev.pathfinder.gov.bc.ca/api/v1/')

    Vue.nextTick(async () => {
      expect(wrapper.vm.isSbcSystemDown).toBeTruthy()
      expect(wrapper.vm.alertMessage).toBe('Payment service unavailable')

      wrapper.destroy()
      done()
    })
  })

  it('Check service call with false', done => {
    let mockDetails = { data: { 'currentStatus': 'False', 'nextUpTime': 0 } }
    StatusService.getServiceStatus = vitest.fn().mockResolvedValue(mockDetails)

    const wrapper = shallowMount(SbcSystemAlert, {
      propsData: { serviceData, statusURL: 'https://status-api-dev.pathfinder.gov.bc.ca/api/v1/' },
      mocks: { $t }
    })

    expect(StatusService.getServiceStatus).toBeCalled()
    Vue.nextTick(async () => {
      console.log('sbcsystemdown: ', wrapper.vm.$data.isSbcSystemDown)
      expect(wrapper.vm.isSbcSystemDown).toBeFalsy()
      expect(wrapper.vm.alertMessage).toBe('Payment service unavailable')

      wrapper.destroy()
      done()
    })
  })
})
