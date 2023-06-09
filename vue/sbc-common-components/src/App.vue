<template>
  <v-app id="app">
    <div class="header-group" ref="headerGroup">
      <sbc-loader :show="false" />
      <sbc-header
        class="flex-column"
        :key="$store.state.refreshKey"
        :in-auth="true"
        :show-product-selector="false"
        :show-login-menu="true"
        :isModuleRegistered="false"
        :isAuthenticated="false"
        :notificationCount="2"
        :isWhatsNewOpen = "true"
        @account-switch-started="false"
        @account-switch-completed="false"
        @hook:mounted="setup"
        ref="header" :redirect-on-logout="logoutUrl">
        <template v-slot:login-button-text>
          Log in with BC Services Card
        </template>
      </sbc-header>
      <v-snackbar
        bottom
        color="primary"
        class="mb-6"
        v-model="showNotification"
        :timeout=6000
      >
        <span v-html="notificationText"></span>
        <v-btn
          dark
          icon
          color="default"
          aria-label="Close Notification"
          title="Close Notification"
          @click="showNotification = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <!-- Alert banner -->
      <v-alert
        tile dense
        type="warning"
        class="mb-0 text-center colour-dk-text"
        v-if="bannerText"
      />
    </div>
      <div id="nav">
        <v-row justify="center">
          <v-col cols="12" md="7">
            <router-link to="/">Main</router-link> |
            <router-link to="/AuthMenu">Auth Menu</router-link> |
            <router-link to="/AuthenticationOptions">Authentication Options</router-link> |
            <router-link to="/AuthenticationOptionsDialog">Authentication Options Dialog</router-link> |
            <router-link to="/BaseAddress">Base Address</router-link> |
            <router-link to="/BrowserVersionAlert">Browser Version Alert</router-link> |
            <router-link to="/FeeSummary">Fee Summary</router-link> |
            <router-link to="/LoadingScreen">Loading Screen</router-link> |
            <router-link to="/Loader">Loader</router-link> |
            <router-link to="/Login">Login</router-link> |
            <router-link to="/MobileDeviceAlert">Mobile Device Alert</router-link> |
            <router-link to="/NavigationBar">Navigation Bar</router-link> |
            <router-link to="/NotificationPanel">Notification Panel</router-link> |
            <router-link to="/PaySystemAlert">Pay System Alert</router-link> |
            <router-link to="/ProductSelector">Product Selector</router-link> |
            <router-link to="/SignIn">Sign In</router-link> |
            <router-link class="disabled" to="/SignOut">Sign Out</router-link> |
            <router-link to="/SystemAlert">System Alert</router-link> |
            <router-link to="/SystemBanner">System Banner</router-link> |
            <router-link to="/SystemError">System Error</router-link> |
            <router-link to="/SystemErrorModal">System Error Modal</router-link>
          </v-col>
        </v-row>
      </div>
    <div class="app-body">
      <router-view />
    </div>
    <sbc-footer :aboutText='aboutText'></sbc-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import SbcFooter from '/src/components/SbcFooter.vue'
import SbcHeader from '/src/components/SbcHeader.vue'
import SbcLoader from '/src/components/SbcLoader.vue'
import KeyCloakService from '../src/services/keycloak.services'
import { LDFlags, Pages, SessionStorageKeys } from '@/util/constants'
import { appendAccountId } from '../src/util/common-util'
import { getModule } from 'vuex-module-decorators'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import AuthModule from '../src/store/modules/auth'
import { KCUserProfile } from '../src/models/KCUserProfile'
import LaunchDarklyService from '../src/services/launchdarkly.services'
@Component({
  components: {
    SbcHeader,
    SbcFooter,
    SbcLoader
  },
  computed: {
    ...mapState('org', [
      'currentAccountSettings',
      'permissions'
    ]),
    ...mapState('user', ['currentUser']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    ...mapMutations('org', ['setCurrentOrganization']),
    ...mapActions('user', ['loadUserInfo'])
  }
})
export default class App extends Mixins() {
  authModule = getModule(AuthModule, this.$store)
  readonly loadUserInfo!: () => KCUserProfile
  showNotification = false
  notificationText = ''
  showLoading = true
  toastType = 'primary'
  toastTimeout = 6000
  logoutUrl = ''

  $refs: {
    header: SbcHeader
  }

  get showNavigationBar (): boolean {
    return this.$route.meta.showNavBar
  }

  get showLoginMenu (): boolean {
    // Don't show the login menu if the user is on login page
    return this.$route.path !== `/${Pages.LOGIN}`
  }

  get bannerText (): string | null {
    const bannerText: string = LaunchDarklyService.getFlag(LDFlags.BannerText)
    // remove spaces so that " " becomes falsy
    return bannerText?.trim()
  }

  /** The About text. */
  get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  startAccountSwitch () {
    this.showLoading = true
  }

  async setup (isSigninComplete?: boolean) {
    // Header added modules to store so can access mapped actions now
    if (this.$store.getters['auth/isAuthenticated']) {
      try {
        if (!isSigninComplete) {
          await KeyCloakService.initializeToken(this.$store)
        }
        this.loadUserInfo()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('App.vue.setup Error: ' + e)
        this.$store.dispatch('user/reset')
        this.$store.commit('loadComplete')
        this.$router.push('/home')
      }
    }
    this.$store.commit('loadComplete')
  }
}
</script>
<style lang="scss">
#nav{
  padding: 5px;
  text-align: justify;
  text-align-last: center;
  z-index: 100;
  a{
    font-weight: bold;
    color: #adb5bd;
    &.router-link-exact-active{
      color: #003366;
    }
    &:hover{
      color: #2de0a5;
    }
  }
}
.navCol{
  padding: 10px;
  text-align: justify;
  text-align-last: center;
}

.app-container {
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh
  }

  .header-group {
    position: sticky;
    position: -webkit-sticky; /* For Safari support */
    top: 0;
    width: 100%;
    z-index: 2;
  }
  .pageTitle{
    font-size: 3rem;
    font-weight: bold;
    color: #003366;
    text-align: justify;
    text-align-last: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: #fcba19;
    justify-content: center;
    align-items: center;
    z-index: 5;
  }

  .app-body {
    flex: 1 1 auto;
    position: relative;
  }
  .disabled {
    pointer-events: none;
    background: red;
    opacity: 0.24;
}

</style>
