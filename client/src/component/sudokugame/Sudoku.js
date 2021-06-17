import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router';

import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import Game from "./Game"

const myRef = React.createRef();

export default function Sudoku() {
  const id = useParams().id;
  const [puzzle, setPuzzle] = useState([]);
  const [puzzleID, setPuzzleID] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get(`/puzzle/${id}`);
        setPuzzle(response.data.puzzle);
        setPuzzleID(response.data.puzzle_id);
        setDifficulty(response.data.difficulty);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Fragment>
      {puzzle.length === 81 && puzzleID !== "" && difficulty !== "" ? <Game puzzle={puzzle} id={puzzleID} difficulty={difficulty} ref={myRef} /> : ""}
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
