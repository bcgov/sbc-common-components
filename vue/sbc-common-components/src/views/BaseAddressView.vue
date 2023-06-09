<template>
  <div>
    <h1>Base Address Form</h1>
    <base-address
    ref="baseAddress"
    :editing="true"
    :schema="{}"
    address="1234 Sesame Street"
    valid="isValid"
    streerAddress = "1234 Sesame Street"
  />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import BaseAddress from '../../src/components/BaseAddress.vue'
@Component({
  components: {
    BaseAddress
  }
})
export default class BaseAddressView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
