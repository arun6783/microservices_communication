const express = require('express')

const app = express()
const cors = require('cors')
const {expressjwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { CreateGrpcClient, ServiceConsts } = require('./grpc_client')

const {
  getRatingsAndReviews,
  getStock,
  getProductDetail,
} = require('./grpcService')

const port = 6000
app.use(
  cors({
    origin: 'https://www.myshop.local',
  })
)

const checkJwt = expressjwt ({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-gl3nsqil.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://myshop-orchestrator-srv',
  issuer: 'https://dev-gl3nsqil.us.auth0.com/',
  algorithms: ['RS256'],
})





app.get('/api/products',  async (req, res) => {
  try {
    const { authorization } = req.headers
    console.log('orchestrator-auth=', authorization)
    const client = CreateGrpcClient(ServiceConsts.ProductsDetailsService)

    client.getProducts({}, function (err, response) {
      if (err) {
        console.log('getting products via grpc endpoints error', err)
        return res.status(500).send({ error: err })
      }

      res.send(response.products)
    })
  } catch (e) {
    console.log('error when calling product detail mx to get produccts', e)
    return res.status(500).send({
      error: `error occured when making a call to mx to get products. ${e}`,
    })
  }
})

app.get('/api/productdetails/:id', async (req, res) => {
  const id = req.params.id
  console.log('id is ', id)
  let responseData = {}
  if (id) {
    try {
      const datas = await Promise.all([
        getStock(id),
        getProductDetail(id),
        getRatingsAndReviews(id),
      ])
      datas.forEach((d) => {
        Object.assign(responseData, d)
      })
    } catch (e) {
      return res
        .status(500)
        .send({ error: `error occured when making a call to mx. ${e}` })
    }
    return res.json(responseData)
  }

  return res.status(400).send({ error: 'Id is a required field' })
})

app.listen(port, () =>
  console.log(`ProductOrchestratorMx app listening on port ${port}!`)
)
