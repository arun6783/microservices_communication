const express = require('express')
const { getHotelsData } = require('./server_implementation')
const RedisClient = require('./utils/RedisClient')
const app = express()
const port = 4000

app.get('/api/hotels/:city', async (req, res) => {
  const { city } = req.params
  const data = await getHotelsData(city)
  res.send(data)
})

const start = async () => {
  await RedisClient.getConnection()
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

start()
