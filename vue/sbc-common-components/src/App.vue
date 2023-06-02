<template>
  <v-app id="app">
    <div class="header-group" ref="headerGroup">
      <sbc-loader :show="false" />
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
        @hook:mounted="true"
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
        v-html="bannerText"
      />
    </div>
    <div id="nav">
          <router-link to="/">Main</router-link> |
          <router-link to="/SignIn">Sign In</router-link> |
          <router-link to="/SignOut">Sign Out</router-link> |
          <router-link to="/Login">Login</router-link> |
          <router-link to="/NotificationPanel">Notification Panel</router-link> |
          <router-link to="/About">About</router-link> |
          <router-link to="/Home">Home </router-link>
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
import { LoginSource, LDFlags, Pages, Role, SessionStorageKeys } from '@/util/constants'
import { appendAccountId } from '../src/util/common-util'
import { getModule } from 'vuex-module-decorators'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import AuthModule from '../src/store/modules/auth'
import { Event } from '@/models/event'
import { KCUserProfile } from '../src/models/KCUserProfile'
import LaunchDarklyService from '../src/services/launchdarkly.services'
import CommonUtils from '@/util/common-util'

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
  public authModule = getModule(AuthModule, this.$store)
  public businessStore = getModule(BusinessModule, this.$store)
  public readonly loadUserInfo!: () => KCUserProfile
  public showNotification = false
  public notificationText = ''
  public showLoading = true
  public toastType = 'primary'
  public toastTimeout = 6000
  public logoutUrl = ''

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

  /** The route breadcrumbs list. */
  get breadcrumbs (): Array<BreadcrumbIF> {
    const currentAccountId = this.currentOrganization?.id || ''
    const breadcrumb = this.$route?.meta?.breadcrumb || []
    // updating breadcrumb url with account id if its external URL
    const breadcrumbwithAccountId = breadcrumb.map(items => {
      const newItem = { ...items }
      if (newItem && newItem.href) {
        newItem.href = appendAccountId(items.href, currentAccountId.toString())
      }
      return newItem
    })

    return [...(breadcrumbwithAccountId || [])]
  }

  /** The About text. */
  get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  public startAccountSwitch () {
    this.showLoading = true
  }

  public async completeAccountSwitch () {
    await this.syncUser()
    this.showLoading = false
    this.toastType = 'primary'
    this.notificationText = `Switched to account '${this.currentAccountSettings.label}'`
    this.showNotification = true

    this.$store.commit('updateHeader')

    this.accountFreezeRedirect()
    this.accountPendingRedirect()
  }

  public async created () {
    // If session is synced, then sync user details
    if (ConfigHelper.getFromSession(SessionStorageKeys.SessionSynced) === 'true' && !CommonUtils.isSigningIn() && !CommonUtils.isSigningOut()) {
      this.loadUserInfo()
      await this.syncUser()
      this.$store.commit('loadComplete')
    }
  }

  public async mounted (): Promise<void> {
    this.showLoading = false

    EventBus.$on('show-toast', (eventInfo: Event) => {
      this.showNotification = true
      this.notificationText = eventInfo.message
      this.toastType = eventInfo.type
      this.toastTimeout = eventInfo.timeout
    })

    // set logout url after refresh
    this.setLogOutUrl()

    // Listen for event from signin component so it can initiate setup
    this.$root.$on('signin-complete', async (callback) => {
      await this.setup(true)
      // set logout url on first time sigin
      this.setLogOutUrl()
      callback()
    })
  }

  public setLogOutUrl () {
    this.logoutUrl = (this.$store.getters['auth/currentLoginSource'] === LoginSource.BCROS) ? ConfigHelper.getBcrosURL() : ''
  }

  public destroyed () {
    this.$root.$off('signin-complete')
  }

  public async setup (isSigninComplete?: boolean) {
    // Header added modules to store so can access mapped actions now
    if (this.$store.getters['auth/isAuthenticated']) {
      try {
        if (!isSigninComplete) {
          await KeyCloakService.initializeToken(this.$store)
        }
        this.loadUserInfo()
        await this.syncUser()
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
  a{
    font-weight: bold;
    color: #adb5bd;
    &.router-link-exact-active{
      color: #003366;
    }
  }
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

  .app-body {
    flex: 1 1 auto;
    position: relative;
  }

</style>
