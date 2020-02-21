<template>
  <div>
    <v-fade-transition>
      <div class="loading-container" v-if="isLoading">
        <v-progress-circular size="50" width="5" color="primary" :indeterminate="isLoading"/>
      </div>
    </v-fade-transition>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import TokenService from '../services/token.services'
import KeyCloakService from '../services/keycloak.services'

Vue.extend({
  name: 'sbc-signin'
})

@Component({
  methods: {
  }
})

export default class SbcSignin extends Vue {
  private isLoading = true

  @Prop({ default: 'bcsc' }) idpHint: string
  @Prop() redirectUrl: string

  private async mounted () {
    // Initialize keycloak session
    const kcInit = await this.initKeycloak(this.idpHint)
    await new Promise((resolve, reject) => {
      kcInit.success(async authenticated => {
        if (authenticated) {
          // Set values to session storage
          KeyCloakService.initSession()
          // emitting event for the header to get updated with :key increment from the parent component
          this.$root.$emit('keycloakSessionReady')
          // Make a POST to the users endpoint if it's bcsc (only need for BCSC)
          if (this.idpHint === 'bcsc') {
            // emitting the event so that the user profile can be updated from the parent component
            this.$root.$emit('syncUserProfileReady')
            // eslint-disable-next-line no-console
            console.info('[SignIn.vue]Logged in User.Starting refreshTimer')
            var self = this
            let tokenService = new TokenService()
            await tokenService.init()
            tokenService.scheduleRefreshTimer()
          }
          resolve()
        }
      })
    })
  }
  async initKeycloak (idpHint:string) {
    return KeyCloakService.init(idpHint)
  }
}
</script>

<style lang="scss" scoped>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
  }
</style>
