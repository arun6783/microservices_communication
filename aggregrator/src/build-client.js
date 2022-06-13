import * as dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

const buildSquareClient = () => {
  return axios.create({
    baseURL: `http://${process.env.SQUARE_HOST}:${process.env.SQUARE_PORT}`,
  })
}

const buildSquareRootClient = () => {
  return axios.create({
    baseURL: `http://${process.env.SQUARE_ROOT_HOST}:${process.env.SQUARE_ROOT_PORT}`,
  })
}
export { buildSquareClient, buildSquareRootClient }
