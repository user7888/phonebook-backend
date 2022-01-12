const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.js')
// ( res )
morgan.token('type', function (req) { return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('build'))

// Returns the persons collection
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

// Info page
app.get('/info', (request, response) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date()

  const monthStr = months[date.getMonth()]
  const dayStr = days[date.getDay()]
  // length-method...
  Person
    .count({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${persons} people</p><p>${dayStr} ${monthStr} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT+0200 (Eastern European Standard Time)</p>`)
      console.log(`phonebook size... ${persons} ${dayStr} ${monthStr} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT+0200 (Eastern European Standard Time)`)
    })
})

// Returns a single phonebook entry
app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Deleting an entry from phonebook
app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Updating the phone number of a existing phonebook entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then(personAfterUpdate => {
      return response.json(personAfterUpdate)
    })
    .catch(error => {
      next(error)
    })
})

// Adding a new person to phonebook
app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })
  console.log(person)

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// For unknown route error handling
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// Function for generating a new id
const generateId = () => {
  const max = 1000
  const newId = Math.floor(Math.random() * max)
  return newId
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})