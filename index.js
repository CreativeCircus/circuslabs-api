const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

const APP_NAME = 'Circuslabs General Purpose API'
const VERSION = '2.0.1'
const PORT = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var Item = mongoose.model('Item', {
  name: String,
  type: String,
  value: String
})

var error = function (message) {
  var output = Object.assign({status: 'error'}, {message: message})
  return output
}

var fail = function (message) {
  var output = Object.assign({status: 'fail'}, {message: message})
  return output
}
var success = function (message, data) {
  var output = Object.assign({status: 'success'})
  if (message) output = Object.assign(output, {message})
  if (data) output = Object.assign(output, {data})
  return output
}

var stripItemForJSON = function (item) {
  let stripped = {
    value: item.value,
    type: item.type,
    key: item.name
  }
  if (stripped.type === 'number') {
    stripped.value = parseFloat(stripped.value)
  }
  return stripped
}

app.get('/', function (req, res) {
  res.charset = 'utf-8'
  res.set({
    'Content-Type': 'application/json'
  })

  res.send(success(`${APP_NAME}, v${VERSION}, running on port ${PORT}!`))
})




app.get('/data/:name', function (req, res) {
  res.charset = 'utf-8'
  res.set({
    'Content-Type': 'application/json'
  })

  Item.findOne({ name: req.params.name }, function (err, item) {
    if (err) {
      console.warn('Error while running mongo findOne')
      res.status(500).send(error('Error occurred!'))
    } else if (!item) {
      res.status(404).send(fail('Could not find data by that name'))
    } else {
      res.status(200).send(success('Found your data!', stripItemForJSON(item)))
    }
  })
})




app.post('/data/:name', function (req, res) {
  res.charset = 'utf-8'
  res.set({
    'Content-Type': 'application/json'
  })

  Item.findOne({ name: req.params.name }, function (err, item) {
    if (err) {
      console.error('error')
      res.status(500).send(error('Error occurred!'))
      return
    }
    if (!item) {
      item = new Item()
      item.name = req.params.name
    }

    if (!req.body.type || (req.body.type !== 'number' && req.body.type !== 'string')) {
      res.status(400).send(fail("You must provide a data type of 'string' or 'number'"))
      return
    } else if (req.body.type === 'number') {
      if (isNaN(item.value) || !item.value || item.value === 'NaN' || item.value === '0') {
        item.value = 0
      }
      if (!req.body.action) {
        res.status(400).send(fail("For numbers, you must provide an action: '++', '--', '+=', or '=' "))
        return
      } else if (req.body.action === '++') {
        item.value++
      } else if (req.body.action === '--') {
        item.value--
      } else if (req.body.action === '+=') {
        item.value -= -req.body.value
      } else if (req.body.action === '=') {
        item.value = req.body.value
      } else {
        res.status(400).send(fail("For numbers, you must provide an action: '++', '--', '+=', or '=' "))
        return
      }
    } else if (req.body.type === 'string') {
      if (typeof req.body.value !== 'string') {
        res.status(400).send(fail("For strings, you have to provide a 'value' property"))
        return
      } else if (req.body.value.length > 4096) {
        res.status(400).send(fail('Strings have a max length of 4096 characters. Yours was ' + req.body.value.length + ' characters long.'))
        return
      }
      item.value = req.body.value
    }
    item.type = req.body.type
    item.save()
    res.status(200).send(success('Data saved/updated', stripItemForJSON(item)))
  })
})

app.listen(PORT, function () {
  console.log(`${APP_NAME}, v${VERSION}, running on port ${PORT}!`)
})
