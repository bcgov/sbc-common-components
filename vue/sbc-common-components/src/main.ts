import 'core-js/stable' // to polyfill ECMAScript features
import '@mdi/font/css/materialdesignicons.min.css' // icon library (https://materialdesignicons.com/)
import 'regenerator-runtime/runtime' // to use transpiled generator functions
import { createApp } from 'vue'
import Vuelidate from 'vuelidate'
import Vue2Filters from 'vue2-filters'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import { createVueRouter } from './router'
import store from './store'

declare const window: any

// main code
async function start () {
  console.info('Version', process.env.VUE_APP_VERSION)
  // fetch config from environment and API
  // must come first as inits below depend on config
  const router = createVueRouter()
  const app = createApp(App)

  // start Vue application
  console.info('Starting app...') // eslint-disable-line no-console
  app.use(router).use(store).use(vuetify).mount('#app')
}

start().catch(error => {
  console.error(error) // eslint-disable-line no-console
  alert(
    'There was an error starting this page. (See console for details.)\n' +
      'Please try again later.'
  )
})
