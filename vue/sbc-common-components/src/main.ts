import 'core-js/stable' // to polyfill ECMAScript features
import '@mdi/font/css/materialdesignicons.min.css' // icon library (https://materialdesignicons.com/)
import 'regenerator-runtime/runtime' // to use transpiled generator functions
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vue2Filters from 'vue2-filters'
import vuetify from './plugins/vuetify'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vuetify/dist/vuetify.min.css'

Vue.use(PiniaVuePlugin)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)

Vue.config.productionTip = false

const pinia = createPinia()

new Vue({
  pinia,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
