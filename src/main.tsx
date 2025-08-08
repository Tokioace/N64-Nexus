import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Suppress React forwardRef warnings for better compatibility
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('forwardRef') || 
     args[0].includes('Accessing element.ref is no longer supported') ||
     args[0].includes('Warning: Function components cannot be given refs'))
  ) {
    return; // Suppress forwardRef-related warnings
  }
  originalConsoleWarn.apply(console, args);
};

console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('forwardRef') || 
     args[0].includes('Cannot read properties of undefined (reading \'forwardRef\')') ||
     args[0].includes('element.ref'))
  ) {
    return; // Suppress forwardRef-related errors
  }
  originalConsoleError.apply(console, args);
};

// Clear the loading screen immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  // Clear the fallback loading screen
  rootElement.innerHTML = ''
}

// Error boundary wrapper to catch any forwardRef-related runtime errors
class ForwardRefErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's a forwardRef-related error
    if (error.message && (
      error.message.includes('forwardRef') ||
      error.message.includes('element.ref') ||
      error.message.includes('Cannot read properties of undefined')
    )) {
      console.log('Caught forwardRef error, continuing with app:', error.message);
      return { hasError: false }; // Don't show error UI, just continue
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message && !error.message.includes('forwardRef')) {
      console.error('React Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#ef4444',
          backgroundColor: '#1e293b',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <h1>Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ForwardRefErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ForwardRefErrorBoundary>
  </React.StrictMode>,
)