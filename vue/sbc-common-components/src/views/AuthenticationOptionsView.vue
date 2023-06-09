<template>
  <div>
    <h1 class="pageTitle">Authentication Options</h1>
    <sbc-authentication-options></sbc-authentication-options>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcAuthenticationOptions from '../../src/components/SbcAuthenticationOptions.vue'

@Component({
  components: {
    SbcAuthenticationOptions
  }
})
export default class AuthenticationOptionsView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
