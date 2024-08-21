import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent/LoginComponent';
import PlayersView from './Trener/PlayersView/PlayersView';
import './App.css';
import { GlobalProvider } from './GlobalContext'; // Import GlobalProvider

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="trener/playerView" element={<PlayersView />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
