
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ propsObject }) => {
  console.log('loginform called')
  const navigate = useNavigate()
  const handleLoginFinal = async event => {
    console.log('handleLoginFinal, event:',event)
    event.preventDefault()
    await propsObject.handleLogin(event)
    navigate('/')
  }
  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={(event) => handleLoginFinal(event)}>
        <div>
          <TextField
            label='username'
            variant='outlined'
            type="text"
            value={propsObject.username}
            onChange={({ target }) => propsObject.setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            variant='outlined'
            type="password"
            value={propsObject.password}
            onChange={({ target }) => propsObject.setPassword(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
        </Button>
      </form>
    </>
  )
}
export default LoginForm