import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import LoginButton from './LoginButton';

// interface Props {
//   name:
//   string
// }

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={< Layout />}>
          <Route path='/login' element={<LoginButton />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;