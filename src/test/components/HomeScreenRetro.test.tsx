import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockUser, createMockUserContext } from '../utils/test-utils'
import HomeScreenRetro from '../../components/HomeScreenRetro'
import * as UserContext from '../../contexts/UserContext'
import * as LanguageContext from '../../contexts/LanguageContext'

// Mock the contexts
vi.mock('../../contexts/UserContext')
vi.mock('../../contexts/LanguageContext')

describe('HomeScreenRetro', () => {
  const mockUseUser = vi.mocked(UserContext.useUser)
  const mockUseLanguage = vi.mocked(LanguageContext.useLanguage)

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      setLanguage: vi.fn(),
      t: (key: string) => {
        const translations: Record<string, string> = {
          'alt.battle64Mascot': 'Battle64 Mascot',
          'home.welcome': 'Welcome',
          'profile.level': 'Level',
          'home.subtitle': 'The ultimate N64 community platform',
          'nav.quiz': 'Quiz',
          'home.quiz.subtitle': 'Test your N64 knowledge',
          'nav.events': 'Events',
          'home.events.subtitle': 'Join speedrun competitions',
          'nav.map': 'Map',
          'home.map.subtitle': 'Explore the community',
          'nav.media': 'Media',
          'home.media.subtitle': 'Share your achievements',
          'nav.collector': 'Collector',
          'home.collector.subtitle': 'Manage your collection',
          'nav.community': 'Community',
          'home.community.subtitle': 'Connect with fans',
          'nav.leaderboard': 'Leaderboard',
          'home.leaderboard.subtitle': 'View top players',
          'nav.minigames': 'Minigames',
          'home.minigames.subtitle': 'Play retro games',
          'nav.forum': 'Forum',
          'home.forum.subtitle': 'Join discussions',
          'nav.fanart': 'Fan Art',
          'home.fanart.subtitle': 'Share your creativity',
          'nav.news': 'News',
          'home.news.subtitle': 'Latest updates',
          'nav.marketplace': 'Marketplace',
          'home.marketplace.subtitle': 'Buy and sell games'
        }
        return translations[key] || key
      },
      isRTL: false,
      isLoading: false
    })
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue(createMockUserContext(null))
    })

    it('renders welcome message for anonymous user', () => {
      render(<HomeScreenRetro />)
      
      expect(screen.getByText('Welcome')).toBeInTheDocument()
      expect(screen.getByText('The ultimate N64 community platform')).toBeInTheDocument()
    })

    it('displays the Battle64 mascot', () => {
      render(<HomeScreenRetro />)
      
      const mascot = screen.getByAltText('Battle64 Mascot')
      expect(mascot).toBeInTheDocument()
      expect(mascot).toHaveAttribute('src', '/mascot.png')
    })

    it('renders all navigation tiles', () => {
      render(<HomeScreenRetro />)
      
      // Check for main navigation items
      expect(screen.getByText('Quiz')).toBeInTheDocument()
      expect(screen.getByText('Events')).toBeInTheDocument()
      expect(screen.getByText('Map')).toBeInTheDocument()
      expect(screen.getByText('Media')).toBeInTheDocument()
      expect(screen.getByText('Collector')).toBeInTheDocument()
      expect(screen.getByText('Community')).toBeInTheDocument()
      expect(screen.getByText('Leaderboard')).toBeInTheDocument()
      expect(screen.getByText('Minigames')).toBeInTheDocument()
      expect(screen.getByText('Forum')).toBeInTheDocument()
      expect(screen.getByText('Fan Art')).toBeInTheDocument()
      expect(screen.getByText('News')).toBeInTheDocument()
      expect(screen.getByText('Marketplace')).toBeInTheDocument()
    })

    it('has correct navigation links', () => {
      render(<HomeScreenRetro />)
      
      expect(screen.getByRole('link', { name: /quiz/i })).toHaveAttribute('href', '/quiz')
      expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events')
      expect(screen.getByRole('link', { name: /map/i })).toHaveAttribute('href', '/map')
      expect(screen.getByRole('link', { name: /media/i })).toHaveAttribute('href', '/speedrun-media')
    })
  })

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue(createMockUserContext(mockUser))
    })

    it('renders personalized welcome message', () => {
      render(<HomeScreenRetro />)
      
      expect(screen.getByText(`Welcome, ${mockUser.username}! (Level ${mockUser.level})`)).toBeInTheDocument()
    })

    it('displays user level in welcome message', () => {
      const userWithDifferentLevel = { ...mockUser, level: 10 }
      mockUseUser.mockReturnValue(createMockUserContext(userWithDifferentLevel))
      
      render(<HomeScreenRetro />)
      
      expect(screen.getByText(`Welcome, ${userWithDifferentLevel.username}! (Level ${userWithDifferentLevel.level})`)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue(createMockUserContext(null))
    })

    it('has proper alt text for mascot image', () => {
      render(<HomeScreenRetro />)
      
      const mascot = screen.getByAltText('Battle64 Mascot')
      expect(mascot).toBeInTheDocument()
    })

    it('has semantic navigation structure', () => {
      render(<HomeScreenRetro />)
      
      // All tiles should be links for keyboard navigation
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(12) // 12 navigation tiles
    })

    it('tiles are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<HomeScreenRetro />)
      
      const firstLink = screen.getByRole('link', { name: /quiz/i })
      
      // Should be focusable
      await user.tab()
      expect(firstLink).toHaveFocus()
    })
  })

  describe('responsive design', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue(createMockUserContext(null))
    })

    it('applies mobile-optimized classes', () => {
      render(<HomeScreenRetro />)
      
      const container = screen.getByText('Quiz').closest('.simple-tile')
      expect(container).toHaveClass('mobile-tile-optimized')
    })

    it('uses responsive grid layout', () => {
      render(<HomeScreenRetro />)
      
      const grid = screen.getByText('Quiz').closest('.grid')
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
    })
  })

  describe('internationalization', () => {
    it('calls translation function for all text content', () => {
      const mockT = vi.fn(key => key)
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'de',
        setLanguage: vi.fn(),
        t: mockT,
        isRTL: false,
        isLoading: false
      })
      mockUseUser.mockReturnValue(createMockUserContext(null))
      
      render(<HomeScreenRetro />)
      
      // Verify translation function is called for key content
      expect(mockT).toHaveBeenCalledWith('home.welcome')
      expect(mockT).toHaveBeenCalledWith('home.subtitle')
      expect(mockT).toHaveBeenCalledWith('nav.quiz')
      expect(mockT).toHaveBeenCalledWith('nav.events')
    })

    it('supports RTL languages', () => {
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        setLanguage: vi.fn(),
        t: (key: string) => key,
        isRTL: true,
        isLoading: false
      })
      mockUseUser.mockReturnValue(createMockUserContext(null))
      
      render(<HomeScreenRetro />)
      
      // Component should render without errors for RTL languages
      expect(screen.getByText('home.welcome')).toBeInTheDocument()
    })
  })
})