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
import { defineComponent, reactive, toRefs, onMounted, watch, computed, PropType, ComputedRef, unref, getCurrentInstance } from '@vue/composition-api'
import { LDClient } from 'launchdarkly-js-client-sdk'
import { Role, IdpHint, LoginSource, Pages } from '../util/constants'
import KeyCloakService from '../services/keycloak.services'
import { useAccountStore } from '../stores/account'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import NavigationMixin from '../mixins/navigation-mixin'

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
  mixins: [NavigationMixin],
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
  methods: {
    redirectTo (routePath: string) {
      (this as any).redirectToPath(this.inAuth, routePath)
    },
    getContextPath (): string {
      const baseUrl = (this.$router && this.$router['history'] && this.$router['history'].base) || '/'
      return baseUrl + (baseUrl.length && baseUrl[baseUrl.length - 1] !== '/' ? '/' : '')
    }
  },
  setup (props, { root }) {
    const accountStore = useAccountStore()
    const authStore = useAuthStore()
    const { currentAccount, accountName } = storeToRefs(accountStore)
    const { isAuthenticated, currentLoginSource } = storeToRefs(authStore)
    const instance = getCurrentInstance()

    const redirectTo = (routePath: string) => {
      // Access the mixin method through the instance
      ;(instance?.proxy as any).redirectToPath(props.inAuth, routePath)
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

    const checkAccountStatus = () => {
      // redirect if account status is suspended
      if (currentAccount.value?.accountStatus === 'NSF_SUSPENDED') {
        redirectTo(`${Pages.ACCOUNT_FREEZ}`)
      } else if (currentAccount.value?.accountStatus === 'PENDING_AFFIDAVIT_REVIEW') {
        redirectTo(`${Pages.PENDING_APPROVAL}/${accountName.value}/true`)
      }
    }

    const login = async (idpHint: string) => {
      if (!props.fromLogin) {
        if (props.redirectOnLoginSuccess) {
          let url = encodeURIComponent(props.redirectOnLoginSuccess)
          url += props.redirectOnLoginFail ? `/${encodeURIComponent(props.redirectOnLoginFail)}` : ''
          window.location.assign(`${(instance?.proxy as any).getContextPath()}signin/${idpHint}/${url}`)
        } else {
          window.location.assign(`${(instance?.proxy as any).getContextPath()}signin/${idpHint}`)
        }
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
              const isRedirectToCreateAccount = (userInfo.roles.includes(Role.PublicUser) && !userInfo.roles.includes(Role.AccountHolder))
              const currentUser = await accountStore.getCurrentUserProfile(props.inAuth) as UserProfile

              if ((userInfo?.loginSource !== LoginSource.IDIR) && !(currentUser?.userTerms?.isTermsOfUseAccepted)) {
                // eslint-disable-next-line no-console
                console.log('[SignIn.vue]Redirecting. TOS not accepted')
                redirectTo(Pages.USER_PROFILE_TERMS)
              } else if (isRedirectToCreateAccount) {
                // eslint-disable-next-line no-console
                console.log('[SignIn.vue]Redirecting. No Valid Role')
                switch (userInfo.loginSource) {
                  case LoginSource.BCSC:
                    redirectTo(Pages.CREATE_ACCOUNT)
                    break
                  case LoginSource.BCEID:
                    redirectTo(Pages.CHOOSE_AUTH_METHOD)
                    break
                }
              }
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
        // checking for account status
        await checkAccountStatus()
      }
    })

    watch(isAuthenticated, async (isAuthenitcated: boolean) => {
      if (isAuthenitcated) {
        await updateProfile()
      }
    })

    const goToCreateBCSCAccount = () => {
      redirectTo(Pages.CREATE_ACCOUNT)
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
