import React, { Fragment } from 'react';
import { toast } from "react-toastify";

import Board from './Board'
import GameControls from './GameControls';

import "./Game.css";
import AuthApi from '../../apis/AuthApi';
import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';

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
      id: this.props.id,
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
    };
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

  async save() {
    try {
      const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
      if (response.data.isAuthenticated) {
        const username = response.data.username;
        const puzzle_id = this.state.id;
        const moves = this.state.move;
        const squares = this.state.squares.slice();
        const history = JSON.stringify(this.state.history.slice());
        const body = {
          username,
          puzzle_id,
          moves,
          squares,
          history
        };
        try {
          const response2 = await SudokuPuzzleFinder.post("/save", body);
          console.log(response2.data)
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

  async load() {
    try {
      const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
      if (response.data.isAuthenticated) {
        const username = response.data.username;
        const puzzle_id = this.state.id;
        const body = {
          username,
          puzzle_id
        };
        try {
          const response2 = await SudokuPuzzleFinder.post("/load", body);
          const squares = response2.data[0].squares;
          const moves = response2.data[0].moves;
          const history = response2.data[0].history;
          this.setState({history: history, squares: squares, move: moves})
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
        <li key={order} style={{ backgroundColor: moveColor }}>
          {text}
        </li>
      );
    })
    return (
      <Fragment>
        <div className="game">
          <div className="game-board">
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
        <br></br>
        <GameControls onClick={(i) => this.gameControlCLickHandler(i)} undoState={undoState} redoState={redoState} />
        <br></br>
        <div className="game-info">
          <div>{winState}</div>
          <ol>{moveHistory}</ol>
        </div>
      </Fragment>
    );
  }
}