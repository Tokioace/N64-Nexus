import React from 'react'

const TestApp: React.FC = () => {
  console.log('TestApp: Rendering test app')
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Test App is Working!</h1>
        <p>If you see this, React is mounting correctly.</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

export default TestApp