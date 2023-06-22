import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  senderId: string;
  message: string;
  sender: {
    name: string;
  };
}

const Thread = ({ userId, recipient }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  const getMessages = async () => {
    try {
      const thread = await axios.get(`/messages/${userId}`);
      console.log(thread.data);
      setMessages(thread.data);
    } catch (err) {
      console.error('Failed to GET messages to client:', err);
    }
  }

  useEffect(() => {
    if (userId) {
      getMessages();
    }
  }, [userId])

  return (
    <div>
      {userId}
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <span>{msg.sender.name}:</span> {msg.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Thread;
