import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #3d3983;
  padding: 1rem;
  border: 4px solid white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const XIcon = styled.div`
  position: absolute;
  top: -10%;
  left: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  clip-path: circle();
  background-color: #F06b80;
`;


const Modal = ({ isOpen, onClose, roomId, userId, friendList, sendInvite }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer>
      <ModalContent>
        <XIcon onClick={onClose}>
          <FontAwesomeIcon icon={faCircleXmark} size='lg' />
        </XIcon>
        <h2>Invite Friends</h2>
        {friendList.length ?
          friendList.map((friend: object, i: number) => <p
            key={i}
            onClick={() => { sendInvite(userId, friend.id, `http://co-lab.group/visualart/${roomId}`) }}
          >{friend.name}</p>)
          :
          null
        }
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;