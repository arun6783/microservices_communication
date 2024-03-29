const express = require('express')
const products = require('./data/products')
const os = require('os')
const hostname = os.hostname()
const app = express()
const port = 4000

app.get('/api/stock/:id', (req, res) => {
  console.log('products', products)
  const product = products.find((x) => {
    return x.id == req.params.id
  })

  if (product) {
    const countInStock = product?.countInStock || 0
    return res.status(200).send({ countInStock, hostname })
  }
  return res.status(400).send({ error: 'Item not found' })
})
app.listen(port, () => console.log(`StockMX app listening on port ${port}!`))
