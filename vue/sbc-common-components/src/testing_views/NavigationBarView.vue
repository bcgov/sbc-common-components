<template>
  <div>
    <h1 class="pageTitle">Navigation Bar</h1>
    <navigation-bar :hide="false" :config="navigationBarConfig" :configuration="navigationBarConfig"></navigation-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// Components
import NavigationBar from '../../src/components/NavigationBar.vue'
import { NavigationBarConfig, NavigationMenuItem, NavigationMenuItemMetaConfig } from '../models/NavigationBarConfig'

@Component({
  components: {
    NavigationBar
  }
})
export default class NavigationBarView extends Vue {
navigationBarConfig: NavigationBarConfig = {
  titleItem: {
    name: 'Main',
    url: '/',
    mdiIcon: 'home',
    meta: {
      requiresAuth: false,
      requiresAccount: false
    }
  },
  menuItems: [
    {
      name: 'Auth Menu',
      url: '/AuthMenu',
      mdiIcon: 'mdi-menu',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    },
    {
      name: 'Authentication Options',
      url: '/AuthenticationOptions',
      mdiIcon: 'mdi-lock',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    },
    {
      name: 'Authentication Options Dialog',
      url: '/AuthenticationOptionsDialog',
      mdiIcon: 'lock-question',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    },
    {
      name: 'Base Address',
      url: '/BaseAddress',
      mdiIcon: 'map-marker',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    },
    {
      name: 'Browser Version Alert',
      url: '/BrowserVersionAlert',
      mdiIcon: 'alert-circle',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    },
    {
      name: 'Fee Summary',
      url: '/FeeSummary',
      mdiIcon: 'currency-usd',
      meta: {
        requiresAuth: false,
        requiresAccount: false
      }
    }
  ]
}

get redirectUrl () {
  return (this.$route.query.redirect as string)
}
}
</script>
