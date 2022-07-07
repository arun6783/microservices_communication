import * as grpc from '@grpc/grpc-js'
import { squareRootPackageDefinition } from '@aarchar/proto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.GRPC_PORT || 5500
const useSsl = process.env.USE_SSL == 'true' || false

let squareroot_proto = grpc.loadPackageDefinition(
  squareRootPackageDefinition
).squareroot

function getSquareRootResp(req, res) {
  res(null, {
    SquareRoot: Math.sqrt(req.request.id),
  })
}

function start() {
  let creds
  if (useSsl) {
    const rootCert = fs.readFileSync(path.join(__dirname, 'ssl', 'ca.crt'))
    const certChain = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
    const privateKey = fs.readFileSync(
      path.join(__dirname, 'ssl', 'server.pem')
    )

    creds = grpc.ServerCredentials.createSsl(rootCert, [
      {
        cert_chain: certChain,
        private_key: privateKey,
      },
    ])
  } else {
    creds = grpc.ServerCredentials.createInsecure()
  }

  let server = new grpc.Server()
  server.addService(squareroot_proto.SquareRoot.service, {
    getSquareRoot: getSquareRootResp,
  })

  server.bindAsync(`0.0.0.0:${port}`, creds, () => {
    server.start()
    console.log(
      `SquareRoot grpc server started at port=${port} , with ssl=${useSsl}`
    )
  })
}

start()
