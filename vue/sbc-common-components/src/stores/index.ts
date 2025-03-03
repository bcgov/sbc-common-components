import { PiniaVuePlugin, createPinia } from 'pinia'
import Vue from 'vue'
/**
 * Configures and returns Pinia Store.
 */
export function getPiniaStore () {
  Vue.use(PiniaVuePlugin)

  return createPinia()
}

export * from './account'
export * from './auth'
export * from './notification'
export * from './product'
export * from './status'
