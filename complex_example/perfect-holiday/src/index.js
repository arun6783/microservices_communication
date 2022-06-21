const express = require('express')
// import { grpcRouter } from './routes/grpc.js'
const { restRouter } = require('./routes/rest.js')

const app = express()

const port = 5000
app.use(restRouter)
// app.use(grpcRouter)
app.listen(port, () => {
  console.log(`Perfecct holiday server is running on port ${port}`)
})
