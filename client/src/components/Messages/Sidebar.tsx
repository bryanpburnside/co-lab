import React from 'react';
import Threads from './Threads';

const Sidebar = () => {
  return (
    <div style={{ width: '250px' }} className="sidebar">
      <h1>im the sidebar babey</h1>
      <Threads />
    </div>
  );
}

export default Sidebar;
