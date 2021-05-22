import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Game from './Game';
import './App.css';

const myRef = React.createRef();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: null,
    };
  }

  selectPuzzle(puzzle) {
    this.setState({ puzzle: puzzle });
  }


  render() {
    const puzzles = [
      [9, 2, 6, 8, 7, 1, 5, 4, 3, 8, 5, 1, 3, 4, 9, 6, 2, 7, 4, 7, 3, 2, 5, 6, 1, 9, 8, 6, 8, null, 1, 3, 2, 9, 7, 4, 7, 3, null, 5, 9, 8, 2, 6, 1, 2, null, 9, 7, 6, 4, 8, 3, 5, 3, 4, 2, 9, 1, 5, 7, 8, 6, 1, 9, 7, 6, 8, 3, 4, 5, 2, 5, 6, 8, 4, 2, 7, 3, 1, 9],
      [9, 2, 6, 8, 7, 1, 5, 4, 3, 8, 5, 1, 3, 4, null, 6, 2, 7, 4, 7, 3, 2, 5, 6, 1, 9, 8, 6, 8, null, 1, 3, 2, 9, 7, 4, 7, 3, null, 5, 9, 8, 2, 6, 1, 2, null, 9, 7, 6, 4, 8, 3, 5, 3, 4, 2, 9, 1, 5, 7, 8, 6, 1, 9, 7, null, 8, 3, 4, 5, 2, 5, 6, 8, 4, 2, 7, 3, 1, 9],
    ];

    let links = [];
    for (let i = 0; i < puzzles.length; i++) {
      links.push(<li><Link to="/game" onClick={() => this.selectPuzzle(puzzles[i])}>puzzle {i}</Link></li>);
    }
    links = [<ul>{links}</ul>];
    links.push(<Switch><Route path="/game"><Game puzzle={this.state.puzzle} ref={myRef} /></Route></Switch>);
    links = [<Router><div>{links}</div></Router>];

    return (
      <div>
        {links}
      </div>
    );
  }
}


document.addEventListener("mousedown", (event) => {
  var concernedElement = document.querySelector(".game-board");
  if (concernedElement) {
    if (!concernedElement.contains(event.target)) {
      myRef.current.deselectSquare();
    }
  }
});
