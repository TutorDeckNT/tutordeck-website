import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext'

// Use HashRouter for GitHub Pages compatibility
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
    </MotionConfig>
  </React.StrictMode>,
)
