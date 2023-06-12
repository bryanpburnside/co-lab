import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Peer from 'peerjs';
import { useParams } from 'react-router-dom'

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (user) {
    const peer = new Peer(user.sub as string, {
      host: '/',
      port: 3001,
    });
  }

  return (
      <div>
        
      </div>
  );
};

export default Sculpture;