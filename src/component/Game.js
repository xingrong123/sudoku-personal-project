import React from 'react';
import Board from './Board'
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
          return;
        }
      }
      this.setState({ selectedSquare: i })
    }
  
    getMoveDetails(squares, selectedIndex, move) {
      const previousState = squares[selectedIndex];
      const moveDetails = {square: selectedIndex, move: move, previousState: previousState};
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
  
    handleKeyPress(num) {
      if (isNaN(num) || num < 1 || num > 9) {
        return;
      }
      var squares = this.state.squares.slice();
      const move = parseInt(num);
      const moveDetails = this.getMoveDetails(squares, this.state.selectedSquare, move);
      squares[this.state.selectedSquare] = move;
      var history = this.state.history.slice(0, this.state.move + 1);
      this.setState({ squares: squares, history: history.concat(moveDetails), move: this.state.move + 1 });
      if (!squares.includes(null)) {
        this.checkWin(squares);
      }
    }
  
    undo() {
      const history = this.state.history.slice();
      const move = this.state.move;
      const moveDetails = history[move]
      var squares = this.state.squares.slice()
      squares[moveDetails.square] = moveDetails.previousState;
      this.setState({squares: squares, move: move - 1});
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
      this.setState({squares: squares, move: move})
      if (!squares.includes(null)) {
        this.checkWin(squares);
      }
    }
  
    render() {
      const squares = this.state.squares.slice();
      const puzzleIndex = this.state.puzzleIndex ? this.state.puzzleIndex.slice() : null;
      const winState = this.state.win ? "you win!!!" : "";
      const undoState = (this.state.move === 0);
      const redoState = (this.state.move + 1 === this.state.history.length)
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
          </div>
          <br></br>
          <button onClick={() => this.undo()} disabled={undoState}>undo</button>
          <button onClick={() => this.redo()} disabled={redoState}>redo</button>
          <br></br>
          <div className="game-info">
            <div>{winState}</div>
            <ol>{}</ol>
          </div>
        </div>
  
      );
    }
  }