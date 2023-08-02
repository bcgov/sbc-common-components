<template>
  <v-alert
    v-model="state.show"
    class="py-2"
    :type="state.type"
    close-icon="mdi-close-circle mdi-24px mt-3"
    :closable="state.dismissible"
    :prominent="true"
  >
    <div class="px-3">
      <span v-html="state.message" />
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const props = defineProps({
  setDismissible: { default: false, type: Boolean },
  setIcon: { default: 'mdi-information', type: String }, // See https://material.io/resources/icons/?style=baseline
  setMessage: { default: '', type: String },
  setShow: { default: false, type: Boolean },
  setType: { default: 'warning', type: String }
})

const state = reactive({
  dismissible: computed(() => { return props.setDismissible }),
  icon: computed(() => { return props.setIcon }),
  message: computed(() => { return props.setMessage }),
  show: computed(() => { return props.setShow }),
  type: computed(() => { return props.setType as 'info' | 'warning' | 'error' | 'success' })
})
</script>

<style lang="scss" scoped>
.v-alert {
  border-radius: 0;
  margin-top: 10px;
}
.close-icon{
  font-size: 30px;
}
.v-alert :deep(.v-alert__wrapper) {
  margin: 0;
  overflow: hidden;
}

:deep(.v-alert__content) {
  max-width: 1360px;  // should match sbc header / breadcrumb max widths
  width: 100%;
}
</style>
