import React, { createContext, useState } from 'react';

export const LoggedContext = createContext();

export const LoggedProvider = ({ children }) => {
  const check = localStorage.getItem('user');
  const [logged, setLogged] = useState(check);

  return (
    <LoggedContext.Provider value={{ logged, setLogged }}>
      {children}
    </LoggedContext.Provider>
  );
};