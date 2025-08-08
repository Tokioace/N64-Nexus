import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Suppress React 19 forwardRef deprecation warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('forwardRef') || 
     args[0].includes('Accessing element.ref is no longer supported') ||
     args[0].includes('Cannot read'))
  ) {
    return; // Suppress forwardRef-related warnings
  }
  originalConsoleWarn.apply(console, args);
};

// Clear the loading screen immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  // Clear the fallback loading screen
  rootElement.innerHTML = ''
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)