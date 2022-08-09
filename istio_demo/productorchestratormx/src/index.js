const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')
const port = 6000
app.use(
  cors({
    origin: 'https://www.myshop.local',
  })
)

const productDetailMxAddr =
  process.env.ProductDetailUrl || 'http://localhost:5000'
const reviewsMxAddr = process.env.ReviewsUrl || 'http://localhost:4500'
const stockMxAddr = process.env.StockUrl || 'http://localhost:4000'

app.get('/api/products', async (req, res) => {
  try {
    const { data } = await axios.get(`${productDetailMxAddr}/api/products`)
    return res.send(data)
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
        axios.get(`${productDetailMxAddr}/api/productdetail/${id}`),
        axios.get(`${reviewsMxAddr}/api/reviews/${id}`),
        axios.get(`${stockMxAddr}/api/stock/${id}`),
      ])
      datas.forEach(({ data }) => {
        Object.assign(responseData, data)
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
