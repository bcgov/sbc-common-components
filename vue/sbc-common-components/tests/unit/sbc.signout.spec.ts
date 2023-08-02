import { mount } from '@vue/test-utils'
import SbcSignout from '@/components/SbcSignout.vue'
import vuetify, { createVueRouter } from './setup'
import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

setActivePinia(createPinia())

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn()
    }))

describe('SbcSignout', () => {
  let router: any
  beforeEach(() => {
    router = createVueRouter()
  })

  it('renders loading screen when SBC Signout is loaded', () => {
    const wrapper = mount(SbcSignout, {
      global: {
        plugins: [vuetify, router]
      }
    })

    const loadingScreen = wrapper.findComponent({ name: 'loading-screen' })
    expect(loadingScreen.exists()).toBe(true)
  })

  // Add more unit tests for the remaining functionality of the component
})
