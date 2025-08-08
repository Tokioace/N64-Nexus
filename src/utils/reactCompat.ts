import React from 'react'

// Safe ref callback that handles potential undefined refs
export const safeRefCallback = <T>(
  callback: (element: T | null) => void
) => {
  return (element: T | null) => {
    try {
      callback(element)
    } catch (error) {
      console.warn('Ref callback error:', error)
    }
  }
}

// Utility to safely create refs
export const safeCreateRef = <T>(): React.RefObject<T> => {
  try {
    return React.createRef<T>()
  } catch (error) {
    console.warn('createRef error, using fallback:', error)
    return { current: null } as React.RefObject<T>
  }
}

// Utility to safely use useRef
export const safeUseRef = <T>(initialValue: T): React.MutableRefObject<T> => {
  try {
    return React.useRef<T>(initialValue)
  } catch (error) {
    console.warn('useRef error, using fallback:', error)
    return { current: initialValue } as React.MutableRefObject<T>
  }
}

// Simple wrapper to catch forwardRef errors
export const withForwardRefErrorHandling = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    try {
      return React.createElement(Component, props)
    } catch (error: any) {
      if (error?.message?.includes('forwardRef') || error?.message?.includes('element.ref')) {
        console.warn('ForwardRef error caught, rendering fallback:', error.message)
        return React.createElement('div', { 
          className: 'text-slate-400 p-4 text-center' 
        }, 'Component temporarily unavailable')
      }
      throw error // Re-throw non-forwardRef errors
    }
  }

  WrappedComponent.displayName = `withForwardRefErrorHandling(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Error boundary specifically for forwardRef issues
export class ForwardRefErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<any> }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Only catch forwardRef-related errors
    if (error.message && (
      error.message.includes('forwardRef') ||
      error.message.includes('element.ref') ||
      error.message.includes('Cannot read properties of undefined')
    )) {
      console.warn('Caught forwardRef error, recovering:', error.message)
      return { hasError: false } // Don't show error UI for forwardRef issues
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (!error.message?.includes('forwardRef')) {
      console.error('Component Error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      const FallbackComponent = this.props.fallback
      return React.createElement(FallbackComponent)
    }

    return this.props.children
  }
}