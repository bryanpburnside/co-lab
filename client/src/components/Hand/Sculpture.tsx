import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect, createContext } from "react";
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client';
import GenerativeArt from "./GenerativeArt";
import Modal from '../Modal';
import axios from 'axios';
import Peer, { MediaConnection } from 'peerjs';
import {v4 as generatePeerId} from 'uuid';
import p5 from 'p5';

export const socket = io('/', {
  withCredentials: true
});
export const SocketContext = createContext<Socket | null>(null)

const peers = {};

const Sculpture = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [peerId, setPeerId] = useState('');
  const { roomId } = useParams();
  const [currentCollaborators, setCurrentCollaborators] = useState<Array<Object>>([]);
  const [userImages, setUserImages] = useState<Array<Object>>([]);
  const [friendList, setFriendList] = useState<Object[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  let currentUser: string;

  useEffect(() => {
    setPeerId(generatePeerId());
    const peer = new Peer(peerId as string, {
      host: '/',
      port: 8001,
    })

    const myAudio = document.createElement('audio')
    myAudio.muted = true

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(stream => {
      addAudioStream(myAudio, stream);

      peer.on('call', call => {
        call.answer(stream);
        const audio = document.createElement('audio')
        call.on('stream', userStream => {
          addAudioStream(audio, userStream)
        })
      })

      socket.on('userJoined', userId => {
        connectToNewUser(userId, stream)
      })
    })

    function connectToNewUser(userId, stream) {
      const call = peer.call(userId, stream);
      const audio = document.createElement('audio')
      call.on('stream', userStream => {
        addAudioStream(audio, userStream);
      });
      call.on('close', () => {
        audio.remove();
      })
      peers[userId] = call;
    }

    function addAudioStream(audio, stream) {
      audio.srcObject = stream;
      audio.addEventListener('loadedmetadata', () => {
        audio.play();
      })
    }
    socket.emit('createRoom', peerId, roomId);

    peer.on('open', (userId) => {
      socket.emit('joinRoom', userId, roomId);
    })

    socket.on('roomCreated', (userId, roomId) => {
      console.log(`${userId} created room: ${roomId}`);
    });

    socket.on('userJoined', (userId) => {
      console.log(`User ${userId} joined the room`);
    });

    // socket.on('disconnectUser', userId => {
    //   if (peers[userId]) {
    //     peers[userId].close();
    //   }
    // })

    // // Clean up event listeners
    // return () => {
    //   socket.emit('disconnectUser', peerId, roomId);
    //   socket.disconnect();
    //   peer.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (user?.sub) {
      currentUser = user?.sub;
    }
    const getUserImageAndSendInfo = async () => {
      if (user?.sub) {
        try {
          const { userId, picture } = await getUserImage(user?.sub);
          setCurrentCollaborators(prevCollaborators => [...prevCollaborators, { userId, picture }])
          socket.emit('sendUserInfo', { userId, picture, roomId });
        } catch (err) {
          console.error('Failed to GET user image at client:', err);
        }
      }
    };

    getUserImageAndSendInfo();

    socket.on('userInfoReceived', ({ userId, collaborators, roomId }) => {
      setCurrentCollaborators(collaborators);
      console.log(collaborators);
    });

    socket.on('collaboratorDisconnected', (userId, roomId) => {
      setCurrentCollaborators((prevCollaborators) =>
        prevCollaborators.filter((collaborator) => collaborator['userId'] !== userId)
      );
    });

    return () => {
      socket.emit('collaboratorDisconnect', currentUser, roomId);
    };
  }, [user?.sub]);

  const getUserImage = async (userId: string) => {
    try {
      const { data } = await axios.get(`/users/${userId}`);
      const collaborator = {
        userId,
        picture: data.picture
      }
      return collaborator;
    } catch (err) {
      console.error('Failed to GET user images at client:', err);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = async () => {
    try {
      setIsModalOpen(true);
      await getFriends();
    } catch (err) {
      console.error('Failed to send invite at client:', err);
    }
  }

  const getFriends = async () => {
    try {
      setIsModalOpen(true);
      const { data } = await axios.get(`/users/${user?.sub}`);
      const friends = await Promise.all(
        data.friends.map(async (friendId: string) => {
          const userObj = await axios.get(`/users/${friendId}`);
          return { name: userObj.data.name, id: friendId };
        }))
      setFriendList(friends);
    } catch (err) {
      console.error('Failed to GET user friends at client:', err);
    }
  }

  const sendInvite = async (senderId: string, receiverId: string, message: string) => {
    socket.emit('directMessage', {
      senderId,
      receiverId,
      message,
    });
  }

  return (
    <SocketContext.Provider value={socket}>
      <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          roomId={roomId} userId={user?.sub}
          friendList={friendList}
          sendInvite={sendInvite}
        />
      <GenerativeArt 
      roomId={roomId} 
      openModal={openModal}
      currentCollaborators={currentCollaborators}
      />
    </SocketContext.Provider>
  );
};

export default Sculpture;