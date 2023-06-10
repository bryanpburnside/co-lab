import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import LoginButton from './LoginButton';
import Profile from './Profile';

// interface Props {
//   name:
//   string
// }

const App = () => {
  return (

    <Router>
      <Layout />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginButton />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;