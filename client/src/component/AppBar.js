import React, { Fragment } from 'react'

import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import LogoutModal from './LogoutModal';

export const AppBar = (props) => {

  return (
    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
      <div className="container">
        <a className="navbar-brand m-2" href="/">Home</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="myNavbar">
          <ul class="navbar-nav ms-auto">
            {!props.isAuthenticated ? (
              <Fragment>
                <li class="nav-item">
                  <div role="button" class='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#registerModal">Register</div>
                </li>
                <li class="nav-item">
                  <div role="button" class='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#loginModal">Login</div>
                </li>
              </Fragment>
            ) : (
              <Fragment>
                {/* username */}
                <li className="nav-item">
                  <h1 className="navbar-brand mx-4">{props.username}</h1>
                </li>
                <li class="nav-item">
                  <div role="button" class='navbar-brand mx-4' data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</div>
                </li>
              </Fragment>
            )}
          </ul>

        </div>
      </div>

      <RegisterModal setAuth={(i) => props.setAuth(i)} setUsername={(i) => props.setUsername(i)} />

      <LoginModal setAuth={(i) => props.setAuth(i)} setUsername={(i) => props.setUsername(i)} />

      <LogoutModal setAuth={(i) => props.setAuth(i)} setUsername={(i) => props.setUsername(i)} />

    </nav>
  )
}