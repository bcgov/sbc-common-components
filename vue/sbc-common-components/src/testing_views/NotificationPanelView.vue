<template>
  <div>
    <h1 class="pageTitle">
      Notification Panel
    </h1>
    <notification-panel :showNotifications="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotificationPanel from '../../src/components/NotificationPanel.vue'

export default defineComponent({
  components: {
    NotificationPanel
  },
  computed: {
    redirectUrl () {
      return (this.$route.query.redirect as string)
    }
  }
})
</script>
