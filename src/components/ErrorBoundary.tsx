import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Props {
  children: ReactNode
  t?: (key: string) => string
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
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Forum Error Boundary caught an error:', error, errorInfo)
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
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                {t('error.boundary.home')}
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
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

// Wrapper component that provides translation function
const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  return <ErrorBoundaryClass t={t}>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary