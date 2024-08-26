import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState('Początkowa wartość');
  const [newPlayer, setNewPlayer] = useState(null);
  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable, newPlayer, setNewPlayer }}>
      {children}
    </GlobalContext.Provider>
  );
};
