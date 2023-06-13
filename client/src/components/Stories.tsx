import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from 'react-pageflip';

interface Page {
  pageNumber: number;
  content: string;
  story: string;
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

  //for enter press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
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
  const [pages, setPages] = useState<Page[]>([
    { pageNumber: 1, content: 'hey there', story: 'The Black Sheep' },
    { pageNumber: 2, content: 'I am', story: 'The Black Sheep' },
    { pageNumber: 3, content: 'just', story: 'The Black Sheep' },
    { pageNumber: 4, content: 'so tired', story: 'The Black Sheep' }
  ]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);


  //functionality to add new page
  const addNewPage = () => {
    const nextPageNumber = pages.length + 1;
    const newPage: Page = { pageNumber: nextPageNumber, content: '', story: 'The Black Sheep' };
    setPages([...pages, newPage]);
  };

  //handle click on page
  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
  };

  //save page after editing it
  const handleSavePage = (content: string) => {
    if (selectedPage) {
      const updatedPages = pages.map(page => {
        if (page.pageNumber === selectedPage.pageNumber) {
          return { ...page, content };
        }
        return page;
      });
      setPages(updatedPages);
      setSelectedPage(null);
    }
  };

  //functionality to cancel the editing
  const handleCancelEdit = () => {
    setSelectedPage(null);
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
      <button onClick={ addNewPage }>Create New Story</button>
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
        width={500} height={500}
        className={'book'}
        startPage={1}
        showCover={false}
        useMouseEvents={true}
        style={{
          backgroundColor: '#f7f3eb',
          border: '1px solid #ddd',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          borderRadius: '5px',
        }}>
        {pages.map((page, index) => (
          <div
            key={ index }
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
                fontWeight: 'bold',
              }}
            >
              { page.content }
            </div>
          </div>
        ))}
      </HTMLFlipBook>
      { selectedPage && (
        <PageEditor
          page={ selectedPage }
          onSave={ handleSavePage }
          onCancel={ handleCancelEdit } />
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