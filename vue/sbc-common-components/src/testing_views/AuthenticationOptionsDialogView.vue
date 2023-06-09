<template>
  <div>
    <h1 class="pageTitle">Authentication Options Dialog</h1>
    <sbc-authentication-options-dialog :showModal="true" :inAuth="true"></sbc-authentication-options-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcAuthenticationOptionsDialog from '../components/SbcAuthenticationOptionsDialog.vue'

@Component({
  components: {
    SbcAuthenticationOptionsDialog
  }
})
export default class AuthenticationOptionsDialogView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
