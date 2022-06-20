import * as grpc from '@grpc/grpc-js'
import { squarePackageDefinition } from '@aarchar/proto'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 4500
const useSsl = process.env.USE_SSL == 'true' || true

let square_proto = grpc.loadPackageDefinition(squarePackageDefinition).square

function getSquareResp(req, res) {
  res(null, {
    square: Math.pow(req.request.id, 2),
  })
}

function start() {
  let server = new grpc.Server()
  server.addService(square_proto.Square.service, { getSquare: getSquareResp })

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

  server.bindAsync(`0.0.0.0:${PORT}`, creds, () => {
    server.start()
    console.log(
      `Square grpc server started at port=${PORT} , with ssl=${useSsl}`
    )
  })
}

start()
