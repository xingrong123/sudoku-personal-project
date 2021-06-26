import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

import "./GameControls.css"

export default function GameControls(props) {

  const generateGameButton = (i) => {
    return (
      <GameControlButton
        value={i}
        onClick={() => props.onClick(i)}
      />
    )
  }

  const { isAuthenticated } = useContext(AppContext);

  return (
    <div className="game-controls m-4">
      <div className="game-controls-row justify-content-center">
        {generateGameButton(1)}
        {generateGameButton(2)}
        {generateGameButton(3)}
      </div>
      <div className="game-controls-row justify-content-center">
        {generateGameButton(4)}
        {generateGameButton(5)}
        {generateGameButton(6)}
      </div>
      <div className="game-controls-row justify-content-center">
        {generateGameButton(7)}
        {generateGameButton(8)}
        {generateGameButton(9)}
      </div>
      <div className="game-controls-row justify-content-center">
        <GameControlButton
          value={"undo"}
          onClick={() => props.onClick("undo")}
          disabled={props.undoState}
        />
        <GameControlButton
          value={"redo"}
          onClick={() => props.onClick("redo")}
          disabled={props.redoState}
        />
      </div>
      <div className="game-controls-row justify-content-center">
        <GameControlButton
          value={"save"}
          onClick={() => props.onClick("save")}
          disabled={!isAuthenticated}
        />
        <GameControlButton
          value={"load"}
          onClick={() => props.onClick("load")}
          disabled={!isAuthenticated}
        />
      </div>
    </div>
  )
}

function GameControlButton(props) {
  return (
    <button
      className="game-control-button"
      onClick={props.onClick}
      disabled={props.disabled}>
      {props.value}
    </button>
  )
}