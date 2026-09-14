const logger = require('../utils/logger.js')
const dbHelper = require('../utils/db_helper.js')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const jwt = require('jsonwebtoken')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = await User.insertMany(await dbHelper.listOfUsers())
  const user = users[0]

  const blogs = await Blog.insertMany(
    dbHelper.listWithSeveralBlogs.map(blog => ({
      ...blog,
      user: user._id
    }))
  )
  user.blogs = blogs.map(blog => blog._id)
  await user.save()
})
const getTokenForTests = async () => {
  const user = await User.findOne({ username: 'EasyUserName' })
  return jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
}
describe('blog api tests', () => {

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    const listOfUsers = await dbHelper.listOfUsers()
    assert.strictEqual(response.body.length, listOfUsers.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('user without password can not be added and valid error message is returned', async () => {
    const userWithNoPassWord = {
      "username": "username",
      "user": "user"
    }
    const userCountBeforeAddition = await dbHelper.usersInDb()
    const response = await api.post('/api/users')
      .send(userWithNoPassWord)
      .expect(400)
    const userCountAfterAddition = await dbHelper.usersInDb()

    assert.ok(userCountBeforeAddition.length === userCountAfterAddition.length && response.body.error === 'password missing' && response.status === 400)
  })

  test('user with too short password can not be added and valid error message is returned', async () => {
    const userWithTooShortPassword = {
      "user": "user",
      "password": "pp",
      "username": "username"
    }
    const userCountBeforeAddition = await dbHelper.usersInDb()
    const response = await api.post('/api/users')
      .send(userWithTooShortPassword)
      .expect(400)
    const userCountAfterAddition = await dbHelper.usersInDb()

    assert.ok(userCountBeforeAddition.length === userCountAfterAddition.length && response.body.error === 'password length < 3' && response.status === 400)
  })

  test('user without username can not be added and valid error message is returned', async () => {
    const userWithNoUserName = {
      "user": "user",
      "password": "password"
    }
    const userCountBeforeAddition = await dbHelper.usersInDb()
    const response = await api.post('/api/users')
      .send(userWithNoUserName)
      .expect(400)
    const userCountAfterAddition = await dbHelper.usersInDb()

    assert.ok(userCountBeforeAddition.length === userCountAfterAddition.length && response.body.error === 'User validation failed: username: Path `username` is required.' && response.status === 400)
  })

  test('user with too short username can not be added and valid error message is returned', async () => {
    const userWithTooShortUsername = {
      "user": "user",
      "username": "uu",
      "password": "ppp"
    }
    const userCountBeforeAddition = await dbHelper.usersInDb()
    const response = await api.post('/api/users')
      .send(userWithTooShortUsername)
      .expect(400)
    const userCountAfterAddition = await dbHelper.usersInDb()

    assert.ok(userCountBeforeAddition.length === userCountAfterAddition.length && response.body.error === 'User validation failed: username: Path `username` (`uu`, length 2) is shorter than the minimum allowed length (3).' && response.status === 400)
  })

  test('username that is not unique can not be added and valid error message is returned', async () => {
    const userWithNoUniqueUsername = {
      "username": "EasyUserName",
      "password": "password",
      "name": "name"
    }
    const userCountBeforeAddition = await dbHelper.usersInDb()
    const response = await api.post('/api/users')
      .send(userWithNoUniqueUsername)
      .expect(400)
    const userCountAfterAddition = await dbHelper.usersInDb()

    assert.ok(userCountBeforeAddition.length === userCountAfterAddition.length && response.body.error === 'expected `username` to be unique' && response.status === 400)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, dbHelper.listWithSeveralBlogs.length)
  })

  test('blog identifier is id', async () => {
    const response = await api.get('/api/blogs')
    const propertyNamesOfFirst = Object.getOwnPropertyNames(response.body[0])
    const fieldThatIncludeId = propertyNamesOfFirst.find(propertyName => propertyName.includes('id'))
    assert.strictEqual(fieldThatIncludeId, 'id')
  })

  test('new blog will be saved to database', async () => {
    const tokenForTests = await getTokenForTests()
    const blogsInDbBeforeAdditions = await dbHelper.blogsInDb()
    const countOfBlogsBeforePost = blogsInDbBeforeAdditions.length
    const newBlog = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": 34,
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(201)
    const blogsInDbAfterAdditions = await dbHelper.blogsInDb()
    const countOfBlogsAfterPost = blogsInDbAfterAdditions.length
    assert.strictEqual(countOfBlogsBeforePost + 1, countOfBlogsAfterPost)
  })

  test('the content of the new blog is valid', async () => {
    const tokenForTests = await getTokenForTests()
    const newBlog = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": 34,
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(201)
    const propertyNamesOfFirst = Object.getOwnPropertyNames(response.body).map(propertyName => {
      if (propertyName === 'title' || propertyName === 'author' || propertyName === 'likes' || propertyName === 'url') {
        return propertyName
      }
    })
    assert.ok(propertyNamesOfFirst.includes('title')
      && propertyNamesOfFirst.includes('author')
      && propertyNamesOfFirst.includes('likes')
      && propertyNamesOfFirst.includes('url'))
  })

  test(`the field 'likes' will be initialized with 0 in case no value`, async () => {
    const tokenForTests = await getTokenForTests()
    const newBlog = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": null,
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(201)

    const newBlog2 = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": '',
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    const response2 = await api.post('/api/blogs')
      .send(newBlog2)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(201)

    const newBlog3 = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    const response3 = await api.post('/api/blogs')
      .send(newBlog3)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(201)

    assert.ok(response.body.likes === 0 && response2.body.likes === 0 && response3.body.likes === 0)
  })

  test(`in case field 'title' or 'url' is missing, '400 Bad Request' will be returned`, async () => {
    const tokenForTests = await getTokenForTests()
    const blogsInDbBeforeAdditions = await dbHelper.blogsInDb()
    const countOfBlogsBeforeAdditions = blogsInDbBeforeAdditions.length

    const newBlog = {
      "author": "Miia Simunaniemi",
      "likes": 34,
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(400)

    const newBlog2 = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": 34,
    }
    await api.post('/api/blogs')
      .send(newBlog2)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(400)

    const blogsInDbAfterAdditions = await dbHelper.blogsInDb()
    const countOfBlogsAfterAdditions = blogsInDbAfterAdditions.length

    assert.strictEqual(countOfBlogsBeforeAdditions, countOfBlogsAfterAdditions)
  })

  test('blog cannot be added without authentication', async () => {
    const blogsInStart = await dbHelper.blogsInDb()
    const blogToAdd = {
      "title": "Miia Tsunami",
      "author": "Miia Simunaniemi",
      "likes": 34,
      "url": "https://thetrek.co/author/miia-simunaniemi/"
    }
    await api.post(`/api/blogs`)
      .send(blogToAdd)
      .expect(401)
    const blogsInEnd = await dbHelper.blogsInDb()
    assert.ok(blogsInStart.length === blogsInEnd.length)
  })

  test('blog can be deleted by id', async () => {
    const tokenForTests = await getTokenForTests()
    const blogsInStart = await dbHelper.blogsInDb()
    const blogToDelete = blogsInStart[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + tokenForTests)
      .expect(204)
    const blogsInEnd = await dbHelper.blogsInDb()
    const ids = blogsInEnd.map(blog => blog.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })

  test('blog can be modified by id', async () => {

    let blogs = await dbHelper.blogsInDb()
    const modifiable = blogs[0]
    modifiable.likes++
    modifiable.author = 'dummy author'
    modifiable.title = 'dummy title'
    modifiable.url = 'dummy url'

    const response = await api.put(`/api/blogs/${modifiable.id}`)
      .send(modifiable)
      .expect(200)

    assert.ok(response.body.likes === modifiable.likes
      && response.body.author === modifiable.author
      && response.body.title === modifiable.title
      && response.body.url === modifiable.url)
  })
})

after(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
