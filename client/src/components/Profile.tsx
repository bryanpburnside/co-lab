import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import axios from 'axios';
import { SendButton } from '../styled';
import { StyleSheetManager } from 'styled-components';

interface Friend {
  id: string;
  name: string;
  picture: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [artwork, setArtwork] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      getUserInfo();
      getArtwork();
    }
  }, [user, userId]);

  useEffect(() => {
    if (friendIds.length) {
      console.log('friendIds', friendIds)
      getFriends();
    }
  }, [friendIds]);

  const getArtwork = async () => {
    try {
      const id = userId || user?.sub;
      const art = await axios.get(`/artwork/byUserId/${id}`);
      console.log('artwork', art.data);
      setArtwork(art.data);
    } catch (err) {
      console.error('Failed to GET artwork at client:', err);
    }
  }

  const getUserInfo = async () => {
    try {
      let userData;
      let result;
      if (!userId || userId === user?.sub) {
        result = await axios.get(`/users/${user?.sub}`);
        userData = result.data;
      } else {
        result = await axios.get(`/users/${userId}`);
        userData = result.data;
      }
      setProfileUser(userData);
      setFriendIds(userData.friends || []);
    } catch (err) {
      console.error('Failed to GET user info at client:', err);
    }
  };

  const getFriends = async () => {
    try {
      const friendPromises = friendIds.map(async (friendId) => {
        const result = await axios.get(`/users/${friendId}`);
        return result.data;
      });
      const friendData = await Promise.all(friendPromises);
      setFriends(friendData);
    } catch (err) {
      console.error('Failed to GET friend data at client:', err);
    }
  };

  const addFriend = (userId: string, friendId: string) => {
    try {
      axios.post('/users/add-friend', {
        userId,
        friendId
      });
    } catch (err) {
      console.error('Failed to POST new friend at client:', err);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <StyleSheetManager shouldForwardProp={(prop) => prop !== 'theme'}>
        <div className="profile-container">
          {profileUser ? (
            <>
              <img src={profileUser.picture} alt={profileUser.name} />
              <h2>{profileUser.name}</h2>
              <p>{profileUser.email}</p>
              {userId && userId !== user?.sub && !friendIds.includes(user?.sub) && (
                < SendButton style={{ width: '15%', margin: '5px' }} onClick={() => addFriend(user?.sub, profileUser.id)}>
                  Add Friend
                </SendButton>
              )}
              {artwork.length ? (<h3>Artwork</h3>) : null}
              {artwork &&
                artwork.map(art => {
                  if (art.type === 'visual art') {
                    return (
                      <div key={art.id}>
                        <img src={art.visualart.content} />
                      </div>
                    )
                  }
                  if (art.type === 'sculpture') {
                    return (
                      <div key={art.id}>
                        <img src={art.sculpture.content} />
                      </div>
                    )
                  }
                })}
              {friends.length ? (<h3>Friends</h3>) : null}
              {friends &&
                friends.map((friend) => (
                  <div key={friend.id}>
                    <Link to={`/profile/${friend.id}`}>
                      <img src={friend.picture} alt={friend.name} />
                    </Link>
                  </div>
                ))}
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </StyleSheetManager >
    ) : (
      <p>You are not logged in</p>
    )
  );
};

export default Profile;
