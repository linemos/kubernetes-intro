const express = require('express')
const app = express()
const port = 5000

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.get('/api/me', (request, response) => {
  response.send('{"name": "Arthur Dent", "location": "Earth"}')
})

app.get('/api/work', (request, response) => {
  response.send('[{"yearFrom": "2010", "yearTo": "2018", "place": "BBC Radio", "comment": "Was doing stuff"}, {"yearFrom": "2009", "yearTo": "2010", "place": "The coffee shop", "comment": "Making coffee"}]')
})

app.get('/api/education', (request, response) => {
  response.send('[{"yearFrom": "2005", "yearTo": "2007", "place": "University 1", "comment": "Studying"}, {"yearFrom": "2001", "yearTo": "2004", "place": "Barista academy", "comment": "Made coffee"}]')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
