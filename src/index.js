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
      style = {background: "yellow"}
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
    this.state = {
      squares: Array(81).fill(null), 
      selectedSquare: null,
    }
  }

  handleClick(i) {
    this.setState({selectedSquare: i})
  }

  handleContextMenu(i, e) {
    e.preventDefault();

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
    const squares = this.state.squares;
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={squares} 
            selectedSquare={this.state.selectedSquare}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
