<template>
  <v-overlay :value="show">
      <v-progress-circular size="50" width="5" :color="progressColor"
        :indeterminate="indeterminate"
        :z-index="zIndex"
      ></v-progress-circular>
      <span class="ml-3">{{message}}</span>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component({})
export default class SbcLoader extends Vue {
  @Prop({ default: false })
  show!: boolean
  @Prop({ default: 'Account Switching In Progress' })
  message!: string
  @Prop({ default: '' })
  progressColor!: string
  indeterminate = true
  zIndex = 9
}
</script>
