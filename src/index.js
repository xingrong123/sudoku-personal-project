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
    var style = {background: "white"};
    if (this.props.selectedSquare === i) {
      style = {background: "Yellow"}
    } else if (this.props.puzzleIndex) {
      style = (this.props.puzzleIndex.includes(i)) ? {background: "LightGray"} : style;
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
      };
    }
  }

  deselectSquare() {
    this.setState({selectedSquare: null});
  }

  handleClick(i) {
    if (this.state.puzzleIndex) {
      if (this.state.puzzleIndex.includes(i)) {
        return;
      }
    }
    this.setState({selectedSquare: i})
  }

  handleContextMenu(i, e) {
    e.preventDefault();
    if (this.state.puzzleIndex) {
      if (this.state.puzzleIndex.includes(i)) {
        return;
      }
    }
    var squares = this.state.squares.slice();
    squares[i] = null;
    this.setState({squares: squares})
  }

  handleKeyPress(num) {
    if (isNaN(num) || num < 1 || num > 9) {
      return;
    }
    var squares = this.state.squares.slice();
    squares[this.state.selectedSquare] = num;
    this.setState({squares: squares});
  }

  render() {
    const squares = this.state.squares.slice();
    const puzzleIndex = this.state.puzzleIndex ? this.state.puzzleIndex.slice() : null;
    return (
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
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const puzzle = [null,2,null,8,null,null,null,4,3,null,5,null,3,null,9,null,null,null,4,null,null,null,null,null,1,9,null,6,8,null,1,3,2,null,null,null,7,3,null,null,9,8,null,6,null,null,1,9,null,6,4,null,3,null,3,4,null,null,null,null,7,8,6,1,null,7,null,8,null,null,5,null,null,null,8,4,null,7,null,null,9]
const myRef = React.createRef();

ReactDOM.render(
  <Game puzzle={puzzle} ref={myRef}/>,
  document.getElementById('root')
);

const concernedElement = document.querySelector(".game-board");

document.addEventListener("mousedown", (event) => {
  if (!concernedElement.contains(event.target)) {
    myRef.current.deselectSquare();
  }
});