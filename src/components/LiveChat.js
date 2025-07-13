import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, TextInput, Button, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const LiveChat = ({ messages, onSendMessage }) => {
  const theme = useTheme();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.username === 'CurrentUser';
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <View style={styles.messageHeader}>
          <Text style={[
            styles.username,
            { color: isCurrentUser ? theme.colors.primary : theme.colors.accent }
          ]}>
            {message.username}
          </Text>
          <Text style={[styles.timestamp, { color: theme.colors.text }]}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
        
        <Text style={[
          styles.messageText,
          { color: theme.colors.text }
        ]}>
          {message.message}
        </Text>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <MaterialIcons name="chat" size={24} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Live Chat
          </Text>
          <View style={styles.liveIndicator}>
            <View style={[styles.liveDot, { backgroundColor: '#FF0000' }]} />
            <Text style={[styles.liveText, { color: '#FF0000' }]}>LIVE</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => renderMessage(message, index))
          ) : (
            <View style={styles.emptyChat}>
              <MaterialIcons
                name="chat-bubble-outline"
                size={48}
                color={theme.colors.text}
                style={styles.emptyChatIcon}
              />
              <Text style={[styles.emptyChatText, { color: theme.colors.text }]}>
                Noch keine Nachrichten
              </Text>
              <Text style={[styles.emptyChatSubtext, { color: theme.colors.text }]}>
                Starte die Unterhaltung!
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Schreibe eine Nachricht..."
            mode="outlined"
            style={styles.textInput}
            multiline
            maxLength={200}
            onSubmitEditing={handleSendMessage}
          />
          <Button
            mode="contained"
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            style={styles.sendButton}
            compact
          >
            <MaterialIcons name="send" size={16} color="#FFFFFF" />
          </Button>
        </View>
      </KeyboardAvoidingView>
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
  container: {
    height: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    // Note: In a real app, you'd add pulsing animation here
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  emptyChat: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 32,
  },
  emptyChatIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyChatSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});

export default LiveChat;