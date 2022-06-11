//implement grpc aggregator route  and call square service using grpc
import express from 'express'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
const PROTO_PATH = '../proto/square.proto'
console.log('protopath', PROTO_PATH)
const PORT = 4500

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
let square_proto = grpc.loadPackageDefinition(packageDefinition).square

const router = express.Router()

let client = new square_proto.Square(
  'localhost:4500',
  grpc.credentials.createInsecure()
)

router.get('/api/grpc/:limit', async (req, res) => {
  const { limit } = req.params
  let resp = {}
  for (let i = 1; i <= limit; i++) {
    try {
      let responseData = { square: null, squareRoot: null }
      responseData.square = await getSquare(i)
      resp[i] = responseData
    } catch (er) {
      console.log('error = ', er)
    }
  }
  res.send(resp)
})

async function getSquare(i) {
  return new Promise((resolve, reject) =>
    client.getSquare({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }
      resolve(response.square)
    })
  )
}

export { router as grpcRouter }
