import React from 'react'
import {toast} from "react-toastify";

export default function LogoutModal(props) {

  function logout() {
    props.setUsername("");
    props.setAuth(false);
    localStorage.removeItem("token");
    toast.dark("Logout!")
  }

  return (
    <div class="modal fade" id="logoutModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Logout</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to logout?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
