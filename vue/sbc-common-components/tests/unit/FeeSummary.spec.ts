import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
import 'mutationobserver-shim'
import { shallowMount, mount } from '@vue/test-utils'
import SbcFeeSummary from '@/components/SbcFeeSummary.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import FeeService from '../../src/services/fee.services'

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.filter('currency', () => 'foo')

vitest.mock('../../src/services/fee.services')

describe('SbcFeeSummary.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('renders page .msg when passed', () => {
    let mockDetails = [{ 'filingType': 'Change of Director', 'filingTypeCode': 'OTADD', 'filingFees': 55, 'serviceFees': 0, 'fee': 0, 'tax': { 'gst': 0, 'pst': 0 } }]
    FeeService.getFee = vitest.fn().mockResolvedValue(mockDetails)

    const filingData = [{
      filingTypeCode: 'OTANN',
      entityType: 'CP',
      filingDescription: '',
      waiveFees: false
    }]
    const wrapper = mount(SbcFeeSummary, {
      propsData: { filingData },
      vuetify
    })

    expect(wrapper.findAll('header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Fee Summary')
    expect(wrapper.text()).toContain('Total Fees')

    expect(wrapper.props().filingData).toBe(filingData)
    expect(wrapper.props('filingData')).toBe(filingData)
  })

  it('setting props works', () => {
    let mockDetails = [{ 'filingType': 'Change of Director', 'filingTypeCode': 'OTADD', 'filingFees': 55, 'serviceFees': 0, 'fee': 0, 'tax': { 'gst': 0, 'pst': 0 } }]
    FeeService.getFee = vitest.fn().mockResolvedValue(mockDetails)

    const filingData = [{
      filingTypeCode: 'OTANN',
      entityType: 'CP',
      filingDescription: '',
      waiveFees: false
    }]
    // @ts-ignore
    const wrapper = mount(SbcFeeSummary, {
      propsData: { filingData },
      vuetify
    })

    expect(wrapper.props().filingData).toBe(filingData)
    expect(wrapper.props('filingData')).toBe(filingData)
  })

  it('fires service calls', () => {
    let mockDetails = [{ 'filingType': 'Change of Director', 'filingTypeCode': 'OTADD', 'filingFees': 55, 'serviceFees': 0, 'fee': 0, 'tax': { 'gst': 0, 'pst': 0 } }]
    FeeService.getFee = vitest.fn().mockResolvedValue(mockDetails)

    const filingData = [{
      filingTypeCode: 'OTANN',
      entityType: 'CP',
      filingDescription: '',
      waiveFees: false
    }]
    // @ts-ignore
    const wrapper = mount(SbcFeeSummary, {
      propsData: { filingData },
      vuetify
    })

    expect(FeeService.getFee).toBeCalled()
  })
})
