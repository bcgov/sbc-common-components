import NotificationService from '../../services/notification.services'
import ConfigHelper from '../../util/config-helper'
import { SessionStorageKeys } from '../../util/constants'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const notificationModule = {
  namespaced: true,
  state: {
    notifications: [],
    notificationCount: 0,
    notificationUnreadPriorityCount: 0,
    notificationUnreadCount: 0
  },
  mutations: {
    setNotifications(state, notifications) {
      ConfigHelper.addToSession(SessionStorageKeys.WhatsNew, JSON.stringify(notifications || ''))
      state.notifications = notifications
    },
    setNotificationCount(state, count) {
      state.notificationCount = count
    },
    setNotificationUnreadPriorityCount(state, count) {
      state.notificationUnreadPriorityCount = count
    },
    setNotificationUnreadCount(state, count) {
      state.notificationUnreadCount = count
    }
  },
  actions: {
    async syncNotifications({ commit }) {
      try {
        const response = await NotificationService.getNotifications()
        if (response && response.data) {
          const sortedNotifications = response.data.sort((a, b) => {
            let res = (+b.priority) - (+a.priority)
            if (res === 0) {
              res = b.date.localeCompare(a.date)
            }
            return res
          })
          commit('setNotifications', sortedNotifications)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    },
    fetchNotificationCount({ state, commit }) {
      commit('setNotificationCount', state.notifications.length)
    },
    fetchNotificationUnreadPriorityCount({ state, commit }) {
      commit('setNotificationUnreadPriorityCount', state.notifications.filter(n => n.priority && !n.read).length)
    },
    fetchNotificationUnreadCount({ state, commit }) {
      commit('setNotificationUnreadCount', state.notifications.filter(n => !n.read).length)
    },
    markAsRead({ commit }) {
      let notifications = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.WhatsNew) || '[]')
      notifications = notifications.map(n => ({ ...n, read: true }))
      commit('setNotifications', notifications)
      commit('setNotificationUnreadCount', notifications.filter(n => !n.read).length)
    }
  }
}

export default notificationModule
