import React, { createContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import io, { Socket } from 'socket.io-client';
import Messages from './Messaging';
import Sidebar from './Sidebar';
import Footer from './Footer';

export const SocketContext = createContext<Socket | null>(null);
export const msgSocket = io('/');

const Inbox: React.FC = () => {
  return (
    <SocketContext.Provider value={msgSocket}>
      <div className='body-container' style={{ position: 'relative' }}>
        <Sidebar />
        <Footer />
      </div>
    </SocketContext.Provider>
  )
}

export default Inbox;
