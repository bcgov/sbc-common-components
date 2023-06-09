<template>
  <div>
    <h1 class="pageTitle">Fee Summary</h1>
    <sbc-fee-summary></sbc-fee-summary>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcFeeSummary from '../../src/components/SbcFeeSummary.vue'

@Component({
  components: {
    SbcFeeSummary
  }
})
export default class FeeSummaryView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
