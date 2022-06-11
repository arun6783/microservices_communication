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
