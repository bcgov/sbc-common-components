import 'core-js/stable' // to polyfill ECMAScript features
import '@mdi/font/css/materialdesignicons.min.css' // icon library (https://materialdesignicons.com/)
import 'regenerator-runtime/runtime' // to use transpiled generator functions
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuelidate from 'vuelidate'
import Vue2Filters from 'vue2-filters'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { getPiniaStore } from './stores'

Vue.use(VueCompositionAPI)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)
Vue.config.productionTip = false

new Vue({
  router,
  pinia: getPiniaStore(),
  vuetify,
  render: h => h(App)
}).$mount('#app')
