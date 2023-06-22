import React, { createContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import io, { Socket } from 'socket.io-client';
import Messages from './Messaging';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styled from 'styled-components';

const BodyContainer = styled.div`
  background-color: #3d3983;
  display: flex;
  justify-content: space-between;
  width: 80vw;
  margin: 0 auto;
  height: 60vh;
`;

export const SocketContext = createContext<Socket | null>(null);
export const msgSocket = io('/');

const Inbox: React.FC = () => {
  return (
    <SocketContext.Provider value={msgSocket}>
      <BodyContainer>
        <Sidebar />
        <Footer />
      </BodyContainer>
    </SocketContext.Provider>
  )
}

export default Inbox;
