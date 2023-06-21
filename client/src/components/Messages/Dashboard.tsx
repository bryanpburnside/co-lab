// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import { useAuth0 } from '@auth0/auth0-react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const Dashboard = () => {
//   const { user, isAuthenticated } = useAuth0();
//   const [roomId, setRoomId] = useState('');
//   const socket = io('/');

//   const generateRoomId = async (endpoint: any) => {
//     try {
//       if (user) {
//         const response = await axios.post('/api/rooms', { userId: user.sub });
//         const { userId, roomId } = response.data;
//         setRoomId(roomId);
//         socket.emit('createRoom', userId, roomId);
//       }
//     } catch (err) {
//       console.error('Failed to generate room ID', err);
//     }
//   };

//   useEffect(() => {
//     socket.on('message', () => {
//       socket.emit('messageSent',)
//       console.log(`you connected with id ${socket.id}`);
//     });
//     // socket.emit('c')
//     // socket.on('directMessage', ({ content, to }) => {
//     //   console.log(`${userId} sent ${message}`);
//     // })
//     return () => {
//       socket.emit('message', user?.sub);
//     }
//   }, []);

//   return (
//     <>
//       {user ? user.sub : 'no user'}
//       <Sidebar />
//     </>
//   )
// }

// export default Dashboard;
