import { mount } from '@vue/test-utils'
import SbcSignin from '@/components/SbcSignin.vue'
import vuetify, { createVueRouter } from './setup'
import { createStore } from 'vuex'
import AccountModule from '@/store/modules/account'
import AuthModule from '@/store/modules/auth'
import { it, describe, expect, beforeEach, vi } from 'vitest'
import KeyCloakService from '@/services/keycloak.services'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn()
    }))

vi.mock('@/services/keycloak.services')
const initializeKeycloakMock = KeyCloakService.initializeKeyCloak as any

describe('SbcSignin', () => {
  let store: any
  let router: any
  beforeEach(() => {
    initializeKeycloakMock.mockResolvedValue([])
    // Create a new Vuex store instance with the required modules
    store = createStore({
      modules: {
        aith: AuthModule,
        account: AccountModule
      }
    })
    router = createVueRouter()
  })

  it('renders loading screen when SBC Signin is loaded', () => {
    const wrapper = mount(SbcSignin, {
      global: {
        plugins: [store, vuetify, router]
      }
    })

    const loadingScreen = wrapper.findComponent({ name: 'loading-screen' })
    expect(loadingScreen.exists()).toBe(true)
  })

  // Add more unit tests for the remaining functionality of the component
})
