import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const AppBar = (props) => {
  let location = useLocation();

  return (
    <nav className="navbar fixed-top navbar-dark bg-dark">
      <a className="navbar-brand m-2" href="/">Home</a>
      <h1 className="navbar-brand m-2">{props.username}</h1>
      <form className="form-inline">
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