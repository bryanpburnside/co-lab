// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { useAuth0 } from '@auth0/auth0-react';

// const socket = io('/');
// interface Message {
//   id: number;
//   senderId: string;
//   message: string;
//   sender: {
//     name: string;
//   };
// }

// const V1Messages = () => {
//   const { user } = useAuth0();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState<string>('');
//   const [receiverId, setReceiverId] = useState<string>('google-oauth2|104097737553983109767');
//   const [userId, setUserId] = useState<string | undefined>(user?.sub);

//   const getMessages = async () => {
//     try {
//       const thread = await axios.get(`/messages/${userId}`);
//       console.log(thread.data);
//       setMessages(thread.data);
//     } catch (err) {
//       console.error('Failed to GET messages to client:', err);
//     }
//   }

//   useEffect(() => {
//     setUserId(user?.sub);
//   }, [user])

//   useEffect(() => {
//     if (userId) {
//       getMessages();

//       socket.emit('joinThread', userId);

//       socket.on('directMessage', (newMessage) => {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       });

//       return () => {
//         socket.emit('disconnectThread', userId);
//         socket.off();
//       };
//     }
//   }, [userId]);

  // const sendMessage = async (e) => {
  //   e.preventDefault();

  //   if (message.trim() === '') return;

  //   socket.emit('directMessage', {
  //     senderId: userId,
  //     receiverId,
  //     message,
  //   });

  //   setMessage('');
  // };

//   return (
//     <div>
//       <h2>Inbox</h2>
//       <div>
//         {messages.map((msg) => (
//           <div key={msg.id}>
//             <span>{msg.sender.name}:</span> {msg.message}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default V1Messages;