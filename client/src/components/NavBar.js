/* eslint-disable no-unused-vars -- Remove me */
import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppContext from '../components/AppContext';

export default function Navbar() {
  const { user } = useContext(AppContext);
  const { handleSignOut } = useContext(AppContext);
  const context = useContext(AppContext);
  console.log(context);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Awesome App
          </Link>
          <div>
            {user && (
              <button className="btn btn-dark" onClick={handleSignOut}>
                Sign out
              </button>
            )}
            {!user && (
              <>
                <Link to="/sign-in" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/sign-up" className="btn btn-dark">
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
