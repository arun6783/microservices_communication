//implement grpc aggregator route  and call square service using grpc
import express from 'express'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
const SQUAREPROTO_PATH = '../proto/square.proto'
const SQUAREROOTPROTO_PATH = '../proto/squareroot.proto'

const SQUAREPORT = 4500
const SQUAREROOTPORT = 5500

const router = express.Router()

let packageDefinition = protoLoader.loadSync(SQUAREPROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
let square_proto = grpc.loadPackageDefinition(packageDefinition).square

let client = new square_proto.Square(
  `localhost:${SQUAREPORT}`,
  grpc.credentials.createInsecure()
)

let squareRootPackageDefinition = protoLoader.loadSync(SQUAREROOTPROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

let squareroot_proto = grpc.loadPackageDefinition(
  squareRootPackageDefinition
).squareroot

let squareRootClient = new squareroot_proto.SquareRoot(
  `localhost:${SQUAREROOTPORT}`,
  grpc.credentials.createInsecure()
)

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
