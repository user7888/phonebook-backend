const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('build'))

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
      
// GET JSON data
app.get('/api/persons', (req, res) => {
    console.log(persons, + 1)
    res.json(persons)
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

// GET person
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

// DELETE
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
   
    response.status(204).end()
  })

// ADD new person
app.post('/api/persons/', (request, response) => {
    const body = request.body


    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
    }

    const found = persons.find(person => person.name === body.name)
    if (found) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const person = {
       name: body.name,
       number: body.number,
       id: generateId()
    }
    console.log('tänne päästiin..')
    console.log(person)

    persons = persons.concat(person)
    response.json(person)
    console.log(person)
    // header print:
    console.log(request.headers)
  })

// route error handling
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

// function for generating a new id
const generateId = () => {
    const max = 1000
    const newId = Math.floor(Math.random() * max)
    return newId
  }

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {   
    console.log(`Server running on port ${PORT}`)
  })