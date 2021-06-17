import React, { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style"

import { AppBar } from './AppBar';
import Sudoku from './sudokugame/Sudoku';
import HomePage from './HomePage';
import AuthApi from '../apis/AuthApi';

if (typeof window !== "undefined") {
  injectStyle();
}

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean);
  }

  useEffect(() => {
    try {
      const authToken = async () => {
        const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } })
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.username)
        } else {
          setIsAuthenticated(false);
          setUsername("")
        }
      }
      if (localStorage.getItem("token") !== null) {
        authToken();
      } else {
        setIsAuthenticated(false);
        setUsername("")
      }
      
    } catch (err) {
      console.error(err.message)
    }
  }, [])

  return (
    <Router>
      <AppBar isAuthenticated={isAuthenticated} setAuth={setAuth} setUsername={setUsername} username={username} />
      <main>
        <div className="container">
          <MainContent isAuthenticated={isAuthenticated} setAuth={setAuth} setUsername={setUsername} />
        </div>
        <ToastContainer />
      </main>

    </Router>
  );
}

function MainContent(props) {
  let location = useLocation();
  let background = location.state && location.state.background;
  return (
    <Fragment>
      <Switch location={background || location}>
        <Route exact path="/" children={<HomePage isAuthenticated={props.isAuthenticated} />} />
        <Route path="/game/:id" children={<Sudoku isAuthenticated={props.isAuthenticated} />} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </Fragment>
  )
}