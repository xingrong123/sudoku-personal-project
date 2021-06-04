import React from "react";

import "./GameControls.css"

export default function GameControls(props) {

  const generateGameButton = (i) => {
    return (
      <div className="game-control-button">
        <GameControlButton
          value={i}
          onClick={() => props.onClick(i)}
        />
      </div>
    )
  }

  return (
    <div className="game-controls-space">
      <div className="game-controls">
        <div className="game-controls-row">
          {generateGameButton(1)}
          {generateGameButton(2)}
          {generateGameButton(3)}
        </div>
        <div className="game-controls-row">
          {generateGameButton(4)}
          {generateGameButton(5)}
          {generateGameButton(6)}
        </div>
        <div className="game-controls-row">
          {generateGameButton(7)}
          {generateGameButton(8)}
          {generateGameButton(9)}
        </div>
        <div className="game-controls-row">
          <div className="game-control-button">
            <GameControlButton
              value={"undo"}
              onClick={() => props.onClick("undo")}
              disabled={props.undoState}
            />
          </div>
          <div className="game-control-button">
            <GameControlButton
              value={"redo"}
              onClick={() => props.onClick("redo")}
              disabled={props.redoState}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function GameControlButton(props) {
  return (
    <div>
      <button onClick={props.onClick} disabled={props.disabled}>{props.value}</button>
    </div>
  )
}