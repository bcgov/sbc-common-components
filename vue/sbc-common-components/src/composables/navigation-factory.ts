import ConfigHelper from '../util/config-helper'
import { getCurrentInstance } from '@vue/composition-api'
import { LoginSource, Pages, Role } from '../util/constants'

export const useNavigation = () => {
  const instance = getCurrentInstance()

  const redirectToPath = (inAuth: boolean, routePath: string) => {
    if (inAuth) {
      redirectInTriggeredApp(routePath)
    } else {
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }

  const redirectInTriggeredApp = (routePath: string) => {
    const router = instance?.proxy.$router
    if (!router) return

    const resolvedRoutes = router.resolve({ path: `/${routePath}` })
    if (resolvedRoutes.resolved.matched.length > 0) {
      router.push(`/${routePath}`)
    } else {
      // navigate to auth app if route is not found in the triggered app
      window.location.assign(`${ConfigHelper.getAuthContextPath()}/${routePath}`)
    }
  }

  const handleRedirectByRole = (
    inAuth: boolean,
    userInfo: { loginSource: string; roles: string[] },
    currentUser: { userTerms?: { isTermsOfUseAccepted: boolean } }
  ) => {
    // Check if user needs to create an account
    const isRedirectToCreateAccount = (
      userInfo.roles.includes(Role.PublicUser) &&
      !userInfo.roles.includes(Role.AccountHolder)
    )
    // Check if user needs to accept terms of service first (except IDIR users)
    if ((userInfo?.loginSource !== LoginSource.IDIR) && !(currentUser?.userTerms?.isTermsOfUseAccepted)) {
      // eslint-disable-next-line no-console
      console.log('[Navigation] Redirecting. TOS not accepted')
      redirectToPath(inAuth, Pages.USER_PROFILE_TERMS)
      return true
    } else if (isRedirectToCreateAccount) {
      // eslint-disable-next-line no-console
      console.log('[Navigation] Redirecting. No Valid Role')
      switch (userInfo.loginSource) {
        case LoginSource.BCSC:
          redirectToPath(inAuth, Pages.CREATE_ACCOUNT)
          break
        case LoginSource.BCEID:
          redirectToPath(inAuth, Pages.CHOOSE_AUTH_METHOD)
          break
      }
      return true
    }

    return false
  }

  const checkAccountStatus = (
    inAuth: boolean,
    currentAccount: { accountStatus?: string },
    accountName?: string
  ) => {
    // redirect if account status is suspended
    if (currentAccount?.accountStatus === 'NSF_SUSPENDED') {
      redirectToPath(inAuth, `${Pages.ACCOUNT_FREEZ}`)
      return true
    } else if (currentAccount?.accountStatus === 'PENDING_AFFIDAVIT_REVIEW') {
      redirectToPath(inAuth, `${Pages.PENDING_APPROVAL}/${accountName || ''}/true`)
      return true
    }
    return false
  }

  return {
    redirectToPath,
    redirectInTriggeredApp,
    handleRedirectByRole,
    checkAccountStatus
  }
}
