import React from "react";
import { Outlet, Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import StoryBook from './Stories';

const Navbar = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          <li>
            <Link to='/logout'>Log out</Link>
          </li>
          <li>
            <Link to='/stories'>Story Book</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar;
