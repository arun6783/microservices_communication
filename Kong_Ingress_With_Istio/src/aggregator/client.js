var fs = require('fs')
const grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync('./proto/quotes_service.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

function getClient() {
  const host = process.env.GRPC_SERVER_HOST || 'localhost'
  const port = process.env.GRPC_SERVER_PORT || 9000

  const serverAddr = `${host}:${port}`

  var quotes_service =
    grpc.loadPackageDefinition(packageDefinition).quotes_service

  var client

  const useTls = process.env.SECURE_TLS == 'yes'
  if (useTls) {
    console.log('client - tls enabled. server addr', serverAddr)
    const localChannelOptions = {
      'grpc.ssl_target_name_override': 'lotr.internal',
    }

    const rootCert = fs.readFileSync('../cert/ca.crt')

    creds = grpc.credentials.createSsl(rootCert)

    client = new quotes_service.QuoteService(
      serverAddr,
      creds,
      localChannelOptions
    )
  } else {
    client = new quotes_service.QuoteService(
      serverAddr,
      grpc.credentials.createInsecure()
    )
  }

  //call server

  return client
}

exports.CreateGrpcClient = getClient
