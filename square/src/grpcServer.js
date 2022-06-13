import * as grpc from '@grpc/grpc-js'
import { squarePackageDefinition } from '@aarchar/proto'

const PORT = 4500

let square_proto = grpc.loadPackageDefinition(squarePackageDefinition).square

function getSquareResp(req, res) {
  res(null, {
    square: Math.pow(req.request.id, 2),
  })
}

function start() {
  let server = new grpc.Server()
  server.addService(square_proto.Square.service, { getSquare: getSquareResp })

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log('grpc server started at port', PORT)
    }
  )
}

start()
