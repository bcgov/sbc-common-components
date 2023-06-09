<template>
  <div>
    <h1 class="pageTitle">Notification Panel</h1>
    <notification-panel :showNotifications="true"></notification-panel>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
// Components
import NotificationPanel from '../../src/components/NotificationPanel.vue'

@Component({
  components: {
    NotificationPanel
  }
})
export default class NotificationPanelView extends Vue {
  get redirectUrl () {
    return (this.$route.query.redirect as string)
  }
}
</script>
