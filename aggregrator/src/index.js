import express from 'express'
import { buildSquareClient, buildSquareRootClient } from './build-client.js'

const app = express()

app.get('/api/rest/:limit', async (req, res) => {
  const { limit } = req.params
  let resp = {}
  for (let i = 1; i <= limit; i++) {
    try {
      let responseData = { square: null, squareRoot: null }
      await Promise.all([
        getSquare(i, responseData),
        getSquareRoot(i, responseData),
      ])
      resp[i] = responseData
    } catch (er) {
      console.log('error = ', er)
    }
  }
  res.send(resp)
})
app.listen(3000, () => {
  console.log('Server is Running!')
})
async function getSquare(i, responseData) {
  try {
    const client = buildSquareClient()

    const { data } = await client.get(`/api/square/${i}`)
    responseData.square = data
  } catch (err) {
    console.log('square service', err)
  }
  return
}

async function getSquareRoot(i, responseData) {
  try {
    const client = buildSquareRootClient()
    const { data } = await client.get(`/api/squareroot/${i}`)
    responseData.squareRoot = data
  } catch (err) {
    console.log('sqrtserviceerr', err)
  }
  return
}
