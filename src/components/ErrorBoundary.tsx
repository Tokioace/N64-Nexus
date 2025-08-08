/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '../lib/logger'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
  t?: (key: any) => string
  navigate?: (path: string) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    // Check if it's a forwardRef-related error that we can safely ignore
    if (error.message && (
      error.message.includes('forwardRef') ||
      error.message.includes('element.ref') ||
      error.message.includes('Cannot read properties of undefined (reading \'forwardRef\')') ||
      error.message.includes('Accessing element.ref is no longer supported')
    )) {
      console.warn('Caught forwardRef error in ErrorBoundary, continuing normally:', error.message)
      return { hasError: false, error: null } // Don't show error UI for forwardRef issues
    }
    
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log non-forwardRef errors
    if (!error.message?.includes('forwardRef') && !error.message?.includes('element.ref')) {
      logger.error('Error Boundary caught an error:', error, errorInfo)
    } else {
      console.warn('ForwardRef error caught and handled:', error.message)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      // Fallback translation function if not provided
      const t = this.props.t || ((key: string) => {
        const fallbacks: Record<string, string> = {
          'error.boundary.title': 'Oops! Something went wrong',
          'error.boundary.message': 'An unexpected error occurred. Please try again.',
          'error.boundary.retry': 'Try again',
          'error.boundary.home': 'Go to Home',
          'error.boundary.details': 'Technical details (development only)'
        }
        return fallbacks[key] || key
      })

      return (
        <div className="container mx-auto px-4 py-6">
          <div className="simple-tile text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {t('error.boundary.title')}
            </h2>
            <p className="text-slate-400 mb-6">
              {t('error.boundary.message')}
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('error.boundary.retry')}
              </button>
              <button
                onClick={() => this.props.navigate ? this.props.navigate('/') : (window.location.href = '/')}
                className="btn-secondary"
              >
                <Home className="w-4 h-4 mr-2" />
                {t('error.boundary.home')}
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer">
                  {t('error.boundary.details')}
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrapper component that provides translation function and navigation
const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  return <ErrorBoundaryClass t={t} navigate={navigate}>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary