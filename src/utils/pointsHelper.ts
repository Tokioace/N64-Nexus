import { PointsConfig } from '../types'

// Helper functions to award points from anywhere in the app
export const awardPointsForAction = async (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  action: keyof PointsConfig,
  description?: string
): Promise<boolean> => {
  try {
    const success = await awardPoints(action, description)
    if (success) {
      // You could add a toast notification here
      console.log(`Points awarded for ${action}: ${description || 'No description'}`)
    }
    return success
  } catch (error) {
    console.error('Error awarding points:', error)
    return false
  }
}

// Specific helper functions for common actions
export const awardSpeedrunUploadPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  gameName?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'speedrun.upload',
    gameName ? `Speedrun uploaded for ${gameName}` : 'Speedrun uploaded'
  )
}

export const awardFanartUploadPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  artworkTitle?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'fanart.upload',
    artworkTitle ? `Fanart uploaded: ${artworkTitle}` : 'Fanart uploaded'
  )
}

export const awardQuizCorrectPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  questionTopic?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'quiz.answerCorrect',
    questionTopic ? `Correct answer: ${questionTopic}` : 'Quiz question answered correctly'
  )
}

export const awardQuizPerfectPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  quizName?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'quiz.fullPerfect',
    quizName ? `Perfect score on ${quizName}` : 'Perfect quiz completion'
  )
}

export const awardForumPostPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  postTitle?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'forum.post',
    postTitle ? `Forum post: ${postTitle}` : 'Forum post created'
  )
}

export const awardForumReplyPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  threadTitle?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'forum.reply',
    threadTitle ? `Reply to: ${threadTitle}` : 'Forum reply posted'
  )
}

export const awardMinigameSuccessPoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  gameName?: string,
  score?: number
) => {
  return awardPointsForAction(
    awardPoints,
    'minigame.success',
    gameName && score 
      ? `${gameName} completed with score: ${score}`
      : gameName 
        ? `${gameName} completed`
        : 'Minigame completed successfully'
  )
}

export const awardProfileCompletePoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>
) => {
  return awardPointsForAction(
    awardPoints,
    'profile.setupComplete',
    'Profile setup completed'
  )
}

export const awardMarketSalePoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  itemName?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'marketplace.saleConfirmed',
    itemName ? `Sale confirmed: ${itemName}` : 'Marketplace sale confirmed'
  )
}

export const awardNewsSharePoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  newsTitle?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'news.shared',
    newsTitle ? `News shared: ${newsTitle}` : 'News article shared'
  )
}

export const awardChatMessagePoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>
) => {
  return awardPointsForAction(
    awardPoints,
    'chat.messages',
    'Chat message sent'
  )
}

// TODO: Implement these helper functions when the corresponding features are built:

export const awardSpeedrunTop3Points = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  rank: number,
  gameName?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'speedrun.top3',
    `Achieved rank ${rank} in ${gameName || 'speedrun'}`
  )
}

export const awardMarketplacePoints = (
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>,
  itemName?: string
) => {
  return awardPointsForAction(
    awardPoints,
    'marketplace.saleConfirmed',
    itemName ? `Marketplace sale confirmed: ${itemName}` : 'Marketplace sale confirmed'
  )
}