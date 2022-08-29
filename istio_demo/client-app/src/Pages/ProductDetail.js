import React, { useState, useEffect } from 'react'
import { Card, Row, Image, ListGroup, Col } from 'react-bootstrap'

import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Rating from '../components/Rating'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react';

const ProductDetail = ({ match }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [product, setProduct] = useState()
  const { getAccessTokenSilently } = useAuth0();

  const getAccessToken = async () => {
    let accessToken = ''
    try {
      accessToken = await getAccessTokenSilently()
    } catch (err) {
      console.log('error occured when getting token', err)
    }
    return accessToken;
  }

  const getProductDetail = async (id) => {
    setLoading(true)
    setError(undefined)
    try {
      const accessToken = await getAccessToken()
      const { data } = await axios.get(`/api/productdetails/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (data && data.name) {
        setProduct(data)
      } else {
        setError('Product Not found')
      }
    } catch (err) {
      setError('Error when getting product')
    }
    setLoading(false)
  }
  useEffect(() => {
    getProductDetail(match.params.id)
  }, [match.params.id])

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <>
          <Link className="btn btn-dark my-3" to="/">
            Back
          </Link>
          <Message variant="danger">{error}</Message>
        </>
      ) : (
        product && (
          <>
            <Link className="btn btn-dark my-3" to="/">
              Back
            </Link>

            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid="true" />
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
                  {product.rating ? (
                    <ListGroup.Item>
                      <Rating
                        rating={product.rating}
                        numReviews={product.numReviews}
                      />
                    </ListGroup.Item>
                  ) : null}
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>£{product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? `${product.countInStock} In Stock`
                            : 'Out Of Stock'}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  )
}

export default ProductDetail
