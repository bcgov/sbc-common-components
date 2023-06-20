<template>
  <div>
    <h1 class="pageTitle" position="absolute">Loading Screen</h1>
    <div>
      <loading-screen :isLoading="true"></loading-screen>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import LoadingScreen from '../../src/components/LoadingScreen.vue'

@Component({
  components: {
    LoadingScreen
  }
})
export default class LoadingScreenView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>

<style lang="scss" scoped>
  .pageTitle{
    position: absolute;
    font-size: 3rem;
    font-weight: bold;
    color: #003366;
    text-align: justify;
    text-align-last: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: #fcba19;
    justify-content: center;
    align-items: center;
    z-index: 5;
  }
</style>
