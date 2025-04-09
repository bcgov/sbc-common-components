<template>
  <sbc-system-banner
    v-if="hasPayMessage"
    v-bind:show="hasPayMessage"
    type="warning"
    v-bind:message="alertMessage"
  ></sbc-system-banner>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import SbcSystemBanner from './SbcSystemBanner.vue'
import { useStatusStore } from '../stores/status'
import { mapState, mapActions } from 'pinia'
import { ServiceStatus } from '../models/ServiceStatus'

@Component({
  components: {
  SbcSystemBanner
  },
  beforeCreate () {
  this.$options.computed = {
  ...(this.$options.computed || {}),
  ...mapState(useStatusStore, ['paySystemStatus'])
  }
  this.$options.methods = {
  ...(this.$options.methods || {}),
  ...mapActions(useStatusStore, ['fetchPaySystemStatus'])
  }
  }
  })
export default class PaySystemAlert extends Vue {
  private statusAPIResponse : ServiceStatus | null = null
  private readonly paySystemStatus!: ServiceStatus
  private readonly fetchPaySystemStatus!: () => Promise<ServiceStatus>
  private getBoolean (value: boolean | string | number): boolean {
    var resultVal = value
    if (typeof value === 'string') {
      resultVal = value.toLowerCase()
    }
    switch (resultVal) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
      case 'none':
        return true
      default:
        return false
    }
  }

  private async mounted () {
    try {
      this.statusAPIResponse = await this.fetchPaySystemStatus()
    } catch (error) {
      this.statusAPIResponse = null
    }
  }

  private get alertMessage () {
    return this.paySystemStatus?.customMessage ? this.paySystemStatus.customMessage : this.paySystemStatus.message
  }

  private get hasPayMessage () {
    return this.statusAPIResponse && (!this.getBoolean(this.paySystemStatus?.currentStatus) || this.paySystemStatus?.customMessage)
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-alert__wrapper {
      margin: 0 auto;
      max-width: 1224px;
    }
  }
</style>
