import React, { useState, useEffect } from 'react';

interface Page {
  pageNumber: number;
  content: string;
  story: string;
}

interface Story {
  title: string;
  collaborators: string[];
  coverImage: File | null;
  pages: Page[];
}

interface NewStoryFormProps {
  onCreateStory: (story: Story) => void;
  onCancel: () => void;
}

const NewStoryForm: React.FC<{ onCreateStory: (story: Story) => void, onCancel: () => void }> = ({ onCreateStory, onCancel }) => {
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCollaboratorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollaborators(event.target.value);
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverImage(event.target.files[0]);
    }
  };
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const story: Story = {
      title,
      collaborators: collaborators.split(',').map((collaborator) => collaborator.trim()),
      coverImage,
      pages: []
    };

    onCreateStory(story);
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
      <div>
        <label htmlFor="collaborators">Collaborators:</label>
        <input type="text" id="collaborators" value={ collaborators } onChange={ handleCollaboratorsChange } />
      </div>
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