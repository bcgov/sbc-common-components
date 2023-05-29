<template>
  <div class="layout-wrapper">
    <sbc-loader :show="showLoading" />
    <sbc-header></sbc-header>
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
      <slot name="app-body"></slot>
      <div class="app-body__inner">
        <slot name="app-body_inner"></slot>
        <div class="container">
          <main>
            <slot></slot>
          </main>
        </div>
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
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav{
  padding: 30px;
  a{
    font-weight: bold;
    color: #adb5bd;
    &.router-link-exact-active{
      color: #003366;
    }
  }
}
</style>
