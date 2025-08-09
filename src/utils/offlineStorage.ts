import { logger } from '../lib/logger'
import { useLanguage } from '../contexts/LanguageContext'

// IndexedDB wrapper for offline storage
class OfflineStorage {
  private dbName = 'battle64-offline'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        logger.error('Failed to open IndexedDB')
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        logger.info('IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('collections')) {
          db.createObjectStore('collections', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('leaderboard')) {
          db.createObjectStore('leaderboard', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('forum_threads')) {
          db.createObjectStore('forum_threads', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('chat_messages')) {
          db.createObjectStore('chat_messages', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' })
        }
      }
    })
  }

  async set<T>(storeName: string, key: string, data: T): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const dataWithTimestamp = {
        ...data,
        id: key,
        _cached_at: new Date().toISOString()
      }

      const request = store.put(dataWithTimestamp)

      request.onsuccess = () => {
        logger.debug(`Cached data in ${storeName}:`, key)
        resolve()
      }

      request.onerror = () => {
        logger.error(`Failed to cache data in ${storeName}:`, request.error)
        reject(request.error)
      }
    })
  }

  async setMany<T>(storeName: string, items: Array<T & { id: string }>): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      let completed = 0
      const total = items.length

      if (total === 0) {
        resolve()
        return
      }

      items.forEach(item => {
        const dataWithTimestamp = {
          ...item,
          _cached_at: new Date().toISOString()
        }

        const request = store.put(dataWithTimestamp)

        request.onsuccess = () => {
          completed++
          if (completed === total) {
            logger.debug(`Cached ${total} items in ${storeName}`)
            resolve()
          }
        }

        request.onerror = () => {
          logger.error(`Failed to cache item in ${storeName}:`, request.error)
          reject(request.error)
        }
      })
    })
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          // Check if data is still fresh (within 24 hours)
          const cachedAt = new Date(result._cached_at)
          const now = new Date()
          const hoursDiff = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60)
          
          if (hoursDiff < 24) {
            logger.debug(`Retrieved cached data from ${storeName}:`, key)
            resolve(result)
          } else {
            logger.debug(`Cached data expired in ${storeName}:`, key)
            resolve(null)
          }
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        logger.error(`Failed to retrieve data from ${storeName}:`, request.error)
        reject(request.error)
      }
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const results = request.result || []
        // Filter out expired data
        const now = new Date()
        const freshResults = results.filter((item: any) => {
          if (!item._cached_at) return false
          const cachedAt = new Date(item._cached_at)
          const hoursDiff = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60)
          return hoursDiff < 24
        })
        
        logger.debug(`Retrieved ${freshResults.length} items from ${storeName}`)
        resolve(freshResults)
      }

      request.onerror = () => {
        logger.error(`Failed to retrieve all data from ${storeName}:`, request.error)
        reject(request.error)
      }
    })
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => {
        logger.debug(`Cleared all data from ${storeName}`)
        resolve()
      }

      request.onerror = () => {
        logger.error(`Failed to clear data from ${storeName}:`, request.error)
        reject(request.error)
      }
    })
  }

  async setMetadata(key: string, value: any): Promise<void> {
    return this.set('metadata', key, { value, updated_at: new Date().toISOString() })
  }

  async getMetadata(key: string): Promise<any> {
    const result = await this.get('metadata', key)
    return result ? (result as any).value : null
  }

  // Cleanup expired data
  async cleanup(): Promise<void> {
    if (!this.db) await this.init()

    const stores = ['profiles', 'events', 'collections', 'leaderboard', 'forum_threads', 'chat_messages']
    
    for (const storeName of stores) {
      try {
        const allData = await this.getAll(storeName)
        const now = new Date()
        
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        
        // Delete expired items
        const allItems: any[] = await new Promise((resolve, reject) => {
          const request = store.getAll()
          request.onsuccess = () => resolve(request.result || [])
          request.onerror = () => reject(request.error)
        })
        
        let deletedCount = 0
        for (const item of allItems) {
          if (item._cached_at) {
            const cachedAt = new Date(item._cached_at)
            const hoursDiff = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60)
            
            if (hoursDiff >= 24) {
              await new Promise<void>((resolve, reject) => {
                const deleteRequest = store.delete(item.id)
                deleteRequest.onsuccess = () => resolve()
                deleteRequest.onerror = () => reject(deleteRequest.error)
              })
              deletedCount++
            }
          }
        }
        
        if (deletedCount > 0) {
          logger.info(`Cleaned up ${deletedCount} expired items from ${storeName}`)
        }
      } catch (error) {
        logger.error(`Failed to cleanup ${storeName}:`, error)
      }
    }
  }

  // Check if we're currently offline
  isOffline(): boolean {
    return !navigator.onLine
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{ used: number; quota: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      }
    }
    return { used: 0, quota: 0, available: 0 }
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorage()

// Initialize on app start
offlineStorage.init().catch(error => {
  logger.error('Failed to initialize offline storage:', error)
})

// Cleanup expired data periodically
setInterval(() => {
  offlineStorage.cleanup()
}, 60 * 60 * 1000) // Every hour

// Export types for TypeScript
export interface CachedData<T> {
  id: string
  _cached_at: string
  data: T
}

export default offlineStorage