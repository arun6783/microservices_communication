import express from 'express'
const app = express()

app.get('/api/squareroot/:id', async (req, res) => {
  const { id } = req.params

  const squareRoot = Math.sqrt(id)

  res.status(200).json(squareRoot)
})
const port = 5000
app.listen(port, () => {
  console.log(`Squareroot server is Running at port ${port}`)
})
