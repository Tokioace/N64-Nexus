import React from 'react';
import ReactDOM from 'react-dom/client';
import AchievementsScreen from './AchievementsScreen';

// Demo component to showcase the AchievementsScreen
const Demo: React.FC = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <AchievementsScreen />
    </div>
  );
};

// Render the demo
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Demo />);

export default Demo;