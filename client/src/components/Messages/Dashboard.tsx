import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    <>
      {user ? user.sub : 'no user'}
    </>
  )
}

export default Dashboard;
