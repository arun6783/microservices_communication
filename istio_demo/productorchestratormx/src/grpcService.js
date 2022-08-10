const { CreateGrpcClient, ServiceConsts } = require('./grpc_client')

exports.getRatingsAndReviews = (i) => {
  const client = CreateGrpcClient(ServiceConsts.ReviewsService)
  return new Promise((resolve, reject) =>
    client.getProductReview({ id: i }, function (err, response) {
      if (err) {
        console.log('error when calling reviews mx', err)
        return resolve(null)
      }

      resolve(response)
    })
  )
}

exports.getStock = (i) => {
  return new Promise((resolve, reject) => {
    try {
      const client = CreateGrpcClient(ServiceConsts.StockService)
      client.getStockInCount({ id: i }, function (err, response) {
        if (err) {
          console.log('error when calling stock mx', err)
          return resolve(null)
        }

        resolve(response)
      })
    } catch (er) {
      console.log('stock mx trying to connect error', er)

      return resolve(null)
    }
  })
}

exports.getProductDetail = (i) => {
  const client = CreateGrpcClient(ServiceConsts.ProductsDetailsService)
  return new Promise((resolve, reject) =>
    client.getProductDetail({ id: i }, function (err, response) {
      if (err) {
        console.log('error when calling productdetail mx', err)
        return resolve(null)
      }

      resolve(response)
    })
  )
}
