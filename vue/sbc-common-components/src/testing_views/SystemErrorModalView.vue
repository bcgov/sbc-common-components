<template>
  <div>
    <h1 class="pageTitle">System Error Modal</h1>
    <sbc-system-error-modal :showModal="true"></sbc-system-error-modal>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcSystemErrorModal from '../../src/components/SbcSystemErrorModal.vue'

@Component({
  components: {
    SbcSystemErrorModal
  }
})
export default class SystemErrorModalView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
