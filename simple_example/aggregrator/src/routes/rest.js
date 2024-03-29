import express from 'express'
import {
  buildSquareClient,
  buildSquareRootClient,
} from '../utils/build-client.js'

const router = express.Router()
const client = buildSquareClient()
const squareRootClient = buildSquareRootClient()

router.get('/api/rest/:limit', async (req, res) => {
  const { limit } = req.params
  let resp = { totalTimeInMs: 0 }
  let startTime = new Date()
  for (let i = 1; i <= limit; i++) {
    try {
      let responseData = { square: null, squareRoot: null }
      await Promise.all([
        getSquare(i, responseData),
        getSquareRoot(i, responseData),
      ])
      resp[i] = responseData
    } catch (er) {
      console.log('error = ', er)
    }
  }
  let endTime = new Date()
  resp.totalTimeInMs = endTime - startTime
  res.send(resp)
})

async function getSquare(i, responseData) {
  try {
    const { data } = await client.get(`/api/square/${i}`)
    responseData.square = data
  } catch (err) {
    console.log('square service', err)
  }
  return
}

async function getSquareRoot(i, responseData) {
  try {
    const { data } = await squareRootClient.get(`/api/squareroot/${i}`)
    responseData.squareRoot = data
  } catch (err) {
    console.log('sqrtserviceerr', err)
  }
  return
}

export { router as restRouter }
