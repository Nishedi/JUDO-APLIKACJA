import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState('Początkowa wartość');

  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable }}>
      {children}
    </GlobalContext.Provider>
  );
};
