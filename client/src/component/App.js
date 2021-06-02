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
  // const puzzles = [
  //   [9,null,null,null,null,null,null,null,1,null,null,7,8,3,1,6,4,9,6,1,null,5,4,null,8,null,null,null,null,null,1,null,null,null,null,6,7,4,5,null,9,6,2,null,null,null,null,6,null,null,4,7,5,null,3,7,null,4,null,null,9,null,2,4,null,null,null,6,null,null,8,5,5,null,1,null,null,8,null,null,null],
  //   [null,null,9,null,null,1,null,null,null,null,null,null,null,4,9,null,null,null,3,null,null,null,null,null,1,8,null,4,null,7,5,null,8,null,null,6,null,8,null,null,null,2,9,null,7,null,1,null,null,null,null,null,5,null,null,6,5,4,2,null,3,9,null,7,null,1,6,null,null,null,null,5,null,null,null,9,null,null,null,6,null],
  //   [null,null,null,null,null,null,null,4,null,3,null,null,null,null,1,7,2,null,null,5,null,null,null,null,8,null,null,null,null,null,null,null,2,null,null,null,null,null,null,5,6,null,null,null,null,6,null,3,null,null,7,2,null,4,1,3,null,null,8,null,null,7,null,5,9,null,null,3,null,1,null,2,null,null,4,2,null,9,null,null,8],
  // ];

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

  // console.log("puzzles", puzzles2)
  // console.log("number = ", puzzles2.length)

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
