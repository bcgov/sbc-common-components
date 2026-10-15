import { reactive, toRefs } from '@vue/composition-api'
import { Notifications } from '../models/notification'
import NotificationService from '../services/notification.services'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import { defineStore } from 'pinia'
import { NotificationStateIF } from '../interfaces'

export const useNotificationStore = defineStore('notification', () => {
  const state = reactive<NotificationStateIF>({
    notifications: [],
    notificationCount: 0,
    notificationUnreadPriorityCount: 0,
    notificationUnreadCount: 0
  })

  const syncNotifications = async (): Promise<Notifications> => {
    const response = await NotificationService.getNotifications()
    if (response?.data) {
      state.notifications = response.data?.sort((a, b) => {
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

  const fetchNotificationCount = (): number => {
    state.notificationCount = state.notifications.length
    return state.notificationCount
  }

  const fetchNotificationUnreadPriorityCount = (): number => {
    state.notificationUnreadPriorityCount = state.notifications
      .filter(notification => notification.priority && !notification.read).length
    return state.notificationUnreadPriorityCount
  }

  const fetchNotificationUnreadCount = (): number => {
    state.notificationUnreadCount = state.notifications.filter(notification => !notification.read).length
    return state.notificationUnreadCount
  }

  const markAsRead = (): number => {
    const nl = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.WhatsNew) || '{}')
    nl.map(notification => { notification.read = true; return notification })
    state.notifications = nl
    state.notificationUnreadCount = nl.filter(notification => !notification.read).length
    return state.notificationUnreadCount
  }

  return {
    ...toRefs(state),
    syncNotifications,
    fetchNotificationCount,
    fetchNotificationUnreadPriorityCount,
    fetchNotificationUnreadCount,
    markAsRead
  }
})
