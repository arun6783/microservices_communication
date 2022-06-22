const express = require('express')
const {
  buildhotelsClient,
  buildweatherClient,
} = require('../utils/build-client')
const { getRandomCity } = require('./getRandomCity')
const restRouter = express.Router()
const client = buildhotelsClient()
const weatherClient = buildweatherClient()

restRouter.get('/api/rest/holiday', async (req, res) => {
  let responseData = { hotels: null, weather: null }
  try {
    let { city, code } = getRandomCity()
    await Promise.all([
      gethotels(code, responseData),
      getweather(city, responseData),
    ])
  } catch (er) {
    console.log('error = ', er)
  }

  res.send(responseData)
})

async function gethotels(cityCode, responseData) {
  try {
    const { data } = await client.get(`/api/hotels/${cityCode}`)
    responseData.hotels = data
  } catch (err) {
    console.log('hotels service', err)
  }
  return
}

async function getweather(city, responseData) {
  try {
    const { data } = await weatherClient.get(`/api/weather/${city}`)
    responseData.weather = data
  } catch (err) {
    console.log('weather service', err)
  }
  return
}

module.exports = { restRouter }
