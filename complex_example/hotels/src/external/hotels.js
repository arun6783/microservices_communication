const axios = require('axios')
const dotenv = require('dotenv')
var qs = require('qs')
dotenv.config()

const getToken = async () => {
  const queryData = qs.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  })
  const config = {
    method: 'post',
    url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: queryData,
  }
  try {
    const { data } = await axios(config)
    return data.access_token
  } catch (err) {
    console.log('Error when getting amadeus token', err)
  }
}

const getHotels = async (cityCode) => {
  try {
    const token = await getToken()
    const options = {
      method: 'get',
      url: `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=5&radiusUnit=MILE&hotelSource=ALL`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.request(options)
    const hotels = data.data
    if (hotels.length == 0) {
      return null
    }
    return hotels
      .map((item) => {
        return { name: item.name, hotelId: item.hotelId }
      })
      .slice(0, 5)
  } catch (err) {
    console.log('error calling hotels api', err)
    return null
  }
}

module.exports = { getHotels }
