<template>
  <div>
    <h1 class="pageTitle">
      System Banners
    </h1>
    <SbcSystemBanner
      :setDismissible="true"
      setMessage="Success Banner"
      :setShow="true"
      setType="success"
      setIcon="mdi-apple"
    />
    <SbcSystemBanner
      :setDismissible="true"
      setMessage="Info Banner"
      :setShow="true"
      setType="info"
      setIcon="mdi-football-helmet"
    />
    <SbcSystemBanner
      :setDismissible="true"
      setMessage="Warning Banner"
      :setShow="true"
      setType="warning"
      setIcon="mdi-panda"
    />
    <SbcSystemBanner
      :setDismissible="true"
      setMessage="Error Banner"
      :setShow="true"
      setType="error"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SbcSystemBanner from '../../src/components/SbcSystemBanner.vue'

export default defineComponent({
  components: {
    SbcSystemBanner
  },
  computed: {
    redirectUrl (): string {
      return this.$route.query.redirect as string
    }
  }
})
</script>
