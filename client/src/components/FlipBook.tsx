import React, { useState, useEffect, useContext, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import STT from './STT';
import '../styles.css';
import { FaSave, FaTimesCircle, FaPlusCircle, FaVolumeUp, FaTools } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';
import { TTSToggleContext } from './Stories';
import Switch from "react-switch";
import axios from "axios";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import TitlePage from "./TitlePage";


interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface Story {
  id?: number;
  title: string;
  coverImage: any | null;
  numberOfPages: number | null;
}

interface PageEditorProps {
  page: Page;
  onSave: (content: string) => void;
  onCancel: () => void;
  TooltipIcon: typeof TooltipIcon;
}

//PageEditor component
const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel, TooltipIcon }) => {
  const [content, setContent] = useState(page.content);

  const { ttsOn } = useContext(TTSToggleContext);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSave = () => {
    onSave(content);
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


  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block', top: '145px' }}>
        <GrammarlyEditorPlugin clientId='client_RZvMQYBxstbSeZEA6Ft7sA'>
          <textarea
            value={ content }
            onChange={ handleContentChange }
            maxLength={310}
            rows={10}
            cols={50}
            style={{ width: '100%', height: '100%' }}
          />
        </GrammarlyEditorPlugin>
        <FaTimesCircle
          style={{
            position: 'absolute',
            top: '-30px',
            right: 0,
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
          style={{ top: '15px'}}
        />
        <TooltipIcon
          icon={ FaVolumeUp }
          tooltipText="TTY"
          handleClick={ handleSpeakClick }
          style={{ top: '15px'}}
        />
        <STT updateTranscript={ updateContentWithTranscript } />
      </div>
    </div>
  </div>
  );

};

interface FlipBookProps {
  story: Story;
  selectedStoryPages: Page[];
  onUpdatePage: (updatedPage: Page) => void;
  fetchPages: () => void;
  addNewPage: () => void;
  TooltipIcon: typeof TooltipIcon;
}

const FlipBook: React.FC<FlipBookProps> = ({ story, selectedStoryPages, onUpdatePage, fetchPages, addNewPage, TooltipIcon }) => {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isAutoReading, setIsAutoReading] = useState(false);

  const flipBookRef = useRef<any>(null);

  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
  };


  //save page after editing it
  const handleSavePage = async (content: string) => {
    if (selectedPage && story) {
      const existingPage = selectedStoryPages.find(page => page.page_number === selectedPage.page_number);
      let response;
  
      if (existingPage) {
        //update the existing page
        try {
          response = await fetch(`/api/pages/${existingPage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              id: existingPage.id,
            })
          });
        } catch (error) {
          console.error('Failed to update the page-client:', error);
          return;
        }
        if (!response.ok) {
          console.error('Failed to update the page-server:', await response.text());
          return;
        }
      }

      //update the pages to display the current info
      //map over selectedStoryPages looking for the page and set the content
      selectedStoryPages.map((page: any) => {
        if (existingPage && page.page_number === existingPage.page_number) {
          return { ...page, content: content };
        }
        return page;
      });
      fetchPages();
      setSelectedPage(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedPage(null);
  };

  //to read the pages
  const handleSpeakClick = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Cannot read the page');
    }
  };

  // const handleToggleAutoRead = () => {
  //   setIsAutoReading(!isAutoReading);
  //   if (window.speechSynthesis.speaking) {
  //     if (isAutoReading) {
  //       window.speechSynthesis.pause();
  //     } else {
  //       window.speechSynthesis.resume();
  //     }
  //   } else if (isAutoReading) {
  //     handleSpeakClick(selectedStoryPages[flipBookRef.current.pageIndex]?.content);
  //   }
  // };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     // Here we set the coverImage of the current story. This will be a local URL.
  //     // Remember, this URL will not be persistent and it will only be available in the current session.
  //     // You will have to send this image to the server to store it and get a persistent URL in a real application.
  //     // Also, remember to revoke this URL when it's not needed anymore.
  //     story.coverImage = url;
  //   }
  // }


  return (
    <>
    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
    <HTMLFlipBook
      ref={flipBookRef}
      size={"stretch"}
      minWidth={300}
      maxWidth={500}
      minHeight={300}
      maxHeight={500}
      drawShadow={true}
      flippingTime={500}
      usePortrait={false}
      startZIndex={0}
      autoSize={true}
      maxShadowOpacity={0}
      mobileScrollSupport={false}
      clickEventForward={true}
      swipeDistance={0}
      showPageCorners={false}
      disableFlipByClick={true}
      width={500}
      height={500}
      className={'my-flipbook'}
      startPage={1}
      showCover={true}
      useMouseEvents={true}
      // onFlip={(e: any) => {
      //   if (isAutoReading) {
      //     handleSpeakClick(selectedStoryPages[e.data]?.content);
      //   }
      // }}
      style={{
        backgroundColor: "#EADDCA",
        border: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        borderRadius: "5px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '100px'
      }}
    >
      {/* <div data-density="hard" className="title-page"
        style={{
          backgroundImage: `url(${story.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          width: '500px',
      }}>
        { story.title }
      </div> */}
      <TitlePage coverImage={ story.coverImage } title={ story.title } />
      {selectedStoryPages.map((page, index) => (
        <div key={index}>
          <div data-density="hard" className="page-container" onClick={() => handlePageClick(page)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              { index === selectedStoryPages.length - 1 && (
                <TooltipIcon
                  icon={ FaPlusCircle }
                  tooltipText="Add New Page"
                  handleClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    addNewPage();
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: '#3d3983',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                />
              )}
              <div onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleSpeakClick(page.content);
              }}>
                <FaVolumeUp
                  style={{
                    color: '#3d3983',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                  size={30}
                />
              </div>
            </div>
            <div className="pages" data-density="hard">
              { page.content }
            </div>
          </div>
        </div>
      ))}
      </HTMLFlipBook>
      {selectedPage && (
        <PageEditor
          page={ selectedPage }
          onSave={ handleSavePage }
          onCancel={ handleCancelEdit }
          TooltipIcon={ TooltipIcon }
        />
      )}
      </div>
    </>
  );
};

export default FlipBook;
