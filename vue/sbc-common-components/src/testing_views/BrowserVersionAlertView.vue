<template>
  <browser-version-alert :trigger-popup="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BrowserVersionAlert from '../../src/components/BrowserVersionAlert.vue'

export default defineComponent({
  name: 'BrowserVersionAlertView',
  components: {
    BrowserVersionAlert
  },
  computed: {
    redirectUrl () {
      return (this.$route.query.redirect as string)
    }
  }
})
</script>

<style scoped lang="scss">
.v-alert__wrapper {
  margin: 0 auto;
  max-width: 1382px;
}
</style>
