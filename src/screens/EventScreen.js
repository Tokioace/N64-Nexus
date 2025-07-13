import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import EventHeader from '../components/EventHeader';
import EventTimer from '../components/EventTimer';
import TimeSubmission from '../components/TimeSubmission';
import Leaderboard from '../components/Leaderboard';
import LiveChat from '../components/LiveChat';
import EventHistory from '../components/EventHistory';
import { useEventTimer } from '../hooks/useEventTimer';
import { mockEventData } from '../utils/mockData';

const EventScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  
  const { isEventActive, timeUntilNext, eventStatus } = useEventTimer();

  // Mock current event data
  const currentEvent = mockEventData.currentEvent;

  useEffect(() => {
    // Load initial data
    loadSubmissions();
    loadChatMessages();
  }, []);

  const loadSubmissions = async () => {
    // In a real app, this would fetch from your backend
    setSubmissions(mockEventData.submissions);
  };

  const loadChatMessages = async () => {
    // In a real app, this would fetch from your backend
    setChatMessages(mockEventData.chatMessages);
  };

  const handleTimeSubmission = (submissionData) => {
    const newSubmission = {
      id: Date.now().toString(),
      username: 'CurrentUser', // Would come from auth context
      time: submissionData.time,
      region: submissionData.region,
      comment: submissionData.comment,
      imageUri: submissionData.imageUri,
      timestamp: new Date().toISOString(),
    };

    setSubmissions(prev => [...prev, newSubmission].sort((a, b) => {
      const timeA = parseFloat(a.time.replace(':', ''));
      const timeB = parseFloat(b.time.replace(':', ''));
      return timeA - timeB;
    }));

    Alert.alert('Erfolg!', 'Deine Zeit wurde erfolgreich eingereicht!');
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now().toString(),
      username: 'CurrentUser',
      message: message,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([loadSubmissions(), loadChatMessages()])
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, []);

  const filteredSubmissions = selectedRegion === 'ALL' 
    ? submissions 
    : submissions.filter(sub => sub.region === selectedRegion);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <EventHeader 
          event={currentEvent} 
          isActive={isEventActive}
          eventStatus={eventStatus}
        />
        
        <EventTimer 
          isActive={isEventActive}
          timeUntilNext={timeUntilNext}
          eventStatus={eventStatus}
        />

        {isEventActive && (
          <TimeSubmission 
            onSubmit={handleTimeSubmission}
            currentGame={currentEvent.game}
          />
        )}

        <Leaderboard
          submissions={filteredSubmissions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />

        {isEventActive && (
          <LiveChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        )}

        <EventHistory />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default EventScreen;