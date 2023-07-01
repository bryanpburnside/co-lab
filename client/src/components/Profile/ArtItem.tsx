import React from 'react';

interface ArtItemProps {
  id: string;
  type: string;
  content: any;
}

const ArtItem: React.FC<ArtItemProps> = ({ id, type, content }) => {
  return (
    <div key={id}>
      <img src={content} alt={type} />
    </div>
  );
}

export default ArtItem;