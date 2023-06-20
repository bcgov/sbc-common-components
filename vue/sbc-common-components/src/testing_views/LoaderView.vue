<template>
  <div>
    <h1 class="pageTitle">Loader</h1>
    <sbc-loader :show="true" message="Display message here" progressColor="blue"></sbc-loader>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import SbcLoader from '../../src/components/SbcLoader.vue'

@Component({
  components: {
    SbcLoader
  }
})
export default class LoaderView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
