import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from 'react-pageflip';
import NewStoryForm from "./NewStoryForm";

interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface Story {
  id?: number;
  title: string;
  // collaborators: string[];
  coverImage: File | null;
  numberOfPages: number | null;
}

//create page editor component
const PageEditor: React.FC<{ page: Page, onSave: (content: string) => void, onCancel: () => void }> = ({ page, onSave, onCancel }) => {
  const [content, setContent] = useState(page.content);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  //save the text to page
  const handleSave = () => {
    onSave(content);
  };

  //in case of cancel
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <textarea
        value={ content }
        onChange={ handleContentChange }
        maxLength={310} rows={10} cols={50} />
      <button onClick={ handleSave }>Save</button>
      <button onClick={ handleCancel }>Cancel</button>
    </div>
  );
};


//React.FC = react functional component
const StoryBook: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);

  //functionality to add new page
  const addNewPage = () => {
    const nextpage_number = pages.length + 1;
    const newPage: Page = { page_number: nextpage_number, content: '', story: '' };
    setPages([...pages, newPage]);
  };

  //handle click on page
  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
  };

  //save page after editing it
  const handleSavePage = async (content: string) => {
    if (selectedPage && story) {
      const updatedPages = pages.map(page => {
        if (page.page_number === selectedPage.page_number) {
          return { ...page, content };
        }
        return page;
      });

      setPages(updatedPages);
      setSelectedPage(null);

      //send a request to the server to save the page
      try {
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_number: selectedPage.page_number,
            content: content,
            storyId: story.id
          })
        });

        const responseData = await response.json();
        console.log(responseData);
        //check for ok response
        if (!response.ok) {
          console.error('Failed to save the page-client');
        }

        console.log('Page saved successfully-client', responseData);
      } catch (error) {
        console.error('Failed to save the page-client:', error);
      }
    }
  };

  //functionality to cancel the editing
  const handleCancelEdit = () => {
    setSelectedPage(null);
  };

  const handleCreateStory = (createdStory: Story) => {
    setStory(createdStory);
    setCoverImageURL(createdStory.coverImage ? URL.createObjectURL(createdStory.coverImage) : null);
    setShowNewStoryForm(false);
  };

  const handleCancelCreateStory = () => {
    setShowNewStoryForm(false);
  };

  const handleShowNewStoryForm = () => {
    setShowNewStoryForm(true);
  };

  return (
    <div
      style={{
        display:'flex',
        borderColor: 'yellow',
        border: '10px'
      }}>
      <div
      style={{
        backgroundColor: 'maroon',
        width: '199px',
        height: '199px',
        border: '5px'
      }}>
        Collaborators' names
      </div>
      <div
      style={{
        backgroundColor: 'blue',
        width: '199px',
        height: '199px',
        border: '5px'
      }}>
        Finished Stories
      </div>
      <div
      style={{
        backgroundColor: 'purple',
        width: '199px',
        height: '199px',
        border: '5px'
      }}>
        In Progress Stories
      </div>
      <button onClick={ addNewPage }>Add New Page</button>
      <button onClick={ handleShowNewStoryForm }>Create New Story</button>
      {showNewStoryForm ? (
      <NewStoryForm onCreateStory={ handleCreateStory } onCancel={ handleCancelCreateStory } />
    ) : (
      <>
        <HTMLFlipBook
          size={'stretch'}
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
          className={'book'}
          startPage={1}
          showCover={true}
          useMouseEvents={true}
          style={{
            backgroundColor: '#f7f3eb',
            border: '1px solid #ddd',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            borderRadius: '5px'
          }}
        >
          {pages.map((page, index) => (
            <div
              key={index}
              onClick={() => handlePageClick(page)}
              style={{ position: 'relative', height: '100%' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                { page.content }
              </div>
            </div>
          ))}
        </HTMLFlipBook>
        {selectedPage && (
          <PageEditor
            page={ selectedPage }
            onSave={ handleSavePage }
            onCancel={ handleCancelEdit } />
        )}
      </>
    )}
      <div
      style={{
        backgroundColor: 'green',
        width: '199px',
        height: '199px',
        border: '5px'
      }}>
        PeerJS div
      </div>
    </div>
  );
};

export default StoryBook;