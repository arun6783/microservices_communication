import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
const PROTO_PATH = '../proto/squareroot.proto'
const PORT = 5500

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

let squareroot_proto = grpc.loadPackageDefinition(packageDefinition).squareroot

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
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log('square root grpc server started at port', PORT)
    }
  )
}

start()
