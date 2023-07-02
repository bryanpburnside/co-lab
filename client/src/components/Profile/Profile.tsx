import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import axios from 'axios';
import ArtItem from './ArtItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { SendButton } from '../../styled';
import styled from 'styled-components';

interface Friend {
  id: string;
  name: string;
  picture: string;
}

const ProfileContainer = styled.div`
  background-color: #3d3983;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 80vw;
  margin: 0 auto;
  height: 60vh;
`;

const ProfilePicContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20vw;
  margin-top: 10px;
  object-fit: cover;
  object-position: center;
`;

const PencilIcon = styled.div`
  position: absolute;
  top: 90%;
  left: 75%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 2;
  width: 50px;
  height: 50px;
  clip-path: circle();
  background-color: #3d3983;
`;

const Name = styled.div`
  text-align: center;
  font-size: 32px;
  margin-top: 20px;
  background-color: #F06b80;
  border-radius: 10px;
`

const ProfilePic = styled.img`
  display: block;
  width: 100%;
  height: 20vw;
  margin-top: 10px;
  object-fit: cover;
  object-position: center;
  clip-path: circle();
`;

const LeftContainer = styled.div`
  width: 33%;
  background-color: #F06b80;
  border-radius: 10px;
`;

const RightContainer = styled.div`
  width: 66%;
  display: flex;
  flex-direction: column;
  background-color: #F06b80;
  border-radius: 10px;
`;

const UserInfoContainer = styled.div`
  margin-bottom: 75px;
`;

const FriendContainer = styled.div`
  margin-top: 10px;
`;

const FriendListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  margin-top: 10px;
  background-color: #F06b80;
  border-radius: 10px;
  padding-bottom: 10px;
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
`;

const FriendLink = styled(Link)`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FriendImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: cover;
  object-position: center;
  clip-path: circle();
`;

const ArtworkContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  place-items: center;

  @media (max-width: 1475px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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

  const handlePicClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
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
            <Name>{profileUser.name}</Name>
            <ProfilePicContainer>
              <ProfilePic src={profilePic || profileUser.picture} alt={profileUser.name} />
              <PencilIcon onClick={handlePicClick}>
                <FontAwesomeIcon icon={faPencil} size="lg" />
                <input type="file" accept="image/*" id="fileInput" onChange={handlePicChange} style={{ display: 'none' }} />
              </PencilIcon>
            </ProfilePicContainer>
            {userId && userId !== user?.sub && !friendIds.includes(user?.sub) && (
              <SendButton style={{ width: '100%', margin: '5px' }} onClick={() => addFriend(user?.sub, profileUser.id)}>
                Add Friend
              </SendButton>
            )}
          </UserInfoContainer>
        ) : (
          <p>Loading profile...</p>
        )}
        <FriendContainer>
          <Name>Friends
            <FriendListContainer>
              {friends &&
                friends.slice(0, 9).map((friend) => (
                  <div key={friend.id}>
                    <FriendLink to={`/profile/${friend.id}`}>
                      <FriendImage src={friend.picture} alt={friend.name} />
                    </FriendLink>
                  </div>
                ))}
            </FriendListContainer>
          </Name>
        </FriendContainer>
      </LeftContainer>
      <RightContainer>
        <div>
          <Name>Artwork
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
          </Name>
        </div>
      </RightContainer>
    </ProfileContainer >
  ) : (
    <p>You are not logged in</p>
  );
};

export default Profile;