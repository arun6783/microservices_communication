var fs = require('fs')
const path = require('path')
const grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
const hostname = process.env.HOSTNAME
const products = require('./data/products')
const axios = require('axios')
var PROTO_PATH = path.join(__dirname, '..', '..', 'protos', 'myshop.proto')
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

console.log('HOSTNAME', hostname)
const PORT = 4600

var myshop_service = grpc.loadPackageDefinition(packageDefinition).myshop

const getNumberOfReviews = async () => {
  const addr = process.env.EXTERNAL_API_ADDRESS
  if (addr) {
    try {
      const { data } = await axios.get(process.env.EXTERNAL_API_ADDRESS)
      return data
    } catch (err) {
      console.log(`error occured when calling - ${addr}. err = `, err)
    }
  } else {
    return null
  }
}
const getProductReview = async (call, callback) => {
  if (process.env.DEBUG_CALLS) {
    console.log(call.metadata)
  }
  const id = call.request.id
  if (id) {
    let product = products.find((x) => x.id == id)
    const reviews = await getNumberOfReviews()
    if (reviews) {
      product = { ...product, numReviews: { value: reviews } }
    }
    if (product) {
      callback(null, { ...product, hostname })
    } else {
      callback({
        code: 400,
        message: 'Cannot find product for given id',
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
  server.addService(myshop_service.ReviewsService.service, {
    getProductReview,
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
