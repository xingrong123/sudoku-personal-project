import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} onContextMenu={(e) => props.onContextMenu(e)} onKeyPress={props.onKeyPress} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    var style = { background: "white" };
    if (this.props.selectedSquare === i) {
      style = { background: "Yellow" }
    } else if (this.props.puzzleIndex) {
      style = (this.props.puzzleIndex.includes(i)) ? { background: "LightGray" } : style;
    }
    return (
      <Square
        value={this.props.squares[i]}
        selectedSquare={this.props.selectedSquare}
        style={style}
        onClick={() => this.props.onClick(i)}
        onContextMenu={(e) => this.props.onContextMenu(i, e)}
        onKeyPress={(num) => this.props.onKeyPress(num.key)}
      />
    );
  }

  getBoard() {
    var board = [];
    for (var i = 0; i < 3; i++) {
      var boardRow = []
      for (var j = 0; j < 3; j++) {
        var area = this.getArea(i, j);
        boardRow.push(<div className="area">{area}</div>)
      }
      board.push(<div className="board-row">{boardRow}</div>)
    }
    return board;
  }

  getArea(i, j) {
    var area = [];
    for (var k = 0; k < 3; k++) {
      var areaRow = [];
      for (var m = 0; m < 3; m++) {
        const index = (i * 3 + k) * 9 + (j * 3 + m);
        areaRow.push(this.renderSquare(index));
      }
      area.push(<div className="area-row">{areaRow}</div>);
    }
    return area;
  }

  render() {
    const board = this.getBoard();
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.puzzle) {
      this.state = {
        squares: Array(81).fill(null),
        selectedSquare: null,
        puzzleIndex: null,
        win: false,
        history: [{
          square: null,
          move: null,
          previousState: null,
        }],
        move: 0, 
      }
    } else {
      var puzzleIndex = [];
      for (var i = 0; i < 81; i++) {
        if (this.props.puzzle[i]) {
          puzzleIndex = puzzleIndex.concat(i);
        }
      }
      this.state = {
        squares: this.props.puzzle,
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
  }

  render() {
    const squares = this.state.squares.slice();
    const puzzleIndex = this.state.puzzleIndex ? this.state.puzzleIndex.slice() : null;
    const winState = this.state.win ? "you win!!!" : "";
    const undoState = (this.state.move === 0)
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
        <button>redo</button>
        <br></br>
        <div className="game-info">
          <div>{winState}</div>
          <ol>{}</ol>
        </div>
      </div>

    );
  }
}

// ========================================

const puzzle = [9,2,6,8,7,1,5,4,3,8,5,1,3,4,9,6,2,7,4,7,3,2,5,6,1,9,8,6,8,null,1,3,2,9,7,4,7,3,null,5,9,8,2,6,1,2,null,9,7,6,4,8,3,5,3,4,2,9,1,5,7,8,6,1,9,7,6,8,3,4,5,2,5,6,8,4,2,7,3,1,9]
const myRef = React.createRef();

ReactDOM.render(
  <Game puzzle={puzzle} ref={myRef} />,
  document.getElementById('root')
);

const concernedElement = document.querySelector(".game-board");

document.addEventListener("mousedown", (event) => {
  if (!concernedElement.contains(event.target)) {
    myRef.current.deselectSquare();
  }
});