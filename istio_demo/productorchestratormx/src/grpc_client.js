var fs = require('fs')
const grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync('../protos/myshop.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const serviceConst = {
  ProductsDetailsService: {
    host: process.env.ProductOrchestratorGrpcHost || 'localhost',
    port: process.env.ProductOrchestratorGrpcPort || '5500',
    serviceName: 'ProductsDetailsService',
  },

  StockService: {
    host: process.env.ProductOrchestratorGrpcHost || 'localhost',
    port: process.env.ProductOrchestratorGrpcPort || '4100',
    serviceName: 'StockService',
  },

  ReviewsService: {
    host: process.env.ProductOrchestratorGrpcHost || 'localhost',
    port: process.env.ProductOrchestratorGrpcPort || '4600',
    serviceName: 'ReviewsService',
  },
}

function getClient(service) {
  const serverAddr = `${service.host}:${service.port}`

  var myshop_service = grpc.loadPackageDefinition(packageDefinition).myshop

  var client

  const useTls = process.env.SECURE_TLS == 'yes'
  if (useTls) {
    console.log('client - tls enabled. server addr', serverAddr)
    const localChannelOptions = {
      'grpc.ssl_target_name_override': 'lotr.internal',
    }

    const rootCert = fs.readFileSync('../cert/ca.crt')

    creds = grpc.credentials.createSsl(rootCert)

    client = new myshop_service[service.serviceName](
      serverAddr,
      creds,
      localChannelOptions
    )
  } else {
    client = new myshop_service[service.serviceName](
      serverAddr,
      grpc.credentials.createInsecure()
    )
  }

  //call server

  return client
}

exports.CreateGrpcClient = getClient

exports.ServiceConsts = serviceConst
