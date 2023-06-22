import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { SocketContext } from './Inbox';
import { useAuth0 } from '@auth0/auth0-react';
interface Message {
  id: number;
  senderId: string;
  message: string;
  sender: {
    name: string;
  };
}

const Messages: React.FC<Message> = () => {
  const socket = useContext(SocketContext) as Socket;
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [userList, setUserList] = useState<{ id: string; name: string }[]>([]);
  const [receiverId, setReceiverId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [matchedUsers, setMatchedUsers] = useState<{ id: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const receiverInputRef = useRef<HTMLInputElement>(null);

  const getMessages = async () => {
    try {
      const thread = await axios.get(`/messages/${userId}`);
      console.log(thread.data);
      setMessages(thread.data);
    } catch (err) {
      console.error('Failed to GET messages to client:', err);
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUserList(response.data);
    } catch (err) {
      console.error('Failed to GET user list:', err);
    }
  }

  useEffect(() => {
    setUserId(user?.sub);
  }, [user])

  useEffect(() => {
    if (userId) {
      getMessages();
      getUsers();

      socket.emit('joinThread', userId);

      socket.on('directMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.emit('disconnectThread', userId);
        socket.off();
      };
    }
  }, [userId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '' || receiverId.trim() === '') return;

    socket.emit('directMessage', {
      senderId: userId,
      receiverId,
      message,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        senderId: userId,
        message,
        sender: {
          name: getUserName(userId),
        },
      },
    ]);

    setMessage('');
    setReceiverId('');
    setShowSuggestions(false);
  };

  const handleReceiverChange = (e) => {
    const selectedName = e.target.value;
    setReceiverId(selectedName);

    const matched = userList.filter((user) =>
      user.name.toLowerCase().includes(selectedName.toLowerCase())
    );
    setMatchedUsers(matched);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (userId: string) => {
    const selectedUser = userList.find((user) => user.id === userId);
    if (selectedUser) {
      setReceiverId(selectedUser.id);
      setMatchedUsers([]);
      setShowSuggestions(false);
      receiverInputRef.current?.focus();
    }
  };

  const getUserName = (userId: string) => {
    const user = userList.find((u) => u.id === userId);
    return user ? user.name : '';
  };

  return (
    <div>
      <h2>Inbox</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <span>{msg.sender.name}:</span> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={getUserName(receiverId)}
            onChange={handleReceiverChange}
            onFocus={() => setShowSuggestions(true)}
            ref={receiverInputRef}
            placeholder="Type a name"
          />
          {showSuggestions && matchedUsers.length > 0 && (
            <ul style={suggestionsListStyle}>
              {matchedUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSuggestionClick(user.id)}
                  style={suggestionItemStyle}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const suggestionsListStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 1,
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '4px',
  margin: 0,
  listStyle: 'none',
  maxHeight: '200px',
  overflowY: 'auto',
};

const suggestionItemStyle = {
  cursor: 'pointer',
  padding: '4px',
  color: 'black'
};

export default Messages;




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

// const Messages = () => {
//   const { user } = useAuth0();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState<string>('');
//   const [userList, setUserList] = useState<{ id: string; name: string }[]>([]);
//   const [receiverId, setReceiverId] = useState<string>('');
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

//   const getUsers = async () => {
//     try {
//       const response = await axios.get('/users');
//       setUserList(response.data);
//     } catch (err) {
//       console.error('Failed to GET user list:', err);
//     }
//   }

//   useEffect(() => {
//     setUserId(user?.sub);
//   }, [user])

//   useEffect(() => {
//     if (userId) {
//       getMessages();
//       getUsers();

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

//   const sendMessage = async (e) => {
//     e.preventDefault();

//     if (message.trim() === '' || receiverId.trim() === '') return;

//     socket.emit('directMessage', {
//       senderId: userId,
//       receiverId,
//       message,
//     });

//     setMessage('');
//     setReceiverId('');
//   };

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
//         <select
//           value={receiverId}
//           onChange={(e) => setReceiverId(e.target.value)}
//         >
//           <option value="">Select user</option>
//           {userList.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.name}
//             </option>
//           ))}
//         </select>
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

// export default Messages;
