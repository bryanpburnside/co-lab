import React, { useState, useEffect } from "react";
import NewStoryForm from "./NewStoryForm";
import FlipBook from "./FlipBook";

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

const StoryBook: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);

  //fetch stories from the server
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        // console.log(data);
        setStories(data);
      } catch (error) {
        console.error('Failed to fetch stories-client', error);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      if (selectedStory) {
        try {
          const response = await fetch(`/api/pages?storyId=${selectedStory.id}`);
          const data = await response.json();
          console.log(data);

          const newPages = data.map((fetchedPage: any) => {
            return { page_number: fetchedPage.page_number, content: fetchedPage.content, story: selectedStory.title };
          });

          setPages(newPages);

        } catch (error) {
          console.error('Failed to fetch pages', error);
        }
      }
    };
    fetchPages();
  }, [selectedStory]);

  //handle click on a story title
  const handleStoryClick = (story: Story) => {
    console.log('bananas');
    setSelectedStory(story);
  };

  const handleCreateStory = (createdStory: Story) => {
    setStories([...stories, createdStory]);
    setSelectedStory(createdStory);
    setShowNewStoryForm(false);
  };

  const handleCancelCreateStory = () => {
    setShowNewStoryForm(false);
  };

  const handleShowNewStoryForm = () => {
    setShowNewStoryForm(true);
  };

  const handlePageUpdate = (updatedPage: Page) => {
    setPages(prevPages => prevPages.map(page =>
      page.page_number === updatedPage.page_number ? updatedPage : page
    ));
  };


  //functionality to add new page
  const addNewPage = (content = '') => {
    if (selectedStory) {
      const newPageNumber = pages.length + 1;
      const newPage: Page = { page_number: newPageNumber, content, story: selectedStory.title };
      setPages(prevPages => [...prevPages, newPage]);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        {stories.map((story, index) => (
          <div key={ index } onClick={() => handleStoryClick(story)}>
            { story.title }
          </div>
        ))}
        <button onClick={ handleShowNewStoryForm }>Create New Story</button>
        <button onClick={() => { addNewPage() } }>Add New Page</button>
      </div>

      {showNewStoryForm ? (
        <NewStoryForm onCreateStory={ handleCreateStory } onCancel={ handleCancelCreateStory } />
      ) : (
        selectedStory && <FlipBook story={ selectedStory } selectedStoryPages={ pages } onPageUpdate={handlePageUpdate} />
      )}
    </div>
);
};

export default StoryBook;
