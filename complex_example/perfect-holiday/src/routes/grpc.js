//implement grpc aggregator route  and call Weather service using grpc
const express = require('express')
const { weathersClient, hotelsClient } = require('../utils/build-grpc-client')
const { WeatherRequest } = require('@aarchar/complex_protos/src/weather_pb')
const { HotelRequest } = require('@aarchar/complex_protos/src/hotels_pb')
const { getRandomCity } = require('./getRandomCity')
const grpcRouter = express.Router()

grpcRouter.get('/api/grpc/holiday', async (req, res) => {
  let responseData = { Weather: null, Hotels: null }

  try {
    let { city, code } = getRandomCity()
    await Promise.all([
      getWeather(city, responseData),
      getHotels(code, responseData),
    ])
  } catch (er) {
    console.log('grpc client call error = ', er)
  }

  res.send(responseData)
})

async function getWeather(city, responseData) {
  return new Promise((resolve, reject) => {
    const req = new WeatherRequest().setCity(city)

    weathersClient.getWeatherForecast(req, (err, res) => {
      if (err) {
        return reject(err)
      }
      const forecast = res.getForecastList().map((x) => {
        return { date: x.getDate(), temp: x.getTemp() }
      })
      responseData.Weather = {
        city: res.getCity(),
        forecast: forecast,
        cache: res.getCache(),
      }
      resolve()
    })
  })
}

async function getHotels(cityCode, responseData) {
  return new Promise((resolve, reject) => {
    const req = new HotelRequest().setCitycode(cityCode)

    hotelsClient.getHotels(req, (err, res) => {
      if (err) {
        return reject(err)
      }
      const hotelsList = res.getHotelsList().map((x) => {
        return { hotelId: x.getHotelid(), name: x.getName() }
      })
      responseData.Hotels = {
        city: res.getCity(),
        hotels: hotelsList,
        cache: res.getCache(),
      }
      resolve()
    })
  })
}
module.exports = { grpcRouter }
