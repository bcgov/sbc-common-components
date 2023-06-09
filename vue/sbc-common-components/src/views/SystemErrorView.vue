<template>
  <div>
    <h1 class="pageTitle">System Error</h1>
    <sbc-system-error></sbc-system-error>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcSystemError from '../../src/components/SbcSystemError.vue'

@Component({
  components: {
    SbcSystemError
  }
})
export default class SystemErrorView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
