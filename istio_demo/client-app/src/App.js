import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { Container } from 'react-bootstrap'
import Home from './Pages/Home'
import ProductDetail from './Pages/ProductDetail'
import NotFound from './Pages/NotFound'
import Header from './components/Header'
import Profile from './components/Profile'
import Loader from './components/Loader'

function App() {
  const { isLoading } = useAuth0()

  return (
    isLoading? <Loader/> : <Router>
      <main className="py-3">
        <Header/>
        <Container>
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/profile" component={Profile}/>
          <Route path="/" component={Home} exact />
          <Route path="/404" component={NotFound} />
        </Container>
      </main>
    </Router>
  )
}

export default App
