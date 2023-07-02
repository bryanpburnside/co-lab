import React from 'react';
import styled from 'styled-components';

interface ArtItemProps {
  id: string;
  type: string;
  content: any;
}

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
`;

const ArtImage = styled.img`
  width: 90%;
  height: 90%;
  object-fit: cover;
`;

const ArtItem: React.FC<ArtItemProps> = ({ id, type, content }) => {
  return (
    <ImageContainer>
      <ArtImage src={content} alt={type} />
    </ImageContainer>
  );
}

export default ArtItem;
