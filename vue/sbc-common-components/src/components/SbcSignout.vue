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
import KeyCloakService from '../services/keycloak.services'

Vue.extend({
  name: 'sbc-signout'
})

@Component({
  methods: {
  }
})

export default class SbcSignout extends Vue {
  private isLoading = true

  @Prop() redirectUrl: string

  private async mounted () {
    await KeyCloakService.logout(this.redirectUrl ? decodeURIComponent(this.redirectUrl) : null)
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
