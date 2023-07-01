import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import axios from 'axios';
import ArtItem from './ArtItem';
import { SendButton } from '../../styled';
import styled from 'styled-components';

interface Friend {
  id: string;
  name: string;
  picture: string;
}

const ProfileContainer = styled.div`
  background-color: #3d3983;
  display: flex;
  justify-content: space-between;
  width: 80vw;
  margin: 0 auto;
  height: 60vh;
`;

const ProfilePic = styled.img`
  width: 100%;
  margin-top: 20px;
  object-fit: cover;
  image-rendering: auto;
  overflow: hidden;
`;

const LeftContainer = styled.div`
  width: 33%;
`;

const RightContainer = styled.div`
  width: 66%;
`;

const UserInfoContainer = styled.div`
  margin-bottom: 20px;
`;

const FriendListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;

const ArtworkContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [profilePic, setProfilePic] = useState<File | undefined>(undefined);
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
      console.log('friendIds', friendIds);
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
  };

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
        friendId,
      });
    } catch (err) {
      console.error('Failed to POST new friend at client:', err);
    }
  };

  const handlePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append('picture', file);
        const result = await axios.patch(`/users/${user?.sub}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfilePic(result.data);
      } catch (err) {
        console.error('Failed to upload profile picture:', err);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading ...</div>;
  }

  return isAuthenticated ? (
    <ProfileContainer>
      <LeftContainer>
        {profileUser ? (
          <UserInfoContainer>
            <ProfilePic src={profilePic || profileUser.picture} alt={profileUser.name} />
            <input type="file" accept="image/*" onChange={handlePicChange} />
            <h2>{profileUser.name}</h2>
            <p>{profileUser.email}</p>
            {userId && userId !== user?.sub && !friendIds.includes(user?.sub) && (
              <SendButton style={{ width: '100%', margin: '5px' }} onClick={() => addFriend(user?.sub, profileUser.id)}>
                Add Friend
              </SendButton>
            )}
          </UserInfoContainer>
        ) : (
          <p>Loading profile...</p>
        )}
        <FriendListContainer>
          {friends &&
            friends.slice(0, 9).map((friend) => (
              <div key={friend.id}>
                <Link to={`/profile/${friend.id}`}>
                  <img src={friend.picture} alt={friend.name} />
                </Link>
              </div>
            ))}
        </FriendListContainer>
      </LeftContainer>
      <RightContainer>
        <ArtworkContainer>
          {artwork &&
            artwork.map((art) => {
              if (art.type === 'visual art' || art.type === 'sculpture') {
                return (
                  <ArtItem
                    key={art.id}
                    id={art.id}
                    type={art.type}
                    content={art.type === 'visual art' ? art.visualart.content : art.sculpture.content}
                  />
                );
              }
              return null;
            })}
        </ArtworkContainer>
      </RightContainer>
    </ProfileContainer>
  ) : (
    <p>You are not logged in</p>
  );
};

export default Profile;