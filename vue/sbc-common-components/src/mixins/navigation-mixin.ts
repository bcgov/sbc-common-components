import { Component, Vue } from 'vue-property-decorator'
import ConfigHelper from '../util/config-helper'

@Component({})
export default class NavigationMixin extends Vue {
  protected navigateTo (contextPath: string, routePath: string): void {
    const resolvedRoutes = this.$router.resolve({ path: `/${routePath}` })
    console.log(resolvedRoutes.resolved.matched)
    if (resolvedRoutes.resolved.matched.length > 0) {
      this.$router.push(`/${routePath}`)
    } else {
      window.location.assign(`${contextPath}${routePath}`)
    }
  }

  protected redirectToPath (inAuth: boolean, routePath: string) {
    if (inAuth) {
      this.navigateTo(ConfigHelper.getAuthContextPath(), routePath)
    } else {
      window.location.assign(`${ConfigHelper.getAuthContextPath()}${routePath}`)
    }
  }
}
