import * as dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

const buildSquareClient = () => {
  return axios.create({
    baseURL: process.env.SQUARE_URL,
  })
}

const buildSquareRootClient = () => {
  return axios.create({
    baseURL: process.env.SQUARE_ROOT_URL,
  })
}
export { buildSquareClient, buildSquareRootClient }
