import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const EventTimer = ({ isActive, timeUntilNext, eventStatus }) => {
  const theme = useTheme();

  const getTimerColor = () => {
    switch (eventStatus) {
      case 'live':
        return '#FF0000';
      case 'starting-soon':
        return '#FF6B35';
      default:
        return '#4ECDC4';
    }
  };

  const getTimerText = () => {
    switch (eventStatus) {
      case 'live':
        return 'Event endet in:';
      case 'starting-soon':
        return 'Event startet in:';
      default:
        return 'Nächstes Event in:';
    }
  };

  const getTimerIcon = () => {
    switch (eventStatus) {
      case 'live':
        return 'timer';
      case 'starting-soon':
        return 'schedule';
      default:
        return 'event';
    }
  };

  const getMessage = () => {
    if (eventStatus === 'ended') {
      return 'Danke fürs Mitmachen! Nächster Speedrun am Samstag.';
    }
    return null;
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <MaterialIcons 
            name={getTimerIcon()} 
            size={32} 
            color={getTimerColor()} 
            style={styles.icon}
          />
          
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {getTimerText()}
            </Text>
            
            <Text style={[styles.timeDisplay, { color: getTimerColor() }]}>
              {timeUntilNext}
            </Text>
            
            {getMessage() && (
              <Text style={[styles.message, { color: theme.colors.text }]}>
                {getMessage()}
              </Text>
            )}
          </View>
        </View>
        
        {isActive && (
          <View style={styles.pulseDot}>
            <View style={[styles.pulse, { backgroundColor: '#FF0000' }]} />
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  message: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  pulseDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    // Note: In a real app, you'd add animation here
  },
});

export default EventTimer;