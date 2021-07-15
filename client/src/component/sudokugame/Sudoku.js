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
    difficulty: "",
    avgRating: 0
  }
  const [puzzleDetails, setPuzzleDetails] = useState(initPuzzleDetails)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get(`/puzzle/${id}`);
        const data = response.data.puzzle[0];
        setPuzzleDetails({
          puzzle: data.puzzle,
          id: data.puzzle_id,
          difficulty: data.difficulty,
          avgRating: data.avg_rating
        })
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Fragment>
      {puzzleDetails !== initPuzzleDetails && puzzleDetails.puzzle.length === 81 ?
        <Game puzzleDetails={puzzleDetails} ref={myRef} /> :
        <div className="d-flex justify-content-center" style={{ height: "80vh" }}>
          <div className="my-auto">
            <div className="spinner-border" role="status" />
          </div>
        </div>
      }
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
