import { mount, VueWrapper } from '@vue/test-utils'
import SbcAuthMenu from '@/components/SbcAuthMenu.vue'
import vuetify, { createVueRouter } from './setup'
import { createPinia, setActivePinia } from 'pinia'
import { it, describe, expect, beforeEach } from 'vitest'

setActivePinia(createPinia())

describe('SbcAuthMenu', () => {
  let wrapper: VueWrapper<any>
  let router: any

  beforeEach(() => {
    router = createVueRouter()
    wrapper = mount(SbcAuthMenu, {
      global: {
        plugins: [vuetify, router]
      }
    })
  })

  it('is visible', () => {
    expect(wrapper.isVisible()).toBe(true)
  })

  it('renders the login options correctly', () => {
    const loginOptions = wrapper.findAll('.items')
    expect(loginOptions).toHaveLength(3) // Assuming there are three login options
  })
})
