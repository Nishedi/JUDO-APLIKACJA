import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent/LoginComponent';
import PlayersView from './Trener/PlayersView/PlayersView';
import AddingPlayerFirstPage from './Trener/AddingPlayer/AddingPlayerFirstPage';
import AddingPlayerSecondPage from './Trener/AddingPlayer/AddingPlayerSecondPage';
import './App.css';
import { GlobalProvider } from './GlobalContext'; // Import GlobalProvider
import DayView from './Player/DayView/DayView';
import WeekView from './Player/WeekView/WeekView';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<LoginComponent />} />
          <Route path = "trener/playerView" element={<PlayersView />} />
          <Route path = "trener/addingplayerbaseinfo/" element={<AddingPlayerFirstPage />} />
          <Route path = "trener/addingplayerlogininfo/" element={<AddingPlayerSecondPage />} />
          <Route path = "player/dayview" element = {<DayView />} />
          <Route path = "player/weekview" element = {<WeekView />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
