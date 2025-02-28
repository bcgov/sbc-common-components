import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(VueI18n)
Vue.use(VueRouter)
setActivePinia(createPinia())
// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')
