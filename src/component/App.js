import React from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Game from './Game';
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
  const puzzles = [
    [9, 2, 6, 8, 7, 1, 5, 4, 3, 8, 5, 1, 3, 4, 9, 6, 2, 7, 4, 7, 3, 2, 5, 6, 1, 9, 8, 6, 8, null, 1, 3, 2, 9, 7, 4, 7, 3, null, 5, 9, 8, 2, 6, 1, 2, null, 9, 7, 6, 4, 8, 3, 5, 3, 4, 2, 9, 1, 5, 7, 8, 6, 1, 9, 7, 6, 8, 3, 4, 5, 2, 5, 6, 8, 4, 2, 7, 3, 1, 9],
    [9, 2, 6, 8, 7, 1, 5, 4, 3, 8, 5, 1, 3, 4, null, 6, 2, 7, 4, 7, 3, 2, 5, 6, 1, 9, 8, 6, 8, null, 1, 3, 2, 9, 7, 4, 7, 3, null, 5, 9, 8, 2, 6, 1, 2, null, 9, 7, 6, 4, 8, 3, 5, 3, 4, 2, 9, 1, 5, 7, 8, 6, 1, 9, 7, null, 8, 3, 4, 5, 2, 5, 6, 8, 4, 2, 7, 3, 1, 9],
  ];

  let links = [];
  for (let i = 0; i < puzzles.length; i++) {
    links.push(
      <li>
        <Link to="/game" onClick={() => selectPuzzle(puzzles[i])}>puzzle {i}</Link>
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
