import React from 'react';
import { Link } from "react-router-dom";
import eye from '../assets/images/eye.png';
import ear from '../assets/images/ear.png';
import hand from '../assets/images/hand.png';
import mouth from '../assets/images/mouth.png';
import { v4 as generateRoomId } from 'uuid';

const Home = () => {
  return (
    <div className="container">
      <Link to='/visualart' className='image-link'>
        <img src={eye} alt="eye" />
      </Link>
      <Link to='/music' className='image-link'>
        <img src={ear} alt="ear" />
      </Link>
      <Link to={`/sculpture/${generateRoomId()}`} className='image-link'>
        <img src={hand} alt="hand" />
      </Link>
      <Link to='/story' className='image-link'>
        <img src={mouth} alt="mouth" />
      </Link>
    </div>
  );
}

export default Home;
