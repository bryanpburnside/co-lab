import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faNewspaper, faMessage } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightToBracket, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import TooltipIcon from './TooltipIcons';
import '../styles.css';
import TTS from "./TTS";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [speakText, setSpeakText] = useState('');
  const hoverTimeout = React.useRef<any>(null);

  const handleHover = (text: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setSpeakText(text);
    }, 1000);
  };


  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li className="navbar-item" onMouseEnter={() => handleHover('Home')}>
          <Link to="/">
            <img id="logo" src="https://res.cloudinary.com/dtnq6yr17/image/upload/v1688346963/co-lab_logo_no_BG_600X200_pagctf.png" alt="Home" />
          </Link>
        </li>
      </ul>
      <ul className="navbar-links-right">
        <li className="navbar-item-right">
          <Link to="/feed">
            <TooltipIcon
              icon={ faNewspaper }
              tooltipText="Feed"
              handleClick={() => {}}
              style={{ fontSize: '50px'}}
            />
          </Link>
        </li>
        <li className="navbar-item-right">
          <Link to="/messages">
            <TooltipIcon
              icon={ faMessage }
              tooltipText="Messages"
              handleClick={() => {}}
              style={{ fontSize: '45px'}}
            />
          </Link>
        </li>
        <li className="navbar-item-right" onMouseEnter={() => handleHover('Profile')}>
          <Link to="/profile">
            <TooltipIcon
              icon={ faCircleUser }
              tooltipText="Profile"
              handleClick={() => {}}
              style={{ fontSize: '49px'}}
            />
          </Link>
        </li>
        {!isAuthenticated ?
          <li
            className="navbar-item-right"
            onClick={() => loginWithRedirect()}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleHover('Login')}
          >
            <TooltipIcon
              icon={ faArrowRightToBracket }
              tooltipText="Logout"
              handleClick={() => {}}
              style={{ fontSize: '50px'}}
            />
          </li>
          :
          <li
            className="navbar-item-right"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleHover('Logout')}
          >
            <TooltipIcon
              icon={ faArrowRightFromBracket }
              tooltipText="Login"
              handleClick={() => {}}
              style={{ fontSize: '50px'}}
            />
          </li>
        }
      </ul>
      {/* {speakText && <TTS text={speakText} />} */}
    </nav>
  );
};

export default Navbar;