import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent/LoginComponent';
import PlayersView from './Trener/PlayersView/PlayersView';
import AddingPlayerFirstPage from './Trener/AddingPlayer/AddingPlayerFirstPage';
import AddingPlayerSecondPage from './Trener/AddingPlayer/AddingPlayerSecondPage';
import './App.css';
import AddiActivityFirstPage from './Trener/AddingActivity/AddingActivityFirstPage';
import EditingActivity from './Trener/AddingActivity/EditingActivity';
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
import EditNote from './Player/Notes/EditNote';
import SinglePlayerSingleDayView from './Trener/PlayersView/SingleDayView/SinglePlayerSingleDayView';
import TrenerTrainingView from './Trener/PlayersView/TreningView/TreningView';
import TrenerProfile from './Trener/TrenerProfile/TrenerProfile';
import TrenerProfileEdition from './Trener/TrenerProfile/TrenerProfileEdition';
import PlayerProfile from './Trener/TrenerProfile/PlayerProfile/PlayerProfile';
import PlayerProfileEdition from './Trener/TrenerProfile/PlayerProfile/PlayerProfileEdition';
import AnotherDayView from './Player/WeekView/AnotherDayView';
import PlayerPass from './Trener/TrenerProfile/PlayerProfile/PlayerPass';
import CreateTrener from './LoginComponent/CreateTrener';
import ReportError from './ReportSide/ReportError';
import PlayerStats from './Trener/PlayersView/PlayerStats/PlayerStats';
import PlayerNotes from './Trener/PlayersView/Notes/PlayerNotes';
import PlayerNotesOpponent from './Trener/PlayersView/Notes/PlayerNotesOpponent';
import MotionTreningTest from './Test/MotionTreningTest';
import SinglePlayerMonthView from './Trener/PlayersView/SinglePlayerMonthView';
import Smssending from './SmsSide/Sms';

import AddingMultiDayActivity from './Trener/AddingActivity/AddingMultiDayActivity';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<LoginComponent />} />
          <Route path = "trener/playerView" element={<PlayersView />} />
          <Route path = "trener/addingplayerbaseinfo/" element={<AddingPlayerFirstPage />} />
          <Route path = "trener/addingplayerlogininfo/" element={<AddingPlayerSecondPage />} />
          <Route path = "player/weekview/:viewtype" element = {<WeekView />} />
          <Route path = "player/userprofileedition" element = {<UserProfileEdition />} />
          <Route path = "trener/addingactivityfirstpage" element = {<AddiActivityFirstPage />} />
          <Route path = "trener/addingactivityfirstpage/:type" element = {<AddiActivityFirstPage />} />
          <Route path = "trener/editingactivity" element = {<EditingActivity />} />
          <Route path = "trener/singleplayerweekview" element = {<SinglePlayerWeekView />} />
          <Route path = "player/userprofile" element = {<UserProfile />} />        
          <Route path = "player/trainingview" element = {<TrainingView />} />
          <Route path = "player/notes" element = {<Notes />} />
          <Route path = "player/notesopponent/:id_watku" element={<NotesOpponent/>} />
          <Route path = "player/addnote" element={<AddNote/>} />
          <Route path = "player/editnote" element={<EditNote/>} />
          <Route path = "/trener/singleplayersingleday" element = {<SinglePlayerSingleDayView />} />
          <Route path = "/trener/trainingview" element = {<TrenerTrainingView />} />
          <Route path = "/player/trainingview/:id" element = {<TrainingView />} />
          <Route path = "/player/dayview/" element = {<DayView />} />
          <Route path = "trener/userprofile" element = {<TrenerProfile />} />
          <Route path = "trener/profileedition" element = {<TrenerProfileEdition />} />
          <Route path = "trener/playerprofile" element = {<PlayerProfile />} />
          <Route path = "trener/playerprofileedition" element = {<PlayerProfileEdition />} />
          <Route path = "player/anotherdayview" element = {<AnotherDayView />} />
          <Route path = "trener/playerpass" element = {<PlayerPass />} />
          <Route path = "trener/createtrener" element = {<CreateTrener />} />
          <Route path = "/reporterror" element = {<ReportError />} />
          <Route path = 'trener/playerstats' element = {<PlayerStats />} />
          <Route path = 'trener/playernotes' element = {<PlayerNotes />} />
          <Route path = 'trener/playernotesopponent/:id_watku' element = {<PlayerNotesOpponent />} />
          <Route path = 'trener/smssending' element ={<Smssending />}/>
          <Route path = 'trener/playermonthview/:viewtype' element = {<SinglePlayerMonthView />} />
          <Route path = 'trener/addinmultidayactivity' element = {<AddingMultiDayActivity />} />
          <Route path = 'trener/motiontrening' element = {<MotionTreningTest />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
