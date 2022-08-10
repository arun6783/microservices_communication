var fs = require('fs')
const path = require('path')
const grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
const products = require('./data/products')
var PROTO_PATH = path.join(__dirname, '..', '..', 'protos', 'myshop.proto')
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const PORT = 4100

var myshop_service = grpc.loadPackageDefinition(packageDefinition).myshop

function getStockInCount(call, callback) {
  if (process.env.DEBUG_CALLS) {
    console.log(call.metadata)
  }
  const id = call.request.id
  if (id) {
    const product = products.find((x) => x.id == id)

    if (product) {
      callback(null, product)
    } else {
      callback({
        code: 400,
        message: 'invalid input',
        status: grpc.status.NOT_FOUND,
      })
    }
  } else {
    callback({
      code: 400,
      message: 'Id is required',
      status: grpc.status.NOT_FOUND,
    })
  }
}

function main() {
  var server = new grpc.Server()
  server.addService(myshop_service.StockService.service, {
    getStockInCount,
  })

  let creds = grpc.ServerCredentials.createInsecure()
  const useTls = process.env.SECURE_TLS == 'yes'
  if (useTls) {
    console.log('grpc using secure TLS')

    const rootCert = fs.readFileSync('../cert/ca.crt')
    const certChain = fs.readFileSync('../cert/server.crt')
    const privateKey = fs.readFileSync('../cert/server.pem')

    creds = grpc.ServerCredentials.createSsl(rootCert, [
      {
        cert_chain: certChain,
        private_key: privateKey,
      },
    ])
  }

  server.bindAsync(`0.0.0.0:${PORT}`, creds, (err, _) => {
    if (!err) {
      server.start()
      console.log(`Product detail grpc server listening at port ${PORT}`)
    } else {
      console.log('Product detail server start error ', err)
    }
  })
}

main()
