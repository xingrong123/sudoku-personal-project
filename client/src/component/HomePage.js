import React, {useState, useEffect, Fragment} from 'react'
import { Link } from 'react-router-dom';

import SudokuPuzzleFinder from '../apis/SudokuPuzzleFinder';

export default function HomePage() {
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
  
    const difficultyStyle = (difficulty) => {
      switch (difficulty) {
        case "easy":
          return (<span className="text-success h6">easy</span>)
        case "medium":
          return (<span className="text-primary h6">medium</span>)
        case "hard":
          return (<span className="text-warning h6">hard</span>)
        case "expert":
          return (<span className="text-danger h6">expert</span>)
        default:
          console.error("invalid difficulty level");
      }
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
            </tr>
          </thead>
          <tbody>
            {puzzlesCount.map(
              index => (
                <tr className="table-light" key={index.puzzle_id}>
                  <td>{index.puzzle_id}</td>
                  <td>{difficultyStyle(index.difficulty)}</td>
                  <td><Link to={`/game/${index.puzzle_id}`}><button className='btn btn-secondary'>puzzle {index.puzzle_id}</button></Link></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Fragment>
    );
  }
