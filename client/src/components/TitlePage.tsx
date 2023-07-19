import React from "react";
import { FaPlusCircle } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';

interface Story {
  id?: number;
  title: string;
  coverImage: any | null;
  numberOfPages: number | null;
}

interface TitlePageProps {
  story: Story;
  TooltipIcon: typeof TooltipIcon;
  addNewPage: () => void;
  titleColor: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ story, TooltipIcon, addNewPage, titleColor }) => {

  return (
    <div
      style={{
        backgroundImage: `url(${story.coverImage || 'https://res.cloudinary.com/dhin8tgv1/image/upload/v1689349895/cgdztp7ma8eqxivjsd5r.png'})`,
        height: '100%',
        width: '500px',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Title and Color Picker */}
      <div
        style={{
          backgroundColor: 'transparent',
          height: '30px',
          maxWidth: 'calc(100% - 80px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 10px',
          color: titleColor,
          fontWeight: 'bolder',
          fontSize: '32px',
          textAlign: 'center',
          margin: 'auto',
          marginTop: '50px'
        }}
      >
        { story.title }
        </div>
      {/* Add New Page Icon */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '10px',
          transform: 'translate(-50%, 0)',
        }}
      >
        <TooltipIcon
          icon={ FaPlusCircle }
          tooltipText="Add New Page"
          handleClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            addNewPage();
          }}
          style={{
            color: '#3d3983',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '5px',
            paddingBottom: '2px',
            margin: '5px'
          }}
        />
      </div>
    </div>
  );
};

export default TitlePage;
