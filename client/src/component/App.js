import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Game from './Game';
import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';
import './App.css';

var selectedPuzzle = null;
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
        <Route path="/game" children={<Play />} />
      </Switch>
    </div>
  )
}

function selectPuzzle(puzzle) {
  selectedPuzzle = puzzle;
}

function Home() {

  const [puzzles, setPuzzles] = useState([]);
  // puzzles = [{
  //   id: something,
  //   puzzle: something
  // }]

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get("/api/puzzles");
        console.log(response.data.data)
        setPuzzles(response.data.data);
      } catch (err) {
        console.log(err)
      }
    }
    fetchData();
  }, [])

  let links = [];
  for (let i = 0; i < puzzles.length; i++) {
    links.push(
      <li>
        <Link to="/game" onClick={() => selectPuzzle(puzzles[i].puzzle)}>puzzle {i}</Link>
      </li>
    );
  }
  return (
    <div>
      <h1>Choose puzzle</h1>
      <ul>
        {links}
      </ul>
    </div>
  );
}

function Play() {
  const puzzle = selectedPuzzle ? selectedPuzzle : null;
  return (
    <div>
      <Game puzzle={puzzle} ref={myRef} />
    </div>
  );
}


document.addEventListener("mousedown", (event) => {
  var concernedElement = document.querySelector(".game-board");
  if (concernedElement) {
    if (!concernedElement.contains(event.target)) {
      myRef.current.deselectSquare();
    }
  }
});
