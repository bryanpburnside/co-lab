import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from 'react';
import Draw from './Sketch';
import RandomPattern from './RandomPattern';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const ActiveComponent = {
  DrawMode: 0,
  PatternMode: 1
};

const VisualArt: React.FC = () => {
  const { user } = useAuth0();
  const { roomId } = useParams();
  const socket = io('http://localhost:8000');
  const { DrawMode, PatternMode } = ActiveComponent;
  const [mode, setMode] = useState(DrawMode);
  const [backgroundColor, setBackgroundColor] = useState('#3d3983');

  useEffect(() => {
    socket.on('roomCreated', (userId, roomId) => {
      console.log(`${userId} created room: ${roomId}`);
    });

    socket.on('userJoined', (userId) => {
      socket.emit('logJoinUser', userId);
      console.log(`User ${userId} joined the room`);
    });

    socket.on('userLeft', (userId) => {
      console.log(`User ${userId} left the room`);
    });

    // Clean up the socket.io connection when the component unmounts
    return () => {
      socket.emit('disconnectUser', user?.sub);
      socket.disconnect();
    };
  }, [roomId]);

  const handleBackgroundColorChange = (e: any) => {
    const { value } = e.target;
    setBackgroundColor(value);
  };

  const renderComponent = () => {
    switch (mode) {
      case PatternMode:
        return <RandomPattern backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} />;
      case DrawMode:
        return <Draw backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} />;
    }
  };

  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  margin: '0 5px 5px',
                  background: mode === DrawMode ? '#3273dc' : '#e4e4e4',
                  color: mode === DrawMode ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
                onClick={() => setMode(DrawMode)}
              >
                sketch
              </button>
              <button
                style={{
                  margin: '0 5px 5px',
                  background: mode === PatternMode ? '#3273dc' : '#e4e4e4',
                  color: mode === PatternMode ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
                onClick={() => setMode(PatternMode)}
              >
                random pattern
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>{renderComponent()}</div>
    </>
  )
}

export default VisualArt;
