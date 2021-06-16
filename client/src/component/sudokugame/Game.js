import React from 'react';
import { toast } from "react-toastify";

import Board from './Board'
import GameControls from './GameControls';

import "./Game.css";
import AuthApi from '../../apis/AuthApi';
import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import { Timer } from './Timer';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    var puzzle = this.props.puzzle.slice();

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
      }
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

  checkWin(squares) {
    var check = [];
    for (let i = 0; i < 9; i++) {
      check.push(squares.slice(i * 9, i * 9 + 9));
    }
    for (let i = 0; i < 9; i++) {
      let array = []
      for (let j = 0; j < 9; j++) {
        array = array.concat(squares[j * 9 + i])
      }
      check.push(array);
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let array = []
        for (let k = 0; k < 3; k++) {
          for (let m = 0; m < 3; m++) {
            const index = (i * 3 + k) * 9 + (j * 3 + m);
            array = array.concat(squares[index]);
          }
        }
        check.push(array);
      }
    }
    for (const one of check) {
      for (let i = 1; i <= 9; i++) {
        if (!one.includes(i)) {
          this.setState({ win: false });
          return;
        }
      }
    }
    this.setState({ win: true });
    //need to stop timer
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
      this.checkWin(squares);
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

  // taken from https://stackoverflow.com/questions/42488048/how-can-i-sum-properties-from-two-objects
  // function below takes as many objects and sums them by key using reduce
  getTimeString(startTime, timeSpent) {
    var time = new Date()
    time.setHours(startTime.hours + timeSpent.hours)
    time.setMinutes(startTime.minutes + timeSpent.minutes)
    time.setSeconds(startTime.seconds + timeSpent.seconds)
    const pad = (n) => {
      return n<10 ? '0'+n : n;
    }
    return pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" +  pad(time.getSeconds())
  }

  async save() {
    try {
      const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
      if (response.data.isAuthenticated) {
        const username = response.data.username;
        const puzzle_id = this.props.id;
        const moves = this.state.move;
        const squares = this.state.squares.slice();
        const history = this.state.history.slice();
        const time_spent = this.getTimeString(this.state.startTime, this.state.time);
        const body = {
          username,
          puzzle_id,
          moves,
          squares,
          history,
          time_spent
        };
        try {
          const response2 = await SudokuPuzzleFinder.post("/save", body);
          toast.success(response2.data)
        } catch (error) {
          console.error(error.response.data)
          toast.error(error.response.data)
        }

      } else {
        console.log(response.data)
        toast.error(response.data)
      }
    } catch (err) {
      console.error(err.response.data)
      toast.error(err.response.data)
    }
  }

  getTimeJson(time) {
    // time input has to be in the format "hh:mm:ss" 
    const timeArray = time.split(":");
    return ({
      hours: parseInt(timeArray[0]),
      minutes: parseInt(timeArray[1]),
      seconds: parseInt(timeArray[2])
    })
  }

  async load() {
    try {
      const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
      if (response.data.isAuthenticated) {
        const username = response.data.username;
        const puzzle_id = isNaN(this.props.id) ? parseInt(this.props.id) : this.props.id;
        const body = {
          username,
          puzzle_id
        };
        try {
          const response2 = await SudokuPuzzleFinder.post("/load", body);
          const squares = response2.data[0].squares;
          const moves = response2.data[0].moves;
          const history = response2.data[0].history;
          const startTime = this.getTimeJson(response2.data[0].time_spent);
          this.setState({ history: history, squares: squares, move: moves, startTime: startTime })
          console.log("load successfully")
          toast.success("load successfully")
        } catch (error) {
          console.error(error.response.data)
          toast.error(error.response.data)
        }
      } else {
        console.log(response.data)
        toast.error(response.data)
      }
    } catch (err) {
      console.error(err.response.data)
      toast.error(err.response.data)
    }
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
      const text = `ROW ${moveDetails.square % 9 + 1} COL ${Math.floor(moveDetails.square / 9) + 1} changes from ${moveDetails.previousState} to ${moveDetails.move}`
      const moveColor = this.state.move === order ? "lightblue" : "";
      return (
        <li key={order} class="list-group-item" style={{ backgroundColor: moveColor }}>
          {text}
        </li>
      );
    })
    return (
      <div className="text-center">
        <div className="container">
          <div className="d-lg-flex justify-content-center">
            <div className="d-md-flex align-items-center text-center ">
              <div className="game m-4">
                <div className="game-board">
                  <h1>Puzzle #{this.props.id}</h1>
                  <p>Difficulty: {this.props.difficulty}</p>
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
              <ol className="list-group list-group-numbered">{moveHistory}</ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}