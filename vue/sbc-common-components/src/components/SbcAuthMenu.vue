<template>
  <!-- Login Menu -->
  <v-card>
    <div>
      <v-card-title class="text-body-2 font-weight-bold">
        Select login method
      </v-card-title>
      <v-divider />
    </div>
    <v-list density="compact">
      <v-list-item
        v-for="loginOption in loginOptions"
        :key="loginOption.idpHint"
        class="items pr-6"
        :prepend-icon="loginOption.icon"
        :title="loginOption.option"
        @click="login(loginOption.idpHint)"
      />
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Role, IdpHint, LoginSource, Pages } from '../../src/util/constants'
import { useNavigation } from '../composables'
import KeyCloakService from '../services/keycloak.services'
import { useAccountStore, useAuthStore } from '../store'

const accountStore = useAccountStore()
const authStore = useAuthStore()

const props = defineProps({
  fromLogin: { default: false, type: Boolean },
  inAuth: { default: false, type: Boolean },
  redirectOnLoginSuccess: { default: '', type: String },
  redirectOnLoginFail: { default: '', type: String }
})

// module getters
const isAuthenticated = computed(() => { return authStore.isAuthenticated })
const currentLoginSource = computed(() => { return authStore.currentLoginSource })
// auth

// composables
const { getContextPath, redirectToPath } = useNavigation()

// constants
const loginOptions = [
  { idpHint: IdpHint.BCSC, option: 'BC Services Card', icon: 'mdi-account-card-details-outline' },
  { idpHint: IdpHint.BCEID, option: 'BCeID', icon: 'mdi-two-factor-authentication' },
  { idpHint: IdpHint.IDIR, option: 'IDIR', icon: 'mdi-account-group-outline' }
]

// local variables
const currentAccount = computed(() => accountStore.state.currentAccount)
const isBceid = computed(() => currentLoginSource?.value === LoginSource.BCEID)

onMounted(async () => {
  authStore.syncWithSessionStorage()
  if (isAuthenticated?.value) {
    await accountStore.loadUserInfo()
    await accountStore.syncAccount()
    await updateProfile()
    // checking for account status
    await checkAccountStatus()
  }
})

// component functions
const updateProfile = async (): Promise<void> => {
  if (isBceid?.value) {
    await accountStore.syncUserProfile()
  }
}
watch(isAuthenticated, async (val: boolean) => {
  if (val) { await updateProfile() }
})

const checkAccountStatus = async () => {
  // redirect if account status is suspended
  if (currentAccount?.value?.accountStatus && currentAccount?.value?.accountStatus === 'NSF_SUSPENDED') {
    redirectToPath(props.inAuth, `${Pages.ACCOUNT_FREEZ}`)
  } else if (currentAccount?.value?.accountStatus === 'PENDING_AFFIDAVIT_REVIEW') {
    redirectToPath(props.inAuth, `${Pages.PENDING_APPROVAL}/${accountName.value}/true`)
  }
}

const login = (idpHint: string) => {
  if (!props.fromLogin) {
    if (props.redirectOnLoginSuccess) {
      let url = encodeURIComponent(props.redirectOnLoginSuccess)
      url += props.redirectOnLoginFail ? `/${encodeURIComponent(props.redirectOnLoginFail)}` : ''
      window.location.assign(`${getContextPath()}signin/${idpHint}/${url}`)
    } else {
      window.location.assign(`${getContextPath()}signin/${idpHint}`)
    }
  } else {
    // Initialize keycloak session
    const kcInit = KeyCloakService.initializeKeyCloak(idpHint)
    kcInit.then(async (authenticated: boolean) => {
      if (authenticated) {
        // eslint-disable-next-line no-console
        console.info('[SignIn.vue]Logged in User. Init Session and Starting refreshTimer')
        // Set values to session storage
        await KeyCloakService.initSession()
        // tell KeycloakServices to load the user info
        const userInfo = await accountStore.loadUserInfo()

        // update user profile
        await accountStore.updateUserProfile()

        // sync the account if there is one
        await accountStore.syncAccount()

        // if not from the sbc-auth, do the checks and redirect to sbc-auth
        if (!props.inAuth) {
          console.log('[SignIn.vue]Not from sbc-auth. Checking account status')
          // redirect to create account page if the user has no 'account holder' role
          const isRedirectToCreateAccount = (
            userInfo.roles.includes(Role.PublicUser) && !userInfo.roles.includes(Role.AccountHolder))

          const currentUser = await accountStore.getCurrentUserProfile(props.inAuth)

          if ((userInfo?.loginSource !== LoginSource.IDIR) && !(currentUser?.userTerms?.isTermsOfUseAccepted)) {
            console.log('[SignIn.vue]Redirecting. TOS not accepted')
            redirectToPath(props.inAuth, Pages.USER_PROFILE_TERMS)
          } else if (isRedirectToCreateAccount) {
            console.log('[SignIn.vue]Redirecting. No Valid Role')
            switch (userInfo.loginSource) {
              case LoginSource.BCSC:
                redirectToPath(props.inAuth, Pages.CREATE_ACCOUNT)
                break
              case LoginSource.BCEID:
                redirectToPath(props.inAuth, Pages.CHOOSE_AUTH_METHOD)
                break
            }
          }
        }
      }
    }).catch(() => {
      if (props.redirectOnLoginFail) {
        window.location.assign(decodeURIComponent(props.redirectOnLoginFail))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";
.v-list--dense .v-subheader,
.v-list-item {
  height: 40px !important;
  min-height: 0px !important;
  padding: 0 1.25rem !important;
}

.v-list-item-title {
  font-size: .875rem!important;
  font-weight: 500;
  line-height: 1rem;
  align-self: center;
}

.v-list-item-avatar {
  margin:8px 32px 8px 0px;
}

.v-card-title.body-2 {
  font-size: 0.875rem !important;
  font-family: "BCSans"!important;
  font-size: .875rem!important;
  letter-spacing: .0178571429em!important;
  line-height: 1.25rem;
  padding: 16px;
}
</style>
