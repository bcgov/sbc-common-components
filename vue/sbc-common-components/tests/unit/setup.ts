import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import { createPinia, PiniaVuePlugin, setActivePinia } from 'pinia'

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(PiniaVuePlugin)
setActivePinia(createPinia())
// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

