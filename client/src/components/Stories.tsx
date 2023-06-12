import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from 'react-pageflip';


//React.FC = react functional component
const StoryBook: React.FC = () => {
  const [page, setPage] = useState<number | null>(null);
  const [pages, setPages] = useState<string[]>(['Page 1', 'Page 2', 'Page 3', 'Page 4']);

  //create the properties for the flipBook
  // const storyBookProps = {
  //   className: 'storybook',
  //   style: { backgroundColor: 'grey' },
  //   startPage: 1,
  //   orientation: 'vertical',
  //   uncutPages: true,
  //   loopForever: true,
  //   showCover: true
  // };

  //functionality to add new page
  const addNewPage = () => {
    const newPage = `Page ${pages.length + 1}`;
    setPages([...pages, newPage]);
  };

  //functionality to change page
  const handlePageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (page !== null) {
      const updatedPages = [...pages];
      updatedPages[page] = event.target.value;
      setPages(updatedPages);
    }
  };

  return (
    <div>
      <button onClick={addNewPage}>Add New Page</button>
      <HTMLFlipBook
        size={"fixed"}
        minWidth={0}
        maxWidth={500}
        minHeight={0}
        maxHeight={500}
        drawShadow={true}
        flippingTime={500}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0}
        mobileScrollSupport={false}
        clickEventForward={false}
        swipeDistance={0}
        showPageCorners={true}
        disableFlipByClick={false}
        width={300} height={500}
        className={'book'}
        startPage={1}
        showCover={false}
        useMouseEvents={true}
        style={{ backgroundColor: 'maroon' }}>
        {pages.map((pg, index) => (
          <div key={ index }>
            <textarea value={pg} onChange={ handlePageChange } />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  )
};

export default StoryBook;