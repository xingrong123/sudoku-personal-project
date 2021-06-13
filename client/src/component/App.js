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
import { injectStyle } from "react-toastify/dist/inject-style"

import { AppBar } from './AppBar';
import Game from './sudokugame/Game';
import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';
import Modal from './Modal';

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
    <Router>
      <header className="navbar navbar-expand-md navbar-dark bd-navbar bg-dark">
        <AppBar isAuthenticated={isAuthenticated} setAuth={setAuth} username={username} />
      </header>
      <main>
        <div className="bd-masthead mb-3">
          <div className="container px-4 px-md-3">
            <div className="row align-items-lg-center">
              <MainContent isAuthenticated={isAuthenticated} setAuth={setAuth} setUsername={setUsername} />
            </div>
          </div>
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
        <Route exact path="/" children={<Home isAuthenticated={props.isAuthenticated} />} />
        <Route path="/game/:id" children={<Sudoku isAuthenticated={props.isAuthenticated} />} />
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
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Play</th>
          </tr>
        </thead>
        <tbody>
          {puzzlesCount.map(
            index => (
              <tr className="table-light">
                <td>{index.id}</td>
                <td>{index.difficulty}</td>
                <td><Link to={`/game/${index.id}`}><button className='btn btn-primary'>puzzle {index.id}</button></Link></td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <ul>

      </ul>
    </Fragment>
  );
}

function Sudoku() {
  const id = useParams().id;
  const [puzzle, setPuzzle] = useState([]);
  const [puzzleID, setPuzzleID] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get(`/puzzle/${id}`);
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
      {puzzle.length === 81 && puzzleID !== "" ? <Game puzzle={puzzle} id={puzzleID} ref={myRef} /> : ""}
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
