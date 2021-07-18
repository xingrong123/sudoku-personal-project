import React, { useState, useContext } from 'react'
import { toast } from "react-toastify";

import AuthApi from '../apis/AuthApi';
import { AppContext } from '../context/AppContext';

export default function RegisterModal() {
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });
  const { setIsAuthenticated, setUsername } = useContext(AppContext)
  const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[!"#$%&'()*+,./:;<=>?@_`{}~-])(?=.*[A-Z])[0-9a-zA-Z!"#$%&'()*+,./:;<=>?@_`{}~-].{8,}$/;

  const { username, password } = inputs;
  const [formIsEmpty, setFormIsEmpty] = useState(false)

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (!password.match(passwordValidation)) {
      setFormIsEmpty(true)
      return
    }
    setFormIsEmpty(false)
    const body = { username, password };
    AuthApi
      .post("/register", body)
      .then(res => {
        setIsAuthenticated(true)
        setUsername(res.headers.username)
        setInputs({
          username: "",
          password: ""
        })
        document.getElementById("closeRegister").click();
        window.location.reload();
        toast.dark("Account created!")
      })
      .catch(err => {
        console.error(err.response.data)
        toast.error(err.response.data)
      });
  }


  return (
    <div className="modal fade" id="registerModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Register account</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form onSubmit={onSubmitForm}>
            <div className="modal-body">
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="username" id="username" onChange={e => onChange(e)} value={username} />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label" >Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" name="password" id="inputPassword" autoComplete="on" onChange={e => onChange(e)} value={password} />
                  <small style={{ color: "red" }} hidden={!formIsEmpty}>Password needs to have at least 8 characters and contains at least one numeric digit, one uppercase and one lowercase letter, and one special character</small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id="closeRegister" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
