const express = require('express')
const path = require('path')
const axios = require('axios')
const buildFolder = path.join(__dirname, '..', '..', 'build')

require('hpropagate')()
var app = express()

const port = 8082

app.use(express.static(buildFolder))

app.get('/api/productdetails/:id', async (req, res) => {
  try {
    const orchestratorUrl =
      process.env.OrchestratorUrl || 'http://localhost:6000'
    const { data } = await axios.get(
      `${orchestratorUrl}/api/productdetails/${req.params.id}`
    )

    return res.send(data)
  } catch (err) {
    console.log('error occured when calling agg service', err)
    return res.status(500).send({
      error: 'Error occured when calling product detail orchestrator service',
    })
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'))
})

app.listen(port, () => {
  console.log(`Myshop app Server is Running in port ${port}`)
})
