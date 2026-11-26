import useNotification from '../hooks/useAnecdotesContextAPI'
const Notification = () => {

  const { notification } = useNotification()

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!notification) return null

  return <div data-testid="notification" style={style}>{notification}</div>
}

export default Notification
