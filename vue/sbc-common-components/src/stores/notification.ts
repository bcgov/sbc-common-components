import { Notifications } from '../models/notification'
import NotificationService from '../services/notification.services'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import { defineStore } from 'pinia'
import { NotificationStateIF } from '../interfaces'

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationStateIF => ({
    notifications: [],
    notificationCount: 0,
    notificationUnreadPriorityCount: 0,
    notificationUnreadCount: 0
  }),

  actions: {
    async syncNotifications (): Promise<Notifications> {
      const response = await NotificationService.getNotifications()
      if (response && response.data) {
        this.notifications = response.data?.sort(function (a, b) {
          let res = (+b.priority) - (+a.priority)
          if (res === 0) {
            res = b.date.localeCompare(a.date)
          }
          return res
        })
      } else {
        this.notifications = []
      }
      ConfigHelper.addToSession(SessionStorageKeys.WhatsNew, JSON.stringify(this.notifications || ''))
      return this.notifications
    },

    fetchNotificationCount (): number {
      this.notificationCount = this.notifications.length
      return this.notificationCount
    },

    fetchNotificationUnreadPriorityCount (): number {
      this.notificationUnreadPriorityCount = this.notifications
        .filter(notification => notification.priority && !notification.read).length
      return this.notificationUnreadPriorityCount
    },

    fetchNotificationUnreadCount (): number {
      this.notificationUnreadCount = this.notifications.filter(notification => !notification.read).length
      return this.notificationUnreadCount
    },

    markAsRead (): number {
      const nl = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.WhatsNew) || '{}')
      nl.map(notification => { notification.read = true; return notification })
      this.notifications = nl
      this.notificationUnreadCount = nl.filter(notification => !notification.read).length
      return this.notificationUnreadCount
    }
  }
})
