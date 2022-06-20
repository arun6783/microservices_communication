import * as grpc from '@grpc/grpc-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import {
  squarePackageDefinition,
  squareRootPackageDefinition,
} from '@aarchar/proto'

const SQUAREHOST = process.env.SQUARE_HOST || 'localhost'
const SQUAREROOTHOST = process.env.SQUARE_ROOT_HOST || 'localhost'

const SQUAREPORT = process.env.SQUARE_GRPC_PORT || 4500
const SQUAREROOTPORT = process.env.SQUARE_ROOT_GRPC_PORT || 5500

let squareroot_proto = grpc.loadPackageDefinition(
  squareRootPackageDefinition
).squareroot

let square_proto = grpc.loadPackageDefinition(squarePackageDefinition).square

const useSSL = process.env.USE_SSL == 'true'
let creds

if (useSSL) {
  const rootCert = fs.readFileSync(path.join(__dirname, '..', 'ssl', 'ca.crt'))

  creds = grpc.ChannelCredentials.createSsl(rootCert)
} else {
  creds = grpc.ChannelCredentials.createInsecure()
}

const squareRootClient = new squareroot_proto.SquareRoot(
  `${SQUAREROOTHOST}:${SQUAREROOTPORT}`,
  creds
)

const client = new square_proto.Square(`${SQUAREHOST}:${SQUAREPORT}`, creds)

export { client, squareRootClient }
