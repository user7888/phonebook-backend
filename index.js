const express = require('express')
const app = express()
app.use(express.json())

// vaihdapuhelinluetteloksi..
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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
      
/*
    {
      id: 1,
      content: "HTML is easy",
      date: "2020-01-10T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2020-01-10T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2020-01-10T19:20:14.298Z",
      important: true
    }
  
]
*/

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

const PORT = 3001
app.listen(PORT, () => {   
    console.log(`Server running on port ${PORT}`)
  })