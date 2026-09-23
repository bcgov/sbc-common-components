import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import { createPinia, PiniaVuePlugin, setActivePinia } from 'pinia'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(PiniaVuePlugin)
setActivePinia(createPinia())
Vue.use(Vuetify)
Vue.use(Vuelidate)
