const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const getGeoLocation = async (city) => {
  const appKey = process.env.API_KEY
  let geoLocationApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${appKey}`
  try {
    const { data } = await axios.get(geoLocationApi)
    if (data.length == 0) {
      return null
    }
    const location = data[0]
    return {
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
    }
  } catch (err) {
    console.log('error calling geolocation api', err)
    return null
  }
}

const getWeather = async (city) => {
  const appKey = process.env.API_KEY
  try {
    const { lat, lon } = await getGeoLocation(city)
    let weatherApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appKey}&units=metric`

    const { data } = await axios.get(weatherApi)
    if (data.length == 0) {
      return null
    }
    return data.list.map((item) => {
      return { date: item.dt_txt, temp: item.main.temp }
    })
  } catch (err) {
    console.log('error calling weather api', err)
    return null
  }
}

module.exports = { getWeather }
