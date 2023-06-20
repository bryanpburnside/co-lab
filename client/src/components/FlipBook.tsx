import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import '../styles.css';

interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface Story {
  id?: number;
  title: string;
  coverImage: File | null;
  numberOfPages: number | null;
}

//PageEditor component
const PageEditor: React.FC<{ page: Page, onSave: (content: string) => void, onCancel: () => void }> = ({ page, onSave, onCancel }) => {
  const [content, setContent] = useState(page.content);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSave = () => {
    onSave(content);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={handleContentChange}
        maxLength={310} rows={10} cols={50}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

interface FlipBookProps {
  story: Story;
  selectedStoryPages: Page[];
  onUpdatePage: (updatedPage: Page) => void;
}

const FlipBook: React.FC<FlipBookProps> = ({ story, selectedStoryPages, onUpdatePage }) => {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

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
              content: content
            })
          });
        } catch (error) {
          console.error('Failed to update the page-client:', error);
          return;
        }
      } else {
        //create a new page
        try {
          response = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page_number: selectedPage.page_number,
              content: content,
              storyId: story.id
            })
          });
        } catch (error) {
          console.error('Failed to create the page-client:', error);
          return;
        }
      }
  
      //handle the response
      const responseData = await response.json();
      if (!response) {
        console.error('Failed to save the page - client');
      } else {
        console.log('Page saved successfully - client', responseData);
      }
      onUpdatePage({ ...selectedPage, content: content });
      //update the pages to display the current info
      //map over selectedStoryPages looking for the page and set the content
      selectedStoryPages.map((page: any) => {
        if (existingPage && page.page_number === existingPage.page_number) {
          return { ...page, content: content };
        }
        return page;
      });

      setSelectedPage(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedPage(null);
  };

  return (
    <>
    <HTMLFlipBook
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
      clickEventForward={false}
      swipeDistance={0}
      showPageCorners={true}
      disableFlipByClick={false}
      width={500}
      height={500}
      className={'my-flipbook'}
      startPage={1}
      showCover={true}
      useMouseEvents={true}
      style={{
        backgroundColor: "#EADDCA",
        border: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        borderRadius: "5px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
        <div data-density="hard" className="title-page">
          { story.title }
        </div>
        {selectedStoryPages.map((page, index) => (
          <div
          key={index}
          className="page-container"
          onClick={() => handlePageClick(page)}>
          <div className="pages">
            { page.content }
          </div>
        </div>
        ))}
      </HTMLFlipBook>
      {selectedPage && (
        <PageEditor
          page={ selectedPage }
          onSave={ handleSavePage }
          onCancel={ handleCancelEdit }
        />
      )}
    </>
  );
};

export default FlipBook;
