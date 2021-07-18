import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify';

import SudokuPuzzleFinder from '../../apis/SudokuPuzzleFinder';
import { AppContext } from '../../context/AppContext';

export const CommentBox = (props) => {
  const AccordionId = "collapse" + props.comment.comment_id
  const btnId = "button" + props.comment.comment_id
  const target = "#" + AccordionId

  const { isAuthenticated, setIsAuthenticated, setUsername } = useContext(AppContext)

  const [inputs, setInputs] = useState({
    comment: ""
  });
  const [formIsEmpty, setFormIsEmpty] = useState(false)

  const { comment } = inputs;

  const onChange = (e) => {
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
      reply_to: props.comment.comment_id,
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
            document.getElementById(btnId).click()
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

  const replyCardFormat = "card my-1 text-start" + (props.parentUser ? " ms-5" : "");

  return (
    <div className={replyCardFormat}>
      <h5 className="card-header text-start">{props.comment.username}</h5>
      <div className="card-body">
        <small className="card-title">{props.parentUser ? "reply to " + props.parentUser : ""}</small>
        <h6 className="card-text my-3">{props.comment.comment}</h6>
        <button className="btn" type="button" id={btnId} disabled={!isAuthenticated} data-bs-toggle="collapse" data-bs-target={target} style={{ fontSize: 12, color: "#696969" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z" />
          </svg>
          {isAuthenticated ? "reply" : "login to reply"}
        </button>
      </div>
      <div id={AccordionId} className="accordion-collapse collapse" style={{ backgroundColor: "#A9A9A9" }}>
        <div className="accordion-body">
          <form onSubmit={onSubmitForm}>
            <div className="d-flex flex-row">
              <div className="row flex-fill">
                <div className="col-sm-10">
                  <input type="text" className="form-control" placeholder="reply" name="comment" onChange={e => onChange(e)} value={comment} />
                  <small style={{ color: "red" }} hidden={!formIsEmpty}>Reply must not be blank</small>
                </div>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-primary">Post reply</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}