import { useNavigate } from 'react-router-dom'
const LogoutButton = ({ logout }) => {
  console.log('Logoutbutton was just called')
  const navigate = useNavigate()
  const logOutFinal = async () => {
    await logout()
    navigate('/')
  }
  return (
    <>
      <button type="button" name="logout" onClick={() => logOutFinal()}>log out</button>
    </>
  )
}
export default LogoutButton