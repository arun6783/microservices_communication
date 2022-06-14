//implement grpc aggregator route  and call square service using grpc
import express from 'express'
import { client, squareRootClient } from '../utils/build-grpc-client.js'
const router = express.Router()

router.get('/api/grpc/:limit', async (req, res) => {
  const { limit } = req.params
  let resp = {}

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

  res.send(resp)
})

async function getSquare(i, responseData) {
  return new Promise((resolve, reject) =>
    client.getSquare({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }
      responseData.square = response.square
      resolve()
    })
  )
}

async function getSquareRoot(i, responseData) {
  return new Promise((resolve, reject) =>
    squareRootClient.getSquareRoot({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }
      responseData.squareRoot = response.SquareRoot
      resolve()
    })
  )
}
export { router as grpcRouter }
