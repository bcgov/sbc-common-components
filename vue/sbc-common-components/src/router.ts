import AuthMenuView from './views/AuthMenuView.vue'
import AuthenticationOptionsDialogView from './views/AuthenticationOptionsDialogView.vue'
import AuthenticationOptionsView from './views/AuthenticationOptionsView.vue'
import BaseAddressView from './views/BaseAddressView.vue'
import BrowserVersionAlertView from './views/BrowserVersionAlertView.vue'
import FeeSummaryView from './views/FeeSummaryView.vue'
import Home from './views/Home.vue'
import LoaderView from './views/LoaderView.vue'
import LoadingScreenView from './views/LoadingScreenView.vue'
import LoginView from './views/LoginView.vue'
import MobileDeviceAlertView from './views/MobileDeviceAlertView.vue'
import NavigationBarView from './views/NavigationBarView.vue'
import NotificationPanelView from './views/NotificationPanelView.vue'
import PaySystemAlertView from './views/PaySystemAlertView.vue'
import ProductSelectorView from './views/ProductSelectorView.vue'
import SignIn from './views/SigninView.vue'
import SignoutView from './views/SignoutView.vue'
import SystemAlertView from './views/SystemAlertView.vue'
import SystemBannerView from './views/SystemBannerView.vue'
import SystemErrorModalView from './views/SystemErrorModalView.vue'
import SystemErrorView from './views/SystemErrorView.vue'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/AuthenticationOptions',
      name: 'Authentication Options',
      component: AuthenticationOptionsView
    },
    {
      path: '/AuthenticationOptionsDialog',
      name: 'Authentication Options Dialog',
      component: AuthenticationOptionsDialogView
    },
    {
      path: '/AuthMenu',
      name: 'Auth Menu',
      component: AuthMenuView
    },
    {
      path: '/BaseAddress',
      name: 'Base Address',
      component: BaseAddressView
    },
    {
      path: '/BrowserVersionAlert',
      name: 'Browser Version Alert',
      component: BrowserVersionAlertView
    },
    {
      path: '/FeeSummary',
      name: 'Fee Summary',
      component: FeeSummaryView
    },
    {
      path: '/LoadingScreen',
      name: 'Loading Screen',
      component: LoadingScreenView
    },
    {
      path: '/Loader',
      name: 'Loader',
      component: LoaderView
    },
    {
      path: '/Login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/MobileDeviceAlert',
      name: 'Mobile Device Alert',
      component: MobileDeviceAlertView
    },
    {
      path: '/NavigationBar',
      name: 'Navigation Bar',
      component: NavigationBarView
    },
    {
      path: '/NotificationPanel',
      name: 'Notification Panel',
      component: NotificationPanelView
    },
    {
      path: '/PaySystemAlert',
      name: 'Pay System Alert',
      component: PaySystemAlertView
    },
    {
      path: '/ProductSelector',
      name: 'Product Selector',
      component: ProductSelectorView
    },
    {
      path: '/SignIn',
      name: 'Sign In',
      component: SignIn
    },
    {
      path: '/SignOut',
      name: 'Sign Out',
      component: SignoutView
    },
    {
      path: '/SystemAlert',
      name: 'System Alert',
      component: SystemAlertView
    },
    {
      path: '/SystemBanner',
      name: 'System Banner',
      component: SystemBannerView
    },
    {
      path: '/SystemError',
      name: 'System Error',
      component: SystemErrorView
    },
    {
      path: '/SystemErrorModal',
      name: 'System Error Modal',
      component: SystemErrorModalView
    },
    { path: '/signin/:idpHint', name: 'signin', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signin/:idpHint/:redirectUrl', name: 'signin-redirect', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signin/:idpHint/:redirectUrl/:redirectUrlLoginFail', name: 'signin-redirect-fail', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signout', name: 'signout', component: SignoutView, props: true, meta: { requiresAuth: true } },
    { path: '/signout/:redirectUrl', name: 'signout-redirect', component: SignoutView, props: true, meta: { requiresAuth: true } }
  ]
})
