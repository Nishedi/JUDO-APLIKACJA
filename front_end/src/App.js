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
import TrenerTrainingView from './Trener/PlayersView/TreningView/TreningView';
import TrenerProfile from './Trener/TrenerProfile/TrenerProfile';
import TrenerProfileEdition from './Trener/TrenerProfile/TrenerProfileEdition';
import PlayerProfile from './Trener/TrenerProfile/PlayerProfile/PlayerProfile';
import PlayerProfileEdition from './Trener/TrenerProfile/PlayerProfile/PlayerProfileEdition';
import AnotherDayView from './Player/WeekView/AnotherDayView';


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
          <Route path = "player/notesopponent/:id_watku" element={<NotesOpponent/>} />
          <Route path = "player/addnote" element={<AddNote/>} />
          <Route path = "/trener/singleplayersingleday" element = {<SinglePlayerSingleDayView />} />
          <Route path = "/trener/trainingview" element = {<TrenerTrainingView />} />
          <Route path = "/player/trainingview/:id" element = {<TrainingView />} />
          <Route path = "/player/dayview/" element = {<DayView />} />
          <Route path = "trener/userprofile" element = {<TrenerProfile />} />
          <Route path = "trener/profileedition" element = {<TrenerProfileEdition />} />
          <Route path = "trener/playerprofile" element = {<PlayerProfile />} />
          <Route path = "trener/playerprofileedition" element = {<PlayerProfileEdition />} />
          <Route path = "player/anotherdayview" element = {<AnotherDayView />} />

        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
