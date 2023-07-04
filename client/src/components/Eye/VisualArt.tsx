import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect, createContext } from 'react';
import Draw from './Sketch';
import RandomPattern from './RandomPattern';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { v4 as generatePeerId } from 'uuid';

export const socket = io('/');
export const SocketContext = createContext<Socket | null>(null);
const peers = {};

const ActiveComponent = {
  DrawMode: 0,
  PatternMode: 1
};

const VisualArt: React.FC = () => {
  const { user } = useAuth0();
  const { roomId } = useParams<string>();
  const [peerId, setPeerId] = useState('');
  const { DrawMode, PatternMode } = ActiveComponent;
  const [mode, setMode] = useState(DrawMode);
  const [backgroundColor, setBackgroundColor] = useState('#3d3983');

  useEffect(() => {
    setPeerId(generatePeerId());
    const peer = new Peer(peerId as string, {
      host: '/',
      port: 8001,
    })

    const myAudio = document.createElement('audio')
    myAudio.muted = true

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(stream => {
      addAudioStream(myAudio, stream);

      peer.on('call', call => {
        call.answer(stream);
        const audio = document.createElement('audio')
        call.on('stream', userStream => {
          addAudioStream(audio, userStream)
        })
      })

      socket.on('userJoined', userId => {
        connectToNewUser(userId, stream)
      })
    })

    function connectToNewUser(userId, stream) {
      const call = peer.call(userId, stream);
      const audio = document.createElement('audio')
      call.on('stream', userStream => {
        addAudioStream(audio, userStream);
      });
      call.on('close', () => {
        audio.remove();
      })
      peers[userId] = call;
    }

    function addAudioStream(audio, stream) {
      audio.srcObject = stream;
      audio.addEventListener('loadedmetadata', () => {
        audio.play();
      })
    }
    socket.emit('createRoom', peerId, roomId);

    peer.on('open', (userId) => {
      socket.emit('joinRoom', userId, roomId);
    })

    socket.on('roomCreated', (userId, roomId) => {
      console.log(`${userId} created room: ${roomId}`);
    });

    socket.on('userJoined', (userId) => {
      console.log(`User ${userId} joined the room`);
    });

    socket.on('disconnectUser', userId => {
      if (peers[userId]) {
        peers[userId].close();
      }
    })

    return () => {
      socket.emit('disconnectUser', peerId, roomId);
      socket.disconnect();
      peer.disconnect();
    };
  }, []);

  const handleBackgroundColorChange = (e: any) => {
    const { value } = e.target;
    setBackgroundColor(value);
  };

  const renderComponent = () => {
    switch (mode) {
      case PatternMode:
        return <SocketContext.Provider value={socket}><RandomPattern backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} roomId={roomId} /></SocketContext.Provider>;
      case DrawMode:
        return <SocketContext.Provider value={socket}><Draw backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} roomId={roomId} /></SocketContext.Provider>;
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
