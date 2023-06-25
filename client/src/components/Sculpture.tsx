import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client';
import GenerativeArt from "./GenerativeArt";
// import { Canvas } from '@react-three/fiber';
// import { PerspectiveCamera, PositionalAudio, Sphere, Plane, Box} from '@react-three/drei'
// import Peer from 'peerjs';

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { roomId } = useParams();
  const socket = io('/');


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

  return (
      <GenerativeArt />
  );
};

export default Sculpture;