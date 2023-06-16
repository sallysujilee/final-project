/* eslint-disable no-unused-vars -- Remove me */
import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './NavBar.css';
import logo from '../images/logo.jpeg';

export default function Navbar() {
  const { user } = useContext(AppContext);
  const { handleSignOut } = useContext(AppContext);
  const context = useContext(AppContext);
  console.log(context);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <img className="logo" src={logo} alt="logo img" />
          <Link className="navbar-brand" to="/">
            Senior Project
          </Link>
          <div>
            {user && (
              <button
                className="btn btn-dark sign-out-button"
                onClick={handleSignOut}>
                Sign out
              </button>
            )}
            {!user && (
              <>
                <Link to="/sign-in" className="btn btn-primary nav-sign-in">
                  Sign In
                </Link>
                <Link to="/sign-up" className="btn btn-dark nav-sign-up">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
