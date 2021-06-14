import React, { useState } from 'react'
import { toast } from "react-toastify";

import AuthApi from '../apis/AuthApi';

export default function LoginModal(props) {
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });

  const { username, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { username, password };
      const response = await AuthApi.post("/login", body);
      localStorage.setItem("token", response.data.token)
      props.setAuth(true)
      props.setUsername(body.username)
      toast.dark("login successfully!")
      setInputs({
        username: "",
        password: ""
      })
      document.getElementById("closeLogin").click();
    } catch (err) {
      console.error(err.response.data)
      toast.error(err.response.data)
    }
  }


  return (
    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Login</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form onSubmit={onSubmitForm}>
            <div class="modal-body">
              <div class="mb-3 row">
                <label for="username" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" name="username" onChange={e => onChange(e)} value={username} />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label" >Password</label>
                <div class="col-sm-10">
                  <input type="password" class="form-control" name="password" onChange={e => onChange(e)} value={password} />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="closeLogin" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
