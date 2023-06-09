<template>
  <div>
    <h1 class="pageTitle">Signin</h1>
    <sbc-signin
      :idp-hint="idpHint"
      :in-auth="true"
      :redirect-url-login-fail="redirectUrlLoginFail"
      @sync-user-profile-ready="authenticationComplete"
    ></sbc-signin>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { IdpHint, Pages, SessionStorageKeys } from '@/util/constants'
import { Member, MembershipStatus, Organization } from '@/models/Organization'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AccountSettings } from '@/models/account-settings'
import CommonUtils from '@/util/common-util'
import ConfigHelper from '@/util/config-helper'
import { KCUserProfile } from '../models/KCUserProfile'
import SbcSignin from '../components/SbcSignin.vue'

@Component({
  methods: {
    ...mapMutations('user', ['setRedirectAfterLoginUrl']),
    ...mapActions('user', ['loadUserInfo'])
  },
  components: {
    SbcSignin
  }
})
export default class Signin extends Mixins() {
  readonly setRedirectAfterLoginUrl!: (url: string) => void
  readonly loadUserInfo!: () => KCUserProfile

  @Prop({ default: 'bcsc' }) idpHint: string
  @Prop({ default: '' }) redirectUrl: string
  @Prop({ default: '' }) redirectUrlLoginFail: string

  protected redirectTo (target: string): void {
    if (CommonUtils.isUrl(target)) {
      // Solves where we get passed http:/www.google.ca for example.
      if (!target.includes('://')) {
        target = target.replace(':/', '://')
      }
      window.location.assign(target)
    } else {
      if (this.$route.path !== target) {
        this.$router.push(target)
      }
    }
  }

  async authenticationComplete () {
    await this.loadUserInfo()
    // Check if user is authenticated, and redirect according to specified redirect
    // or fallback to default route for their login source
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$root.$emit('signin-complete', () => {
        if (this.redirectUrl) {
          if (this.redirectUrl.startsWith('/')) {
            this.redirectTo(this.redirectUrl)
          } else {
            this.redirectTo(decodeURIComponent(CommonUtils.isUrl(this.redirectUrl) ? this.redirectUrl : `/${this.redirectUrl}`))
          }
        } else {
          this.redirectTo(this.getNextPageUrl())
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
