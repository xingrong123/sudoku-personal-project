import React, { Fragment } from 'react';

import Square from './Square';

import './Board.css';

export default class Board extends React.Component {
  renderSquare(i) {
    var style = { background: "white" };
    if (this.props.selectedSquare === i) {
      style = { background: "Yellow" };
    } else if (this.props.puzzleIndex) {
      style = (this.props.puzzleIndex.includes(i)) ? { background: "LightGray" } : style;
    }
    return (
      <Square
        value={this.props.squares[i]}
        selectedSquare={this.props.selectedSquare}
        style={style}
        key={i}
        onClick={() => this.props.onClick(i)}
        onContextMenu={(e) => this.props.onContextMenu(i, e)}
        onKeyPress={(num) => this.props.onKeyPress(num.key)}
      />
    );
  }

  getBoard() {
    var board = [];
    for (var i = 0; i < 3; i++) {
      var boardRow = [];
      for (var j = 0; j < 3; j++) {
        var area = this.getArea(i, j);
        boardRow.push(<div className="area" key={i*3+j}>{area}</div>);
      }
      board.push(<div className="board-row d-flex justify-content-center" key={i}>{boardRow}</div>);
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
      area.push(<div className="area-row d-flex" key={(i*3+k)*3+j}>{areaRow}</div>);
    }
    return area;
  }

  render() {
    const board = this.getBoard();
    return (
      <Fragment>
        {board}
      </Fragment>
    );
  }
}