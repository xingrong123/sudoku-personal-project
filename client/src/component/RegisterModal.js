import React, { useState } from 'react'
import {toast} from "react-toastify";

import AuthApi from '../apis/AuthApi';

export default function RegisterModal(props) {
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
      const response = await AuthApi.post("/register", body);
      console.log(response)
      localStorage.setItem("token", response.data.token)
      props.setAuth(true)
      props.setUsername(body.username)
      toast.dark("Account created!")
      setInputs({
        username: "",
        password: ""
      })
      document.getElementById("closeRegister").click();
    } catch (err) {
      console.error(err.response.data)
      toast.error(err.response.data)
    }
  }


  return (
    <div class="modal fade" id="registerModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Register account</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form onSubmit={onSubmitForm}>
            <div class="modal-body">
              <div class="mb-3 row">
                <label for="username" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" name="username" id="username" onChange={e => onChange(e)} value={username} />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label" >Password</label>
                <div class="col-sm-10">
                  <input type="password" class="form-control" name="password" id="inputPassword" onChange={e => onChange(e)} value={password} />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="closeRegister" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
