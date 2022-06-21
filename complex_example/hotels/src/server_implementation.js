const { getHotels } = require('./external/hotels')
const RedisClient = require('./utils/RedisClient')

const getHotelsData = async (city) => {
  let data = await RedisClient.get(city)
  if (data) {
    return { ...data, cache: true }
  }
  const hotels = await getHotels(city)

  const datatoStore = {
    city: city,
    hotels: hotels,
    cache: false,
  }
  if (hotels) {
    await RedisClient.set(city, datatoStore)
  }

  return datatoStore
}

module.exports = { getHotelsData }
