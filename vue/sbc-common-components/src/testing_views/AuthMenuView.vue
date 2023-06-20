<template>
  <div>
    <h1 class="pageTitle">Auth Menu</h1>
    <sbc-auth-menu />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcAuthMenu from '../../src/components/SbcAuthMenu.vue'
  /**
   * Operation:
   * 1. When this component is first loaded (ie, we are not authenticated) then the
   *    SbcLogin component will redirect us to log in.
   */
  @Component({
    components: {
      SbcAuthMenu
    }
  })
export default class AuthMenuView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
</style>
