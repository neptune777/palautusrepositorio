const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleWare = require('../utils/middleware')
const userExtractor = middleWare.userExtractor

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate({ path: 'user', select: ['name', 'username'] })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {

    const likesField = Object.keys(request.body).find(field => field === 'likes')
    if (typeof request.body.likes !== 'number' || likesField !== 'likes') {
        request.body.likes = 0
    }
    const user = request.user
    if (!user) {
        response.status(400).json({ error: 'UserId missing or not valid' })
    }
    const blog = new Blog(request.body)

    blog.user = user._id
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const deletableBlog = await Blog.findById(request.params.id)
    if (!deletableBlog) {
        return response.status(404).json({ error: 'deletable blog not found' })
    }
    const idOfBlogUser = deletableBlog.user

    if (!idOfBlogUser) {
        return response.status(400).json({ error: 'user id of blog missing or invalid' })
    }

    if (idOfBlogUser.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        user.blogs = user.blogs.filter(id => id.toString() !== request.params.id.toString())
        await user.save()
        return response.status(204).end()
    }
    return response.status(403).json({ error: 'deleting of blog is not allowed for this user id' })
})

blogRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const { title, author, url, likes } = request.body
    blog.author = author
    blog.title = title
    blog.likes = likes
    blog.url = url
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
})

module.exports = blogRouter