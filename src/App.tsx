import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/App.css'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="app">
            <AppRouter />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App