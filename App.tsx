import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import EventScreen from './src/screens/EventScreen';
import CameraScreen from './src/screens/CameraScreen';
import VideoScreen from './src/screens/VideoScreen';
import SubmissionScreen from './src/screens/SubmissionScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Context
import { EventProvider } from './src/context/EventContext';
import { MediaProvider } from './src/context/MediaContext';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <EventProvider>
            <MediaProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#1a1a2e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'Battle64' }}
                  />
                  <Stack.Screen 
                    name="Event" 
                    component={EventScreen} 
                    options={{ title: 'Event Details' }}
                  />
                  <Stack.Screen 
                    name="Camera" 
                    component={CameraScreen} 
                    options={{ title: 'Screenshot Capture' }}
                  />
                  <Stack.Screen 
                    name="Video" 
                    component={VideoScreen} 
                    options={{ title: 'Video Recording' }}
                  />
                  <Stack.Screen 
                    name="Submission" 
                    component={SubmissionScreen} 
                    options={{ title: 'Submit Proof' }}
                  />
                  <Stack.Screen 
                    name="Leaderboard" 
                    component={LeaderboardScreen} 
                    options={{ title: 'Leaderboard' }}
                  />
                  <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen} 
                    options={{ title: 'Settings' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </MediaProvider>
          </EventProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}