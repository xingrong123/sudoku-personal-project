import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const AppBar = (props) => {
  let location = useLocation();

  return (
    <nav className="navbar fixed-top navbar-dark bg-dark">
      <a class="navbar-brand m-2" href="/">Home</a>
      {props.username}
      <form class="form-inline">
        {!props.isAuthenticated ? (
          <Fragment>
            <Link to={{ pathname: "/auth/register", state: { background: location } }}>
              <button className="btn btn-outline-success m-2">register</button>
            </Link>
            <Link to={{ pathname: "/auth/login", state: { background: location } }}>
              <button className="btn btn-outline-success m-2">login</button>
            </Link>
          </Fragment>
        ) : (
          <Link to={{ pathname: "/auth/logout", state: { background: location } }}>
            <button className="btn btn-outline-danger m-2">logout</button>
          </Link>
        )}
      </form>
    </nav>
  )
}