import React, { useState } from 'react'
import {
  useHistory,
  useParams
} from "react-router-dom";
import {toast} from "react-toastify";

import AuthApi from '../apis/AuthApi';

export default function Modal(props) {
  let history = useHistory();
  let { id } = useParams();

  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });

  const { username, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  let back = e => {
    e.stopPropagation();
    history.goBack();
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { username, password };

      const response = await AuthApi.post("/" + id, body);
      localStorage.setItem("token", response.data.token)
      props.setAuth(true)
      props.setUsername(body.username)
      toast.dark("login successfully!")
      history.goBack();
    } catch (err) {
      console.error(err.response.data)
      toast.error(err.response.data)
    }
  }

  const logout = () => {
    props.setUsername("");
    props.setAuth(false);
    localStorage.removeItem("token");
    history.goBack();
    toast.success("logout")
  }

  const form = id === "logout" ? (
    <button className="btn btn-danger btn-block my-3" onClick={logout}>Logout</button>
  ) : (
    <form onSubmit={onSubmitForm}>
      <input type="text" name="username" placeholder="username" className="form-control my-3" onChange={e => onChange(e)} value={username} />
      <input type="password" name="password" placeholder="password" className="form-control my-3" onChange={e => onChange(e)} value={password} />
      <button className="btn btn-success btn-block my-3">Submit</button>
    </form>
  );

  return (
    <div
      onClick={back}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.15)"
      }}
    >
      <div
        style={{
          position: "fixed",
          background: "white",
          top: 90,
          left: "15%",
          right: "15%",
          padding: 15,
          border: "2px solid #444"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center my-3">{id}</h1>
        {form}
        <button className="btn btn-secondary my-3" onClick={back}>
          Close
        </button>
      </div>
    </div>
  );
}