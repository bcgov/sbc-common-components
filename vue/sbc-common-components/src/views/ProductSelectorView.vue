<template>
  <div>
  <h1 class="pageTitle">Product Selector</h1>
  <div class="prod">
    <sbc-product-selector/>
  </div>
</div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcProductSelector from '../components/SbcProductSelector.vue'
  /**
   * Operation:
   * 1. When this component is first loaded (ie, we are not authenticated) then the
   *    SbcLogin component will redirect us to log in.
   */
  @Component({
    components: {
      SbcProductSelector
    }
  })
export default class ProductSelectorView extends Vue {
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

.prod{
  background-color: #003366;
  justify-content: center;
}
</style>
