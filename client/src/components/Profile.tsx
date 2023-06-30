import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import axios from 'axios';
import { SendButton } from '../styled';
import { StyleSheetManager } from 'styled-components';

interface Friend {
  id: string,
  name: string,
  picture: string
}

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (userId) {
      getUserInfo();
    } else {
      setProfileUser(user);
    }
  }, [user, userId])

  useEffect(() => {
    if (friendIds.length) {
      getFriends();
    }
  }, [friendIds]);

  const getFriends = async () => {
    try {
      const friendDataPromises = friendIds.map(async (friendId) => {
        const result = await axios.get(`/users/${friendId}`);
        return result.data;
      })
      const friendData = await Promise.all(friendDataPromises);
      setFriends(friendData);
    } catch (err) {
      console.error('Failed to GET friend data at client:', err);
    }
  }

  const getUserInfo = async () => {
    try {
      const result = await axios.get(`/users/${userId}`);
      const userData = result.data;
      setProfileUser(userData);
      setFriendIds(userData.friends);
    } catch (err) {
      console.error('Failed to GET user info at client:', err);
    }
  }

  const addFriend = (userId: string, friendId: string) => {
    try {
      axios.post('/users/add-friend', {
        userId,
        friendId
      })
    } catch (err) {
      console.error('Failed to POST new friend at client:', err);
    }
  }

  if (isLoading) {
    return <div className='loading-container'>Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <StyleSheetManager shouldForwardProp={(prop) => prop !== 'theme'}>
        <div className='profile-container'>
          {profileUser ? (
            <>
              <img src={profileUser.picture} alt={profileUser.name} />
              <h2>{profileUser.name}</h2>
              <p>{profileUser.email}</p>
              {userId && (
                <SendButton style={{ width: '15%', margin: '5px' }} onClick={() => addFriend(user.sub, profileUser.id)}>
                  Add Friend
                </SendButton>
              )}
              <h3>Friends</h3>
              {friends &&
                friends.map(friend => (
                  <div key={friend.id}>
                    <Link to={`/profile/${friend.id}`}>
                      <img src={friend.picture} alt={friend.name} />
                      {friend.name}
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
