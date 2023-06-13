import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const saveUser = async () => {
    try {
      if (user) {
        const { sub: id, name, email, picture } = user;
        await axios.post('/users', {
          id,
          name,
          email,
          picture
        });
      }
    } catch (err) {
      console.error('Failed to SAVE user to db at client:', err);
    }
  }

  const getUserInfo = async () => {
    try {
      if (user) {
        console.log(user);
        await saveUser();
      }
    } catch (err) {
      console.error('Failed to GET active user info at client:', err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [user])

  return (
    <>
      <h1>Co-Lab</h1>
    </>
  )
}

export default Home;
