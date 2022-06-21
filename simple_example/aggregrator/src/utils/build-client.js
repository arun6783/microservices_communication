import * as dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

import https from 'https'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const httpsAgent = new https.Agent({
  ca: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'ca.crt')),
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.crt')),
  passphrase: '1111',
})

const buildSquareClient = () => {
  let sqclient =
    process.env.USE_SSL == 'true'
      ? axios.create({
          baseURL: `https://${process.env.SQUARE_HOST}:${process.env.SQUARE_SSL_PORT}`,
          httpsAgent: httpsAgent,
        })
      : axios.create({
          baseURL: `http://${process.env.SQUARE_HOST}:${process.env.SQUARE_PORT}`,
        })

  return sqclient
}

const buildSquareRootClient = () => {
  let sqrtclient =
    process.env.USE_SSL == 'true'
      ? axios.create({
          baseURL: `https://${process.env.SQUARE_ROOT_HOST}:${process.env.SQUARE_ROOT_SSL_PORT}`,
          httpsAgent: httpsAgent,
        })
      : axios.create({
          baseURL: `http://${process.env.SQUARE_ROOT_HOST}:${process.env.SQUARE_ROOT_PORT}`,
        })

  return sqrtclient
}
export { buildSquareClient, buildSquareRootClient }
