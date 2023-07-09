import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ArtItemProps {
  id: string;
  type: string;
  content: any;
  onClick: () => void;
}

const ArtItemContainer = styled.div`
  flex: 1 0 33%;
  max-width: 200px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  padding-bottom: 25%;
`;

const ArtImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 4px solid white;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
`;

const ArtItem: React.FC<ArtItemProps> = ({
  id,
  type,
  content,
  onClick
}) => {
  return (
    <>
      {content && (
        <ArtItemContainer onClick={() => onClick(id)}>
          <ArtImage src={content} alt={type} />
        </ArtItemContainer>
      )}
    </>
  );
};

export default ArtItem;