import Axios from 'axios'
import { mount } from '@vue/test-utils'
import SbcHeader from '@/components/SbcHeader.vue'
import vuetify, { createVueRouter } from './setup'
import { createStore } from 'vuex'
import AccountModule from '@/store/modules/account'
import AuthModule from '@/store/modules/auth'
import NotificationModule from '@/store/modules/notification'
import getNotifications from '@/services/notification.services'
import { it, describe, expect, beforeEach, vi } from 'vitest'
import { addAxiosInterceptors } from '@/util/interceptors'

vi.mock('axios')
vi.mock('@/util/interceptors')
vi.mock('@/services/notification.services')

const axios = Axios as any
const addAxiosInterceptorsMock = addAxiosInterceptors as any
const getNotificationsMock = getNotifications as any

describe('SbcHeader', () => {
  let store: any
  let router: any

  beforeEach(() => {
    axios.get.mockResolvedValue([])
    axios.all.mockResolvedValue([])
    axios.spread.mockResolvedValue([] as any)
    addAxiosInterceptorsMock.mockReturnValue(axios)
    getNotificationsMock.mockResolvedValue([])
    // Create a new Vuex store instance with the required modules
    store = createStore({
      modules: {
        account: AccountModule,
        auth: AuthModule,
        notification: NotificationModule
      }
    })
    router = createVueRouter()
  })
  it('renders the brand title correctly', () => {
    const wrapper = mount(SbcHeader, {
      global: {
        plugins: [store, vuetify, router]
      }
    })
    const header = wrapper.find('.app-header')
    expect(header.exists()).toBe(true)
  })
})
