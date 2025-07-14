import React from 'react';
import FreundeslisteScreen from './FreundeslisteScreen';
import './App.css';

function App() {
  const handleInviteToSpeedrun = (friendId: string) => {
    console.log(`Speedrun invitation sent to friend: ${friendId}`);
    // Here you would typically make an API call to send the invitation
  };

  const handleAddFriend = (code: string) => {
    console.log(`Adding friend with code: ${code}`);
    // Here you would typically make an API call to add the friend
  };

  return (
    <div className="App">
      <FreundeslisteScreen
        onInviteToSpeedrun={handleInviteToSpeedrun}
        onAddFriend={handleAddFriend}
      />
    </div>
  );
}

export default App;