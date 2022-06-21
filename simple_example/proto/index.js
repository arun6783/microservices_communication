import * as protoLoader from '@grpc/proto-loader'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SQUARE_PROTO_PATH = __dirname + '/square.proto'

const SQUARE_ROOT_PROTO_PATH = __dirname + '/squareroot.proto'

const squareRootPackageDefinition = protoLoader.loadSync(
  SQUARE_ROOT_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
)

const squarePackageDefinition = protoLoader.loadSync(SQUARE_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

export { squareRootPackageDefinition, squarePackageDefinition }
