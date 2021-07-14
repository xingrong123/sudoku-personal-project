import React, { Fragment, useContext } from 'react';
import { toast } from "react-toastify";

import { AppContext } from '../../context/AppContext';


export const StarRating = (props) => {
  const [rating, setRating] = React.useState(parseInt(props.value) || 0);
  const [selection, setSelection] = React.useState(0);
  const [selected, setSelected] = React.useState(false);
  const { isAuthenticated } = useContext(AppContext)


  const hoverOver = event => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('data-star-id'))
      val = event.target.getAttribute('data-star-id');
    setSelection(val);
  };

  return (
    <Fragment>
      <div>Rating</div>
      <div
        onMouseOut={() => hoverOver(null)}
        onClick={e => {
          if (!isAuthenticated) {
            toast.warning("login to rate");
            return;
          }
          setRating(e.target.getAttribute('data-star-id') || rating);
          setSelected(true);
        }}
        onMouseOver={isAuthenticated ? hoverOver : null}
      >
        {Array.from({ length: 5 }, (v, i) => (
          <Star
            starId={i + 1}
            key={`star_${i + 1}`}
            marked={selection ? selection >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
      <p>{selected === true ? "you selected " + rating.toString() : ""}</p>
    </Fragment>
  )
}

const Star = ({ marked, starId }) => {
  const styleObj = {
    fontSize: 20,
  }

  return (
    <span data-star-id={starId} className="star" role="button" style={styleObj}>
      {marked ? '\u2605' : '\u2606'}
    </span>
  );
};