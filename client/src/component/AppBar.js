import React, { Fragment, useContext } from 'react'

import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import LogoutModal from './LogoutModal';
import { AppContext } from '../context/AppContext';

export const AppBar = () => {

  const { isAuthenticated, username } = useContext(AppContext)


  return (
    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
      <div className="container">
        <a className="navbar-brand m-2" href="/">Home</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="myNavbar">
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <Fragment>
                <li className="nav-item">
                  <div role="button" className='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#registerModal">Register</div>
                </li>
                <li className="nav-item">
                  <div role="button" className='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#loginModal">Login</div>
                </li>
              </Fragment>
            ) : (
              <Fragment>
                {/* username */}
                <li className="nav-item">
                  <h1 className="navbar-brand mx-4">{username}</h1>
                </li>
                <li className="nav-item">
                  <div role="button" className='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</div>
                </li>
              </Fragment>
            )}
          </ul>

        </div>
      </div>

      <RegisterModal />

      <LoginModal />

      <LogoutModal />

    </nav>
  )
}