import React, { useContext } from 'react'
import { toast } from "react-toastify";
import AuthApi from '../apis/AuthApi';

import { AppContext } from '../context/AppContext';

export default function LogoutModal() {
  const { setIsAuthenticated, setUsername } = useContext(AppContext)

  function logout() {
    AuthApi
      .delete("/logout")
      .then(() => {
        setUsername("");
        setIsAuthenticated(false);
        window.location.reload();
        toast.dark("Logout!")
      })
      .catch(err => {
        console.error(err)
      })

  }

  return (
    <div className="modal fade" id="logoutModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Logout</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            Are you sure you want to logout?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
