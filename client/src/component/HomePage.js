import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';

import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';
import { getUsernameFromTokenAuthencation } from '../logic/Authentication';
import { FilterOffCanvas } from './FilterOffCanvas';

export default function HomePage(props) {
  const [puzzlesCount, setPuzzlesCount] = useState([]);       // puzzle_id, difficulty
  const [puzzleProgress, setPuzzleProgress] = useState(null); // puzzle_id, time_spent, completed
  const initFilterState = {
    easy: true,
    medium: true,
    hard: true,
    expert: true,
    unattempted: true,
    inprogress: true,
    completed: true
  }
  const [filterVariables, setFilterVariables] = useState(initFilterState);

  function filterCheck(puzzle) {
    function getProgress(puzzle) {
      for (let puzzleDetail of puzzleProgress) {
        if (puzzleDetail.puzzle_id === puzzle.puzzle_id) {
          if (puzzleDetail.completed === true) {
            return "completed";
          } else {
            return "inprogress"
          }
        }
      }
      return "unattempted";
    }

    if (filterVariables[puzzle.difficulty] === false) {
      return false;
    }
    if (localStorage.getItem("token") === null || !puzzleProgress) {
      return true;
    }
    if (filterVariables[getProgress(puzzle)])
      return true;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get("/puzzlescount");
        setPuzzlesCount(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    async function fetchDataForUser() {
      try {
        const username = await getUsernameFromTokenAuthencation();
        const body = {
          username: username
        }
        SudokuPuzzleFinder
          .post("/puzzlescount", body)
          .then(res => {
            console.log(res.data.wins);
            setPuzzlesCount(res.data.puzzles);
            setPuzzleProgress(res.data.wins);
          })
          .catch(err => { throw err });
      } catch (error) {
        console.error(error);
        fetchData();
      }
    }
    if (localStorage.getItem("token") !== null) {
      fetchDataForUser();
    } else {
      fetchData();
    }
  }, []);

  const difficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return (<span className="text-success fs-5 font-monospace">easy</span>)
      case "medium":
        return (<span className="text-primary fs-5 font-monospace">medium</span>)
      case "hard":
        return (<span className="text-warning fs-5 font-monospace">hard</span>)
      case "expert":
        return (<span className="text-danger fs-5 font-monospace">expert</span>)
      default:
        console.error("invalid difficulty level");
    }
  }

  const getProgress = (id) => {
    for (const row of puzzleProgress) {
      if (row.puzzle_id === id) {
        if (row.completed === true) {
          return `completed in ${row.time_spent}`;
        } else {
          return `in progress`
        }
      }
    }
    return "unattempted"
  }

  var filterButtonColor = (filterVariables === initFilterState) ? "btn btn-lg text-danger" : "btn btn-lg"

  return (
    <Fragment>
      <h1 className="my-4 text-center">Choose puzzle</h1>
      <div className="text-end">
        <button type="button" className={filterButtonColor} data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilter">
          {(filterVariables === initFilterState) ? "filtered" : ""}
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>
      </div>
      <table className="table table-hover table-bordered align-middle text-center table-fixed">
        <thead>
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Play</th>
            {puzzleProgress !== null ? <th scope="col">Progress</th> : null}
          </tr>
        </thead>
        <tbody>
          {/* 
          for filtering array
          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
           */}
          {puzzlesCount.filter(puzzle => { return filterCheck(puzzle) }).map(
            index => (
              <tr className="table-light" key={index.puzzle_id}>
                <td>{index.puzzle_id}</td>
                <td>{difficultyStyle(index.difficulty)}</td>
                <td><Link to={`/game/${index.puzzle_id}`}><button className='btn btn-secondary'>puzzle {index.puzzle_id}</button></Link></td>
                {puzzleProgress !== null ? <td><span className="font-monospace">{getProgress(index.puzzle_id)}</span></td> : null}
              </tr>
            )
          )}
        </tbody>
      </table>
      <FilterOffCanvas isAuthenticated={props.isAuthenticated} filterVariables={filterVariables} setFilter={(j) => setFilterVariables(j)} />
    </Fragment>
  );
}
