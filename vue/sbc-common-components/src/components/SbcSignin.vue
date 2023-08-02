<template>
  <loading-screen :is-loading="isLoading" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Role, LoginSource, Pages } from '../../src/util/constants'
import { KCUserProfile } from '../../src/models/KCUserProfile'
import LoadingScreen from './LoadingScreen.vue'
import KeyCloakService from '../../src/services/keycloak.services'
import { useNavigation } from '../../src/composables'
import { useAccountStore } from '@/store/account'

const isLoading = ref(true)

const props = defineProps({
  idpHint: { type: String, default: 'bcsc' },
  redirectUrlLoginFail: { type: String, default: '' },
  inAuth: { type: Boolean, default: false }
})

const accountStore = useAccountStore()
const { redirectToPath } = useNavigation()

const emit = defineEmits(['sync-user-profile-ready'])

// Initialize keycloak session
const kcInit = KeyCloakService.initializeKeyCloak(props.idpHint)
kcInit
  .then(async (authenticated: boolean) => {
    if (authenticated) {
      // eslint-disable-next-line no-console
      console.info(
        '[SignIn.vue]Logged in User. Init Session and Starting refreshTimer'
      )
      // Set values to session storage
      await KeyCloakService.initSession()
      await accountStore.loadUserInfo()
      const userInfo = accountStore.currentUser as KCUserProfile
      await accountStore.updateUserProfile()
      await accountStore.syncAccount()
      // if not from the sbc-auth, do the checks and redirect to sbc-auth
      if (!props.inAuth) {
        // redirect to create account page if the user has no 'account holder' role
        const isRedirectToCreateAccount =
          userInfo.roles.includes(Role.PublicUser) &&
          !userInfo.roles.includes(Role.AccountHolder)
        await accountStore.getCurrentUserProfile(props.inAuth)
        const currentUser = accountStore.currentUser
        if (
          userInfo?.loginSource !== LoginSource.IDIR &&
          !currentUser?.userTerms?.isTermsOfUseAccepted
        ) {
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
      emit('sync-user-profile-ready')
    }
  })
  .catch(() => {
    if (props.redirectUrlLoginFail) {
      window.location.assign(decodeURIComponent(props.redirectUrlLoginFail))
    }
  })
</script>

<style lang="scss" scoped></style>
