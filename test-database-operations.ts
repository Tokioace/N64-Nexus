/**
 * Battle64 Database Test Suite
 * 
 * This file contains test cases for all major database operations.
 * Run these tests to verify that your Supabase database setup is working correctly.
 * 
 * IMPORTANT: Make sure you have run the database-setup.sql script in Supabase before running these tests.
 * 
 * Usage:
 * 1. Make sure you're authenticated with Supabase
 * 2. Run this script in a test environment
 * 3. Check console output for results
 */

import { 
  profileService, 
  eventService, 
  speedrunService, 
  fanartService, 
  collectionService, 
  chatService, 
  forumService, 
  likeService, 
  reportService, 
  storageService, 
  statsService 
} from './src/services/dbService'
import { supabase } from './src/lib/supabase'
import { logger } from './src/lib/logger'

// Test configuration
const TEST_CONFIG = {
  testUserId: '550e8400-e29b-41d4-a716-446655440000', // This would be a real auth.uid() in practice
  testUsername: 'TestUser64',
  testEventTitle: 'Test Mario Kart Championship',
  testGame: 'Mario Kart 64',
  testTrack: 'Luigi Raceway',
  cleanup: true // Set to false if you want to keep test data
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [] as string[]
}

// Helper function to log test results
function logTest(testName: string, success: boolean, error?: any) {
  if (success) {
    testResults.passed++
    console.log(`✅ ${testName}`)
  } else {
    testResults.failed++
    testResults.errors.push(`❌ ${testName}: ${error?.message || error}`)
    console.error(`❌ ${testName}:`, error)
  }
}

// Helper function to create test file
function createTestFile(): File {
  const blob = new Blob(['test content'], { type: 'text/plain' })
  return new File([blob], 'test-file.txt', { type: 'text/plain' })
}

// =====================================================
// TEST SUITE
// =====================================================

async function runDatabaseTests() {
  console.log('🚀 Starting Battle64 Database Test Suite...\n')

  // Test 1: Profile Operations
  console.log('📝 Testing Profile Operations...')
  await testProfileOperations()

  // Test 2: Event Operations
  console.log('\n🎮 Testing Event Operations...')
  await testEventOperations()

  // Test 3: Speedrun Operations
  console.log('\n⚡ Testing Speedrun Operations...')
  await testSpeedrunOperations()

  // Test 4: Fanart Operations
  console.log('\n🎨 Testing Fanart Operations...')
  await testFanartOperations()

  // Test 5: Collection Operations
  console.log('\n📚 Testing Collection Operations...')
  await testCollectionOperations()

  // Test 6: Chat Operations
  console.log('\n💬 Testing Chat Operations...')
  await testChatOperations()

  // Test 7: Forum Operations
  console.log('\n🗣️ Testing Forum Operations...')
  await testForumOperations()

  // Test 8: Like Operations
  console.log('\n❤️ Testing Like Operations...')
  await testLikeOperations()

  // Test 9: Report Operations
  console.log('\n🚨 Testing Report Operations...')
  await testReportOperations()

  // Test 10: Storage Operations
  console.log('\n📁 Testing Storage Operations...')
  await testStorageOperations()

  // Test 11: Statistics Operations
  console.log('\n📊 Testing Statistics Operations...')
  await testStatisticsOperations()

  // Test 12: Real-time Subscriptions
  console.log('\n🔄 Testing Real-time Subscriptions...')
  await testRealtimeSubscriptions()

  // Cleanup (if enabled)
  if (TEST_CONFIG.cleanup) {
    console.log('\n🧹 Cleaning up test data...')
    await cleanupTestData()
  }

  // Print final results
  printTestResults()
}

// =====================================================
// INDIVIDUAL TEST FUNCTIONS
// =====================================================

async function testProfileOperations() {
  try {
    // Create profile
    const profileData = {
      id: TEST_CONFIG.testUserId,
      username: TEST_CONFIG.testUsername,
      language: 'en',
      points: 100,
      level: 2
    }

    const createdProfile = await profileService.createProfile(profileData)
    logTest('Create Profile', !!createdProfile)

    // Get profile
    const fetchedProfile = await profileService.getProfile(TEST_CONFIG.testUserId)
    logTest('Fetch Profile', fetchedProfile?.username === TEST_CONFIG.testUsername)

    // Update profile
    const updatedProfile = await profileService.updateProfile(TEST_CONFIG.testUserId, {
      points: 200,
      level: 3
    })
    logTest('Update Profile', updatedProfile?.points === 200)

    // Get public profiles
    const publicProfiles = await profileService.getPublicProfiles(10)
    logTest('Fetch Public Profiles', Array.isArray(publicProfiles))

  } catch (error) {
    logTest('Profile Operations', false, error)
  }
}

