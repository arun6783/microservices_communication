const express = require('express')
const { getGeoLocation } = require('./external/geoLocation')
const { getWeather } = require('./external/weather')
const RedisClient = require('./utils/RedisClient')
const app = express()
const port = 3000

app.get('/api/weather/:city', async (req, res) => {
  //check if city is in redis
  const { city } = req.params
  //if so return
  let data = await RedisClient.get(city)
  if (data) {
    return res.status(200).send(data)
  }
  //else make api call and get data
  const location = await getGeoLocation('london')
  const weather = await getWeather(location.lat, location.lon)

  const datatoStore = {
    city,
    location,
    weather,
  }

  await RedisClient.set(city, datatoStore)
  //now store this in mongo
  res.send(datatoStore)
})

const start = async () => {
  await RedisClient.getConnection()
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

start()
