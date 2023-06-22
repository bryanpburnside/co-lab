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


const SenderBubble = styled.div`
  align-self: flex-start;
  background-color: #e5e5ea;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

const RecipientBubble = styled.div`
  align-self: flex-end;
  background-color: #007bff;
  color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
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
    // Scroll to the bottom of the conversation container when messages change
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
    <div>
      {userId}
      <ConversationContainer
        ref={conversationContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.senderId === userId ? (
              <SenderBubble>{msg.message}</SenderBubble>
            ) : (
              <RecipientBubble>{msg.message}</RecipientBubble>
            )}
          </div>
        ))}
      </ConversationContainer>
    </div>
  );
};

export default Thread;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';

// interface Message {
//   id: number;
//   senderId: string;
//   message: string;
//   sender: {
//     name: string;
//   };
// }

// const ConversationContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   overflow-y: auto;
// `;

// const SenderBubble = styled.div`
//   align-self: flex-start;
//   background-color: #e5e5ea;
//   border-radius: 10px;
//   padding: 10px;
//   margin-bottom: 10px;
// `;

// const RecipientBubble = styled.div`
//   align-self: flex-end;
//   background-color: #007bff;
//   color: #fff;
//   border-radius: 10px;
//   padding: 10px;
//   margin-bottom: 10px;
// `;

// const Thread = ({ userId, recipient }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState<string>('');
//   const conversationContainerRef = useRef<HTMLDivElement>(null);
//   const page = useRef<number>(1);
//   const hasMore = useRef<boolean>(true);

//   const getMessages = async () => {
//     try {
//       const response = await axios.get(`/messages/${userId}`, {
//         params: { page: page.current },
//       });
//       console.log(response.data);
//       const newMessages = response.data;
//       if (newMessages.length === 0) {
//         hasMore.current = false;
//         return;
//       }
//       setMessages((prevMessages) => [...prevMessages, ...newMessages]);
//       page.current++;
//     } catch (err) {
//       console.error('Failed to GET messages:', err);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       getMessages();
//     }
//   }, [userId]);

//   useEffect(() => {
//     // Scroll to the bottom of the conversation container when messages change
//     if (conversationContainerRef.current) {
//       conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleScroll = () => {
//     if (
//       conversationContainerRef.current &&
//       conversationContainerRef.current.scrollTop === 0 &&
//       hasMore.current
//     ) {
//       getMessages();
//     }
//   };

//   return (
//     <div>
//       {userId}
//       <ConversationContainer
//         ref={conversationContainerRef}
//         onScroll={handleScroll}
//       >
//         {messages.map((msg) => (
//           <div key={msg.id}>
//             {msg.senderId === userId ? (
//               <SenderBubble>{msg.message}</SenderBubble>
//             ) : (
//               <RecipientBubble>{msg.message}</RecipientBubble>
//             )}
//           </div>
//         ))}
//       </ConversationContainer>
//     </div>
//   );
// };

// export default Thread;



// // import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';
// // import styled from 'styled-components';

// // interface Message {
// //   id: number;
// //   senderId: string;
// //   message: string;
// //   sender: {
// //     name: string;
// //   };
// // }

// // const ConversationContainer = styled.div`
// //   display: flex;
// //   flex-direction: column;
// //   height: 100%;
// //   overflow-y: auto;
// // `;

// // const SenderBubble = styled.div`
// //   align-self: flex-start;
// //   background-color: #e5e5ea;
// //   border-radius: 10px;
// //   padding: 10px;
// //   margin-bottom: 10px;
// // `;

// // const RecipientBubble = styled.div`
// //   align-self: flex-end;
// //   background-color: #007bff;
// //   color: #fff;
// //   border-radius: 10px;
// //   padding: 10px;
// //   margin-bottom: 10px;
// // `;

// // const Thread = ({ userId, recipient }) => {
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [message, setMessage] = useState<string>('');
// //   const conversationContainerRef = useRef<HTMLDivElement>(null);

// //   const getMessages = async () => {
// //     try {
// //       const thread = await axios.get(`/messages/${userId}`);
// //       console.log(thread.data);
// //       setMessages(thread.data);
// //     } catch (err) {
// //       console.error('Failed to GET messages to client:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (userId) {
// //       getMessages();
// //     }
// //   }, [userId]);

// //   useEffect(() => {
// //     // Scroll to the bottom of the conversation container when messages change
// //     if (conversationContainerRef.current) {
// //       conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
// //     }
// //   }, [messages]);

// //   return (
// //     <div>
// //       {userId}
// //       <ConversationContainer ref={conversationContainerRef}>
// //         {messages.map((msg) => (
// //           <div key={msg.id}>
// //             {msg.senderId === userId ? (
// //               <SenderBubble>{msg.message}</SenderBubble>
// //             ) : (
// //               <RecipientBubble>{msg.message}</RecipientBubble>
// //             )}
// //           </div>
// //         ))}
// //       </ConversationContainer>
// //     </div>
// //   );
// // };

// // export default Thread;
