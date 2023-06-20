NOTE, Since this component uses API calls to check for a users pay messages,
calling the component will not work to display it. The sbc-system-banner HTML
must me copied into this file to display the component properly.
<template>
  <div>
    <h1 class="pageTitle">Pay System Alert</h1>
    <h2>Please refer to the note at the top of PaySystemAlertView if
        you are using this page to test the PaySystemAlert component.</h2>
    <sbc-system-banner :setDismissible="true" setMessage="Pay Alert Message" :setShow="true" setType="warning"></sbc-system-banner>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import PaySystemAlert from '../../src/components/PaySystemAlert.vue'
import SbcSystemBanner from '../../src/components/SbcSystemBanner.vue'

@Component({
  components: {
    PaySystemAlert,
    SbcSystemBanner

  }
})
export default class PaySystemAlertView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
