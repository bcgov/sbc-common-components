<template>
  <div>
    <h1 class="pageTitle">
      Mobile Device Alert
    </h1>
    <br>
    <mobile-device-alert :triggerPopup="mobileDevice" />
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import MobileDeviceAlert from '@/components/MobileDeviceAlert.vue'

export default {
  name: 'MobileDeviceAlertView',
  components: {
    MobileDeviceAlert
  },
  setup () {
    const mobileDevice = ref(false)
    onMounted(() => {
      mobileDevice.value = true
    })
    return {
      mobileDevice,
      redirectUrl: ''
    }
  }
}
</script>

<style scoped lang="scss">
.note {
  text-align: justify;
  text-align-last: center;
}
</style>
