import React, { Fragment, useContext, useState } from 'react'
import { toast } from 'react-toastify';

import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import { AppContext } from '../../context/AppContext';

export const CommentForm = (props) => {
  const { isAuthenticated, setIsAuthenticated, setUsername } = useContext(AppContext)

  const [inputs, setInputs] = useState({
    comment: ""
  });

  const [formIsEmpty, setFormIsEmpty] = useState(false)

  const { comment } = inputs;

  const onChange = (e) => {
    if (!isAuthenticated) return
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (comment === "") {
      setFormIsEmpty(true)
      return
    }
    setFormIsEmpty(false)
    const body = {
      puzzle_id: props.puzzle_id,
      reply_to: null,
      comment: comment
    };
    SudokuPuzzleFinder
      .post("/comment", body)
      .then(res => {
        setIsAuthenticated(true);
        setUsername(res.headers.username);
        toast.dark("comment posted!");
        SudokuPuzzleFinder.get(`/puzzle/${props.puzzle_id}`)
          .then(res => {
            props.updateComments(res.data.comments)
          })
          .catch(err => {
            console.error(err.response.data);
            toast.error(err.response.data);
          })
      })
      .catch(err => {
        console.error(err.response.data);
        toast.error(err.response.data);
      })
  }

  const placeholderMessage = isAuthenticated ? "Join the discussion" : "Login to comment"

  return (
    <Fragment>
      <form onSubmit={onSubmitForm}>
        <div className="mb-3 row">
          <div className="col-sm-12">
            <input type="text" className="form-control" name="comment" placeholder={placeholderMessage} onChange={e => onChange(e)} value={comment} />
            <small style={{color:"red"}} hidden={!formIsEmpty}>Comment must not be blank</small>
          </div>
        </div>
        <button type="submit" disabled={!isAuthenticated} className="btn btn-primary m-3">Post</button>
      </form>
    </Fragment>
  )
}
