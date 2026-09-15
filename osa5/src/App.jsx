import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import loginService from './services/login'
//import middleware from './utils/middleware'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user_ = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user_)
      )
      blogService.setToken(user_.token)
      setUser(user_)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser('')
  }

  const props = { username_: username, password_: password, setUsername_: setUsername, setPassword_: setPassword, handleLogin_: handleLogin }
  return (
    <>
      <Notification message={errorMessage} />
      {!user && <LoginForm propsObject={props} />}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.username} logged in
            <label for="logout">
              <button name="logout" onClick={logout}>log out</button>
            </label>
          </p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </>
  )
}

export default App