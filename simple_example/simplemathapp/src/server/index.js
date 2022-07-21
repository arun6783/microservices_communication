const express = require('express')
const path = require('path')
const axios = require('axios')
const buildFolder = path.join(__dirname, '..', '..', 'build')
const app = express()

const port = 8082

app.use(express.static(buildFolder))

const getCalculationResult = async (useGrpc, numbertoCalculate) => {
  let host = process.env.AGG_HOST || 'localhost'
  let aggPort = process.env.AGG_PORT || '3000'
  let url =
    `http://${host}:${aggPort}` +
    (useGrpc ? '/api/grpc' : '/api/rest') +
    `/${numbertoCalculate}`

  console.log(
    `useGrpc - ${useGrpc}, numbertoCalculate -${numbertoCalculate}, url- ${url} `
  )

  const { data } = await axios.get(url)

  return data
}

app.get('/api/rest/:id', async (req, res) => {
  try {
    const data = await getCalculationResult(false, req.params.id)
    return res.send(data)
  } catch (err) {
    console.log('error occured when calling agg service', err)
    return res
      .status(500)
      .send({ error: 'Error occured when calling agg service' })
  }
})

app.get('/api/grpc/:id', async (req, res) => {
  try {
    const data = await getCalculationResult(true, req.params.id)
    return res.send(data)
  } catch (err) {
    console.log('error occured when calling agg service', err)
    return res
      .status(500)
      .send({ error: 'Error occured when calling agg service' })
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'))
})

app.listen(port, () => {
  console.log(`SimpleMath app Server is Running in port ${port}`)
})
