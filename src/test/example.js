const SeasonalEventManager = require('../services/SeasonalEventManager');
const SeasonalEvent = require('../models/SeasonalEvent');
const Reward = require('../models/Reward');

// Example usage of the Seasonal Events System
async function demonstrateSeasonalEvents() {
  console.log('🎮 Battle64 Seasonal Events System Demo\n');

  // Initialize the event manager
  const eventManager = new SeasonalEventManager();

  // 1. Get current season and holiday
  console.log('📅 Current Season & Holiday:');
  console.log(`Current Season: ${eventManager.getCurrentSeason()}`);
  console.log(`Current Holiday: ${eventManager.getCurrentHoliday() || 'None'}\n`);

  // 2. Get active events
  console.log('🎯 Currently Active Events:');
  const activeEvents = eventManager.getActiveEvents();
  activeEvents.forEach(event => {
    console.log(`- ${event.name} (${event.type})`);
    console.log(`  Duration: ${event.duration} days`);
    console.log(`  Progress: ${event.getProgressPercentage().toFixed(1)}%`);
    console.log(`  Days until end: ${event.getDaysUntilEnd()}`);
  });
  console.log('');

  // 3. Get upcoming events
  console.log('📅 Upcoming Events (next 7 days):');
  const upcomingEvents = eventManager.getUpcomingEvents(7);
  upcomingEvents.forEach(event => {
    console.log(`- ${event.name} starts in ${event.getDaysUntilStart()} days`);
  });
  console.log('');

  // 4. Get events by season
  console.log('🌸 Spring Events:');
  const springEvents = eventManager.getEventsBySeason('spring');
  springEvents.forEach(event => {
    console.log(`- ${event.name}: ${event.description}`);
  });
  console.log('');

  // 5. Get holiday events
  console.log('🎃 Halloween Events:');
  const halloweenEvents = eventManager.getEventsByHoliday('halloween');
  halloweenEvents.forEach(event => {
    console.log(`- ${event.name}: ${event.description}`);
    console.log(`  Maps: ${event.maps.join(', ')}`);
  });
  console.log('');

  // 6. Get event statistics
  console.log('📊 Event Statistics:');
  const stats = eventManager.getEventStatistics();
  console.log(`Total Events: ${stats.totalEvents}`);
  console.log(`Active Events: ${stats.activeEvents}`);
  console.log(`Upcoming Events: ${stats.upcomingEvents}`);
  console.log(`Seasonal Events: ${stats.seasonalEvents}`);
  console.log(`Holiday Events: ${stats.holidayEvents}`);
  console.log('');

  // 7. Demonstrate reward system
  console.log('🎁 Reward System Example:');
  const sampleEvent = activeEvents[0] || eventManager.getEventsBySeason('spring')[0];
  if (sampleEvent) {
    console.log(`Event: ${sampleEvent.name}`);
    sampleEvent.rewards.forEach(reward => {
      const rewardObj = new Reward({
        ...reward,
        eventId: sampleEvent.id,
        eventName: sampleEvent.name
      });
      console.log(`- ${rewardObj.name} (${rewardObj.type})`);
      console.log(`  Rarity: ${rewardObj.rarity} (${rewardObj.getRarityColor()})`);
      console.log(`  Value: ${rewardObj.getValue()} points`);
      console.log(`  Description: ${rewardObj.description}`);
    });
  }
  console.log('');

  // 8. Demonstrate challenge system
  console.log('🏆 Challenge System Example:');
  if (sampleEvent) {
    sampleEvent.challenges.forEach(challenge => {
      console.log(`- ${challenge.name}`);
      console.log(`  Description: ${challenge.description}`);
      console.log(`  Target: ${challenge.target}`);
      console.log(`  Reward: ${challenge.reward}`);
    });
  }
  console.log('');

  // 9. Get event calendar for current month
  const now = new Date();
  console.log(`🗓️ Event Calendar for ${now.getFullYear()}/${now.getMonth() + 1}:`);
  const calendarEvents = eventManager.getEventCalendar(now.getFullYear(), now.getMonth());
  calendarEvents.forEach(calEvent => {
    console.log(`- ${calEvent.event.name}`);
    console.log(`  Start: ${calEvent.startDate.format('YYYY-MM-DD')}`);
    console.log(`  End: ${calEvent.endDate.format('YYYY-MM-DD')}`);
    console.log(`  Active: ${calEvent.isActive}`);
  });
  console.log('');

  // 10. Demonstrate user recommendations
  console.log('💡 User Recommendations Example:');
  const userPreferences = {
    favoriteSeason: 'spring',
    favoriteHoliday: 'halloween',
    prepareForEvents: true
  };
  const recommendations = eventManager.getRecommendedEvents(userPreferences);
  console.log(`Based on preferences: ${JSON.stringify(userPreferences)}`);
  recommendations.forEach(event => {
    console.log(`- ${event.name} (${event.type})`);
  });
  console.log('');

  // 11. Demonstrate event creation
  console.log('➕ Creating Custom Event Example:');
  try {
    const customEvent = eventManager.createEvent({
      name: "Custom Test Event",
      description: "A test event for demonstration",
      type: "holiday",
      holiday: "custom",
      startDate: "2024-12-01",
      endDate: "2024-12-07",
      duration: 7,
      theme: {
        primaryColor: "#FF0000",
        secondaryColor: "#00FF00"
      },
      rewards: [
        {
          type: "sticker",
          name: "Test Sticker",
          description: "A test reward",
          rarity: "common"
        }
      ],
      challenges: [
        {
          name: "Test Challenge",
          description: "Complete this test challenge",
          reward: "Test Sticker",
          progress: 0,
          target: 1
        }
      ],
      maps: ["Test_Map_1", "Test_Map_2"]
    });
    console.log(`Created event: ${customEvent.name} (ID: ${customEvent.id})`);
    
    // Clean up - delete the test event
    eventManager.deleteEvent(customEvent.id);
    console.log('Test event deleted');
  } catch (error) {
    console.log(`Error creating test event: ${error.message}`);
  }
  console.log('');

  // 12. Export/Import demonstration
  console.log('🔄 Export/Import Example:');
  try {
    const eventsJson = eventManager.exportEvents();
    console.log(`Exported ${eventManager.events.size} events to JSON`);
    console.log(`JSON size: ${eventsJson.length} characters`);
    
    // Import would be done like this:
    // eventManager.importEvents(eventsJson);
    console.log('Import functionality available');
  } catch (error) {
    console.log(`Error with export/import: ${error.message}`);
  }
  console.log('');

  console.log('✅ Demo completed successfully!');
  console.log('🚀 Start the server with "npm start" to test the API endpoints');
}

// Run the demonstration
if (require.main === module) {
  demonstrateSeasonalEvents().catch(console.error);
}

module.exports = { demonstrateSeasonalEvents };