async function testEventOperations() {
  try {
    const eventData = {
      title: TEST_CONFIG.testEventTitle,
      game: TEST_CONFIG.testGame,
      track: TEST_CONFIG.testTrack,
      start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      status: 'upcoming' as const,
      created_by: TEST_CONFIG.testUserId
    }

    // Create event
    const createdEvent = await eventService.createEvent(eventData)
    logTest('Create Event', !!createdEvent?.id)

    // Store event ID for other tests
    ;(global as any).testEventId = createdEvent?.id

    // Get events
    const events = await eventService.getEvents()
    logTest('Fetch Events', Array.isArray(events))

    // Get specific event
    const fetchedEvent = await eventService.getEvent(createdEvent.id)
    logTest('Fetch Single Event', fetchedEvent?.title === TEST_CONFIG.testEventTitle)

    // Update event
    const updatedEvent = await eventService.updateEvent(createdEvent.id, {
      status: 'live'
    })
    logTest('Update Event', updatedEvent?.status === 'live')

  } catch (error) {
    logTest('Event Operations', false, error)
  }
}

async function testSpeedrunOperations() {
  try {
    const eventId = (global as any).testEventId
    if (!eventId) {
      throw new Error('No test event ID available')
    }

    const speedrunData = {
      event_id: eventId,
      user_id: TEST_CONFIG.testUserId,
      time_ms: 125000, // 2:05.000
      notes: 'Test speedrun'
    }

    // Create speedrun
    const createdSpeedrun = await speedrunService.createSpeedrun(speedrunData)
    logTest('Create Speedrun', !!createdSpeedrun?.id)

    // Store speedrun ID for other tests
    ;(global as any).testSpeedrunId = createdSpeedrun?.id

    // Get speedruns for event
    const eventSpeedruns = await speedrunService.getSpeedruns(eventId)
    logTest('Fetch Event Speedruns', Array.isArray(eventSpeedruns))

    // Get speedruns for user
    const userSpeedruns = await speedrunService.getSpeedruns(undefined, TEST_CONFIG.testUserId)
    logTest('Fetch User Speedruns', Array.isArray(userSpeedruns))

    // Update speedrun
    const updatedSpeedrun = await speedrunService.updateSpeedrun(createdSpeedrun.id, {
      time_ms: 124000, // Better time
      verified: true
    })
    logTest('Update Speedrun', updatedSpeedrun?.time_ms === 124000)

    // Get event leaderboard
    const leaderboard = await speedrunService.getEventLeaderboard(eventId)
    logTest('Fetch Event Leaderboard', Array.isArray(leaderboard))

  } catch (error) {
    logTest('Speedrun Operations', false, error)
  }
}

async function testFanartOperations() {
  try {
    const fanartData = {
      user_id: TEST_CONFIG.testUserId,
      image_url: 'https://example.com/test-fanart.jpg',
      title: 'Test Fanart',
      description: 'A test fanart piece'
    }

    // Create fanart
    const createdFanart = await fanartService.createFanart(fanartData)
    logTest('Create Fanart', !!createdFanart?.id)

    // Store fanart ID for other tests
    ;(global as any).testFanartId = createdFanart?.id

    // Get all fanarts
    const allFanarts = await fanartService.getFanarts()
    logTest('Fetch All Fanarts', Array.isArray(allFanarts))

    // Get user fanarts
    const userFanarts = await fanartService.getFanarts(TEST_CONFIG.testUserId)
    logTest('Fetch User Fanarts', Array.isArray(userFanarts))

    // Update fanart
    const updatedFanart = await fanartService.updateFanart(createdFanart.id, {
      title: 'Updated Test Fanart'
    })
    logTest('Update Fanart', updatedFanart?.title === 'Updated Test Fanart')

  } catch (error) {
    logTest('Fanart Operations', false, error)
  }
}

async function testCollectionOperations() {
  try {
    const collectionData = {
      user_id: TEST_CONFIG.testUserId,
      game_title: 'Super Mario 64',
      platform: 'N64' as const,
      region: 'NTSC' as const,
      condition: 'mint' as const,
      completeness: 'complete' as const,
      is_completed: true
    }

    // Create collection item
    const createdCollection = await collectionService.createCollection(collectionData)
    logTest('Create Collection Item', !!createdCollection?.id)

    // Store collection ID for cleanup
    ;(global as any).testCollectionId = createdCollection?.id

    // Get user collections
    const collections = await collectionService.getCollections(TEST_CONFIG.testUserId)
    logTest('Fetch User Collections', Array.isArray(collections))

    // Get wishlist items
    const wishlist = await collectionService.getCollections(TEST_CONFIG.testUserId, true)
    logTest('Fetch User Wishlist', Array.isArray(wishlist))

    // Update collection
    const updatedCollection = await collectionService.updateCollection(createdCollection.id, {
      note: 'Test note added'
    })
    logTest('Update Collection Item', updatedCollection?.note === 'Test note added')

  } catch (error) {
    logTest('Collection Operations', false, error)
  }
}

