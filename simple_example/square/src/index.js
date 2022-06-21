import express from 'express'

import https from 'https'
import http from 'http'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const certOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
}
const app = express()

app.get('/api/square/:id', async (req, res) => {
  const { id } = req.params

  const square = Math.pow(id, 2)

  res.status(200).json(square)
})
const httpPort = 4000
const httpsPort = 4443

const httpServer = http.createServer(app)
const httpsServer = https.createServer(certOptions, app)

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server running on port ${httpPort}`)
})

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server running on port ${httpsPort}`)
})
