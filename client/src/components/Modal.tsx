import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #3d3983;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 5px 5px 13px #343171,
    -5px -5px 13px #464195;
`;

const XIcon = styled.div`
  position: absolute;
  top: 2%;
  left: 87.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  z-index: 2;
`;


const Modal = ({ isOpen, onClose, roomId, userId, friendList, sendInvite }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer>
      <ModalContent>
        <XIcon onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
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