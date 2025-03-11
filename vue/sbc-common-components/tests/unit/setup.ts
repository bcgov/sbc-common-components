import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import { createPinia, PiniaVuePlugin, setActivePinia } from 'pinia'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { webcrypto } from 'crypto';

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(PiniaVuePlugin)
setActivePinia(createPinia())
Vue.use(Vuetify)
Vue.use(Vuelidate)
// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')
// TypeError: crypto$2.getRandomValues is not a function
(global as any).crypto = webcrypto
