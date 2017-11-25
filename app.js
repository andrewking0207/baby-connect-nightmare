
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var diaper = require('./src/diaper')
var bottle = require('./src/bottle')
var kids = require('./src/kids')
var bottleTime = require('./src/bottleTime')
var diaperTime = require('./src/diaperTime')
var fs = require('fs')
var https = require('https')
var http = require('http')
var swaggerJSDoc = require('swagger-jsdoc')

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger'
  },
  host: 'localhost:3000',
  basePath: '/'
}
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js']
}

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options)

var email = 'andrewking0207@gmail.com'
var password = 'goes here'
app.use(bodyParser.json())

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.get('/kids', function (req, res) {
  kids(email, password).then(function (kids) {
    res.status(200).json(kids)
  }).catch(function (error) {
    res.status(500).json({ error: error })
  })
})

app.get('/diaper', function (req, res) {
  diaperTime(email, password).then(function (diaperTime) {
    res.status(200).json(diaperTime)
  }).catch(function (error) {
    res.status(500).json({ error: error })
  })
})

app.post('/diaper', function (req, res) {
  if (!req.body) {
    return res.sendStatus(400)
  }

  diaper(email, password, req.body.type).then(function () {
    res.status(200).json({})
  }).catch(function (error) {
    res.status(500).json({ error: error })
  })
})

app.get('/bottle', function (req, res) {
  bottleTime(email, password).then(function (bottleTime) {
    res.status(200).json(bottleTime)
  }).catch(function (error) {
    res.status(500).json({ error: error })
  })
})

app.post('/bottle', function (req, res) {
  if (!req.body) {
    return res.sendStatus(400)
  }

  bottle(email, password, req.body.quantity).then(function () {
    res.status(200).json({})
  }).catch(function (error) {
    res.status(500).json({ error: error })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('baby-connect-nightmare app listening on port 3000!')
})

// https.createServer(options, app).listen(3033, function () {
//    console.log('Started!');
// });
