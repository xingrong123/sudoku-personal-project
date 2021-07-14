import React from 'react';
import { toast } from "react-toastify";

import Board from './Board'
import GameControls from './GameControls';

import "./Game.css";
import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import { Timer } from './Timer';
import { checkWin, getTimeString, getTimeJson } from '../../logic/Sudoku';
import { StarRating } from './StarRating';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    var puzzle = this.props.puzzleDetails.puzzle.slice();

    var puzzleIndex = [];
    if (puzzle) {
      for (var i = 0; i < 81; i++) {
        if (puzzle[i]) {
          puzzleIndex = puzzleIndex.concat(i);
        }
      }
    }

    this.state = {
      squares: puzzle,
      selectedSquare: null,
      puzzleIndex: puzzleIndex,
      win: false,
      history: [{
        square: null,
        move: null,
        previousState: null,
      }],
      move: 0,
      startTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
    };

    this.setTime = this.setTime.bind(this)
  }

  deselectSquare() {
    this.setState({ selectedSquare: null });
  }

  handleClick(i) {
    if (this.state.puzzleIndex) {
      if (this.state.puzzleIndex.includes(i)) {
        this.deselectSquare();
        return;
      }
    }
    this.setState({ selectedSquare: i })
  }

  getMoveDetails(squares, selectedIndex, move) {
    const previousState = squares[selectedIndex];
    const moveDetails = { square: selectedIndex, move: move, previousState: previousState };
    return moveDetails;
  }

  handleContextMenu(i, e) {
    e.preventDefault();
    if (this.state.puzzleIndex) {
      if (this.state.puzzleIndex.includes(i)) {
        return;
      }
    }
    var squares = this.state.squares.slice();
    if (!squares[i]) {
      return;
    }
    const moveDetails = this.getMoveDetails(squares, i, null)
    squares[i] = null;
    var history = this.state.history.slice(0, this.state.move + 1);
    this.setState({ squares: squares, win: false, history: history.concat(moveDetails), move: this.state.move + 1 })
  }

  saveWinDetails() {
    const body = {
      puzzle_id: this.props.puzzleDetails.id,
      time_spent: getTimeString(this.state.startTime, this.state.time)
    }
    SudokuPuzzleFinder
      .post("/win", body)
      .then(res => toast.success(res.data))
      .catch(err => {
        console.error(err.response.data)
        toast.error(err.response.data)
      })
  }

  numberHandler(move) {
    var squares = this.state.squares.slice();
    const moveDetails = this.getMoveDetails(squares, this.state.selectedSquare, move);
    if (this.state.selectedSquare === null || squares[this.state.selectedSquare] === move) {
      return;
    }
    squares[this.state.selectedSquare] = move;
    var history = this.state.history.slice(0, this.state.move + 1);
    this.setState({ squares: squares, history: history.concat(moveDetails), move: this.state.move + 1 });
    if (!squares.includes(null)) {
      const isWin = checkWin(squares);
      if (isWin) {
        if (this.state.win === false) {
          this.saveWinDetails();
          this.setState({ win: true });
        }
      } else {
        this.setState({ win: false });
      }
    }
  }

  handleKeyPress(num) {
    if (isNaN(num) || num < 1 || num > 9) {
      return;
    }
    const move = parseInt(num);
    this.numberHandler(move)
  }

  undo() {
    const history = this.state.history.slice();
    const move = this.state.move;
    const moveDetails = history[move]
    var squares = this.state.squares.slice()
    squares[moveDetails.square] = moveDetails.previousState;
    this.setState({ squares: squares, move: move - 1, win: false });
    if (!squares.includes(null)) {
      this.checkWin(squares);
    }
  }

  redo() {
    const history = this.state.history.slice()
    const move = this.state.move + 1;
    const moveDetails = history[move];
    var squares = this.state.squares.slice()
    squares[moveDetails.square] = moveDetails.move;
    this.setState({ squares: squares, move: move, win: false })
    if (!squares.includes(null)) {
      this.checkWin(squares);
    }
  }

  save() {
    const body = {
      puzzle_id: this.props.puzzleDetails.id,
      moves: this.state.move,
      squares: this.state.squares.slice(),
      history: this.state.history.slice(),
      time_spent: getTimeString(this.state.startTime, this.state.time)
    };
    SudokuPuzzleFinder
      .post("/save", body)
      .then(res => toast.success(res.data))
      .catch(err => {
        console.error(err.response.data)
        toast.error(err.response.data)
      })
  }

  load() {
    const puzzle_id = isNaN(this.props.puzzleDetails.id) ? parseInt(this.props.puzzleDetails.id) : this.props.puzzleDetails.id;
    const body = {
      puzzle_id
    };
    SudokuPuzzleFinder
      .post("/load", body)
      .then(res => {
        const squares = res.data[0].squares;
        const moves = res.data[0].moves;
        const history = res.data[0].history;
        const startTime = getTimeJson(res.data[0].time_spent);
        this.setState({ history: history, squares: squares, move: moves, startTime: startTime })
        console.log("load successfully")
        toast.success("load successfully")
      })
      .catch(err => {
        console.error(err.response.data)
        toast.error(err.response.data)
      })
  }

  gameControlCLickHandler(value) {
    switch (value) {
      case "redo":
        this.redo();
        break;
      case "undo":
        this.undo();
        break;
      case "save":
        this.save();
        break;
      case "load":
        this.load();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        this.numberHandler(value);
        break;
      default:
        // not supposed to happen
        console.error("button press unrecognized: " + value);
    }
  }

  setTime(hrs, mins, secs) {
    const time = {
      hours: hrs,
      minutes: mins,
      seconds: secs
    };
    this.setState({ time: time });
  }

  render() {
    const squares = this.state.squares.slice();
    const puzzleIndex = this.state.puzzleIndex ? this.state.puzzleIndex.slice() : null;
    const winState = this.state.win ? "you win!!!" : "";
    const undoState = (this.state.move === 0);
    const redoState = (this.state.move + 1 === this.state.history.length);
    const history = this.state.history.slice()
    const moveHistory = history.map((moveDetails, order) => {
      if (order === 0) {
        return null;
      }
      const text = order + `. ROW ${moveDetails.square % 9 + 1} COL ${Math.floor(moveDetails.square / 9) + 1} changes from ${moveDetails.previousState} to ${moveDetails.move}`
      const moveColor = this.state.move === order ? "lightblue" : "";
      return (
        <li key={order} className="list-group-item" style={{ backgroundColor: moveColor }}>
          {text}
        </li>
      );
    })
    return (
      <div className="text-center">
        <div className="container">
          <div className="d-lg-flex justify-content-center">
            <div className="d-md-flex text-center ">
              <div className="game m-4">
                <div className="game-board">
                  <h1>Puzzle #{this.props.puzzleDetails.id}</h1>
                  <p>Difficulty: {this.props.puzzleDetails.difficulty}</p>
                  <Board
                    squares={squares}
                    selectedSquare={this.state.selectedSquare}
                    puzzleIndex={puzzleIndex}
                    onClick={(i) => this.handleClick(i)}
                    onContextMenu={(i, e) => this.handleContextMenu(i, e)}
                    onKeyPress={(num) => this.handleKeyPress(num)}
                  />
                </div>
                <br></br>
              </div>
              <GameControls onClick={(i) => this.gameControlCLickHandler(i)} undoState={undoState} redoState={redoState} />
            </div>
            <div className="game-info m-4">
              <div>{winState}</div>
              <h1>History</h1>
              <Timer
                winState={this.state.win}
                time={this.state.time}
                setTime={this.setTime}
                startTime={this.state.startTime}
              />
              <div className="overflow-auto" style={{ height: 400 }}>
                <ol className="list-group text-start">{moveHistory.reverse()}</ol>
              </div>
            </div>
          </div>
          <div className="container">
            <StarRating value={0} puzzle_id={this.props.puzzleDetails.id} />
          </div>
        </div>
      </div>
    );
  }
}