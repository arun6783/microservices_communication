const express = require('express')
const { init_data } = require('./data')
const cors = require('cors')
const fs = require('fs')
const http = require('http')
const https = require('https')
const app = express()

app.use(cors())

const port = process.env.NODE_PORT || '9500'
const httpsPort = process.env.NODE_HTTPS_PORT || '9600'

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

app.get('/api/GetQuote', (req, res) =>
  res.json(init_data[randomIntFromInterval(0, 7)])
)

const certOptions = {
  key: fs.readFileSync('../cert/server.pem'),
  cert: fs.readFileSync('../cert/server.crt'),
}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(certOptions, app)

httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`)
})

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server running on port ${httpsPort}`)
})
