import { Notifications } from '@/models/notification'
import NotificationService from '@/services/notification.services'
import ConfigHelper from '@/util/config-helper'
import { SessionStorageKeys } from '@/util/constants'
import { defineStore } from 'pinia'
import { NotificationStateIF } from '@/interfaces/notification-state-interface'
import { reactive } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const state = reactive<NotificationStateIF>({
    notifications: [],
    notificationCount: 0,
    notificationUnreadPriorityCount: 0,
    notificationUnreadCount: 0
  })

  async function syncNotifications (): Promise<Notifications> {
    const response = await NotificationService.getNotifications()
    if (response && response.data) {
      state.notifications = response.data?.sort(function (a, b) {
        let res = (+b.priority) - (+a.priority)
        if (res === 0) {
          res = b.date.localeCompare(a.date)
        }
        return res
      })
    } else {
      state.notifications = []
    }
    ConfigHelper.addToSession(SessionStorageKeys.WhatsNew, JSON.stringify(state.notifications || ''))
    return state.notifications
  }

  function fetchNotificationCount (): number {
    state.notificationCount = state.notifications.length
    return state.notificationCount
  }

  function fetchNotificationUnreadPriorityCount (): number {
    state.notificationUnreadPriorityCount = state.notifications
      .filter(notification => notification.priority && !notification.read).length
    return state.notificationUnreadPriorityCount
  }
  function fetchNotificationUnreadCount (): number {
    state.notificationUnreadCount = state.notifications.filter(notification => !notification.read).length
    return state.notificationUnreadCount
  }

  function markAsRead (): number {
    const nl = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.WhatsNew) || '{}')
    nl.map(notification => { notification.read = true; return notification })
    state.notifications = nl
    state.notificationUnreadCount = nl.filter(notification => !notification.read).length
    return state.notificationUnreadCount
  }

  return {
    state,
    syncNotifications,
    fetchNotificationCount,
    fetchNotificationUnreadPriorityCount,
    fetchNotificationUnreadCount,
    markAsRead
  }
})
