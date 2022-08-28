import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [products, setProducts] = useState(undefined)

  const getProducts = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const { data } = await axios.get(`/api/products`)
      if (data) {
        setProducts(data)
      } else {
        setError('Products Not found')
      }
    } catch (err) {
      setError('Error occured when fetching products')
    }
    setLoading(false)
  }
  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        products && (
          <>
           
            {
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            }
          </>
        )
      )}
    </>
  )
}

export default Home
