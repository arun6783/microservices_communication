//implement grpc aggregator route  and call square service using grpc
import express from 'express'
import { client, squareRootClient } from '../utils/build-grpc-client.js'
const router = express.Router()
import * as grpc from '@grpc/grpc-js'

let metaData

router.get('/api/grpc/:limit', async (req, res) => {
  const { limit } = req.params

  console.log('in grpc api, limit ', limit)
  metaData = new grpc.Metadata()

  Object.keys(req.headers).forEach((key) => {
    metaData.set(key, req.headers[key])
  })

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
  return new Promise((resolve, reject) =>
    client.getSquare({ id: i }, metaData, function (err, response) {
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
    squareRootClient.getSquareRoot(
      { id: i },
      metaData,
      function (err, response) {
        if (err) {
          return reject(err)
        }
        responseData.squareRoot = response.SquareRoot
        resolve()
      }
    )
  )
}
export { router as grpcRouter }
