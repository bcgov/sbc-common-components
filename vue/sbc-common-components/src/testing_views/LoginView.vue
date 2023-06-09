<template>
  <div>
    <h1 class="pageTitle">Login</h1>
    <sbc-login :redirectUrl="redirectUrl" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcLogin from '../../src/components/SbcLogin.vue'
  /**
   * Operation:
   * 1. When this component is first loaded (ie, we are not authenticated) then the
   *    SbcLogin component will redirect us to log in.
   */
  @Component({
    components: {
      SbcLogin
    }
  })
export default class LoginView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

::v-deep .sbc-signin-button {
  width: 100%;
}
</style>
