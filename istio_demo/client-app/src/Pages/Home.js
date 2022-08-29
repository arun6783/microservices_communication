import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [products, setProducts] = useState(undefined)
  const { getAccessTokenSilently } = useAuth0()

  const getAccessToken = async () => {
    let accessToken = ''
    try {
      accessToken = await getAccessTokenSilently()
    } catch (err) {
      console.log('error occured when getting token', err)
    }
    return accessToken;
  }
  const getProducts = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const accessToken = await getAccessToken()
      
      const { data } = await axios.get(`/api/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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
