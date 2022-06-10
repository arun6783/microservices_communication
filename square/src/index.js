import express from 'express'
const app = express()

app.get('/api/square/:id', async (req, res) => {
  const { id } = req.params

  const square = Math.pow(id, 2)

  res.status(200).json(square)
})
const port = 4000
app.listen(port, () => {
  console.log(`Square server is Running at port ${port}`)
})
