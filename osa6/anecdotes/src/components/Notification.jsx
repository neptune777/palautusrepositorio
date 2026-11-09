import { useNotification } from '../notification'

const Notification = () => {
  const notification = useNotification()
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  }

  return (

    <div style={style} data-testid="notification">
      {notification && notification.content}
    </div>
  )
}

export default Notification
