import React, { useState, useContext, useRef, createContext, useEffect } from "react";
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
}

export const TitlePage: React.FC<TitlePageProps> = ({ story, TooltipIcon, addNewPage }) => (
  <div
    style={{
      backgroundImage: `url(${story.coverImage})`,
      height: '700px', width: '500px',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}>
    <div style={{
        backgroundColor: '#fbf5df',
        height: '30px',
        maxWidth: 'calc(100% - 80px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 10px',
        marginTop: '10px',
        color: 'black',
        fontWeight: 'bolder',
        textAlign: 'center',
        margin: 'auto',
    }}>
      { story.title }
    </div>
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
      bottom: '10px'
    }}>
    <TooltipIcon
      icon={ FaPlusCircle }
      tooltipText="Add New Page"
      handleClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        addNewPage();
      }}
      style={{
        position: 'absolute',
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
