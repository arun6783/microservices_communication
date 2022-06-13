//implement grpc aggregator route  and call square service using grpc
import express from 'express'
import * as grpc from '@grpc/grpc-js'
import {
  squarePackageDefinition,
  squareRootPackageDefinition,
} from '@aarchar/proto'

const SQUAREHOST = process.env.SQUARE_HOST || 'localhost'
const SQUAREROOTHOST = process.env.SQUARE_ROOT_HOST || 'localhost'

const SQUAREPORT = process.env.SQUARE_GRPC_PORT || 4500
const SQUAREROOTPORT = process.env.SQUARE_ROOT_GRPC_PORT || 5500

const router = express.Router()

let square_proto = grpc.loadPackageDefinition(squarePackageDefinition).square

let client = new square_proto.Square(
  `${SQUAREHOST}:${SQUAREPORT}`,
  grpc.credentials.createInsecure()
)

let squareroot_proto = grpc.loadPackageDefinition(
  squareRootPackageDefinition
).squareroot

let squareRootClient = new squareroot_proto.SquareRoot(
  `${SQUAREROOTHOST}:${SQUAREROOTPORT}`,
  grpc.credentials.createInsecure()
)

console.log('first', `${SQUAREHOST}:${SQUAREPORT}`)
console.log('client', client)

console.log('squareRootClient', squareRootClient)

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
