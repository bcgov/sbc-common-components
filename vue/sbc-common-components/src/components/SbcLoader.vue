<template>
  <v-overlay :v-model="show">
    <v-progress-circular
      size="50"
      width="5"
      :color="progressColor"
      :indeterminate="indeterminate"
      :z-index="zIndex"
    />
    <span class="ml-3">{{ message }}</span>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, Prop } from 'vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Account Switching In Progress'
    },
    progressColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      indeterminate: true,
      zIndex: 9
    }
  }
})
</script>
