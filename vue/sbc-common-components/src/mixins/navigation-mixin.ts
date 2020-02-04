// mixin.js
import Vue from 'vue'
import Component from 'vue-class-component'
import Router from 'vue-router'

// You can declare a mixin as the same style as components.
@Component
// TODO impelement the logic
export default class NavigationMixin extends Vue {
  /**
   * no logic yet.
   * But implement in such a way that ,
   * if the url exists in the current router/app ,emit an event so that whole page is not refreshed.
   * if the url is totally new , do a window.location
   * @param contextPath
   * @param url
   */
  navigate (contextPath:string, url:string = '') {
    if (!url) {
      window.location.assign(contextPath)
    }
    const currentPath = window.location.href
    if (currentPath.includes(url)) {
      this.$router.push(contextPath)
    } else {
      // todo add ensureslashes method
      window.location.href = url + '\\' + contextPath
    }
  }
}
