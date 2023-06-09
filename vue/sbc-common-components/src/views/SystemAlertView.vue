NOTE, Since this component uses mounts calls to check if the system is down,
calling the component will not work to display it. The sbc-system-banner HTML
must me copied into this file to display the component properly.
<template>
  <div>
    <h1 class="pageTitle">System Banners</h1>
    <h2>Please refer to the note at the top of SystemAlertView.vue if
        you are using this page to test the SbcSystemAlert component.</h2>
    <sbc-system-banner :setDismissible="true" setMessage="{serviceName} processing is currently not available for corporate filings." :setShow="true" setType="warning"></sbc-system-banner>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcSystemAlert from '../../src/components/SbcSystemAlert.vue'
import SbcSystemBanner from '../../src/components/SbcSystemBanner.vue'

@Component({
  components: {
    SbcSystemAlert,
    SbcSystemBanner
  }
})
export default class SystemAlertView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
