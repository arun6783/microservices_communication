const express = require('express')
const { getWeatherData } = require('./server_implementation')
const RedisClient = require('./utils/RedisClient')
const app = express()
const port = 3000

app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params

  const data = await getWeatherData(city)
  res.send(data)
})

const start = async () => {
  await RedisClient.getConnection()
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

start()
