import React from 'react';

import Board from './Board'
import GameControls from './GameControls';

import "./Game.css";

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    var puzzleIndex = [];
    if (this.props.puzzle) {
      for (var i = 0; i < 81; i++) {
        if (this.props.puzzle[i]) {
          puzzleIndex = puzzleIndex.concat(i);
        }
      }
    }
    this.state = {
      squares: this.props.puzzle ? this.props.puzzle : Array(81).fill(null),
      selectedSquare: null,
      puzzleIndex: this.props.puzzle ? puzzleIndex : null,
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

  gameControlCLickHandler(value) {
    if (value === "redo") {
      this.redo();
    } else if (value === "undo") {
      this.undo();
    } else if (!isNaN(value)) {
      this.numberHandler(value)
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
        <li style={{ backgroundColor: moveColor }}>
          {text}
        </li>
      );
    })
    return (
      <div>
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
        <div>
          <GameControls onClick={(i) => this.gameControlCLickHandler(i)} undoState={undoState} redoState={redoState} />
        </div>
        {/* <br></br>
        <button onClick={() => this.undo()} disabled={undoState}>undo</button>
        <button onClick={() => this.redo()} disabled={redoState}>redo</button> */}
        <br></br>
        <div className="game-info">
          <div>{winState}</div>
          <ol>{moveHistory}</ol>
        </div>
      </div>
    );
  }
}