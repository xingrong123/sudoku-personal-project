import React, { useState, useContext } from 'react'
import { toast } from "react-toastify";

import AuthApi from '../apis/AuthApi';
import { AppContext } from '../context/AppContext';

export default function LoginModal() {
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });
  const { setIsAuthenticated, setUsername } = useContext(AppContext)

  const { username, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    const body = { username, password };

    AuthApi
      .post("/login", body)
      .then(res => {
        setIsAuthenticated(true);
        console.log(res)
        setUsername(res.headers.username);
        setInputs({
          username: "",
          password: ""
        });
        document.getElementById("closeLogin").click();
        window.location.reload();
        toast.dark("login successfully!");
      })
      .catch(err => {
        console.error(err);
        toast.error(err);
      })
  }


  return (
    <div className="modal fade" id="loginModal" >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Login</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form onSubmit={onSubmitForm}>
            <div className="modal-body">
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="username" onChange={e => onChange(e)} value={username} />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label" >Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" name="password" autoComplete="on" onChange={e => onChange(e)} value={password} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id="closeLogin" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
