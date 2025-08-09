import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { LanguageProvider } from '../../contexts/LanguageContext'
import { UserProvider } from '../../contexts/UserContext'
import { QuizProvider } from '../../contexts/QuizContext'
import { EventProvider } from '../../contexts/EventContext'
import { MediaProvider } from '../../contexts/MediaContext'
import { ForumProvider } from '../../contexts/ForumContext'
import { PointsProvider } from '../../contexts/PointsContext'
import { InteractionProvider } from '../../contexts/InteractionContext'
import { MapProvider } from '../../contexts/MapContext'

/**
 * Custom render function that wraps components with all necessary providers
 */
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <UserProvider>
          <QuizProvider>
            <EventProvider>
              <MediaProvider>
                <ForumProvider>
                  <PointsProvider>
                    <InteractionProvider>
                      <MapProvider>
                        {children}
                      </MapProvider>
                    </InteractionProvider>
                  </PointsProvider>
                </ForumProvider>
              </MediaProvider>
            </EventProvider>
          </QuizProvider>
        </UserProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  level: 5,
  xp: 1250,
  region: 'PAL' as const,
  platform: 'N64' as const,
  joinDate: new Date('2024-01-01'),
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user bio',
  location: 'Test Location',
  isPublic: true,
  collections: [],
  personalRecords: [],
  points: {
    total: 1250,
    daily: 50,
    weekly: 350,
    monthly: 1250
  },
  termsAccepted: true,
  privacyAccepted: true,
  copyrightAcknowledged: true
}

/**
 * Mock translation function for testing
 */
export const mockTranslation = (key: string): string => {
  const translations: Record<string, string> = {
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.events': 'Events',
    'nav.community': 'Community',
    'nav.profile': 'Profile',
    'nav.leaderboard': 'Leaderboard',
    'nav.media': 'Media',
    'nav.map': 'Map',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'home.welcome': 'Welcome',
    'home.subtitle': 'The ultimate N64 community platform',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit'
  }
  
  return translations[key] || key
}

/**
 * Create a mock language context
 */
export const createMockLanguageContext = () => ({
  currentLanguage: 'en' as const,
  setLanguage: vi.fn(),
  t: mockTranslation,
  isRTL: false,
  isLoading: false
})

/**
 * Create a mock user context
 */
export const createMockUserContext = (user = mockUser) => ({
  user,
  isAuthenticated: !!user,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  deleteAccount: vi.fn(),
  addXP: vi.fn(),
  addToCollection: vi.fn(),
  removeFromCollection: vi.fn(),
  addPersonalRecord: vi.fn(),
  updatePersonalRecord: vi.fn(),
  getUserProfile: vi.fn(),
  getAllUsers: vi.fn()
})

/**
 * Wait for next tick (useful for async operations)
 */
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Mock intersection observer entry
 */
export const createMockIntersectionObserverEntry = (isIntersecting = true) => ({
  isIntersecting,
  target: document.createElement('div'),
  intersectionRatio: isIntersecting ? 1 : 0,
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: {} as DOMRectReadOnly,
  time: Date.now()
})

/**
 * Mock file for file upload testing
 */
export const createMockFile = (name = 'test.jpg', type = 'image/jpeg') => {
  return new File(['test content'], name, { type })
}