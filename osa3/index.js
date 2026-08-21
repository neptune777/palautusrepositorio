const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
// Exercise 3.7:
// app.use(morgan('tiny'))
app.use(cors())
morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : 'no request body');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const dataOfPersonFound = persons.find(person => person.id === id)
    if (dataOfPersonFound) {
        response.json(dataOfPersonFound)
    } else {
        response.status(404).end()
    }
})

const generateRandomId = () => String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateRandomId(),
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const date = Date()
    response.send(` 
    <p> Phonebook has info for ${persons.length} people. </p>
    <p> ${date}</p>`
    )
})

const PORT = 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))