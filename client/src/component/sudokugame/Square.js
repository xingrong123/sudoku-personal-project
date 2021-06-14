import './Square.css';

export default function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      onContextMenu={(e) => props.onContextMenu(e)}
      onKeyPress={props.onKeyPress} style={props.style}>
      {props.value}
    </button>
  );
}