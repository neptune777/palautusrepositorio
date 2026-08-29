const express = require('express')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const config = require('./utils/config.js')
const logger = require('./utils/logger')
const middleWare = require('./utils/middleware')

const app = express()

logger.info('connecting to MongoDB')

mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(express.json())
app.use(middleWare.morganLogger)

app.use('/api/blogs', blogRouter)

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app