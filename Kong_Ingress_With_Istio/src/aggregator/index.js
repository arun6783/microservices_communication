const express = require('express')
const grpc = require('@grpc/grpc-js')
const { CreateGrpcClient } = require('./client')
const axios = require('axios')
const https = require('https')
const fs = require('fs')
const app = express()
const port = 5000

const buildSquareClient = () => {
  const httpsAgent = new https.Agent({
    hostname: 'lotr.internal',
    ca: fs.readFileSync('../cert/ca.crt'),
    key: fs.readFileSync('../cert/server.pem'),
    cert: fs.readFileSync('../cert/server.crt'),
    rejectUnauthorized: false,
  })
  const nodeServerHost = process.env.NODE_SERVER_HOST || 'localhost'
  const nodeServerPort = process.env.NODE_SERVER_PORT || '9500'
  const httpsPort = process.env.NODE_SERVER_HTTPS_PORT || '9600'

  const useTls = process.env.SECURE_TLS == 'yes'
  let client
  if (true) {
    console.log('use tls for node aggregator')
    client = axios.create({
      baseURL: `https://${nodeServerHost}:${httpsPort}`,
      httpsAgent: httpsAgent,
    })
  } else {
    console.log('tls false for node aggregator')
    client = axios.create({
      baseURL: `http://${nodeServerHost}:${nodeServerPort}`,
    })
  }

  return client
}

app.get('/aggregator/node', async (req, res) => {
  try {
    const client = buildSquareClient()

    const respData = await client.get(`/api/GetQuote`)
    return res.send(respData.data)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
})
app.get('/aggregator/grpc', (req, res) => {
  let client = CreateGrpcClient()

  var metadata = new grpc.Metadata()
  metadata.set('headerKey1', 'headerval1')
  metadata.set('headerKey2', 'headerval2')
  metadata.set('complexheader3', '{"result":true, "count":42}')
  metadata.set('generalfoo4', 'headerval4')
  metadata.set('generalfoo5', 'headerval5')
  metadata.set('generalfoo6', 'headerval6')
  metadata.set('generalfoo7', 'headerval7')
  metadata.set('generalfoo8', 'headerval8')

  client.GetQuote({}, metadata, function (err, response) {
    if (err) {
      console.log('grpc aggregator error', err)
      return res.status(500).send({ error: err })
    }

    res.send({ result: response })
  })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
