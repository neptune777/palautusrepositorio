const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : 'no request body')

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    morganLogger,
    errorHandler,
    unknownEndpoint
}