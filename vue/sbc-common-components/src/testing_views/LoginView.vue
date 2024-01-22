<template>
  <div>
    <h1 class="pageTitle">
      Login
    </h1>
    <SbcLogin :redirectUrl="redirectUrl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SbcLogin from '@sbc/components/SbcLogin.vue'

export default defineComponent({
  components: {
    SbcLogin
  },
  setup () {
    const redirectUrl = ref('')

    return {
      redirectUrl
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@sbc/assets/scss/theme.scss';

:deep(.sbc-signin-button) {
  width: 100%;
}
</style>
