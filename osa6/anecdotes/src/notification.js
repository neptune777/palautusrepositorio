import { create } from 'zustand'
let notificationTimeout
const useNotificationStore = create(set => ({
    notification: null,
    actions: {
        setNotification: newNotification => {
            // Cancel the previous timer so it cannot clear the new notification too early.
            clearTimeout(notificationTimeout)
            set(() => ({ notification: newNotification }))
            notificationTimeout = setTimeout(() => { set({ notification: null }) }, 5000) // Obs! set does not need a callback because it does not need the previous state in this case
        }
    }
}))
export const useNotification = () => useNotificationStore(state => state.notification)
export const useActionsOfNotification = () => useNotificationStore(state => state.actions)  