/**
 * Browser Detection and Deep Link Utilities
 * Helps redirect users back to their preferred browser after email confirmation
 */

export interface BrowserInfo {
  name: string
  version: string
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
}

/**
 * Detect current browser information
 */
export function detectBrowser(): BrowserInfo {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
    return {
      name: 'unknown',
      version: 'unknown',
      isMobile: false,
      isIOS: false,
      isAndroid: false
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  
  let name = 'unknown'
  let version = 'unknown'
  
  // Browser detection
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    name = 'safari'
    const match = userAgent.match(/version\/([0-9.]+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    name = 'chrome'
    const match = userAgent.match(/chrome\/([0-9.]+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('edg')) {
    name = 'edge'
    const match = userAgent.match(/edg\/([0-9.]+)/)
    version = match ? match[1] : 'unknown'
  } else if (userAgent.includes('firefox')) {
    name = 'firefox'
    const match = userAgent.match(/firefox\/([0-9.]+)/)
    version = match ? match[1] : 'unknown'
  }
  
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isIOS = /iphone|ipad|ipod/i.test(userAgent)
  const isAndroid = /android/i.test(userAgent)
  
  return {
    name,
    version,
    isMobile,
    isIOS,
    isAndroid
  }
}

/**
 * Generate browser-specific deep link URLs
 */
export function generateBrowserSpecificURL(baseURL: string, browserInfo: BrowserInfo): string {
  const url = new URL(baseURL)
  
  // Add browser information to URL parameters
  url.searchParams.set('preferred_browser', browserInfo.name)
  url.searchParams.set('browser_version', browserInfo.version)
  url.searchParams.set('is_mobile', browserInfo.isMobile.toString())
  
  return url.toString()
}

/**
 * Create deep links for different browsers
 * Note: Deep links are unreliable, so we primarily use regular URLs
 */
export function createDeepLinks(targetURL: string): Record<string, string> {
  const encodedURL = encodeURIComponent(targetURL)
  
  return {
    // Safari doesn't have reliable deep links, use regular URL
    safari: targetURL,
    // Chrome deep link (may not work on all systems)
    chrome: `googlechrome://${targetURL.replace('https://', '')}`,
    // Firefox deep link (limited support)
    firefox: `firefox://open-url?url=${encodedURL}`,
    // Edge deep link (limited support)
    edge: `microsoft-edge:${targetURL}`,
    // Fallback to regular URL
    default: targetURL
  }
}

/**
 * Generate a smart redirect URL that tries to open in the preferred browser
 */
export function generateSmartRedirectURL(baseURL: string): string {
  const browserInfo = detectBrowser()
  const urlWithBrowserInfo = generateBrowserSpecificURL(baseURL, browserInfo)
  
  // For Safari, we'll use a more reliable approach
  if (browserInfo.name === 'safari') {
    // Add a special parameter that tells the app to show Safari-specific instructions
    const safariURL = new URL(urlWithBrowserInfo)
    safariURL.searchParams.set('safari_redirect', 'true')
    return safariURL.toString()
  }
  
  // For other browsers, create an intermediate redirect page
  // Get origin safely (works in both browser and server environments)
  const origin = typeof window !== 'undefined' ? window.location.origin : new URL(baseURL).origin
  const redirectURL = new URL(origin + '/browser-redirect')
  redirectURL.searchParams.set('target', urlWithBrowserInfo)
  redirectURL.searchParams.set('browser', browserInfo.name)
  
  return redirectURL.toString()
}

/**
 * Attempt to redirect to preferred browser using various methods
 */
export function redirectToPreferredBrowser(targetURL: string, preferredBrowser?: string): void {
  if (!preferredBrowser) {
    window.location.href = targetURL
    return
  }
  
  const deepLinks = createDeepLinks(targetURL)
  
  // Try deep link first
  const deepLink = deepLinks[preferredBrowser] || deepLinks.default
  
  // Create a temporary link and try to open it
  const link = document.createElement('a')
  link.href = deepLink
  link.style.display = 'none'
  document.body.appendChild(link)
  
  try {
    link.click()
    
    // Fallback: if deep link doesn't work, use regular URL after a short delay
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        window.location.href = targetURL
      }
    }, 1500)
  } catch (error) {
    console.warn('Deep link failed, using regular URL:', error)
    window.location.href = targetURL
  } finally {
    document.body.removeChild(link)
  }
}