import express from 'express'
import { grpcRouter } from './routes/grpc.js'
import { restRouter } from './routes/rest.js'

const app = express()

// if (process.env.USE_SSL == 'true') {
//   console.log('ssl is true setting node tls reject')
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// }

app.use(restRouter)
app.use(grpcRouter)
app.listen(3000, () => {
  console.log('Server is Running!')
})
