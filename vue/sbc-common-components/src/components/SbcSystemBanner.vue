<template>
  <v-alert
    v-model="showBanner"
    class="py-2"
    :type="type"
    close-icon="mdi-close-circle mdi-24px mt-3"
    :closable="dismissible"
    :prominent="true"
  >
    <div class="px-3">
      <span v-html="message" />
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Defaults don't apply here anymore, required to be set explicity
const props = defineProps<{
  dismissible: boolean,
  icon: string, // See https://material.io/resources/icons/?style=baseline was mdi-information
  message: string,
  show: boolean,
  type: 'error' | 'success' | 'warning' | 'info' // was 'warning'
}>()

const showBanner = computed(() => props.show)
</script>

<style lang="scss" scoped>
.v-alert {
  border-radius: 0;
  margin-top: 10px;
}
.close-icon{
  font-size: 30px;
}
.v-alert :deep(.v-alert__wrap per) {
  margin: 0;
  overflow: hidden;
}

:deep(.v-alert__content) {
  max-width: 1360px;  // should match sbc header / breadcrumb max widths
  width: 100%;
}
</style>
