const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const getWeather = async (lat, lon) => {
  const appKey = process.env.API_KEY
  let weatherApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appKey}&units=metric`
  try {
    const { data } = await axios.get(weatherApi)
    console.log('in wearher', data)
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
