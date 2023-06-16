<template>
  <v-app id="app">
    <div
      ref="headerGroup"
      class="header-group"
    >
      <sbc-loader :show="false" />
      <sbc-header
        :key="refreshKey"
        ref="header"
        class="flex-column"
        :in-auth="true"
        :show-product-selector="false"
        :show-login-menu="showLoginMenu"
        :redirect-on-logout="logoutUrl"
        @account-switch-started="false"
        @account-switch-completed="false"
        @hook:mounted="setup"
      >
        <template #login-button-text>
          Log in with BC Services Card
        </template>
      </sbc-header>
      <v-snackbar
        v-model="showNotification"
        location="bottom"
        color="primary"
        class="mb-6"
        :timeout="6000"
      >
        <span v-html="notificationText" />
        <v-btn
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
        v-if="bannerText"
        rounded="0"
        density="compact"
        type="warning"
        class="mb-0 text-center color-dk-text"
      />
    </div>
    <div class="app-body">
      <router-view />
    </div>
    <sbc-footer :aboutText="aboutText" />
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router' // Import useRouter from vue-router
import SbcFooter from '/src/components/SbcFooter.vue'
import SbcHeader from '/src/components/SbcHeader.vue'
import SbcLoader from '/src/components/SbcLoader.vue'
import { LDFlags, Pages, SessionStorageKeys } from '@/util/constants'
import LaunchDarklyService from '../src/services/launchdarkly.services'

export default {
  components: {
    SbcHeader,
    SbcFooter,
    SbcLoader
  },
  setup () {
    const store = useStore()
    const router = useRouter() // Access the router information using useRouter

    const showNotification = ref(false)
    const notificationText = ref('')
    const showLoading = ref(true)
    const toastType = 'primary'
    const toastTimeout = 6000
    const logoutUrl = ''

    const currentAccountSettings = computed(() => store.state.org.currentAccountSettings)
    const permissions = computed(() => store.state.org.permissions)
    const currentUser = computed(() => store.state.user.currentUser)
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

    const showNavigationBar = computed(() => router.currentRoute.value.meta.showNavBar) // Use router instead of $route
    const showLoginMenu = computed(() => router.currentRoute.value.path !== `/${Pages.LOGIN}`) // Use router instead of $route

    const bannerText = computed(() => {
      const bannerText = LaunchDarklyService.getFlag(LDFlags.BannerText)
      return bannerText?.trim() || null
    })

    const aboutText = process.env.ABOUT_TEXT

    const setCurrentOrganization = (value) => store.commit('org/setCurrentOrganization', value)
    const loadUserInfo = () => store.dispatch('user/loadUserInfo')

    onMounted(() => {
      sessionStorage.setItem(SessionStorageKeys.StatusApiUrl,
        'https://status-api-dev.apps.silver.devops.gov.bc.ca/api/v1')
      showLoading.value = false
    })

    return {
      showNotification,
      notificationText,
      showLoading,
      toastType,
      toastTimeout,
      logoutUrl,
      currentAccountSettings,
      permissions,
      currentUser,
      isAuthenticated,
      showNavigationBar,
      showLoginMenu,
      bannerText,
      aboutText,
      setCurrentOrganization,
      loadUserInfo
    }
  }
}
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
