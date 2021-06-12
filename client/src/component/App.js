import React, { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import {injectStyle} from "react-toastify/dist/inject-style"

import { AppBar } from './AppBar';
import Game from './sudokugame/Game';
import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';
import Modal from './Modal';

import './App.css';
import AuthApi from '../apis/AuthApi';

const myRef = React.createRef();
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
        console.log(response)
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.username)
        } else {
          setIsAuthenticated(false);
          setUsername("")
        }
      }
      authToken();
    } catch (err) {
      console.error(err.message)
    }
  }, [])

  return (
    <Fragment>
      <Router>
        <AppBar isAuthenticated={isAuthenticated} setAuth={setAuth} username={username} />
        <div className="top">
          <PathSwitch isAuthenticated={isAuthenticated} setAuth={setAuth} setUsername={setUsername} />
        </div>
        <ToastContainer />
      </Router>
    </Fragment>
  );
}

function PathSwitch(props) {
  let location = useLocation();
  let background = location.state && location.state.background;
  return (
    <Fragment>
      <Switch location={background || location}>
        <Route exact path="/" children={<Home isAuthenticated={props.isAuthenticated} />} />
        <Route path="/game/:id" children={<Play isAuthenticated={props.isAuthenticated} />} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/auth/:id" children={<Modal setAuth={(i) => props.setAuth(i)} setUsername={(i) => props.setUsername(i)} />} />}
    </Fragment>
  )
}



function Home() {

  const [puzzlesCount, setPuzzlesCount] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get("/puzzlescount");
        setPuzzlesCount(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      <h1>Choose puzzle</h1>
      <ul>
        {puzzlesCount.map(index => (
          <li key={index.id}>
            <Link to={`/game/${index.id}`}>puzzle {index.id}</Link>
          </li>)
        )}
      </ul>
    </Fragment>
  );
}

function Play() {
  const id = useParams().id;
  const [puzzle, setPuzzle] = useState([]);
  const [puzzleID, setPuzzleID] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(id, "effect")
        const response = await SudokuPuzzleFinder.get(`/puzzle/${id}`);
        console.log(response.data.puzzle, "effect");
        setPuzzle(response.data.puzzle);
        setPuzzleID(response.data.id);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Fragment>
      {puzzle.length === 81 ? <Game puzzle={puzzle} id={puzzleID} ref={myRef} /> : ""}
    </Fragment>
  );
}

document.addEventListener("mousedown", (event) => {
  var concernedElement = document.querySelector(".game-board");
  var concernedElement2 = document.querySelector(".game-controls")
  if (concernedElement && concernedElement2) {
    if (!concernedElement.contains(event.target) && !concernedElement2.contains(event.target)) {
      myRef.current.deselectSquare();
    }
  }
});
