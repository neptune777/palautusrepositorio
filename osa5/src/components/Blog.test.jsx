import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import Blogs from './Blogs'
import LoginForm from './LoginForm'
import NewBlogForm from './NewBlogForm'
import LogoutButton from './LogoutButton'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  BrowserRouter as Router,
  MemoryRouter,
  Routes, Route, Link
} from 'react-router-dom'

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
const wrapperForRerender = (user, reRenderFunction, padding, blogs) => {

  reRenderFunction(
    <MemoryRouter initialEntries={['/']}>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {
          !user && (<Link style={padding} to="/login">login</Link>)
        }
        {
          user && (<Link style={padding} to="/create">new blog</Link>)
        }
        {
          user && (<Link style={padding} to="/login"><LogoutButton name="logout" logout={'logout'}/></Link>)
        }
      </div>
      <Routes>
        <Route path="/" element={<Blogs blogs={getBlogsSortedByLikes()}/>} />
        <Route path="/blogs/:id" element={<Blog blog={blogs[0]} user={user}/>} />
        { !user &&
        (<Route path="/login" element={<LoginForm propsObject={'props'} />} />)
        }
      </Routes>
    </MemoryRouter>)
}

test(`1. logged-out user sees details but no buttons
      2. another user sees only the like button
      3. creator sees like and remove buttons`, async () => {

  const user = undefined
  const { rerender } = render(
    <MemoryRouter initialEntries={['/']}>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {
          !user && (<Link style={padding} to="/login">login</Link>)
        }
        {
          user && (<Link style={padding} to="/create">new blog</Link>)
        }
        {
          user && (<Link style={padding} to="/login"><LogoutButton name="logout" logout={'logout'}/></Link>)
        }
      </div>
      <Routes>
        <Route path="/" element={<Blogs blogs={getBlogsSortedByLikes()}/>} />
        <Route path="/blogs/:id" element={<Blog blog={blogs[0]}/>} />
        { !user &&
        (<Route path="/login" element={<LoginForm propsObject={'props'} />} />)
        }
      </Routes>
    </MemoryRouter>)

  const element = screen.getByText('Mock title of a blog by Mock author')

  expect(element).toBeDefined()

  await userEvent.click(screen.getByRole('link', {
    name: 'Mock title of a blog by Mock author'
  }))

  const title = screen.getByText('Mock title of a blog')
  expect(title).toBeVisible()
  const likeCountText = screen.getByText('0 likes')
  expect(likeCountText).toBeVisible()
  const urlText = screen.getByText('Mock url')
  expect(urlText).toBeVisible()
  const textOfBlogAdder = screen.getByText('Added by Populated blog user')
  expect(textOfBlogAdder).toBeVisible()
  expect(screen.queryByRole('button', { name: 'like', exact: true })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove', exact: true })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('link', {
    name: 'blogs'
  }))

  const userForRerender = { 'username' : 'Populated blog user2' }
  wrapperForRerender(userForRerender, rerender, padding, blogs)

  await userEvent.click(screen.getByRole('link', {
    name: 'Mock title of a blog by Mock author'
  }))

  const title2 = screen.getByText('Mock title of a blog')
  expect(title2).toBeVisible()
  const likeCountText2 = screen.getByText('0 likes')
  expect(likeCountText2).toBeVisible()
  const urlText2 = screen.getByText('Mock url')
  expect(urlText2).toBeVisible()
  const textOfBlogAdder2 = screen.getByText('Added by Populated blog user')
  expect(textOfBlogAdder2).toBeVisible()
  expect(screen.queryByRole('button', { name: 'like', exact: true })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove', exact: true })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('link', {
    name: 'blogs'
  }))

  const userForRerender2 = { 'username' : 'Populated blog user' }
  wrapperForRerender(userForRerender2, rerender, padding, blogs)

  await userEvent.click(screen.getByRole('link', {
    name: 'Mock title of a blog by Mock author'
  }))

  const title3 = screen.getByText('Mock title of a blog')
  expect(title3).toBeVisible()
  const likeCountText3 = screen.getByText('0 likes')
  expect(likeCountText3).toBeVisible()
  const urlText3 = screen.getByText('Mock url')
  expect(urlText3).toBeVisible()
  const textOfBlogAdder3 = screen.getByText('Added by Populated blog user')
  expect(textOfBlogAdder3).toBeVisible()
  expect(screen.queryByRole('button', { name: 'like', exact: true })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove', exact: true })).toBeInTheDocument()
})

test('handler function of likes is called as many times as expected', async () => {

  const mockHandler = vi.fn()
  const user = { 'username' : 'Populated blog user' }

  render(
    <MemoryRouter initialEntries={['/']}>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {
          !user && (<Link style={padding} to="/login">login</Link>)
        }
        {
          user && (<Link style={padding} to="/create">new blog</Link>)
        }
        {
          user && (<Link style={padding} to="/login"><LogoutButton name="logout" logout={'logout'}/></Link>)
        }
      </div>
      <Routes>
        <Route path="/" element={<Blogs blogs={getBlogsSortedByLikes()}/>} />
        <Route path="/create" element={<NewBlogForm sendNewBlog={mockHandler}/>} />
        <Route path="/blogs/:id" element={<Blog blog={blogs[0]} modifyBlog={mockHandler} user={user}/>} />
        { !user &&
        (<Route path="/login" element={<LoginForm propsObject={'props'} />} />)
        }
      </Routes>
    </MemoryRouter>)
  await userEvent.click(screen.getByRole('link', {
    name: 'Mock title of a blog by Mock author'
  }))
  const buttonForLikes = screen.getByRole('button', { name: 'like', exact: true })
  await userEvent.click(buttonForLikes)
  await userEvent.click(buttonForLikes)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
