import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SignIn from './views/SigninView.vue'
import SignoutView from './views/SignoutView.vue'

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/SignIn',
      name: 'Sign In',
      component: SignIn
    },
    {
      path: '/SignOut',
      name: 'Sign out',
      component: () => import('./views/SignoutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue')
    },
    { path: '/signin/:idpHint', name: 'signin', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signin/:idpHint/:redirectUrl', name: 'signin-redirect', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signin/:idpHint/:redirectUrl/:redirectUrlLoginFail', name: 'signin-redirect-fail', component: SignIn, props: true, meta: { requiresAuth: false } },
    { path: '/signout', name: 'signout', component: SignoutView, props: true, meta: { requiresAuth: true } },
    { path: '/signout/:redirectUrl', name: 'signout-redirect', component: SignoutView, props: true, meta: { requiresAuth: true } }
  ]
})
