const axios = require('axios')
const https = require('https')
const dotenv = require('dotenv')
dotenv.config()
// const fs = require('fs')
// const path = require('path')
// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// {
//   ca: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'ca.crt')),
//   key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.pem')),
//   cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.crt')),
//   passphrase: '1111',
// }
const httpsAgent = new https.Agent()

const buildhotelsClient = () => {
  return process.env.USE_SSL == 'true'
    ? axios.create({
        baseURL: `https://${process.env.HOTELS_SSL_ADDRESS}`,
        httpsAgent: httpsAgent,
      })
    : axios.create({
        baseURL: `http://${process.env.HOTELS_ADDRESS}`,
      })
}

const buildweatherClient = () => {
  return process.env.USE_SSL == 'true'
    ? axios.create({
        baseURL: `https://${process.env.WEATHER_SSL_ADDRESS}`,
        httpsAgent: httpsAgent,
      })
    : axios.create({
        baseURL: `http://${process.env.WEATHER_ADDRESS}`,
      })
}
module.exports = { buildhotelsClient, buildweatherClient }
