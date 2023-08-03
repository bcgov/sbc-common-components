<template>
  <div>
    <h1 class="pageTitle">
      System Banners
    </h1>
    <SbcSystemBanner
      :dismissible="true"
      message="Success Banner"
      :show="true"
      type="success"
      icon="mdi-apple"
    />
    <SbcSystemBanner
      :dismissible="true"
      message="Info Banner"
      :show="true"
      type="info"
      icon="mdi-football-helmet"
    />
    <SbcSystemBanner
      :dismissible="true"
      message="Warning Banner"
      :show="true"
      type="warning"
      icon="mdi-panda"
    />
    <SbcSystemBanner
      :dismissible="true"
      message="Error Banner"
      :show="true"
      type="error"
      icon="mdi-information"
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
