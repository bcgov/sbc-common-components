<template>
  <div class="layout-wrapper">
    <sbc-loader  />
    <sbc-header
    class="flex-column"
        :key="$store.state.refreshKey"
        :in-auth="true"
        :show-product-selector="false"
        :show-login-menu="false"
        :isModuleRegistered="false"
        :isAuthenticated="false"
        :notificationCount="2"
        :isWhatsNewOpen = "true"
        @account-switch-started="false"
        @account-switch-completed="false"
        @hook:mounted="true"></sbc-header>
    <div class="app-body">
      <div id="app">
        <div id="nav">
          <router-link to="/">Main</router-link> |
          <router-link to="/SignIn">Sign In</router-link> |
          <router-link to="/SignOut">Sign Out</router-link> |
          <router-link to="/Login">Login</router-link> |
          <router-link to="/NotificationPanel">Notification Panel</router-link> |
          <router-link to="/About">About</router-link> |
          <router-link to="/Home">Home </router-link>
        </div>
        <router-view/>
      </div>
    </div>
    <sbc-footer></sbc-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SbcFooter from '/src/components/SbcFooter.vue'
import SbcHeader from '/src/components/SbcHeader.vue'
import SbcLoader from '/src/components/SbcLoader.vue'

import { LoginSource, Pages, Role, SessionStorageKeys } from '@/util/constants'

export default Vue.extend({
  name: 'App',
  components: {
    SbcHeader,
    SbcFooter,
    SbcLoader
  }
})
</script>
<style lang="scss">
#nav{
  padding: 5px;
  text-align: justify;
  text-align-last: center;
  a{
    font-weight: bold;
    color: #adb5bd;
    &.router-link-exact-active{
      color: #003366;
    }
  }
}
</style>
