import express from 'express'
import { grpcRouter } from './routes/grpc.js'
import { restRouter } from './routes/rest.js'

import cors from 'cors'
import hpropagate from 'hpropagate'
hpropagate()
var app = express()
app.use(cors({ origin: '*' }))
app.use(restRouter)
app.use(grpcRouter)
app.listen(3000, () => {
  console.log('Server is Running!')
})
