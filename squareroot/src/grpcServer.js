import * as grpc from '@grpc/grpc-js'
import { squareRootPackageDefinition } from '@aarchar/proto'

const port = process.env.GRPC_PORT || 5500

let squareroot_proto = grpc.loadPackageDefinition(
  squareRootPackageDefinition
).squareroot

function getSquareRootResp(req, res) {
  res(null, {
    SquareRoot: Math.sqrt(req.request.id),
  })
}

function start() {
  let server = new grpc.Server()
  server.addService(squareroot_proto.SquareRoot.service, {
    getSquareRoot: getSquareRootResp,
  })

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log('square root grpc server started at port', port)
    }
  )
}

start()
