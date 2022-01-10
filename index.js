const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person.js')
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('build'))
/*
let persons = [
        {
            name: "Ada Lovelace",
            number: "12345-12345",
            id: 2
        },
        {
            name: "Dan Abramov",
            number: "12-43-234345",
            id: 3
        },
        {
            name: "Pök R. Ollikainen",
            number: "1234-66-789445",
            id: 5
        }
]
*/

/*            old code
// Mongoosen määrittelyt (siirretty person.js tiedostoon):
const url =
  `mongodb+srv://new_user1:${password}@cluster0.mxf0p.mongodb.net/phone-book?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)
// format objects fetched from database
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
*/

/* old route for JSON data
app.get('/api/persons', (req, res) => {
    console.log(persons, + 1)
    res.json(persons)
  })
*/

// route for JSON data
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

// GET info page
app.get('/info', (req, res) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const date = new Date()

    const monthStr = months[date.getMonth()]
    const dayStr = days[date.getDay()]

    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${dayStr} ${monthStr} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT+0200 (Eastern European Standard Time)</p>`)
    console.log(`${dayStr} ${monthStr} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT+0200 (Eastern European Standard Time)`)

  })

// Returns a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

/*           old code
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    //const note = notes.find(note => note.id === id)
    const person = persons.find(person => {
        console.log(person.id, typeof person.id, id, typeof id, person.id === id)
        return person.id === id})
    console.log(person)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })
*/

// Deleting a person from phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
   
    response.status(204).end()
  })

// Adding a new person to phonebook
app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
    }

    // needs to be updated
    // const found = persons.find(person => person.name === body.name)
    //if (found) {
    //    return response.status(400).json({ 
    //        error: 'name must be unique' 
    //      })
    //}

    const person = new Person({
       name: body.name,
       number: body.number,
       id: generateId()
    })
    console.log('tänne päästiin..')
    console.log(person)

/*       old saving functionality
    persons = persons.concat(person)
    response.json(person)
    console.log(person)
    // header print:
    console.log(request.headers)
*/
    person.save().then(savedPerson => {
    response.json(savedPerson)
})
  })

// For route error handling
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

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