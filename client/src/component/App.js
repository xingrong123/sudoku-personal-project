import React, { Fragment, useEffect, useContext } from 'react';
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
import { AppContextProvider, AppContext } from '../context/AppContext';

if (typeof window !== "undefined") {
  injectStyle();
}

export default function App() {

  return (
    <AppContextProvider>
      <AppWithContext />
    </AppContextProvider>
  );
}

function AppWithContext() {

  const { setIsAuthenticated, setUsername } = useContext(AppContext)

  useEffect(() => {
    AuthApi
      .get("/is-verify")
      .then((res) => {
        console.log(res);
        if (res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(res.headers.username);
        } else {
          setIsAuthenticated(false);
          setUsername("");
        }
      })
      .catch(err => { console.error(err.message) })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <header>
        <AppBar />
      </header>

      <main>
        <div className="container">
          <MainContent />
          <ToastContainer />
        </div>
      </main>
    </Router>
  );
}

function MainContent() {
  let location = useLocation();
  let background = location.state && location.state.background;
  return (
    <Fragment>
      <Switch location={background || location}>
        <Route exact path="/" children={<HomePage />} />
        <Route path="/game/:id" children={<Sudoku />} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </Fragment>
  )
}