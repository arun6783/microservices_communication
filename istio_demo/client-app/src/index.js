import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './bootstrap.min.css'
import App from './App'
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history'
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
   <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </React.StrictMode>
)
