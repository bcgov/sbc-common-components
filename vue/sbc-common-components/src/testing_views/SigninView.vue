<template>
  <div>
    <h1 class="pageTitle">
      Sign in
    </h1>
    <suspense>
      <sbc-signin />
    </suspense>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navigate } from '../util/navigate'
import SbcSignin from '../../src/components/SbcSignin.vue'

const route = useRoute()
const props = defineProps({
  registryUrl: {
    type: String,
    default: sessionStorage.getItem('REGISTRY_URL')
  }
})
const emit = defineEmits(['profileReady'])
</script>

<style lang="scss" scoped>
.pageTitle {
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
