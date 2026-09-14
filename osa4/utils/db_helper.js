const Block = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithSeveralBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const listOfUsers = async () => {
    const saltRounds = 10

    return [
        {
            "username": "EasyUserName",
            "passwordHash": await bcrypt.hash("TooEasyPassword", saltRounds),
            "name": "EasyName"
        },
        {
            "username": "EasyUserName2",
            "passwordHash": await bcrypt.hash("TooEasyPassword2", saltRounds),
            "name": "EasyName2"
        },
        {
            "username": "EasyUserName3",
            "passwordHash": await bcrypt.hash("TooEasyPassword3", saltRounds),
            "name": "EasyName3"
        }
    ]
}

const nonExistingId = async () => {
    const deletableBlock = {
        title: "Dummy title",
        author: "Dummy author",
        url: "http://dummy_block.html",
        likes: 5
    }
    const block = new Block(deletableBlock)
    await block.save()
    await block.deleteOne()

    return block._id.toString()
}

const blogsInDb = async () => {
    const blocks = await Block.find({})
    return blocks.map(block => block.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    listWithOneBlog,
    listWithSeveralBlogs,
    nonExistingId,
    blogsInDb,
    listOfUsers,
    usersInDb
}