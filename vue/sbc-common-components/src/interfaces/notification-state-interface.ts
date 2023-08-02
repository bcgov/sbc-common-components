import { Notifications } from '@/models/notification'

export interface NotificationStateIF {
    notifications: Notifications
    notificationCount: number
    notificationUnreadPriorityCount: number
    notificationUnreadCount: number
}
