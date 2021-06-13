import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const AppBar = (props) => {
  let location = useLocation();

  return (
    <nav className="container-xxl flex-wrap flex-md-nowrap bg-dark">
      <a className="navbar-brand m-2" href="/">Home</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar" aria-expanded="false" aria-controls="myNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse flex-grow-1 text-right" id="myNavbar">
        <ul class="navbar-nav me-auto">
          <li className="nav-item">
            <h1 className="navbar-brand m-2">{props.username}</h1>
          </li>
        </ul>
        <ul class="navbar-nav">
          {!props.isAuthenticated ? (
            <Fragment>
              <li class="nav-item">
                <Link to={{ pathname: "/auth/register", state: { background: location } }}>
                  <button className="btn btn-outline-success d-lg-inline-block my-2 my-md-0 ms-md-3">register</button>
                </Link>
              </li>
              <li class="nav-item">
                <Link to={{ pathname: "/auth/login", state: { background: location } }}>
                  <button className="btn btn-outline-success d-lg-inline-block my-2 my-md-0 ms-md-3">login</button>
                </Link>
              </li>
            </Fragment>
          ) : (
            <li class="nav-item">
              <Link to={{ pathname: "/auth/logout", state: { background: location } }}>
                <button className="btn btn-outline-danger d-lg-inline-block my-2 my-md-0 ms-md-3">logout</button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}