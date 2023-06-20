<template>
  <div>
    <h1 class="pageTitle">System Banners</h1>
    <sbc-system-banner :setDismissible="true" setMessage="Success Banner" :setShow="true" setType="success" setIcon="mdi-apple"></sbc-system-banner>
    <sbc-system-banner :setDismissible="true" setMessage="Info Banner" :setShow="true" setType="info" setIcon="mdi-football-helmet"></sbc-system-banner>
    <sbc-system-banner :setDismissible="true" setMessage="Warning Banner" :setShow="true" setType="warning" setIcon="mdi-panda"></sbc-system-banner>
    <sbc-system-banner :setDismissible="true" setMessage="Error Banner" :setShow="true" setType="error" setIcon="mdi-biohazard"></sbc-system-banner>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcSystemBanner from '../../src/components/SbcSystemBanner.vue'

@Component({
  components: {
    SbcSystemBanner
  }
})
export default class SystemBannerView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
