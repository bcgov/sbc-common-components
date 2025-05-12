<template>
  <!-- Login Menu -->
  <v-card>
    <div>
      <v-card-title class="body-2 font-weight-bold">Select login method</v-card-title>
      <v-divider></v-divider>
    </div>
    <v-list
      tile
      dense
    >
      <v-list-item
        v-for="loginOption in loginOptions"
        :key="loginOption.idpHint"
        @click="login(loginOption.idpHint)"
        class="pr-6"
      >
        <v-list-item-icon left>
          <v-icon>{{loginOption.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{loginOption.option}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch, computed, PropType, ComputedRef, unref } from '@vue/composition-api'
import { LDClient } from 'launchdarkly-js-client-sdk'
import { Role, IdpHint, LoginSource, Pages } from '../util/constants'
import KeyCloakService from '../services/keycloak.services'
import { useAccountStore } from '../stores/account'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useNavigation } from '../composables/navigation-factory'

interface UserProfile {
  userTerms?: {
    isTermsOfUseAccepted: boolean
  }
}

interface State {
  ldClient: LDClient | null;
  loginOptions: Array<{
    idpHint: string;
    option: string;
    icon: string;
  }>;
  isIDIR: ComputedRef<boolean>;
  isBceid: ComputedRef<boolean>;
  isBcscOrBceid: ComputedRef<boolean>;
  hasValidRole: ComputedRef<boolean>;
  needsTOSAcceptance: ComputedRef<boolean>;
}

export default defineComponent({
  name: 'SbcAuthMenu',
  props: {
    redirectOnLoginSuccess: {
      type: String as PropType<string>,
      default: ''
    },
    redirectOnLoginFail: {
      type: String as PropType<string>,
      default: ''
    },
    inAuth: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    fromLogin: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup (props, { root }) {
    const accountStore = useAccountStore()
    const authStore = useAuthStore()
    const { currentAccount, accountName } = storeToRefs(accountStore)
    const { isAuthenticated, currentLoginSource } = storeToRefs(authStore)
    const { redirectToPath, handleRedirectByRole, checkAccountStatus } = useNavigation()

    const getContextPath = (): string => {
      const router = root.$router
      const baseUrl = (router && router['history'] && router['history'].base) || '/'
      return baseUrl + (baseUrl.length && baseUrl[baseUrl.length - 1] !== '/' ? '/' : '')
    }

    const state = reactive<State>({
      ldClient: null,
      loginOptions: [
        {
          idpHint: IdpHint.BCSC,
          option: 'BC Services Card',
          icon: 'mdi-account-card-details-outline'
        },
        {
          idpHint: IdpHint.BCEID,
          option: 'BCeID',
          icon: 'mdi-two-factor-authentication'
        },
        {
          idpHint: IdpHint.IDIR,
          option: 'IDIR',
          icon: 'mdi-account-group-outline'
        }
      ],
      isIDIR: computed(() => currentLoginSource.value === LoginSource.IDIR),
      isBceid: computed(() => currentLoginSource.value === LoginSource.BCEID),
      isBcscOrBceid: computed(() => [LoginSource.BCSC.valueOf(), LoginSource.BCEID.valueOf()].indexOf(currentLoginSource.value) >= 0),
      hasValidRole: computed(() => {
        const userInfo = accountStore.currentUser
        return userInfo?.roles?.includes(Role.AccountHolder) || false
      }),
      needsTOSAcceptance: computed(() => {
        const userInfo = accountStore.currentUser
        return userInfo?.loginSource !== LoginSource.IDIR
      })
    })

    const updateProfile = async () => {
      if (unref(state.isBceid)) {
        await accountStore.syncUserProfile()
      }
    }

    const checkStatus = () => {
      return checkAccountStatus(props.inAuth, currentAccount.value, accountName.value)
    }

    const getRedirectUrl = (idpHint: string) => {
      if (props.redirectOnLoginSuccess) {
        let url = encodeURIComponent(props.redirectOnLoginSuccess)
        url += props.redirectOnLoginFail ? `/${encodeURIComponent(props.redirectOnLoginFail)}` : ''
        return `${getContextPath()}signin/${idpHint}/${url}`
      }
      return `${getContextPath()}signin/${idpHint}`
    }

    const login = async (idpHint: string) => {
      if (!props.fromLogin) {
        window.location.assign(getRedirectUrl(idpHint))
      } else {
        try {
          // Initialize keycloak session
          const authenticated = await KeyCloakService.initializeKeyCloak(idpHint)
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
              // eslint-disable-next-line no-console
              console.log('[SignIn.vue]Not from sbc-auth. Checking account status')
              // redirect to create account page if the user has no 'account holder' role
              const currentUser = await accountStore.getCurrentUserProfile(props.inAuth) as UserProfile
              // Handle redirects based on user role and login source
              handleRedirectByRole(props.inAuth, userInfo, currentUser)
            }
          }
        } catch (error) {
          if (props.redirectOnLoginFail) {
            window.location.assign(decodeURIComponent(props.redirectOnLoginFail))
          }
        }
      }
    }

    onMounted(async () => {
      authStore.syncWithSessionStorage()
      if (isAuthenticated.value) {
        await accountStore.loadUserInfo()
        await accountStore.syncAccount()
        await updateProfile()
        checkStatus()
      }
    })

    watch(isAuthenticated, async (isAuthenitcated: boolean) => {
      if (isAuthenitcated) {
        await updateProfile()
      }
    })

    const goToCreateBCSCAccount = () => {
      redirectToPath(props.inAuth, Pages.CREATE_ACCOUNT)
    }

    return {
      ...toRefs(state),
      login,
      goToCreateBCSCAccount
    }
  }
})
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

.v-list--dense .v-subheader,
.v-list-item {
  padding-right: 1.25rem;
  padding-left: 1.25rem;
}

.v-list--dense .v-subheader,
.v-list--dense .v-list-item__title,
.v-list--dense .v-list-item__subtitle {
  font-size: 0.875rem !important;
}
</style>
