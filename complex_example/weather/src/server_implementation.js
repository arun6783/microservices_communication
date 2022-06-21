const { getWeather } = require('./external/weather')
const RedisClient = require('./utils/RedisClient')

const getWeatherData = async (city) => {
  //check if city is in redis
  //if so return
  let data = await RedisClient.get(city)
  if (data) {
    return { ...data, cache: true }
  }
  //else make api call and get data
  const weather = await getWeather(city)

  const datatoStore = {
    city: city,
    weather: weather,
    cache: false,
  }
  if (weather) {
    await RedisClient.set(city, datatoStore)
  }
  //now store this in mongo
  return datatoStore
}

module.exports = { getWeatherData }
