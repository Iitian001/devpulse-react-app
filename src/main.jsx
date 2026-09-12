import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PinboardProvider } from './context/PinboardContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PinboardProvider>
        <App />
      </PinboardProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
