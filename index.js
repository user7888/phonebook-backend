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

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

const PORT = 3001
app.listen(PORT, () => {   
    console.log(`Server running on port ${PORT}`)
  })