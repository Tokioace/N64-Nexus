import { useCallback, useMemo, useRef, useEffect, useState } from 'react'

/**
 * Performance-Optimierungen für React-Komponenten
 */
export class PerformanceOptimizer {
  /**
   * Debounce Hook für häufige Events
   */
  static useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

    return useCallback(
      ((...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay)
      }) as T,
      [callback, delay]
    )
  }

  /**
   * Throttle Hook für Scroll/Resize Events
   */
  static useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): T {
    const lastCall = useRef(0)
    const lastCallTimer = useRef<ReturnType<typeof setTimeout>>()

    return useCallback(
      ((...args: Parameters<T>) => {
        const now = Date.now()
        if (now - lastCall.current >= delay) {
          callback(...args)
          lastCall.current = now
        } else {
          if (lastCallTimer.current) {
            clearTimeout(lastCallTimer.current)
          }
          lastCallTimer.current = setTimeout(() => {
            callback(...args)
            lastCall.current = Date.now()
          }, delay - (now - lastCall.current))
        }
      }) as T,
      [callback, delay]
    )
  }

  /**
   * Intersection Observer Hook für Lazy Loading
   */
  static useIntersectionObserver(
    options: IntersectionObserverInit = {}
  ) {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [ref, setRef] = useState<Element | null>(null)

    useEffect(() => {
      if (!ref) return

      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      }, options)

      observer.observe(ref)

      return () => {
        observer.disconnect()
      }
    }, [ref, options])

    return [setRef, isIntersecting] as const
  }

  /**
   * Memoized Value mit Dependency Check
   */
  static useMemoizedValue<T>(value: T, deps: any[]): T {
    return useMemo(() => value, deps)
  }

  /**
   * Event Listener mit Cleanup
   */
  static useEventListener(
    eventName: string,
    handler: EventListener,
    element: Element | Window = window
  ) {
    const savedHandler = useRef<EventListener>()

    useEffect(() => {
      savedHandler.current = handler
    }, [handler])

    useEffect(() => {
      const eventListener = (event: Event) => savedHandler.current?.(event)
      element.addEventListener(eventName, eventListener)
      return () => element.removeEventListener(eventName, eventListener)
    }, [eventName, element])
  }

  /**
   * Local Storage mit Error Handling
   */
  static useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
      try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
        return initialValue
      }
    })

    const setValue = useCallback((value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }, [key, storedValue])

    return [storedValue, setValue] as const
  }

  /**
   * Async Operation mit Loading State
   */
  static useAsync<T>(
    asyncFn: () => Promise<T>,
    deps: any[] = []
  ) {
    const [state, setState] = useState<{
      loading: boolean
      error: Error | null
      data: T | null
    }>({
      loading: true,
      error: null,
      data: null,
    })

    useEffect(() => {
      let mounted = true

      const execute = async () => {
        try {
          setState({ loading: true, error: null, data: null })
          const result = await asyncFn()
          if (mounted) {
            setState({ loading: false, error: null, data: result })
          }
        } catch (error) {
          if (mounted) {
            setState({ loading: false, error: error as Error, data: null })
          }
        }
      }

      execute()

      return () => {
        mounted = false
      }
    }, deps)

    return state
  }
}

