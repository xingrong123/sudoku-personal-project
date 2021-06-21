import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router';

import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import Game from "./Game"

const myRef = React.createRef();

export default function Sudoku() {
  const id = useParams().id;
  const initPuzzleDetails = {
    puzzle: [],
    id: "",
    difficulty: ""
  }
  const [puzzleDetails, setPuzzleDetails] = useState(initPuzzleDetails)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get(`/puzzle/${id}`);
        setPuzzleDetails({
          puzzle: response.data.puzzle,
          id: response.data.puzzle_id,
          difficulty: response.data.difficulty
        })
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Fragment>
      {puzzleDetails !== initPuzzleDetails ? <Game puzzleDetails={puzzleDetails} ref={myRef} /> : ""}
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
