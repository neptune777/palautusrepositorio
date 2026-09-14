const lodash = require('lodash');
const dummy = (blogs) => {
    return 1
}

const totalLikes = (arrayOfBlogs) => arrayOfBlogs
    .reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)

const favoriteBlog = (arrayOfBlogs) => {
    //const maxLikes = arrayOfBlogs.reduce((accumulator, currentvalue) => Math.max(accumulator, currentvalue.likes), 0)
    return arrayOfBlogs
        .find(blog => blog.likes === arrayOfBlogs.reduce((accumulator, currentvalue) => Math.max(accumulator, currentvalue.likes), 0))
}


const mostBlogs = (arrayOfBLogs) => {
    const howManyBlogsPerAuthor = lodash.countBy(arrayOfBLogs, 'author')
    const authorsWithPropertyNames = lodash.map(howManyBlogsPerAuthor, (blogCount, author) => ({
        author,
        blogs: blogCount,
    }))
    return lodash.maxBy(authorsWithPropertyNames, 'blogs')
}

const mostLikes = (arrayOfBLogs) => {
    // Groups blogs as an array under each author
    const eachBlogByAuthor = lodash.groupBy(arrayOfBLogs, 'author')
    const authorsWithPropertyNames = lodash.map(eachBlogByAuthor, (authorBlogs, author) => ({
        author,
        likes: lodash.sumBy(authorBlogs, 'likes'),
    }))
    return lodash.maxBy(authorsWithPropertyNames, 'likes')
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}