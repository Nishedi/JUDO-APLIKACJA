import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent/LoginComponent';
import PlayersView from './Trener/PlayersView/PlayersView';
import AddingPlayerFirstPage from './Trener/AddingPlayer/AddingPlayerFirstPage';
import AddingPlayerSecondPage from './Trener/AddingPlayer/AddingPlayerSecondPage';
import './App.css';
import AddiActivityFirstPage from './Trener/AddingActivity/AddingActivityFirstPage';
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
<<<<<<< HEAD
          <Route path = "player/weekview" element = {<WeekView />} />
=======
          <Route path = "trener/addingactivityfirstpage" element = {<AddiActivityFirstPage />} />
          
>>>>>>> 0f81da7f1c2737feb690a8b9085ce28d87c96fb7
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
