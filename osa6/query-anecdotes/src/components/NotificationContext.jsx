import { createContext, useState } from 'react'
let NotificationTimeout
const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {

    const [notification, setNotification] = useState(null)

    const setNotificationProcess = (text) => {
        clearTimeout(NotificationTimeout)
        setNotification(text)
        NotificationTimeout = setTimeout(() => setNotification(null), 5000)
    }
    return (
        <NotificationContext value={{ notification, setNotificationProcess }}>
            {props.children}
        </NotificationContext >
    )
}