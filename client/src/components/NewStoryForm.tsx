import React, { useState, useEffect } from 'react';

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

interface NewStoryFormProps {
  onCreateStory: (story: Story) => void;
  onCancel: () => void;
}

const NewStoryForm: React.FC<{ onCreateStory: (story: Story) => void, onCancel: () => void }> = ({ onCreateStory, onCancel }) => {
  const [title, setTitle] = useState('');
  // const [collaborators, setCollaborators] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // const handleCollaboratorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCollaborators(event.target.value);
  // };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverImage(event.target.files[0]);
    }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const story: Story = {
      title,
      coverImage,
      numberOfPages
    };

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('Story created successfully-client');
        //trying to grab the story id
        onCreateStory(data);
        // console.log(data);
      } else {
        console.error('Story not created-client');
      }
    } catch (error) {
      console.error('Unable to save story to database-client', error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={ title } onChange={ handleTitleChange } />
      </div>
      {/* <div>
        <label htmlFor="collaborators">Collaborators:</label>
        <input type="text" id="collaborators" value={ collaborators } onChange={ handleCollaboratorsChange } />
      </div> */}
      <div>
        <label htmlFor="coverImage">Cover Image:</label>
        <input type="file" id="coverImage" accept="image/*" onChange={ handleCoverImageChange } />
      </div>
      <button type="submit">Create Story</button>
      <button type="button" onClick={ handleCancel }>Cancel</button>
    </form>
  );
};

export default NewStoryForm;