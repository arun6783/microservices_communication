import * as grpc from '@grpc/grpc-js'

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
const squareRootClient = new squareroot_proto.SquareRoot(
  `${SQUAREROOTHOST}:${SQUAREROOTPORT}`,
  grpc.credentials.createInsecure()
)

const client = new square_proto.Square(
  `${SQUAREHOST}:${SQUAREPORT}`,
  grpc.credentials.createInsecure()
)

export { client, squareRootClient }
