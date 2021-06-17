import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';

import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';
import AuthApi from '../apis/AuthApi';

export default function HomePage() {
  const [puzzlesCount, setPuzzlesCount] = useState([]);
  const [puzzleProgress, setPuzzleProgress] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await SudokuPuzzleFinder.get("/puzzlescount");
        setPuzzlesCount(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function fetchDataForUser() {
      try {
        const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
        if (response.data.isAuthenticated) {
          const body = {
            username: response.data.username
          }
          SudokuPuzzleFinder
            .post("/puzzlescount", body)
            .then(res => {
              console.log(res.data.wins)
              setPuzzlesCount(res.data.puzzles);
              setPuzzleProgress(res.data.wins);
            })
            .catch(err => console.error(err.data));
        }

      } catch (error) {
        console.log(error);
      }
    }
    if (localStorage.getItem("token") !== null){
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
        if (row.completed === 1) {
          return `completed in ${row.time_spent}`;
        } else {
          return `in progress`
        }
      }
    }
    return "not attempted"
  }

  return (
    <Fragment>
      <h1 className="my-4 text-center">Choose puzzle</h1>
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
          {puzzlesCount.map(
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
    </Fragment>
  );
}
