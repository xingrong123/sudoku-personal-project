import React from 'react';
import ReactDOM from 'react-dom';
import Game from './component/Game'
import './index.css';


const puzzle = [9, 2, 6, 8, 7, 1, 5, 4, 3, 8, 5, 1, 3, 4, 9, 6, 2, 7, 4, 7, 3, 2, 5, 6, 1, 9, 8, 6, 8, null, 1, 3, 2, 9, 7, 4, 7, 3, null, 5, 9, 8, 2, 6, 1, 2, null, 9, 7, 6, 4, 8, 3, 5, 3, 4, 2, 9, 1, 5, 7, 8, 6, 1, 9, 7, 6, 8, 3, 4, 5, 2, 5, 6, 8, 4, 2, 7, 3, 1, 9]
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