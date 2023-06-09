import AuthMenuView from './testing_views/AuthMenuView.vue'
import AuthenticationOptionsDialogView from './testing_views/AuthenticationOptionsDialogView.vue'
import AuthenticationOptionsView from './testing_views/AuthenticationOptionsView.vue'
import BaseAddressView from './testing_views/BaseAddressView.vue'
import BrowserVersionAlertView from './testing_views/BrowserVersionAlertView.vue'
import FeeSummaryView from './testing_views/FeeSummaryView.vue'
import Home from './testing_views/Home.vue'
import LoaderView from './testing_views/LoaderView.vue'
import LoadingScreenView from './testing_views/LoadingScreenView.vue'
import LoginView from './testing_views/LoginView.vue'
import MobileDeviceAlertView from './testing_views/MobileDeviceAlertView.vue'
import NavigationBarView from './testing_views/NavigationBarView.vue'
import NotificationPanelView from './testing_views/NotificationPanelView.vue'
import PaySystemAlertView from './testing_views/PaySystemAlertView.vue'
import ProductSelectorView from './testing_views/ProductSelectorView.vue'
import SignIn from './testing_views/SigninView.vue'
import SignoutView from './testing_views/SignoutView.vue'
import SystemAlertView from './testing_views/SystemAlertView.vue'
import SystemBannerView from './testing_views/SystemBannerView.vue'
import SystemErrorModalView from './testing_views/SystemErrorModalView.vue'
import SystemErrorView from './testing_views/SystemErrorView.vue'
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
