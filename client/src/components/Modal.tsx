import React from 'react';
import styled from 'styled-components';

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
  background-color: #3d3983;
  padding: 1rem;
  border: 4px solid white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Modal = ({ isOpen, onClose, friendList }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer>
      <ModalContent>
        <h2>Invite Friends</h2>
        {friendList.length ?
          friendList.map((friend: object, i: number) => <p key={i}>{friend.name}</p>)
          :
          null
        }
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;