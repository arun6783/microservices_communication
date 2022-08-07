var fs = require('fs')
const path = require('path')
const grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
const { init_data } = require('./data')
var PROTO_PATH = path.join(__dirname, 'proto', 'quotes_service.proto')
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const PORT = process.env.GRPC_PORT || 9000

var quotes_service =
  grpc.loadPackageDefinition(packageDefinition).quotes_service

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getQuote(call, callback) {
  if (process.env.DEBUG_CALLS) {
    console.log(call.metadata)
  }
  callback(null, init_data[randomIntFromInterval(0, 7)])
}

function main() {
  var server = new grpc.Server()
  server.addService(quotes_service.QuoteService.service, {
    GetQuote: getQuote,
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
      console.log(`grpc server listening at port ${PORT}`)
    } else {
      console.log('server start error ', err)
    }
  })
}

main()
