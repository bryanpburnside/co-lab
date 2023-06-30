import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
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
            <img id="logo" src="https://res.cloudinary.com/dtnq6yr17/image/upload/v1688141524/Logo_van9la.png" alt="Home" />
          </Link>
        </li>
      </ul>
      <ul className="navbar-links-right">
        <li className="navbar-item-right">
          <Link to="/feed">Feed</Link>
        </li>
        <li className="navbar-item-right" onMouseEnter={() => handleHover('Profile')}>
          <Link to="/profile">Profile</Link>
        </li>
        <li className="navbar-item-right">
          <Link to="/messages">Messages</Link>
        </li>
        {!isAuthenticated ?
        <li
            className="navbar-item-right"
            onClick={() => loginWithRedirect()}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleHover('Login')}
          >
            Login
        </li>
        :
        <li
            className="navbar-item-right"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleHover('Logout')}
          >
            Logout
        </li>
        }
      </ul>
      {/* {speakText && <TTS text={speakText} />} */}
    </nav>
  );
};

export default Navbar;