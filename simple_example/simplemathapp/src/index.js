import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './bootstrap.min.css'
import { useState } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import axios from 'axios'

const App = () => {
  const [numbertoCalculate, setnumbertoCalculate] = useState('')
  const [show, showError] = useState(false)
  const [useGRPC, setGRPC] = useState(false)
  const [responseData, setResponseData] = useState(undefined)
  const [timetaken, setTimeTaken] = useState('')
  const submitHandler = async (e) => {
    e.preventDefault()

    if (numbertoCalculate > 0) {
      let url = (useGRPC ? '/api/grpc' : '/api/rest') + `/${numbertoCalculate}`
      console.log(url)
      var start = Date.now()

      axios
        .get(url)
        .then(function (res) {
          var millis = Date.now() - start
          setTimeTaken('' + Math.floor(millis / 1000) + 's')

          var pretty = JSON.stringify(res.data, undefined, 2)
          setResponseData(pretty)
        })
        .catch(function (res) {
          console.log(res)
        })
    } else {
      showError(true)
    }
  }
  return (
    <>
      <Toast
        bg="warning"
        className="d-inline-block m-3"
        onClose={() => showError(false)}
        show={show}
        delay={3000}
        autohide
      >
        <Toast.Body>Please enter a number to calculate</Toast.Body>
      </Toast>
      <Container>
        <h2>Simple app to demonstrate gRPC With KONG Gateway and Mesh</h2>
        <Row>
          <Col sm={12} md={6} lg={4} xl={3}>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="number">
                <Form.Control
                  type="text"
                  placeholder="Enter a number"
                  value={numbertoCalculate}
                  onChange={(e) => {
                    setnumbertoCalculate(e.target.value)
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Check
                onChange={(e) => {
                  setGRPC(e.target.checked)
                }}
                type="switch"
                id="useGRPC-switch"
                label="Use gRPC"
                className="my-3"
              />
              <Button type="submit" variant="primary" className="my-3">
                Calculate
              </Button>
            </Form>
          </Col>
        </Row>
        {responseData ? (
          <>
            <p style={{ textAlign: 'center' }}>{timetaken}</p>
            <textarea
              className="w-50"
              style={{ height: '250px' }}
              value={responseData}
            />
          </>
        ) : null}
      </Container>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
