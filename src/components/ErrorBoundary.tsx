import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
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
      return (
        <div className="container mx-auto px-4 py-6">
          <div className="simple-tile text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Oops! Etwas ist schiefgelaufen
            </h2>
            <p className="text-slate-400 mb-6">
              Es ist ein unerwarteter Fehler im Forum aufgetreten. Bitte versuche es erneut.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Erneut versuchen
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Zur Startseite
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer">
                  Technische Details (nur in Entwicklung)
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

export default ErrorBoundary