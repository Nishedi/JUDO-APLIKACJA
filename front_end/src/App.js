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
import SinglePlayerWeekView from './Trener/PlayersView/SinglePlayerWeekView';
import UserProfileEdition from './Player/UserProfile/UserProfileEdition';
import UserProfile from './Player/UserProfile/UserProfile';
import TrainingView from './Player/TrainingView/TrainingView';
import Notes from './Player/Notes/Notes';
import NotesOpponent from './Player/Notes/NotesOpponent';
import AddNote from './Player/Notes/AddNote';
import SinglePlayerSingleDayView from './Trener/PlayersView/SingleDayView/SinglePlayerSingleDayView';

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
          <Route path = "player/userprofileedition" element = {<UserProfileEdition />} />
          <Route path = "trener/addingactivityfirstpage" element = {<AddiActivityFirstPage />} />
          <Route path = "trener/singleplayerweekview" element = {<SinglePlayerWeekView />} />
          <Route path = "player/userprofile" element = {<UserProfile />} />        
          <Route path = "player/trainingview" element = {<TrainingView />} />
          <Route path = "player/notes" element = {<Notes />} />
          <Route path = "player/notesopponent" element={<NotesOpponent/>} />
          <Route path = "player/addnote" element={<AddNote/>} />
          <Route path = "/trener/singleplayersingleday" element = {<SinglePlayerSingleDayView />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
