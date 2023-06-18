import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
// import Peer from 'peerjs';
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, PositionalAudio, Sphere, Plane, Box} from '@react-three/drei'
import GenerativeArt from "./GenerativeArt";

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { roomId } = useParams();
  const socket = io('http://localhost:8000');


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