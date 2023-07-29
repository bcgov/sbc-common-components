import { mount } from '@vue/test-utils'
import LoadingScreen from '../../src/components/LoadingScreen.vue'
import vuetify from './setup'
import { it, describe, expect, vi } from 'vitest'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn()
    }))

describe('loading screen component', () => {
  it('renders v progress circular when isLoading is true', () => {
    const wrapper = mount(LoadingScreen, {
      props: {
        isLoading: true
      },
      global: {
        plugins: [vuetify]
      }
    })

    const progressCircular = wrapper.find('.v-loader')
    expect(progressCircular.exists()).toBe(true)
  })

  it('does not render v progress circular when isLoading is false', () => {
    const wrapper = mount(LoadingScreen, {
      props: {
        isLoading: false
      },
      global: {
        plugins: [vuetify]
      }
    })

    const progressCircular = wrapper.find('.v-loader')
    expect(progressCircular.exists()).toBe(false)
  })
})
