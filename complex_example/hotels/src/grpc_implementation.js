const hotelsPb = require('@aarchar/complex_protos/src/hotels_pb')
const { getHotelsData } = require('./server_implementation')

const getHotels = async (call, callback) => {
  const code = call.request.getCitycode()
  const hotelsData = await getHotelsData(code)
  const hotelsList = hotelsData.hotels.map((f) => {
    return new hotelsPb.Hotel().setName(f.name).setHotelid(f.hotelId)
  })

  const res = new hotelsPb.HotelResponse()
    .setCity(hotelsData.city)
    .setHotelsList(hotelsList)
    .setCache(hotelsData.cache)

  //first parameter in callback is error
  callback(null, res)
}

module.exports = { getHotels }
