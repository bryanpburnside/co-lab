import React from 'react';
import styled, { css } from 'styled-components';

interface ArtItemProps {
  id: string;
  type: string;
  content: any;
  hoveredArtwork: string | null;
  onMouseOver: () => void;
  onMouseOut: () => void;
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

  &:hover {
    /* Add any hover styles here */
  }
`;

const ArtImage = styled.img<{ isHovered: boolean }>`
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

  ${({ isHovered }) =>
    isHovered &&
    css`
      transform: scale(1.2);
    `}
`;

const ArtItem: React.FC<ArtItemProps> = ({
  id,
  type,
  content,
  hoveredArtwork,
  onMouseOver,
  onMouseOut,
}) => {
  return (
    <>
      {content && (
        <ArtItemContainer
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        >
          <ArtImage src={content} alt={type} isHovered={hoveredArtwork === id} />
        </ArtItemContainer>
      )}
    </>
  );
};

export default ArtItem;


// import React from 'react';
// import styled, { css } from 'styled-components';

// interface ArtItemProps {
//   id: string;
//   type: string;
//   content: any;
//   hoveredArtwork: string | null;
// }

// const ArtItemContainer = styled.div`
//   flex: 1 0 33%;
//   max-width: 200px;
//   margin: 10px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   position: relative;
//   padding-bottom: 25%;
// `;

// const ArtImage = styled.img<{ isHovered: boolean }>`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 10px;
//   border: 4px solid white;
//   object-fit: cover;
//   object-position: center;
//   transition: transform 0.3s ease;

//   ${({ isHovered }) =>
//     isHovered &&
//     css`
//       transform: scale(1.2);
//     `}
// `;

// const ArtItem: React.FC<ArtItemProps> = ({ id, type, content, hoveredArtwork }) => {
//   return (
//     <>
//       {content && (
//         <ArtItemContainer>
//           <ArtImage src={content} alt={type} isHovered={hoveredArtwork === id} />
//         </ArtItemContainer>
//       )}
//     </>
//   );
// };

// export default ArtItem;
