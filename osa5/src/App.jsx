import { useState, useEffect } from 'react'
//import { useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import loginService from './services/login'
import {
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      return JSON.parse(loggedUserJSON)
    } else {
      return null
    }
  })

  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
    const tokenExists = user?.token ?? null
    if (tokenExists) {
      blogService.setToken(user.token)
    } else {
      blogService.setToken(null)
      return
    }
  }, [user])

  const notificationProcess = (argument) => {
    setNotification(argument)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  const handleLogin = async event => {
    event.preventDefault()
    console.log('TEST')
    try {
      const user_ = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user_)
      )
      setUser(user_)
      setUsername('')
      setPassword('')
    } catch {
      notificationProcess({ type: 'error', text: 'wrong username or password' })
    }
  }
  const sendNewBlog = async (newBlog) => {

    return blogService.create(newBlog)
      .then(response => {
        console.log('response:', response)
        response = { ...response, user: { username: user.username, name: user.name, id: response.user } }
        const newBlogs = [...blogs, response]
        setBlogs(newBlogs)
        notificationProcess({ type: 'success', text: `a new blog ${response.title} by ${response.author} added` })
        navigate('/')
      })
      .catch(error => {
        notificationProcess({ type: 'error', text: `Could not add new blog, error: ${error}` })
      })
  }

  const modifyBlog = async (id) => {
    const found = blogs.find(blog => blog.id.toString() === id.toString())
    const modifiableObject = { ...found, likes: found.likes + 1, user: found.user.id }
    return blogService.modify(modifiableObject)
      .then(modifiedObject => {
        const newBlogs = blogs.map(blog => {
          if (blog.id.toString() === id.toString()) {
            modifiedObject = { ...modifiedObject, user: found.user }
            return modifiedObject
          } else {
            return blog
          }
        })
        setBlogs(newBlogs)
      })
      .catch(error => {
        notificationProcess({ type: 'error', text: `'likes' count of the blog could not be increased, error: ${error}` })
      })
  }

  const deleteBlog = async (id) => {
    const removableBlog = blogs.find(blog => blog.id.toString() === id.toString())
    if (window.confirm(`Remove blog ${removableBlog.title} by ${removableBlog.author} ?`)) {
      return blogService.remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id.toString() !== id.toString()))
          notificationProcess({ 'type': 'success', 'text': 'blog was deleted' })
          navigate('/')
        })
        .catch(error => {
          notificationProcess({ 'type': 'error', 'text': `could not delete the blog, error: ${error}` })
        })
    }
  }

  const logout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const props = { username, password, setUsername, setPassword, handleLogin }

  const getBlogsSortedByLikes = () => {
    const copyOfBlogs = [...blogs]
    return copyOfBlogs.sort((blog1, blog2) => {
      return blog2.likes - blog1.likes
    })
  }

  const style2 = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  const logOutFinal = async () => {
    await logout()
    navigate('/')
  }
  const match = useMatch('/blogs/:id')
  const blogMatch = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null
  return (
    <>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={style2}>blogs</Button>
            {
              !user && (<Button color="inherit" component={Link} to="/login" sx={style2}>login</Button>)
            }
            {
              user && (<Button color="inherit" component={Link} to="/create" sx={style2}>new blog</Button>)
            }
            {
              user && (<Button color="inherit" component={Link} to="/login" sx={style2} onClick={() => logOutFinal()}>log out</Button>)
            }
          </Toolbar>
        </AppBar>
      </div>
      {notification &&
        (<Notification notification={notification}/>
        )}
      <Routes>
        {!user && (
          <Route path="/login" element={
            <LoginForm propsObject={props} />
          } />
        )
        }
        <Route path="/login" element={<LoginForm propsObject={props} />} />
        <Route path="/" element={<Blogs user={user} modifyBlog={modifyBlog} deleteBlog={deleteBlog} blogs={getBlogsSortedByLikes()}/>} />
        {blogMatch && (<Route path="/blogs/:id" element={<Blog user={user} modifyBlog={modifyBlog} deleteBlog={deleteBlog} blog={blogMatch}/>} />)}
        {user && (<Route path="/create" element={<NewBlogForm sendNewBlog={sendNewBlog}/>} />)}
      </Routes>
    </>
  )
}
export default App