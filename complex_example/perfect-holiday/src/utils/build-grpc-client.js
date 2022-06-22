const grpc = require('@grpc/grpc-js')
const {
  WeathersClient,
} = require('@aarchar/complex_protos/src/weather_grpc_pb')

const WEATHERADDRESS = process.env.WEATHER_GRPC_ADDRESS || 'localhost:5051'

const HOTELSADDRESS = process.env.HOTELS_GRPC_ADDRESS || 'localhost:5052'

const useSSL = process.env.USE_SSL == 'true'
let creds

if (useSSL) {
  const rootCert = fs.readFileSync(path.join(__dirname, '..', 'ssl', 'ca.crt'))

  creds = grpc.ChannelCredentials.createSsl(rootCert)
} else {
  creds = grpc.ChannelCredentials.createInsecure()
}

const weathersClient = new WeathersClient(`${WEATHERADDRESS}`, creds)

module.exports = { weathersClient }
