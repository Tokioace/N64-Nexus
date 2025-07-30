import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
  </div>
)

// Lazy load heavy components
export const LazyCollectorMode = lazy(() => import('../pages/CollectorMode'))
export const LazyMarketplacePage = lazy(() => import('../pages/MarketplacePage'))
export const LazyEventsPage = lazy(() => import('../pages/EventsPage'))
export const LazyFanArtPage = lazy(() => import('../pages/FanArtPage'))
export const LazyForumPage = lazy(() => import('../pages/ForumPage'))
export const LazyLeaderboardPage = lazy(() => import('../pages/LeaderboardPage'))
export const LazyQuizPage = lazy(() => import('../pages/QuizPage'))
// export const LazyMediaPage = lazy(() => import('../pages/MediaPage'))
export const LazyProfilePage = lazy(() => import('../pages/ProfilePage'))
// export const LazyNewsPage = lazy(() => import('../pages/NewsPage'))

// Lazy load complex components
export const LazyN64FanLeaderboard = lazy(() => import('./N64FanLeaderboard'))
export const LazyEventLeaderboard = lazy(() => import('./EventLeaderboard'))
export const LazyPersonalRecordsManager = lazy(() => import('./PersonalRecordsManager'))
export const LazyAchievementsPanel = lazy(() => import('./AchievementsPanel'))

// HOC for wrapping lazy components with Suspense
// eslint-disable-next-line react-refresh/only-export-components
export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  )
}

// Pre-configured lazy components with Suspense
export const CollectorMode = withSuspense(LazyCollectorMode)
export const MarketplacePage = withSuspense(LazyMarketplacePage)
export const EventsPage = withSuspense(LazyEventsPage)
export const FanArtPage = withSuspense(LazyFanArtPage)
export const ForumPage = withSuspense(LazyForumPage)
export const LeaderboardPage = withSuspense(LazyLeaderboardPage)
export const QuizPage = withSuspense(LazyQuizPage)
// export const MediaPage = withSuspense(LazyMediaPage)
export const ProfilePage = withSuspense(LazyProfilePage)
// export const NewsPage = withSuspense(LazyNewsPage)

export const N64FanLeaderboard = withSuspense(LazyN64FanLeaderboard)
export const EventLeaderboard = withSuspense(LazyEventLeaderboard)
export const PersonalRecordsManager = withSuspense(LazyPersonalRecordsManager)
export const AchievementsPanel = withSuspense(LazyAchievementsPanel)