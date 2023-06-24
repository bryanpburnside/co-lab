import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { SocketContext } from './Inbox';
import styled from 'styled-components';

interface Message {
  id: number;
  senderId: string;
  message: string;
  sender: {
    name: string;
  };
}

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
`;

const BubbleContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const SenderBubble = styled.div`
  align-self: flex-end;
  background-color: #F06b80;
  min-width: 33%;
  text-align: right;
  margin-left: auto;
  color: #ffffff;
  border: 2px solid white;
  border-radius: 20px;
  padding: 10px;
  white-space: pre-wrap;
  font-size: 20px;
`;

const RecipientBubble = styled.div`
  align-self: flex-start;
  background-color: #3d3983;
  min-width: 33%;
  margin-right: auto;
  color: #fff;
  border: 2px solid white;
  border-radius: 20px;
  padding: 10px;
  white-space: pre-wrap;
  font-size: 20px;
`;

const Thread = ({ userId, receiverId, userList, setUserList }) => {
  const socket = useContext(SocketContext) as Socket;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  const getUserName = (userId: string) => {
    const user = userList.find((u) => u.id === userId);
    return user ? user.name : '';
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(`/messages/${userId}/${receiverId}`);
      const newMessages = response.data;
      console.log(newMessages);
      setMessages(newMessages);
    } catch (err) {
      console.error('Failed to GET messages:', err);
    }
  };

  const updateMessages = () => {
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
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '' || receiverId.trim() === '') return;

    socket.emit('directMessage', {
      senderId: userId,
      receiverId,
      message,
    });

    updateMessages();
    setMessage('');
  };

  useEffect(() => {
    if (userId && receiverId) {
      getMessages();
      socket.emit('joinThread', userId);

      socket.on('directMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.emit('disconnectThread', userId);
        socket.off();
      };
    }
  }, [receiverId]);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <ConversationContainer ref={conversationContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <BubbleContainer>
              {msg.senderId === userId ? (
                <SenderBubble>{msg.message}</SenderBubble>
              ) : (
                <RecipientBubble>{msg.message}</RecipientBubble>
              )}
            </BubbleContainer>
          </div>
        ))}
      </ConversationContainer>
      <div className="send-message">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default Thread;
