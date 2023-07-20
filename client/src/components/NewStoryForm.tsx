import React, { useState } from 'react';
import TTS from './TTS';
import '../styles.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Dropzone from './DropZone';
import {  StyledButtonStory, StyledFormStory, StyledInputStory,} from '../styled';
import Switch  from 'react-switch';

interface Story {
  id?: number;
  title: string;
  coverImage: string | null;
  numberOfPages: number | null;
  originalCreatorId?: string;
  isPrivate: boolean | false;
  titleColor: string;
}

interface NewStoryFormProps {
  onCreateStory: (story: Story) => void;
  onCancel: () => void;
}

const NewStoryForm: React.FC<NewStoryFormProps> = ({ onCreateStory, onCancel }) => {
  const [title, setTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [speakText, setSpeakText] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const { user } = useAuth0();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  //for privacy settings
  const setPrivateStory = (checked: boolean) => {
    //change boolean of story for isPrivate to true/false
    setPrivacy(checked);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //if user is undefined, don't let them make story
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const story: Story = {
      title,
      coverImage: coverImageUrl,
      numberOfPages,
      originalCreatorId: user?.sub,
      isPrivate: privacy,
      titleColor: '#000000'
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
      if (response.ok) {
        console.log('Story created successfully-client');
        onCreateStory(data);
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

  const hoverTimeout = React.useRef<any>(null);

  const handleHover = (text: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setSpeakText(text);
    }, 1000);
  };

  const handleLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setSpeakText('');
  };

  return (
    <StyledFormStory onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="title">Title:</label>
        <StyledInputStory
          placeholder='Title'
          type="text"
          id="title"
          value={ title }
          onChange={ handleTitleChange }
          onMouseEnter={() => handleHover('Title')}
          onMouseLeave={() => handleLeave()}
        />
      </div>
      <Dropzone onImageUpload={ setCoverImageUrl } />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <StyledButtonStory
          type="submit"
          onMouseEnter={() => handleHover('Create Story')}
          onMouseLeave={() => handleLeave()}
        >
          Create Story
        </StyledButtonStory>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="privacy-switch" style={{ margin: '10px', color: 'black', marginBottom: '2px' }}>Set as private:</label>
        <Switch
          id="privacy-switch"
          onChange={ setPrivateStory }
          checked={ privacy }
        />
      </div>
    </div>
      <StyledButtonStory
        style={{ marginTop: '20px' }}
        type="button"
        onClick={ handleCancel }
        onMouseEnter={() => handleHover('Cancel')}
        onMouseLeave={() => handleLeave()}
      >
        Cancel
      </StyledButtonStory>
      {speakText && <TTS text={ speakText } />}
    </StyledFormStory>
  );
};

export default NewStoryForm;