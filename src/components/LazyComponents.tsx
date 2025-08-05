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
export const LazyProfilePage = lazy(() => import('../pages/ProfilePage'))
export const LazyMinigamesPage = lazy(() => import('../pages/MinigamesPage'))
export const LazySpeedrunMediaPage = lazy(() => import('../pages/SpeedrunMediaPage'))
export const LazyChatPage = lazy(() => import('../pages/ChatPage'))
export const LazyForumCategoryPage = lazy(() => import('../pages/ForumCategoryPage'))
export const LazyForumThreadPage = lazy(() => import('../pages/ForumThreadPage'))
export const LazyForumNewThreadPage = lazy(() => import('../pages/ForumNewThreadPage'))
export const LazyNewsFeedPage = lazy(() => import('../pages/NewsFeedPage'))
export const LazyCommunityPage = lazy(() => import('../pages/CommunityPage'))

// Lazy load complex components
export const LazyN64FanLeaderboard = lazy(() => import('./N64FanLeaderboard'))
export const LazyEventLeaderboard = lazy(() => import('./EventLeaderboard'))
export const LazyPersonalRecordsManager = lazy(() => import('./PersonalRecordsManager'))
export const LazyAchievementsPanel = lazy(() => import('./AchievementsPanel'))
export const LazyBattle64Map = lazy(() => import('./Battle64Map'))
export const LazyEventFeedWidget = lazy(() => import('./EventFeedWidget'))
export const LazyBattleStatsPanel = lazy(() => import('./BattleStatsPanel'))
export const LazyLiveBattleViewer = lazy(() => import('./LiveBattleViewer'))

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
export const ProfilePage = withSuspense(LazyProfilePage)
export const MinigamesPage = withSuspense(LazyMinigamesPage)
export const SpeedrunMediaPage = withSuspense(LazySpeedrunMediaPage)
export const ChatPage = withSuspense(LazyChatPage)
export const ForumCategoryPage = withSuspense(LazyForumCategoryPage)
export const ForumThreadPage = withSuspense(LazyForumThreadPage)
export const ForumNewThreadPage = withSuspense(LazyForumNewThreadPage)
export const NewsFeedPage = withSuspense(LazyNewsFeedPage)
export const CommunityPage = withSuspense(LazyCommunityPage)

export const N64FanLeaderboard = withSuspense(LazyN64FanLeaderboard)
export const EventLeaderboard = withSuspense(LazyEventLeaderboard)
export const PersonalRecordsManager = withSuspense(LazyPersonalRecordsManager)
export const AchievementsPanel = withSuspense(LazyAchievementsPanel)
export const Battle64Map = withSuspense(LazyBattle64Map)
export const EventFeedWidget = withSuspense(LazyEventFeedWidget)
export const BattleStatsPanel = withSuspense(LazyBattleStatsPanel)
export const LiveBattleViewer = withSuspense(LazyLiveBattleViewer)