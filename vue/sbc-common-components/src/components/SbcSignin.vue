<template>
  <loading-screen :is-loading="isLoading"></loading-screen>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from '@vue/composition-api'
import { Role, LoginSource, Pages } from '../util/constants'
import KeyCloakService from '../services/keycloak.services'
import LoadingScreen from './LoadingScreen.vue'
import { useAccountStore } from '../stores/account'
import { useAuthStore } from '../stores/auth'
import { KCUserProfile } from '../models/KCUserProfile'
import { useNavigation } from '../composables/navigation-factory'
import { storeToRefs } from 'pinia'

interface UserProfile {
  userTerms?: {
    isTermsOfUseAccepted: boolean
  }
}

export default defineComponent({
  name: 'SbcSignin',
  components: {
    LoadingScreen
  },
  props: {
    idpHint: {
      type: String as PropType<string>,
      default: 'bcsc'
    },
    redirectUrlLoginFail: {
      type: String as PropType<string>,
      default: ''
    },
    inAuth: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup (props, { emit }) {
    const isLoading = ref(true)
    const accountStore = useAccountStore()
    const authStore = useAuthStore()
    const { currentAccount, accountName } = storeToRefs(accountStore)
    const { redirectToPath, handleRedirectByRole, checkAccountStatus } = useNavigation()

    onMounted(async () => {
      try {
        // Initialize keycloak session
        const authenticated = await KeyCloakService.initializeKeyCloak(props.idpHint)

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
            const currentUser = await accountStore.getCurrentUserProfile(props.inAuth) as UserProfile
            handleRedirectByRole(props.inAuth, userInfo, currentUser)
          }

          emit('sync-user-profile-ready')
        }
      } catch (error) {
        if (props.redirectUrlLoginFail) {
          window.location.assign(decodeURIComponent(props.redirectUrlLoginFail))
        }
      } finally {
        isLoading.value = false
      }
    })

    return {
      isLoading
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
