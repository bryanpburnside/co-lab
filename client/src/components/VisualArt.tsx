import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from 'react';
import Draw from './Draw';
import RandomPattern from './RandomPattern';
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client';

enum ActiveComponent {
  DrawMode,
  PatternMode
}

const VisualArt: React.FC = () => {
  const { user } = useAuth0();
  const { roomId } = useParams();
  const socket = io('http://localhost:8000');
  const { DrawMode, PatternMode } = ActiveComponent;
  const [mode, setMode] = useState<ActiveComponent>(DrawMode);
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
  }

  return (
    <div>
      <label htmlFor="mode">Select a Mode</label>
      <div id="mode">
        <button onClick={() => setMode(DrawMode)}>Drawing</button>
        <button onClick={() => setMode(PatternMode)}>Pattern</button>
      </div>
      {renderComponent()}
    </div>
  )
}

export default VisualArt;
