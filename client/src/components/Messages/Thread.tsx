import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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

const Thread = ({ userId, recipient }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);

  const getMessages = async () => {
    try {
      const response = await axios.get(`/messages/${userId}`, {
        params: { page: page.current },
      });
      console.log(response.data);
      const newMessages = response.data;
      if (newMessages.length === 0) {
        hasMore.current = false;
        return;
      }
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      page.current++;
    } catch (err) {
      console.error('Failed to GET messages:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      getMessages();
    }
  }, [userId]);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (
      conversationContainerRef.current &&
      conversationContainerRef.current.scrollTop === 0 &&
      hasMore.current
    ) {
      getMessages();
    }
  };

  return (
    <>
      <ConversationContainer
        ref={conversationContainerRef}
        onScroll={handleScroll}
      >
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
    </>
  );
};

export default Thread;
