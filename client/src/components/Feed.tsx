import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { formatDistanceToNow } from 'date-fns';
import { Outlet, Link } from 'react-router-dom';

import '../styles.css';

interface ArtItem {
  id: number;
  title: string | null;
  content: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  artworkId: number;
}

interface PageItem {
  id: number;
  page_number: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  storyId: number;
}

interface Music {
  id: number; 
  songTitle: string,
  content: null,
  createdAt: string,
  updatedAt: string,
  artworkId: number;
}

type FeedItem = ArtItem | PageItem | Music;

const Feed: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [feedData, setFeedData] = useState<FeedItem[] | null>(null);
  const [pageData, setPageData] = useState<{ [key: number]: PageItem[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artResponse, storyResponse, musicResponse] = await Promise.all([fetch('/visualart'), fetch('/api/stories'), fetch('/music')]);
        const [artData, storyData, musicData] = await Promise.all([artResponse.json(), storyResponse.json(), musicResponse.json()]);

        const combinedData: FeedItem[] = [...artData, ...storyData, ...musicData];
        const sortedData = combinedData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setFeedData(sortedData);

        // Making a request for each story ID
        const pagePromises = storyData.map((story: any) => fetch(`http://localhost:8000/api/pages?storyId=${story.id}`));

        // Fetching the page data for each story
        const pageResponses = await Promise.all(pagePromises);
        const pageData = await Promise.all(pageResponses.map(response => response.json()));

        const formattedPageData: { [key: number]: PageItem[] } = {};

        pageData.forEach((pages: PageItem[]) => {
          const storyId = pages[0]?.storyId;
          if (storyId) {
            formattedPageData[storyId] = pages.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        });

        setPageData(formattedPageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatTimeDifference = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    return formatDistanceToNow(created, { addSuffix: true });
  };

  if (isLoading) {
    return <div className="loading-container">Loading ...</div>;
  }

  const renderPost = (item: FeedItem, index: number) => {
    const isVisualArt = 'url' in item;
    const isPageStory = 'coverImage' in item;
    const isMusic = 'songTitle' in item;
    const pages = pageData[item.id] || [];
  
    return (
      <div className="post" key={index}>
        <div className="post-header">
          <img src={user.picture} alt={user.name} className="user-pfp" />
          <a href={/* make this go to correct users prof */} className="username">
            {user.name}
          </a>
          <p className="creation-time">{formatTimeDifference(item.createdAt)}</p>
        </div>
        {isVisualArt && (
          <>
            <img src={item.content} alt={item.title} className="cloud-img" />
          </>
        )}
        {isPageStory && (
          <div className="story" key={index}>
            <h1>
              {item.coverImage} {item.title}
            </h1>
            {pages.map((page: PageItem) => (
              <p className="story-content" key={page.id}>
                {page.content}
              </p>
            ))}
          </div>
        )}
        {isMusic && (
          <><h1>{item.songTitle}</h1><div className="music-player">
            <audio controls>
              <source src={item.url} type="audio/mp3" />
              Your browser does not support the audio tag.
            </audio>
          </div></>
        )}
        <div className="post-footer">
          <h1 className="add-to-colab">
            <a href={/* make this do something */}>Add to this Colab</a>
          </h1>
        </div>
      </div>
    );
  };
  
  return (
    <div className="post-container">
      {feedData && feedData.map(renderPost)}
    </div>
  );
  
};

export default Feed;
