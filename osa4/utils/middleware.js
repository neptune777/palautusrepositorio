const morgan = require('morgan')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : 'no request body')

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}
const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    next()
}
const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    } else {
        request.user = user
    }
    next()
}
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).send({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    next(error)
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    morganLogger,
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}