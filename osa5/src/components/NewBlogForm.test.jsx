import { render, screen } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import LogoutButton from './LogoutButton'
import Blog from './Blog'
import Blogs from './Blogs'
import { expect } from 'vitest'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  MemoryRouter,
  Link
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'

const blog = {
  'title': 'Mock title of a blog',
  'id': 'mockId',
  'author': 'Mock author',
  'likes' : 0,
  'url' :'Mock url',
  'user':{ 'username' : 'Populated blog user' }
}
const blogs = [blog]
const getBlogsSortedByLikes = () => {
  const copyOfBlogs = [...blogs]
  return copyOfBlogs.sort((blog1, blog2) => {
    return blog2.likes - blog1.likes
  })
}
const padding = {
  padding: 5
}
test('handler for sending new blog is called with correct data', async () => {

  const user = userEvent.setup()
  const mockHandler = vi.fn()

  const userForRender = { 'username' : 'Populated blog user2' }

  render(
    <MemoryRouter initialEntries={['/']}>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {
          !userForRender && (<Link style={padding} to="/login">login</Link>)
        }
        {
          userForRender && (<Link style={padding} to="/create">new blog</Link>)
        }
        {
          userForRender && (<Link style={padding} to="/login"><LogoutButton name="logout" logout={'logout'}/></Link>)
        }
      </div>
      <Routes>
        <Route path="/" element={<Blogs blogs={getBlogsSortedByLikes()}/>} />
        <Route path="/create" element={<NewBlogForm sendNewBlog={mockHandler}/>} />
        <Route path="/blogs/:id" element={<Blog blogs={blogs}/>} />
        { !userForRender &&
        (<Route path="/login" element={<LoginForm propsObject={'props'} />} />)
        }
      </Routes>
    </MemoryRouter>)

  await user.click(screen.getByRole('link', {
    name: 'new blog'
  }))

  const inputForTitle = screen.getByLabelText('title')
  await user.type(inputForTitle ,'Mock title of mock blog')
  const inputForAuthor = screen.getByLabelText('author')
  await user.type(inputForAuthor ,'Mock author of mock blog')
  const inputForUrl = screen.getByLabelText('url')
  await user.type(inputForUrl ,'Mock url of mock blog')
  const sendButton = screen.getByText('create')
  await user.click(sendButton)
  expect(mockHandler.mock.calls[0][0].title).toBe('Mock title of mock blog')
  expect(mockHandler.mock.calls[0][0].author).toBe('Mock author of mock blog')
  expect(mockHandler.mock.calls[0][0].url).toBe('Mock url of mock blog')
})
