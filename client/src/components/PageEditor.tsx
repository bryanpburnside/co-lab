import React, { useState, createContext, useEffect } from "react";
import STT from './STT';
import '../styles.css';
import { FaSave, FaTimesCircle, FaVolumeUp, FaEraser } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';
// import { TTSToggleContext } from './Stories';
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { io, Socket } from 'socket.io-client';

export const socket = io('/');
export const SocketContext = createContext<Socket | null>(null)

interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface PageEditorProps {
  page: Page;
  onSave: (content: string, autoSave: boolean) => void;
  onCancel: () => void;
  TooltipIcon: typeof TooltipIcon;
  roomId: string | undefined;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel, TooltipIcon, roomId }) => {
  const [content, setContent] = useState(page.content);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if(socket) {
      socket.emit('typing', {roomId, content: event.target.value});
    }
  };

  useEffect(() => {
    if (socket) {
      const handleTyping = (content: string) => {
        setContent(content);
      };
      socket.on('typing', handleTyping);
      return () => {
        //cleanup from typing
        socket.off('typing', handleTyping);
      };
    }
  }, []);

  const handleSave = () => {
    onSave(content, false);
  };

  const handleCancel = () => {
    onCancel();
  };

  //for transcribing data into the page
  const updateContentWithTranscript = (transcript: string) => {
    setContent((prevContent) => prevContent + ' ' + transcript);
  };

  const handleSpeakClick = () => {
    if (page && 'speechSynthesis' in window) {
      //cancel any other ongoing speech synthesis
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(page.content);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  };

  const handleClearContent = () => {
    setContent('');
  };

  //auto save functionality for collaborative editing
  useEffect(() => {
    const autoSave = setInterval(() => {
      onSave(content, true);
    }, 30000);
    return () => {
      clearInterval(autoSave);
    };
  }, [onSave]);

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block', top: '100px' }}>
        <GrammarlyEditorPlugin clientId='client_RZvMQYBxstbSeZEA6Ft7sA'>
          <textarea
            value={ content }
            onChange={ handleContentChange }
            maxLength={3000}
            rows={10}
            cols={50}
            style={{ width: '100%', height: '450px', padding: '15px' }}
          />
        </GrammarlyEditorPlugin>
        <FaTimesCircle
          style={{
            position: 'absolute',
            top: '-22px',
            right: '-45px',
            color: '#3d3983',
            backgroundColor: 'white',
            borderRadius: '100%'
          }}
          size={30}
          onClick={ handleCancel }
        />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: 0,
        display: 'flex',
        gap: '10px',
      }}>
        <TooltipIcon
          icon={ FaSave }
          tooltipText="Save"
          handleClick={ handleSave }
          style={{ top: '14px', fontSize: '34px'}}
        />
          <TooltipIcon
            icon={ FaEraser }
            tooltipText="Clear"
            handleClick={ handleClearContent }
            style={{ top: '14px', fontSize: '34px'}}
          />
        <TooltipIcon
          icon={ FaVolumeUp }
          tooltipText="TTY"
          handleClick={ handleSpeakClick }
          style={{ top: '14px', fontSize: '34px'}}
        />
        <STT updateTranscript={ updateContentWithTranscript } />
      </div>
    </div>
  </div>
  );

};

export default PageEditor;