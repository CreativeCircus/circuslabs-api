const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var Item = mongoose.model('Item', { name: String, type: String, content: String })

var error = function (message) {
  var output = Object.assign({}, {error: message})
  return output
}

var success = function (content, data) {
  if (!data) { data = {} }
  var output = Object.assign({}, {content: content}, data)
  return output
}

app.get('/', function (req, res) {
  res.charset = 'utf-8'
  res.set({
    'Content-Type': 'application/json'
  })

  res.send(success('Hello World!'))
})

app.get('/data/:name', function (req, res) {
  res.charset = 'utf-8'
  res.set({
    'Content-Type': 'application/json'
  })

  Item.findOne({ name: req.params.name }, function (err, item) {
    if (err) {
      console.error('error')
      res.status(500).send(error('Error occurred!'))
    } else if (!item) {
      res.status(404).send(error('Could not find data by that name'))
    } else {
      console.log(item)
      res.status(200).send(success(item.content))
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

    if (!req.body.type) {
      res.status(400).send(error('You must provide a data type'))
      return
    } else if (req.body.type !== 'number' && req.body.type !== 'string') {
      res.status(400).send(error("You must provide a valid data type of 'string' or 'number' "))
      return
    } else if (req.body.type === 'number') {
      if (isNaN(item.content) || !item.content || item.content === 'NaN') {
        item.content = 0
      }
      if (!req.body.action) {
        res.status(400).send(error("For numbers, you must provide an action: '++', '--', '+=', or '=' "))
        return
      } else if (req.body.action === '++') {
        item.content++
      } else if (req.body.action === '--') {
        item.content--
      } else if (req.body.action === '+=') {
        if (!req.body.quantity) {
          res.status(400).send(error("For numbers, with action '+=', you have to provide a quantity"))
          return
        }
        item.content -= -req.body.quantity
      } else if (req.body.action === '=') {
        if (!req.body.quantity) {
          res.status(400).send(error("For numbers, with action '=', you have to provide a quantity"))
          return
        }
        item.content = req.body.quantity
      }
    } else if (req.body.type === 'string') {
      if (!req.body.content) {
        res.status(400).send(error("For strings, you have to provide a 'content' property"))
        return
      } else if (req.body.content.length > 4096) {
        res.status(400).send(error('Strings have a max length of 4096 characters. Yours was ' + req.body.content.length + ' characters long.'))
        return
      }
      item.content = req.body.content
    }

    item.save()
    res.send(success(item.content))
  })
})

app.listen(3000, function () {
  console.log('API app listening on port 3000!')
})
