const CACHE_NAME = 'n64-nexus-v1.0.0'
const STATIC_CACHE_NAME = 'n64-nexus-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'n64-nexus-dynamic-v1.0.0'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  // Add other critical assets
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/games/,
  /\/api\/events/,
  /\/api\/leaderboard/,
  /\/api\/translations/
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - Network first, then cache
    event.respondWith(handlePageRequest(request))
  } else if (url.pathname === '/manifest.webmanifest' || url.pathname.endsWith('.webmanifest')) {
    // Manifest files - Network first without credentials, then cache
    event.respondWith(handleManifestRequest(request))
  } else if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    // API requests - Cache first, then network
    event.respondWith(handleAPIRequest(request))
  } else if (request.destination === 'image') {
    // Images - Cache first, then network
    event.respondWith(handleImageRequest(request))
  } else {
    // Other static assets - Cache first, then network
    event.respondWith(handleStaticRequest(request))
  }
})

// Handle page requests (HTML)
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page if available
    const offlinePage = await caches.match('/offline.html')
    return offlinePage || new Response('Offline - Keine Internetverbindung', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Try cache first for better performance
    const cachedResponse = await caches.match(request)
    
    // Always try to fetch fresh data
    const networkPromise = fetch(request).then(response => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE_NAME)
        cache.then(c => c.put(request, response.clone()))
      }
      return response
    })
    
    // Return cached data immediately if available, otherwise wait for network
    return cachedResponse || await networkPromise
  } catch (error) {
    // Network failed, return cached version if available
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response(JSON.stringify({
      error: 'Offline',
      message: 'Keine Internetverbindung'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fetch from network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return placeholder image or cached version
    const cachedResponse = await caches.match(request)
    return cachedResponse || caches.match('/placeholder-image.png')
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fetch from network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return cached version if available
    return caches.match(request)
  }
}

// Handle manifest requests specifically to avoid authentication issues
async function handleManifestRequest(request) {
  try {
    // Try network first without credentials
    const networkResponse = await fetch(request, { credentials: 'omit' })
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log('Service Worker: Network request failed for manifest, trying cache:', error)
  }
  
  // Try cache as fallback
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  // If all else fails, return a basic manifest
  return new Response(JSON.stringify({
    name: 'Battle64 - N64 Community',
    short_name: 'Battle64',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#1e293b'
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  try {
    // Handle queued offline actions
    const queuedActions = await getQueuedActions()
    
    for (const action of queuedActions) {
      try {
        await fetch(action.url, action.options)
        await removeQueuedAction(action.id)
      } catch (error) {
        console.error('Background sync failed for action:', action, error)
      }
    }
  } catch (error) {
    console.error('Background sync error:', error)
  }
}

// Helper functions for queued actions
async function getQueuedActions() {
  // Implementation would depend on your storage strategy
  return []
}

async function removeQueuedAction(id) {
  // Implementation would depend on your storage strategy
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Service Worker: Push received')
  
  const options = {
    body: event.data ? event.data.text() : 'Neue Benachrichtigung von N64 Nexus',
    icon: '/android-chrome-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'notification-' + Date.now()
    },
    actions: [
      {
        action: 'explore',
        title: 'Öffnen',
        icon: '/icons/open-16x16.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/icons/close-16x16.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('N64 Nexus', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

console.log('Service Worker: Loaded')