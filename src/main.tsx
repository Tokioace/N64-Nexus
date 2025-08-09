import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initPerformanceMonitoring } from './utils/performanceMonitor'
import { initAccessibilityMonitoring, quickA11yCheck } from './utils/accessibilityMonitor'

console.log('🚀 main.tsx loading...')

// Initialize performance monitoring early
initPerformanceMonitoring()

// Initialize accessibility monitoring
initAccessibilityMonitoring().then(() => {
  // Run quick accessibility check in development
  if (import.meta.env.DEV) {
    setTimeout(quickA11yCheck, 2000) // Wait for app to render
  }
})

// Clear the loading screen immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('✅ Root element found')
  // Clear the fallback loading screen
  rootElement.innerHTML = ''
} else {
  console.error('❌ Root element not found!')
}

try {
  console.log('🔄 Creating React root...')
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  
  console.log('🔄 Rendering React app...')
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
  console.log('✅ React app rendered successfully!')
} catch (error) {
  console.error('❌ Error rendering React app:', error)
  // Show error in the UI
  const rootEl = document.getElementById('root')
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="color: red; padding: 20px; background: #1e293b;">
        <h1>React Rendering Error</h1>
        <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        <pre>${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `
  }
}