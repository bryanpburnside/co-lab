import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaTrash } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';


interface Story {
  id?: number;
  title: string;
  coverImage: string | null;
  numberOfPages: number | null;
  originalCreatorId?: string;
}

interface CarouselProps {
  items: Story[];
  handleStoryClick: (story: Story) => void;
  handleStoryHover: (story: Story) => void;
  deleteStory: (storyId: number, originalCreatorId: string) => void;
  user: string | undefined;
}

const StoryCarousel: React.FC<CarouselProps> = ({ items, handleStoryClick, handleStoryHover, deleteStory, user }) => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div style={{ height: '300px', overflow: 'hidden' }}>
      <Slider {...settings}>
        {items.map((story, index) => (
          <div
            key={index}
            onClick={() => handleStoryClick(story)}
            onMouseEnter={() => handleStoryHover(story)}
            style={{
              marginBottom: '20px',
              marginRight: '20px',
              color: '#3d3983',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '100px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: story.coverImage ? 'transparent' : 'white',
              }}
            >
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  style={{
                    width: '80px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.8em', color: 'black', textAlign: 'center' }}>
                  No Image
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.8em', color: 'white', textAlign: 'center' }}>
              {story.title}
            </div>
            {story.originalCreatorId === user?.sub && (
              <TooltipIcon
                icon={() => <FaTrash size={20} color="white" />}
                tooltipText="Delete story"
                handleClick={() => {
                  if (window.confirm('Are you sure you want to delete this story?')) {
                    deleteStory(story.id!, story.originalCreatorId!);
                    console.log('story deleted');
                  }
                }}
                style={{
                  marginTop: '7px',
                }}
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default StoryCarousel;