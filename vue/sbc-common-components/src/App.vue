<template>
  <v-app id="app">
    <div class="header-group" ref="headerGroup">
      <sbc-loader :show="false" />
      <sbc-header
        class="flex-column"
        :key="refreshKey"
        :in-auth="true"
        :show-product-selector="false"
        :show-login-menu="showLoginMenu"
        @account-switch-started="false"
        @account-switch-completed="false"
        @hook:mounted="setup"
        ref="header"
        :redirect-on-logout="logoutUrl"
      >
        <template #login-button-text>
          Log in with BC Services Card
        </template>
      </sbc-header>
      <v-snackbar
        bottom
        color="primary"
        class="mb-6"
        v-model="showNotification"
        :timeout="6000"
      >
        <span v-html="notificationText"></span>
        <v-btn
          dark
          icon
          color="default"
          aria-label="Close Notification"
          title="Close Notification"
          @click="showNotification = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <!-- Alert banner -->
      <v-alert
        tile
        dense
        type="warning"
        class="mb-0 text-center color-dk-text"
        v-if="bannerText"
      />
    </div>
    <div class="app-body">
      <router-view />
    </div>
    <sbc-footer :aboutText="aboutText"></sbc-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import SbcFooter from '/src/components/SbcFooter.vue'
import SbcHeader from '/src/components/SbcHeader.vue'
import SbcLoader from '/src/components/SbcLoader.vue'
import KeyCloakService from '../src/services/keycloak.services'
import { LDFlags, Pages, SessionStorageKeys } from '@/util/constants'
import { appendAccountId } from '../src/util/common-util'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '../src/store/modules/auth'
import { KCUserProfile } from '../src/models/KCUserProfile'
import LaunchDarklyService from '../src/services/launchdarkly.services'

export default defineComponent({
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
    ...mapGetters('auth', ['isAuthenticated']),
    showNavigationBar () {
      return this.$route.meta.showNavBar
    },
    showLoginMenu () {
      return this.$route.path !== `/${Pages.LOGIN}`
    },
    bannerText () {
      const bannerText = LaunchDarklyService.getFlag(LDFlags.BannerText)
      return bannerText?.trim() || null
    },
    aboutText () {
      return process.env.ABOUT_TEXT
    }
  },
  methods: {
    ...mapMutations('org', ['setCurrentOrganization']),
    ...mapActions('user', ['loadUserInfo'])
  },
  data () {
    return {
      showNotification: false,
      notificationText: '',
      showLoading: true,
      toastType: 'primary',
      toastTimeout: 6000,
      logoutUrl: ''
    }
  },
  mounted () {
    sessionStorage.setItem(SessionStorageKeys.StatusApiUrl, 'https://status-api-dev.apps.silver.devops.gov.bc.ca/api/v1')
    this.showLoading = false
  }
})
</script>

<style lang="scss">
#nav {
  padding: 5px;
  text-align: justify;
  text-align-last: center;
  z-index: 100;

  a {
    font-weight: bold;
    color: #adb5bd;

    &.router-link-exact-active {
      color: #003366;
    }

    &:hover {
      color: #2de0a5;
    }
  }
}

.navCol {
  padding: 10px;
  text-align: justify;
  text-align-last: center;
}

.app-container {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
}

.header-group {
  position: sticky;
  position: -webkit-sticky; /* For Safari support */
  top: 0;
  width: 100%;
  z-index: 2;
}

.pageTitle {
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
