import React, { useState, createContext } from 'react'

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("")

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername }}>
      {props.children}
    </AppContext.Provider>
  )
}
