const express = require('express')
const { restRouter } = require('./routes/rest.js')
const { grpcRouter } = require('./routes/grpc')
const app = express()

const port = 5000
app.use(restRouter)
app.use(grpcRouter)
app.listen(port, () => {
  console.log(`Perfecct holiday server is running on port ${port}`)
})
