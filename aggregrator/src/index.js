import express from 'express'
import { grpcRouter } from './routes/grpc.js'
import { restRouter } from './routes/rest.js'

const app = express()

app.use(restRouter)
app.use(grpcRouter)
app.listen(3000, () => {
  console.log('Server is Running!')
})
