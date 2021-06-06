import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from 'react-router-dom';

import Game from './sudokugame/Game';
import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';

import './App.css';

const myRef = React.createRef();

export default function App() {
  return (
    <div>
      <Router>
        <PathSwitch />
      </Router>
    </div>
  );
}

function PathSwitch() {
  let location = useLocation();
  let background = location.state && location.state.background;
  return (
    <div>
      <Switch location={background || location}>
        <Route exact path="/" children={<Home />} />
        <Route path="/game/:id" children={<Play />} />
        <Route render={() => <Redirect to={{pathname: "/"}} />} />
      </Switch>
    </div>
  )
}

function Home() {

  const [puzzlesCount, setPuzzlesCount] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get("/api/puzzlescount");
        setPuzzlesCount(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Choose puzzle</h1>
      <ul>
        {puzzlesCount.map(index => (
          <li key={index.id}>
            <Link to={`/game/${index.id}`}>puzzle {index.id}</Link>
          </li>)
        )}
      </ul>
    </div>
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
        const response = await SudokuPuzzleFinder.get(`/api/puzzle/${id}`);
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
    <div>
      {puzzle.length === 81 ? <Game puzzle={puzzle} id={puzzleID} ref={myRef} /> : ""}
    </div>
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
