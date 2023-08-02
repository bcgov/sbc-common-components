import 'core-js/stable' // to polyfill ECMAScript features
import '@mdi/font/css/materialdesignicons.min.css' // icon library (https://materialdesignicons.com/)
import 'regenerator-runtime/runtime' // to use transpiled generator functions
import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import { createVueRouter } from './router'
import KeycloakService from '../src/services/keycloak.services'
import { createPinia } from 'pinia'

declare const window: any

// main code
async function start () {
  // fetch config from environment and API
  // must come first as inits below depend on config
  const router = createVueRouter()
  const app = createApp(App)
  const pinia = createPinia()

  // configure Keycloak Service
  console.info('Starting Keycloak service...') // eslint-disable-line no-console
  const keycloakConfig: any = {
    url: `${window['keycloakAuthUrl']}`,
    realm: `${window['keycloakRealm']}`,
    clientId: `${window['keycloakClientId']}`
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)

  // start Vue application
  console.info('Starting app...') // eslint-disable-line no-console
  app.use(router).use(pinia).use(vuetify).mount('#app')
}

start().catch(error => {
  console.error(error) // eslint-disable-line no-console
  alert(
    'There was an error starting this page. (See console for details.)\n' +
      'Please try again later.'
  )
})
