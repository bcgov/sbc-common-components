import ConfigHelper from '../util/config-helper'
import { getCurrentInstance } from '@vue/composition-api'

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

  return {
    redirectToPath,
    redirectInTriggeredApp
  }
}
