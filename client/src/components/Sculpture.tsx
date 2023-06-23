import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect, createContext } from "react";
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client';
import GenerativeArt from "./GenerativeArt";
// import { Canvas } from '@react-three/fiber';
// import { PerspectiveCamera, PositionalAudio, Sphere, Plane, Box} from '@react-three/drei'
import Peer from 'peerjs';
import p5 from 'p5';
export const socket = io('/');
export const SocketContext = createContext<Socket | null>(null)

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { roomId } = useParams();
  // const peer = new Peer(user?.nickname as string, {
  //   host: '/',
  //   port: 8001,
  // })

  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  })

  useEffect(() => {
    // socket.on('roomCreated', (userId, roomId) => {
    //   console.log(`${userId} created room: ${roomId}`);
    // });

    // socket.on('userJoined', (userId) => {
    //   socket.emit('logJoinUser', userId);
    //   console.log(`User ${userId} joined the room`);
    // });

    // socket.on('userLeft', (userId) => {
    //   console.log(`User ${userId} left the room`);
    // });

    // // Emit mouse movement event
    // const handleMouseMove = (event: MouseEvent) => {
    //   const { clientX, clientY } = event;
    //   const data = { x: clientX, y: clientY }
    //   socket.emit('mouseMove', data, roomId);
    // };

    // // Emit mouse click event
    // const handleMousePress = (event: MouseEvent) => {
    //   const { clientX, clientY } = event;
    //   const data = { x: clientX, y: clientY }
    //   socket.emit('mousePress', data, roomId);
    // };

    // const handleMouseRelease = (event: MouseEvent) => {
    //   const { clientX, clientY } = event;
    //   const data = { x: clientX, y: clientY }
    //   socket.emit('mouseRelease', data, roomId);
    // };

    // // Emit key press event
    // const handleKeyPress = (event: KeyboardEvent) => {
    //   const { key } = event;
    //   socket.emit('keyPress', key, roomId);
    // };

    // Add event listeners
    // window.addEventListener('mousemove', handleMouseMove);
    // window.addEventListener('mousedown', handleMousePress);
    // window.addEventListener('mouseup', handleMouseRelease);
    // window.addEventListener('keypress', handleKeyPress);

    // Clean up event listeners
    // return () => {
      // window.removeEventListener('mousemove', handleMouseMove);
      // window.removeEventListener('mousedown', handleMousePress);
      // window.removeEventListener('mouseup', handleMouseRelease);
      // window.removeEventListener('keypress', handleKeyPress);
      // socket.emit('disconnectUser', user?.sub);
      // socket.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <GenerativeArt roomId={roomId} />
    </SocketContext.Provider>
  );
};

export default Sculpture;