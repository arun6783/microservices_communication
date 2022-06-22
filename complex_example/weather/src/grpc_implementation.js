const weatherPb = require('@aarchar/complex_protos/src/weather_pb')
const { getWeatherData } = require('./server_implementation')

const getWeatherForecast = async (call, callback) => {
  console.log('grpc - getweatherforecast was invoked')
  const city = call.request.getCity()
  const weatherData = await getWeatherData(city)
  console.log('grpc - weatherData', weatherData)

  const foreCastList = weatherData.forecast.map((f) => {
    return new weatherPb.Weather().setDate(f.date).setTemp(f.temp)
  })

  const res = new weatherPb.WeatherResponse()
    .setCity(city)
    .setForecastList(foreCastList)
    .setCache(weatherData.cache)

  //first parameter in callback is error
  callback(null, res)
}

module.exports = { getWeatherForecast }
