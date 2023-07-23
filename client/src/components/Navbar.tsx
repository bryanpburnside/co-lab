import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faNewspaper, faMessage } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightToBracket, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeComponent, setActiveComponent }) => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const currentComponent = pathname.substring(1);
    setActiveComponent(currentComponent);
  }, [location]);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const navbarHeight = 55;
    setIsNavbarFixed(scrollTop >= navbarHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${activeComponent === 'feed' ? (isNavbarFixed ? 'sticky' : '') : ''}`}>
      <ul className="navbar-links">
      <li className={'navbar-item'}>
          <Link to="/">
            <img id="logo" src="https://res.cloudinary.com/dtnq6yr17/image/upload/v1688346963/co-lab_logo_no_BG_600X200_pagctf.png" alt="Home" />
          </Link>
        </li>
      </ul>
      <ul className="navbar-links-right">
      <li className={'navbar-item-right'}>
          <Link to="/feed">
            <FontAwesomeIcon icon={faNewspaper} size='lg' />
          </Link>
        </li>
        <li className={'navbar-item-right'}>
          <Link to="/messages">
            <FontAwesomeIcon icon={faMessage} size='lg' />
          </Link>
        </li>
        <li className={'navbar-item-right'}>
          <Link to="/profile">
            <FontAwesomeIcon icon={faCircleUser} size='lg' />
          </Link>
        </li>
        {!isAuthenticated ?
          <li
            className="navbar-item-right"
            onClick={() => loginWithRedirect()}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faArrowRightToBracket} size='lg' />
          </li>
          :
          <li
            className="navbar-item-right"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} size='lg' />
          </li>
        }
      </ul>
    </nav>
  );
};

export default Navbar;