async function testChatOperations() {
  try {
    const messageData = {
      sender_id: TEST_CONFIG.testUserId,
      message: 'Hello, this is a test message!',
      channel: 'general'
    }

    // Send message
    const sentMessage = await chatService.sendMessage(messageData)
    logTest('Send Chat Message', !!sentMessage?.id)

    // Store message ID for cleanup
    ;(global as any).testMessageId = sentMessage?.id

    // Get messages
    const messages = await chatService.getMessages('general', 50)
    logTest('Fetch Chat Messages', Array.isArray(messages))

  } catch (error) {
    logTest('Chat Operations', false, error)
  }
}

async function testForumOperations() {
  try {
    const postData = {
      user_id: TEST_CONFIG.testUserId,
      title: 'Test Forum Post',
      content: 'This is a test forum post content.',
      category: 'general'
    }

    // Create forum post
    const createdPost = await forumService.createPost(postData)
    logTest('Create Forum Post', !!createdPost?.id)

    // Store post ID for other tests
    ;(global as any).testPostId = createdPost?.id

    // Get forum posts
    const posts = await forumService.getPosts()
    logTest('Fetch Forum Posts', Array.isArray(posts))

    // Get specific post
    const fetchedPost = await forumService.getPost(createdPost.id)
    logTest('Fetch Single Forum Post', fetchedPost?.title === 'Test Forum Post')

    // Create comment
    const commentData = {
      post_id: createdPost.id,
      user_id: TEST_CONFIG.testUserId,
      comment: 'This is a test comment.'
    }

    const createdComment = await forumService.createComment(commentData)
    logTest('Create Forum Comment', !!createdComment?.id)

    // Store comment ID for cleanup
    ;(global as any).testCommentId = createdComment?.id

    // Get comments
    const comments = await forumService.getComments(createdPost.id)
    logTest('Fetch Forum Comments', Array.isArray(comments))

    // Update post
    const updatedPost = await forumService.updatePost(createdPost.id, {
      title: 'Updated Test Forum Post'
    })
    logTest('Update Forum Post', updatedPost?.title === 'Updated Test Forum Post')

  } catch (error) {
    logTest('Forum Operations', false, error)
  }
}

async function testLikeOperations() {
  try {
    const speedrunId = (global as any).testSpeedrunId
    const fanartId = (global as any).testFanartId

    if (!speedrunId && !fanartId) {
      throw new Error('No test content IDs available for likes')
    }

    const targetId = speedrunId || fanartId
    const targetType = speedrunId ? 'speedrun' : 'fanart'

    const likeData = {
      user_id: TEST_CONFIG.testUserId,
      target_type: targetType as 'speedrun' | 'fanart',
      target_id: targetId
    }

    // Toggle like (add)
    const addResult = await likeService.toggleLike(likeData)
    logTest('Add Like', addResult.action === 'added')

    // Get likes
    const likes = await likeService.getLikes(targetType, targetId)
    logTest('Fetch Likes', Array.isArray(likes))

    // Get like count
    const likeCount = await likeService.getLikeCount(targetType, targetId)
    logTest('Get Like Count', typeof likeCount === 'number' && likeCount >= 0)

    // Check if liked by user
    const isLiked = await likeService.isLikedByUser(TEST_CONFIG.testUserId, targetType, targetId)
    logTest('Check If Liked By User', isLiked === true)

    // Toggle like (remove)
    const removeResult = await likeService.toggleLike(likeData)
    logTest('Remove Like', removeResult.action === 'removed')

  } catch (error) {
    logTest('Like Operations', false, error)
  }
}

async function testReportOperations() {
  try {
    const speedrunId = (global as any).testSpeedrunId

    if (!speedrunId) {
      throw new Error('No test speedrun ID available for reporting')
    }

    const reportData = {
      reported_by: TEST_CONFIG.testUserId,
      target_type: 'speedrun',
      target_id: speedrunId,
      reason: 'Test report - inappropriate content'
    }

    // Create report
    const createdReport = await reportService.createReport(reportData)
    logTest('Create Report', !!createdReport?.id)

    // Store report ID for cleanup
    ;(global as any).testReportId = createdReport?.id

    // Get reports
    const reports = await reportService.getReports(TEST_CONFIG.testUserId)
    logTest('Fetch User Reports', Array.isArray(reports))

    // Update report status
    const updatedReport = await reportService.updateReport(createdReport.id, {
      status: 'reviewed'
    })
    logTest('Update Report', updatedReport?.status === 'reviewed')

  } catch (error) {
    logTest('Report Operations', false, error)
  }
}

