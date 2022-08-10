const { CreateGrpcClient, ServiceConsts } = require('./grpc_client')

exports.getRatingsAndReviews = (i) => {
  const client = CreateGrpcClient(ServiceConsts.ReviewsService)
  return new Promise((resolve, reject) =>
    client.getProductReview({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }

      resolve(response)
    })
  )
}

exports.getStock = (i) => {
  const client = CreateGrpcClient(ServiceConsts.StockService)
  return new Promise((resolve, reject) =>
    client.getStockInCount({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }

      resolve(response)
    })
  )
}

exports.getProductDetail = (i) => {
  const client = CreateGrpcClient(ServiceConsts.ProductsDetailsService)
  return new Promise((resolve, reject) =>
    client.getProductDetail({ id: i }, function (err, response) {
      if (err) {
        return reject(err)
      }

      resolve(response)
    })
  )
}
