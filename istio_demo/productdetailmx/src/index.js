const express = require('express')
const products = require('./data/products')
const os = require('os')
const hostname = os.hostname()
const app = express()
const port = 5000

app.get('/api/products', (req, res) => {
  return res.send(products)
})

app.get('/api/productdetail/:id', (req, res) => {
  const product = products.find((x) => {
    return x.id == req.params.id
  })

  if (product) {
    console.log('product found', product)

    const { name, image, description, brand, category, pricePer100, price } =
      product
    return res.status(200).send({
      name,
      image,
      description,
      brand,
      category,
      pricePer100,
      price,
      hostname,
    })
  }
  return res.status(400).send({ error: 'Item not found' })
})
app.listen(port, () =>
  console.log(`Product Detail MX app listening on port ${port}!`)
)