async function testStorageOperations() {
  try {
    const testFile = createTestFile()
    const filePath = `${TEST_CONFIG.testUserId}/test-files/test-upload.txt`

    // Upload file
    const uploadResult = await storageService.uploadFile('uploads', filePath, testFile)
    logTest('Upload File', !!uploadResult?.path)

    // Get public URL
    const publicUrl = await storageService.getPublicUrl('uploads', filePath)
    logTest('Get Public URL', typeof publicUrl === 'string' && publicUrl.length > 0)

    // Create signed URL
    const signedUrl = await storageService.createSignedUrl('uploads', filePath, 3600)
    logTest('Create Signed URL', typeof signedUrl === 'string' && signedUrl.length > 0)

    // Delete file
    await storageService.deleteFile('uploads', filePath)
    logTest('Delete File', true) // If no error thrown, consider success

  } catch (error) {
    logTest('Storage Operations', false, error)
  }
}

async function testStatisticsOperations() {
  try {
    // Get user stats
    const userStats = await statsService.getUserStats(TEST_CONFIG.testUserId)
    logTest('Get User Stats', typeof userStats === 'object' && userStats !== null)

    // Get global stats
    const globalStats = await statsService.getGlobalStats()
    logTest('Get Global Stats', typeof globalStats === 'object' && globalStats !== null)

  } catch (error) {
    logTest('Statistics Operations', false, error)
  }
}

async function testRealtimeSubscriptions() {
  try {
    // Test chat subscription (simplified)
    const subscription = chatService.subscribeToMessages('general', (payload) => {
      console.log('Received real-time message:', payload)
    })

    logTest('Create Real-time Subscription', !!subscription)

    // Clean up subscription
    if (subscription) {
      subscription.unsubscribe()
    }

  } catch (error) {
    logTest('Real-time Subscriptions', false, error)
  }
}

// =====================================================
// CLEANUP FUNCTIONS
// =====================================================

async function cleanupTestData() {
  try {
    // Clean up in reverse order to respect foreign key constraints
    const cleanupTasks = []

    // Delete likes (no stored ID, but they cascade)
    
    // Delete reports
    if ((global as any).testReportId) {
      // Reports don't have delete method in service, skip for now
    }

    // Delete forum comments
    if ((global as any).testCommentId) {
      cleanupTasks.push(forumService.deleteComment((global as any).testCommentId))
    }

    // Delete forum posts
    if ((global as any).testPostId) {
      cleanupTasks.push(forumService.deletePost((global as any).testPostId))
    }

    // Delete chat messages
    if ((global as any).testMessageId) {
      cleanupTasks.push(chatService.deleteMessage((global as any).testMessageId))
    }

    // Delete collections
    if ((global as any).testCollectionId) {
      cleanupTasks.push(collectionService.deleteCollection((global as any).testCollectionId))
    }

    // Delete fanarts
    if ((global as any).testFanartId) {
      cleanupTasks.push(fanartService.deleteFanart((global as any).testFanartId))
    }

    // Delete speedruns
    if ((global as any).testSpeedrunId) {
      cleanupTasks.push(speedrunService.deleteSpeedrun((global as any).testSpeedrunId))
    }

    // Delete events
    if ((global as any).testEventId) {
      cleanupTasks.push(eventService.deleteEvent((global as any).testEventId))
    }

    // Execute all cleanup tasks
    await Promise.all(cleanupTasks)

    // Note: We don't delete the profile as it might be needed for auth
    console.log('✅ Cleanup completed')

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  }
}

// =====================================================
// RESULTS REPORTING
// =====================================================

function printTestResults() {
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Tests Passed: ${testResults.passed}`)
  console.log(`❌ Tests Failed: ${testResults.failed}`)
  console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`)

  if (testResults.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:')
    testResults.errors.forEach(error => console.log(error))
  }

  console.log('\n' + '='.repeat(50))

  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Your Battle64 database setup is working correctly.')
  } else {
    console.log('⚠️  Some tests failed. Please check your database setup and RLS policies.')
  }
}

// =====================================================
// EXPORT FOR MANUAL TESTING
// =====================================================

// Export the test function so it can be called manually
export { runDatabaseTests }

// Auto-run if this file is executed directly (for Node.js environments)
if (typeof window === 'undefined' && require.main === module) {
  runDatabaseTests().catch(console.error)
}