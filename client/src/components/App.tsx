import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import LoginButton from './LoginButton';

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
      </Routes>
    </Router>
  );
}

export default App;