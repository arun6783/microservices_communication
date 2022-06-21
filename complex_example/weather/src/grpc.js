const grpc = require('@grpc/grpc-js')
const fs = require('fs')

const serviceImpl = require('./grpc_server_impl')

const { GreetServiceService } = require('../proto/greet_grpc_pb')
const addr = 'localhost:5051'

function cleanup(server) {
  console.log('cleanup')

  if (server) {
    server.forceShutdown()
  }
}

function main() {
  const server = new grpc.Server()

  const tls = true
  let creds

  if (tls) {
    const rootCert = fs.readFileSync('./ssl/ca.crt')
    const certChain = fs.readFileSync('./ssl/server.crt')
    const privateKey = fs.readFileSync('./ssl/server.pem')

    creds = grpc.ServerCredentials.createSsl(rootCert, [
      {
        cert_chain: certChain,
        private_key: privateKey,
      },
    ])
  } else {
    creds = grpc.ServerCredentials.createInsecure()
  }

  process.on('SIGINT', () => {
    console.log('caught interrupt singal')

    cleanup(server)
  })

  server.addService(GreetServiceService, serviceImpl)

  server.bindAsync(addr, creds, (err, _) => {
    if (err) {
      return cleanup(server)
    }

    server.start()
  })

  console.log(`GRPC Server Listening at ${addr}`)
}

main()
