import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './Navbar';
import Home from './Home';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import saveUser from './AuthService';

const App = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const getUserInfo = async () => {
    try {
      console.log(user);
      saveUser();
    } catch (err) {
      console.error('Failed to GET active user info at client:', err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [isAuthenticated, user])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/login/*" element={<LoginButton />} />
      </Routes>
    </Router>
  );
}

export default App;
