<template>
  <div>
    <h1 class="pageTitle">Sign in</h1>
    <sbc-signin
      :idp-hint="idpHint"
      :in-auth="true"
      :redirect-url-login-fail="redirectUrlLoginFail"
      @sync-user-profile-ready="authenticationComplete"
    ></sbc-signin>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { IdpHint, Pages, SessionStorageKeys } from '@/util/constants'
import { useStore } from 'vuex'
import ConfigHelper from '@/util/config-helper'
import { KCUserProfile } from '../models/KCUserProfile'
import SbcSignin from '../components/SbcSignin.vue'

export default defineComponent({
  components: {
    SbcSignin
  },
  props: {
    idpHint: {
      type: String,
      default: 'bcsc'
    },
    redirectUrl: {
      type: String,
      default: ''
    },
    redirectUrlLoginFail: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = useStore()

    const setRedirectAfterLoginUrl = (url: string) => {
      store.commit('user/setRedirectAfterLoginUrl', url)
    }

    const loadUserInfo = () => {
      return store.dispatch('user/loadUserInfo')
    }

    const authenticationComplete = async () => {
      await loadUserInfo()

      if (store.getters['auth/isAuthenticated']) {
        const redirectTo = (url: string) => {
          // Perform the redirection logic here
        }

        if (props.redirectUrl) {
          if (props.redirectUrl.startsWith('/')) {
            redirectTo(props.redirectUrl)
          } else {
            const no_op = 0
          }
        } else {
          const no_op = 0
        }
      }
    }

    return {
      setRedirectAfterLoginUrl,
      loadUserInfo,
      authenticationComplete
    }
  }
})
</script>

<style lang="scss" scoped>
.pageTitle {
  position: absolute;
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
</style>
